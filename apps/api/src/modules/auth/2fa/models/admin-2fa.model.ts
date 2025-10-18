import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { E2FAMethod, ESecurityEvent, ESecuritySeverity } from '@prisma/__generated__'

/**
 * Admin action success response
 */
@ObjectType('AdminActionSuccess')
export class AdminActionSuccessModel {
	@Field(() => Boolean, { description: 'Operation success status' })
	success: boolean

	@Field(() => String, { description: 'Success message' })
	message: string

	@Field(() => String, { description: 'Affected user ID' })
	affectedUserId: string

	@Field(() => String, { nullable: true, description: 'Admin action ID for audit trail' })
	auditLogId?: string
}

/**
 * User 2FA status for admin view
 */
@ObjectType('User2FAStatus')
export class User2FAStatusModel {
	@Field(() => String, { description: 'User ID' })
	userId: string

	@Field(() => String, { description: 'User email' })
	email: string

	@Field(() => Boolean, { description: 'Whether 2FA is enabled' })
	is2FAEnabled: boolean

	@Field(() => String, { nullable: true, description: 'Preferred 2FA method' })
	preferred2FAMethod?: E2FAMethod

	@Field(() => [TwoFactorMethodSummary], { description: 'Active 2FA methods' })
	methods: TwoFactorMethodSummary[]

	@Field(() => [TrustedDeviceSummary], { description: 'Trusted devices' })
	trustedDevices: TrustedDeviceSummary[]

	@Field(() => Int, { description: 'Number of backup codes remaining' })
	backupCodesRemaining: number

	@Field(() => Float, { nullable: true, description: 'User risk score' })
	riskScore?: number

	@Field(() => [SecurityEventSummary], { description: 'Recent security events' })
	recentEvents: SecurityEventSummary[]
}

/**
 * 2FA method summary for admin view
 */
@ObjectType('TwoFactorMethodSummary')
export class TwoFactorMethodSummary {
	@Field(() => String, { description: 'Method ID' })
	id: string

	@Field(() => String, { description: 'Method type' })
	method: E2FAMethod

	@Field(() => String, { nullable: true, description: 'Method name' })
	name?: string

	@Field(() => Boolean, { description: 'Is active' })
	isActive: boolean

	@Field(() => Boolean, { description: 'Is primary' })
	isPrimary: boolean

	@Field(() => Date, { nullable: true, description: 'Last used' })
	lastUsedAt?: Date

	@Field(() => Int, { description: 'Use count' })
	useCount: number

	@Field(() => Date, { description: 'Created at' })
	createdAt: Date
}

/**
 * Trusted device summary for admin view
 */
@ObjectType('TrustedDeviceSummary')
export class TrustedDeviceSummary {
	@Field(() => String, { description: 'Device ID' })
	id: string

	@Field(() => String, { description: 'Device identifier' })
	deviceId: string

	@Field(() => String, { nullable: true, description: 'Device name' })
	name?: string

	@Field(() => String, { nullable: true, description: 'Browser' })
	browser?: string

	@Field(() => String, { nullable: true, description: 'Operating system' })
	os?: string

	@Field(() => Float, { description: 'Trust score' })
	trustScore: number

	@Field(() => String, { nullable: true, description: 'Last IP' })
	lastIp?: string

	@Field(() => String, { nullable: true, description: 'Last country' })
	lastCountry?: string

	@Field(() => Date, { description: 'Last seen' })
	lastSeenAt: Date

	@Field(() => Boolean, { description: 'Is active' })
	isActive: boolean
}

/**
 * Security event summary for admin view
 */
@ObjectType('SecurityEventSummary')
export class SecurityEventSummary {
	@Field(() => String, { description: 'Event ID' })
	id: string

	@Field(() => String, { description: 'Event type' })
	event: ESecurityEvent

	@Field(() => String, { description: 'Severity' })
	severity: ESecuritySeverity

	@Field(() => String, { nullable: true, description: 'IP address' })
	ip?: string

	@Field(() => String, { nullable: true, description: 'Country' })
	country?: string

	@Field(() => String, { nullable: true, description: 'City' })
	city?: string

	@Field(() => Boolean, { description: 'Resolved status' })
	resolved: boolean

	@Field(() => Date, { description: 'Event timestamp' })
	createdAt: Date
}
