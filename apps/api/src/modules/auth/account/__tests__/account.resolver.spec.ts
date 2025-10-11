import 'reflect-metadata'

import type { Language } from '@/core/i18n'

import { AccountResolver } from '../account.resolver'
import type { AccountService } from '../account.service'
import type { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from '../dtos'
import type { User } from '../models'

describe('AccountResolver', () => {
	const serviceMock = {
		me: jest.fn(),
		create: jest.fn(),
		changeEmail: jest.fn(),
		changePassword: jest.fn(),
	} as unknown as jest.Mocked<AccountService>

	const resolver = new AccountResolver(serviceMock)
	const user = { id: 'user-1' } as unknown as User
	const lng = 'en' as Language

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('delegates profile query to service', async () => {
		serviceMock.me.mockResolvedValue(user)

		await resolver.me('user-1')

		expect(serviceMock.me).toHaveBeenCalledWith('user-1')
	})

	it('delegates create mutation', async () => {
		const input = { email: 'user@example.com' } as CreateAccountInput
		serviceMock.create.mockResolvedValue(user)

		const result = await resolver.create(input, lng)

		expect(result).toBe(user)
		expect(serviceMock.create).toHaveBeenCalledWith(input, lng)
	})

	it('delegates changeEmail mutation', async () => {
		const input = { email: 'new@example.com' } as ChangeEmailInput
		serviceMock.changeEmail.mockResolvedValue(true)

		const result = await resolver.changeEmail(user, input, lng)

		expect(result).toBe(true)
		expect(serviceMock.changeEmail).toHaveBeenCalledWith(user, input, lng)
	})

	it('delegates changePassword mutation', async () => {
		const input = { oldPassword: 'old', newPassword: 'new' } as ChangePasswordInput
		serviceMock.changePassword.mockResolvedValue(true)

		const result = await resolver.changePassword(user, input, lng)

		expect(result).toBe(true)
		expect(serviceMock.changePassword).toHaveBeenCalledWith(user, input, lng)
	})
})
