import { Lang, Language } from '@/core/i18n'
import { Authorization, UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'
import { SessionService } from './session.service'

@Resolver()
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	/**
	 * Authenticate the user and create a server session.
	 * Sets the session cookie and returns basic session metadata.
	 */
	@Mutation(() => LoginResponse, {
		name: 'login',
		description: 'Authenticate the user and create a session (cookie-based). Returns session metadata.',
	})
	login(
		@Context() { req }: GqlContext,
		@Args('data') data: LoginInput,
		@UserAgent() userAgent: string,
		@Lang() lng: Language,
	): Promise<LoginResponse> {
		return this.sessionService.login(req, userAgent, data, lng)
	}

	/**
	 * Destroy the current session (logout).
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'logout',
		description: 'Destroy the current session (logout).',
	})
	logout(@Context() { req }: GqlContext): Promise<boolean> {
		return this.sessionService.logout(req)
	}

	/**
	 * Read the current session object (by the request’s session id).
	 */
	@Authorization()
	@Query(() => Session, {
		name: 'findCurrentSession',
		description: 'Get the current session by the request session id.',
	})
	findCurrent(@Context() { req }: GqlContext): Promise<Session | null> {
		return this.sessionService.findCurrent(req)
	}

	/**
	 * List all active sessions for the current user (excluding the current one).
	 */
	@Authorization()
	@Query(() => [Session], {
		name: 'findSessionsByUser',
		description: 'List all active sessions for the current user (the current session is excluded).',
	})
	findByUser(@Context() { req }: GqlContext, @Lang() lng: Language): Promise<Session[]> {
		return this.sessionService.findByUser(req, lng)
	}

	/**
	 * Clear the session cookie from the response.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'clearSessionCookie',
		description: 'Clear the session cookie from the response.',
	})
	clearSession(@Context() { req }: GqlContext): boolean {
		return this.sessionService.clear(req)
	}

	/**
	 * Remove a specific session by id. You cannot remove the current session.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'removeSession',
		description: 'Remove a specific session by id (fails if the id belongs to the current session).',
	})
	removeSession(@Context() { req }: GqlContext, @Args('id') id: string, @Lang() lng: Language): Promise<boolean> {
		return this.sessionService.remove(req, id, lng)
	}
}
