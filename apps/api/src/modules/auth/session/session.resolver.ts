import { RATE_LIMIT_LOGIN_POINTS, RATE_LIMIT_LOGIN_WINDOW_MS } from '@/core/config'
import { Lang, Language } from '@/core/i18n'
import { RateLimit } from '@/modules/security'
import { Authorization, UserAgent } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'
import { SessionService } from './session.service'

@Resolver(() => Session)
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	/**
	 * Authenticate the user and create a server session.
	 */
	@RateLimit({
		points: RATE_LIMIT_LOGIN_POINTS,
		duration: RATE_LIMIT_LOGIN_WINDOW_MS,
		errorMessage: `Too many login attempts. Please try again in ${RATE_LIMIT_LOGIN_WINDOW_MS / 1000 / 60} minutes.`,
	}) // ✅ 5 attempts per 15 minutes
	@Mutation(() => LoginResponse, {
		name: 'login',
		description:
			'Authenticate user with email and password. Creates session cookie and tracks login metadata (IP, device, location).',
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
		description: 'Destroy current session and clear session cookie.',
	})
	logout(@Context() { req }: GqlContext): Promise<boolean> {
		return this.sessionService.logout(req)
	}

	/**
	 * Read the current session object.
	 */
	@Authorization()
	@Query(() => Session, {
		name: 'currentSession',
		description: 'Get current session metadata including device, location, and security status.',
		nullable: true,
	})
	findCurrent(@Context() { req }: GqlContext): Promise<Session | null> {
		return this.sessionService.findCurrent(req)
	}

	/**
	 * List all active sessions for the current user (excluding current).
	 */
	@Authorization()
	@Query(() => [Session], {
		name: 'userSessions',
		description: 'List all active sessions for current user (sorted by creation time, current session excluded).',
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
		description: 'Clear session cookie from client (does not invalidate Redis session).',
	})
	clearSession(@Context() { req }: GqlContext): boolean {
		return this.sessionService.clear(req)
	}

	/**
	 * Remove a specific session by id.
	 */
	@Authorization()
	@Mutation(() => Boolean, {
		name: 'removeSession',
		description: 'Remove specific session by ID (cannot remove current session).',
	})
	removeSession(@Context() { req }: GqlContext, @Args('id') id: string, @Lang() lng: Language): Promise<boolean> {
		return this.sessionService.remove(req, id, lng)
	}
}
