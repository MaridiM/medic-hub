import { Lang, Language } from '@/core/i18n'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { NewPasswordInput, ResetPasswordInput } from './dtos'
import { RecoveryService } from './recovery.service'

@Resolver('Recovery')
export class RecoveryResolver {
	constructor(private readonly recoveryService: RecoveryService) {}

	/**
	 * Initiates password reset flow by email.
	 * Generates a one-time reset token and sends a reset link to the user.
	 */
	@Mutation(() => Boolean, {
		name: 'resetPassword',
		description: 'Initiate password reset: generate a one-time token and send a reset link to the user’s email.',
	})
	async resetPassword(
		@Context() { req }: GqlContext,
		@Args('data', {
			type: () => ResetPasswordInput,
			description: 'Payload with the email address that requests a password reset.',
		})
		input: ResetPasswordInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.resetPassword(req, input, userAgent, lng)
	}

	/**
	 * Completes password reset using a valid token by setting a new password.
	 * Consumes the token on success.
	 */
	@Mutation(() => Boolean, {
		name: 'newPassword',
		description: 'Complete password reset: validate token, set a new password, and consume the token.',
	})
	async newPassword(
		@Args('data', {
			type: () => NewPasswordInput,
			description: 'Payload with the reset token and the new password.',
		})
		input: NewPasswordInput,
		@Lang() lng: Language,
	): Promise<boolean> {
		return this.recoveryService.newPassword(input, lng)
	}
}
