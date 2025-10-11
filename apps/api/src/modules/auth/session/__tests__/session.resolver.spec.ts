import 'reflect-metadata'

import type { Request } from 'express'

import type { Language } from '@/core/i18n'
import type { LoginInput, LoginResponse } from '../dtos'
import type { Session } from '../models'
import { SessionResolver } from '../session.resolver'
import type { SessionService } from '../session.service'
import type { User } from '@/modules/auth/account'

describe('SessionResolver', () => {
	const serviceMock = {
		login: jest.fn(),
		logout: jest.fn(),
		findCurrent: jest.fn(),
		findByUser: jest.fn(),
		clear: jest.fn(),
		remove: jest.fn(),
	} as unknown as jest.Mocked<SessionService>

	const resolver = new SessionResolver(serviceMock)
	const context = { req: { session: {} } as Request, res: {} } as any
	const lng = 'en' as Language

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('delegates login mutation', async () => {
		const input = { email: 'user@example.com', password: 'pass' } as LoginInput
		const loginResponse = { user: {} as User } as LoginResponse
		serviceMock.login.mockResolvedValue(loginResponse)

		const result = await resolver.login(context, input, 'agent', lng)

		expect(result).toBe(loginResponse)
		expect(serviceMock.login).toHaveBeenCalledWith(context.req, 'agent', input, lng)
	})

	it('delegates logout mutation', async () => {
		serviceMock.logout.mockResolvedValue(true)

		const result = await resolver.logout(context)

		expect(result).toBe(true)
		expect(serviceMock.logout).toHaveBeenCalledWith(context.req)
	})

	it('delegates findCurrent query', async () => {
		const session = { id: 'session-id' } as Session
		serviceMock.findCurrent.mockResolvedValue(session)

		const result = await resolver.findCurrent(context)

		expect(result).toBe(session)
		expect(serviceMock.findCurrent).toHaveBeenCalledWith(context.req)
	})

	it('delegates findByUser query', async () => {
		const sessions = [{ id: 'session-id' }] as Session[]
		serviceMock.findByUser.mockResolvedValue(sessions)

		const result = await resolver.findByUser(context, lng)

		expect(result).toBe(sessions)
		expect(serviceMock.findByUser).toHaveBeenCalledWith(context.req, lng)
	})

	it('delegates clearSession mutation', () => {
		serviceMock.clear.mockReturnValue(true)

		const result = resolver.clearSession(context)

		expect(result).toBe(true)
		expect(serviceMock.clear).toHaveBeenCalledWith(context.req)
	})

	it('delegates removeSession mutation', async () => {
		serviceMock.remove.mockResolvedValue(true)

		const result = await resolver.removeSession(context, 'session-id', lng)

		expect(result).toBe(true)
		expect(serviceMock.remove).toHaveBeenCalledWith(context.req, 'session-id', lng)
	})
})
