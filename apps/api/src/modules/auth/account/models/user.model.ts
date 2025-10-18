import { Field, HideField, ID, ObjectType } from '@nestjs/graphql'

import { E2FAMethod, EUserRole } from './enums'

/**
 * User GraphQL model
 * Represents a user account with security features and profile information
 * Password field is hidden from GraphQL schema for security
 */
@ObjectType('User', {
	description: 'User account with profile, security, and authentication settings',
})
export class User {
	// ===== Identity =====

	@Field(() => ID, {
		description: 'Unique user identifier (UUID v4)',
	})
	id: string

	// ===== Profile Fields =====

	@Field({
		description: 'Full name of the user (displayed in UI)',
	})
	fullName: string

	@Field({
		nullable: true,
		description: 'First name (optional, parsed from fullName)',
	})
	firstName?: string

	@Field({
		nullable: true,
		description: 'Last name (optional, parsed from fullName)',
	})
	lastName?: string

	@Field({
		description: 'Email address (unique, used for login and notifications)',
	})
	email: string

	@Field({
		nullable: true,
		description: 'Phone number in E.164 format (optional, used for SMS 2FA)',
	})
	phone?: string

	@Field({
		nullable: true,
		description: 'Avatar image URL (optional)',
	})
	avatar?: string

	@Field({
		nullable: true,
		description: 'User biography or description (optional)',
	})
	bio?: string

	// ===== Password (Hidden) =====

	@HideField()
	password: string

	// ===== Role-Based Access Control =====

	@Field(() => [EUserRole], {
		description: 'User roles for access control (can have multiple roles)',
	})
	roles: EUserRole[]

	// ===== Email Verification =====

	@Field({
		description: 'Whether the email address has been verified',
	})
	isEmailVerified: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when email was verified (null if not verified)',
	})
	emailVerifiedAt?: Date

	@Field({
		nullable: true,
		description: 'Whether user has unsubscribed from email notifications',
	})
	isUnsubscribed?: boolean

	@Field({
		nullable: true,
		description: 'Timestamp of last email bounce (for reputation tracking)',
	})
	emailBouncedAt?: Date

	// ===== Phone Verification =====

	@Field({
		description: 'Whether the phone number has been verified',
	})
	isPhoneVerified: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when phone was verified (null if not verified)',
	})
	phoneVerifiedAt?: Date

	@Field({
		nullable: true,
		description: 'Timestamp of last SMS delivery failure (for reputation tracking)',
	})
	phoneBouncedAt?: Date

	// ===== Unified 2FA System =====

	@Field({
		description: 'Global 2FA status - true if user has at least one active 2FA method',
	})
	is2FAEnabled: boolean

	@Field(() => E2FAMethod, {
		nullable: true,
		description: 'User preferred 2FA method used by default during login',
	})
	preferred2FAMethod?: E2FAMethod

	@Field({
		description: 'Whether 2FA is mandatory for this user (admin-enforced for compliance)',
	})
	require2FA: boolean

	// ===== Account Security =====

	@Field({
		nullable: true,
		description: 'Timestamp of last successful login',
	})
	lastLoginAt?: Date

	@Field({
		nullable: true,
		description: 'IP address of last successful login',
	})
	lastLoginIp?: string

	@Field({
		nullable: true,
		description: 'Timestamp when password was last changed',
	})
	passwordChangedAt?: Date

	// ===== Risk Assessment =====

	@Field({
		nullable: true,
		description: 'User risk score (0-100): 0 = trusted, 100 = high risk. Based on login patterns and behavior.',
	})
	riskScore?: number

	@Field({
		nullable: true,
		description: 'Timestamp when risk score was last calculated',
	})
	lastRiskAssessAt?: Date

	// ===== Soft Delete =====

	@Field({
		nullable: true,
		description: 'Soft delete timestamp (null if account is active)',
	})
	deletedAt?: Date

	// ===== Timestamps =====

	@Field({
		description: 'Account creation timestamp',
	})
	createdAt: Date

	@Field({
		description: 'Account last update timestamp (auto-updated)',
	})
	updatedAt: Date
}
