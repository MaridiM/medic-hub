# File: modules\auth\session\session.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/session/session.service.ts`

## Category
Backend

## File Type
TS (session.service.ts)

## Size
9563 characters, 315 lines

## Full Code

```typescript
import type { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { AccountLockService } from '@/modules/security'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
import { HashUtil } from '@/shared/utils/hash.util'
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
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
 * - Bulk session invalidation (for security events like password changes)
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
		private readonly accountLockService: AccountLockService,
	) {
		super({ i18n, prisma, redis, config })
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

		const meta = getSessionMetadata(req, userAgent)

		if (!user) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
			)
		}

		// ✅ 1. Check if account is locked BEFORE attempting password verification
		const isLocked = await this.accountLockService.isAccountLocked(user.id)
		if (isLocked) {
			throw new ForbiddenException(
				this.i18n.t('auth.errors.account.locked', {
					lng,
					defaultValue: 'Account is locked. Please try again later or reset your password.',
				}),
			)
		}

		const ok = await HashUtil.verify(user.password, data.password)
		if (!ok) {
			// ✅ 2. Increment failed attempts on password mismatch
			await this.accountLockService.incrementFailedAttempts(user, meta.ip, userAgent, lng)
			throw new NotFoundException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		// ✅ 3. Clear failed attempts counter on successful login
		await this.accountLockService.clearFailedAttempts(user.id)

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

	/**
	 * Invalidate all sessions for a specific user.
	 * Used for security operations like password changes or account compromise.
	 *
	 * @param userId - User ID whose sessions should be invalidated
	 * @param excludeSessionId - Optional session ID to keep active (e.g., current session)
	 * @returns Number of sessions invalidated
	 *
	 * @example
	 * ```typescript
	 * // Invalidate all sessions except current one after password change
	 * const count = await sessionService.invalidateUserSessions(
	 *   user.id,
	 *   req.session.id
	 * )
	 * // Returns: 3 (if user had 3 other active sessions)
	 * ```
	 */
	async invalidateUserSessions(userId: string, excludeSessionId?: string): Promise<number> {
		// Get all session keys
		const keys = await this.redis.keys(`${this.prefix}*`)
		if (keys.length === 0) return 0

		// Bulk read session data
		const raw = (await this.redis.getClient().mGet(keys)) as (string | null)[]

		// Find sessions belonging to this user
		const sessionsToDelete: string[] = []

		keys.forEach((key, i) => {
			const s = raw[i]
			if (!s) return

			try {
				const parsed = JSON.parse(s) as Session
				if (parsed?.userId !== userId) return

				const sessionId = key.slice(this.prefix.length)

				// Skip excluded session (usually current session)
				if (excludeSessionId && sessionId === excludeSessionId) return

				sessionsToDelete.push(key)
			} catch {
				// Skip invalid session data
			}
		})

		// Delete sessions in bulk
		if (sessionsToDelete.length > 0) {
			await this.redis.getClient().del(sessionsToDelete)
		}

		return sessionsToDelete.length
	}
}

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.450Z*
