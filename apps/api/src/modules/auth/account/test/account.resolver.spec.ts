import { I18nService, PrismaService } from '@/core'
import { GqlAuthGuard } from '@/shared/guards'
import { Test, TestingModule } from '@nestjs/testing'

import { AccountResolver } from '../account.resolver'
import { AccountService } from '../account.service'
import { CreateAccountInput } from '../dtos'
import { User } from '../models'

describe('AccountResolver', () => {
	let resolver: AccountResolver
	let accountService: AccountService
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
				AccountResolver,
				{
					provide: AccountService,
					useValue: {
						create: jest.fn(),
						findProfile: jest.fn(),
					},
				},
				PrismaService, // ✅ Добавь сюда!
				I18nService,
				{
					provide: GqlAuthGuard,
					useValue: { canActivate: jest.fn(() => true) },
				},
			],
		}).compile()

		resolver = module.get<AccountResolver>(AccountResolver)
		accountService = module.get<AccountService>(AccountService)
	})

	describe('create', () => {
		it('✅ should call accountService.create and return created user', async () => {
			jest.spyOn(accountService, 'create').mockResolvedValue(user)

			const result = await resolver.create(input, 'en')

			expect(accountService.create).toHaveBeenCalledWith(input, 'en')
			expect(result).toEqual(user)
		})
	})

	describe('findProfile', () => {
		it('✅ should call accountService.findProfile and return user', async () => {
			const userId = 'user-id'
			const language = 'en'

			jest.spyOn(accountService, 'findProfile').mockResolvedValue(user)

			const result = await resolver.findProfile(userId, language)

			expect(accountService.findProfile).toHaveBeenCalledWith(language, userId)
			expect(result).toEqual(user)
		})
	})
})
