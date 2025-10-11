import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'
import 'reflect-metadata'

import { APP_NAME } from '@/core/config'
import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils/hash.util'
import type { User } from '@prisma/__generated__'

import { RATE_LIMIT_ACTIONS, TOTP_ALGORITHM, TOTP_DIGITS, TOTP_PERIOD, TOTP_SECRET_LENGTH } from '../constants'
import { TotpResolver } from '../totp.resolver'
import { TotpService } from '../totp.service'

jest.mock('qrcode', () => ({
	toDataURL: jest.fn(),
}))

type PrismaTransactionClient = {
	user: {
		update: jest.Mock
	}
	backupCode: {
		createMany: jest.Mock
	}
	auditLog: {
		create: jest.Mock
	}
}

interface PrismaMock {
	$transaction: jest.Mock<Promise<unknown>, [(client: PrismaTransactionClient) => Promise<unknown>]>
	user: {
		update: jest.Mock
	}
	backupCode: {
		findMany: jest.Mock
		count: jest.Mock
		update: jest.Mock
		deleteMany: jest.Mock
		createMany: jest.Mock
	}
	auditLog: {
		create: jest.Mock
	}
}

interface RedisMock {
	setJSON: jest.Mock
	getJSON: jest.Mock
	del: jest.Mock
	exists: jest.Mock
	ttl: jest.Mock
	get: jest.Mock
	incrWithExpire: jest.Mock
	incr: jest.Mock
	set: jest.Mock
}

describe('TotpResolver integration', () => {
	const mockedQRCode = QRCode as jest.Mocked<typeof QRCode>
	let i18nMock: Pick<I18nService, 't'>
	let prismaMock: PrismaMock
	let redisMock: RedisMock
	let transactionClient: PrismaTransactionClient
	let service: TotpService
	let resolver: TotpResolver
	const now = new Date('2025-01-01T00:00:00Z')

	const createUser = (overrides: Partial<User> = {}): User =>
		({
			id: 'user-1',
			email: 'user@example.com',
			password: 'password',
			isTotpEnabled: false,
			totpSecret: null,
			...overrides,
		}) as unknown as User

	beforeAll(() => {
		process.env.TOTP_ENCRYPTION_KEY = 'a'.repeat(64)
	})

	beforeEach(() => {
		jest.useFakeTimers().setSystemTime(now)

		const translate = ((key: string) => key) as unknown as I18nService['t']
		i18nMock = { t: translate }

		transactionClient = {
			user: { update: jest.fn().mockResolvedValue({ id: 'user-1' }) },
			backupCode: { createMany: jest.fn().mockResolvedValue(undefined) },
			auditLog: { create: jest.fn().mockResolvedValue(undefined) },
		}

		prismaMock = {
			$transaction: jest.fn(async callback => callback(transactionClient)),
			user: { update: jest.fn() },
			backupCode: {
				findMany: jest.fn().mockResolvedValue([]),
				count: jest.fn().mockResolvedValue(0),
				update: jest.fn(),
				deleteMany: jest.fn(),
				createMany: jest.fn(),
			},
			auditLog: {
				create: jest.fn().mockResolvedValue(undefined),
			},
		}

		redisMock = {
			setJSON: jest.fn().mockResolvedValue(undefined),
			getJSON: jest.fn().mockResolvedValue(null),
			del: jest.fn().mockResolvedValue(1),
			exists: jest.fn().mockResolvedValue(false),
			ttl: jest.fn().mockResolvedValue(60),
			get: jest.fn().mockResolvedValue(null),
			incrWithExpire: jest.fn().mockResolvedValue(1),
			incr: jest.fn().mockResolvedValue(1),
			set: jest.fn().mockResolvedValue(undefined),
		}

		const hashMockFn = jest.spyOn(HashUtil, 'hash') as jest.MockedFunction<typeof HashUtil.hash>
		hashMockFn.mockImplementation(async value => Promise.resolve(`hashed-${value}`))
		const verifyMockFn = jest.spyOn(HashUtil, 'verify') as jest.MockedFunction<typeof HashUtil.verify>
		verifyMockFn.mockImplementation(async (hash, value) => Promise.resolve(hash === `hashed-${value}`))

		mockedQRCode.toDataURL.mockReset()
		mockedQRCode.toDataURL.mockImplementation(() => 'qr-code')

		service = new TotpService(
			i18nMock as unknown as I18nService,
			prismaMock as unknown as PrismaService,
			redisMock as unknown as RedisService,
		)
		resolver = new TotpResolver(service)
	})

	afterEach(() => {
		jest.useRealTimers()
		jest.restoreAllMocks()
	})

	it('generates TOTP secret and stores it temporarily', async () => {
		const user = createUser()

		const result = await resolver.generate(user, 'en' as Language)

		expect(result.manualEntryKey).toHaveLength(TOTP_SECRET_LENGTH)
		expect(result.qrCodeUrl).toBe('qr-code')
		expect(redisMock.setJSON).toHaveBeenCalledWith(
			`totp:temp:${user.id}`,
			{ secret: result.manualEntryKey },
			expect.any(Number),
		)
	})

	it('enables and verifies TOTP end-to-end', async () => {
		const user = createUser()

		const generateResult = await resolver.generate(user, 'en' as Language)
		const secret = generateResult.manualEntryKey

		redisMock.getJSON.mockResolvedValueOnce({ secret })

		const totp = new TOTP({
			issuer: APP_NAME,
			label: user.email,
			algorithm: TOTP_ALGORITHM,
			digits: TOTP_DIGITS,
			period: TOTP_PERIOD,
			secret,
		})
		const code = totp.generate()

		const enableResult = await resolver.enable(user, { secret, code }, 'en' as Language)

		expect(enableResult.success).toBe(true)
		expect(enableResult.backupCodes).toHaveLength(10)
		expect(transactionClient.user.update).toHaveBeenCalledWith({
			where: { id: user.id },
			data: { isTotpEnabled: true, totpSecret: expect.any(String) },
		})
		expect(transactionClient.backupCode.createMany).toHaveBeenCalledWith({
			data: expect.arrayContaining([
				expect.objectContaining({
					userId: user.id,
					code: expect.stringMatching(/^hashed-/),
				}),
			]),
		})
		expect(redisMock.del).toHaveBeenCalledWith(`totp:temp:${user.id}`)
		expect(redisMock.del).toHaveBeenCalledWith(`totp:rate:${user.id}:${RATE_LIMIT_ACTIONS.ENABLE}`)

		const encryptedSecret = transactionClient.user.update.mock.calls[0][0].data.totpSecret as string
		const enabledUser = createUser({ isTotpEnabled: true, totpSecret: encryptedSecret })

		prismaMock.auditLog.create.mockResolvedValue(undefined)

		const verifyResult = await resolver.verify(enabledUser, { code }, 'en' as Language)

		expect(verifyResult).toBe(true)
		expect(redisMock.set).toHaveBeenCalledWith(`totp:used:${enabledUser.id}:${code}`, '1', expect.any(Number))
		expect(prismaMock.auditLog.create).toHaveBeenCalled()
		expect(redisMock.del).toHaveBeenCalledWith(`totp:rate:${enabledUser.id}:${RATE_LIMIT_ACTIONS.VERIFY}`)
	})
})
