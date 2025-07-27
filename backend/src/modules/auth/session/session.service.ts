import { verify } from 'argon2'
import { Request } from 'express'

import { I18nService, PrismaService } from '@/core'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LoginInput, LoginResponse } from './inputs'

@Injectable()
export class SessionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly configService: ConfigService,
	) {}

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
		return destroySession(req, this.configService)
	}
}
