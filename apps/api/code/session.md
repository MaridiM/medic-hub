# Session Module

**root**
`src/modules/auth/session/index.ts`

```typescript
export * from './session.module'
export * from './session.service'
```

`src/modules/auth/session/session.module.ts`

```typescript
import 'reflect-metadata'

import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
	providers: [SessionResolver, SessionService, VerificationService],
})
export class SessionModule {}
```

`src/modules/auth/session/session.resolver.ts`

```typescript
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
```

`src/modules/auth/session/session.service.ts`

```typescript
import { verify } from 'argon2'
import type { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
// <= ваша утилита
import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/__generated__'

import { VerificationService } from '../verification'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'

/**
 * SessionService
 * - Login (password verification, email check, session save)
 * - Logout (destroy current session)
 * - Read current session
 * - List user sessions (except current)
 * - Remove a specific session by id
 * - Clear cookie on client
 */
@Injectable()
export class SessionService extends CoreService {
	/** Redis key prefix for sessions */
	private readonly prefix: string
	/** Cookie name for express-session (defaults to connect.sid) */
	private readonly cookieName: string

	constructor(
		prisma: PrismaService,
		redis: RedisService,
		i18n: I18nService,
		config: ConfigService,
		private readonly verification: VerificationService,
	) {
		super(i18n, prisma, redis, config)
		this.prefix = this.config.get<string>('SESSION_FOLDER') ?? 'session:'
		this.cookieName = this.config.get<string>('SESSION_COOKIE') ?? 'connect.sid'
	}

	/** Build redis key for a session id */
	private key(sessionId: string): string {
		return `${this.prefix}${sessionId}`
	}

	/**
	 * Login user by email & password, ensure email verified and create a session.
	 * @param req HTTP request
	 * @param userAgent user agent string
	 * @param data login payload
	 * @param lng language code
	 * @returns LoginResponse with new session data
	 */
	async login(req: Request, userAgent: string, data: LoginInput, lng: Language): Promise<LoginResponse> {
		const user = await this.prisma.user.findUnique({ where: { email: data.email } })
		if (!user) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		const ok = await verify(user.password, data.password)
		if (!ok) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		if (!user.isEmailVerified) {
			// fire-and-forget повторная верификация (не блокируем логин)
			await this.verification.sendEmailVerificationToken(user, lng).catch(() => {})
			throw new BadRequestException(
				this.i18n.t('auth.errors.account.not_verified', {
					lng,
					defaultValue: 'Account not verified. Please check your email for verification',
				}),
			)
		}

		const meta = getSessionMetadata(req, userAgent)
		return saveSession(req, user, meta)
	}

	/**
	 * Destroy current session for the request.
	 * @param req HTTP request
	 * @returns true on success
	 */
	async logout(req: Request): Promise<boolean> {
		return destroySession(req, this.config)
	}

	/**
	 * Read current session object from Redis by request's session id.
	 * @param req HTTP request carrying session id
	 * @returns session with attached id or null when not found
	 */
	async findCurrent(req: Request) {
		const sessionId = req.session.id
		const session = await this.redis.getJSON<Session>(this.key(sessionId))
		return session ? { ...session, id: sessionId } : null
	}

	/**
	 * Get all sessions of current user (except the current session).
	 * Sorted by creation time (newest first).
	 * @param req HTTP request (to get current user and session id)
	 */
	async findByUser(req: Request, lng: Language) {
		const userId = req.session.userId
		if (!userId) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		// 1) Keys by prefix (SCAN/KEYS implementation hidden by your RedisService)
		const keys = await this.redis.keys(`${this.prefix}*`)
		if (keys.length === 0) return []

		// 2) Bulk read values
		const raw = (await this.redis.getClient().mGet(keys)) as (string | null)[]

		// 3) Parse & filter by userId
		const sessions = keys.flatMap((key, i) => {
			const s = raw[i]
			if (!s) return []
			try {
				const parsed = JSON.parse(s) as Session
				if (parsed?.userId !== userId) return []
				const id = key.slice(this.prefix.length)
				return [{ ...parsed, id }]
			} catch {
				return []
			}
		})

		// 4) Sort by creation time (desc)
		sessions.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

		// 5) Exclude current session
		const currentId = req.session?.id
		return sessions.filter(s => s.id !== currentId)
	}

	/**
	 * Clear session cookie on the client (does not remove Redis record).
	 * @param req HTTP request/response
	 * @returns true
	 */
	clear(req: Request): boolean {
		req.res?.clearCookie(this.cookieName)
		return true
	}

	/**
	 * Remove a specific session by id. You cannot remove the current session.
	 * @param req HTTP request (to identify current session id)
	 * @param id target session id to delete
	 * @param lng language code
	 * @returns true on success
	 * @throws ConflictException when trying to remove current session
	 * @throws InternalServerErrorException on unexpected Redis errors
	 */
	async remove(req: Request, id: string, lng: Language): Promise<boolean> {
		const currentId = req.session?.id

		if (currentId && currentId === id) {
			throw new ConflictException(
				this.i18n.t('auth.errors.session.cannot_delete_current', {
					lng,
					defaultValue: 'You can’t delete the current session',
				}),
			)
		}

		try {
			await this.redis.del(this.key(id))
			return true
		} catch {
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}
}
```

**dtos**
`src/modules/auth/session/dtos/index.ts`

```typescript
export * from './login.dto'
```

`src/modules/auth/session/dtos/login.dto.ts`

```typescript
import { User } from '@/modules/auth'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	password: string
}

@ObjectType()
export class LoginResponse {
	@Field(() => String, { nullable: true })
	accessToken?: string

	@Field(() => User, { nullable: true })
	user?: User
}
```

**models**
`src/modules/auth/session/models/index.ts`

```typescript
export * from './session.model'
```

`src/modules/auth/session/models/session.model.ts`

```typescript
import type { IDevice, ILocation, ISessionMetadata } from '@/shared/types'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Location implements ILocation {
	@Field(() => String)
	country: string

	@Field(() => String)
	city: string

	@Field(() => Number)
	latitude: number

	@Field(() => Number)
	longitude: number
}

@ObjectType()
export class Device implements IDevice {
	@Field(() => String)
	browser: string

	@Field(() => String)
	os: string

	@Field(() => String)
	type: string
}

@ObjectType()
export class SessionMetadata implements ISessionMetadata {
	@Field(() => Location)
	location: Location

	@Field(() => Device)
	device: Device

	@Field(() => String)
	ip: string
}

@ObjectType()
export class Session {
	@Field(() => ID)
	id: string

	@Field(() => String)
	userId: string

	@Field(() => SessionMetadata)
	metadata: SessionMetadata

	@Field(() => String)
	createdAt: string
}
```
