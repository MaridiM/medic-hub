import * as QRCode from 'qrcode'

import type { I18nService, Language } from '@/core/i18n'
import type { PrismaService } from '@/core/prisma'
import type { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import type { User } from '@prisma/__generated__'

import {
	CODE_REUSE_WINDOW,
	MAX_ATTEMPTS,
	RATE_LIMIT_WINDOW,
	REDIS_KEY_PREFIX,
	type TempSecretCache,
	TOTP_AUDIT_ACTIONS,
} from '../constants'
import type { DisableTotpInput, EnableTotpInput } from '../dtos'
import { TotpService } from '../totp.service'
import { CryptoUtil } from '../utils/crypto.util'

jest.mock('qrcode', () => ({
	toDataURL: jest.fn(),
}))

type JsonRecord = Record<string, unknown>
type AsyncMock<Args extends unknown[] = [], Result = unknown> = jest.Mock<Promise<Result>, Args>
// type SyncMock<Args extends unknown[] = [], Result = unknown> = jest.Mock<Result, Args>

type TransactionMocks = {
	user: {
		update: AsyncMock<[JsonRecord], JsonRecord | void>
	}
	backupCode: {
		createMany: AsyncMock<[JsonRecord], JsonRecord | void>
		deleteMany: AsyncMock<[JsonRecord], JsonRecord | void>
	}
	auditLog: {
		create: AsyncMock<[JsonRecord], JsonRecord | void>
	}
}

interface PrismaMock {
	$transaction: AsyncMock<[(tx: TransactionMocks) => Promise<JsonRecord | void>], JsonRecord | void>
	user: {
		update: AsyncMock<[JsonRecord], JsonRecord | void>
	}
	backupCode: {
		createMany: AsyncMock<[JsonRecord], JsonRecord | void>
		deleteMany: AsyncMock<[JsonRecord], JsonRecord | void>
		findMany: AsyncMock<[JsonRecord], Array<JsonRecord>>
		update: AsyncMock<[JsonRecord], JsonRecord | null>
		count: AsyncMock<[JsonRecord], number>
	}
	auditLog: {
		create: AsyncMock<[JsonRecord], JsonRecord | void>
	}
}

interface RedisMock {
	setJSON: AsyncMock<[string, TempSecretCache, number?], void>
	getJSON: AsyncMock<[string], TempSecretCache | null>
	set: AsyncMock<[string, string, number?], void>
	get: AsyncMock<[string], string | null>
	del: AsyncMock<[string], number>
	exists: AsyncMock<[string], boolean>
	ttl: AsyncMock<[string], number>
	incrWithExpire: AsyncMock<[string, number], number>
	incr: AsyncMock<[string], number>
}

const createPrismaMock = () => {
	const txMocks: TransactionMocks = {
		user: { update: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>() },
		backupCode: {
			createMany: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>(),
			deleteMany: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>(),
		},
		auditLog: { create: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>() },
	}

	const transactionMock = jest
		.fn<
			Promise<JsonRecord | void>,
			[(tx: TransactionMocks) => Promise<JsonRecord | void>]
		>(callback => callback(txMocks))
		.mockName('$transaction')

	const prisma: PrismaMock = {
		$transaction: transactionMock,
		user: {
			update: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>(),
		},
		backupCode: {
			createMany: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>(),
			deleteMany: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>(),
			findMany: jest.fn<Promise<Array<JsonRecord>>, [JsonRecord]>(),
			update: jest.fn<Promise<JsonRecord | null>, [JsonRecord]>(),
			count: jest.fn<Promise<number>, [JsonRecord]>(),
		},
		auditLog: {
			create: jest.fn<Promise<JsonRecord | void>, [JsonRecord]>(),
		},
	}

	return { prisma, txMocks }
}

const createRedisMock = (): RedisMock => ({
	setJSON: jest.fn<Promise<void>, [string, TempSecretCache, number?]>(),
	getJSON: jest.fn<Promise<TempSecretCache | null>, [string]>(),
	set: jest.fn<Promise<void>, [string, string, number?]>(),
	get: jest.fn<Promise<string | null>, [string]>(),
	del: jest.fn<Promise<number>, [string]>(),
	exists: jest.fn<Promise<boolean>, [string]>(),
	ttl: jest.fn<Promise<number>, [string]>(),
	incrWithExpire: jest.fn<Promise<number>, [string, number]>(),
	incr: jest.fn<Promise<number>, [string]>(),
})

const createUser = (overrides: Partial<User> = {}): User =>
	({
		id: 'user-1',
		email: 'user@example.com',
		isTotpEnabled: false,
		password: 'password',
		totpSecret: null,
		...overrides,
	}) as User

type PrivateTotpService = {
	generateSecret(): string
	createTOTP(email: string, secret: string): { toString(): string }
	validateCode(email: string, secret: string, code: string): Promise<boolean>
	generateBackupCodes(): string[]
}

const mockedQRCode = QRCode as jest.Mocked<typeof QRCode>

describe('TotpService', () => {
	let prismaWrapper: ReturnType<typeof createPrismaMock>
	let prisma: PrismaMock
	let redis: RedisMock
	let service: TotpService
	let privateService: PrivateTotpService
	let language: Language
	let i18n: Pick<I18nService, 't'>
	const translate = ((key: string) => key) as I18nService['t']

	let encryptSpy: jest.SpyInstance<string, [string]>
	let decryptSpy: jest.SpyInstance<string, [string]>
	let hashSpy: jest.SpyInstance<Promise<string>, [string]>
	let verifySpy: jest.SpyInstance<Promise<boolean>, [string, string]>

	beforeAll(() => {
		process.env.TOTP_ENCRYPTION_KEY = 'a'.repeat(64)
		encryptSpy = jest.spyOn(CryptoUtil, 'encrypt')
		decryptSpy = jest.spyOn(CryptoUtil, 'decrypt')
		hashSpy = jest.spyOn(HashUtil, 'hash')
		verifySpy = jest.spyOn(HashUtil, 'verify')
	})

	beforeEach(() => {
		prismaWrapper = createPrismaMock()
		prisma = prismaWrapper.prisma
		redis = createRedisMock()
		i18n = { t: translate }

		language = 'en' as Language
		service = new TotpService(
			i18n as unknown as I18nService,
			prisma as unknown as PrismaService,
			redis as unknown as RedisService,
		)
		privateService = service as unknown as PrivateTotpService

		encryptSpy.mockReset().mockReturnValue('encrypted-secret')
		decryptSpy.mockReset().mockReturnValue('decrypted-secret')
		hashSpy.mockReset()
		hashSpy.mockImplementation((value: string) => Promise.resolve(`hashed-${value}`))
		verifySpy.mockReset().mockResolvedValue(true)
		mockedQRCode.toDataURL.mockReset()
		mockedQRCode.toDataURL.mockImplementation(() => 'qr-code-data')

		redis.get.mockResolvedValue(null)
		redis.getJSON.mockResolvedValue(null)
		redis.exists.mockResolvedValue(false)
		redis.ttl.mockResolvedValue(60)
		redis.incrWithExpire.mockResolvedValue(1)
		redis.incr.mockResolvedValue(1)
		redis.del.mockResolvedValue(1)
		redis.set.mockResolvedValue(undefined)
		redis.setJSON.mockResolvedValue(undefined)
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	it('generates a TOTP secret and stores it in Redis', async () => {
		const user = createUser()
		const secret = 'SECRET123'

		const generateSecretSpy = jest.spyOn(privateService, 'generateSecret').mockReturnValue(secret)
		const totpMock = { toString: () => 'otpauth://totp' }
		const createTotpSpy = jest.spyOn(privateService, 'createTOTP').mockReturnValue(totpMock)

		const result = await service.generate(user, language)

		expect(createTotpSpy).toHaveBeenCalledWith(user.email, secret)
		expect(mockedQRCode.toDataURL).toHaveBeenCalledWith('otpauth://totp', expect.any(Object))
		expect(redis.setJSON).toHaveBeenCalledWith(REDIS_KEY_PREFIX.TEMP_SECRET(user.id), { secret }, 600)
		expect(result).toEqual({
			qrCodeUrl: 'qr-code-data',
			manualEntryKey: secret,
			issuer: expect.any(String),
			accountName: user.email,
		})

		generateSecretSpy.mockRestore()
		createTotpSpy.mockRestore()
	})

	it('throws when TOTP is already enabled while generating a secret', async () => {
		const user = createUser({ isTotpEnabled: true })

		await expect(service.generate(user, language)).rejects.toBeInstanceOf(BadRequestException)
		expect(redis.setJSON).not.toHaveBeenCalled()
	})

	it('enables TOTP when code is valid', async () => {
		const user = createUser()
		const input = { secret: 'SECRET', code: '123456' } as EnableTotpInput
		const tempKey = REDIS_KEY_PREFIX.TEMP_SECRET(user.id)
		redis.getJSON.mockResolvedValue({ secret: input.secret })

		const validateSpy = jest.spyOn(privateService, 'validateCode').mockResolvedValue(true)
		const backupCodes = ['CODE1', 'CODE2']
		const backupSpy = jest.spyOn(privateService, 'generateBackupCodes').mockReturnValue(backupCodes)

		const result = await service.enable(user, input, language)

		expect(redis.del).toHaveBeenCalledWith(tempKey)
		expect(redis.del).toHaveBeenCalledWith(REDIS_KEY_PREFIX.RATE_LIMIT(user.id, 'enable'))
		expect(prisma.$transaction).toHaveBeenCalledTimes(1)
		expect(prismaWrapper.txMocks.user.update).toHaveBeenCalledWith({
			where: { id: user.id },
			data: { isTotpEnabled: true, totpSecret: 'encrypted-secret' },
		})
		expect(prismaWrapper.txMocks.backupCode.createMany).toHaveBeenCalledWith({
			data: backupCodes.map(code => ({
				userId: user.id,
				type: expect.any(String),
				code: `hashed-${code}`,
			})),
		})
		expect(prismaWrapper.txMocks.auditLog.create).toHaveBeenCalled()
		expect(result).toEqual({
			success: true,
			backupCodes,
			message: 'auth.errors.totp.backup_codes_warning',
		})
		expect(validateSpy).toHaveBeenCalledWith(user.email, input.secret, input.code)

		validateSpy.mockRestore()
		backupSpy.mockRestore()
	})

	it('increments rate limit and rejects invalid enable code', async () => {
		const user = createUser()
		const input = { secret: 'SECRET', code: '000000' } as EnableTotpInput
		redis.getJSON.mockResolvedValue({ secret: input.secret })

		const validateSpy = jest.spyOn(privateService, 'validateCode').mockResolvedValue(false)

		await expect(service.enable(user, input, language)).rejects.toBeInstanceOf(BadRequestException)

		const rateKey = REDIS_KEY_PREFIX.RATE_LIMIT(user.id, 'enable')
		expect(redis.incrWithExpire).toHaveBeenCalledWith(rateKey, RATE_LIMIT_WINDOW)
		expect(prisma.$transaction).not.toHaveBeenCalled()

		validateSpy.mockRestore()
	})

	it('throws when cached secret is missing during enable', async () => {
		const user = createUser()
		const input = { secret: 'SECRET', code: '123456' } as EnableTotpInput
		redis.getJSON.mockResolvedValue(null)

		await expect(service.enable(user, input, language)).rejects.toBeInstanceOf(BadRequestException)
		expect(redis.incrWithExpire).not.toHaveBeenCalled()
	})

	it('disables TOTP when password and code are valid', async () => {
		const user = createUser({ isTotpEnabled: true, totpSecret: 'stored-secret' })
		const input = { password: 'password', code: '123456' } as DisableTotpInput

		const validateSpy = jest.spyOn(privateService, 'validateCode').mockResolvedValue(true)

		const result = await service.disable(user, input, language)

		expect(result).toBe(true)
		expect(decryptSpy).toHaveBeenCalledWith('stored-secret')
		expect(prisma.$transaction).toHaveBeenCalled()
		expect(prismaWrapper.txMocks.backupCode.deleteMany).toHaveBeenCalledWith({
			where: {
				userId: user.id,
				type: expect.any(String),
			},
		})
		expect(redis.del).toHaveBeenCalledWith(REDIS_KEY_PREFIX.RATE_LIMIT(user.id, 'disable'))

		validateSpy.mockRestore()
	})

	it('rejects disable when password verification fails', async () => {
		const user = createUser({ isTotpEnabled: true, totpSecret: 'stored-secret' })
		const input = { password: 'invalid', code: '123456' } as DisableTotpInput

		verifySpy.mockResolvedValueOnce(false)

		await expect(service.disable(user, input, language)).rejects.toBeInstanceOf(UnauthorizedException)

		const rateKey = REDIS_KEY_PREFIX.RATE_LIMIT(user.id, 'disable')
		expect(redis.incrWithExpire).toHaveBeenCalledWith(rateKey, RATE_LIMIT_WINDOW)
		expect(decryptSpy).not.toHaveBeenCalled()
	})

	it('verifies TOTP code successfully', async () => {
		const user = createUser({ isTotpEnabled: true, totpSecret: 'stored-secret' })
		const code = '654321'

		const validateSpy = jest.spyOn(privateService, 'validateCode').mockResolvedValue(true)

		const result = await service.verify(user, code, language)

		expect(result).toBe(true)
		expect(redis.set).toHaveBeenCalledWith(REDIS_KEY_PREFIX.USED_CODE(user.id, code), '1', CODE_REUSE_WINDOW)
		expect(redis.del).toHaveBeenCalledWith(REDIS_KEY_PREFIX.RATE_LIMIT(user.id, 'verify'))
		expect(prisma.auditLog.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					action: TOTP_AUDIT_ACTIONS.VERIFIED,
					userId: user.id,
				}),
			}),
		)

		validateSpy.mockRestore()
	})

	it('verifies using a backup code when TOTP fails', async () => {
		const user = createUser({ isTotpEnabled: true, totpSecret: 'stored-secret' })
		const code = 'BACKUP1'

		const validateSpy = jest.spyOn(privateService, 'validateCode').mockResolvedValue(false)
		prisma.backupCode.findMany.mockResolvedValue([{ id: 'code-1', code: 'hashed-BACKUP1' }])
		prisma.backupCode.update.mockResolvedValue(null)
		verifySpy.mockImplementation((hash: string, value: string) =>
			Promise.resolve(hash === 'hashed-BACKUP1' && value === 'BACKUP1'),
		)

		const result = await service.verify(user, code, language)

		expect(result).toBe(true)
		expect(prisma.backupCode.update).toHaveBeenCalledWith({
			where: { id: 'code-1' },
			data: { usedAt: expect.any(Date) },
		})
		expect(prisma.auditLog.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					action: TOTP_AUDIT_ACTIONS.BACKUP_CODE_VERIFIED,
					userId: user.id,
				}),
			}),
		)
		expect(redis.set).not.toHaveBeenCalled()

		validateSpy.mockRestore()
	})

	it('increments rate limit when verification fails', async () => {
		const user = createUser({ isTotpEnabled: true, totpSecret: 'stored-secret' })
		const code = '000000'

		const validateSpy = jest.spyOn(privateService, 'validateCode').mockResolvedValue(false)
		prisma.backupCode.findMany.mockResolvedValue([])

		await expect(service.verify(user, code, language)).rejects.toBeInstanceOf(BadRequestException)

		const rateKey = REDIS_KEY_PREFIX.RATE_LIMIT(user.id, 'verify')
		expect(redis.incrWithExpire).toHaveBeenCalledWith(rateKey, RATE_LIMIT_WINDOW)
		expect(prisma.auditLog.create).not.toHaveBeenCalled()

		validateSpy.mockRestore()
	})

	it('rejects reused codes during verification', async () => {
		const user = createUser({ isTotpEnabled: true, totpSecret: 'stored-secret' })
		const code = '123456'

		redis.exists.mockResolvedValueOnce(true)

		await expect(service.verify(user, code, language)).rejects.toBeInstanceOf(BadRequestException)

		const rateKey = REDIS_KEY_PREFIX.RATE_LIMIT(user.id, 'verify')
		expect(redis.incrWithExpire).toHaveBeenCalledWith(rateKey, RATE_LIMIT_WINDOW)
	})

	it('returns backup codes status', async () => {
		const user = createUser({ isTotpEnabled: true })
		prisma.backupCode.count.mockResolvedValueOnce(10)
		prisma.backupCode.count.mockResolvedValueOnce(3)

		const status = await service.getBackupCodesStatus(user, language)

		expect(status).toEqual({
			total: 10,
			remaining: 7,
			used: 3,
		})
		expect(prisma.backupCode.count).toHaveBeenCalledTimes(2)
	})

	it('regenerates backup codes with valid password', async () => {
		const user = createUser({ isTotpEnabled: true })
		const backupCodes = ['CODE1', 'CODE2', 'CODE3']
		verifySpy.mockResolvedValue(true)

		const backupSpy = jest.spyOn(privateService, 'generateBackupCodes').mockReturnValue(backupCodes)

		const response = await service.regenerateBackupCodes(user, 'password', language)

		expect(prisma.$transaction).toHaveBeenCalled()
		expect(prismaWrapper.txMocks.backupCode.deleteMany).toHaveBeenCalledWith({
			where: { userId: user.id, type: expect.any(String) },
		})
		expect(response).toEqual({
			success: true,
			backupCodes,
			message: 'auth.errors.totp.backup_codes_warning',
		})

		backupSpy.mockRestore()
	})

	it('throws when rate limit is exceeded', async () => {
		const user = createUser()
		redis.get.mockResolvedValueOnce(`${MAX_ATTEMPTS}`)
		redis.ttl.mockResolvedValueOnce(120)

		await expect(service.generate(user, language)).rejects.toBeInstanceOf(BadRequestException)
	})
})
