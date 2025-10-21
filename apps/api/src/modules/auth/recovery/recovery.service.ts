import { hash } from 'argon2'
import { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { MailService,} from '@/core/provider'
import { SecurityEventService } from '@/modules/security-event'
import { generateToken, getSessionMetadata } from '@/shared/utils'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ESecurityEvent, ESecuritySeverity, ETokenType, User } from '@prisma/__generated__'

import { NewPasswordInput, ResetPasswordInput } from './dtos'

/**
 * RecoveryService
 *
 * Handles password recovery operations:
 * - Password reset request (email with token)
 * - Password reset completion (token validation and new password)
 * - Security event logging for all operations
 * - Email notifications for password changes
 *
 * Security features:
 * - Email enumeration protection (always returns success)
 * - Security event tracking with risk assessment
 * - Email notifications for password reset confirmation
 * - Token-based one-time password reset
 */
@Injectable()
export class RecoveryService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly mail: MailService,
		private readonly securityEvent: SecurityEventService,
	) {
		super({ i18n, prisma })
	}

	/** Normalize email for uniqueness checks (trim + lower-case). */
	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	/**
	 * Start password reset flow:
	 * 1) Normalize email and check that the user exists
	 * 2) Generate a one-time PASSWORD_RESET token
	 * 3) Send reset email (non-blocking: mail errors won't fail the flow)
	 * 4) Log security event for audit trail
	 * 5) Always return true (email enumeration protection)
	 *
	 * @param req - Express request (for IP/geo/browser meta)
	 * @param input - ResetPasswordInput { email }
	 * @param userAgent - Raw User-Agent header
	 * @param lng - Language code for i18n
	 * @returns true if the flow was initiated
	 * @throws NotFoundException if user is not found
	 * @throws InternalServerErrorException on unexpected DB errors
	 */
	async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		// Extract metadata early for security event logging
		const meta = getSessionMetadata(req, userAgent)

		// 1) Check user existence with minimal projection
		const user = await this.prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true },
		})

		// Email enumeration protection: log event but don't reveal if user exists
		if (!user) {
			// Log attempted reset for non-existent user (potential reconnaissance)
			await this.securityEvent.create({
				userId: 'unknown', // Special marker for non-existent users
				event: ESecurityEvent.PASSWORD_RESET_REQUESTED,
				severity: ESecuritySeverity.LOW,
				ip: meta.ip,
				userAgent,
				country: meta.location?.country,
				city: meta.location?.city,
				metadata: {
					email,
					userExists: false,
					reason: 'email_enumeration_protection',
				},
			})

			// Return success to prevent email enumeration
			return true
		}

		try {
			// 2) Generate/reset token for this user
			const token = await generateToken(this.prisma, user as User, ETokenType.PASSWORD_RESET)

			// 3) Send email (do not fail the flow if mailer throws)
			try {
				await this.mail.sendPasswordResetToken(user.email, token.token, meta, lng)
			} catch (err) {
				// Log mailer error but don't block the flow
				// Error is already logged in MailService
			}

			// 4) Log security event
			await this.securityEvent.create({
				userId: user.id,
				event: ESecurityEvent.PASSWORD_RESET_REQUESTED,
				severity: ESecuritySeverity.MEDIUM,
				ip: meta.ip,
				userAgent,
				country: meta.location?.country,
				city: meta.location?.city,
				metadata: {
					email: user.email,
					tokenId: token.id,
					browser: meta.device?.browser,
					os: meta.device?.os,
				},
			})

			// 5) Indicate success to the client
			return true
		} catch {
			// Wrap any unexpected persistence errors
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Set a new password by reset token:
	 * - Validates token existence and type
	 * - Checks expiration
	 * - Hashes and saves the new password
	 * - Removes the used token
	 * - Logs security event
	 * - Sends confirmation email (non-blocking)
	 *
	 * Note: Request context (IP, userAgent) is not available in this method
	 * because it's called without authentication. Metadata will be logged
	 * as 'unknown' in security events.
	 *
	 * @param input - DTO with `token` and `password`
	 * @param lng - i18n language code
	 * @returns `true` on success
	 * @throws NotFoundException if token not found
	 * @throws BadRequestException if token expired
	 */
	async newPassword(input: NewPasswordInput, lng: Language): Promise<boolean> {
		const { password, token } = input

		// token is unique in the schema -> find by token only
		const t = await this.prisma.token.findUnique({
			where: { token },
			select: { id: true, type: true, expiresIn: true, userId: true },
		})

		if (!t || t.type !== ETokenType.PASSWORD_RESET) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.token.not_found', { lng, defaultValue: 'Token not found' }),
			)
		}

		if (new Date(t.expiresIn) < new Date()) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.token.expired', { lng, defaultValue: 'Token expired' }),
			)
		}

		try {
			const hashed = await hash(password)

			// Get user email for notification
			const user = await this.prisma.user.findUnique({
				where: { id: t.userId },
				select: { id: true, email: true },
			})

			if (!user) {
				throw new NotFoundException(
					this.i18n.t('auth.errors.user.not_found', { lng, defaultValue: 'User not found' }),
				)
			}

			// Update password and consume the token
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: t.userId },
					data: { password: hashed, passwordChangedAt: new Date() },
					select: { id: true },
				}),
				this.prisma.token.delete({ where: { id: t.id } }),
			])

			// Log security event (without detailed metadata since no req context)
			await this.securityEvent.create({
				userId: user.id,
				event: ESecurityEvent.PASSWORD_RESET_COMPLETED,
				severity: ESecuritySeverity.HIGH,
				ip: 'unknown', // No request context available
				userAgent: 'unknown',
				metadata: {
					tokenId: t.id,
					method: 'password_reset_token',
				},
			})

			// Send confirmation email (non-blocking)
			// Note: metadata will have 'unknown' values since we don't have request context
			await this.mail
				.sendPasswordResetConfirmation(
					user.email,
					{
						ip: 'unknown',
						location: undefined,
						device: undefined,
					},
					lng,
				)
				.catch(err => {
					// Email failure should not fail password reset
					// Error is already logged in MailService
				})

			return true
		} catch (error) {
			// If it's one of our known errors, re-throw it
			if (error instanceof NotFoundException || error instanceof BadRequestException) {
				throw error
			}

			// Otherwise wrap in generic error
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.password.change_failed', { lng, defaultValue: 'Failed to change password' }),
			)
		}
	}
}
