import { Lang, Language } from '@/core/i18n'
import { Authorization, Authorized } from '@/shared/decorators'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Returns the currently authenticated user's profile (safe projection).
	 */
	@Authorization()
	@Query(() => User, {
		name: 'profile',
		description:
			'Get the currently authenticated user profile. Requires auth. Returns a safe projection (no password).',
	})
	async me(@Authorized('id') id: string) {
		return this.accountService.me(id)
	}

	/**
	 * Creates a new user account and sends an email verification token.
	 */
	@Mutation(() => User, {
		name: 'createAccount',
		description:
			'Create a new user account. Normalizes email, hashes password, and sends a verification email token.',
	})
	create(@Args('data') input: CreateAccountInput, @Lang() lng: Language): Promise<User> {
		return this.accountService.create(input, lng)
	}

	/**
	 * Changes the email of the authenticated user and re-sends a verification email.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changeEmail',
		description:
			'Change the current user email. Normalizes email, rejects same email, resets verification and sends a new verification token.',
	})
	async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changeEmail(user, input, lng)
	}

	/**
	 * Changes the password of the authenticated user after validating the old password.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changePassword',
		description:
			'Change the current user password. Verifies old password, rejects identical new password, hashes and updates on success.',
	})
	async changePassword(
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changePassword(user, input, lng)
	}
}
