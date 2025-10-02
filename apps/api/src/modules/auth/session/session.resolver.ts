import { Lang } from '@/core'
import { Authorization, UserAgent } from '@/shared/decorators'
import { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'
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

	@Authorization()
	@Query(() => Session, { name: 'findCurrentSession', description: 'Find current session' })
	findCurrent(@Context() { req }: GqlContext): Promise<Session | null> {
		return this.sessionService.findCurrent(req)
	}

	@Authorization()
	@Query(() => [Session], { name: 'findSessionsByUser' })
	async findByUser(@Context() { req }: GqlContext): Promise<Session[] | null> {
		return this.sessionService.findByUser(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'clearSessionCookie', description: 'Clear session cookie' })
	clearSession(@Context() { req }: GqlContext) {
		return this.sessionService.clear(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession', description: 'Remove a session by ID' })
	async removeSession(@Context() { req }: GqlContext, @Args('id') id: string, @Lang() language: string) {
		return this.sessionService.remove(req, id, language)
	}
}
