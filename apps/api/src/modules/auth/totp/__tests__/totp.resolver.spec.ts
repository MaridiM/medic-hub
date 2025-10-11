import 'reflect-metadata'

import type { Language } from '@/core/i18n'
import type { User } from '@prisma/__generated__'

import { MAX_ATTEMPTS, RATE_LIMIT_ACTIONS, RATE_LIMIT_WINDOW } from '../constants'
import type { DisableTotpInput, EnableTotpInput, VerifyTotpInput } from '../dtos'
import { TOTP_RATE_LIMIT } from '../guards/totp-rate-limit.guard'
import type { BackupCodesStatusModel, TotpEnabledModel, TotpModel } from '../models'
import { TotpResolver } from '../totp.resolver'
import type { TotpService } from '../totp.service'

type TotpRateLimitMetadata = {
	action: (typeof RATE_LIMIT_ACTIONS)[keyof typeof RATE_LIMIT_ACTIONS]
	maxAttempts: number
	windowMs: number
}

interface TotpServiceMock {
	generate: jest.Mock<Promise<TotpModel>, [User, Language]>
	enable: jest.Mock<Promise<TotpEnabledModel>, [User, EnableTotpInput, Language]>
	disable: jest.Mock<Promise<boolean>, [User, DisableTotpInput, Language]>
	verify: jest.Mock<Promise<boolean>, [User, string, Language]>
	getBackupCodesStatus: jest.Mock<Promise<BackupCodesStatusModel>, [User, Language]>
	regenerateBackupCodes: jest.Mock<Promise<TotpEnabledModel>, [User, string, Language]>
}

describe('TotpResolver', () => {
	const service: TotpServiceMock = {
		generate: jest.fn<Promise<TotpModel>, [User, Language]>(),
		enable: jest.fn<Promise<TotpEnabledModel>, [User, EnableTotpInput, Language]>(),
		disable: jest.fn<Promise<boolean>, [User, DisableTotpInput, Language]>(),
		verify: jest.fn<Promise<boolean>, [User, string, Language]>(),
		getBackupCodesStatus: jest.fn<Promise<BackupCodesStatusModel>, [User, Language]>(),
		regenerateBackupCodes: jest.fn<Promise<TotpEnabledModel>, [User, string, Language]>(),
	}

	const resolver = new TotpResolver(service as unknown as TotpService)
	const user = { id: 'user-1' } as User
	const lng = 'en' as Language

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('delegates generate to the service', async () => {
		const expected: TotpModel = {
			qrCodeUrl: 'data',
			manualEntryKey: 'secret',
			issuer: 'Medic Hub',
			accountName: 'user@example.com',
		}
		service.generate.mockResolvedValue(expected)

		await expect(resolver.generate(user, lng)).resolves.toBe(expected)
		expect(service.generate).toHaveBeenCalledWith(user, lng)
	})

	it('delegates enable to the service', async () => {
		const input = { secret: 'SECRET', code: '123456' } as EnableTotpInput
		const expected: TotpEnabledModel = { success: true, backupCodes: ['A'], message: 'msg' }
		service.enable.mockResolvedValue(expected)

		await expect(resolver.enable(user, input, lng)).resolves.toBe(expected)
		expect(service.enable).toHaveBeenCalledWith(user, input, lng)
	})

	it('delegates disable to the service', async () => {
		const input = { password: 'pass', code: '654321' } as DisableTotpInput
		service.disable.mockResolvedValue(true)

		await expect(resolver.disable(user, input, lng)).resolves.toBe(true)
		expect(service.disable).toHaveBeenCalledWith(user, input, lng)
	})

	it('delegates verify to the service', async () => {
		const input = { code: '000000' } as VerifyTotpInput
		service.verify.mockResolvedValue(true)

		await expect(resolver.verify(user, input, lng)).resolves.toBe(true)
		expect(service.verify).toHaveBeenCalledWith(user, input.code, lng)
	})

	it('delegates backup codes status to the service', async () => {
		const expected: BackupCodesStatusModel = { total: 10, used: 2, remaining: 8 }
		service.getBackupCodesStatus.mockResolvedValue(expected)

		await expect(resolver.getBackupCodesStatus(user, lng)).resolves.toBe(expected)
		expect(service.getBackupCodesStatus).toHaveBeenCalledWith(user, lng)
	})

	it('delegates regenerate backup codes to the service', async () => {
		const expected: TotpEnabledModel = { success: true, backupCodes: ['CODE'], message: 'msg' }
		service.regenerateBackupCodes.mockResolvedValue(expected)

		await expect(resolver.regenerateBackupCodes(user, 'password', lng)).resolves.toBe(expected)
		expect(service.regenerateBackupCodes).toHaveBeenCalledWith(user, 'password', lng)
	})

	it('sets rate-limit metadata on guarded mutations', () => {
		const enableDescriptor = Object.getOwnPropertyDescriptor(TotpResolver.prototype, 'enable')
		const disableDescriptor = Object.getOwnPropertyDescriptor(TotpResolver.prototype, 'disable')
		const verifyDescriptor = Object.getOwnPropertyDescriptor(TotpResolver.prototype, 'verify')

		const ensureMetadata = (descriptor?: PropertyDescriptor): TotpRateLimitMetadata => {
			if (!descriptor || typeof descriptor.value !== 'function') {
				throw new Error('Missing decorator metadata')
			}
			const target: object = descriptor.value
			const metadata = Reflect.getMetadata(TOTP_RATE_LIMIT, target) as TotpRateLimitMetadata | undefined
			if (!metadata) {
				throw new Error('TOTP rate limit metadata is not defined')
			}
			return metadata
		}

		expect(ensureMetadata(enableDescriptor)).toEqual({
			action: RATE_LIMIT_ACTIONS.ENABLE,
			maxAttempts: MAX_ATTEMPTS,
			windowMs: RATE_LIMIT_WINDOW * 1000,
		})

		expect(ensureMetadata(disableDescriptor)).toEqual({
			action: RATE_LIMIT_ACTIONS.DISABLE,
			maxAttempts: MAX_ATTEMPTS,
			windowMs: RATE_LIMIT_WINDOW * 1000,
		})

		expect(ensureMetadata(verifyDescriptor)).toEqual({
			action: RATE_LIMIT_ACTIONS.VERIFY,
			maxAttempts: MAX_ATTEMPTS,
			windowMs: RATE_LIMIT_WINDOW * 1000,
		})
	})
})
