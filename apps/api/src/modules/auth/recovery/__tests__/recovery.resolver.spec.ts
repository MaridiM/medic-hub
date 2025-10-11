import 'reflect-metadata'

import type { Request } from 'express'

import type { Language } from '@/core/i18n'
import type { ResetPasswordInput, NewPasswordInput } from '../dtos'
import { RecoveryResolver } from '../recovery.resolver'
import type { RecoveryService } from '../recovery.service'

describe('RecoveryResolver', () => {
	const serviceMock = {
		resetPassword: jest.fn(),
		newPassword: jest.fn(),
	} as unknown as jest.Mocked<RecoveryService>

	const resolver = new RecoveryResolver(serviceMock)
	const context = { req: { session: {} } as Request, res: {} } as any
	const lng = 'en' as Language

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('delegates resetPassword to service', async () => {
		const input = { email: 'user@example.com' } as ResetPasswordInput
		serviceMock.resetPassword.mockResolvedValue(true)

		const result = await resolver.resetPassword(context, input, 'agent', lng)

		expect(result).toBe(true)
		expect(serviceMock.resetPassword).toHaveBeenCalledWith(context.req, input, 'agent', lng)
	})

	it('delegates newPassword to service', async () => {
		const input = { token: 't', password: 'Password123!' } as NewPasswordInput
		serviceMock.newPassword.mockResolvedValue(true)

		const result = await resolver.newPassword(input, lng)

		expect(result).toBe(true)
		expect(serviceMock.newPassword).toHaveBeenCalledWith(input, lng)
	})
})

