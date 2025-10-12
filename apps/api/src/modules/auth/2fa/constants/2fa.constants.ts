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
	PHONE_E164: /^\+[1-9]\d{1,14}$/,
	DEVICE_ID: /^[a-f0-9]{64}$/,
} as const
