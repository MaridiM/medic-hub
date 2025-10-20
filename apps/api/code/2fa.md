# 2FA Module

**root**
`src/modules/auth/2fa/2fa.module.ts`

```typescript
import { NotificationService } from '@/modules/notification'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { TwoFactorVerifiedGuard } from './guards'
import { AdminTwoFactorResolver, TwoFactorResolver } from './resolvers'
import {
	AdminTwoFactorService,
	BackupCodeService,
	DeviceTrustService,
	SecurityEventService,
	TwoFactorCronService,
	TwoFactorMethodService,
	WebAuthnService,
} from './services'

/**
 * Two-Factor Authentication Module
 *
 * Provides enterprise-grade 2FA functionality:
 * - Multiple 2FA methods (TOTP, OTP Email/SMS, WebAuthn, Passkeys)
 * - Backup codes management
 * - Device trust scoring
 * - Security event logging
 * - Risk-based authentication
 * - Administrative management (NEW)
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [TwoFactorModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [
		// GraphQL Resolvers
		TwoFactorResolver,
		AdminTwoFactorResolver,

		// Core Services
		TwoFactorMethodService,
		BackupCodeService,
		DeviceTrustService,
		SecurityEventService,
		AdminTwoFactorService,
		TwoFactorCronService,
		WebAuthnService,

		// Guards
		TwoFactorVerifiedGuard,

		// Notifications
		NotificationService,
	],
})
export class TwoFactorModule {}
```

`src/modules/auth/2fa/index.ts`

```typescript
// Module
export * from './2fa.module'
export * from './resolvers'
export * from './services'
export * from './dtos'
export * from './models'
export * from './guards'
export * from './types'
export * from './constants'
export * from './utils'
```

**constants**
`src/modules/auth/2fa/constants/2fa.constants.ts`

```typescript
import type { Prisma } from '@prisma/__generated__'

/**
 * Core 2FA configuration constants
 */

// ===== GENERAL 2FA SETTINGS =====

export const TWO_FA_CONFIG = {
	/** Maximum number of 2FA methods per user */
	MAX_METHODS_PER_USER: 5,

	/** Maximum number of active sessions requiring 2FA */
	MAX_ACTIVE_SESSIONS: 10,

	/** Allow backup codes as fallback */
	ALLOW_BACKUP_CODES: true,

	/** Force 2FA for admin users */
	FORCE_ADMIN_2FA: true,

	/** Session lifetime after 2FA verification (seconds) */
	SESSION_LIFETIME_AFTER_2FA: 86400, // 24 hours

	/** Remember device duration (seconds) */
	REMEMBER_DEVICE_DURATION: 2592000, // 30 days
} as const

// ===== TOTP SETTINGS =====

export const TOTP_CONFIG = {
	/** Allowed time window drift (±N periods) */
	WINDOW: 1,

	/** Default algorithm */
	ALGORITHM: 'SHA1' as const,

	/** Code length */
	DIGITS: 6,

	/** Time step in seconds */
	PERIOD: 30,

	/** Secret length in bytes */
	SECRET_LENGTH: 20,

	/** QR code size */
	QR_CODE_SIZE: 300,

	/** QR code error correction */
	QR_ERROR_CORRECTION: 'H' as const,
} as const

/**
 * QR Code Settings
 */
export const QR_CODE_OPTIONS = {
	errorCorrectionLevel: 'H' as const,
	margin: 1,
	width: 300,
	type: 'image/png' as const,
	color: {
		dark: '#000000',
		light: '#FFFFFF',
	},
} as const

// ===== OTP SETTINGS =====

export const OTP_CONFIG = {
	/** Code length */
	CODE_LENGTH: 6,

	/** Code expiry (seconds) */
	CODE_EXPIRY: 300, // 5 minutes

	/** Max verification attempts per code */
	MAX_ATTEMPTS: 3,

	/** Cooldown between sends (seconds) */
	SEND_COOLDOWN: 60, // 1 minute

	/** Max sends per hour */
	MAX_SENDS_PER_HOUR: 5,

	/** Code reuse prevention window (seconds) */
	REUSE_PREVENTION_WINDOW: 90,
} as const

// ===== BACKUP CODES =====

export const BACKUP_CODE_CONFIG = {
	/** Number of codes to generate */
	COUNT: 10,

	/** Code length in bytes */
	BYTES: 4,

	/** Code format */
	FORMAT: 'HEX' as const,

	/** Expiration (null = never expire) */
	EXPIRY_DAYS: null as number | null,

	/** Minimum remaining codes before warning */
	LOW_CODES_THRESHOLD: 3,
} as const

// ===== RATE LIMITING =====

export const RATE_LIMIT_CONFIG = {
	/** Window duration (seconds) */
	WINDOW: 300, // 5 minutes

	/** Max attempts per window */
	MAX_ATTEMPTS: 5,

	/** Account lock duration after max attempts (seconds) */
	LOCK_DURATION: 900, // 15 minutes

	/** Progressive lock multiplier */
	PROGRESSIVE_LOCK_MULTIPLIER: 2,
} as const

// ===== REDIS KEYS =====

export const REDIS_KEYS = {
	// 2FA codes
	OTP_CODE: (userId: string) => `2fa:otp:code:${userId}`,
	OTP_ATTEMPTS: (userId: string) => `2fa:otp:attempts:${userId}`,
	OTP_COOLDOWN: (userId: string) => `2fa:otp:cooldown:${userId}`,
	OTP_USED: (userId: string, code: string) => `2fa:otp:used:${userId}:${code}`,

	// TOTP
	TOTP_TEMP_SECRET: (userId: string) => `2fa:totp:temp:${userId}`,
	TOTP_USED: (userId: string, code: string) => `2fa:totp:used:${userId}:${code}`,

	// Rate limiting
	RATE_LIMIT: (userId: string, action: string) => `2fa:rate:${userId}:${action}`,

	// Device trust
	DEVICE_FINGERPRINT: (deviceId: string) => `2fa:device:fp:${deviceId}`,
	DEVICE_TRUST: (userId: string, deviceId: string) => `2fa:device:trust:${userId}:${deviceId}`,

	// Risk
	RISK_SCORE: (userId: string) => `2fa:risk:score:${userId}`,
	RISK_FACTORS: (userId: string) => `2fa:risk:factors:${userId}`,

	// WebAuthn
	WEBAUTHN_CHALLENGE: (challengeId: string) => `webauthn:challenge:${challengeId}`,
	WEBAUTHN_REGISTRATION: (userId: string) => `webauthn:registration:${userId}`,
	WEBAUTHN_AUTHENTICATION: (userId: string) => `webauthn:authentication:${userId}`,
} as const

// ===== AUDIT ACTIONS =====

export const AUDIT_ACTIONS = {
	// Method management
	METHOD_ADDED: '2FA_METHOD_ADDED',
	METHOD_REMOVED: '2FA_METHOD_REMOVED',
	METHOD_UPDATED: '2FA_METHOD_UPDATED',
	PRIMARY_METHOD_CHANGED: '2FA_PRIMARY_METHOD_CHANGED',

	// Verification
	VERIFICATION_SUCCESS: '2FA_VERIFICATION_SUCCESS',
	VERIFICATION_FAILED: '2FA_VERIFICATION_FAILED',
	BACKUP_CODE_USED: '2FA_BACKUP_CODE_USED',

	// Setup
	TOTP_SETUP_STARTED: '2FA_TOTP_SETUP_STARTED',
	TOTP_SETUP_COMPLETED: '2FA_TOTP_SETUP_COMPLETED',
	OTP_SETUP_COMPLETED: '2FA_OTP_SETUP_COMPLETED',

	// WebAuthn
	WEBAUTHN_REGISTERED: '2FA_WEBAUTHN_REGISTERED',
	WEBAUTHN_VERIFIED: '2FA_WEBAUTHN_VERIFIED',
	PASSKEY_CREATED: '2FA_PASSKEY_CREATED',
	PASSKEY_USED: '2FA_PASSKEY_USED',

	// Backup codes
	BACKUP_CODES_GENERATED: '2FA_BACKUP_CODES_GENERATED',
	BACKUP_CODES_REGENERATED: '2FA_BACKUP_CODES_REGENERATED',
	BACKUP_CODES_VIEWED: '2FA_BACKUP_CODES_VIEWED',

	// Device trust
	DEVICE_TRUSTED: '2FA_DEVICE_TRUSTED',
	DEVICE_UNTRUSTED: '2FA_DEVICE_UNTRUSTED',

	// System
	ENABLED: '2FA_ENABLED',
	DISABLED: '2FA_DISABLED',
	FORCED: '2FA_FORCED',
} as const

export type T2FAAuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS]

// ===== HELPER FUNCTIONS =====

/**
 * Create standardized audit metadata
 */
export const createAuditMetadata = (
	data: Partial<{ timestamp?: string }> & Record<string, unknown> = {},
): Prisma.InputJsonObject => {
	return {
		timestamp: new Date().toISOString(),
		...data,
	}
}

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
	TOTP_CODE: /^\d{6}$/,
	OTP_CODE: /^\d{6}$/,
	BACKUP_CODE: /^[A-F0-9]{8}$/,
	PHONE_E164: /^\+[1-9]\d{7,14}$/,
	DEVICE_ID: /^[a-f0-9]{64}$/,
} as const
```

`src/modules/auth/2fa/constants/device.constants.ts`

```typescript
/**
 * Device trust and fingerprinting constants
 */

// ===== TRUST SCORING =====

export const DEVICE_TRUST = {
	/** Initial trust score for new devices */
	INITIAL_SCORE: 0,

	/** Minimum score to be considered trusted */
	TRUST_THRESHOLD: 75,

	/** Score increment per successful login */
	SUCCESS_INCREMENT: 5,

	/** Score decrement per failed attempt */
	FAILURE_DECREMENT: 10,

	/** Maximum trust score */
	MAX_SCORE: 100,

	/** Minimum trust score */
	MIN_SCORE: 0,

	/** Score decay per day of inactivity */
	DECAY_PER_DAY: 1,

	/** Days of inactivity before decay starts */
	DECAY_GRACE_PERIOD: 7,
} as const

// ===== DEVICE LIFETIME =====

export const DEVICE_LIFETIME = {
	/** Default device trust duration (seconds) */
	DEFAULT_DURATION: 2592000, // 30 days

	/** Maximum device trust duration (seconds) */
	MAX_DURATION: 7776000, // 90 days

	/** Minimum device trust duration (seconds) */
	MIN_DURATION: 86400, // 1 day

	/** Auto-revoke after inactivity (seconds) */
	AUTO_REVOKE_AFTER: 15552000, // 180 days
} as const

// ===== FINGERPRINTING =====

export const FINGERPRINT_CONFIG = {
	/** Fingerprint hash algorithm */
	ALGORITHM: 'sha256' as const,

	/** Minimum components required for valid fingerprint */
	MIN_COMPONENTS: 5,

	/** Fingerprint similarity threshold (0-1) */
	SIMILARITY_THRESHOLD: 0.8,

	/** Enable canvas fingerprinting */
	USE_CANVAS: true,

	/** Enable WebGL fingerprinting */
	USE_WEBGL: true,

	/** Enable audio fingerprinting */
	USE_AUDIO: false, // More invasive

	/** Enable font detection */
	USE_FONTS: true,
} as const

// ===== DEVICE LIMITS =====

export const DEVICE_LIMITS = {
	/** Maximum trusted devices per user */
	MAX_TRUSTED_DEVICES: 10,

	/** Maximum devices to keep in history */
	MAX_DEVICE_HISTORY: 50,

	/** Auto-cleanup devices older than (days) */
	CLEANUP_AFTER_DAYS: 365,
} as const

// ===== REDIS KEYS =====

export const DEVICE_REDIS_KEYS = {
	FINGERPRINT: (deviceId: string) => `device:fp:${deviceId}`,
	TRUST_SCORE: (userId: string, deviceId: string) => `device:trust:${userId}:${deviceId}`,
	LAST_SEEN: (deviceId: string) => `device:seen:${deviceId}`,
	LOCATION: (deviceId: string) => `device:location:${deviceId}`,
} as const
```

`src/modules/auth/2fa/constants/index.ts`

```typescript
export * from './2fa.constants'
export * from './device.constants'
export * from './risk.constants'
export * from './webauthn.constants'
```

`src/modules/auth/2fa/constants/risk.constants.ts`

```typescript
import { ERiskLevel } from '../types'

/**
 * Risk assessment and scoring constants
 */

// ===== RISK THRESHOLDS =====

export const RISK_THRESHOLDS = {
	[ERiskLevel.VERY_LOW]: { min: 0, max: 20 },
	[ERiskLevel.LOW]: { min: 21, max: 40 },
	[ERiskLevel.MEDIUM]: { min: 41, max: 60 },
	[ERiskLevel.HIGH]: { min: 61, max: 80 },
	[ERiskLevel.CRITICAL]: { min: 81, max: 100 },
} as const

// ===== RISK FACTOR WEIGHTS =====

export const RISK_WEIGHTS = {
	// Location factors
	NEW_COUNTRY: 20,
	NEW_CITY: 15,
	IMPOSSIBLE_TRAVEL: 40, // Too fast travel between locations
	HIGH_RISK_COUNTRY: 25,
	VPN_DETECTED: 10,

	// Device factors
	NEW_DEVICE: 15,
	UNTRUSTED_DEVICE: 20,
	DEVICE_ANOMALY: 25,

	// Behavioral factors
	UNUSUAL_TIME: 10,
	UNUSUAL_DAY: 5,
	RAPID_REQUESTS: 30,
	MULTIPLE_FAILED_ATTEMPTS: 35,

	// Account factors
	NEW_ACCOUNT: 10, // < 7 days old
	YOUNG_ACCOUNT: 5, // < 30 days old
	DORMANT_ACCOUNT: 15, // No activity > 90 days

	// Pattern factors
	DEVIATION_FROM_PATTERN: 20,
	SUSPICIOUS_USER_AGENT: 15,
	BOT_DETECTED: 50,
} as const

// ===== VELOCITY CHECKS =====

export const VELOCITY_CONFIG = {
	/** Maximum distance in km to travel in 1 hour (by plane) */
	MAX_TRAVEL_SPEED_KMH: 900,

	/** Time window for velocity check (seconds) */
	VELOCITY_WINDOW: 3600, // 1 hour

	/** Max login attempts per minute */
	MAX_ATTEMPTS_PER_MINUTE: 5,

	/** Max sessions per hour */
	MAX_SESSIONS_PER_HOUR: 10,
} as const

// ===== HIGH-RISK INDICATORS =====

export const HIGH_RISK_INDICATORS = {
	/** Countries with higher fraud rates (ISO codes) */
	HIGH_RISK_COUNTRIES: ['RU', 'CN', 'NG', 'VN', 'IN'],

	/** Suspicious user agent patterns */
	SUSPICIOUS_UA_PATTERNS: [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i],

	/** Known VPN/proxy ASNs */
	VPN_ASNS: [
		// Common VPN providers
		'AS14061', // DigitalOcean
		'AS16509', // Amazon (often used for proxies)
		// Add more as needed
	],
} as const

// ===== ACTIONS BY RISK LEVEL =====

export const RISK_ACTIONS = {
	[ERiskLevel.VERY_LOW]: {
		require2FA: false,
		blockAccess: false,
		logEvent: false,
		notifyUser: false,
	},
	[ERiskLevel.LOW]: {
		require2FA: false,
		blockAccess: false,
		logEvent: true,
		notifyUser: false,
	},
	[ERiskLevel.MEDIUM]: {
		require2FA: true,
		blockAccess: false,
		logEvent: true,
		notifyUser: false,
	},
	[ERiskLevel.HIGH]: {
		require2FA: true,
		blockAccess: false,
		logEvent: true,
		notifyUser: true,
	},
	[ERiskLevel.CRITICAL]: {
		require2FA: true,
		blockAccess: true,
		logEvent: true,
		notifyUser: true,
	},
} as const

// ===== CACHE SETTINGS =====

export const RISK_CACHE = {
	/** Risk score TTL (seconds) */
	SCORE_TTL: 300, // 5 minutes

	/** Risk factors TTL (seconds) */
	FACTORS_TTL: 600, // 10 minutes

	/** Location history TTL (seconds) */
	LOCATION_HISTORY_TTL: 86400, // 24 hours
} as const
```

`src/modules/auth/2fa/constants/webauthn.constants.ts`

```typescript
/**
 * WebAuthn and Passkey configuration constants
 * Following FIDO2 and WebAuthn Level 2 specifications
 */

// ===== RELYING PARTY (RP) CONFIGURATION =====

export const WEBAUTHN_RP = {
	/** Relying Party name (your app name) */
	NAME: process.env.APP_NAME || 'MyApp',

	/** Relying Party ID (your domain) */
	ID: process.env.WEBAUTHN_RP_ID || 'localhost',

	/** Origin (full URL) */
	ORIGIN: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000',
} as const

// ===== AUTHENTICATOR SELECTION =====

export const AUTHENTICATOR_SELECTION = {
	/** Authenticator attachment: 'platform', 'cross-platform', or undefined (both) */
	AUTHENTICATOR_ATTACHMENT: undefined as 'platform' | 'cross-platform' | undefined,

	/** Require resident key (for passwordless) */
	RESIDENT_KEY: 'preferred' as const,

	/** User verification */
	USER_VERIFICATION: 'preferred' as const,
} as const

// ===== ATTESTATION =====

export const ATTESTATION_CONFIG = {
	/** Attestation conveyance */
	CONVEYANCE: 'none' as const,

	/** Verify attestation (requires attestation metadata) */
	VERIFY_ATTESTATION: false,

	/** Allowed attestation formats */
	ALLOWED_FORMATS: ['packed', 'fido-u2f', 'android-safetynet', 'apple', 'none'] as const,
} as const

// ===== CREDENTIAL PARAMETERS =====

export const CREDENTIAL_PARAMS = {
	/** Supported algorithms (ES256, RS256) */
	PUB_KEY_CRED_PARAMS: [
		{ type: 'public-key' as const, alg: -7 }, // ES256 (recommended)
		{ type: 'public-key' as const, alg: -257 }, // RS256
	],

	/** Challenge length (bytes) */
	CHALLENGE_LENGTH: 32,

	/** Timeout for user interaction (milliseconds) */
	TIMEOUT: 60000, // 60 seconds
} as const

// ===== VALIDATION =====

export const VALIDATION_CONFIG = {
	/** Maximum allowed counter resets */
	MAX_COUNTER_RESETS: 0,

	/** Verify user presence (UP flag) */
	REQUIRE_USER_PRESENCE: true,

	/** Verify user verification (UV flag) */
	REQUIRE_USER_VERIFICATION: false,

	/** Check backup eligibility flag */
	CHECK_BACKUP_ELIGIBILITY: true,
} as const

// ===== STORAGE =====

export const WEBAUTHN_STORAGE = {
	/** Challenge TTL in Redis (seconds) */
	CHALLENGE_TTL: 300, // 5 minutes

	/** Credential TTL (null = forever) */
	CREDENTIAL_TTL: null as number | null,

	/** Maximum credentials per user */
	MAX_CREDENTIALS_PER_USER: 10,
} as const

// ===== COMBINED CONFIG EXPORT =====

export const WEBAUTHN_CONFIG = {
	AUTHENTICATOR_SELECTION,
	ATTESTATION_CONFIG,
	CREDENTIAL_PARAMS,
	VALIDATION_CONFIG,
} as const
```

**dtos**
`src/modules/auth/2fa/dtos/admin-2fa.dto.ts`

```typescript
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

import { Field, InputType, Int } from '@nestjs/graphql'
import { ESecurityEvent, ESecuritySeverity } from '@prisma/__generated__'

/**
 * Input for disabling a user's 2FA
 */
@InputType('DisableUser2FAInput')
export class DisableUser2FAInput {
	@Field(() => String, { description: 'User ID whose 2FA should be disabled' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for disabling 2FA' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string

	@Field(() => Boolean, {
		nullable: true,
		defaultValue: true,
		description: 'Whether to notify the user via email',
	})
	@IsOptional()
	@IsBoolean()
	notifyUser?: boolean
}

/**
 * Input for revoking a user's device
 */
@InputType('RevokeUserDeviceInput')
export class RevokeUserDeviceInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Device ID to revoke' })
	@IsString()
	@IsNotEmpty()
	deviceId: string

	@Field(() => String, { description: 'Reason for revoking device' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for revoking all user devices
 */
@InputType('RevokeAllUserDevicesInput')
export class RevokeAllUserDevicesInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for revoking all devices' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for getting user security events
 */
@InputType('GetUserSecurityEventsInput')
export class GetUserSecurityEventsInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => Int, { nullable: true, defaultValue: 50, description: 'Number of events to return' })
	@IsOptional()
	limit?: number

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by event types',
	})
	@IsOptional()
	@IsEnum(ESecurityEvent, { each: true })
	events?: ESecurityEvent[]

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by severity levels',
	})
	@IsOptional()
	@IsEnum(ESecuritySeverity, { each: true })
	severities?: ESecuritySeverity[]
}
```

`src/modules/auth/2fa/dtos/index.ts`

```typescript
export * from './admin-2fa.dto'
export * from './setup-totp.dto'
export * from './setup-otp.dto'
export * from './verify-2fa.dto'
export * from './manage-methods.dto'
export * from './webauthn.dto'
```

`src/modules/auth/2fa/dtos/manage-methods.dto.ts`

```typescript
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

/**
 * Input for updating 2FA method
 */
@InputType('Update2FAMethodInput')
export class Update2FAMethodInput {
	@Field(() => String, { description: 'Method ID to update' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { nullable: true, description: 'New name for the method' })
	@IsOptional()
	@IsString()
	name?: string

	@Field(() => Boolean, { nullable: true, description: 'Set as primary method' })
	@IsOptional()
	@IsBoolean()
	isPrimary?: boolean

	@Field(() => Boolean, { nullable: true, description: 'Activate/deactivate method' })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}

/**
 * Input for removing 2FA method
 */
@InputType('Remove2FAMethodInput')
export class Remove2FAMethodInput {
	@Field(() => String, { description: 'Method ID to remove' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { description: 'Password for confirmation' })
	@IsString()
	@IsNotEmpty()
	password: string

	@Field(() => String, { nullable: true, description: '2FA code for additional security' })
	@IsOptional()
	@IsString()
	code?: string
}

/**
 * Input for regenerating backup codes
 */
@InputType('RegenerateBackupCodesInput')
export class RegenerateBackupCodesInput {
	@Field(() => String, { nullable: true, description: 'Specific method ID (regenerates for all if not specified)' })
	@IsOptional()
	@IsString()
	methodId?: string

	@Field(() => String, { description: 'Password for confirmation' })
	@IsString()
	@IsNotEmpty()
	password: string
}
```

`src/modules/auth/2fa/dtos/setup-otp.dto.ts`

```typescript
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf } from 'class-validator'

import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { E2FAMethod } from '@prisma/__generated__'

import { VALIDATION_PATTERNS } from '../constants'

registerEnumType(E2FAMethod, {
	name: 'E2FAMethod', // имя enum в схеме GraphQL
	description: 'Allowed OTP methods for setup (email or SMS).',
	valuesMap: {
		TOTP: { deprecationReason: 'Not allowed in SetupOtpInput' },
		WEBAUTHN: { deprecationReason: 'Not allowed in SetupOtpInput' },
		PASSKEY: { deprecationReason: 'Not allowed in SetupOtpInput' },
		BACKUP_CODE: { deprecationReason: 'Not allowed in SetupOtpInput' },
	},
})

/**
 * Input for setting up OTP (Email or SMS)
 */
@InputType('SetupOtpInput')
export class SetupOtpInput {
	@Field(() => E2FAMethod, {
		description: 'OTP method: OTP_EMAIL or OTP_SMS',
		defaultValue: E2FAMethod.OTP_EMAIL,
	})
	@IsOptional()
	@IsEnum(E2FAMethod)
	@IsIn([E2FAMethod.OTP_EMAIL, E2FAMethod.OTP_SMS], {
		message: 'method must be OTP_EMAIL or OTP_SMS',
	})
	method!: E2FAMethod

	@Field({ nullable: true, description: 'Email destination (required for OTP_EMAIL)' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_EMAIL)
	@IsEmail()
	email?: string

	@Field({ nullable: true, description: 'Phone in E.164, required for OTP_SMS' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_SMS)
	@Matches(VALIDATION_PATTERNS.PHONE_E164, {
		message: 'phone must be a valid E.164 number (e.g. +1234567890)',
	})
	phone?: string

	@Field({ nullable: true, description: 'Optional display name for the method' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string
}

/**
 * Input for sending OTP code
 */
@InputType('SendOtpCodeInput')
export class SendOtpCodeInput {
	@Field(() => String, { nullable: true, description: 'Method ID to send code to (uses primary if not specified)' })
	@IsOptional()
	@IsString()
	methodId?: string
}

/**
 * Input for verifying OTP code during setup
 */
@InputType('VerifyOtpSetupInput')
export class VerifyOtpSetupInput {
	@Field(() => String, { description: 'Method ID from setup' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { description: '6-digit OTP code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}
```

`src/modules/auth/2fa/dtos/setup-totp.dto.ts`

```typescript
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { TOTP_CONFIG, VALIDATION_PATTERNS } from '../constants'

/**
 * Input for generating TOTP setup (QR code)
 */
@InputType('GenerateTotpSetupInput')
export class GenerateTotpSetupInput {
	@Field(() => String, { nullable: true, description: 'Optional custom name for this method' })
	@IsOptional()
	@IsString()
	name?: string
}

/**
 * Input for completing TOTP setup
 */
@InputType('CompleteTotpSetupInput')
export class CompleteTotpSetupInput {
	@Field(() => String, { description: 'TOTP secret from generation step' })
	@IsString()
	@IsNotEmpty()
	@Length(TOTP_CONFIG.SECRET_LENGTH, TOTP_CONFIG.SECRET_LENGTH, {
		message: `Secret must be exactly ${TOTP_CONFIG.SECRET_LENGTH} characters`,
	})
	secret: string

	@Field(() => String, { description: '6-digit TOTP code for verification' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.TOTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string

	@Field(() => String, { nullable: true, description: 'Optional custom name' })
	@IsOptional()
	@IsString()
	name?: string
}
```

`src/modules/auth/2fa/dtos/verify-2fa.dto.ts`

```typescript
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { VALIDATION_PATTERNS } from '../constants'

/**
 * Generic 2FA verification input
 * Supports TOTP codes, OTP codes, and backup codes
 */
@InputType('Verify2FAInput')
export class Verify2FAInput {
	@Field(() => String, { description: '6-digit code or 8-character backup code' })
	@IsString()
	@IsNotEmpty()
	code: string

	@Field(() => String, {
		nullable: true,
		description: 'Specific method ID to verify (uses primary if not specified)',
	})
	@IsOptional()
	@IsString()
	methodId?: string

	@Field(() => Boolean, { nullable: true, description: 'Remember this device for future logins' })
	@IsOptional()
	@IsBoolean()
	trustDevice?: boolean
}

/**
 * Backup code verification input
 */
@InputType('VerifyBackupCodeInput')
export class VerifyBackupCodeInput {
	@Field(() => String, { description: '8-character backup code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.BACKUP_CODE, { message: 'Invalid backup code format' })
	backupCode: string

	@Field(() => String, { nullable: true, description: 'Method ID this code is for' })
	@IsOptional()
	@IsString()
	methodId?: string
}
```

`src/modules/auth/2fa/dtos/webauthn.dto.ts`

```typescript
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

import { Field, InputType } from '@nestjs/graphql'
import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/typescript-types'

/**
 * Input for starting WebAuthn registration
 */
@InputType('StartWebAuthnRegistrationInput', {
	description: 'Input for initiating WebAuthn credential registration (passkey or security key)',
})
export class StartWebAuthnRegistrationInput {
	@Field(() => String, {
		nullable: true,
		description: 'Custom name for the authenticator (e.g., "YubiKey 5C", "iPhone 15 Pro")',
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	authenticatorName?: string

	@Field(() => String, {
		nullable: true,
		description:
			'Authenticator attachment: "platform" (TouchID, FaceID, Windows Hello) or "cross-platform" (YubiKey, external USB key)',
		defaultValue: undefined,
	})
	@IsOptional()
	@IsString()
	authenticatorAttachment?: 'platform' | 'cross-platform'

	@Field(() => Boolean, {
		nullable: true,
		description: 'Prefer platform authenticators (built-in biometrics) over external keys',
		defaultValue: true,
	})
	@IsOptional()
	@IsBoolean()
	preferPlatform?: boolean
}

/**
 * Input for completing WebAuthn registration
 */
@InputType('CompleteWebAuthnRegistrationInput', {
	description: 'Input for completing WebAuthn registration with authenticator response',
})
export class CompleteWebAuthnRegistrationInput {
	@Field(() => String, {
		description: 'Challenge ID from registration options (used to verify this response)',
	})
	@IsString()
	@IsNotEmpty()
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'RegistrationResponseJSON from @simplewebauthn/browser startRegistration(). Contains id, rawId, response.attestationObject, response.clientDataJSON, type, and optional fields.',
	})
	@IsNotEmpty()
	response: RegistrationResponseJSON

	@Field(() => String, {
		nullable: true,
		description: 'Custom name for this authenticator (overrides name from StartWebAuthnRegistrationInput)',
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	authenticatorName?: string
}

/**
 * Input for starting WebAuthn authentication
 */
@InputType('StartWebAuthnAuthenticationInput', {
	description: 'Input for initiating WebAuthn authentication challenge',
})
export class StartWebAuthnAuthenticationInput {
	@Field(() => String, {
		nullable: true,
		description:
			'Specific credential ID to use for authentication (if null, user picks from available credentials)',
	})
	@IsOptional()
	@IsString()
	credentialId?: string

	@Field(() => String, {
		nullable: true,
		description: 'User email for authentication (required if user is not already logged in)',
	})
	@IsOptional()
	@IsString()
	email?: string
}

/**
 * Input for completing WebAuthn authentication
 */
@InputType('CompleteWebAuthnAuthenticationInput', {
	description: 'Input for completing WebAuthn authentication with authenticator response',
})
export class CompleteWebAuthnAuthenticationInput {
	@Field(() => String, {
		description: 'Challenge ID from authentication options (used to verify this response)',
	})
	@IsString()
	@IsNotEmpty()
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'AuthenticationResponseJSON from @simplewebauthn/browser startAuthentication(). Contains id, rawId, response.authenticatorData, response.clientDataJSON, response.signature, response.userHandle, and type.',
	})
	@IsNotEmpty()
	response: AuthenticationResponseJSON
}

/**
 * Input for removing WebAuthn credential
 */
@InputType('RemoveWebAuthnCredentialInput', {
	description: 'Input for removing a registered WebAuthn credential (requires password confirmation)',
})
export class RemoveWebAuthnCredentialInput {
	@Field(() => String, {
		description: 'Credential ID (base64url) or authentication method ID to remove',
	})
	@IsString()
	@IsNotEmpty()
	credentialId: string

	@Field(() => String, {
		description: 'User password for confirmation (security measure to prevent unauthorized removal)',
	})
	@IsString()
	@IsNotEmpty()
	password: string
}
```

**guards**
`src/modules/auth/2fa/guards/2fa-verified.guard.ts`

```typescript
import { I18nService } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

/**
 * Metadata key for 2FA verification requirement
 */
export const REQUIRE_2FA_VERIFICATION = 'require_2fa_verification'

/**
 * Guard to ensure user has verified 2FA for current session
 * Use this for sensitive operations that require fresh 2FA verification
 */
@Injectable()
export class TwoFactorVerifiedGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Check if route requires 2FA verification
		const require2FA = this.reflector.getAllAndOverride<boolean>(REQUIRE_2FA_VERIFICATION, [
			context.getHandler(),
			context.getClass(),
		])

		if (!require2FA) {
			return true // Route doesn't require 2FA
		}

		const ctx = GqlExecutionContext.create(context)
		const gqlContext = ctx.getContext()
		const user = gqlContext.req?.user

		if (!user) {
			throw new UnauthorizedException(
				this.i18n.t('common.errors.auth.user_not_authorized', { defaultValue: 'User not authorized' }),
			)
		}

		// Check if user has 2FA enabled
		const userData = await this.prisma.user.findUnique({
			where: { id: user.id },
			select: { is2FAEnabled: true },
		})

		if (!userData?.is2FAEnabled) {
			return true // User doesn't have 2FA, so no verification needed
		}

		// Check session 2FA verification status
		const sessionToken =
			gqlContext.req?.cookies?.sessionToken || gqlContext.req?.headers?.authorization?.replace('Bearer ', '')

		if (!sessionToken) {
			throw new UnauthorizedException(
				this.i18n.t('common.errors.auth.user_not_authorized', { defaultValue: 'Session not found' }),
			)
		}

		const session = await this.prisma.session.findUnique({
			where: { token: sessionToken },
			select: { is2FAVerified: true, verified2FAAt: true },
		})

		if (!session?.is2FAVerified) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.verification_required', { defaultValue: '2FA verification required' }),
			)
		}

		// Optional: Check if verification is recent (e.g., within last 5 minutes)
		const VERIFICATION_VALIDITY = 5 * 60 * 1000 // 5 minutes
		if (session.verified2FAAt) {
			const timeSinceVerification = Date.now() - session.verified2FAAt.getTime()
			if (timeSinceVerification > VERIFICATION_VALIDITY) {
				throw new UnauthorizedException(
					this.i18n.t('auth.errors.2fa.verification_expired', {
						defaultValue: '2FA verification has expired. Please verify again.',
					}),
				)
			}
		}

		return true
	}
}

/**
 * Decorator to require 2FA verification for a route.
 * Can be applied to a class or a method.
 */
export const Require2FAVerification = (): ((
	target: any,
	propertyKey?: string | symbol,
	descriptor?: PropertyDescriptor,
) => void) => {
	return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
		if (descriptor) {
			Reflect.defineMetadata(REQUIRE_2FA_VERIFICATION, true, descriptor.value)
		} else {
			Reflect.defineMetadata(REQUIRE_2FA_VERIFICATION, true, target)
		}
	}
}
```

`src/modules/auth/2fa/guards/index.ts`

```typescript
export * from './2fa-verified.guard'
```

**models**
`src/modules/auth/2fa/models/2fa-method.model.ts`

```typescript
import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { E2FAMethod } from '@prisma/__generated__'

/**
 * 2FA Method response model
 */
@ObjectType('TwoFactorMethod')
export class TwoFactorMethodModel {
	@Field(() => String, { description: 'Method ID' })
	id: string

	@Field(() => E2FAMethod, { description: 'Method type' })
	method: E2FAMethod

	@Field(() => String, { nullable: true, description: 'User-provided name' })
	name?: string

	@Field(() => Boolean, { description: 'Whether method is active' })
	isActive: boolean

	@Field(() => Boolean, { description: 'Whether this is the primary method' })
	isPrimary: boolean

	@Field(() => Date, { nullable: true, description: 'Last time this method was used' })
	lastUsedAt?: Date

	@Field(() => Int, { description: 'Number of times used' })
	useCount: number

	@Field(() => Date, { description: 'When method was created' })
	createdAt: Date
}

/**
 * 2FA Methods list with status
 */
@ObjectType('TwoFactorMethodsList')
export class TwoFactorMethodsListModel {
	@Field(() => [TwoFactorMethodModel], { description: 'Available 2FA methods' })
	methods: TwoFactorMethodModel[]

	@Field(() => TwoFactorMethodModel, { nullable: true, description: 'Primary method' })
	primary?: TwoFactorMethodModel

	@Field(() => Int, { description: 'Total number of active methods' })
	totalActive: number

	@Field(() => Boolean, { description: 'Whether user has 2FA enabled' })
	is2FAEnabled: boolean
}

/**
 * Backup codes status
 */
@ObjectType('BackupCodesStatus')
export class BackupCodesStatusModel {
	@Field(() => Int, { description: 'Total backup codes generated' })
	total: number

	@Field(() => Int, { description: 'Codes already used' })
	used: number

	@Field(() => Int, { description: 'Remaining unused codes' })
	remaining: number

	@Field(() => Int, { description: 'Expired codes' })
	expired: number

	@Field(() => Boolean, { description: 'Whether running low on codes' })
	isLow: boolean
}
```

`src/modules/auth/2fa/models/2fa-setup.model.ts`

```typescript
import { Field, ObjectType } from '@nestjs/graphql'

/**
 * TOTP setup response (QR code + secret)
 */
@ObjectType('TotpSetup')
export class TotpSetupModel {
	@Field(() => String, { description: 'Method ID (temporary until verified)' })
	methodId: string

	@Field(() => String, { description: 'QR code as data URL' })
	qrCodeUrl: string

	@Field(() => String, { description: 'Manual entry key (same as in QR code)' })
	manualEntryKey: string

	@Field(() => String, { description: 'Issuer name (app name)' })
	issuer: string

	@Field(() => String, { description: 'Account name (user email)' })
	accountName: string
}

/**
 * OTP setup response
 */
@ObjectType('OtpSetup')
export class OtpSetupModel {
	@Field(() => String, { description: 'Method ID' })
	methodId: string

	@Field(() => String, { description: 'Where codes will be sent' })
	destination: string

	@Field(() => String, { description: 'Success message' })
	message: string
}

/**
 * 2FA setup completion response
 */
@ObjectType('TwoFactorSetupComplete')
export class TwoFactorSetupCompleteModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { description: 'Method ID' })
	methodId: string

	@Field(() => [String], { description: 'Backup recovery codes (show only once!)' })
	backupCodes: string[]

	@Field(() => String, { description: 'Warning message about backup codes' })
	message: string
}

/**
 * Backup codes regeneration response
 */
@ObjectType('BackupCodesRegenerated')
export class BackupCodesRegeneratedModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => [String], { description: 'New backup codes' })
	backupCodes: string[]

	@Field(() => String, { description: 'Warning message' })
	message: string
}

/**
 * Generic success response
 */
@ObjectType('TwoFactorSuccess')
export class TwoFactorSuccessModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { nullable: true, description: 'Success message' })
	message?: string
}
```

`src/modules/auth/2fa/models/admin-2fa.model.ts`

```typescript
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
```

`src/modules/auth/2fa/models/index.ts`

```typescript
export * from './2fa-method.model'
export * from './2fa-setup.model'
export * from './admin-2fa.model'
export * from './webauthn.model'
```

`src/modules/auth/2fa/models/webauthn.model.ts`

```typescript
import GraphQLJSON from 'graphql-type-json'

import { Field, Int, ObjectType } from '@nestjs/graphql'

/**
 * WebAuthn registration options response
 * Contains all data needed to create a new WebAuthn credential
 */
@ObjectType('WebAuthnRegistrationOptions', {
	description: 'WebAuthn registration options for creating a new passkey or security key',
})
export class WebAuthnRegistrationOptionsModel {
	@Field(() => String, {
		description: 'Unique challenge identifier for this registration session (used to verify response)',
	})
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'PublicKeyCredentialCreationOptions as JSON. Pass this to @simplewebauthn/browser startRegistration() or navigator.credentials.create({ publicKey: options })',
	})
	options: Record<string, any>

	@Field(() => String, {
		description: 'Relying Party name displayed to user (e.g., "MedicHub")',
	})
	rpName: string

	@Field(() => String, {
		description: 'Relying Party ID - domain name (e.g., "medichub.com")',
	})
	rpId: string

	@Field(() => String, {
		description: 'User display name shown in authenticator UI (e.g., "John Doe <john@example.com>")',
	})
	userDisplayName: string
}

/**
 * WebAuthn registration complete response
 * Returned after successful credential creation
 */
@ObjectType('WebAuthnRegistrationComplete', {
	description: 'Response after successful WebAuthn credential registration',
})
export class WebAuthnRegistrationCompleteModel {
	@Field(() => Boolean, {
		description: 'Whether registration was successful',
	})
	success: boolean

	@Field(() => String, {
		description: 'Unique authentication method ID (stored in database)',
	})
	methodId: string

	@Field(() => String, {
		description: 'WebAuthn credential ID (base64url encoded, used for authentication)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'User-provided authenticator name (e.g., "YubiKey 5C", "iPhone 15 Pro")',
	})
	authenticatorName?: string

	@Field(() => Boolean, {
		description: 'Whether this is a platform authenticator (TouchID, FaceID, Windows Hello)',
	})
	isPlatform: boolean

	@Field(() => Boolean, {
		description: 'Whether credential is backed up to cloud (iCloud Keychain, Google Password Manager)',
	})
	isBackedUp: boolean

	@Field(() => [String], {
		description: 'Backup recovery codes for emergency access (store securely, shown only once)',
	})
	backupCodes: string[]

	@Field(() => String, {
		description: 'Human-readable success message for UI display',
	})
	message: string
}

/**
 * WebAuthn authentication options response
 * Contains data needed to verify an existing credential
 */
@ObjectType('WebAuthnAuthenticationOptions', {
	description: 'WebAuthn authentication options for verifying a passkey or security key',
})
export class WebAuthnAuthenticationOptionsModel {
	@Field(() => String, {
		description: 'Unique challenge identifier for this authentication session (used to verify response)',
	})
	challengeId: string

	@Field(() => GraphQLJSON, {
		description:
			'PublicKeyCredentialRequestOptions as JSON. Pass this to @simplewebauthn/browser startAuthentication() or navigator.credentials.get({ publicKey: options })',
	})
	options: Record<string, any>

	@Field(() => String, {
		description: 'Relying Party ID - must match registration domain',
	})
	rpId: string

	@Field(() => Int, {
		description: 'Number of registered WebAuthn credentials for this user',
	})
	credentialCount: number
}

/**
 * WebAuthn authentication complete response
 * Returned after successful authentication
 */
@ObjectType('WebAuthnAuthenticationComplete', {
	description: 'Response after successful WebAuthn credential verification',
})
export class WebAuthnAuthenticationCompleteModel {
	@Field(() => Boolean, {
		description: 'Whether authentication was successful',
	})
	success: boolean

	@Field(() => String, {
		description: 'Credential ID that was used for authentication (base64url encoded)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'Name of the authenticator that was used (e.g., "YubiKey 5C")',
	})
	authenticatorName?: string

	@Field(() => Int, {
		description: 'Updated signature counter (detects cloned authenticators if counter decreases)',
	})
	counter: number

	@Field(() => String, {
		description: 'Human-readable success message for UI display',
	})
	message: string
}

/**
 * WebAuthn credential info
 * Represents a registered security key or passkey
 */
@ObjectType('WebAuthnCredential', {
	description: 'Registered WebAuthn credential (security key or passkey)',
})
export class WebAuthnCredentialModel {
	@Field(() => String, {
		description: 'Unique authentication method ID (database primary key)',
	})
	id: string

	@Field(() => String, {
		description: 'WebAuthn credential ID (base64url encoded, unique per credential)',
	})
	credentialId: string

	@Field(() => String, {
		nullable: true,
		description: 'User-provided name for this credential (e.g., "Work YubiKey", "Personal iPhone")',
	})
	name?: string

	@Field(() => Boolean, {
		description: 'Platform authenticator (TouchID, FaceID, Windows Hello) vs cross-platform (YubiKey, USB key)',
	})
	isPlatform: boolean

	@Field(() => Boolean, {
		description: 'Whether credential is synced to cloud (iCloud Keychain, Google Password Manager)',
	})
	isBackedUp: boolean

	@Field(() => [String], {
		description: 'Supported transports (usb, nfc, ble, internal, hybrid)',
	})
	transports: string[]

	@Field(() => Date, {
		nullable: true,
		description: 'Timestamp of last successful authentication with this credential',
	})
	lastUsedAt?: Date

	@Field(() => Int, {
		description: 'Total number of successful authentications with this credential',
	})
	useCount: number

	@Field(() => Date, {
		description: 'Credential registration timestamp',
	})
	createdAt: Date
}
```

**resolvers**
`src/modules/auth/2fa/resolvers/2fa.resolver.ts`

```typescript
import { I18nService, Lang, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { Authorization, Authorized } from '@/shared/decorators'
import type { GqlContext } from '@/shared/types'
import { getSessionMetadata } from '@/shared/utils'
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { E2FAMethod, type User } from '@prisma/__generated__'

import {
	CompleteTotpSetupInput,
	CompleteWebAuthnAuthenticationInput,
	CompleteWebAuthnRegistrationInput,
	GenerateTotpSetupInput,
	RegenerateBackupCodesInput,
	Remove2FAMethodInput,
	RemoveWebAuthnCredentialInput,
	SendOtpCodeInput,
	SetupOtpInput,
	StartWebAuthnAuthenticationInput,
	StartWebAuthnRegistrationInput,
	Update2FAMethodInput,
	Verify2FAInput,
	VerifyBackupCodeInput,
	VerifyOtpSetupInput,
} from '../dtos'
import { Require2FAVerification, TwoFactorVerifiedGuard } from '../guards'
import {
	BackupCodesRegeneratedModel,
	BackupCodesStatusModel,
	OtpSetupModel,
	TotpSetupModel,
	TwoFactorMethodModel,
	TwoFactorMethodsListModel,
	TwoFactorSetupCompleteModel,
	TwoFactorSuccessModel,
	WebAuthnAuthenticationCompleteModel,
	WebAuthnAuthenticationOptionsModel,
	WebAuthnCredentialModel,
	WebAuthnRegistrationCompleteModel,
	WebAuthnRegistrationOptionsModel,
} from '../models'
import {
	BackupCodeService,
	DeviceTrustService,
	SecurityEventService,
	TwoFactorMethodService,
	WebAuthnService,
} from '../services'
import { ITotpMethodData } from '../types'

/**
 * GraphQL Resolver for 2FA operations
 * Provides complete API for Two-Factor Authentication management
 */
@Resolver('TwoFactor')
export class TwoFactorResolver {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly twoFactorService: TwoFactorMethodService,
		private readonly backupCodeService: BackupCodeService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly securityEventService: SecurityEventService,
		private readonly webauthnService: WebAuthnService,
	) {}

	// ==================== TOTP Operations ====================

	/**
	 * Generate TOTP setup (QR code + manual entry key)
	 * Step 1 of TOTP setup flow
	 */
	@Authorization()
	@Query(() => TotpSetupModel, {
		name: 'generateTotpSetup',
		description: 'Generate TOTP QR code and secret for setup',
	})
	async generateTotpSetup(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: GenerateTotpSetupInput = {},
		@Lang() lng: Language,
	): Promise<TotpSetupModel> {
		return this.twoFactorService.generateTotpSetup(user, input.name, lng)
	}

	/**
	 * Complete TOTP setup after scanning QR code
	 * Step 2 of TOTP setup flow (final step)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSetupCompleteModel, {
		name: 'completeTotpSetup',
		description: 'Complete TOTP setup by verifying code and receive backup codes',
	})
	async completeTotpSetup(
		@Authorized() user: User,
		@Args('data') input: CompleteTotpSetupInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSetupCompleteModel> {
		return this.twoFactorService.completeTotpSetup(user, input, lng)
	}

	// ==================== OTP Operations ====================

	/**
	 * Setup OTP method (Email or SMS)
	 * Step 1 of OTP setup flow
	 */
	@Authorization()
	@Mutation(() => OtpSetupModel, {
		name: 'setupOtp',
		description: 'Setup OTP method (Email or SMS)',
	})
	async setupOtp(
		@Authorized() user: User,
		@Args('data') input: SetupOtpInput,
		@Lang() lng: Language,
	): Promise<OtpSetupModel> {
		return this.twoFactorService.setupOtp(user, input, lng)
	}

	/**
	 * Send OTP code to user
	 * Step 2a of OTP setup flow (can be repeated)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'sendOtpCode',
		description: 'Send OTP verification code',
	})
	async sendOtpCode(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: SendOtpCodeInput = {},
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.sendOtpCode(user, input, lng)
	}

	/**
	 * Verify OTP code during setup
	 * Step 2b of OTP setup flow (final step)
	 */
	@Authorization()
	@Mutation(() => TwoFactorSetupCompleteModel, {
		name: 'verifyOtpSetup',
		description: 'Verify OTP code during setup and receive backup codes',
	})
	async verifyOtpSetup(
		@Authorized() user: User,
		@Args('data') input: VerifyOtpSetupInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSetupCompleteModel> {
		return this.twoFactorService.verifyOtpSetup(user, input, lng)
	}

	// ==================== Universal Verification ====================

	/**
	 * Verify 2FA code (works for TOTP, OTP, or backup codes)
	 * Used during login or for sensitive operations
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'verify2FA',
		description: 'Verify 2FA code (TOTP/OTP/backup code)',
	})
	async verify2FA(
		@Authorized() user: User,
		@Args('data') input: Verify2FAInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		const session = getSessionMetadata(context.req, context.req.headers['user-agent'] || 'Unknown')

		// Determine if code is backup code (8 chars) or regular (6 digits)
		const isBackupCode = /^[A-F0-9]{8}$/i.test(input.code)

		if (isBackupCode) {
			// --- Handle Backup Code Verification ---
			const method = input.methodId
				? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
						where: { id: input.methodId },
					})
				: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
						where: { userId: user.id, isPrimary: true },
					})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: '2FA method not found' }),
				)
			}

			try {
				await this.backupCodeService.verifyBackupCode(user, input.code, method.method, lng, session.ip)
				await this.securityEventService.log2FASuccess(user.id, 'BACKUP_CODE', session)
			} catch (error) {
				await this.securityEventService.log2FAFailed(user.id, 'BACKUP_CODE', session, 1)
				throw error
			}
		} else {
			// --- Handle TOTP/OTP Code Verification ---
			const method = input.methodId
				? await this.prisma.authenticationMethod.findFirst({
						where: { id: input.methodId, userId: user.id },
					})
				: await this.prisma.authenticationMethod.findFirst({
						where: { userId: user.id, isPrimary: true },
					})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: '2FA method not found' }),
				)
			}

			let isCodeValid = false

			switch (method.method) {
				case E2FAMethod.TOTP: {
					const totpData = method.data as unknown as ITotpMethodData
					isCodeValid = this.twoFactorService.verifyTotpCode(user.email, totpData.secret, input.code)
					break
				}

				case E2FAMethod.OTP_EMAIL:
				case E2FAMethod.OTP_SMS: {
					isCodeValid = await this.twoFactorService.verifyOneTimeCode(user.id, method.id, input.code, lng)
					break
				}

				default: {
					throw new BadRequestException(
						`Verification for method type ${method.method} is not supported here.`,
					)
				}
			}

			if (!isCodeValid) {
				await this.securityEventService.log2FAFailed(user.id, method.method, session, 1)
				throw new UnauthorizedException(
					this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid 2FA code' }),
				)
			}

			await this.securityEventService.log2FASuccess(user.id, method.method, session)

			// For now, return success
			await this.securityEventService.log2FASuccess(user.id, method.method, session)
		}

		// If trustDevice is true, register device as trusted
		if (input.trustDevice) {
			const deviceId = await this.deviceTrustService.registerDevice(user.id, session, lng)
			await this.deviceTrustService.trustDevice(user.id, deviceId)
		}

		// Update session as 2FA verified
		const sessionToken = context.req.cookies?.sessionToken
		if (sessionToken) {
			await this.twoFactorService['prisma'].session.updateMany({
				where: { token: sessionToken, userId: user.id },
				data: {
					is2FAVerified: true,
					verified2FAAt: new Date(),
				},
			})
		}

		return {
			success: true,
			message: '2FA verified successfully',
		}
	}

	/**
	 * Verify backup code explicitly
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'verifyBackupCode',
		description: 'Verify backup recovery code',
	})
	async verifyBackupCode(
		@Authorized() user: User,
		@Args('data') input: VerifyBackupCodeInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		const session = getSessionMetadata(context.req, context.req.headers['user-agent'] || 'Unknown')

		const method = input.methodId
			? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
					where: { id: input.methodId },
				})
			: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
					where: { userId: user.id, isPrimary: true },
				})

		if (!method) {
			throw new Error('2FA method not found')
		}

		await this.backupCodeService.verifyBackupCode(user, input.backupCode, method.method, lng)
		await this.securityEventService.log2FASuccess(user.id, 'BACKUP_CODE', session)

		return {
			success: true,
			message: 'Backup code verified successfully',
		}
	}

	// ==================== Method Management ====================

	/**
	 * Get all user's 2FA methods
	 */
	@Authorization()
	@Query(() => TwoFactorMethodsListModel, {
		name: 'my2FAMethods',
		description: "Get user's 2FA methods",
	})
	async getMy2FAMethods(@Authorized() user: User): Promise<TwoFactorMethodsListModel> {
		return this.twoFactorService.getUserMethods(user.id)
	}

	/**
	 * Update 2FA method
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'update2FAMethod',
		description: 'Update 2FA method (name, primary status, etc.)',
	})
	async update2FAMethod(
		@Authorized() user: User,
		@Args('data') input: Update2FAMethodInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.updateMethod(user.id, input, lng)
	}

	/**
	 * Remove 2FA method
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'remove2FAMethod',
		description: 'Remove 2FA method (requires password confirmation)',
	})
	async remove2FAMethod(
		@Authorized() user: User,
		@Args('data') input: Remove2FAMethodInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		return this.twoFactorService.removeMethod(user, input, lng)
	}

	// ==================== Backup Codes ====================

	/**
	 * Get backup codes status
	 */
	@Authorization()
	@Query(() => BackupCodesStatusModel, {
		name: 'backupCodesStatus',
		description: 'Get status of backup codes',
	})
	async getBackupCodesStatus(
		@Authorized() user: User,
		@Args('methodId', { nullable: true }) methodId?: string,
	): Promise<BackupCodesStatusModel> {
		const method = methodId
			? await this.twoFactorService['prisma'].authenticationMethod.findUnique({
					where: { id: methodId },
				})
			: await this.twoFactorService['prisma'].authenticationMethod.findFirst({
					where: { userId: user.id, isPrimary: true },
				})

		if (!method) {
			throw new Error('2FA method not found')
		}

		const status = await this.backupCodeService.getBackupCodesStatus(user.id, method.method)

		return {
			total: status.total,
			used: status.used,
			remaining: status.remaining,
			expired: status.expired,
			isLow: status.remaining <= 3,
		}
	}

	/**
	 * Regenerate backup codes
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => BackupCodesRegeneratedModel, {
		name: 'regenerateBackupCodes',
		description: 'Regenerate backup codes (requires password)',
	})
	async regenerateBackupCodes(
		@Authorized() user: User,
		@Args('data') input: RegenerateBackupCodesInput,
		@Lang() lng: Language,
	): Promise<BackupCodesRegeneratedModel> {
		return this.twoFactorService.regenerateBackupCodes(user, input, lng)
	}

	// ==================== Device Trust ====================

	/**
	 * Get trusted devices
	 */
	@Authorization()
	@Query(() => [TwoFactorMethodModel], {
		name: 'myTrustedDevices',
		description: "Get user's trusted devices",
	})
	async getMyTrustedDevices(@Authorized() user: User) {
		const devices = await this.deviceTrustService.getUserDevices(user.id)
		return devices.map(d => ({
			id: d.id,
			deviceId: d.deviceId,
			name: d.name,
			browser: d.browser,
			os: d.os,
			device: d.device,
			trustScore: d.trustScore,
			lastCountry: d.lastCountry,
			lastCity: d.lastCity,
			isActive: d.isActive,
			lastSeenAt: d.lastSeenAt,
			expiresAt: d.expiresAt,
			createdAt: d.createdAt,
		}))
	}

	/**
	 * Revoke device trust
	 */
	@Authorization()
	@UseGuards(TwoFactorVerifiedGuard)
	@Require2FAVerification()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'revokeDeviceTrust',
		description: 'Revoke trust for a device',
	})
	async revokeDeviceTrust(
		@Authorized() user: User,
		@Args('deviceId') deviceId: string,
	): Promise<TwoFactorSuccessModel> {
		await this.deviceTrustService.revokeDevice(user.id, deviceId)
		return {
			success: true,
			message: 'Device trust revoked successfully',
		}
	}

	// ==================== Utility ====================

	/**
	 * Check if user has 2FA enabled
	 */
	@Authorization()
	@Query(() => Boolean, {
		name: 'is2FAEnabled',
		description: 'Check if user has 2FA enabled',
	})
	async is2FAEnabled(@Authorized() user: User): Promise<boolean> {
		const userData = await this.twoFactorService['prisma'].user.findUnique({
			where: { id: user.id },
			select: { is2FAEnabled: true },
		})
		return userData?.is2FAEnabled || false
	}

	/**
	 * Check if current session is 2FA verified
	 */
	@Authorization()
	@Query(() => Boolean, {
		name: 'isSession2FAVerified',
		description: 'Check if current session is 2FA verified',
	})
	async isSession2FAVerified(@Context() context: GqlContext): Promise<boolean> {
		const sessionToken = context.req.cookies?.sessionToken
		if (!sessionToken) return false

		const session = await this.twoFactorService['prisma'].session.findUnique({
			where: { token: sessionToken },
			select: { is2FAVerified: true },
		})

		return session?.is2FAVerified || false
	}

	// ==================== WebAuthn Operations ====================

	/**
	 * Start WebAuthn registration process
	 */
	@Authorization()
	@Mutation(() => WebAuthnRegistrationOptionsModel, {
		name: 'startWebAuthnRegistration',
		description: 'Generate WebAuthn registration options for adding a security key or passkey',
	})
	async startWebAuthnRegistration(
		@Authorized() user: User,
		@Args('data', { nullable: true }) input: StartWebAuthnRegistrationInput = {},
		@Lang() lng: Language,
	): Promise<WebAuthnRegistrationOptionsModel> {
		const { challengeId, options } = await this.webauthnService.generateRegistrationOptions(
			user,
			input.authenticatorAttachment,
			lng,
		)

		return {
			challengeId,
			options, // Type conversion for GraphQL
			rpName: options.rp.name,
			rpId: options.rp.id,
			userDisplayName: options.user.displayName,
		}
	}

	/**
	 * Complete WebAuthn registration
	 */
	@Authorization()
	@Mutation(() => WebAuthnRegistrationCompleteModel, {
		name: 'completeWebAuthnRegistration',
		description: 'Verify and save WebAuthn credential',
	})
	async completeWebAuthnRegistration(
		@Authorized() user: User,
		@Args('data') input: CompleteWebAuthnRegistrationInput,
		@Lang() lng: Language,
	): Promise<WebAuthnRegistrationCompleteModel> {
		const result = await this.webauthnService.verifyRegistrationResponse(
			user,
			input.challengeId,
			input.response,
			input.authenticatorName,
			lng,
		)

		// Get credential details
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId: result.credentialId },
		})

		const data = method?.data as any

		return {
			success: result.success,
			methodId: result.methodId,
			credentialId: result.credentialId,
			authenticatorName: input.authenticatorName,
			isPlatform: method?.method === 'PASSKEY',
			isBackedUp: data?.backedUp || false,
			backupCodes: result.backupCodes,
			message: this.i18n.t('auth.success.2fa.webauthn_registered', {
				lng,
				defaultValue: 'Security key registered successfully',
			}),
		}
	}

	/**
	 * Start WebAuthn authentication
	 */
	@Query(() => WebAuthnAuthenticationOptionsModel, {
		name: 'startWebAuthnAuthentication',
		description: 'Generate WebAuthn authentication options',
	})
	async startWebAuthnAuthentication(
		@Args('data', { nullable: true }) input: StartWebAuthnAuthenticationInput = {},
		@Context() context: GqlContext,
	): Promise<WebAuthnAuthenticationOptionsModel> {
		// Try to get user ID from session or input
		const userId =
			context.req.user?.id ||
			(input.email
				? (
						await this.prisma.user.findUnique({
							where: { email: input.email },
							select: { id: true },
						})
					)?.id
				: undefined)

		const { challengeId, options, credentialCount } = await this.webauthnService.generateAuthenticationOptions(
			userId,
			input.credentialId,
		)

		return {
			challengeId,
			options,
			rpId: options.rpId,
			credentialCount,
		}
	}

	/**
	 * Complete WebAuthn authentication
	 */
	@Mutation(() => WebAuthnAuthenticationCompleteModel, {
		name: 'completeWebAuthnAuthentication',
		description: 'Verify WebAuthn authentication response',
	})
	async completeWebAuthnAuthentication(
		@Args('data') input: CompleteWebAuthnAuthenticationInput,
		@Context() context: GqlContext,
		@Lang() lng: Language,
	): Promise<WebAuthnAuthenticationCompleteModel> {
		const result = await this.webauthnService.verifyAuthenticationResponse(input.challengeId, input.response, lng)

		// Get credential details
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId: result.credentialId },
			select: { name: true, data: true },
		})

		// Mark session as 2FA verified
		const sessionToken = context.req.cookies?.sessionToken
		if (sessionToken) {
			await this.prisma.session.updateMany({
				where: { token: sessionToken, userId: result.userId },
				data: {
					is2FAVerified: true,
					verified2FAAt: new Date(),
				},
			})
		}

		const data = method?.data as any

		return {
			success: result.success,
			credentialId: result.credentialId,
			authenticatorName: method?.name,
			counter: data?.counter || 0,
			message: this.i18n.t('auth.success.2fa.webauthn_verified', {
				lng,
				defaultValue: 'Authentication successful',
			}),
		}
	}

	/**
	 * Get user's WebAuthn credentials
	 */
	@Authorization()
	@Query(() => [WebAuthnCredentialModel], {
		name: 'myWebAuthnCredentials',
		description: "Get user's registered WebAuthn credentials",
	})
	async getMyWebAuthnCredentials(@Authorized() user: User): Promise<WebAuthnCredentialModel[]> {
		return this.webauthnService.getUserCredentials(user.id)
	}

	/**
	 * Remove WebAuthn credential
	 */
	@Authorization()
	@Mutation(() => TwoFactorSuccessModel, {
		name: 'removeWebAuthnCredential',
		description: 'Remove a WebAuthn credential',
	})
	async removeWebAuthnCredential(
		@Authorized() user: User,
		@Args('data') input: RemoveWebAuthnCredentialInput,
		@Lang() lng: Language,
	): Promise<TwoFactorSuccessModel> {
		await this.webauthnService.removeCredential(user, input.credentialId, input.password, lng)

		return {
			success: true,
			message: this.i18n.t('auth.success.2fa.credential_removed', {
				lng,
				defaultValue: 'Security key removed successfully',
			}),
		}
	}
}
```

`src/modules/auth/2fa/resolvers/admin-2fa.resolver.ts`

```typescript
import { EUserRole, Roles, RolesGuard } from '@/modules/rbac'
import { Authorization, Authorized } from '@/shared/decorators'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { type User } from '@prisma/__generated__'

import {
	DisableUser2FAInput,
	GetUserSecurityEventsInput,
	RevokeAllUserDevicesInput,
	RevokeUserDeviceInput,
} from '../dtos/admin-2fa.dto'
import {
	AdminActionSuccessModel,
	SecurityEventSummary,
	TrustedDeviceSummary,
	User2FAStatusModel,
} from '../models/admin-2fa.model'
import { AdminTwoFactorService, DeviceTrustService } from '../services'

/**
 * Administrative resolver for 2FA management.
 * All operations require SUPER_ADMIN role and are heavily audited.
 */
@Resolver('Admin2FA')
@Authorization() // Require authentication for all operations
@Roles(EUserRole.SUPER_ADMIN) // Require SUPER_ADMIN role
@UseGuards(RolesGuard) // Apply role checking
export class AdminTwoFactorResolver {
	constructor(
		private readonly adminService: AdminTwoFactorService,
		private readonly deviceTrustService: DeviceTrustService,
	) {}

	// ==================== Queries ====================

	/**
	 * Get comprehensive 2FA status for any user
	 */
	@Query(() => User2FAStatusModel, {
		name: 'adminGetUser2FAStatus',
		description: '[Admin] Get comprehensive 2FA status for a user',
	})
	async getUser2FAStatus(@Args('userId') userId: string): Promise<User2FAStatusModel> {
		return this.adminService.getUser2FAStatus(userId)
	}

	/**
	 * Get security events for a user
	 */
	@Query(() => [SecurityEventSummary], {
		name: 'adminGetUserSecurityEvents',
		description: '[Admin] Get security events for a user',
	})
	async getUserSecurityEvents(@Args('input') input: GetUserSecurityEventsInput): Promise<SecurityEventSummary[]> {
		const events = await this.adminService.getUserSecurityEvents(input)

		return events.map(e => ({
			id: e.id,
			event: e.event,
			severity: e.severity,
			ip: e.ip,
			country: e.country,
			city: e.city,
			resolved: e.resolved,
			createdAt: e.createdAt,
		}))
	}

	/**
	 * Get all trusted devices for a user
	 */
	@Query(() => [TrustedDeviceSummary], {
		name: 'adminGetUserTrustedDevices',
		description: '[Admin] Get all trusted devices for a user',
	})
	async getUserTrustedDevices(@Args('userId') userId: string): Promise<TrustedDeviceSummary[]> {
		const devices = await this.deviceTrustService.getUserDevices(userId)

		return devices.map(d => ({
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
		}))
	}

	// ==================== Mutations ====================

	/**
	 * Disable 2FA for a user (emergency access)
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminDisableUser2FA',
		description: '[Admin] Disable 2FA for a user in emergency situations',
	})
	async disableUser2FA(
		@Authorized() adminUser: User,
		@Args('input') input: DisableUser2FAInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.disableUser2FA(adminUser, input)
	}

	/**
	 * Revoke a specific device for a user
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminRevokeUserDevice',
		description: '[Admin] Revoke a specific trusted device for a user',
	})
	async revokeUserDevice(
		@Authorized() adminUser: User,
		@Args('input') input: RevokeUserDeviceInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.revokeUserDevice(adminUser, input)
	}

	/**
	 * Revoke all devices for a user (emergency)
	 */
	@Mutation(() => AdminActionSuccessModel, {
		name: 'adminRevokeAllUserDevices',
		description: '[Admin] Revoke all trusted devices and sessions for a user',
	})
	async revokeAllUserDevices(
		@Authorized() adminUser: User,
		@Args('input') input: RevokeAllUserDevicesInput,
	): Promise<AdminActionSuccessModel> {
		return this.adminService.revokeAllUserDevices(adminUser, input)
	}
}
```

`src/modules/auth/2fa/resolvers/index.ts`

```typescript
export * from './2fa.resolver'
export * from './admin-2fa.resolver'
```

**services**
`src/modules/auth/2fa/services/2fa-cron.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'

import { BackupCodeService } from './backup-code.service'
import { DeviceTrustService } from './device-trust.service'
import { SecurityEventService } from './security-event.service'

/**
 * Automated maintenance service for 2FA system.
 * Handles cleanup of expired data and enforcement of limits.
 */
@Injectable()
export class TwoFactorCronService {
	private readonly logger = new Logger(TwoFactorCronService.name)

	constructor(
		private readonly backupCodeService: BackupCodeService,
		private readonly deviceTrustService: DeviceTrustService,
		private readonly securityEventService: SecurityEventService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {
		this.logger.log('🤖 2FA Cron Service initialized')
		this.logScheduledJobs()
	}

	/**
	 * Clean up expired backup codes
	 * Runs daily at 2:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_BACKUP_CODES || '0 2 * * *', {
		name: 'cleanup-backup-codes',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupExpiredBackupCodes(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🧹 Starting expired backup codes cleanup...')

		try {
			const result = await this.backupCodeService.cleanupExpiredCodes()
			const duration = Date.now() - startTime

			this.logger.log(
				`✅ Backup codes cleanup completed: ${result.deleted} codes removed, ` +
					`${result.affected} users affected (${duration}ms)`,
			)

			// Log metrics for monitoring
			await this.logCronMetrics('cleanup_backup_codes', {
				success: true,
				itemsProcessed: result.deleted,
				usersAffected: result.affected,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Backup codes cleanup failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('cleanup_backup_codes', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Clean up old and inactive devices
	 * Runs daily at 3:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_DEVICES || '0 3 * * *', {
		name: 'cleanup-devices',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldDevices(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🧹 Starting old devices cleanup...')

		try {
			const result = await this.deviceTrustService.cleanupDevices()
			const duration = Date.now() - startTime

			this.logger.log(
				`✅ Devices cleanup completed: ${result.deleted} devices removed, ` +
					`${result.sessionsInvalidated} sessions invalidated (${duration}ms)`,
			)

			await this.logCronMetrics('cleanup_devices', {
				success: true,
				itemsProcessed: result.deleted,
				sessionsInvalidated: result.sessionsInvalidated,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Devices cleanup failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('cleanup_devices', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Archive old security events
	 * Runs weekly on Sunday at 4:00 AM
	 */
	@Cron(process.env.CRON_CLEANUP_EVENTS || '0 4 * * 0', {
		name: 'cleanup-security-events',
		timeZone: process.env.TZ || 'UTC',
	})
	async cleanupOldSecurityEvents(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🧹 Starting old security events cleanup...')

		try {
			const result = await this.securityEventService.archiveOldEvents()
			const duration = Date.now() - startTime

			this.logger.log(
				`✅ Security events cleanup completed: ${result.archived} events archived, ` +
					`${result.deleted} events deleted (${duration}ms)`,
			)

			await this.logCronMetrics('cleanup_security_events', {
				success: true,
				archived: result.archived,
				deleted: result.deleted,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Security events cleanup failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('cleanup_security_events', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Enforce device limits for all users
	 * Runs every 6 hours
	 */
	@Cron(process.env.CRON_ENFORCE_DEVICE_LIMITS || '0 */6 * * *', {
		name: 'enforce-device-limits',
		timeZone: process.env.TZ || 'UTC',
	})
	async enforceDeviceLimits(): Promise<void> {
		const startTime = Date.now()
		this.logger.log('🔒 Starting device limits enforcement...')

		try {
			const result = await this.deviceTrustService.enforceAllUsersDeviceLimits()
			const duration = Date.now() - startTime

			if (result.devicesRevoked > 0) {
				this.logger.warn(
					`⚠️ Device limits enforced: ${result.devicesRevoked} devices revoked ` +
						`from ${result.usersAffected} users (${duration}ms)`,
				)
			} else {
				this.logger.log(`✅ Device limits check completed: All users within limits (${duration}ms)`)
			}

			await this.logCronMetrics('enforce_device_limits', {
				success: true,
				devicesRevoked: result.devicesRevoked,
				usersAffected: result.usersAffected,
				usersChecked: result.usersChecked,
				duration,
			})
		} catch (error) {
			const duration = Date.now() - startTime
			this.logger.error(
				`❌ Device limits enforcement failed after ${duration}ms: ${(error as Error).message}`,
				(error as Error).stack,
			)

			await this.logCronMetrics('enforce_device_limits', {
				success: false,
				error: (error as Error).message,
				duration,
			})
		}
	}

	/**
	 * Log cron job metrics for monitoring
	 */
	private async logCronMetrics(jobName: string, metrics: Record<string, any>): Promise<void> {
		// In production, you would send these metrics to your monitoring service
		// For now, we'll just log them
		this.logger.debug(`📊 Cron metrics for ${jobName}:`, metrics)

		// Example: Send to monitoring service
		// await this.monitoringService.recordCronExecution(jobName, metrics)
	}

	/**
	 * Log all scheduled jobs on startup
	 */
	private logScheduledJobs(): void {
		const jobs = this.schedulerRegistry.getCronJobs()

		this.logger.log('📅 Scheduled cron jobs:')
		jobs.forEach((job, name) => {
			const nextDate = job.nextDate()
			this.logger.log(`  - ${name}: Next run at ${nextDate.toISO()}`)
		})
	}

	/**
	 * Manually trigger a specific job (for testing/admin purposes)
	 */
	async triggerJob(jobName: string): Promise<void> {
		const job = this.schedulerRegistry.getCronJob(jobName)

		if (!job) {
			throw new Error(`Job ${jobName} not found`)
		}

		this.logger.warn(`⚡ Manually triggering job: ${jobName}`)

		// Fix: Use void operator for fire-and-forget or handle the promise
		void job.fireOnTick()
		// Alternative if fireOnTick returns a promise and you want to wait:
		// await Promise.resolve(job.fireOnTick())
	}

	/**
	 * Get status of all cron jobs
	 */
	getCronJobsStatus(): Array<{ name: string; running: boolean; nextRun: Date | null }> {
		const jobs = this.schedulerRegistry.getCronJobs()
		const status: Array<{ name: string; running: boolean; nextRun: Date | null }> = []

		jobs.forEach((job, name) => {
			try {
				// CronJob from 'cron' package doesn't have 'running' property
				// Check if job has lastDate (it was executed) as proxy for running state
				const lastDate = job.lastDate()
				const nextDate = job.nextDate()

				status.push({
					name,
					running: false, // We can't reliably determine if running
					nextRun: nextDate ? nextDate.toJSDate() : null,
				})
			} catch (error) {
				this.logger.error(`Failed to get status for job ${name}:`, error)
				status.push({
					name,
					running: false,
					nextRun: null,
				})
			}
		})

		return status
	}

	/**
	 * Alternative implementation with better type safety
	 */
	getCronJobsStatusSafe(): Array<{
		name: string
		lastDate: Date | null
		nextDate: Date | null
	}> {
		const jobs = this.schedulerRegistry.getCronJobs()
		const status: Array<{
			name: string
			lastDate: Date | null
			nextDate: Date | null
		}> = []

		jobs.forEach((job, name) => {
			try {
				status.push({
					name,
					lastDate: job.lastDate() || null,
					nextDate: job.nextDate()?.toJSDate() || null,
				})
			} catch (error) {
				this.logger.error(`Failed to get status for job ${name}:`, error)
				status.push({
					name,
					lastDate: null,
					nextDate: null,
				})
			}
		})

		return status
	}
}
```

`src/modules/auth/2fa/services/2fa-method.service.ts`

```typescript
import { encode } from 'hi-base32'
import { randomBytes } from 'node:crypto'
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'

import { APP_NAME } from '@/core/config'
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { MailService, SmsService } from '@/modules/libs'
import { NotificationService } from '@/modules/notification'
import { HashUtil } from '@/shared/utils'
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common'
import { E2FAMethod, ESecurityEvent, ESecuritySeverity, Prisma, type User } from '@prisma/__generated__'

import { AUDIT_ACTIONS, OTP_CONFIG, QR_CODE_OPTIONS, REDIS_KEYS, TOTP_CONFIG, TWO_FA_CONFIG } from '../constants'
import type {
	CompleteTotpSetupInput,
	RegenerateBackupCodesInput,
	Remove2FAMethodInput,
	SendOtpCodeInput,
	SetupOtpInput,
	Update2FAMethodInput,
	VerifyOtpSetupInput,
} from '../dtos'
import type { IOtpEmailMethodData, IOtpSmsMethodData, ITotpMethodData } from '../types'
import { EncryptionUtil } from '../utils'

import { BackupCodeService } from './backup-code.service'
import { SecurityEventService } from './security-event.service'

/**
 * Main 2FA Method Service
 * Orchestrates all 2FA operations across different methods
 */
@Injectable()
export class TwoFactorMethodService extends CoreService {
	private readonly logger = new Logger(TwoFactorMethodService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly backupCodeService: BackupCodeService,
		private readonly securityEventService: SecurityEventService,
		private readonly mailService: MailService,
		private readonly smsService: SmsService,
		private readonly notificationService: NotificationService,
	) {
		super(i18n, prisma, redis)
	}

	// ==================== TOTP Methods ====================

	/**
	 * Generate TOTP setup (QR code + secret)
	 */
	async generateTotpSetup(user: User, name: string | undefined, lng: Language) {
		// Check if user already has max methods
		await this.checkMethodLimits(user.id, lng)

		// Generate secret
		const secret = this.generateTotpSecret()

		// Create TOTP instance
		const totp = this.createTOTP(user.email, secret)
		const otpAuthUrl = totp.toString()

		// Generate QR code
		const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, QR_CODE_OPTIONS)

		// Store temporary secret in Redis (10 minutes)
		const tempKey = REDIS_KEYS.TOTP_TEMP_SECRET(user.id)
		await this.rSetJSON(tempKey, { secret, name }, 600)

		this.logger.log(`TOTP setup generated for user ${user.id}`)

		return {
			methodId: 'temp', // Temporary ID until verified
			qrCodeUrl,
			manualEntryKey: secret,
			issuer: APP_NAME,
			accountName: user.email,
		}
	}

	/**
	 * Complete TOTP setup after user scans QR and enters code
	 */
	async completeTotpSetup(user: User, input: CompleteTotpSetupInput, lng: Language) {
		// Get temporary secret
		const tempKey = REDIS_KEYS.TOTP_TEMP_SECRET(user.id)
		const cached = await this.rGetJSON<{ secret: string; name?: string }>(tempKey)

		if (!cached?.secret) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.setup_expired', {
					lng,
					defaultValue: 'TOTP setup has expired. Please start again.',
				}),
			)
		}

		if (cached.secret !== input.secret) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_secret', { lng, defaultValue: 'Invalid TOTP secret' }),
			)
		}

		// Verify code
		const isValid = this.verifyTotpCode(user.email, input.secret, input.code)
		if (!isValid) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid verification code' }),
			)
		}

		// Encrypt secret
		const encryptedSecret = EncryptionUtil.encrypt(input.secret)

		// Prepare method data
		const methodData: ITotpMethodData = {
			secret: encryptedSecret,
			algorithm: TOTP_CONFIG.ALGORITHM,
			digits: TOTP_CONFIG.DIGITS,
			period: TOTP_CONFIG.PERIOD,
			issuer: APP_NAME,
			accountName: user.email,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		// Create method and backup codes in transaction
		const result = await this.prisma.$transaction(async tx => {
			// Check if this should be primary (first method)
			const existingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})
			const isPrimary = existingMethods === 0

			// Create authentication method
			const method = await tx.authenticationMethod.create({
				data: {
					userId: user.id,
					method: E2FAMethod.TOTP,
					data: methodData as unknown as Prisma.JsonValue,
					name: input.name || cached.name || 'TOTP Authenticator',
					isPrimary,
					isActive: true,
				},
			})

			// Enable 2FA on user if this is first method
			if (isPrimary) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: true,
						preferred2FAMethod: E2FAMethod.TOTP,
					},
				})
			}

			// Log audit
			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: AUDIT_ACTIONS.TOTP_SETUP_COMPLETED,
					category: 'SECURITY',
					success: true,
					metadata: { methodId: method.id } as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Generate backup codes (outside transaction for better error handling)
		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, E2FAMethod.TOTP, result.id)

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				methodType: result.method,
				timestamp: new Date().toISOString(),
			},
		})

		// ✅ NOTIFICATION CALL
		await this.notificationService.notify2FAMethodAdded(user, E2FAMethod.TOTP, result.name, lng)

		// Clear temp secret
		await this.rDel(tempKey)

		this.logger.log(`TOTP setup completed for user ${user.id}, method ${result.id}`)

		return {
			success: true,
			methodId: result.id,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes in a secure place. Each code can only be used once.',
			}),
		}
	}

	// ==================== OTP Methods ====================

	/**
	 * Setup OTP (Email or SMS)
	 */
	async setupOtp(user: User, input: SetupOtpInput, lng: Language) {
		await this.checkMethodLimits(user.id, lng)

		// Validate input
		if (input.method === E2FAMethod.OTP_EMAIL && !input.email && !user.email) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.email_required', { lng, defaultValue: 'Email is required for OTP_EMAIL' }),
			)
		}

		if (input.method === E2FAMethod.OTP_SMS && !input.phone && !user.phone) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.phone_required', { lng, defaultValue: 'Phone is required for OTP_SMS' }),
			)
		}

		// Prepare method data
		let methodData: IOtpEmailMethodData | IOtpSmsMethodData

		if (input.method === E2FAMethod.OTP_EMAIL) {
			const email = input.email || user.email
			methodData = {
				email,
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
		} else {
			const phone = input.phone || user.phone
			methodData = {
				phone,
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
		}

		// Create method
		const existingMethods = await this.prisma.authenticationMethod.count({
			where: { userId: user.id, isActive: true },
		})
		const isPrimary = existingMethods === 0

		const method = await this.prisma.authenticationMethod.create({
			data: {
				userId: user.id,
				method: input.method,
				data: methodData as unknown as Prisma.JsonValue,
				name: input.name || `${input.method === E2FAMethod.OTP_EMAIL ? 'Email' : 'SMS'} OTP`,
				isPrimary,
				isActive: false, // Inactive until verified
			},
		})

		// Enable 2FA if first method
		if (isPrimary) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					is2FAEnabled: true,
					preferred2FAMethod: input.method,
				},
			})
		}

		this.logger.log(`OTP setup created for user ${user.id}, method ${method.id}`)

		return {
			methodId: method.id,
			destination:
				input.method === E2FAMethod.OTP_EMAIL
					? (methodData as IOtpEmailMethodData).email
					: (methodData as IOtpSmsMethodData).phone,
			message: this.i18n.t('auth.setup.2fa.otp_created', {
				lng,
				defaultValue: 'OTP method created. Please verify with a code.',
			}),
		}
	}

	/**
	 * Send OTP code to user
	 */
	async sendOtpCode(user: User, input: SendOtpCodeInput, lng: Language) {
		const method = input.methodId
			? await this.prisma.authenticationMethod.findUnique({
					where: { id: input.methodId },
				})
			: await this.prisma.authenticationMethod.findFirst({
					where: {
						userId: user.id,
						method: { in: [E2FAMethod.OTP_EMAIL, E2FAMethod.OTP_SMS] },
						isPrimary: true,
					},
				})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'OTP method not found' }),
			)
		}

		// Generate code
		const code = this.generateOtpCode()
		const hashedCode = await HashUtil.hash(code)

		// Store in Redis
		const codeKey = REDIS_KEYS.OTP_CODE(user.id)
		await this.rSetJSON(
			codeKey,
			{
				code: hashedCode,
				methodId: method.id,
				expiresAt: Date.now() + OTP_CONFIG.CODE_EXPIRY * 1000,
			},
			OTP_CONFIG.CODE_EXPIRY,
		)

		const methodData = method.data as unknown as IOtpEmailMethodData | IOtpSmsMethodData

		try {
			if (method.method === E2FAMethod.OTP_EMAIL) {
				const data = methodData as IOtpEmailMethodData
				// NOTE: We may need a new method in MailService to send a simple code.
				// For now, we'll adapt an existing one or assume it exists.
				await this.mailService.sendOtpCodeEmail(data.email, code, lng) // Assuming this method exists or will be created.
				this.logger.log(`OTP code sent to ${data.email}`)
			} else {
				const data = methodData as IOtpSmsMethodData
				await this.smsService.sendOtpSMS(data.phone, code, lng)
				this.logger.log(`OTP code sent to ${data.phone}`)
			}
		} catch (error) {
			this.logger.error(`Failed to send OTP for user ${user.id} via ${method.method}`, error)
			throw new InternalServerErrorException(
				this.i18n.t('auth.errors.2fa.send_failed', {
					lng,
					defaultValue: 'Failed to send the verification code.',
				}),
			)
		}

		return {
			success: true,
			message: this.i18n.t('auth.success.2fa.otp_sent', { lng, defaultValue: 'OTP code sent successfully' }),
		}
	}

	/**
	 * Verify OTP code during setup
	 */
	async verifyOtpSetup(user: User, input: VerifyOtpSetupInput, lng: Language) {
		// Get stored code
		const codeKey = REDIS_KEYS.OTP_CODE(user.id)
		const cached = await this.rGetJSON<{ code: string; methodId: string; expiresAt: number }>(codeKey)

		if (!cached) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.code_expired', { lng, defaultValue: 'OTP code has expired' }),
			)
		}

		if (cached.methodId !== input.methodId) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_mismatch', { lng, defaultValue: 'Code does not match method' }),
			)
		}

		// Verify code
		const isValid = await HashUtil.verify(cached.code, input.code)
		if (!isValid) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_code', { lng, defaultValue: 'Invalid OTP code' }),
			)
		}

		// Activate method and generate backup codes
		const result = await this.prisma.$transaction(async tx => {
			const method = await tx.authenticationMethod.update({
				where: { id: input.methodId },
				data: { isActive: true },
			})

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: AUDIT_ACTIONS.OTP_SETUP_COMPLETED,
					category: 'SECURITY',
					success: true,
					metadata: { methodId: method.id } as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: { methodId: result.id, methodType: result.method, timestamp: new Date().toISOString() },
		})

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_METHOD_ADDED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				methodType: result.method,
				timestamp: new Date().toISOString(),
			},
		})

		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, result.method, result.id)
		await this.rDel(codeKey)

		// ✅ NOTIFICATION CALL
		await this.notificationService.notify2FAMethodAdded(user, result.method, result.name, lng)

		return {
			success: true,
			methodId: result.id,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes securely.',
			}),
		}
	}

	// ==================== Method Management ====================

	/**
	 * Get all user's 2FA methods
	 */
	async getUserMethods(userId: string) {
		const methods = await this.prisma.authenticationMethod.findMany({
			where: { userId, isActive: true },
			orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
		})

		const primary = methods.find(m => m.isPrimary)
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { is2FAEnabled: true },
		})

		return {
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
			primary: primary
				? {
						id: primary.id,
						method: primary.method,
						name: primary.name,
						isActive: primary.isActive,
						isPrimary: primary.isPrimary,
						lastUsedAt: primary.lastUsedAt,
						useCount: primary.useCount,
						createdAt: primary.createdAt,
					}
				: undefined,
			totalActive: methods.length,
			is2FAEnabled: user?.is2FAEnabled || false,
		}
	}

	/**
	 * Update 2FA method
	 */
	async updateMethod(userId: string, input: Update2FAMethodInput, lng: Language) {
		const method = await this.prisma.authenticationMethod.findFirst({
			where: { id: input.methodId, userId },
		})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
			)
		}

		// If setting as primary, unset other primary methods
		if (input.isPrimary) {
			await this.prisma.authenticationMethod.updateMany({
				where: { userId, isPrimary: true },
				data: { isPrimary: false },
			})
		}

		await this.prisma.authenticationMethod.update({
			where: { id: input.methodId },
			data: {
				name: input.name,
				isPrimary: input.isPrimary,
				isActive: input.isActive,
			},
		})

		return { success: true }
	}

	/**
	 * Remove 2FA method
	 */
	async removeMethod(user: User, input: Remove2FAMethodInput, lng: Language) {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, input.password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		const method = await this.prisma.authenticationMethod.findFirst({
			where: { id: input.methodId, userId: user.id },
		})

		if (!method) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
			)
		}

		// If removing last method, require additional confirmation
		const activeMethods = await this.prisma.authenticationMethod.count({
			where: { userId: user.id, isActive: true },
		})

		if (activeMethods === 1 && !input.code) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.last_method_code_required', {
					lng,
					defaultValue: 'Code required to remove last 2FA method',
				}),
			)
		}

		// Delete method and backup codes
		await this.prisma.$transaction(async tx => {
			await tx.authenticationMethod.delete({
				where: { id: input.methodId },
			})

			await tx.backupCode.deleteMany({
				where: { authMethodId: input.methodId },
			})

			// If this was the last method, disable 2FA
			if (activeMethods === 1) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: false,
						preferred2FAMethod: null,
					},
				})
			}
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event: activeMethods === 1 ? ESecurityEvent.TWO_FA_DISABLED : ESecurityEvent.TWO_FA_METHOD_REMOVED,
			severity: ESecuritySeverity.HIGH,
			metadata: { methodId: input.methodId, methodType: method.method, timestamp: new Date().toISOString() },
		})

		// ✅ NOTIFICATION CALL
		if (activeMethods === 1) {
			// Last method removed - 2FA completely disabled
			await this.notificationService.notify2FADisabled(user, lng)
		} else {
			await this.notificationService.notify2FAMethodRemoved(user, method.method, method.name, lng)
		}

		return { success: true }
	}

	/**
	 * Regenerate backup codes
	 */
	async regenerateBackupCodes(user: User, input: RegenerateBackupCodesInput, lng: Language) {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, input.password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		let backupCodes: string[]

		if (input.methodId) {
			const method = await this.prisma.authenticationMethod.findFirst({
				where: { id: input.methodId, userId: user.id },
			})

			if (!method) {
				throw new BadRequestException(
					this.i18n.t('auth.errors.2fa.method_not_found', { lng, defaultValue: 'Method not found' }),
				)
			}

			backupCodes = await this.backupCodeService.regenerateBackupCodes(user.id, method.method, method.id)
		} else {
			// Regenerate for all methods
			const methods = await this.prisma.authenticationMethod.findMany({
				where: { userId: user.id, isActive: true },
			})

			backupCodes = []
			for (const method of methods) {
				const codes = await this.backupCodeService.regenerateBackupCodes(user.id, method.method, method.id)
				backupCodes.push(...codes)
			}
		}

		// ✅ NOTIFICATION CALL
		await this.notificationService.notifyBackupCodesRegenerated(user, lng)

		await this.securityEventService.logEvent({
			userId: user.id,
			event: ESecurityEvent.TWO_FA_BACKUP_CODES_REGENERATED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: input.methodId || 'all',
				methodType: 'BACKUP_CODE',
				timestamp: new Date().toISOString(),
			},
		})

		return {
			success: true,
			backupCodes,
			message: this.i18n.t('auth.setup.2fa.backup_codes_warning', {
				lng,
				defaultValue: 'Save these backup codes securely.',
			}),
		}
	}

	// ... (после regenerateBackupCodes)

	// ==================== Method Verification ====================

	/**
	 * Verifies a TOTP code against the encrypted secret.
	 * This method is public to be accessible from the resolver.
	 *
	 * @param email - User's email (for TOTP label).
	 * @param encryptedSecret - The encrypted secret from the database.
	 * @param code - The 6-digit code from the user.
	 * @returns {boolean} - True if the code is valid.
	 */
	public verifyTotpCode(email: string, encryptedSecret: string, code: string): boolean {
		try {
			const secret = EncryptionUtil.decrypt(encryptedSecret)
			const totp = this.createTOTP(email, secret) // createTOTP остается private
			const delta = totp.validate({ token: code, window: TOTP_CONFIG.WINDOW })
			return delta !== null
		} catch (error) {
			this.logger.error(`TOTP code verification failed: ${(error as Error).message}`)
			return false
		}
	}

	/**
	 * Verifies a one-time code (Email/SMS) against the value stored in Redis.
	 * This method is public to be accessible from the resolver.
	 *
	 * @param userId - The ID of the user.
	 * @param methodId - The ID of the OTP method being verified.
	 * @param code - The 6-digit code from the user.
	 * @param lng - The language for error messages.
	 * @returns {Promise<boolean>} - True if the code is valid.
	 */
	public async verifyOneTimeCode(userId: string, methodId: string, code: string, lng: Language): Promise<boolean> {
		const codeKey = REDIS_KEYS.OTP_CODE(userId)
		const cached = await this.rGetJSON<{ code: string; methodId: string; expiresAt: number }>(codeKey)

		if (!cached) {
			// Не выбрасываем ошибку здесь, чтобы резолвер мог обработать это как "неверный код"
			return false
		}

		// Проверяем, что код предназначен для этого метода
		if (cached.methodId !== methodId) {
			return false
		}

		const isValid = await HashUtil.verify(cached.code, code)
		if (isValid) {
			// Prevent code reuse by deleting it after successful verification.
			await this.rDel(codeKey)
		}
		return isValid
	}

	// ==================== Private Helpers ====================

	private async checkMethodLimits(userId: string, lng: Language): Promise<void> {
		const count = await this.prisma.authenticationMethod.count({
			where: { userId, isActive: true },
		})

		if (count >= TWO_FA_CONFIG.MAX_METHODS_PER_USER) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.max_methods', {
					lng,
					defaultValue: `Maximum ${TWO_FA_CONFIG.MAX_METHODS_PER_USER} methods allowed`,
					max: TWO_FA_CONFIG.MAX_METHODS_PER_USER,
				}),
			)
		}
	}

	private generateTotpSecret(): string {
		return encode(randomBytes(15)).replace(/=/g, '').substring(0, TOTP_CONFIG.SECRET_LENGTH)
	}

	private createTOTP(email: string, secret: string): TOTP {
		return new TOTP({
			issuer: APP_NAME,
			label: email,
			algorithm: TOTP_CONFIG.ALGORITHM,
			digits: TOTP_CONFIG.DIGITS,
			period: TOTP_CONFIG.PERIOD,
			secret,
		})
	}

	private generateOtpCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString()
	}
}
```

`src/modules/auth/2fa/services/admin-2fa.service.ts`

```typescript
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
```

`src/modules/auth/2fa/services/backup-code.service.ts`

```typescript
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
```

`src/modules/auth/2fa/services/device-trust.service.ts`

```typescript
import { addSeconds } from 'date-fns'

import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { NotificationService } from '@/modules/notification'
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

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
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
		lng: Language,
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

		// ✅ NOTIFICATION CALL (just for new devices)
		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (user) {
			await this.notificationService.notifyNewDeviceLogin(user, session, lng)
		}

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
	 * Returns metrics about the cleanup operation
	 */
	async cleanupDevices(): Promise<{ deleted: number; sessionsInvalidated: number }> {
		const cutoffDate = new Date(Date.now() - DEVICE_LIMITS.CLEANUP_AFTER_DAYS * 24 * 60 * 60 * 1000)

		// Get devices to be deleted for metrics
		const devicesToDelete = await this.prisma.trustedDevice.findMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					{ lastSeenAt: { lt: cutoffDate } },
					{
						isActive: false,
						revokedAt: { lt: cutoffDate },
					},
				],
			},
			select: {
				deviceId: true,
				userId: true,
			},
		})

		const deviceIds = devicesToDelete.map(d => d.deviceId)

		// Invalidate sessions from these devices
		const sessionsResult = await this.prisma.session.updateMany({
			where: {
				deviceId: { in: deviceIds },
				revokedAt: null,
			},
			data: {
				revokedAt: new Date(),
			},
		})

		// Delete the devices
		const devicesResult = await this.prisma.trustedDevice.deleteMany({
			where: {
				OR: [
					{ expiresAt: { lt: new Date() } },
					{ lastSeenAt: { lt: cutoffDate } },
					{
						isActive: false,
						revokedAt: { lt: cutoffDate },
					},
				],
			},
		})

		this.logger.log(
			`Cleaned up ${devicesResult.count} old devices and invalidated ${sessionsResult.count} sessions`,
		)

		return {
			deleted: devicesResult.count,
			sessionsInvalidated: sessionsResult.count,
		}
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

	/**
	 * Enforce device limits for all users
	 * Returns metrics about enforcement actions
	 */
	async enforceAllUsersDeviceLimits(): Promise<{
		usersChecked: number
		usersAffected: number
		devicesRevoked: number
	}> {
		// Get all users with their device counts
		const usersWithDevices = await this.prisma.user.findMany({
			where: {
				trustedDevices: {
					some: {
						isActive: true,
					},
				},
			},
			select: {
				id: true,
				email: true,
				trustedDevices: {
					where: { isActive: true },
					orderBy: { lastSeenAt: 'desc' },
					select: {
						id: true,
						deviceId: true,
						lastSeenAt: true,
					},
				},
			},
		})

		let usersAffected = 0
		let totalDevicesRevoked = 0

		for (const user of usersWithDevices) {
			if (user.trustedDevices.length > DEVICE_LIMITS.MAX_TRUSTED_DEVICES) {
				const devicesToRevoke = user.trustedDevices.slice(DEVICE_LIMITS.MAX_TRUSTED_DEVICES)

				for (const device of devicesToRevoke) {
					await this.revokeDevice(user.id, device.deviceId)
					totalDevicesRevoked++
				}

				usersAffected++

				this.logger.warn(
					`User ${user.email} exceeded device limit. Revoked ${devicesToRevoke.length} oldest devices`,
				)
			}
		}

		return {
			usersChecked: usersWithDevices.length,
			usersAffected,
			devicesRevoked: totalDevicesRevoked,
		}
	}
}
```

`src/modules/auth/2fa/services/index.ts`

```typescript
export * from './security-event.service'
export * from './backup-code.service'
export * from './device-trust.service'
export * from './2fa-method.service'
export * from './admin-2fa.service'
export * from './2fa-cron.service'
export * from './webauthn.service'
```

`src/modules/auth/2fa/services/security-event.service.ts`

```typescript
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { NotificationService } from '@/modules/notification'
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

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly notificationService: NotificationService,
	) {
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
		lng: Language,
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

		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (user) {
			await this.notificationService.notifySuspiciousActivity(user, reason, riskScore, lng)
		}
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

	/**
	 * Archive old security events
	 * Moves old events to archive table or deletes based on retention policy
	 */
	async archiveOldEvents(): Promise<{ archived: number; deleted: number }> {
		const retentionDays = parseInt(process.env.SECURITY_EVENTS_RETENTION_DAYS || '90')
		const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

		// For now, we'll just delete old resolved events
		// In production, you might want to move them to an archive table first

		// Delete old resolved events
		const deletedResolved = await this.prisma.securityEvent.deleteMany({
			where: {
				createdAt: { lt: cutoffDate },
				resolved: true,
			},
		})

		// Keep unresolved events for longer (double retention)
		const extendedCutoff = new Date(Date.now() - retentionDays * 2 * 24 * 60 * 60 * 1000)
		const deletedUnresolved = await this.prisma.securityEvent.deleteMany({
			where: {
				createdAt: { lt: extendedCutoff },
				resolved: false,
				severity: { in: [ESecuritySeverity.LOW, ESecuritySeverity.MEDIUM] },
			},
		})

		const totalDeleted = deletedResolved.count + deletedUnresolved.count

		this.logger.log(
			`Archived/deleted ${totalDeleted} old security events ` +
				`(${deletedResolved.count} resolved, ${deletedUnresolved.count} unresolved)`,
		)

		return {
			archived: 0, // Would be used if we implement archiving
			deleted: totalDeleted,
		}
	}
}
```

`src/modules/auth/2fa/services/webauthn.service.ts`

```typescript
import { CoreService } from '@/core/core.service'
import { I18nService, Language } from '@/core/i18n'
import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { HashUtil } from '@/shared/utils'
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { E2FAMethod, ESecurityEvent, ESecuritySeverity, Prisma, type User } from '@prisma/__generated__'
import {
	generateAuthenticationOptions,
	generateRegistrationOptions,
	type VerifiedAuthenticationResponse,
	type VerifiedRegistrationResponse,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
} from '@simplewebauthn/server'
import type {
	AuthenticationResponseJSON,
	AuthenticatorTransportFuture,
	RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types'

import { REDIS_KEYS, WEBAUTHN_CONFIG, WEBAUTHN_RP, WEBAUTHN_STORAGE } from '../constants'
import type { IPasskeyMethodData, IWebAuthnMethodData } from '../types'

import { BackupCodeService } from './backup-code.service'
import { SecurityEventService } from './security-event.service'

/**
 * Service handling WebAuthn/FIDO2 operations for passwordless authentication
 * and hardware security keys support.
 */
@Injectable()
export class WebAuthnService extends CoreService {
	private readonly logger = new Logger(WebAuthnService.name)

	constructor(
		i18n: I18nService,
		prisma: PrismaService,
		redis: RedisService,
		private readonly backupCodeService: BackupCodeService,
		private readonly securityEventService: SecurityEventService,
	) {
		super(i18n, prisma, redis)
	}

	/**
	 * Generate registration options for new WebAuthn credential
	 */
	async generateRegistrationOptions(
		user: User,
		authenticatorAttachment?: 'platform' | 'cross-platform',
		lng: Language = 'en',
	): Promise<{
		challengeId: string
		options: any // Use any for GraphQL compatibility
	}> {
		// Check credential limit
		const credentialCount = await this.prisma.authenticationMethod.count({
			where: {
				userId: user.id,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				isActive: true,
			},
		})

		if (credentialCount >= WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.max_credentials', {
					lng,
					max: WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER,
					defaultValue: `Maximum ${WEBAUTHN_STORAGE.MAX_CREDENTIALS_PER_USER} credentials allowed`,
				}),
			)
		}

		// Get existing credentials to exclude
		const existingCredentials = await this.prisma.authenticationMethod.findMany({
			where: {
				userId: user.id,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				credentialId: { not: null },
			},
			select: { credentialId: true },
		})

		// Format exclude credentials properly
		const excludeCredentials = existingCredentials
			.filter(c => c.credentialId)
			.map(c => ({
				id: c.credentialId,
				transports: ['usb', 'nfc', 'ble', 'internal'] as AuthenticatorTransportFuture[],
			}))

		// Generate registration options
		const options = await generateRegistrationOptions({
			rpName: WEBAUTHN_RP.NAME,
			rpID: WEBAUTHN_RP.ID,
			userID: Buffer.from(user.id, 'utf-8'), // Convert string to Uint8Array
			userName: user.email,
			userDisplayName: user.fullName || user.email,
			timeout: WEBAUTHN_CONFIG.CREDENTIAL_PARAMS.TIMEOUT,
			excludeCredentials,
			authenticatorSelection: {
				authenticatorAttachment,
				residentKey: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.RESIDENT_KEY,
				userVerification: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.USER_VERIFICATION,
			},
		})

		// Store challenge in Redis
		const challengeId = this.generateChallengeId()
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)

		await this.rSetJSON(
			challengeKey,
			{
				userId: user.id,
				challenge: options.challenge,
				type: 'registration',
				createdAt: new Date().toISOString(),
			},
			WEBAUTHN_STORAGE.CHALLENGE_TTL,
		)

		this.logger.log(`Generated WebAuthn registration options for user ${user.id}`)

		return { challengeId, options }
	}

	/**
	 * Verify registration response and save credential
	 */
	async verifyRegistrationResponse(
		user: User,
		challengeId: string,
		response: RegistrationResponseJSON,
		authenticatorName?: string,
		lng: Language = 'en',
	): Promise<{
		success: boolean
		methodId: string
		credentialId: string
		backupCodes: string[]
	}> {
		// Get challenge from Redis
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)
		const challengeData = await this.rGetJSON<{
			userId: string
			challenge: string
			type: string
		}>(challengeKey)

		if (!challengeData || challengeData.userId !== user.id || challengeData.type !== 'registration') {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_challenge', {
					lng,
					defaultValue: 'Invalid or expired challenge',
				}),
			)
		}

		// Verify the registration
		let verification: VerifiedRegistrationResponse
		try {
			verification = await verifyRegistrationResponse({
				response,
				expectedChallenge: challengeData.challenge,
				expectedOrigin: WEBAUTHN_RP.ORIGIN,
				expectedRPID: WEBAUTHN_RP.ID,
			})
		} catch (error) {
			this.logger.error(`WebAuthn registration verification failed: ${(error as Error).message}`)
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.registration_failed', {
					lng,
					defaultValue: 'Registration verification failed',
				}),
			)
		}

		if (!verification.verified || !verification.registrationInfo) {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.registration_invalid', {
					lng,
					defaultValue: 'Invalid registration response',
				}),
			)
		}

		const { registrationInfo } = verification
		const { credential, credentialDeviceType, credentialBackedUp, aaguid } = registrationInfo

		// Determine method type
		const isPlatform = credentialDeviceType === 'singleDevice'
		const methodType = isPlatform ? E2FAMethod.PASSKEY : E2FAMethod.WEBAUTHN

		// Create method data based on type - use separate variables for clarity
		let methodData: IWebAuthnMethodData | IPasskeyMethodData

		if (methodType === E2FAMethod.PASSKEY) {
			// Create IPasskeyMethodData
			const passkeyData: IPasskeyMethodData = {
				publicKey: Buffer.from(credential.publicKey).toString('base64url'),
				counter: credential.counter,
				credentialId: Buffer.from(credential.id).toString('base64url'),
				transports: (response.response.transports || ['internal']) as (
					| 'usb'
					| 'nfc'
					| 'ble'
					| 'internal'
					| 'hybrid'
				)[],
				aaguid: aaguid || undefined,
				isSynced: credentialBackedUp || false,
				platform: this.detectPlatform(response.response.clientDataJSON),
				backupEligible: credentialBackedUp || false,
				backedUp: credentialBackedUp || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
			methodData = passkeyData
		} else {
			// Create IWebAuthnMethodData
			const webauthnData: IWebAuthnMethodData = {
				publicKey: Buffer.from(credential.publicKey).toString('base64url'),
				counter: credential.counter,
				credentialId: Buffer.from(credential.id).toString('base64url'),
				transports: (response.response.transports || ['usb', 'nfc', 'ble', 'internal']) as (
					| 'usb'
					| 'nfc'
					| 'ble'
					| 'internal'
				)[],
				aaguid: aaguid || undefined,
				attestationFormat: 'none',
				userVerified: true,
				backupEligible: credentialBackedUp || false,
				backedUp: credentialBackedUp || false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}
			methodData = webauthnData
		}

		// Create method and backup codes in transaction
		const result = await this.prisma.$transaction(async tx => {
			const existingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})
			const isPrimary = existingMethods === 0

			const method = await tx.authenticationMethod.create({
				data: {
					userId: user.id,
					method: methodType,
					data: methodData as unknown as Prisma.JsonValue,
					name: authenticatorName || (isPlatform ? 'Platform Authenticator' : 'Security Key'),
					credentialId: Buffer.from(credential.id).toString('base64url'),
					isPrimary,
					isActive: true,
				},
			})

			if (isPrimary) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: true,
						preferred2FAMethod: methodType,
					},
				})
			}

			await tx.auditLog.create({
				data: {
					userId: user.id,
					action: methodType === E2FAMethod.PASSKEY ? 'PASSKEY_REGISTERED' : 'WEBAUTHN_REGISTERED',
					category: 'SECURITY',
					success: true,
					metadata: {
						methodId: method.id,
						credentialId: method.credentialId,
						authenticatorName,
						isPlatform,
					} as Prisma.InputJsonValue,
				},
			})

			return method
		})

		// Generate backup codes
		const backupCodes = await this.backupCodeService.generateBackupCodes(user.id, methodType, result.id)

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event:
				methodType === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_CREATED : ESecurityEvent.WEBAUTHN_REGISTERED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: result.id,
				credentialId: result.credentialId,
				authenticatorName,
				timestamp: new Date().toISOString(),
			},
		})

		// Clear challenge
		await this.rDel(challengeKey)

		this.logger.log(`WebAuthn/Passkey registered for user ${user.id}, method ${result.id}`)

		return {
			success: true,
			methodId: result.id,
			credentialId: result.credentialId,
			backupCodes,
		}
	}

	/**
	 * Generate authentication options
	 */
	async generateAuthenticationOptions(
		userId?: string,
		credentialId?: string,
	): Promise<{
		challengeId: string
		options: any // Already any, no need for assertion
		credentialCount: number
	}> {
		let allowCredentials: any[] = []
		let credentialCount = 0

		if (userId) {
			const credentials = await this.prisma.authenticationMethod.findMany({
				where: {
					userId,
					method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
					isActive: true,
					credentialId: credentialId || undefined,
				},
			})

			credentialCount = credentials.length

			allowCredentials = credentials
				.filter(c => c.credentialId)
				.map(c => {
					const data = c.data as unknown as IWebAuthnMethodData
					return {
						id: c.credentialId,
						transports: data.transports as AuthenticatorTransportFuture[],
					}
				})
		}

		const options = await generateAuthenticationOptions({
			rpID: WEBAUTHN_RP.ID,
			timeout: WEBAUTHN_CONFIG.CREDENTIAL_PARAMS.TIMEOUT,
			allowCredentials,
			userVerification: WEBAUTHN_CONFIG.AUTHENTICATOR_SELECTION.USER_VERIFICATION,
		})

		const challengeId = this.generateChallengeId()
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)

		await this.rSetJSON(
			challengeKey,
			{
				userId: userId || 'unknown',
				challenge: options.challenge,
				type: 'authentication',
				createdAt: new Date().toISOString(),
			},
			WEBAUTHN_STORAGE.CHALLENGE_TTL,
		)

		this.logger.log(`Generated WebAuthn authentication options${userId ? ` for user ${userId}` : ''}`)

		return {
			challengeId,
			options,
			credentialCount,
		}
	}

	/**
	 * Verify authentication response
	 */
	async verifyAuthenticationResponse(
		challengeId: string,
		response: AuthenticationResponseJSON,
		lng: Language = 'en',
	): Promise<{
		success: boolean
		userId: string
		credentialId: string
		methodId: string
	}> {
		const challengeKey = REDIS_KEYS.WEBAUTHN_CHALLENGE(challengeId)
		const challengeData = await this.rGetJSON<{
			userId: string
			challenge: string
			type: string
		}>(challengeKey)

		if (!challengeData || challengeData.type !== 'authentication') {
			throw new BadRequestException(
				this.i18n.t('auth.errors.2fa.invalid_challenge', {
					lng,
					defaultValue: 'Invalid or expired challenge',
				}),
			)
		}

		const credentialId = response.id
		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId },
			include: { user: true },
		})

		if (!method || !method.isActive) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.2fa.credential_not_found', {
					lng,
					defaultValue: 'Credential not found',
				}),
			)
		}

		const methodData = method.data as unknown as IWebAuthnMethodData

		let verification: VerifiedAuthenticationResponse
		try {
			// Create properly formatted credential for verification
			const credential = {
				id: method.credentialId,
				publicKey: Buffer.from(methodData.publicKey, 'base64url'),
				counter: methodData.counter,
				transports: methodData.transports as AuthenticatorTransportFuture[],
			}

			verification = await verifyAuthenticationResponse({
				response,
				expectedChallenge: challengeData.challenge,
				expectedOrigin: WEBAUTHN_RP.ORIGIN,
				expectedRPID: WEBAUTHN_RP.ID,
				credential,
			})
		} catch (error) {
			this.logger.error(`WebAuthn authentication verification failed: ${(error as Error).message}`)
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.authentication_failed', {
					lng,
					defaultValue: 'Authentication verification failed',
				}),
			)
		}

		if (!verification.verified) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.2fa.authentication_invalid', {
					lng,
					defaultValue: 'Invalid authentication response',
				}),
			)
		}

		const { authenticationInfo } = verification
		const { newCounter } = authenticationInfo

		methodData.counter = newCounter
		methodData.updatedAt = new Date().toISOString()

		await this.prisma.authenticationMethod.update({
			where: { id: method.id },
			data: {
				data: methodData as unknown as Prisma.JsonValue,
				lastUsedAt: new Date(),
				useCount: { increment: 1 },
			},
		})

		await this.securityEventService.logEvent({
			userId: method.userId,
			event:
				method.method === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_USED : ESecurityEvent.WEBAUTHN_VERIFIED,
			severity: ESecuritySeverity.LOW,
			metadata: {
				methodId: method.id,
				credentialId,
				timestamp: new Date().toISOString(),
			},
		})

		await this.rDel(challengeKey)

		this.logger.log(`WebAuthn authentication successful for user ${method.userId}`)

		return {
			success: true,
			userId: method.userId,
			credentialId,
			methodId: method.id,
		}
	}

	/**
	 * Get user's WebAuthn credentials
	 */
	async getUserCredentials(userId: string) {
		const methods = await this.prisma.authenticationMethod.findMany({
			where: {
				userId,
				method: { in: [E2FAMethod.WEBAUTHN, E2FAMethod.PASSKEY] },
				isActive: true,
			},
			orderBy: { createdAt: 'desc' },
		})

		return methods.map(method => {
			const data = method.data as unknown as IWebAuthnMethodData
			return {
				id: method.id,
				credentialId: method.credentialId,
				name: method.name,
				isPlatform: method.method === E2FAMethod.PASSKEY,
				isBackedUp: data.backedUp,
				transports: data.transports,
				lastUsedAt: method.lastUsedAt,
				useCount: method.useCount,
				createdAt: method.createdAt,
			}
		})
	}

	/**
	 * Remove WebAuthn credential
	 */
	async removeCredential(
		user: User,
		credentialId: string,
		password: string,
		lng: Language = 'en',
	): Promise<{ success: boolean }> {
		// Verify password
		const isPasswordValid = await HashUtil.verify(user.password, password)
		if (!isPasswordValid) {
			throw new UnauthorizedException(
				this.i18n.t('auth.errors.password.invalid', { lng, defaultValue: 'Invalid password' }),
			)
		}

		const method = await this.prisma.authenticationMethod.findUnique({
			where: { credentialId },
		})

		if (!method || method.userId !== user.id) {
			throw new NotFoundException(
				this.i18n.t('auth.errors.2fa.credential_not_found', {
					lng,
					defaultValue: 'Credential not found',
				}),
			)
		}

		// Delete credential and backup codes
		await this.prisma.$transaction(async tx => {
			await tx.authenticationMethod.delete({
				where: { id: method.id },
			})

			await tx.backupCode.deleteMany({
				where: { authMethodId: method.id },
			})

			// Check if this was the last method
			const remainingMethods = await tx.authenticationMethod.count({
				where: { userId: user.id, isActive: true },
			})

			if (remainingMethods === 0) {
				await tx.user.update({
					where: { id: user.id },
					data: {
						is2FAEnabled: false,
						preferred2FAMethod: null,
					},
				})
			}
		})

		// Log security event
		await this.securityEventService.logEvent({
			userId: user.id,
			event:
				method.method === E2FAMethod.PASSKEY ? ESecurityEvent.PASSKEY_DELETED : ESecurityEvent.WEBAUTHN_REMOVED,
			severity: ESecuritySeverity.MEDIUM,
			metadata: {
				methodId: method.id,
				credentialId,
				timestamp: new Date().toISOString(),
			},
		})

		this.logger.log(`WebAuthn credential ${credentialId} removed for user ${user.id}`)

		return { success: true }
	}

	// ==================== Private Helpers ====================

	private generateChallengeId(): string {
		return Buffer.from(
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
		).toString('base64url')
	}

	/**
	 * Detect platform from client data
	 */
	private detectPlatform(clientDataJSON: string): string {
		// Parse the base64url encoded clientDataJSON
		try {
			const decoded = Buffer.from(clientDataJSON, 'base64url').toString('utf-8')
			const data = JSON.parse(decoded)

			// Check origin or other fields to detect platform
			const origin = data.origin || ''

			// You can also check user agent if passed through context
			if (origin.includes('android')) return 'android'
			if (origin.includes('ios') || origin.includes('iphone') || origin.includes('ipad')) return 'ios'
			if (origin.includes('windows')) return 'windows'
			if (origin.includes('mac')) return 'macos'

			return 'unknown'
		} catch {
			return 'unknown'
		}
	}
}
```

**types**
`src/modules/auth/2fa/types/device.types.ts`

```typescript
import type { ISessionMetadata } from '@/shared/types'

/**
 * Device fingerprint components
 * Used to uniquely identify a device
 */
export interface IDeviceFingerprint {
	// Browser fingerprint
	userAgent: string
	language: string
	languages: string[]
	platform: string
	screenResolution: string
	availableScreenResolution: string
	colorDepth: number
	pixelRatio: number
	timezone: string
	timezoneOffset: number

	// Hardware
	hardwareConcurrency: number
	deviceMemory?: number
	maxTouchPoints: number

	// Canvas fingerprint
	canvasFingerprint?: string

	// WebGL fingerprint
	webglVendor?: string
	webglRenderer?: string

	// Audio fingerprint
	audioFingerprint?: string

	// Fonts
	installedFonts?: string[]

	// Plugins
	plugins?: string[]

	// Additional
	doNotTrack?: string
	cookieEnabled: boolean
	localStorage: boolean
	sessionStorage: boolean
	indexedDB: boolean
}

/**
 * Re-export session metadata from shared types
 * This is what we get from getSessionMetadata()
 */
export type { ISessionMetadata }

/**
 * Extended device metadata with fingerprint
 */
export interface IDeviceMetadata extends ISessionMetadata {
	/** Unique device ID generated from fingerprint */
	deviceId: string
	/** Full fingerprint data */
	fingerprint?: IDeviceFingerprint
}

/**
 * Device trust level
 */
export enum EDeviceTrustLevel {
	/** Unknown device, never seen before */
	UNKNOWN = 0,
	/** Seen before but not trusted */
	RECOGNIZED = 25,
	/** Partially trusted, some successful logins */
	PARTIAL = 50,
	/** Trusted device, many successful logins */
	TRUSTED = 75,
	/** Fully trusted, whitelisted device */
	VERIFIED = 100,
}

/**
 * Device trust score factors
 */
export interface IDeviceTrustFactors {
	/** Number of successful authentications */
	successfulLogins: number
	/** Number of failed attempts */
	failedAttempts: number
	/** Days since first seen */
	daysSinceFirstSeen: number
	/** Location consistency */
	locationConsistency: number
	/** Time pattern consistency */
	timePatternConsistency: number
	/** Is device explicitly trusted by user */
	explicitlyTrusted: boolean
}
```

`src/modules/auth/2fa/types/index.ts`

```typescript
export * from './method-data.types'
export * from './device.types'
export * from './risk.types'
export * from './security-event.types'

/**
 * Common response types
 */

export interface ISuccessResponse {
	success: true
	message?: string
}

export interface IErrorResponse {
	success: false
	error: string
	code?: string
}

export type TApiResponse<T = void> = T extends void
	? ISuccessResponse | IErrorResponse
	: (ISuccessResponse & { data: T }) | IErrorResponse

/**
 * Pagination
 */
export interface IPaginationParams {
	page: number
	limit: number
}

export interface IPaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	totalPages: number
}
```

`src/modules/auth/2fa/types/method-data.types.ts`

```typescript
import { E2FAMethod } from '@prisma/__generated__'

/**
 * Base interface for all 2FA method data
 * All method-specific data extends this
 */
export interface I2FAMethodDataBase {
	/** ISO timestamp of creation */
	createdAt: string
	/** ISO timestamp of last update */
	updatedAt: string
	/** Additional metadata */
	metadata?: Record<string, unknown>
}

/**
 * TOTP method data (Google Authenticator, Authy, etc.)
 */
export interface ITotpMethodData extends I2FAMethodDataBase {
	/** Encrypted TOTP secret (AES-256-GCM) */
	secret: string
	/** Hash algorithm: SHA1, SHA256, SHA512 */
	algorithm: 'SHA1' | 'SHA256' | 'SHA512'
	/** Number of digits in code (6 or 8) */
	digits: 6 | 8
	/** Time step in seconds (usually 30) */
	period: 30 | 60
	/** Issuer name (app name) */
	issuer: string
	/** Account name (usually email) */
	accountName: string
	/** QR code provisioning URI (optional, for re-provisioning) */
	provisioningUri?: string
}

/**
 * OTP Email method data
 */
export interface IOtpEmailMethodData extends I2FAMethodDataBase {
	/** Email address where codes are sent */
	email: string
	/** Timestamp of last code sent */
	lastSentAt?: string
	/** Number of codes sent in current window */
	sentCount: number
	/** Template ID for emails (if using template service) */
	templateId?: string
}

/**
 * OTP SMS method data
 */
export interface IOtpSmsMethodData extends I2FAMethodDataBase {
	/** Phone number in E.164 format */
	phone: string
	/** Timestamp of last code sent */
	lastSentAt?: string
	/** Number of codes sent in current window */
	sentCount: number
	/** SMS provider used (twilio, vonage, etc.) */
	provider?: string
}

/**
 * WebAuthn hardware key data (YubiKey, Titan Key)
 */
export interface IWebAuthnMethodData extends I2FAMethodDataBase {
	/** Public key (base64url encoded) */
	publicKey: string
	/** Signature counter for replay protection */
	counter: number
	/** Credential ID (base64url encoded) */
	credentialId: string
	/** Supported transports: usb, nfc, ble, internal */
	transports: ('usb' | 'nfc' | 'ble' | 'internal')[]
	/** AAGUID (Authenticator Attestation GUID) */
	aaguid?: string
	/** Attestation format (none, packed, fido-u2f, etc.) */
	attestationFormat?: string
	/** Whether authenticator supports user verification */
	userVerified: boolean
	/** Backup eligibility (can be backed up to cloud) */
	backupEligible: boolean
	/** Currently backed up to cloud */
	backedUp: boolean
}

/**
 * Passkey data (TouchID, FaceID, Windows Hello)
 * Similar to WebAuthn but with sync capabilities
 */
export interface IPasskeyMethodData extends I2FAMethodDataBase {
	/** Public key (base64url encoded) */
	publicKey: string
	/** Signature counter for replay protection */
	counter: number
	/** Credential ID (base64url encoded) */
	credentialId: string
	/** Supported transports */
	transports: ('usb' | 'nfc' | 'ble' | 'internal' | 'hybrid')[]
	/** AAGUID */
	aaguid?: string
	/** Whether passkey is synced across devices */
	isSynced: boolean
	/** Platform: ios, android, windows, macos */
	platform?: string
	/** User verification method: fingerprint, face, pin */
	uvMethod?: 'fingerprint' | 'face' | 'pin' | 'pattern'
	/** Backup eligibility */
	backupEligible: boolean
	/** Currently backed up */
	backedUp: boolean
}

/**
 * Backup code method data
 */
export interface IBackupCodeMethodData extends I2FAMethodDataBase {
	/** Total number of codes generated */
	totalCodes: number
	/** Number of codes already used */
	usedCodes: number
	/** Remaining codes */
	remainingCodes: number
	/** Format: HEX, BASE32, NUMERIC */
	format: 'HEX' | 'BASE32' | 'NUMERIC'
	/** Code length */
	codeLength: number
}

/**
 * Discriminated union of all method data types
 * Provides type safety when working with different methods
 */
export type T2FAMethodData =
	| { method: typeof E2FAMethod.TOTP; data: ITotpMethodData }
	| { method: typeof E2FAMethod.OTP_EMAIL; data: IOtpEmailMethodData }
	| { method: typeof E2FAMethod.OTP_SMS; data: IOtpSmsMethodData }
	| { method: typeof E2FAMethod.WEBAUTHN; data: IWebAuthnMethodData }
	| { method: typeof E2FAMethod.PASSKEY; data: IPasskeyMethodData }
	| { method: typeof E2FAMethod.BACKUP_CODE; data: IBackupCodeMethodData }

/**
 * Helper type to extract data type for specific method
 */
export type TMethodDataForType<T extends E2FAMethod> = Extract<T2FAMethodData, { method: T }>['data']

/**
 * Method setup input for API
 */
export interface I2FAMethodSetupInput {
	method: E2FAMethod
	name?: string
	isPrimary?: boolean
	data: Record<string, unknown>
}

/**
 * Method verification input
 */
export interface I2FAMethodVerifyInput {
	methodId: string
	code: string
	trustDevice?: boolean
}
```

`src/modules/auth/2fa/types/risk.types.ts`

```typescript
import type { ISessionMetadata } from '@/shared/types'

/**
 * Risk level categories
 */
export enum ERiskLevel {
	/** Very low risk, trusted pattern */
	VERY_LOW = 'VERY_LOW',
	/** Low risk, normal behavior */
	LOW = 'LOW',
	/** Medium risk, some anomalies */
	MEDIUM = 'MEDIUM',
	/** High risk, suspicious activity */
	HIGH = 'HIGH',
	/** Critical risk, likely attack */
	CRITICAL = 'CRITICAL',
}

/**
 * Individual risk factor
 */
export interface IRiskFactor {
	/** Factor name */
	name: string
	/** Risk score contribution (0-100) */
	score: number
	/** Factor weight in final calculation */
	weight: number
	/** Human-readable description */
	description: string
	/** Evidence/details */
	details?: Record<string, unknown>
}

/**
 * Complete risk assessment result
 */
export interface IRiskAssessment {
	/** Overall risk score (0-100) */
	score: number
	/** Risk level category */
	level: ERiskLevel
	/** Individual risk factors */
	factors: IRiskFactor[]
	/** Recommended actions */
	recommendations: string[]
	/** Whether to require 2FA */
	require2FA: boolean
	/** Whether to block access */
	blockAccess: boolean
	/** Assessment timestamp */
	assessedAt: Date
}

/**
 * Anomaly detection result
 */
export interface IAnomaly {
	type: 'location' | 'time' | 'device' | 'behavior' | 'velocity'
	severity: 'low' | 'medium' | 'high' | 'critical'
	description: string
	score: number
	details: Record<string, unknown>
}

/**
 * Re-export session metadata for convenience
 */
export type { ISessionMetadata }
```

`src/modules/auth/2fa/types/security-event.types.ts`

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

**utils**
`src/modules/auth/2fa/utils/encryption.util.ts`

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

/**
 * Encryption utility for 2FA sensitive data
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionUtil {
	private static readonly ALGORITHM = 'aes-256-gcm'
	private static readonly IV_LENGTH = 16
	private static readonly AUTH_TAG_LENGTH = 16
	private static readonly KEY_LENGTH = 32

	/**
	 * Get encryption key from environment
	 * @throws Error if key is not configured
	 */
	private static getKey(): Buffer {
		const key = process.env.TWO_FA_ENCRYPTION_KEY

		if (!key) {
			throw new Error('TWO_FA_ENCRYPTION_KEY is not defined in environment')
		}

		// Expect hex-encoded 256-bit key (64 characters)
		if (key.length !== 64) {
			throw new Error('TWO_FA_ENCRYPTION_KEY must be 64 hex characters (256 bits)')
		}

		return Buffer.from(key, 'hex')
	}

	/**
	 * Encrypt plaintext using AES-256-GCM
	 * @param plaintext Data to encrypt
	 * @returns Encrypted string in format: iv:authTag:ciphertext (all hex-encoded)
	 */
	static encrypt(plaintext: string): string {
		try {
			const key = this.getKey()
			const iv = randomBytes(this.IV_LENGTH)

			const cipher = createCipheriv(this.ALGORITHM, key, iv)

			let encrypted = cipher.update(plaintext, 'utf8', 'hex')
			encrypted += cipher.final('hex')

			const authTag = cipher.getAuthTag()

			// Format: iv:authTag:ciphertext
			return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
		} catch (error) {
			throw new Error(`Encryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Decrypt ciphertext using AES-256-GCM
	 * @param encryptedData Encrypted string in format iv:authTag:ciphertext
	 * @returns Decrypted plaintext
	 */
	static decrypt(encryptedData: string): string {
		try {
			const key = this.getKey()
			const parts = encryptedData.split(':')

			if (parts.length !== 3) {
				throw new Error('Invalid encrypted data format')
			}

			const [ivHex, authTagHex, ciphertextHex] = parts

			const iv = Buffer.from(ivHex, 'hex')
			const authTag = Buffer.from(authTagHex, 'hex')
			const ciphertext = Buffer.from(ciphertextHex, 'hex')

			const decipher = createDecipheriv(this.ALGORITHM, key, iv)
			decipher.setAuthTag(authTag)

			let decrypted = decipher.update(ciphertext)
			decrypted = Buffer.concat([decrypted, decipher.final()])

			return decrypted.toString('utf8')
		} catch (error) {
			throw new Error(`Decryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Encrypt JSON object
	 * @param data Object to encrypt
	 * @returns Encrypted string
	 */
	static encryptJSON<T>(data: T): string {
		return this.encrypt(JSON.stringify(data))
	}

	/**
	 * Decrypt to JSON object
	 * @param encryptedData Encrypted string
	 * @returns Decrypted object
	 */
	static decryptJSON<T>(encryptedData: string): T {
		const decrypted = this.decrypt(encryptedData)
		return JSON.parse(decrypted) as T
	}

	/**
	 * Generate a new encryption key (for initial setup)
	 * @returns Hex-encoded 256-bit key
	 */
	static generateKey(): string {
		return randomBytes(this.KEY_LENGTH).toString('hex')
	}
}
```

`src/modules/auth/2fa/utils/fingerprint.util.ts`

```typescript
import { createHash } from 'node:crypto'

import type { IDeviceFingerprint, IDeviceMetadata } from '../types'

/**
 * Device fingerprinting utility
 * Generates unique device identifiers based on browser/system characteristics
 */
export class FingerprintUtil {
	/**
	 * Generate device ID from fingerprint components
	 * Uses SHA-256 hash of normalized fingerprint data
	 * @param fingerprint Device fingerprint data
	 * @returns Hex-encoded device ID (64 characters)
	 */
	static generateDeviceId(fingerprint: IDeviceFingerprint): string {
		const normalized = this.normalizeFingerprint(fingerprint)
		const data = JSON.stringify(normalized)

		return createHash('sha256').update(data).digest('hex')
	}

	/**
	 * Generate device ID from user agent only (quick method)
	 * Less unique but faster, useful for basic device tracking
	 * @param userAgent User-Agent string
	 * @param ip Optional IP address for additional entropy
	 * @returns Hex-encoded device ID
	 */
	static generateQuickDeviceId(userAgent: string, ip?: string): string {
		const data = ip ? `${userAgent}:${ip}` : userAgent

		return createHash('sha256').update(data).digest('hex')
	}

	/**
	 * Normalize fingerprint data for consistent hashing
	 * Sorts keys and removes volatile fields
	 * @param fingerprint Raw fingerprint data
	 * @returns Normalized fingerprint
	 */
	private static normalizeFingerprint(fingerprint: IDeviceFingerprint): Partial<IDeviceFingerprint> {
		// Remove highly volatile fields that change frequently
		const {
			// Remove timezone offset (changes with DST)
			timezoneOffset,
			// Keep stable fields only
			...stable
		} = fingerprint

		// Sort object keys for consistent stringification
		const sorted = Object.keys(stable)
			.sort()
			.reduce(
				(acc, key) => {
					acc[key] = stable[key as keyof typeof stable]
					return acc
				},
				{} as Record<string, unknown>,
			)

		return sorted as Partial<IDeviceFingerprint>
	}

	/**
	 * Calculate similarity between two fingerprints (0-1)
	 * Used to detect if a device has slightly changed (browser update, etc.)
	 * @param fp1 First fingerprint
	 * @param fp2 Second fingerprint
	 * @returns Similarity score (0 = completely different, 1 = identical)
	 */
	static calculateSimilarity(fp1: IDeviceFingerprint, fp2: IDeviceFingerprint): number {
		const keys = new Set([...Object.keys(fp1), ...Object.keys(fp2)])

		let matches = 0
		let total = 0

		for (const key of keys) {
			total++
			const val1 = fp1[key as keyof IDeviceFingerprint]
			const val2 = fp2[key as keyof IDeviceFingerprint]

			if (val1 === val2) {
				matches++
			} else if (typeof val1 === 'string' && typeof val2 === 'string') {
				// Partial match for strings (e.g., browser version change)
				const similarity = this.stringSimilarity(val1, val2)
				matches += similarity
			}
		}

		return total > 0 ? matches / total : 0
	}

	/**
	 * Compare two device metadata objects
	 * Uses session metadata for comparison (browser, OS, device type)
	 * @param device1 First device metadata
	 * @param device2 Second device metadata
	 * @returns Similarity score (0-1)
	 */
	static compareDevices(device1: IDeviceMetadata, device2: IDeviceMetadata): number {
		let score = 0
		let maxScore = 0

		// Compare browser
		maxScore += 30
		if (device1.device.browser === device2.device.browser) {
			score += 30
		}

		// Compare OS
		maxScore += 30
		if (device1.device.os === device2.device.os) {
			score += 30
		}

		// Compare device type
		maxScore += 20
		if (device1.device.type === device2.device.type) {
			score += 20
		}

		// Compare country
		maxScore += 10
		if (device1.location.country === device2.location.country) {
			score += 10
		}

		// Compare city
		maxScore += 10
		if (device1.location.city === device2.location.city) {
			score += 10
		}

		return maxScore > 0 ? score / maxScore : 0
	}

	/**
	 * Calculate similarity between two strings using Levenshtein distance
	 * @param str1 First string
	 * @param str2 Second string
	 * @returns Similarity score (0-1)
	 */
	private static stringSimilarity(str1: string, str2: string): number {
		const longer = str1.length > str2.length ? str1 : str2
		const shorter = str1.length > str2.length ? str2 : str1

		if (longer.length === 0) {
			return 1.0
		}

		const editDistance = this.levenshteinDistance(longer, shorter)
		return (longer.length - editDistance) / longer.length
	}

	/**
	 * Levenshtein distance algorithm
	 * @param str1 First string
	 * @param str2 Second string
	 * @returns Edit distance
	 */
	private static levenshteinDistance(str1: string, str2: string): number {
		const matrix: number[][] = []

		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i]
		}

		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j
		}

		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1]
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1, // substitution
						matrix[i][j - 1] + 1, // insertion
						matrix[i - 1][j] + 1, // deletion
					)
				}
			}
		}

		return matrix[str2.length][str1.length]
	}

	/**
	 * Validate fingerprint has minimum required components
	 * @param fingerprint Fingerprint to validate
	 * @returns Whether fingerprint is valid
	 */
	static isValidFingerprint(fingerprint: IDeviceFingerprint): boolean {
		const requiredFields: (keyof IDeviceFingerprint)[] = ['userAgent', 'platform', 'screenResolution', 'timezone']

		return requiredFields.every(
			field => fingerprint[field] !== undefined && fingerprint[field] !== null && fingerprint[field] !== '',
		)
	}

	/**
	 * Create minimal fingerprint from user agent only
	 * Useful when full fingerprint is not available
	 * @param userAgent User-Agent string
	 * @returns Minimal fingerprint object
	 */
	static createMinimalFingerprint(userAgent: string): Partial<IDeviceFingerprint> {
		return {
			userAgent,
			platform: 'unknown',
			language: 'unknown',
			languages: [],
			screenResolution: 'unknown',
			availableScreenResolution: 'unknown',
			colorDepth: 0,
			pixelRatio: 1,
			timezone: 'unknown',
			timezoneOffset: 0,
			hardwareConcurrency: 0,
			maxTouchPoints: 0,
			cookieEnabled: true,
			localStorage: true,
			sessionStorage: true,
			indexedDB: true,
		}
	}
}
```

`src/modules/auth/2fa/utils/index.ts`

```typescript
export * from './encryption.util'
export * from './fingerprint.util'
export * from './risk-calculator.util'
```

`src/modules/auth/2fa/utils/risk-calculator.util.ts`

```typescript
import { differenceInHours } from 'date-fns'

import type { ISessionMetadata } from '@/shared/types'

import { HIGH_RISK_INDICATORS, RISK_THRESHOLDS, RISK_WEIGHTS, VELOCITY_CONFIG } from '../constants'
import type { IAnomaly, IRiskAssessment, IRiskFactor } from '../types'
import { ERiskLevel } from '../types'

/**
 * Risk context for assessment
 * Extended version of ISessionMetadata with additional context
 */
export interface IRiskContext {
	// Current session
	session: ISessionMetadata

	// User context
	userId: string
	userRiskScore?: number
	accountAge: number // days

	// Device context
	isNewDevice: boolean
	deviceTrustScore: number
	failedAttemptsRecent: number

	// Historical data
	previousLocations: Array<{
		country: string
		city: string
		latitude: number
		longitude: number
		timestamp: Date
	}>

	// Time context
	loginTime: Date
	userTimezone?: string

	// Behavioral patterns (optional)
	typicalLoginHours?: number[]
	typicalLoginDays?: number[]
}

/**
 * Risk assessment and scoring utility
 * Calculates risk scores based on multiple factors
 */
export class RiskCalculatorUtil {
	/**
	 * Perform complete risk assessment
	 * @param context Assessment context
	 * @returns Complete risk assessment with score, level, and recommendations
	 */
	static assess(context: IRiskContext): IRiskAssessment {
		const factors = this.calculateFactors(context)
		const score = this.calculateScore(factors)
		const level = this.getRiskLevel(score)
		const anomalies = this.detectAnomalies(context)
		const recommendations = this.generateRecommendations(level, anomalies)

		return {
			score,
			level,
			factors,
			recommendations,
			require2FA: score >= RISK_THRESHOLDS[ERiskLevel.MEDIUM].min,
			blockAccess: level === ERiskLevel.CRITICAL,
			assessedAt: new Date(),
		}
	}

	/**
	 * Calculate individual risk factors
	 * @param context Assessment context
	 * @returns Array of risk factors
	 */
	private static calculateFactors(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Location-based risks
		factors.push(...this.assessLocationRisk(context))

		// Device-based risks
		factors.push(...this.assessDeviceRisk(context))

		// Behavioral risks
		factors.push(...this.assessBehavioralRisk(context))

		// Account age risks
		factors.push(...this.assessAccountRisk(context))

		// Authentication history risks
		factors.push(...this.assessAuthenticationRisk(context))

		return factors.filter(f => f.score > 0)
	}

	/**
	 * Assess location-based risks
	 */
	private static assessLocationRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []
		const currentCountry = context.session.location.country

		// Check high-risk country
		if (
			HIGH_RISK_INDICATORS.HIGH_RISK_COUNTRIES.includes(
				currentCountry as (typeof HIGH_RISK_INDICATORS.HIGH_RISK_COUNTRIES)[number],
			)
		) {
			factors.push({
				name: 'high_risk_country',
				score: RISK_WEIGHTS.HIGH_RISK_COUNTRY,
				weight: 1.0,
				description: 'Login from high-risk country',
				details: { country: currentCountry },
			})
		}

		// Check new country
		const isNewCountry = !context.previousLocations.some(loc => loc.country === currentCountry)
		if (isNewCountry && context.previousLocations.length > 0) {
			factors.push({
				name: 'new_country',
				score: RISK_WEIGHTS.NEW_COUNTRY,
				weight: 0.8,
				description: 'First login from this country',
				details: { country: currentCountry },
			})
		}

		// Check new city
		const currentCity = context.session.location.city
		const isNewCity = !context.previousLocations.some(loc => loc.city === currentCity)
		if (isNewCity && context.previousLocations.length > 0 && !isNewCountry) {
			factors.push({
				name: 'new_city',
				score: RISK_WEIGHTS.NEW_CITY,
				weight: 0.6,
				description: 'First login from this city',
				details: { city: currentCity },
			})
		}

		// Check impossible travel
		const impossibleTravel = this.detectImpossibleTravel(context)
		if (impossibleTravel) {
			factors.push({
				name: 'impossible_travel',
				score: RISK_WEIGHTS.IMPOSSIBLE_TRAVEL,
				weight: 1.2,
				description: 'Impossible travel detected',
				details: impossibleTravel,
			})
		}

		return factors
	}

	/**
	 * Detect impossible travel (too fast between locations)
	 */
	private static detectImpossibleTravel(context: IRiskContext): Record<string, unknown> | null {
		if (context.previousLocations.length === 0) return null

		const lastLocation = context.previousLocations[0]

		// Note: Using latitude/longitude from ISessionMetadata (with typo)
		const currentLat: number = context.session.location.latitude
		const currentLon: number = context.session.location.longitude

		if (!lastLocation.latitude || !lastLocation.longitude || !currentLat || !currentLon) {
			return null
		}

		const distance = this.calculateDistance(lastLocation.latitude, lastLocation.longitude, currentLat, currentLon)

		const timeDiff = differenceInHours(context.loginTime, lastLocation.timestamp)

		if (timeDiff <= 0) return null

		const speed = distance / timeDiff

		if (speed > VELOCITY_CONFIG.MAX_TRAVEL_SPEED_KMH) {
			return {
				distance,
				timeDiff,
				speed,
				maxSpeed: VELOCITY_CONFIG.MAX_TRAVEL_SPEED_KMH,
				from: `${lastLocation.city}, ${lastLocation.country}`,
				to: `${context.session.location.city}, ${context.session.location.country}`,
			}
		}

		return null
	}

	/**
	 * Calculate distance between two coordinates using Haversine formula
	 * @returns Distance in kilometers
	 */
	private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371 // Earth's radius in km
		const dLat = this.toRad(lat2 - lat1)
		const dLon = this.toRad(lon2 - lon1)

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		return R * c
	}

	private static toRad(degrees: number): number {
		return degrees * (Math.PI / 180)
	}

	/**
	 * Assess device-based risks
	 */
	private static assessDeviceRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// New device
		if (context.isNewDevice) {
			factors.push({
				name: 'new_device',
				score: RISK_WEIGHTS.NEW_DEVICE,
				weight: 0.9,
				description: 'First login from this device',
			})
		}

		// Untrusted device
		if (context.deviceTrustScore < 50) {
			factors.push({
				name: 'untrusted_device',
				score: RISK_WEIGHTS.UNTRUSTED_DEVICE,
				weight: 1.0,
				description: 'Device has low trust score',
				details: { trustScore: context.deviceTrustScore },
			})
		}

		return factors
	}

	/**
	 * Assess behavioral risks
	 */
	private static assessBehavioralRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Check suspicious user agent
		// Note: device.browser and device.os come from device-detector-js
		const deviceInfo = `${context.session.device.browser} ${context.session.device.os}`.toLowerCase()
		const isSuspicious = HIGH_RISK_INDICATORS.SUSPICIOUS_UA_PATTERNS.some(pattern => pattern.test(deviceInfo))
		if (isSuspicious) {
			factors.push({
				name: 'suspicious_user_agent',
				score: RISK_WEIGHTS.SUSPICIOUS_USER_AGENT,
				weight: 1.1,
				description: 'Suspicious user agent detected',
				details: {
					browser: context.session.device.browser,
					os: context.session.device.os,
				},
			})
		}

		// Check unusual time
		if (context.typicalLoginHours) {
			const hour = context.loginTime.getHours()
			if (!context.typicalLoginHours.includes(hour)) {
				factors.push({
					name: 'unusual_time',
					score: RISK_WEIGHTS.UNUSUAL_TIME,
					weight: 0.5,
					description: 'Login at unusual time',
					details: { hour, typical: context.typicalLoginHours },
				})
			}
		}

		// Check unusual day
		if (context.typicalLoginDays) {
			const day = context.loginTime.getDay()
			if (!context.typicalLoginDays.includes(day)) {
				factors.push({
					name: 'unusual_day',
					score: RISK_WEIGHTS.UNUSUAL_DAY,
					weight: 0.3,
					description: 'Login on unusual day',
					details: { day, typical: context.typicalLoginDays },
				})
			}
		}

		return factors
	}

	/**
	 * Assess account-related risks
	 */
	private static assessAccountRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// New account
		if (context.accountAge < 7) {
			factors.push({
				name: 'new_account',
				score: RISK_WEIGHTS.NEW_ACCOUNT,
				weight: 0.7,
				description: 'Account is less than 7 days old',
				details: { age: context.accountAge },
			})
		} else if (context.accountAge < 30) {
			factors.push({
				name: 'young_account',
				score: RISK_WEIGHTS.YOUNG_ACCOUNT,
				weight: 0.4,
				description: 'Account is less than 30 days old',
				details: { age: context.accountAge },
			})
		}

		return factors
	}

	/**
	 * Assess authentication history risks
	 */
	private static assessAuthenticationRisk(context: IRiskContext): IRiskFactor[] {
		const factors: IRiskFactor[] = []

		// Multiple failed attempts
		if (context.failedAttemptsRecent > 0) {
			const score = Math.min(RISK_WEIGHTS.MULTIPLE_FAILED_ATTEMPTS, context.failedAttemptsRecent * 10)
			factors.push({
				name: 'failed_attempts',
				score,
				weight: 1.0,
				description: 'Recent failed login attempts',
				details: { attempts: context.failedAttemptsRecent },
			})
		}

		return factors
	}

	/**
	 * Calculate final risk score from factors
	 */
	private static calculateScore(factors: IRiskFactor[]): number {
		if (factors.length === 0) return 0

		const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0)
		const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0)

		const score = totalWeight > 0 ? weightedScore / totalWeight : 0

		// Clamp to 0-100
		return Math.max(0, Math.min(100, Math.round(score)))
	}

	/**
	 * Get risk level from score
	 */
	private static getRiskLevel(score: number): ERiskLevel {
		for (const [level, range] of Object.entries(RISK_THRESHOLDS)) {
			if (score >= range.min && score <= range.max) {
				return level as ERiskLevel
			}
		}
		return ERiskLevel.LOW
	}

	/**
	 * Detect specific anomalies
	 */
	private static detectAnomalies(context: IRiskContext): IAnomaly[] {
		const anomalies: IAnomaly[] = []

		const impossibleTravel = this.detectImpossibleTravel(context)
		if (impossibleTravel) {
			anomalies.push({
				type: 'velocity',
				severity: 'critical',
				description: 'Impossible travel detected',
				score: RISK_WEIGHTS.IMPOSSIBLE_TRAVEL,
				details: impossibleTravel,
			})
		}

		return anomalies
	}

	/**
	 * Generate recommendations based on risk level
	 */
	private static generateRecommendations(level: ERiskLevel, anomalies: IAnomaly[]): string[] {
		const recommendations: string[] = []

		switch (level) {
			case ERiskLevel.CRITICAL:
				recommendations.push('Block access immediately')
				recommendations.push('Notify user of suspicious activity')
				recommendations.push('Require password reset')
				recommendations.push('Invalidate all sessions')
				break
			case ERiskLevel.HIGH:
				recommendations.push('Require 2FA verification')
				recommendations.push('Send security alert to user')
				recommendations.push('Log detailed audit trail')
				break
			case ERiskLevel.MEDIUM:
				recommendations.push('Require 2FA verification')
				recommendations.push('Monitor closely')
				break
			case ERiskLevel.LOW:
				recommendations.push('Log for analytics')
				break
			case ERiskLevel.VERY_LOW:
				// No action needed
				break
		}

		if (anomalies.length > 0) {
			recommendations.push(`Investigate ${anomalies.length} detected anomalies`)
		}

		return recommendations
	}
}
```
