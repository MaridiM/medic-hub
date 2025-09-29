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
	 * @param language - language
	 * @returns current session
	 */
	async findCurrent(req: Request, language: string) {
		// await this.mailService.sendVerificationEmailToken('maridim92@gmail.com', '123314', language)
		const sessionId = req.session.id
		const session: Session = await this.redis.getJSON(this.key(sessionId))
		return {
			...session,
			id: sessionId,
		}
	}

	/**
	 * Get all sessions for current user
	 * @param req - request
	 * @returns user session
	 */
	async findByUser(req: Request) {
		const userId = req.session.userId

		if (!userId) {
			throw new NotFoundException(this.i18n.t('auth.user_not_found') || 'User not found')
		}

		// 1) Собираем ключи через SCAN (без блокировки Redis)
		const keys: string[] = await this.redis.keys('*')

		if (keys.length === 0) return []

		// 2) Читаем все значения разом (MGET) — существенно быстрее, чем get в цикле
		const rawList: (string | Record<string, unknown>)[] = await this.redis.getClient().mGet(keys)
		// Либо типобезопасно по одному: await this.redis.getJSON<SessionRecord>(key)

		// 3) Парсим и фильтруем по userId
		const userSessions = keys.flatMap((key, i) => {
			const raw = rawList[i] as string | null
			if (typeof raw !== 'string') return []

			let session: Session | null = null
			try {
				session = JSON.parse(raw) as Session
			} catch {
				return [] // пропускаем битые записи
			}

			if (session?.userId !== userId) return []

			const id = key.startsWith(this.prefix) ? key.slice(this.prefix.length) : key
			return [{ ...session, id }]
		})

		// 4) Сортировка по времени создания (новые сверху)
		userSessions.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

		// 5) Исключаем текущую сессию пользователя
		type RequestWithSessionId = Request & { sessionID?: string }
		const currentId = (req.session as Session | undefined)?.id ?? (req as RequestWithSessionId).sessionID
		return userSessions.filter(s => s.id !== currentId)
	}

	/**
	 * Clear current session from cookie
	 * @param req - request
	 * @returns boolean
	 */
	clear(req: Request) {
		req.res.clearCookie(this.prefix)
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
