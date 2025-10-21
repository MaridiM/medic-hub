import { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService, SmsService } from '@/core/provider'
import { generateToken, getSessionMetadata, saveSession } from '@/shared/utils'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ETokenType, User } from '@prisma/__generated__'

import { VerificationInput, VerificationResponse } from './dtos'

@Injectable()
export class VerificationService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly mail: MailService,
		private readonly sms: SmsService,
	) {
		super({ i18n, prisma })
	}

	/**
	 * Verify a user's email by one-time token, consume the token, and start a session.
	 *
	 * Flow:
	 * 1) Fetch token by value (unique). Reject if missing/wrong type/expired.
	 * 2) Atomically: mark user as verified and delete the token.
	 * 3) Build session metadata and persist session (cookie/redis).
	 *
	 * @param req Express request (to save session/cookies)
	 * @param input GraphQL input containing the token
	 * @param userAgent Raw User-Agent header (for session metadata)
	 * @param lng Language code for i18n
	 * @returns VerificationResponse (session info)
	 * @throws NotFoundException if token not found or wrong type
	 * @throws BadRequestException if token expired
	 * @throws InternalServerErrorException for unexpected DB/mail issues
	 */
	async verificationEmail(
		req: Request,
		input: VerificationInput,
		userAgent: string,
		lng: Language,
	): Promise<VerificationResponse> {
		const { token } = input

		// 1) Load token by unique value
		const t = await this.prisma.token.findUnique({
			where: { token },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})

		if (!t || t.type !== ETokenType.EMAIL_VERIFY) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.token.not_found', { lng, defaultValue: 'Token not found' }),
			)
		}

		if (new Date(t.expiresIn) < new Date()) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.token.expired', { lng, defaultValue: 'Token expired' }),
			)
		}

		// 2) Atomically verify and consume the token
		const [updatedUser] = await this.prisma.$transaction([
			this.prisma.user.update({
				where: { id: t.userId },
				data: { isEmailVerified: true },
				// select минимален, но достаточно для saveSession
				select: {
					id: true,
					email: true,
					fullName: true,
					firstName: true,
					lastName: true,
					isEmailVerified: true,
					createdAt: true,
					updatedAt: true,
				},
			}),
			this.prisma.token.delete({ where: { id: t.id } }),
		])

		// 3) Create session
		const meta = getSessionMetadata(req, userAgent)
		return saveSession(req, updatedUser as User, meta)
	}

	/**
	 * Generate and send a fresh verification token to user's email.
	 *
	 * @param user The target user
	 * @param lng Language code for email templates
	 * @returns true on success
	 * @throws InternalServerErrorException if sending email fails
	 */
	async sendEmailVerificationToken(user: User, lng: Language): Promise<boolean> {
		const verificationToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY)

		try {
			await this.mail.sendVerificationEmailToken(user.email, verificationToken.token, lng)
			return true
		} catch {
			// If mailer fails — surface a clear error (you may log internally as well)
			throw new InternalServerErrorException(
				this.i18n.t('mail.errors.message_send_failed', {
					lng,
					defaultValue: 'Failed to send the message.',
				}),
			)
		}
	}

	/**
	 * Generate and send a fresh verification token to user's email.
	 *
	 * @param user The target user
	 * @param lng Language code for email templates
	 * @returns true on success
	 * @throws InternalServerErrorException if sending email fails
	 */
	async sendEmailVerificationOtpToken(user: User, lng: Language): Promise<boolean> {
		const verificationOtpToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY, false)

		try {
			await this.mail.sendOtpCodeEmail(user.email, verificationOtpToken.token, lng)
			return true
		} catch {
			// If mailer fails — surface a clear error (you may log internally as well)
			throw new InternalServerErrorException(
				this.i18n.t('mail.errors.message_send_failed', {
					lng,
					defaultValue: 'Failed to send the message.',
				}),
			)
		}
	}

	/**
	 * Generate and send a fresh verification token to user's email.
	 *
	 * @param user The target user
	 * @param lng Language code for email templates
	 * @returns true on success
	 * @throws InternalServerErrorException if sending email fails
	 */
	async sendSmsVerificationOtpToken(user: User, lng: Language): Promise<boolean> {
		const verificationOtpToken = await generateToken(this.prisma, user, ETokenType.EMAIL_VERIFY, false)

		try {
			await this.sms.sendOtpSMS(user.email, verificationOtpToken.token, lng)
			return true
		} catch {
			// If mailer fails — surface a clear error (you may log internally as well)
			throw new InternalServerErrorException(
				this.i18n.t('sms.errors.message_send_failed', {
					lng,
					defaultValue: 'Failed to send the message.',
				}),
			)
		}
	}
}
