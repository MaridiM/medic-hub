import { createHash } from 'node:crypto'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { MailService, SmsService } from '@/core/provider'
import type { ISessionMetadata } from '@/shared/types'
import { Injectable, Logger } from '@nestjs/common'
import type { E2FAMethod, User } from '@prisma/__generated__'

import {
	NOTIFICATION_DEFAULTS,
	NOTIFICATION_RATE_LIMITS,
	NOTIFICATION_REDIS_KEYS,
	PRIORITY_CHANNELS,
	SECURITY_NOTIFICATION_CONFIG,
} from './constants'
import {
	ENotificationCategory,
	ENotificationChannel,
	ENotificationPriority,
	type I2FAMethodNotificationData,
	type IAdminActionNotificationData,
	type IBackupCodesNotificationData,
	type IDeviceLoginNotificationData,
	type INotificationBase,
	type INotificationResult,
	type ISuspiciousActivityNotificationData,
} from './types'

/**
 * Global Notification Service
 *
 * Centralized service for sending notifications across all application modules.
 * Supports multiple channels (Email, SMS, Push) and handles rate limiting,
 * duplicate detection, and delivery tracking.
 *
 * @remarks
 * This is a global module - automatically available in all modules without import.
 *
 * @example
 * ```typescript
 * // In any service
 * await this.notificationService.send2FAMethodAdded(user, 'TOTP', 'My Auth App', 'en')
 * ```
 */
@Injectable()
export class NotificationService extends CoreService {
	private readonly logger = new Logger(NotificationService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly mailService: MailService,
		private readonly smsService: SmsService,
	) {
		super({ i18n, prisma, redis })
	}

	// ==================== Core Notification Logic ====================

	/**
	 * Send notification through appropriate channels
	 *
	 * @param data Base notification data
	 * @param emailMethod Email sending method
	 * @param smsMethod Optional SMS sending method
	 * @returns Array of delivery results
	 */
	private async sendNotification(
		data: INotificationBase,
		emailMethod: () => Promise<void>,
		smsMethod?: () => Promise<void>,
	): Promise<INotificationResult[]> {
		const results: INotificationResult[] = []

		// Check if notifications are enabled
		if (!SECURITY_NOTIFICATION_CONFIG.ENABLED && data.category === ENotificationCategory.SECURITY) {
			this.logger.debug('Security notifications are disabled globally')
			return results
		}

		// Check rate limiting
		const rateLimitCheck = await this.checkRateLimit(data.user.id)
		if (!rateLimitCheck.allowed) {
			this.logger.warn(`Rate limit exceeded for user ${data.user.id}`)
			return [
				{
					success: false,
					channel: ENotificationChannel.EMAIL,
					error: 'Rate limit exceeded',
				},
			]
		}

		// Determine channels to use
		const channels = data.channels || PRIORITY_CHANNELS[data.priority] || [NOTIFICATION_DEFAULTS.DEFAULT_CHANNEL]

		// Send via Email
		if (channels.includes(ENotificationChannel.EMAIL)) {
			const emailResult = await this.sendViaEmail(data.user, emailMethod)
			results.push(emailResult)
		}

		// Send via SMS (if method provided and user has verified phone)
		if (channels.includes(ENotificationChannel.SMS) && smsMethod && data.user.isPhoneVerified && data.user.phone) {
			const smsResult = await this.sendViaSms(data.user, smsMethod)
			results.push(smsResult)
		}

		// Track sent notification
		if (results.some(r => r.success)) {
			await this.trackSentNotification(data.user.id, data.category)
		}

		return results
	}

	/**
	 * Send notification via email
	 */
	private async sendViaEmail(user: User, emailMethod: () => Promise<void>): Promise<INotificationResult> {
		try {
			// Check email verification
			if (SECURITY_NOTIFICATION_CONFIG.REQUIRE_VERIFIED_EMAIL && !user.isEmailVerified) {
				return {
					success: false,
					channel: ENotificationChannel.EMAIL,
					error: 'Email not verified',
				}
			}

			if (!user.email) {
				return {
					success: false,
					channel: ENotificationChannel.EMAIL,
					error: 'No email address',
				}
			}

			// Check email reputation
			if (SECURITY_NOTIFICATION_CONFIG.CHECK_EMAIL_REPUTATION) {
				const canSend = await this.mailService.canSendEmail(user.email)
				if (!canSend) {
					return {
						success: false,
						channel: ENotificationChannel.EMAIL,
						error: 'Email bounced or unsubscribed',
					}
				}
			}

			// Send email
			await emailMethod()

			return {
				success: true,
				channel: ENotificationChannel.EMAIL,
				sentAt: new Date(),
			}
		} catch (error) {
			this.logger.error(`Email notification failed: ${(error as Error).message}`, error)
			return {
				success: false,
				channel: ENotificationChannel.EMAIL,
				error: (error as Error).message,
			}
		}
	}

	/**
	 * Send notification via SMS
	 */
	private async sendViaSms(user: User, smsMethod: () => Promise<void>): Promise<INotificationResult> {
		try {
			// Check phone verification
			if (SECURITY_NOTIFICATION_CONFIG.REQUIRE_VERIFIED_PHONE && !user.isPhoneVerified) {
				return {
					success: false,
					channel: ENotificationChannel.SMS,
					error: 'Phone not verified',
				}
			}

			if (!user.phone) {
				return {
					success: false,
					channel: ENotificationChannel.SMS,
					error: 'No phone number',
				}
			}

			// Check SMS capability
			const canSend = await this.smsService.canSendSms(user.phone)
			if (!canSend) {
				return {
					success: false,
					channel: ENotificationChannel.SMS,
					error: 'Phone number invalid or blocked',
				}
			}

			// Send SMS
			await smsMethod()

			return {
				success: true,
				channel: ENotificationChannel.SMS,
				sentAt: new Date(),
			}
		} catch (error) {
			this.logger.error(`SMS notification failed: ${(error as Error).message}`, error)
			return {
				success: false,
				channel: ENotificationChannel.SMS,
				error: (error as Error).message,
			}
		}
	}

	// ==================== Rate Limiting ====================

	/**
	 * Check if user has exceeded rate limits
	 */
	private async checkRateLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		const hourCount = await this.rGet(hourKey)
		const dayCount = await this.rGet(dayKey)

		const hourlyCount = hourCount ? parseInt(hourCount, 10) : 0
		const dailyCount = dayCount ? parseInt(dayCount, 10) : 0

		if (hourlyCount >= NOTIFICATION_RATE_LIMITS.MAX_PER_HOUR) {
			return { allowed: false, reason: 'Hourly limit exceeded' }
		}

		if (dailyCount >= NOTIFICATION_RATE_LIMITS.MAX_PER_DAY) {
			return { allowed: false, reason: 'Daily limit exceeded' }
		}

		return { allowed: true }
	}

	/**
	 * Track sent notification for rate limiting
	 */
	private async trackSentNotification(userId: string, category: ENotificationCategory): Promise<void> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		// Increment counters
		await this.rIncr(hourKey)
		await this.rExpire(hourKey, 3600) // 1 hour

		await this.rIncr(dayKey)
		await this.rExpire(dayKey, 86400) // 24 hours

		// Log if enabled
		if (SECURITY_NOTIFICATION_CONFIG.LOG_ALL_ATTEMPTS) {
			this.logger.debug(`Notification sent: user=${userId}, category=${category}`)
		}
	}

	/**
	 * Check for duplicate notifications
	 */
	private async checkDuplicate(userId: string, notificationHash: string): Promise<boolean> {
		const key = NOTIFICATION_REDIS_KEYS.DUPLICATE(userId, notificationHash)
		const exists = await this.rGet(key)

		if (exists) {
			return true // Is duplicate
		}

		// Mark as sent
		await this.rSet(key, '1', NOTIFICATION_RATE_LIMITS.DUPLICATE_COOLDOWN)
		return false
	}

	/**
	 * Generate notification hash for duplicate detection
	 */
	private generateNotificationHash(data: any): string {
		return createHash('sha256').update(JSON.stringify(data)).digest('hex').substring(0, 16)
	}

	// ==================== 2FA Security Notifications ====================

	/**
	 * Notify user when a new 2FA method is added
	 */
	async notify2FAMethodAdded(
		user: User,
		methodType: E2FAMethod,
		methodName: string | null | undefined,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: I2FAMethodNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.HIGH,
			methodType,
			methodName: methodName || undefined,
			action: '2fa_method_added',
		}

		return this.sendNotification(data, () =>
			this.mailService.send2FAMethodAddedEmail(user.email, methodType, methodName || undefined, lng),
		)
	}

	/**
	 * Notify user when a 2FA method is removed
	 */
	async notify2FAMethodRemoved(
		user: User,
		methodType: E2FAMethod,
		methodName: string | null | undefined,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: I2FAMethodNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.HIGH,
			methodType,
			methodName: methodName || undefined,
			action: '2fa_method_removed',
		}

		return this.sendNotification(data, () =>
			this.mailService.send2FAMethodRemovedEmail(user.email, methodType, methodName || undefined, lng),
		)
	}

	/**
	 * Notify user when 2FA is completely disabled
	 */
	async notify2FADisabled(user: User, lng: Language = 'en'): Promise<INotificationResult[]> {
		const data: I2FAMethodNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.CRITICAL,
			methodType: 'BACKUP_CODE' as E2FAMethod, // Placeholder
			action: '2fa_disabled',
		}

		return this.sendNotification(data, () => this.mailService.send2FADisabledEmail(user.email, lng))
	}

	// ==================== Device & Login Notifications ====================

	/**
	 * Notify user about login from a new device
	 */
	async notifyNewDeviceLogin(
		user: User,
		device: ISessionMetadata,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: IDeviceLoginNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.HIGH,
			device,
		}

		// Check for duplicate (same device, same day)
		const hash = this.generateNotificationHash({
			userId: user.id,
			device: device.device,
			date: new Date().toDateString(),
		})
		const isDuplicate = await this.checkDuplicate(user.id, hash)
		if (isDuplicate) {
			this.logger.debug(`Skipping duplicate new device notification for user ${user.id}`)
			return []
		}

		return this.sendNotification(data, () => this.mailService.sendNewDeviceLoginEmail(user.email, device, lng))
	}

	/**
	 * Notify user about suspicious login activity
	 */
	async notifySuspiciousActivity(
		user: User,
		eventDescription: string,
		riskScore: number,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: ISuspiciousActivityNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: riskScore >= 80 ? ENotificationPriority.CRITICAL : ENotificationPriority.HIGH,
			eventDescription,
			riskScore,
		}

		return this.sendNotification(data, () =>
			this.mailService.sendSuspiciousActivityEmail(user.email, eventDescription, riskScore, lng),
		)
	}

	// ==================== Backup Codes Notifications ====================

	/**
	 * Notify user when backup codes are running low
	 */
	async notifyLowBackupCodes(user: User, remaining: number, lng: Language = 'en'): Promise<INotificationResult[]> {
		const data: IBackupCodesNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.NORMAL,
			remaining,
			action: 'low_codes',
		}

		return this.sendNotification(data, () => this.mailService.sendLowBackupCodesEmail(user.email, remaining, lng))
	}

	/**
	 * Notify user when backup codes are regenerated
	 */
	async notifyBackupCodesRegenerated(user: User, lng: Language = 'en'): Promise<INotificationResult[]> {
		const data: IBackupCodesNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.SECURITY,
			priority: ENotificationPriority.NORMAL,
			action: 'codes_regenerated',
		}

		return this.sendNotification(data, () => this.mailService.sendBackupCodesRegeneratedEmail(user.email, lng))
	}

	// ==================== Admin Action Notifications ====================

	/**
	 * Notify user when 2FA is disabled by administrator
	 */
	async notify2FADisabledByAdmin(
		user: User,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: IAdminActionNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.ADMIN,
			priority: ENotificationPriority.CRITICAL,
			adminEmail,
			reason,
			action: '2fa_disabled',
		}

		return this.sendNotification(data, () =>
			this.mailService.send2FADisabledByAdminEmail(user.email, adminEmail, reason, lng),
		)
	}

	/**
	 * Notify user when a device is revoked by administrator
	 */
	async notifyDeviceRevokedByAdmin(
		user: User,
		deviceName: string,
		adminEmail: string,
		reason: string,
		lng: Language = 'en',
	): Promise<INotificationResult[]> {
		const data: IAdminActionNotificationData = {
			user,
			language: lng,
			category: ENotificationCategory.ADMIN,
			priority: ENotificationPriority.HIGH,
			adminEmail,
			reason,
			action: 'device_revoked',
			deviceName,
		}

		return this.sendNotification(data, () =>
			this.mailService.sendDeviceRevokedByAdminEmail(user.email, deviceName, adminEmail, reason, lng),
		)
	}

	// ==================== Utility Methods ====================

	/**
	 * Check if user can receive notifications
	 */
	async canNotifyUser(user: User): Promise<boolean> {
		if (!user.isEmailVerified || !user.email) {
			return false
		}

		return void this.mailService.canSendEmail(user.email)
	}

	/**
	 * Get notification statistics for user
	 */
	async getUserNotificationStats(userId: string): Promise<{
		hourly: number
		daily: number
		limits: { hourly: number; daily: number }
	}> {
		const hourKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_HOUR(userId)
		const dayKey = NOTIFICATION_REDIS_KEYS.RATE_LIMIT_DAY(userId)

		const hourCount = await this.rGet(hourKey)
		const dayCount = await this.rGet(dayKey)

		return {
			hourly: hourCount ? parseInt(hourCount, 10) : 0,
			daily: dayCount ? parseInt(dayCount, 10) : 0,
			limits: {
				hourly: NOTIFICATION_RATE_LIMITS.MAX_PER_HOUR,
				daily: NOTIFICATION_RATE_LIMITS.MAX_PER_DAY,
			},
		}
	}
}
