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
export type TSecurityEventMetadata =
	| ISecurityEventMetadata
	| IAuthEventMetadata
	| I2FAEventMetadata
	| IDeviceEventMetadata
	| ISuspiciousActivityMetadata

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
