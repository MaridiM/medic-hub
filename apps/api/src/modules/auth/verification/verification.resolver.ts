import { Lang, Language } from '@/core/i18n'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { VerificationInput, VerificationResponse } from './dtos'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	/**
	 * Send a verification email with a one-time token.
	 * The token is persisted and can be used to confirm the account.
	 */
	@Mutation(() => VerificationResponse, {
		name: 'verificationEmail',
		description: 'Send a verification email with a one-time token and return delivery/meta info.',
	})
	verificationEmail(
		@Context() { req }: GqlContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<VerificationResponse> {
		return this.verificationService.verificationEmail(req, input, userAgent, lng)
	}
}
