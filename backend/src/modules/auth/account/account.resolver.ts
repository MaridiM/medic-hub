import { I18nService, Lang } from '@/core'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateAccountInput } from './dtos'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(
		private readonly accountService: AccountService,
		private readonly i18n: I18nService,
	) {}

	@Mutation(() => User, { name: 'createAccount', description: 'Create a new user' })
	create(@Args('data') data: CreateAccountInput): Promise<User> {
		return this.accountService.create(data)
	}

	@Query(() => [User], { name: 'findAll', description: 'Find all users' })
	findAll() {
		return this.accountService.findAll()
	}

	@Query(() => User, { name: 'findOne', description: 'Find a user by id' })
	findOne(@Args('id') id: string): Promise<User> {
		return this.accountService.findOne(id)
	}

	@Query(() => String, { name: 'getAuthMessage', description: 'Get auth message (i18n demo)' })
	getAuthMessage(@Lang() language: string): string {
		return this.i18n.t('auth.test', { lng: language }) as string
	}

	// @Mutation(() => Account)
	// updateAccount(@Args('updateAccountInput') updateAccountInput: UpdateAccountInput) {
	// 	return this.accountService.update(updateAccountInput.id, updateAccountInput)
	// }

	// @Mutation(() => Account)
	// removeAccount(@Args('id', { type: () => Int }) id: number) {
	// 	return this.accountService.remove(id)
	// }
}
