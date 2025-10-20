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

@Resolver(() => Session)
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	/**
	 * Authenticate the user and create a server session.
	 */
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
```

`src/modules/auth/session/session.service.ts`

```typescript
import type { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
import { HashUtil } from '@/shared/utils/hash.util'
import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { VerificationService } from '../verification'

import { LoginInput, LoginResponse } from './dtos'
import { Session } from './models'

/**
 * SessionService
 * Handles user session management:
 * - Login (password verification, email check, session creation)
 * - Logout (session destruction)
 * - Session reading and listing
 * - Session removal
 * - Cookie management
 *
 * Enterprise features:
 * - Tracks lastLoginAt and lastLoginIp
 * - Supports 2FA verification status in sessions
 * - Uses Redis for session storage
 * - Rate limiting and security event logging (TODO)
 */
@Injectable()
export class SessionService extends CoreService {
	/** Redis key prefix for sessions */
	private readonly prefix: string
	/** Cookie name for express-session */
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

	/**
	 * Build Redis key for a session ID.
	 * @param sessionId - Session identifier
	 * @returns Full Redis key
	 */
	private key(sessionId: string): string {
		return `${this.prefix}${sessionId}`
	}

	/**
	 * Authenticate user and create a session.
	 * - Verifies email and password
	 * - Enforces email verification requirement
	 * - Updates lastLoginAt and lastLoginIp
	 * - Creates session in Redis
	 *
	 * @param req - HTTP request object
	 * @param userAgent - User agent string
	 * @param data - Login credentials
	 * @param lng - Language code for i18n
	 * @returns Login response with user data
	 * @throws NotFoundException if user not found or password invalid
	 * @throws BadRequestException if email not verified
	 */
	async login(req: Request, userAgent: string, data: LoginInput, lng: Language): Promise<LoginResponse> {
		const user = await this.prisma.user.findUnique({
			where: { email: data.email },
		})

		if (!user) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		const ok = await HashUtil.verify(user.password, data.password)
		if (!ok) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		if (!user.isEmailVerified) {
			// Resend verification email (non-blocking)
			await this.verification.sendEmailVerificationToken(user, lng).catch(() => {})

			throw new BadRequestException(
				this.i18n.t('auth.errors.account.not_verified', {
					lng,
					defaultValue: 'Account not verified. Please check your email for verification',
				}),
			)
		}

		// Update last login tracking
		const meta = getSessionMetadata(req, userAgent)
		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				lastLoginAt: new Date(),
				lastLoginIp: meta.ip,
			},
		})

		// Create session
		return saveSession(req, user, meta)
	}

	/**
	 * Destroy the current session (logout).
	 *
	 * @param req - HTTP request object
	 * @returns true if session destroyed successfully
	 */
	async logout(req: Request): Promise<boolean> {
		return destroySession(req, this.config)
	}

	/**
	 * Get current session from Redis by session ID.
	 *
	 * @param req - HTTP request object
	 * @returns Session object or null if not found
	 */
	async findCurrent(req: Request): Promise<Session | null> {
		const sessionId = req.session.id
		const session = await this.redis.getJSON<Session>(this.key(sessionId))
		return session ? { ...session, id: sessionId } : null
	}

	/**
	 * List all sessions for the current user (excluding current session).
	 * Sorted by creation time (newest first).
	 *
	 * @param req - HTTP request object
	 * @param lng - Language code for i18n
	 * @returns Array of user sessions
	 * @throws NotFoundException if user not found in session
	 */
	async findByUser(req: Request, lng: Language): Promise<Session[]> {
		const userId = req.session.userId
		if (!userId) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		// Get all session keys
		const keys = await this.redis.keys(`${this.prefix}*`)
		if (keys.length === 0) return []

		// Bulk read session data
		const raw = (await this.redis.getClient().mGet(keys)) as (string | null)[]

		// Parse and filter by userId
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

		// Sort by creation time (descending)
		sessions.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))

		// Exclude current session
		const currentId = req.session?.id
		return sessions.filter(s => s.id !== currentId)
	}

	/**
	 * Clear session cookie from the client.
	 * Note: This does not remove the session from Redis.
	 *
	 * @param req - HTTP request object
	 * @returns true
	 */
	clear(req: Request): boolean {
		req.res?.clearCookie(this.cookieName)
		return true
	}

	/**
	 * Remove a specific session by ID.
	 * Prevents removal of the current session.
	 *
	 * @param req - HTTP request object
	 * @param id - Session ID to remove
	 * @param lng - Language code for i18n
	 * @returns true if removed successfully
	 * @throws ConflictException if trying to remove current session
	 * @throws InternalServerErrorException on Redis errors
	 */
	async remove(req: Request, id: string, lng: Language): Promise<boolean> {
		const currentId = req.session?.id

		if (currentId && currentId === id) {
			throw new ConflictException(
				this.i18n.t('auth.errors.session.cannot_delete_current', {
					lng,
					defaultValue: "You can't delete the current session",
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
import { User } from '@/modules/auth/account'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

/**
 * Login credentials input
 */
@InputType('LoginInput', {
	description: 'User credentials for authentication',
})
export class LoginInput {
	@Field({
		description: 'User email address',
	})
	email: string

	@Field({
		description: 'User password (min 8 characters)',
	})
	password: string
}

/**
 * Login response with optional access token and user data
 */
@ObjectType('LoginResponse', {
	description: 'Response after successful authentication',
})
export class LoginResponse {
	@Field({
		nullable: true,
		description: 'JWT access token (null if using cookie-based sessions)',
	})
	accessToken?: string

	@Field(() => User, {
		nullable: true,
		description: 'Authenticated user data',
	})
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
import { Field, ID, ObjectType } from '@nestjs/graphql'

/**
 * Geographic location information for a session
 */
@ObjectType('Location', {
	description: 'Geographic location information derived from IP address',
})
export class Location {
	@Field({
		description: 'Country name (e.g., "United States")',
	})
	country: string

	@Field({
		description: 'City name (e.g., "New York")',
	})
	city: string

	@Field({
		description: 'Latitude coordinate',
	})
	latitude: number

	@Field({
		description: 'Longitude coordinate',
	})
	longitude: number
}

/**
 * Device information parsed from User-Agent
 */
@ObjectType('Device', {
	description: 'Device information parsed from User-Agent header',
})
export class Device {
	@Field({
		description: 'Browser name and version (e.g., "Chrome 120.0")',
	})
	browser: string

	@Field({
		description: 'Operating system (e.g., "macOS 14.0")',
	})
	os: string

	@Field({
		description: 'Device type (desktop, mobile, tablet)',
	})
	type: string
}

/**
 * Session metadata including location, device, and IP
 */
@ObjectType('SessionMetadata', {
	description: 'Session metadata including location, device, and network information',
})
export class SessionMetadata {
	@Field(() => Location, {
		description: 'Geographic location of the session',
	})
	location: Location

	@Field(() => Device, {
		description: 'Device information',
	})
	device: Device

	@Field({
		description: 'IP address (IPv4 or IPv6)',
	})
	ip: string
}

/**
 * User session representing an active login
 */
@ObjectType('Session', {
	description: 'Active user session with security tracking',
})
export class Session {
	@Field(() => ID, {
		description: 'Unique session identifier (used for session management)',
	})
	id: string

	@Field({
		description: 'User ID associated with this session',
	})
	userId: string

	@Field(() => SessionMetadata, {
		description: 'Session metadata (location, device, IP)',
	})
	metadata: SessionMetadata

	@Field({
		nullable: true,
		description: 'Whether this session is from a trusted device (reduces 2FA friction)',
	})
	isTrusted?: boolean

	@Field({
		nullable: true,
		description: 'Risk score for this session (0-100): 0 = safe, 100 = suspicious',
	})
	riskScore?: number

	@Field({
		nullable: true,
		description: 'Whether 2FA has been verified for this session',
	})
	is2FAVerified?: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when 2FA was successfully verified',
	})
	verified2FAAt?: Date

	@Field({
		description: 'Session creation timestamp (ISO 8601 string)',
	})
	createdAt: string
}
```
