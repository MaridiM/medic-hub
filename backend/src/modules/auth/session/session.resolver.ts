import { Lang } from '@/core'
import { Authorization, UserAgent } from '@/shared/decorators'
import { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { LoginInput, LoginResponse } from './inputs'
import { SessionService } from './session.service'

@Resolver()
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => LoginResponse, { name: 'login', description: 'Login to the system' })
	login(
		@Context() { req }: GqlContext,
		@Args('data') data: LoginInput,
		@UserAgent() userAgent: string,
		@Lang() language: string,
	): Promise<LoginResponse> {
		return this.sessionService.login(req, userAgent, data, language)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'logout', description: 'Logout from the system' })
	logout(@Context() { req }: GqlContext): Promise<unknown> {
		return this.sessionService.logout(req)
	}
}
