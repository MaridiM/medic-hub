import { Lang } from '@/core'
import { Authorized } from '@/shared/decorators'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateAccountInput } from './inputs'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Mutation(() => User, { name: 'createAccount', description: 'Create a new user' })
	create(@Args('data') data: CreateAccountInput, @Lang() language: string): Promise<User> {
		return this.accountService.create(data, language)
	}

	@Mutation(() => Boolean, { name: 'deleteAccount', description: 'Delete a user' })
	delete(@Authorized('id') id: string, @Lang() language: string): Promise<boolean> {
		return this.accountService.delete(language, id)
	}
}
