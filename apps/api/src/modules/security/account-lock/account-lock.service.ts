import { addSeconds } from 'date-fns'

import { CoreService } from '@/core/core.service'
import type { Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { NotificationService } from '@/modules/notification'
import { SecurityEventService } from '@/modules/security-event'
import { Injectable, Logger } from '@nestjs/common'
import { ESecurityEvent, ESecuritySeverity, User } from '@prisma/__generated__'

import { ACCOUNT_LOCK_CONFIG, ACCOUNT_LOCK_REDIS_KEYS, PROGRESSIVE_DELAYS } from './constants/account-lock.constants'

/**
 * Account Lockout Service
 *
 * Manages account locking based on failed login attempts.
 * - Tracks failures using a Redis counter.
 * - Implements progressive delays to slow down attacks.
 * - Creates a persistent lock record in the database.
 * - Notifies the user about the lockout.
 */
@Injectable()
export class AccountLockService extends CoreService {
	private readonly logger = new Logger(AccountLockService.name)

	constructor(
		prisma: PrismaService,
		redis: RedisService,
		private readonly securityEventService: SecurityEventService,
		private readonly notificationService: NotificationService,
	) {
		super({ prisma, redis })
	}

	/**
	 * Checks if an account is currently locked.
	 * @param userId - The ID of the user to check.
	 * @returns A promise that resolves to `true` if the account is locked, `false` otherwise.
	 */
	async isAccountLocked(userId: string): Promise<boolean> {
		const lock = await this.prisma.accountLock.findFirst({
			where: {
				userId,
				unlockedAt: null, // Lock is not manually unlocked
				OR: [
					{ expiresAt: null }, // Permanent lock
					{ expiresAt: { gt: new Date() } }, // Temporary lock has not expired
				],
			},
		})
		return !!lock
	}

	/**
	 * Increments the failed login attempt counter for a user.
	 * Applies progressive delays and triggers a lockout if the threshold is reached.
	 *
	 * @param user - The user object.
	 * @param ip - The IP address of the failed attempt.
	 * @param userAgent - The user agent of the failed attempt.
	 * @param lng - The user's language for notifications.
	 */
	async incrementFailedAttempts(user: User, ip: string, userAgent: string | undefined, lng: Language): Promise<void> {
		const key = ACCOUNT_LOCK_REDIS_KEYS.FAILED_LOGIN_ATTEMPTS(user.id)

		// Apply progressive delay if needed
		const currentAttempts = (await this.rGetNumber(key)) || 0
		const delayConfig = PROGRESSIVE_DELAYS.find(d => d.attempts === currentAttempts + 1)
		if (delayConfig) {
			this.logger.debug(`Applying progressive delay of ${delayConfig.delayMs}ms for user ${user.id}`)
			await new Promise(resolve => setTimeout(resolve, delayConfig.delayMs))
		}

		// Increment the counter
		const newAttemptCount = await this.rIncr(key, ACCOUNT_LOCK_CONFIG.FAILED_ATTEMPTS_TTL_SECONDS)

		// Check if lockout threshold is reached
		if (newAttemptCount >= ACCOUNT_LOCK_CONFIG.MAX_FAILED_ATTEMPTS) {
			this.logger.warn(`Lockout threshold reached for user ${user.id}. Locking account.`)
			await this.lockAccount(user, ip, userAgent, newAttemptCount, lng)
		}
	}

	/**
	 * Clears the failed login attempt counter for a user upon successful login.
	 * @param userId - The ID of the user.
	 */
	async clearFailedAttempts(userId: string): Promise<void> {
		const key = ACCOUNT_LOCK_REDIS_KEYS.FAILED_LOGIN_ATTEMPTS(userId)
		await this.rDel(key)
	}

	/**
	 * Locks a user account by creating a record in the database.
	 * Also logs a critical security event and notifies the user.
	 *
	 * @param user - The user to lock.
	 * @param ip - The IP address triggering the lock.
	 * @param userAgent - The user agent triggering the lock.
	 * @param failedAttempts - The final count of failed attempts.
	 * @param lng - The user's language for notifications.
	 */
	private async lockAccount(
		user: User,
		ip: string,
		userAgent: string | undefined,
		failedAttempts: number,
		lng: Language,
	): Promise<void> {
		const expiresAt = addSeconds(new Date(), ACCOUNT_LOCK_CONFIG.LOCKOUT_DURATION_SECONDS)

		await this.prisma.accountLock.create({
			data: {
				userId: user.id,
				reason: `Exceeded ${ACCOUNT_LOCK_CONFIG.MAX_FAILED_ATTEMPTS} failed login attempts.`,
				failedAttempts,
				expiresAt,
				ip,
				userAgent,
			},
		})

		// Log a critical security event
		await this.securityEventService.create({
			userId: user.id,
			event: ESecurityEvent.ACCOUNT_LOCKED,
			severity: ESecuritySeverity.CRITICAL,
			ip,
			userAgent,
			metadata: {
				reason: 'brute_force_protection',
				failedAttempts,
				lockDuration: ACCOUNT_LOCK_CONFIG.LOCKOUT_DURATION_SECONDS,
			},
		})

		// TODO: Notify the user about the account lockout.
		// This requires a new notification type and template.
		// await this.notificationService.notifyAccountLocked(user, lng);

		// Clear the Redis counter as the lock is now persistent in the DB
		await this.clearFailedAttempts(user.id)
	}
}
