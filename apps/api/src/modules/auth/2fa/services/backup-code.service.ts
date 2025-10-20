import { randomBytes } from 'node:crypto'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { NotificationService } from '@/modules/notification'
import { HashUtil } from '@/shared/utils'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { E2FAMethod, type User } from '@prisma/__generated__'

import { BACKUP_CODE_CONFIG } from '../constants'

/**
 * Backup Code Service
 * Manages generation, validation, and lifecycle of backup codes
 */
@Injectable()
export class BackupCodeService extends CoreService {
	private readonly logger = new Logger(BackupCodeService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Generate backup codes for a 2FA method
	 * @param userId User ID
	 * @param methodType 2FA method type
	 * @param authMethodId Optional specific auth method ID
	 * @returns Array of plain text backup codes (show only once!)
	 */
	async generateBackupCodes(userId: string, methodType: E2FAMethod, authMethodId?: string): Promise<string[]> {
		const codes = this.generateCodes()
		const hashedCodes = await Promise.all(codes.map(code => HashUtil.hash(code)))

		const expiresAt = BACKUP_CODE_CONFIG.EXPIRY_DAYS
			? new Date(Date.now() + BACKUP_CODE_CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000)
			: null

		await this.prisma.backupCode.createMany({
			data: hashedCodes.map(hash => ({
				userId,
				authMethodId: authMethodId || null,
				type: methodType,
				code: hash,
				expiresAt,
			})),
		})

		this.logger.log(`Generated ${codes.length} backup codes for user ${userId}, method ${methodType}`)

		return codes
	}

	/**
	 * Generate random backup codes
	 */
	private generateCodes(): string[] {
		const codes: string[] = []
		const format = BACKUP_CODE_CONFIG.FORMAT

		for (let i = 0; i < BACKUP_CODE_CONFIG.COUNT; i++) {
			const code = randomBytes(BACKUP_CODE_CONFIG.BYTES).toString('hex').toUpperCase()

			if (format === 'HEX') {
				codes.push(code)
			} else if (format === 'BASE32') {
				// Convert to base32 if needed
				codes.push(this.toBase32(code))
			} else {
				// Numeric format
				const numeric = parseInt(code, 16).toString().slice(0, 8)
				codes.push(numeric.padStart(8, '0'))
			}
		}

		return codes
	}

	/**
	 * Simple hex to base32 conversion
	 */
	private toBase32(hex: string): string {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
		let bits = ''
		let result = ''

		for (const char of hex) {
			bits += parseInt(char, 16).toString(2).padStart(4, '0')
		}

		for (let i = 0; i < bits.length; i += 5) {
			const chunk = bits.slice(i, i + 5).padEnd(5, '0')
			result += alphabet[parseInt(chunk, 2)]
		}

		return result.slice(0, 8)
	}

	/**
	 * Verify backup code
	 * @param user User object
	 * @param code Plain text backup code
	 * @param methodType 2FA method type
	 * @param lng Language for error messages
	 * @param ip Optional IP address for auditing
	 * @returns true if valid
	 */
	async verifyBackupCode(
		user: User,
		code: string,
		methodType: E2FAMethod,
		lng: Language,
		ip?: string,
	): Promise<boolean> {
		const normalizedCode = code.replace(/\s/g, '').toUpperCase()

		// Find unused backup codes for this user and method
		const backupCodes = await this.prisma.backupCode.findMany({
			where: {
				userId: user.id,
				type: methodType,
				usedAt: null,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
		})

		if (backupCodes.length === 0) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.no_backup_codes', {
					lng,
					defaultValue: 'No valid backup codes available',
				}),
			)
		}

		// Try to find matching code
		for (const backup of backupCodes) {
			const isMatch = await HashUtil.verify(backup.code, normalizedCode)

			if (isMatch) {
				// Mark as used
				await this.prisma.backupCode.update({
					where: { id: backup.id },
					data: {
						usedAt: new Date(),
						usedIp: ip, // Assuming you pass IP to this method
					},
				})
				this.logger.log(`Backup code used for user ${user.id}, method ${methodType}`)

				// Warn if running low
				const remaining = backupCodes.length - 1
				if (remaining <= BACKUP_CODE_CONFIG.LOW_CODES_THRESHOLD) {
					this.logger.warn(`User ${user.id} has only ${remaining} backup codes remaining`)
					// ✅ NOTIFICATION CALL
					await this.notificationService.notifyLowBackupCodes(user, remaining, lng)
				}

				return true
			}
		}

		throw new UnauthorizedException(
			this.i18n.t('auth.errors.2fa.invalid_backup_code', {
				lng,
				defaultValue: 'Invalid or already used backup code',
			}),
		)
	}

	/**
	 * Get backup codes status
	 */
	async getBackupCodesStatus(userId: string, methodType: E2FAMethod) {
		const total = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
			},
		})

		const used = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
				usedAt: { not: null },
			},
		})

		const expired = await this.prisma.backupCode.count({
			where: {
				userId,
				type: methodType,
				expiresAt: { lt: new Date() },
				usedAt: null,
			},
		})

		return {
			total,
			used,
			remaining: total - used - expired,
			expired,
		}
	}

	/**
	 * Regenerate backup codes (delete old, create new)
	 */
	async regenerateBackupCodes(userId: string, methodType: E2FAMethod, authMethodId?: string): Promise<string[]> {
		await this.prisma.backupCode.deleteMany({
			where: {
				userId,
				type: methodType,
				authMethodId: authMethodId || null,
			},
		})

		return this.generateBackupCodes(userId, methodType, authMethodId)
	}

	/**
	 * Delete all backup codes for user/method
	 */
	async deleteBackupCodes(userId: string, methodType: E2FAMethod): Promise<void> {
		await this.prisma.backupCode.deleteMany({
			where: {
				userId,
				type: methodType,
			},
		})

		this.logger.log(`Deleted all backup codes for user ${userId}, method ${methodType}`)
	}

	/**
	 * Cleanup expired backup codes (cron job)
	 * Returns metrics about the cleanup operation
	 */
	async cleanupExpiredCodes(): Promise<{ deleted: number; affected: number }> {
		// First, get count for metrics
		const expiredCodes = await this.prisma.backupCode.findMany({
			where: {
				expiresAt: { lt: new Date() },
				usedAt: null, // Don't delete already used codes for audit trail
			},
			select: {
				userId: true,
			},
		})

		const affectedUserIds = new Set(expiredCodes.map(c => c.userId))

		// Delete expired codes
		const result = await this.prisma.backupCode.deleteMany({
			where: {
				expiresAt: { lt: new Date() },
				usedAt: null,
			},
		})

		this.logger.log(`Cleaned up ${result.count} expired backup codes affecting ${affectedUserIds.size} users`)

		return {
			deleted: result.count,
			affected: affectedUserIds.size,
		}
	}
}
