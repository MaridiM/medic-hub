# File: modules\auth\2fa\types\security-event.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/types/security-event.types.ts`

## Category
Backend

## File Type
TS (security-event.types.ts)

## Size
2567 characters, 116 lines

## Full Code

```typescript
import type { ESecurityEvent, ESecuritySeverity } from '@prisma/__generated__'

/**
 * Base security event metadata
 */
export interface ISecurityEventMetadata {
	timestamp: string
	ip?: string
	userAgent?: string
	country?: string
	city?: string
	deviceId?: string
}

/**
 * Authentication event metadata
 */
export interface IAuthEventMetadata extends ISecurityEventMetadata {
	method?: '2fa' | 'password' | 'session'
	success: boolean
	failureReason?: string
	attempts?: number
}

/**
 * 2FA event metadata
 */
export interface I2FAEventMetadata extends ISecurityEventMetadata {
	methodType: string
	methodId?: string
	success: boolean
	failureReason?: string
	backupCodeUsed?: boolean
}

/**
 * Device event metadata
 */
export interface IDeviceEventMetadata extends ISecurityEventMetadata {
	deviceId: string
	deviceName?: string
	deviceType?: string
	trustScore?: number
	fingerprint?: Record<string, unknown>
}

/**
 * Suspicious activity metadata
 */
export interface ISuspiciousActivityMetadata extends ISecurityEventMetadata {
	reason: string
	anomalies?: Array<{
		type: string
		severity: string
		description: string
	}>
	riskScore: number
	blocked: boolean
}

/**
 * Administrative action metadata
 * Used when admins perform actions on user accounts
 */
export interface IAdminActionMetadata extends ISecurityEventMetadata {
	/** Admin who performed the action */
	adminId: string
	/** Admin's email for quick identification */
	adminEmail?: string
	/** Reason provided by admin */
	reason: string
	/** Target user affected by action */
	targetUserId?: string
	/** Target user's email */
	targetEmail?: string
	/** Additional action-specific fields */
	[key: string]: any
}

/**
 * Union type for all security event metadata types
 */
export type TSecurityEventMetadata =
	| ISecurityEventMetadata
	| IAuthEventMetadata
	| I2FAEventMetadata
	| IDeviceEventMetadata
	| ISuspiciousActivityMetadata
	| IAdminActionMetadata // ✅ Added admin action type

/**
 * Security event creation input
 */
export interface ICreateSecurityEventInput {
	userId: string
	event: ESecurityEvent
	severity: ESecuritySeverity
	metadata: TSecurityEventMetadata
	riskScore?: number
	riskFactors?: Record<string, number>
}

/**
 * Security event filter
 */
export interface ISecurityEventFilter {
	userId?: string
	events?: ESecurityEvent[]
	severities?: ESecuritySeverity[]
	dateFrom?: Date
	dateTo?: Date
	resolved?: boolean
	limit?: number
	offset?: number
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.214Z*
