import { Field, ID, ObjectType } from '@nestjs/graphql'

/**
 * Geographic location information for a session
 */
@ObjectType('Location', {
	description: 'Geographic location information derived from IP address',
})
export class Location {
	@Field({
		description: 'Country name (e.g., "United States")',
	})
	country: string

	@Field({
		description: 'City name (e.g., "New York")',
	})
	city: string

	@Field({
		description: 'Latitude coordinate',
	})
	latitude: number

	@Field({
		description: 'Longitude coordinate',
	})
	longitude: number
}

/**
 * Device information parsed from User-Agent
 */
@ObjectType('Device', {
	description: 'Device information parsed from User-Agent header',
})
export class Device {
	@Field({
		description: 'Browser name and version (e.g., "Chrome 120.0")',
	})
	browser: string

	@Field({
		description: 'Operating system (e.g., "macOS 14.0")',
	})
	os: string

	@Field({
		description: 'Device type (desktop, mobile, tablet)',
	})
	type: string
}

/**
 * Session metadata including location, device, and IP
 */
@ObjectType('SessionMetadata', {
	description: 'Session metadata including location, device, and network information',
})
export class SessionMetadata {
	@Field(() => Location, {
		description: 'Geographic location of the session',
	})
	location: Location

	@Field(() => Device, {
		description: 'Device information',
	})
	device: Device

	@Field({
		description: 'IP address (IPv4 or IPv6)',
	})
	ip: string
}

/**
 * User session representing an active login
 */
@ObjectType('Session', {
	description: 'Active user session with security tracking',
})
export class Session {
	@Field(() => ID, {
		description: 'Unique session identifier (used for session management)',
	})
	id: string

	@Field({
		description: 'User ID associated with this session',
	})
	userId: string

	@Field(() => SessionMetadata, {
		description: 'Session metadata (location, device, IP)',
	})
	metadata: SessionMetadata

	@Field({
		nullable: true,
		description: 'Whether this session is from a trusted device (reduces 2FA friction)',
	})
	isTrusted?: boolean

	@Field({
		nullable: true,
		description: 'Risk score for this session (0-100): 0 = safe, 100 = suspicious',
	})
	riskScore?: number

	@Field({
		nullable: true,
		description: 'Whether 2FA has been verified for this session',
	})
	is2FAVerified?: boolean

	@Field({
		nullable: true,
		description: 'Timestamp when 2FA was successfully verified',
	})
	verified2FAAt?: Date

	@Field({
		description: 'Session creation timestamp (ISO 8601 string)',
	})
	createdAt: string
}
