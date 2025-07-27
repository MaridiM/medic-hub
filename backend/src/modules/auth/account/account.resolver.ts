import { Lang } from '@/core'
import { Authorization, Authorized } from '@/shared/decorators'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateAccountInput } from './inputs'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Create a new user
	 * @param data - The data for the new user
	 * @param language - The language of the user
	 * @returns The new user
	 */
	@Mutation(() => User, { name: 'createAccount', description: 'Create a new user' })
	create(@Args('data') data: CreateAccountInput, @Lang() language: string): Promise<User> {
		return this.accountService.create(data, language)
	}

	/**
	 * Get current user
	 * @param language - The language of the user
	 * @param id - The id of the user
	 * @returns The current user
	 */
	@Authorization()
	@Query(() => User, { name: 'findProfile', description: 'Find profile' })
	findProfile(@Authorized('id') id: string, @Lang() language: string) {
		return this.accountService.findProfile(language, id)
	}
}
