import { Lang } from '@/core'
import { UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { NewPasswordInput, ResetPasswordInput } from './dtos'
import { RecoveryService } from './recovery.service'

@Resolver('Recovery')
export class RecoveryResolver {
	constructor(private readonly recoveryService: RecoveryService) {}

	@Mutation(() => Boolean, { name: 'resetPassword', description: 'Recovery password - reset' })
	async resetPassword(
		@Context() { req }: GqlContext,
		@Args('data') input: ResetPasswordInput,
		@UserAgent() userAgent: string,
		@Lang() language: string,
	) {
		return this.recoveryService.resetPassword(req, input, userAgent, language)
	}

	@Mutation(() => Boolean, { name: 'newPassword', description: 'Recovery password - change ' })
	async newPassword(@Args('data') input: NewPasswordInput, @Lang() language: string) {
		return this.recoveryService.newPassword(input, language)
	}
}
