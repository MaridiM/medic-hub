import 'reflect-metadata'

import { I18nService, type Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { VerificationService } from '@/modules/auth/verification'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common'

import { AccountService } from '../account.service'
import type { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from '../dtos'
import type { User } from '../models'

describe('AccountService', () => {
	const translate = ((key: string) => key) as unknown as I18nService['t']
	let i18nMock: Pick<I18nService, 't'>
	let prismaMock: Pick<PrismaService, 'user'>
	let verificationMock: Pick<VerificationService, 'sendVerificationEmailToken'>
	let service: AccountService

	const lng = 'en' as Language

	beforeEach(() => {
		i18nMock = { t: translate }
		prismaMock = {
			user: {
				findUnique: jest.fn(),
				create: jest.fn(),
				update: jest.fn(),
			},
		} as unknown as Pick<PrismaService, 'user'>
		verificationMock = {
			sendVerificationEmailToken: jest.fn().mockResolvedValue(true),
		} as unknown as Pick<VerificationService, 'sendVerificationEmailToken'>

		service = new AccountService(
			i18nMock as unknown as I18nService,
			prismaMock as unknown as PrismaService,
			verificationMock as unknown as VerificationService,
		)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('returns user profile via me()', async () => {
		const user = { id: 'user-1', email: 'user@example.com' }
		;(prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user)

		const result = await service.me('user-1')

		expect(result).toEqual(user)
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: 'user-1' },
			select: expect.any(Object),
		})
	})

	it('creates account and sends verification email', async () => {
		const input: CreateAccountInput = {
			fullName: 'User',
			email: 'User@Example.com ',
			password: 'password123',
			phone: '+123456789',
		}
		const createdUser = { id: 'user-1', email: 'user@example.com' }
		jest.spyOn(HashUtil, 'hash').mockResolvedValue('hashed-password123')
		;(prismaMock.user.create as jest.Mock).mockResolvedValue(createdUser)

		const result = await service.create(input, lng)

		expect(prismaMock.user.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({ email: 'user@example.com', password: 'hashed-password123' }),
				select: expect.any(Object),
			}),
		)
		expect(verificationMock.sendVerificationEmailToken).toHaveBeenCalled()
		expect(result).toEqual(createdUser)
	})

	it('throws ConflictException when email already exists', async () => {
		const error = Object.assign(new Error('P2002'), {
			code: 'P2002',
			name: 'PrismaClientKnownRequestError',
		})
		const input: CreateAccountInput = {
			fullName: 'User',
			email: 'user@example.com',
			password: 'password123',
			phone: '+123456789',
		}
		;(prismaMock.user.create as jest.Mock).mockRejectedValue(error)

		await expect(service.create(input, lng)).rejects.toBeInstanceOf(ConflictException)
	})

	it('throws InternalServerErrorException for unexpected errors', async () => {
		const input: CreateAccountInput = {
			fullName: 'User',
			email: 'user@example.com',
			password: 'password123',
			phone: '+123456789',
		}
		;(prismaMock.user.create as jest.Mock).mockRejectedValue(new Error('boom'))

		await expect(service.create(input, lng)).rejects.toBeInstanceOf(InternalServerErrorException)
	})

	it('changes email and sends verification link', async () => {
		const user = { id: 'user-1', email: 'old@example.com' } as User
		const input: ChangeEmailInput = { email: 'New@Example.com' }
		const updatedUser = { id: 'user-1', email: 'new@example.com', isEmailVerified: false }
		;(prismaMock.user.update as jest.Mock).mockResolvedValue(updatedUser)

		const result = await service.changeEmail(user, input, lng)

		expect(result).toBe(true)
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: user.id },
			data: { email: 'new@example.com', isEmailVerified: false },
			select: expect.any(Object),
		})
		expect(verificationMock.sendVerificationEmailToken).toHaveBeenCalledWith(updatedUser as unknown as User, 'en')
	})

	it('rejects when new email matches current email', async () => {
		const user = { id: 'user-1', email: 'same@example.com' } as User
		const input: ChangeEmailInput = { email: 'same@example.com' }

		await expect(service.changeEmail(user, input, lng)).rejects.toBeInstanceOf(BadRequestException)
	})

	it('throws ConflictException when new email already exists', async () => {
		const error = Object.assign(new Error('P2002'), {
			code: 'P2002',
			name: 'PrismaClientKnownRequestError',
		})
		;(prismaMock.user.update as jest.Mock).mockRejectedValue(error)

		await expect(
			service.changeEmail({ id: 'user-1', email: 'old@example.com' } as User, { email: 'new@example.com' }, lng),
		).rejects.toBeInstanceOf(ConflictException)
	})

	it('changes password when validation passes', async () => {
		const user = { id: 'user-1', password: 'hashed-old' } as User
		const input: ChangePasswordInput = { oldPassword: 'old', newPassword: 'new' }

		const result = await service.changePassword(user, input, lng)

		expect(result).toBe(true)
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: user.id },
			data: { password: 'hashed-new' },
			select: { id: true },
		})
	})

	it('throws when old password is invalid', async () => {
		jest.spyOn(HashUtil, 'verify').mockResolvedValue(false)

		await expect(
			service.changePassword(
				{ id: 'user-1', password: 'hash' } as User,
				{ oldPassword: 'a', newPassword: 'b' },
				lng,
			),
		).rejects.toBeInstanceOf(BadRequestException)
	})

	it('throws when new password equals old password', async () => {
		await expect(
			service.changePassword(
				{ id: 'user-1', password: 'hashed-old' } as User,
				{ oldPassword: 'old', newPassword: 'old' },
				lng,
			),
		).rejects.toBeInstanceOf(BadRequestException)
	})
})
