import { RATE_LIMIT_CHANGE_PASSWORD_POINTS, RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS } from '@/core/config'
import { Lang, Language } from '@/core/i18n'
import { RateLimit } from '@/modules/security'
import { Authorization, Authorized, UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

/**
 * Response type for password change operation
 */
@ObjectType('ChangePasswordResponse', {
	description: 'Response after successful password change',
})
export class ChangePasswordResponse {
	@Field({
		description: 'Whether the password change was successful',
	})
	success: boolean

	@Field({
		description: 'Number of other sessions invalidated (logged out from other devices)',
	})
	sessionsInvalidated: number
}

@Resolver(() => User)
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	/**
	 * Returns the currently authenticated user's profile (safe projection).
	 */
	@Authorization()
	@Query(() => User, {
		name: 'profile',
		description: 'Get the currently authenticated user profile. Returns safe projection without sensitive data.',
	})
	async me(@Authorized('id') id: string): Promise<User> {
		return this.accountService.me(id)
	}

	/**
	 * Creates a new user account and sends an email verification token.
	 */
	@Mutation(() => User, {
		name: 'createAccount',
		description:
			'Create a new user account. Normalizes email, hashes password with Argon2id, and sends verification email.',
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
		description: 'Change current user email address. Resets verification status and sends new verification email.',
	})
	async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.accountService.changeEmail(user, input, lng)
	}

	/**
	 * Changes the password of the authenticated user with enterprise security features.
	 * Invalidates all other sessions and logs security event.
	 */
	@RateLimit({ points: RATE_LIMIT_CHANGE_PASSWORD_POINTS, duration: RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS }) // ✅ 5 attempts per hour
	@Authorization()
	@Mutation(() => ChangePasswordResponse, {
		name: 'changePassword',
		description:
			'Change current user password. Verifies old password, invalidates all other sessions, logs security event, and updates passwordChangedAt timestamp.',
	})
	async changePassword(
		@Context() { req }: GqlContext,
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<ChangePasswordResponse> {
		return this.accountService.changePassword(req, user, input, userAgent, lng)
	}
}
