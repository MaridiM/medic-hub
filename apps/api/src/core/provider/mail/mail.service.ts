import { isEmail } from 'class-validator'
import { promises as dns } from 'dns'

import { CLIENT_URL, PATHS } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { ISessionMetadata } from '@/shared/types'
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { E2FAMethod } from '@prisma/__generated__'
import { render } from '@react-email/components'

import { IEmailProvider } from './providers'
import {
	BackupCodesRegeneratedTemplate,
	DeviceRevokedByAdminTemplate,
	LowBackupCodesTemplate,
	NewDeviceLoginTemplate,
	OtpCodeTemplate,
	PasswordChangedTemplate,
	PasswordResetConfirmationTemplate,
	ResetPasswordTemplate,
	SuspiciousActivityTemplate,
	TwoFADisabledByAdminTemplate,
	TwoFADisabledTemplate,
	TwoFAMethodAddedTemplate,
	TwoFAMethodRemovedTemplate,
	VerificationEmailTemplate,
} from './templates'

const DISPOSABLE_DOMAINS = new Set(['10minutemail.com', 'temp-mail.org', 'mailinator.com'])

/**
 * Mail Service
 *
 * Centralized email sending service with:
 * - Email validation and reputation checking
 * - Disposable email detection
 * - DNS MX record validation
 * - Bounce and unsubscribe tracking
 * - Security notification templates
 * - React Email rendering for modern, responsive emails
 */
@Injectable()
export class MailService extends CoreService {
	private readonly logger = new Logger(MailService.name)

	constructor(
		i18n: I18nService,
		@Inject(IEmailProvider) private readonly emailProvider: IEmailProvider,
	) {
		super({ i18n })
	}

	// ==================== Email Validation & Reputation ====================

	/**
	 * A guard method to check if an email can and should be sent.
	 */
	async canSendEmail(email: string): Promise<boolean> {
		const check = await this.checkEmailSendability(email)
		return check.canSend
	}

	/**
	 * Detailed email sendability check with reason
	 */
	private async checkEmailSendability(email: string): Promise<{ canSend: boolean; reason?: string }> {
		if (!isEmail(email)) {
			return { canSend: false, reason: 'invalid_format' }
		}

		const domain = email.split('@')[1]
		if (DISPOSABLE_DOMAINS.has(domain.toLowerCase())) {
			return { canSend: false, reason: 'disposable_email_provider' }
		}

		const userState = await this.prisma.user.findUnique({
			where: { email },
			select: { isUnsubscribed: true, emailBouncedAt: true },
		})

		if (userState?.isUnsubscribed) {
			return { canSend: false, reason: 'user_unsubscribed' }
		}

		if (userState?.emailBouncedAt) {
			return { canSend: false, reason: 'address_hard_bounced' }
		}

		try {
			const addresses = await dns.resolveMx(domain)
			if (!addresses || addresses.length === 0) {
				return { canSend: false, reason: 'domain_has_no_mx_records' }
			}
		} catch (error) {
			if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
				this.logger.warn(`DNS lookup failed for domain: ${domain}.`)
				return { canSend: false, reason: 'domain_not_found' }
			}
			this.logger.error(`DNS lookup for ${domain} failed unexpectedly:`, error)
		}

		return { canSend: true }
	}

	/**
	 * A private helper to wrap `canSendEmail` and throw an exception on failure.
	 */
	private async ensureCanSend(email: string) {
		const check = await this.checkEmailSendability(email)
		if (!check.canSend) {
			const message = `Skipping email to ${email}. Reason: ${check.reason}`
			this.logger.warn(message)
			throw new BadRequestException(message)
		}
	}

	// ==================== Authentication Emails ====================

	async sendVerificationEmailToken(email: string, token: string, lng: Language) {
		await this.ensureCanSend(email)
		const url = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
		const html = await render(VerificationEmailTemplate({ url, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.verification_email.subject', { lng })
		return this.sendMail(email, subject, html)
	}

	async sendOtpCodeEmail(email: string, code: string, lng: Language) {
		await this.ensureCanSend(email)
		const html = await render(OtpCodeTemplate({ code, i18n: this.i18n, lng }))
		const subject = this.i18n.t('mail.otp_code.subject', { lng, defaultValue: 'Your Verification Code' })
		return this.sendMail(email, subject, html)
	}

	/**
	 * Send password reset token with secure link.
	 *
	 * This email is sent when a user requests to reset their forgotten password.
	 * Contains a time-limited token link and request metadata for security.
	 *
	 * @param email - Recipient email address
	 * @param token - Password reset token UUID
	 * @param metadata - Session metadata (IP, location, device)
	 * @param lng - Language code for template selection
	 *
	 * @example
	 * ```typescript
	 * await mailService.sendPasswordResetToken(
	 *   'user@example.com',
	 *   'token-uuid-here',
	 *   {
	 *     ip: '192.168.1.1',
	 *     location: { country: 'USA', city: 'New York' },
	 *     device: { browser: 'Chrome', os: 'Windows' }
	 *   },
	 *   'en'
	 * )
	 * ```
	 */
	async sendPasswordResetToken(email: string, token: string, metadata: ISessionMetadata, lng: Language) {
		try {
			await this.ensureCanSend(email)

			const url: string = PATHS.RESET_PASSWORD(CLIENT_URL, token)
			const html = await render(ResetPasswordTemplate({ url, metadata, i18n: this.i18n, lng }))
			const subject = this.i18n.t('mail.reset_password.subject', { lng, defaultValue: 'Reset your password' })

			await this.sendMail(email, subject, html)

			this.logger.log(`Password reset token sent to ${email}`)
		} catch (error) {
			this.logger.error(`Failed to send password reset token to ${email}`, error)
			// Re-throw to allow caller to handle
			throw error
		}
	}

	// ==================== Password Management Emails ====================

	/**
	 * Send notification about successful password change.
	 *
	 * This email alerts users when their password has been changed,
	 * providing security details and a link to report unauthorized access.
	 *
	 * @param email - Recipient email address
	 * @param metadata - Session metadata (IP, location, device, timestamp)
	 * @param lng - Language code for template selection
	 *
	 * @example
	 * ```typescript
	 * await mailService.sendPasswordChangedNotification(
	 *   'user@example.com',
	 *   {
	 *     ip: '192.168.1.1',
	 *     location: { country: 'USA', city: 'New York' },
	 *     device: { browser: 'Chrome', os: 'Windows' }
	 *   },
	 *   'en'
	 * )
	 * ```
	 */
	async sendPasswordChangedNotification(email: string, metadata: ISessionMetadata, lng: Language): Promise<void> {
		try {
			await this.ensureCanSend(email)

			const html = await render(PasswordChangedTemplate({ metadata, i18n: this.i18n, lng }))
			const subject = this.i18n.t('mail.password_changed.subject', {
				lng,
				defaultValue: 'Your password was changed',
			})

			await this.sendMail(email, subject, html)

			this.logger.log(`Password changed notification sent to ${email}`)
		} catch (error) {
			this.logger.error(`Failed to send password changed notification to ${email}`, error)
			// Non-blocking: do not throw error, just log it
		}
	}

	/**
	 * Send confirmation after successful password reset.
	 *
	 * This email confirms that the password reset process has been completed
	 * and provides security recommendations.
	 *
	 * @param email - Recipient email address
	 * @param metadata - Session metadata (IP, location, device, timestamp)
	 * @param lng - Language code for template selection
	 *
	 * @example
	 * ```typescript
	 * await mailService.sendPasswordResetConfirmation(
	 *   'user@example.com',
	 *   {
	 *     ip: '192.168.1.1',
	 *     location: { country: 'USA', city: 'New York' },
	 *     device: { browser: 'Chrome', os: 'Windows' }
	 *   },
	 *   'en'
	 * )
	 * ```
	 */
	async sendPasswordResetConfirmation(email: string, metadata: ISessionMetadata, lng: Language): Promise<void> {
		try {
			await this.ensureCanSend(email)

			const enable2faUrl = `${CLIENT_URL}/settings/security/2fa`
			const securityUrl = `${CLIENT_URL}/security/activity`

			const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US', {
				dateStyle: 'long',
				timeStyle: 'short',
			})

			const html = await render(
				PasswordResetConfirmationTemplate({
					enable2faUrl,
					securityUrl,
					timestamp,
					metadata,
					i18n: this.i18n,
					lng,
				}),
			)
			const subject = this.i18n.t('mail.password_reset_confirmation.subject', {
				lng,
				defaultValue: 'Password successfully reset',
			})

			await this.sendMail(email, subject, html)

			this.logger.log(`Password reset confirmation sent to ${email}`)
		} catch (error) {
			this.logger.error(`Failed to send password reset confirmation to ${email}`, error)
			// Non-blocking: do not throw error, just log it
		}
	}

	// ==================== 2FA Security Notifications ====================

	/**
	 * Send notification when 2FA method is added
	 */
	async send2FAMethodAddedEmail(
		email: string,
		methodType: E2FAMethod,
		methodName: string | undefined,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFAMethodAddedTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				methodType,
				methodName,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_method_added.subject', { lng, defaultValue: '🔐 New 2FA Method Added' })
		await this.sendMail(email, subject, html)

		this.logger.log(`2FA method added notification sent to ${email}`)
	}

	/**
	 * Send notification when 2FA method is removed
	 */
	async send2FAMethodRemovedEmail(
		email: string,
		methodType: E2FAMethod,
		methodName: string | undefined,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFAMethodRemovedTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				methodType,
				methodName,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_method_removed.subject', { lng, defaultValue: '🔓 2FA Method Removed' })
		await this.sendMail(email, subject, html)

		this.logger.log(`2FA method removed notification sent to ${email}`)
	}

	/**
	 * Send notification when 2FA is completely disabled
	 */
	async send2FADisabledEmail(email: string, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFADisabledTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_disabled.subject', {
			lng,
			defaultValue: '🚨 Two-Factor Authentication Disabled',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`2FA disabled notification sent to ${email}`)
	}

	// ==================== Device & Login Notifications ====================

	/**
	 * Send notification for new device login
	 */
	async sendNewDeviceLoginEmail(email: string, metadata: ISessionMetadata, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const securityUrl = `${CLIENT_URL}/security/activity`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			NewDeviceLoginTemplate({
				securityUrl,
				i18n: this.i18n,
				lng,
				metadata,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.new_device_login.subject', {
			lng,
			defaultValue: '🔐 New Device Login Detected',
		})
		await this.sendMail(email, subject, html)

		this.logger.log(`New device login notification sent to ${email}`)
	}

	/**
	 * Send notification for suspicious activity
	 */
	async sendSuspiciousActivityEmail(
		email: string,
		eventDescription: string,
		riskScore: number,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const securityUrl = `${CLIENT_URL}/security/activity`
		const lockAccountUrl = `${CLIENT_URL}/security/lock-account`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			SuspiciousActivityTemplate({
				securityUrl,
				lockAccountUrl,
				i18n: this.i18n,
				lng,
				eventDescription,
				riskScore,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.suspicious_activity.subject', {
			lng,
			defaultValue: '🚨 Suspicious Activity Detected',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`Suspicious activity notification sent to ${email} (risk: ${riskScore})`)
	}

	// ==================== Backup Codes Notifications ====================

	/**
	 * Send notification when backup codes are running low
	 */
	async sendLowBackupCodesEmail(email: string, remaining: number, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security/backup-codes`
		const threshold = 3

		const html = await render(
			LowBackupCodesTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				remaining,
				threshold,
			}),
		)

		const subject = this.i18n.t('mail.low_backup_codes.subject', {
			lng,
			defaultValue: '⚠️ Running Low on Backup Codes',
		})
		await this.sendMail(email, subject, html)

		this.logger.log(`Low backup codes notification sent to ${email} (${remaining} remaining)`)
	}

	/**
	 * Send notification when backup codes are regenerated
	 */
	async sendBackupCodesRegeneratedEmail(email: string, lng: Language = 'en'): Promise<void> {
		await this.ensureCanSend(email)

		const settingsUrl = `${CLIENT_URL}/settings/security/backup-codes`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			BackupCodesRegeneratedTemplate({
				settingsUrl,
				i18n: this.i18n,
				lng,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.backup_codes_regenerated.subject', {
			lng,
			defaultValue: '✅ Backup Codes Regenerated',
		})
		await this.sendMail(email, subject, html)

		this.logger.log(`Backup codes regenerated notification sent to ${email}`)
	}

	// ==================== Admin Action Notifications ====================

	/**
	 * Send notification when 2FA is disabled by admin
	 */
	async send2FADisabledByAdminEmail(
		email: string,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const supportUrl = `${CLIENT_URL}/support`
		const settingsUrl = `${CLIENT_URL}/settings/security`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			TwoFADisabledByAdminTemplate({
				supportUrl,
				settingsUrl,
				i18n: this.i18n,
				lng,
				adminEmail,
				reason,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.2fa_disabled_by_admin.subject', {
			lng,
			defaultValue: '👤 2FA Disabled by Administrator',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`2FA disabled by admin notification sent to ${email}`)
	}

	/**
	 * Send notification when device is revoked by admin
	 */
	async sendDeviceRevokedByAdminEmail(
		email: string,
		deviceName: string,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<void> {
		await this.ensureCanSend(email)

		const supportUrl = `${CLIENT_URL}/support`
		const securityUrl = `${CLIENT_URL}/security/devices`
		const timestamp = new Date().toLocaleString(lng === 'ru' ? 'ru-RU' : 'en-US')

		const html = await render(
			DeviceRevokedByAdminTemplate({
				supportUrl,
				securityUrl,
				i18n: this.i18n,
				lng,
				deviceName,
				adminEmail,
				reason,
				timestamp,
			}),
		)

		const subject = this.i18n.t('mail.device_revoked_by_admin.subject', {
			lng,
			defaultValue: '🚫 Device Revoked by Administrator',
		})
		await this.sendMail(email, subject, html)

		this.logger.warn(`Device revoked by admin notification sent to ${email}`)
	}

	// ==================== Core Send Method ====================

	private async sendMail(email: string, subject: string, html: string) {
		return this.emailProvider.sendMail(email, subject, html)
	}
}
