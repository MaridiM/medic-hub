import { addSeconds } from 'date-fns'

import { CoreService } from '@/core/core.service'
import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import type { ISessionMetadata } from '@/shared/types'
import { Injectable, Logger } from '@nestjs/common'
import { type Prisma } from '@prisma/__generated__'

import { DEVICE_LIFETIME, DEVICE_LIMITS, DEVICE_REDIS_KEYS, DEVICE_TRUST } from '../constants'
import type { IDeviceFingerprint, IDeviceTrustFactors } from '../types'
import { EDeviceTrustLevel } from '../types'
import { FingerprintUtil } from '../utils'

/**
 * Device Trust Service
 * Manages trusted devices and calculates trust scores
 */
@Injectable()
export class DeviceTrustService extends CoreService {
	private readonly logger = new Logger(DeviceTrustService.name)

	constructor(i18n: I18nService, prisma: PrismaService, redis: RedisService) {
		super(i18n, prisma, redis)
	}

	/**
	 * Register or update a device
	 * @param userId User ID
	 * @param session Session metadata
	 * @param fingerprint Optional full fingerprint
	 * @param name Optional user-provided device name
	 * @returns Device ID
	 */
	async registerDevice(
		userId: string,
		session: ISessionMetadata,
		fingerprint?: IDeviceFingerprint,
		name?: string,
	): Promise<string> {
		// Generate device ID from fingerprint or session data
		const deviceId = fingerprint
			? FingerprintUtil.generateDeviceId(fingerprint)
			: FingerprintUtil.generateQuickDeviceId(
					`${session.device.browser}:${session.device.os}:${session.device.type}`,
					session.ip,
				)

		// Check if device already exists
		const existing = await this.prisma.trustedDevice.findUnique({
			where: { deviceId },
		})

		if (existing) {
			// Update last seen
			await this.prisma.trustedDevice.update({
				where: { id: existing.id },
				data: {
					lastSeenAt: new Date(),
					lastIp: session.ip,
					lastCountry: session.location.country,
					lastCity: session.location.city,
				},
			})

			return deviceId
		}

		// Create new device
		const expiresAt = addSeconds(new Date(), DEVICE_LIFETIME.DEFAULT_DURATION)

		await this.prisma.trustedDevice.create({
			data: {
				userId,
				deviceId,
				fingerprint: (fingerprint || {}) as Prisma.InputJsonValue,
				name,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				browser: session.device.browser,
				os: session.device.os,
				device: session.device.type,
				trustScore: DEVICE_TRUST.INITIAL_SCORE,
				lastIp: session.ip,
				lastCountry: session.location.country,
				lastCity: session.location.city,
				expiresAt,
			},
		})

		this.logger.log(`Registered new device ${deviceId} for user ${userId}`)

		return deviceId
	}

	/**
	 * Get device by ID
	 */
	async getDevice(deviceId: string) {
		return this.prisma.trustedDevice.findUnique({
			where: { deviceId },
		})
	}

	/**
	 * Get all devices for user
	 */
	async getUserDevices(userId: string) {
		return this.prisma.trustedDevice.findMany({
			where: {
				userId,
				isActive: true,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
			orderBy: { lastSeenAt: 'desc' },
		})
	}

	/**
	 * Calculate trust score for a device
	 * @param deviceId Device ID
	 * @returns Trust score (0-100)
	 */
	async calculateTrustScore(deviceId: string): Promise<number> {
		const device = await this.getDevice(deviceId)
		if (!device) return 0

		const factors = await this.getTrustFactors(device.userId, deviceId)
		let score: number = DEVICE_TRUST.INITIAL_SCORE

		// Increase score for successful logins
		score += Math.min(factors.successfulLogins * DEVICE_TRUST.SUCCESS_INCREMENT, 40)

		// Decrease for failed attempts
		score -= factors.failedAttempts * DEVICE_TRUST.FAILURE_DECREMENT

		// Bonus for explicitly trusted devices
		if (factors.explicitlyTrusted) {
			score += 20
		}

		// Bonus for long-term devices
		if (factors.daysSinceFirstSeen > 90) {
			score += 15
		} else if (factors.daysSinceFirstSeen > 30) {
			score += 10
		}

		// Bonus for location consistency
		score += factors.locationConsistency * 0.1

		// Apply decay for inactivity
		if (factors.daysSinceFirstSeen > DEVICE_TRUST.DECAY_GRACE_PERIOD) {
			const inactiveDays = factors.daysSinceFirstSeen - DEVICE_TRUST.DECAY_GRACE_PERIOD
			score -= inactiveDays * DEVICE_TRUST.DECAY_PER_DAY
		}

		// Clamp to valid range
		score = Math.max(DEVICE_TRUST.MIN_SCORE, Math.min(DEVICE_TRUST.MAX_SCORE, score))

		// Update in database
		await this.prisma.trustedDevice.update({
			where: { deviceId },
			data: { trustScore: score },
		})

		// Cache in Redis
		await this.rSet(DEVICE_REDIS_KEYS.TRUST_SCORE(device.userId, deviceId), score.toString(), 3600)

		return score
	}

	/**
	 * Get trust factors for score calculation
	 */
	private async getTrustFactors(userId: string, deviceId: string): Promise<IDeviceTrustFactors> {
		const device = await this.getDevice(deviceId)
		if (!device) {
			return {
				successfulLogins: 0,
				failedAttempts: 0,
				daysSinceFirstSeen: 0,
				locationConsistency: 0,
				timePatternConsistency: 0,
				explicitlyTrusted: false,
			}
		}

		// Count successful sessions from this device
		const successfulLogins = await this.prisma.session.count({
			where: {
				userId,
				deviceId,
				revokedAt: null,
			},
		})

		// Count failed login attempts (from audit logs)
		const failedAttempts = await this.prisma.auditLog.count({
			where: {
				userId,
				action: 'LOGIN_FAILED',
				success: false,
				metadata: {
					path: ['deviceId'],
					equals: deviceId,
				},
			},
		})

		const daysSinceFirstSeen = Math.floor((Date.now() - device.createdAt.getTime()) / (1000 * 60 * 60 * 24))

		// Calculate location consistency (same country/city)
		const sessions = await this.prisma.session.findMany({
			where: { userId, deviceId },
			select: { country: true, city: true },
			take: 20,
		})

		const uniqueCountries = new Set(sessions.map(s => s.country)).size
		const locationConsistency = sessions.length > 0 ? (1 - uniqueCountries / sessions.length) * 100 : 0

		return {
			successfulLogins,
			failedAttempts,
			daysSinceFirstSeen,
			locationConsistency,
			timePatternConsistency: 0,
			explicitlyTrusted: device.trustScore >= DEVICE_TRUST.TRUST_THRESHOLD,
		}
	}

	/**
	 * Check if device is trusted
	 */
	async isTrusted(deviceId: string): Promise<boolean> {
		const device = await this.getDevice(deviceId)
		if (!device || !device.isActive) return false
		if (device.expiresAt && device.expiresAt < new Date()) return false
		if (device.revokedAt) return false

		return device.trustScore >= DEVICE_TRUST.TRUST_THRESHOLD
	}

	/**
	 * Mark device as explicitly trusted by user
	 */
	async trustDevice(userId: string, deviceId: string, duration?: number): Promise<void> {
		const expiresAt = duration
			? addSeconds(new Date(), duration)
			: addSeconds(new Date(), DEVICE_LIFETIME.DEFAULT_DURATION)

		await this.prisma.trustedDevice.updateMany({
			where: { userId, deviceId },
			data: {
				trustScore: DEVICE_TRUST.MAX_SCORE,
				expiresAt,
			},
		})

		this.logger.log(`Device ${deviceId} explicitly trusted by user ${userId}`)
	}

	/**
	 * Revoke trust for a device
	 */
	async revokeDevice(userId: string, deviceId: string): Promise<void> {
		await this.prisma.trustedDevice.updateMany({
			where: { userId, deviceId },
			data: {
				isActive: false,
				revokedAt: new Date(),
			},
		})

		// Invalidate all sessions from this device
		await this.prisma.session.updateMany({
			where: { userId, deviceId },
			data: { revokedAt: new Date() },
		})

		this.logger.warn(`Device ${deviceId} revoked for user ${userId}`)
	}

	/**
	 * Get trust level enum from score
	 */
	getTrustLevel(score: number): EDeviceTrustLevel {
		if (score >= 75) return EDeviceTrustLevel.VERIFIED
		if (score >= 50) return EDeviceTrustLevel.TRUSTED
		if (score >= 25) return EDeviceTrustLevel.PARTIAL
		if (score > 0) return EDeviceTrustLevel.RECOGNIZED
		return EDeviceTrustLevel.UNKNOWN
	}

	/**
	 * Cleanup old/expired devices (cron job)
	 */
	async cleanupDevices(): Promise<number> {
		const cutoffDate = new Date(Date.now() - DEVICE_LIMITS.CLEANUP_AFTER_DAYS * 24 * 60 * 60 * 1000)

		const result = await this.prisma.trustedDevice.deleteMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					{ lastSeenAt: { lt: cutoffDate } },
					{ isActive: false, revokedAt: { lt: cutoffDate } },
				],
			},
		})

		this.logger.log(`Cleaned up ${result.count} old devices`)
		return result.count
	}

	/**
	 * Enforce device limits per user
	 */
	async enforceDeviceLimits(userId: string): Promise<void> {
		const devices = await this.prisma.trustedDevice.findMany({
			where: { userId, isActive: true },
			orderBy: { lastSeenAt: 'desc' },
		})

		if (devices.length > DEVICE_LIMITS.MAX_TRUSTED_DEVICES) {
			const toRevoke = devices.slice(DEVICE_LIMITS.MAX_TRUSTED_DEVICES)

			for (const device of toRevoke) {
				await this.revokeDevice(userId, device.deviceId)
			}

			this.logger.log(`Revoked ${toRevoke.length} devices for user ${userId} (limit exceeded)`)
		}
	}
}
