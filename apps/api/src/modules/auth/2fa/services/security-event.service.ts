import { CoreService } from '@/core/core.service'
import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import type { ISessionMetadata } from '@/shared/types'
import { Injectable, Logger } from '@nestjs/common'
import { EAuditCategory, ESecurityEvent, ESecuritySeverity, type Prisma } from '@prisma/__generated__'

import type { ICreateSecurityEventInput, ISecurityEventFilter } from '../types'

/**
 * Security Event Service
 * Centralized logging and management of security events
 */
@Injectable()
export class SecurityEventService extends CoreService {
	private readonly logger = new Logger(SecurityEventService.name)

	constructor(i18n: I18nService, prisma: PrismaService, redis: RedisService) {
		super(i18n, prisma, redis)
	}

	/**
	 * Log a security event
	 * @param input Event data
	 */
	async logEvent(input: ICreateSecurityEventInput): Promise<void> {
		try {
			await this.prisma.securityEvent.create({
				data: {
					userId: input.userId,
					event: input.event,
					severity: input.severity,
					ip: input.metadata.ip,
					userAgent: input.metadata.userAgent,
					country: input.metadata.country,
					city: input.metadata.city,
					deviceId: input.metadata.deviceId,
					riskScore: input.riskScore,
					riskFactors: input.riskFactors as Prisma.JsonValue,
					metadata: input.metadata as unknown as Prisma.JsonObject,
				},
			})

			// Log to application logger for critical events
			if (input.severity === ESecuritySeverity.CRITICAL || input.severity === ESecuritySeverity.HIGH) {
				this.logger.warn(
					`Security event [${input.severity}]: ${input.event} for user ${input.userId}`,
					input.metadata,
				)
			}

			// Also log to audit log for compliance
			await this.prisma.auditLog.create({
				data: {
					userId: input.userId,
					action: input.event,
					category: EAuditCategory.SECURITY,
					success: input.severity !== ESecuritySeverity.CRITICAL,
					ip: input.metadata.ip,
					userAgent: input.metadata.userAgent,
					country: input.metadata.country,
					city: input.metadata.city,
					metadata: input.metadata as unknown as Prisma.JsonObject,
				},
			})
		} catch (error) {
			this.logger.error(`Failed to log security event: ${(error as Error).message}`, error)
			// Don't throw - logging failure shouldn't break the flow
		}
	}

	/**
	 * Log successful login
	 */
	async logLoginSuccess(userId: string, session: ISessionMetadata, riskScore?: number): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.LOGIN_SUCCESS,
			severity: ESecuritySeverity.LOW,
			metadata: {
				timestamp: new Date().toISOString(),
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
			riskScore,
		})
	}

	/**
	 * Log failed login attempt
	 */
	async logLoginFailed(userId: string, session: ISessionMetadata, reason: string, riskScore?: number): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.LOGIN_FAILED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				timestamp: new Date().toISOString(),
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
				reason,
			},
			riskScore,
		})
	}

	/**
	 * Log 2FA verification success
	 */
	async log2FASuccess(userId: string, methodType: string, session: ISessionMetadata): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.TWO_FA_VERIFIED,
			severity: ESecuritySeverity.LOW,
			metadata: {
				timestamp: new Date().toISOString(),
				methodType,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
		})
	}

	/**
	 * Log 2FA verification failure
	 */
	async log2FAFailed(userId: string, methodType: string, session: ISessionMetadata, attempts: number): Promise<void> {
		const severity = attempts >= 3 ? ESecuritySeverity.HIGH : ESecuritySeverity.MEDIUM

		await this.logEvent({
			userId,
			event: ESecurityEvent.TWO_FA_FAILED,
			severity,
			metadata: {
				timestamp: new Date().toISOString(),
				methodType,
				attempts,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
		})
	}

	/**
	 * Log suspicious activity
	 */
	async logSuspiciousActivity(
		userId: string,
		session: ISessionMetadata,
		reason: string,
		riskScore: number,
	): Promise<void> {
		await this.logEvent({
			userId,
			event: ESecurityEvent.SUSPICIOUS_LOGIN,
			severity: ESecuritySeverity.HIGH,
			metadata: {
				timestamp: new Date().toISOString(),
				reason,
				ip: session.ip,
				userAgent: `${session.device.browser} on ${session.device.os}`,
				country: session.location.country,
				city: session.location.city,
			},
			riskScore,
		})
	}

	/**
	 * Get security events for user
	 */
	async getEvents(filter: ISecurityEventFilter) {
		const where: Prisma.SecurityEventWhereInput = {}

		if (filter.userId) where.userId = filter.userId
		if (filter.events) where.event = { in: filter.events }
		if (filter.severities) where.severity = { in: filter.severities }
		if (filter.resolved !== undefined) where.resolved = filter.resolved

		if (filter.dateFrom || filter.dateTo) {
			where.createdAt = {}
			if (filter.dateFrom) where.createdAt.gte = filter.dateFrom
			if (filter.dateTo) where.createdAt.lte = filter.dateTo
		}

		return this.prisma.securityEvent.findMany({
			where,
			take: filter.limit || 50,
			skip: filter.offset || 0,
			orderBy: { createdAt: 'desc' },
		})
	}

	/**
	 * Mark event as resolved
	 */
	async resolveEvent(eventId: string, resolvedBy: string): Promise<void> {
		await this.prisma.securityEvent.update({
			where: { id: eventId },
			data: {
				resolved: true,
				resolvedAt: new Date(),
				resolvedBy,
			},
		})
	}

	/**
	 * Get unresolved high-severity events
	 */
	async getUnresolvedCriticalEvents(userId?: string) {
		return this.prisma.securityEvent.findMany({
			where: {
				userId,
				resolved: false,
				severity: { in: [ESecuritySeverity.HIGH, ESecuritySeverity.CRITICAL] },
			},
			orderBy: { createdAt: 'desc' },
			take: 20,
		})
	}
}
