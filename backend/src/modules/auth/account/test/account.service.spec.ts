import * as argon2 from 'argon2'

import { I18nService, PrismaService } from '@/core'
import { ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Prisma } from '@prisma/__generated__'

import { AccountService } from '../account.service'
import { CreateAccountInput } from '../inputs'
import { User } from '../models'

jest.mock('argon2', () => ({
	hash: jest.fn(() => 'hashedPassword'),
	verify: jest.fn(() => true),
}))

describe('AccountService', () => {
	let service: AccountService
	let prisma: PrismaService
	let i18n: I18nService
	let user: User

	const input: CreateAccountInput = {
		email: 'test@example.com',
		password: '123',
		fullName: 'John Doe',
		phone: '+79999999999',
	}

	beforeEach(async () => {
		user = {
			id: 'user-id',
			fullName: input.fullName,
			firstName: null,
			lastName: null,
			phone: input.phone,
			email: input.email,
			password: 'hashedPassword',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountService,
				{
					provide: PrismaService,
					useValue: {
						user: {
							findUnique: jest.fn(),
							create: jest.fn(),
						},
					},
				},
				{
					provide: I18nService,
					useValue: {
						t: jest.fn(),
					},
				},
			],
		}).compile()

		service = module.get<AccountService>(AccountService)
		prisma = module.get<PrismaService>(PrismaService)
		i18n = module.get<I18nService>(I18nService)
	})

	describe('create()', () => {
		it('✅ creates a new user', async () => {
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)
			jest.spyOn(prisma.user, 'create').mockResolvedValue(user)

			const result = await service.create(input, 'en')

			expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } })
			expect(argon2.hash).toHaveBeenCalledWith(input.password)
			expect(prisma.user.create).toHaveBeenCalledWith({
				data: {
					email: input.email,
					fullName: input.fullName,
					phone: input.phone,
					password: 'hashedPassword',
				},
			})
			expect(result).toEqual(user)
		})

		it('❌ throws ConflictException if user already exists', async () => {
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user)
			jest.spyOn(i18n, 't').mockReturnValue('User already exists')

			await expect(service.create(input, 'en')).rejects.toThrow(ConflictException)
			expect(i18n.t).toHaveBeenCalledWith('auth.user_already_exists', { lng: 'en' })
		})

		it('✅ hashes password correctly', async () => {
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)
			const mockedUser = {
				...user,
				tokens: [],
			}

			const createSpy = jest
				.spyOn(prisma.user, 'create')
				.mockReturnValue(mockedUser as unknown as Prisma.Prisma__UserClient<any, any, any>)

			const result = await service.create(input, 'en')

			expect(createSpy).toHaveBeenCalled()
			expect(result).toBeDefined()

			// Пароль не должен совпадать с оригиналом
			expect(result.password).not.toEqual(input.password)

			// Хеш должен быть валиден
			const isVerified = await argon2.verify(result.password, input.password)
			expect(isVerified).toBe(true)
		})
	})

	describe('findProfile()', () => {
		it('❌ throws ConflictException if user not found', async () => {
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)
			jest.spyOn(i18n, 't').mockReturnValue('User not found')

			await expect(service.findProfile('en', 'user-id')).rejects.toThrow(ConflictException)
			expect(i18n.t).toHaveBeenCalledWith('auth.user_not_found', { lng: 'en' })
		})

		it('✅ returns user profile', async () => {
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user)

			const result = await service.findProfile('en', user.id)

			expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: user.id } })
			expect(result).toEqual(user)
		})
	})
})
