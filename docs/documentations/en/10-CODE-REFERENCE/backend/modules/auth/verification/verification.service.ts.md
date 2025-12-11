# File: modules\auth\verification\verification.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/verification/verification.service.ts`

## Category
Backend

## File Type
TS (verification.service.ts)

## Size
6117 characters, 194 lines

## Full Code

```typescript
import { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService, SmsService } from '@/core/provider'
import { generateToken, getSessionMetadata, saveSession } from '@/shared/utils'
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { ETokenType, User } from '@prisma/__generated__'

import { VerificationInput, VerificationResponse } from './dtos'

@Injectable()
export class VerificationService extends CoreService {
	private readonly logger = new Logger(VerificationService.name)

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
	 * @param input GraphQL input containing the tokenqqqqqqqqq
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
		return this.sendVerificationToken(user, 'email', 'link', lng)
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
		return this.sendVerificationToken(user, 'email', 'code', lng)
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
		return this.sendVerificationToken(user, 'sms', 'code', lng)
	}

	/**
	 * Universal method to generate and send a verification token.
	 *
	 * @param user - The target user
	 * @param channel - 'email' or 'sms'
	 * @param type - 'link' (UUID) or 'code' (numeric)
	 * @param lng - Language for notifications
	 * @returns true on success
	 * @throws InternalServerErrorException on sending failure
	 */
	private async sendVerificationToken(
		user: User,
		channel: 'email' | 'sms',
		type: 'link' | 'code',
		lng: Language,
	): Promise<boolean> {
		const isUUID = type === 'link'
		const tokenType = ETokenType.EMAIL_VERIFY

		const token = await generateToken(this.prisma, user, tokenType, isUUID)

		if (channel === 'sms' && !user.phone) {
			throw new BadRequestException(
				this.i18n.t('sms.errors.no_phone_for_sms', {
					lng,
					userId: user.id,
					defaultValue: `User ${user.id} has no phone number for SMS verification.`,
				}),
			)
		}

		try {
			if (channel === 'email') {
				if (type === 'link') {
					await this.mail.sendVerificationEmailToken(user.email, token.token, lng)
				} else {
					await this.mail.sendOtpCodeEmail(user.email, token.token, lng)
				}
			} else {
				// Если ссылки по SMS не поддерживаем — здесь можно добавить явный запрет
				// if (type === 'link') { throw new BadRequestException('Links over SMS are not supported'); }
				await this.sms.sendOtpSMS(user.phone, token.token, lng)
			}
			return true
		} catch (error) {
			this.logger.error(
				`Failed to send verification token for user ${user.id} via ${channel}`,
				(error as Error)?.stack,
			)
			throw new InternalServerErrorException(
				this.i18n.t('mail.errors.message_send_failed', {
					lng,
					defaultValue: 'Failed to send the message.',
				}),
			)
		}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.477Z*
