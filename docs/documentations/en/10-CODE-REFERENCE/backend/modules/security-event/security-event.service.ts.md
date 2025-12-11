# File: modules\security-event\security-event.service.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security-event/security-event.service.ts`

## Category
Backend

## File Type
TS (security-event.service.ts)

## Size
6818 characters, 240 lines

## Full Code

```typescript
import { CoreService } from '@/core/core.service'
import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { Injectable } from '@nestjs/common'
import { ESecurityEvent, ESecuritySeverity, Prisma } from '@prisma/__generated__'

import { IRiskFactor } from '../auth'

/**
 * Risk factor data structure for security event analysis
 */
// export interface RiskFactor {
// 	/** Risk factor type (e.g., "new_device", "unusual_location") */
// 	type: string
// 	/** Risk factor description */
// 	description: string
// 	/** Risk weight (0-100) */
// 	weight: number
// }

/**
 * Input data for creating a security event
 */
export interface CreateSecurityEventInput {
	/** User ID associated with the event */
	userId: string
	/** Type of security event */
	event: ESecurityEvent
	/** Event severity level (defaults to LOW if not provided) */
	severity?: ESecuritySeverity
	/** IP address of the request */
	ip?: string
	/** User agent string */
	userAgent?: string
	/** Geographic country */
	country?: string
	/** Geographic city */
	city?: string
	/** Device fingerprint ID */
	deviceId?: string
	/** Calculated risk score (0-100) */
	riskScore?: number
	/** Array of risk factors contributing to the score */
	riskFactors?: IRiskFactor[]
	/** Additional metadata as JSON */
	metadata?: Prisma.JsonValue
}

/**
 * SecurityEventService
 *
 * Platform-wide centralized security event tracking and audit system.
 * Used across all modules (Auth, 2FA, Session, WebAuthn, Passkeys, etc.)
 * for comprehensive security monitoring and compliance.
 *
 * Enterprise features:
 * - Risk scoring with detailed factor analysis
 * - Severity-based event classification
 * - Comprehensive metadata tracking (IP, location, device)
 * - Query filtering by event type, severity, resolution status
 * - Real-time security monitoring support
 */
@Injectable()
export class SecurityEventService extends CoreService {
	constructor(i18n: I18nService, prisma: PrismaService) {
		super({ i18n, prisma })
	}

	/**
	 * Create a new security event with full metadata tracking.
	 *
	 * This method records critical security events for audit trails and real-time monitoring.
	 * All events are stored with timestamps, location data, device fingerprints, and risk analysis.
	 *
	 * @param input - Security event creation data
	 * @returns Created security event record
	 *
	 * @example
	 * ```typescript
	 * await securityEventService.create({
	 *   userId: user.id,
	 *   event: ESecurityEvent.PASSWORD_CHANGED,
	 *   severity: ESecuritySeverity.MEDIUM,
	 *   ip: req.ip,
	 *   userAgent: req.headers['user-agent'],
	 *   country: meta.location.country,
	 *   city: meta.location.city,
	 *   deviceId: meta.deviceId,
	 *   riskScore: 25,
	 *   riskFactors: [
	 *     { type: 'new_device', description: 'First time from this device', weight: 25 }
	 *   ],
	 *   metadata: { reason: 'user_initiated' }
	 * })
	 * ```
	 */
	async create(input: CreateSecurityEventInput) {
		const {
			userId,
			event,
			severity = ESecuritySeverity.LOW,
			ip,
			userAgent,
			country,
			city,
			deviceId,
			riskScore,
			riskFactors,
			metadata,
		} = input

		return this.prisma.securityEvent.create({
			data: {
				userId,
				event,
				severity,
				ip,
				userAgent,
				country,
				city,
				deviceId,
				riskScore,
				riskFactors: riskFactors ? (riskFactors as unknown as Prisma.JsonValue) : undefined,
				metadata,
			},
		})
	}

	/**
	 * Retrieve security events for a specific user with optional filtering.
	 *
	 * Supports filtering by:
	 * - Event type (login, 2FA, password operations, etc.)
	 * - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
	 * - Resolution status (resolved vs. unresolved)
	 * - Date range
	 *
	 * Results are ordered by creation time (newest first) and can be paginated.
	 *
	 * @param userId - User ID to query events for
	 * @param options - Query filters and pagination
	 * @param options.event - Filter by specific event type
	 * @param options.severity - Filter by severity level
	 * @param options.resolved - Filter by resolution status
	 * @param options.take - Maximum number of results (default: 50)
	 * @param options.skip - Number of results to skip (for pagination)
	 * @returns Array of security events matching the criteria
	 *
	 * @example
	 * ```typescript
	 * // Get all unresolved high-severity events
	 * const criticalEvents = await securityEventService.findByUser(userId, {
	 *   severity: ESecuritySeverity.HIGH,
	 *   resolved: false,
	 *   take: 20
	 * })
	 *
	 * // Get password-related events
	 * const passwordEvents = await securityEventService.findByUser(userId, {
	 *   event: ESecurityEvent.PASSWORD_CHANGED
	 * })
	 * ```
	 */
	async findByUser(
		userId: string,
		options?: {
			event?: ESecurityEvent
			severity?: ESecuritySeverity
			resolved?: boolean
			take?: number
			skip?: number
		},
	) {
		const { event, severity, resolved, take = 50, skip = 0 } = options || {}

		return this.prisma.securityEvent.findMany({
			where: {
				userId,
				...(event && { event }),
				...(severity && { severity }),
				...(resolved !== undefined && { resolved }),
			},
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip,
		})
	}

	/**
	 * Mark a security event as resolved.
	 *
	 * Used by administrators or automated systems to acknowledge and resolve
	 * security events after investigation.
	 *
	 * @param eventId - Security event ID
	 * @param resolvedBy - User ID of the resolver (admin or system)
	 * @returns Updated security event
	 *
	 * @example
	 * ```typescript
	 * await securityEventService.resolve(eventId, adminUserId)
	 * ```
	 */
	async resolve(eventId: string, resolvedBy?: string) {
		return this.prisma.securityEvent.update({
			where: { id: eventId },
			data: {
				resolved: true,
				resolvedAt: new Date(),
				resolvedBy,
			},
		})
	}

	/**
	 * Calculate risk score based on multiple risk factors.
	 *
	 * This is a utility method to help compute aggregate risk scores from individual factors.
	 * The score is capped at 100 (maximum risk).
	 *
	 * @param factors - Array of risk factors with weights
	 * @returns Total risk score (0-100)
	 *
	 * @example
	 * ```typescript
	 * const score = securityEventService.calculateRiskScore([
	 *   { type: 'new_device', description: '...', weight: 30 },
	 *   { type: 'unusual_location', description: '...', weight: 40 }
	 * ])
	 * // Returns: 70
	 * ```
	 */
	calculateRiskScore(factors: IRiskFactor[]): number {
		const total = factors.reduce((sum, factor) => sum + factor.weight, 0)
		return Math.min(total, 100) // Cap at 100
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.627Z*
