import 'reflect-metadata'

import type { Request } from 'express'

import type { Language } from '@/core/i18n'
import type { VerificationInput, VerificationResponse } from '../dtos'
import { VerificationResolver } from '../verification.resolver'
import type { VerificationService } from '../verification.service'
import type { User } from '@/modules/auth/account'

describe('VerificationResolver', () => {
	const serviceMock = {
		verificationEmail: jest.fn(),
		sendVerificationEmailToken: jest.fn(),
	} as unknown as jest.Mocked<VerificationService>

	const resolver = new VerificationResolver(serviceMock)
	const context = { req: { session: {} } as Request, res: {} } as any
	const lng = 'en' as Language

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('delegates verificationEmail to service', async () => {
		const input = { token: 'token' } as VerificationInput
		const response = { user: {} as User } as VerificationResponse
		serviceMock.verificationEmail.mockResolvedValue(response)

		const result = await resolver.verificationEmail(context, input, 'agent', lng)

		expect(result).toBe(response)
		expect(serviceMock.verificationEmail).toHaveBeenCalledWith(context.req, input, 'agent', lng)
	})
})
