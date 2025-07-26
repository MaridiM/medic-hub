import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateAccountInput } from './dtos'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Mutation(() => User, { name: 'createAccount', description: 'Create a new user' })
	createAccount(@Args('data') data: CreateAccountInput): Promise<User> {
		return this.accountService.createAccount(data)
	}

	@Query(() => [User], { name: 'findAll', description: 'Find all users' })
	findAll() {
		return this.accountService.findAll()
	}

	@Query(() => User, { name: 'findOne', description: 'Find a user by id' })
	findOne(@Args('id') id: string): Promise<User> {
		return this.accountService.findOne(id)
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
