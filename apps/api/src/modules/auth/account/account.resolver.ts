import { Lang } from '@/core'
import { Authorization, Authorized } from '@/shared/decorators'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => User, { name: 'profile' })
	async me(@Authorized('id') id: string) {
		return this.accountService.me(id)
	}

	@Mutation(() => User, { name: 'createAccount', description: 'Create a new user' })
	create(@Args('data') input: CreateAccountInput, @Lang() language: string): Promise<User> {
		return this.accountService.create(input, language)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeEmail' })
	async changeEmail(@Authorized() user: User, @Args('data') input: ChangeEmailInput) {
		return this.accountService.changeEmail(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changePassword' })
	async changePassword(@Authorized() user: User, @Args('data') input: ChangePasswordInput) {
		return this.accountService.changePassword(user, input)
	}
}
