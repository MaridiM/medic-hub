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
			throw new NotFoundException(this.msg('auth.errors.user.not_found', 'User not found', { lng }))
		}

		const ok = await verify(user.password, data.password)
		if (!ok) {
			throw new NotFoundException(this.msg('auth.errors.password.invalid', 'Invalid password', { lng }))
		}

		if (!user.isEmailVerified) {
			// fire-and-forget повторная верификация (не блокируем логин)
			await this.verification.sendVerificationEmailToken(user, lng).catch(() => {})
			throw new BadRequestException(
				this.msg(
					'auth.errors.account.not_verified',
					'Account not verified. Please check your email for verification',
					{ lng },
				),
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
			throw new NotFoundException(this.msg('auth.errors.user.not_found', 'User not found', { lng }))
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
				this.msg('auth.errors.session.cannot_delete_current', 'You can’t delete the current session', { lng }),
			)
		}

		try {
			await this.redis.del(this.key(id))
			return true
		} catch {
			throw new InternalServerErrorException(this.msg('common.errors.unexpected', 'Unexpected error', { lng }))
		}
	}
}
