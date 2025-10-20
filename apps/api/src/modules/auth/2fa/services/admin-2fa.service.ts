import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { NotificationService } from '@/modules/notification'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { EAuditCategory, ESecurityEvent, ESecuritySeverity, Prisma, type User } from '@prisma/__generated__'

import type {
	DisableUser2FAInput,
	GetUserSecurityEventsInput,
	RevokeAllUserDevicesInput,
	RevokeUserDeviceInput,
} from '../dtos/admin-2fa.dto'
import type { AdminActionSuccessModel, User2FAStatusModel } from '../models/admin-2fa.model'
import { IAdminActionMetadata } from '../types'

import { DeviceTrustService } from './device-trust.service'
import { SecurityEventService } from './security-event.service'

/**
 * Service handling administrative 2FA operations.
 * All operations are heavily audited for security compliance.
 */
@Injectable()
export class AdminTwoFactorService extends CoreService {
	private readonly logger = new Logger(AdminTwoFactorService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly securityEventService: SecurityEventService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Disable 2FA for a user (emergency access)
	 */
	async disableUser2FA(adminUser: User, input: DisableUser2FAInput): Promise<AdminActionSuccessModel> {
		// Verify target user exists
		const targetUser = await this.prisma.user.findUnique({
			where: { id: input.userId },
			select: {
				id: true,
				email: true,
				is2FAEnabled: true,
				preferred2FAMethod: true,
			},
		})

		if (!targetUser) {
			throw new NotFoundException('User not found')
		}

		if (!targetUser.is2FAEnabled) {
			return {
				success: true,
				message: 'User does not have 2FA enabled',
				affectedUserId: input.userId,
			}
		}

		// Start transaction
		const result = await this.prisma.$transaction(async tx => {
			// 1. Disable 2FA on user
			await tx.user.update({
				where: { id: input.userId },
				data: {
					is2FAEnabled: false,
					preferred2FAMethod: null,
				},
			})

			// 2. Deactivate all authentication methods
			await tx.authenticationMethod.updateMany({
				where: { userId: input.userId },
				data: { isActive: false },
			})

			// 3. Delete all backup codes
			await tx.backupCode.deleteMany({
				where: { userId: input.userId },
			})

			// 4. Create audit log
			const auditLog = await tx.auditLog.create({
				data: {
					userId: adminUser.id,
					action: 'ADMIN_DISABLED_USER_2FA',
					category: EAuditCategory.ADMIN,
					success: true,
					metadata: {
						targetUserId: input.userId,
						targetEmail: targetUser.email,
						reason: input.reason,
						previousMethod: targetUser.preferred2FAMethod,
						timestamp: new Date().toISOString(),
					} as Prisma.InputJsonValue,
				},
			})

			// 5. Create security event for target user
			await tx.securityEvent.create({
				data: {
					userId: input.userId,
					event: ESecurityEvent.TWO_FA_DISABLED,
					severity: ESecuritySeverity.CRITICAL,
					metadata: {
						timestamp: new Date().toISOString(),
						adminId: adminUser.id,
						adminEmail: adminUser.email,
						reason: input.reason,
						targetUserId: input.userId,
						targetEmail: targetUser.email,
						disabledBy: adminUser.email,
					} as IAdminActionMetadata as Prisma.InputJsonValue,
				},
			})

			return auditLog
		})

		// Log admin action
		this.logger.warn(`Admin ${adminUser.email} disabled 2FA for user ${targetUser.email}. Reason: ${input.reason}`)

		if (input.notifyUser) {
			await this.notificationService.notify2FADisabledByAdmin(targetUser as User, adminUser.email, input.reason)
		}

		return {
			success: true,
			message: `2FA disabled for user ${targetUser.email}`,
			affectedUserId: input.userId,
			auditLogId: result.id,
		}
	}

	/**
	 * Get comprehensive 2FA status for a user
	 */
	async getUser2FAStatus(userId: string): Promise<User2FAStatusModel> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				is2FAEnabled: true,
				preferred2FAMethod: true,
				riskScore: true,
			},
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		// Get authentication methods
		const methods = await this.prisma.authenticationMethod.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})

		// Get trusted devices
		const devices = await this.deviceTrustService.getUserDevices(userId)

		// Count remaining backup codes
		const backupCodesRemaining = await this.prisma.backupCode.count({
			where: {
				userId,
				usedAt: null,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
		})

		// Get recent security events
		const recentEvents = await this.securityEventService.getEvents({
			userId,
			limit: 10,
		})

		return {
			userId: user.id,
			email: user.email,
			is2FAEnabled: user.is2FAEnabled,
			preferred2FAMethod: user.preferred2FAMethod,
			methods: methods.map(m => ({
				id: m.id,
				method: m.method,
				name: m.name,
				isActive: m.isActive,
				isPrimary: m.isPrimary,
				lastUsedAt: m.lastUsedAt,
				useCount: m.useCount,
				createdAt: m.createdAt,
			})),
			trustedDevices: devices.map(d => ({
				id: d.id,
				deviceId: d.deviceId,
				name: d.name,
				browser: d.browser,
				os: d.os,
				trustScore: d.trustScore,
				lastIp: d.lastIp,
				lastCountry: d.lastCountry,
				lastSeenAt: d.lastSeenAt,
				isActive: d.isActive,
			})),
			backupCodesRemaining,
			riskScore: user.riskScore,
			recentEvents: recentEvents.map(e => ({
				id: e.id,
				event: e.event,
				severity: e.severity,
				ip: e.ip,
				country: e.country,
				city: e.city,
				resolved: e.resolved,
				createdAt: e.createdAt,
			})),
		}
	}

	/**
	 * Revoke a specific device for a user
	 */
	async revokeUserDevice(adminUser: User, input: RevokeUserDeviceInput): Promise<AdminActionSuccessModel> {
		// Verify device exists
		const device = await this.prisma.trustedDevice.findFirst({
			where: {
				userId: input.userId,
				deviceId: input.deviceId,
			},
		})

		if (!device) {
			throw new NotFoundException('Device not found')
		}

		// Revoke the device
		await this.deviceTrustService.revokeDevice(input.userId, input.deviceId)

		// Create audit log
		const auditLog = await this.prisma.auditLog.create({
			data: {
				userId: adminUser.id,
				action: 'ADMIN_REVOKED_USER_DEVICE',
				category: EAuditCategory.ADMIN,
				success: true,
				metadata: {
					targetUserId: input.userId,
					deviceId: input.deviceId,
					deviceName: device.name,
					reason: input.reason,
					timestamp: new Date().toISOString(),
				} as Prisma.InputJsonValue,
			},
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: input.userId,
			event: ESecurityEvent.DEVICE_REVOKED,
			severity: ESecuritySeverity.HIGH,
			metadata: {
				timestamp: new Date().toISOString(),
				adminId: adminUser.id,
				adminEmail: adminUser.email,
				deviceId: input.deviceId,
				reason: input.reason,
				revokedBy: adminUser.email,
			} as IAdminActionMetadata,
		})

		this.logger.warn(
			`Admin ${adminUser.email} revoked device ${input.deviceId} for user ${input.userId}. Reason: ${input.reason}`,
		)

		const user = await this.prisma.user.findUnique({ where: { id: input.userId } })
		if (user) {
			await this.notificationService.notifyDeviceRevokedByAdmin(
				user,
				device.name || input.deviceId,
				adminUser.email,
				input.reason,
				'en',
			)
		}

		return {
			success: true,
			message: `Device ${device.name || input.deviceId} revoked successfully`,
			affectedUserId: input.userId,
			auditLogId: auditLog.id,
		}
	}

	/**
	 * Revoke all devices for a user (emergency)
	 */
	async revokeAllUserDevices(adminUser: User, input: RevokeAllUserDevicesInput): Promise<AdminActionSuccessModel> {
		// Get all devices
		const devices = await this.deviceTrustService.getUserDevices(input.userId)

		if (devices.length === 0) {
			return {
				success: true,
				message: 'User has no active devices',
				affectedUserId: input.userId,
			}
		}

		// Revoke all devices
		await this.prisma.$transaction(async tx => {
			// 1. Mark all devices as revoked
			await tx.trustedDevice.updateMany({
				where: { userId: input.userId },
				data: {
					isActive: false,
					revokedAt: new Date(),
				},
			})

			// 2. Invalidate all sessions
			await tx.session.updateMany({
				where: { userId: input.userId },
				data: { revokedAt: new Date() },
			})

			// 3. Create audit log
			await tx.auditLog.create({
				data: {
					userId: adminUser.id,
					action: 'ADMIN_REVOKED_ALL_USER_DEVICES',
					category: EAuditCategory.ADMIN,
					success: true,
					metadata: {
						targetUserId: input.userId,
						devicesRevoked: devices.length,
						reason: input.reason,
						timestamp: new Date().toISOString(),
					} as Prisma.InputJsonValue,
				},
			})
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: input.userId,
			event: ESecurityEvent.DEVICE_REVOKED,
			severity: ESecuritySeverity.CRITICAL,
			metadata: {
				timestamp: new Date().toISOString(),
				adminId: adminUser.id,
				adminEmail: adminUser.email,
				reason: input.reason,
				devicesRevoked: devices.length,
				allDevices: true,
				revokedBy: adminUser.email,
			} as IAdminActionMetadata,
		})

		this.logger.warn(
			`Admin ${adminUser.email} revoked ALL ${devices.length} devices for user ${input.userId}. Reason: ${input.reason}`,
		)

		return {
			success: true,
			message: `All ${devices.length} devices revoked successfully`,
			affectedUserId: input.userId,
		}
	}

	/**
	 * Get security events for a user
	 */
	async getUserSecurityEvents(input: GetUserSecurityEventsInput) {
		return this.securityEventService.getEvents({
			userId: input.userId,
			events: input.events,
			severities: input.severities,
			limit: input.limit || 50,
		})
	}
}
