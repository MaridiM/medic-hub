import { hash, verify } from 'argon2'
import 'reflect-metadata'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { BadRequestException, ConflictException } from '@nestjs/common'

import { VerificationService } from '../../verification'
import { AccountResolver } from '../account.resolver'
import { AccountService } from '../account.service'
import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from '../dtos'
import type { User } from '../models'

jest.mock('argon2', () => ({
	hash: jest.fn(),
	verify: jest.fn(),
}))

type PrismaUserDelegate = {
	findUnique: jest.Mock<Promise<Record<string, unknown> | null>, [unknown]>
	create: jest.Mock<Promise<Record<string, unknown>>, [unknown]>
	update: jest.Mock<Promise<Record<string, unknown>>, [unknown]>
}

interface PrismaMock {
	user: PrismaUserDelegate
}

type VerificationServiceMock = {
	sendVerificationEmailToken: jest.Mock<Promise<boolean>, [User, Language]>
}

describe('AccountModule integration', () => {
	let resolver: AccountResolver
	let service: AccountService
	let prismaMock: PrismaMock
	let verificationMock: VerificationServiceMock
	let i18nMock: Pick<I18nService, 't'>

	const hashMock = hash as jest.MockedFunction<typeof hash>
	const verifyMock = verify as jest.MockedFunction<typeof verify>

	beforeEach(() => {
		prismaMock = {
			user: {
				findUnique: jest.fn(),
				create: jest.fn(),
				update: jest.fn(),
			},
		}

		verificationMock = {
			sendVerificationEmailToken: jest.fn(),
		}

		const translate = ((key: string) => key) as unknown as I18nService['t']
		i18nMock = { t: translate }

		hashMock.mockReset()
		verifyMock.mockReset()

		service = new AccountService(
			i18nMock as unknown as I18nService,
			prismaMock as unknown as PrismaService,
			verificationMock as unknown as VerificationService,
		)
		resolver = new AccountResolver(service)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('creates account and triggers verification email', async () => {
		const input: CreateAccountInput = {
			fullName: 'TestUser',
			email: ' Test@Example.com ',
			password: 'password123',
			phone: '+1234567890',
		}

		const createdAt = new Date('2025-01-01T00:00:00Z')
		const createdUser = {
			id: 'user-id',
			email: 'test@example.com',
			fullName: 'TestUser',
			firstName: 'Test',
			lastName: 'User',
			isEmailVerified: false,
			createdAt,
			updatedAt: createdAt,
		}

		hashMock.mockResolvedValue('hashed-password')
		prismaMock.user.create.mockResolvedValue(createdUser)
		verificationMock.sendVerificationEmailToken.mockResolvedValue(true)

		const result = await resolver.create(input, 'en' as Language)

		expect(prismaMock.user.create).toHaveBeenCalledWith({
			data: expect.objectContaining({
				email: 'test@example.com',
				password: 'hashed-password',
			}),
			select: expect.any(Object),
		})
		expect(verificationMock.sendVerificationEmailToken).toHaveBeenCalledWith(createdUser as unknown as User, 'en')
		expect(result).toEqual(createdUser)
	})

	it('changes email and sends verification token', async () => {
		const existingUser = {
			id: 'user-id',
			email: 'old@example.com',
		} as User

		const input: ChangeEmailInput = { email: 'New@Example.com' }
		const updatedUser = {
			id: 'user-id',
			email: 'new@example.com',
			isEmailVerified: false,
		}

		prismaMock.user.update.mockResolvedValue(updatedUser)
		verificationMock.sendVerificationEmailToken.mockResolvedValue(true)

		const changed = await resolver.changeEmail(existingUser, input, 'en' as Language)

		expect(changed).toBe(true)
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: existingUser.id },
			data: { email: 'new@example.com', isEmailVerified: false },
			select: expect.any(Object),
		})
		expect(verificationMock.sendVerificationEmailToken).toHaveBeenCalledWith(updatedUser as unknown as User, 'en')
	})

	it('throws when changing email to the same value', async () => {
		const user = {
			id: 'user-id',
			email: 'same@example.com',
		} as User

		await expect(
			resolver.changeEmail(user, { email: 'same@example.com' }, 'en' as Language),
		).rejects.toBeInstanceOf(BadRequestException)
		expect(prismaMock.user.update).not.toHaveBeenCalled()
	})

	it('changes password when old password matches and new password differs', async () => {
		const user = {
			id: 'user-id',
			email: 'user@example.com',
			password: 'stored-hash',
		} as User

		const input: ChangePasswordInput = {
			oldPassword: 'old-password',
			newPassword: 'new-password!',
		}

		verifyMock.mockResolvedValue(true)
		hashMock.mockResolvedValue('hashed-new-password')
		prismaMock.user.update.mockResolvedValue({ id: user.id })

		const changed = await resolver.changePassword(user, input, 'en' as Language)

		expect(changed).toBe(true)
		expect(verifyMock).toHaveBeenCalledWith('stored-hash', 'old-password')
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: user.id },
			data: { password: 'hashed-new-password' },
			select: expect.any(Object),
		})
	})

	it('throws when new password matches the old password', async () => {
		const user = {
			id: 'user-id',
			email: 'user@example.com',
			password: 'stored-hash',
		} as User

		const input: ChangePasswordInput = {
			oldPassword: 'password123',
			newPassword: 'password123',
		}

		verifyMock.mockResolvedValue(true)

		await expect(resolver.changePassword(user, input, 'en' as Language)).rejects.toBeInstanceOf(BadRequestException)
		expect(prismaMock.user.update).not.toHaveBeenCalled()
	})

	it('throws when email already exists during creation', async () => {
		const input: CreateAccountInput = {
			fullName: 'Existing',
			email: 'exist@example.com',
			password: 'password123',
			phone: '+1234567890',
		}

		hashMock.mockResolvedValue('hashed-password')
		const prismaError = Object.assign(new Error('P2002'), {
			code: 'P2002',
			name: 'PrismaClientKnownRequestError',
		})
		prismaMock.user.create.mockRejectedValue(prismaError)

		await expect(resolver.create(input, 'en' as Language)).rejects.toBeInstanceOf(ConflictException)
	})
})
