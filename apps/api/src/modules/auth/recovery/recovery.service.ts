import { hash } from 'argon2'
import { Request } from 'express'

import { I18nService, PrismaService } from '@/core'
import { MailService } from '@/modules/lib'
import { generateToken, getSessionMetadata } from '@/shared/utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ETokenType } from '@prisma/__generated__'

import { NewPasswordInput, ResetPasswordInput } from './dtos'

@Injectable()
export class RecoveryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mail: MailService,
		private readonly i18n: I18nService,
	) {}

	/**
	 * Method for reset password and send mail
	 * @param req - reques
	 * @param input - user input
	 * @param userAgent - user agent
	 * @param lng - The language of the user
	 * @returns boolean
	 */
	async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string, lng: string) {
		const { email } = input

		const user = await this.prisma.user.findUnique({
			where: { email },
		})

		if (!user) {
			throw new NotFoundException(this.i18n.t('auth.errors.user.not_found', { lng }) || 'User not found')
		}

		const resetToken = await generateToken(this.prisma, user, ETokenType.PASSWORD_RESET)

		const metadata = getSessionMetadata(req, userAgent)

		const messageIsSent = await this.mail.sendPasswordResetToken(user.email, resetToken.token, metadata, lng)
		console.log('messageIsSent', messageIsSent)
		return true
	}

	/**
	 * Method for cahnge password
	 * @param input - user input
	 * @param lng - The language of the user
	 * @returns boolean
	 */
	async newPassword(input: NewPasswordInput, lng: string) {
		const { password, token } = input

		const existingToken = await this.prisma.token.findUnique({
			where: {
				token,
				type: ETokenType.PASSWORD_RESET,
			},
		})

		if (!existingToken) {
			throw new NotFoundException(this.i18n.t('auth.errors.token.not_found', { lng }) || 'Token not found')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(this.i18n.t('auth.errors.token.expired', { lng }) || 'Token expired')
		}

		await this.prisma.user.update({
			where: { id: existingToken.userId },
			data: { password: await hash(password) },
		})

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: ETokenType.PASSWORD_RESET,
			},
		})

		return true
	}
}
