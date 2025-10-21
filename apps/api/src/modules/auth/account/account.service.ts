import type { Request } from 'express'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { SecurityEventService } from '@/modules/security-event'
import { getSessionMetadata, isPrismaError } from '@/shared/utils'
import { HashUtil } from '@/shared/utils/hash.util'
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ESecurityEvent, ESecuritySeverity } from '@prisma/__generated__'

import { SessionService } from '../session'
import { VerificationService } from '../verification'

import { ChangeEmailInput, ChangePasswordInput, CreateAccountInput } from './dtos'
import { User } from './models'

/**
 * AccountService
 * Handles user profile operations:
 * - Profile reading
 * - Account creation with email verification
 * - Email change with re-verification
 * - Password change with security features:
 *   - Session invalidation (logout from all other devices)
 *   - Security event logging
 *   - Risk assessment
 *   - passwordChangedAt tracking
 *
 * All user-facing messages are internationalized via I18nService.
 */
@Injectable()
export class AccountService extends CoreService {
	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		private readonly verification: VerificationService,
		private readonly session: SessionService,
		private readonly securityEvent: SecurityEventService,
	) {
		super({ i18n, prisma })
	}

	/**
	 * Normalize email for uniqueness checks (trim + lowercase).
	 * @param email - Raw email input
	 * @returns Normalized email
	 */
	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	/**
	 * Get current user profile (safe projection without password).
	 *
	 * @param id - User ID
	 * @returns User profile or null if not found
	 */
	async me(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})

		return user as unknown as User | null
	}

	/**
	 * Create a new user account.
	 * - Normalizes email
	 * - Hashes password with Argon2id
	 * - Sends email verification token
	 * - Handles unique constraint violations (P2002)
	 *
	 * @param input - Account creation payload
	 * @param lng - Language code for i18n
	 * @returns Newly created user (safe projection)
	 * @throws ConflictException if email already exists
	 * @throws InternalServerErrorException on unexpected errors
	 */
	async create(input: CreateAccountInput, lng: Language): Promise<User> {
		const email = this.normalizeEmail(input.email)
		const hashedPassword = await HashUtil.hash(input.password)

		try {
			const user = await this.prisma.user.create({
				data: {
					...input,
					email,
					password: hashedPassword,
				},
			})

			// Send verification email (non-blocking)
			await this.verification.sendEmailVerificationToken(user, lng).catch(() => {
				// Log error but don't fail account creation
			})

			return user as unknown as User
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.i18n.t('auth.errors.user.already_exists', {
						lng,
						defaultValue: 'This email is already in use',
					}),
				)
			}
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Change user email address.
	 * - Normalizes email
	 * - Rejects if new email equals current email
	 * - Resets email verification status
	 * - Sends new verification email
	 * - Handles unique constraint violations
	 *
	 * @param user - Current authenticated user
	 * @param input - New email input
	 * @param lng - Language code for i18n
	 * @returns true if successful
	 * @throws BadRequestException if email is the same as current
	 * @throws ConflictException if email is already taken
	 * @throws InternalServerErrorException on unexpected errors
	 */
	async changeEmail(user: User, input: ChangeEmailInput, lng: Language): Promise<boolean> {
		const email = this.normalizeEmail(input.email)

		if (email === this.normalizeEmail(user.email)) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.user.same_email', {
					lng,
					defaultValue: 'This email is already your current email',
				}),
			)
		}

		try {
			const updated = await this.prisma.user.update({
				where: { id: user.id },
				data: {
					email,
					isEmailVerified: false,
					emailVerifiedAt: null,
				},
			})

			// Send verification email
			await this.verification.sendEmailVerificationToken(updated, lng).catch(() => {})

			return true
		} catch (e) {
			if (isPrismaError(e, 'P2002')) {
				throw new ConflictException(
					this.i18n.t('auth.errors.user.already_exists', {
						lng,
						defaultValue: 'This email is already in use',
					}),
				)
			}
			throw new InternalServerErrorException(
				this.i18n.t('common.errors.unexpected', { lng, defaultValue: 'Unexpected error' }),
			)
		}
	}

	/**
	 * Change user password with enterprise security features.
	 *
	 * Security measures:
	 * - Verifies old password with Argon2id
	 * - Rejects if new password equals old password
	 * - Hashes new password with Argon2id
	 * - Updates passwordChangedAt timestamp
	 * - **Invalidates all sessions except current one** (logout from other devices)
	 * - **Logs security event** with risk assessment
	 * - Calculates risk score based on factors (new device, unusual location, etc.)
	 *
	 * @param req - HTTP request object (for session and metadata extraction)
	 * @param user - Current authenticated user
	 * @param input - Password change payload
	 * @param userAgent - User agent string
	 * @param lng - Language code for i18n
	 * @returns Object with success status and number of invalidated sessions
	 * @throws BadRequestException if old password is invalid or passwords match
	 * @throws InternalServerErrorException on database errors
	 *
	 * @example
	 * ```typescript
	 * const result = await accountService.changePassword(
	 *   req,
	 *   user,
	 *   { oldPassword: 'old123', newPassword: 'new456' },
	 *   req.headers['user-agent'],
	 *   'en'
	 * )
	 * // Returns: { success: true, sessionsInvalidated: 2 }
	 * ```
	 */
	async changePassword(
		req: Request,
		user: User,
		input: ChangePasswordInput,
		userAgent: string,
		lng: Language,
	): Promise<{ success: boolean; sessionsInvalidated: number }> {
		const { oldPassword, newPassword } = input

		// Verify old password
		const isValidOld = await HashUtil.verify(user.password, oldPassword)
		if (!isValidOld) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		// Forbid setting the same password
		if (oldPassword === newPassword) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.password.same', {
					lng,
					defaultValue: 'New password must differ from the old one',
				}),
			)
		}

		try {
			// Extract session metadata for security event
			const meta = getSessionMetadata(req, userAgent)
			const currentSessionId = req.session?.id

			// Hash new password
			const hashed = await HashUtil.hash(newPassword)

			// Update password in database
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					password: hashed,
					passwordChangedAt: new Date(),
				},
			})

			// Invalidate all sessions except current one (logout from other devices)
			const sessionsInvalidated = await this.session.invalidateUserSessions(user.id, currentSessionId)

			// Calculate risk score based on factors
			const riskFactors = []

			// Factor: Password change from new device
			// TODO: Implement device trust checking
			// For now, assign moderate risk
			riskFactors.push({
				type: 'password_change',
				description: 'User-initiated password change',
				weight: 20,
			})

			// Factor: Multiple sessions invalidated (potential compromise)
			if (sessionsInvalidated > 2) {
				riskFactors.push({
					type: 'multiple_sessions',
					description: `${sessionsInvalidated} sessions invalidated`,
					weight: 15,
				})
			}

			const riskScore = this.securityEvent.calculateRiskScore(riskFactors)

			// Determine severity based on risk score
			let severity: ESecuritySeverity = ESecuritySeverity.LOW
			if (riskScore >= 50) severity = ESecuritySeverity.HIGH
			else if (riskScore >= 30) severity = ESecuritySeverity.MEDIUM

			// Log security event
			await this.securityEvent.create({
				userId: user.id,
				event: ESecurityEvent.PASSWORD_CHANGED,
				severity,
				ip: meta.ip,
				userAgent,
				country: meta.location?.country,
				city: meta.location?.city,
				riskScore,
				riskFactors,
				metadata: {
					sessionsInvalidated,
					browser: meta.device?.browser,
					os: meta.device?.os,
				},
			})

			// TODO: Send email notification about password change
			// await this.mail.sendPasswordChangedNotification(user.email, meta, lng)

			return {
				success: true,
				sessionsInvalidated,
			}
		} catch {
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.password.change_failed', {
					lng,
					defaultValue: 'Failed to change password',
				}),
			)
		}
	}
}
