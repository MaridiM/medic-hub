import { Lang } from '@/core'
import { UserAgent } from '@/shared/decorators'
import { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { VerificationInput, VerificationResponse } from './dtos'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	@Mutation(() => VerificationResponse, { name: 'verificationEmail' })
	async verificationEmail(
		@Context() { req }: GqlContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string,
		@Lang() language: string,
	) {
		return this.verificationService.verificationEmail(req, input, userAgent, language)
	}
}
