import { verify } from 'argon2'
import { Request } from 'express'

import { I18nService, PrismaService, RedisService } from '@/core'
import { MailService } from '@/modules/lib'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LoginInput, LoginResponse } from './inputs'
import { Session } from './models'

@Injectable()
export class SessionService {
	private readonly prefix: string

	constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService,
		private readonly i18n: I18nService,
		private readonly config: ConfigService,
		private readonly mailService: MailService,
	) {
		this.prefix = this.config.getOrThrow<string>('SESSION_FOLDER') ?? 'session:'
	}

	private key(sessionId: string): string {
		return `${this.prefix}${sessionId}`
	}

	/**
	 * Login user
	 * @param req - request
	 * @param userAgent - user agent
	 * @param data - login data
	 * @param language - language
	 * @returns login response
	 */
	async login(req: Request, userAgent: string, data: LoginInput, language: string): Promise<LoginResponse> {
		const user = await this.prisma.user.findUnique({ where: { email: data.email } })
		if (!user) {
			throw new NotFoundException(this.i18n.t('auth.user_not_found', { lng: language }))
		}

		const isPasswordValid = await verify(user.password, data.password)
		if (!isPasswordValid) {
			throw new NotFoundException(this.i18n.t('auth.invalid_password', { lng: language }))
		}

		const metadata = getSessionMetadata(req, userAgent)
		return saveSession(req, user, metadata)
	}

	/**
	 * Logout user
	 * @param req - request
	 * @returns boolean
	 */
	async logout(req: Request) {
		return destroySession(req, this.config)
	}

	/**
	 * Get current session
	 * @param req - request
	 * @returns current session
	 */
	async findCurrent(req: Request) {
		await this.mailService.sendVerificationEmailToken()
		const sessionId = req.session.id
		const session: Session = await this.redis.getJSON(this.key(sessionId))
		return {
			...session,
			id: sessionId,
		}
	}

	/**
	 * Clear current session from cookie
	 * @param req - request
	 * @returns boolean
	 */
	clear(req: Request) {
		req.res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))
		return true
	}

	/**
	 * Remove session from device
	 * @param req - request
	 * @returns boolean
	 */
	async remove(req: Request, id: string, language: string) {
		if (req.session.id === id) {
			throw new ConflictException(this.i18n.t('auth.cannot_delete_session', { lng: language }))
		}
		await this.redis.del(this.key(id))
		return true
	}
}
