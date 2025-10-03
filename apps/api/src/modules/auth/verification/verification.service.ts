import { Request } from 'express'

import { I18nService, PrismaService } from '@/core'
import { MailService } from '@/modules/lib/mail'
import { generateToken, getSessionMetadata, saveSession } from '@/shared/utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ETokenType, type User } from '@prisma/__generated__'

import { VerificationInput, VerificationResponse } from './dtos'

@Injectable()
export class VerificationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly mail: MailService,
	) {}

	/**
	 * Verify account
	 * @param req -request
	 * @param input - input data
	 * @param userAgent - user agent
	 * @param lng - The language of the user
	 * @returns - user
	 */
	async verificationEmail(
		req: Request,
		input: VerificationInput,
		userAgent: string,
		lng: string,
	): Promise<VerificationResponse> {
		const { token } = input

		const existingToken = await this.prisma.token.findUnique({
			where: {
				token,
				type: ETokenType.EMAIL_VERIFY,
			},
		})

		if (!existingToken) {
			throw new NotFoundException(this.i18n.t('auth.errors.token.not_found', { lng }) || 'Token not found')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(this.i18n.t('auth.errors.token.expired', { lng }) || 'Token expired')
		}

		const user = await this.prisma.user.update({
			where: { id: existingToken.userId },
			data: { isEmailVerified: true },
		})

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: ETokenType.EMAIL_VERIFY,
			},
		})

		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	/**
	 * Function Generate new token or numeric code, and sent to email
	 * @param user - current user
	 * @param language - current language
	 * @returns - boolean
	 */
	async sendVerificationEmailToken(user: User, language: string) {
		const verificationToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY)

		await this.mail.sendVerificationEmailToken(user.email, verificationToken.token, language)
		return true
	}
}
