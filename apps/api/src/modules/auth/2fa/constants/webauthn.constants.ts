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

	/** Require resident key (for passwordless): 'required', 'preferred', 'discouraged' */
	RESIDENT_KEY: 'preferred' as ResidentKeyRequirement,

	/** User verification: 'required', 'preferred', 'discouraged' */
	USER_VERIFICATION: 'preferred' as UserVerificationRequirement,
} as const

// ===== ATTESTATION =====

export const ATTESTATION_CONFIG = {
	/** Attestation conveyance: 'none', 'indirect', 'direct', 'enterprise' */
	CONVEYANCE: 'none' as AttestationConveyancePreference,

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

// ===== ALLOWED TRANSPORTS =====

export const ALLOWED_TRANSPORTS = {
	REGISTRATION: ['usb', 'nfc', 'ble', 'internal', 'hybrid'] as AuthenticatorTransport[],
	AUTHENTICATION: ['usb', 'nfc', 'ble', 'internal', 'hybrid'] as AuthenticatorTransport[],
} as const

// ===== PASSKEY SPECIFIC =====

export const PASSKEY_CONFIG = {
	/** Enable passkey sync (iCloud Keychain, Google Password Manager) */
	ALLOW_SYNC: true,

	/** Backup eligibility */
	BACKUP_ELIGIBLE: true,

	/** Prefer platform authenticators (Touch ID, Face ID, Windows Hello) */
	PREFER_PLATFORM: true,
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

// ===== REDIS KEYS =====

export const WEBAUTHN_REDIS_KEYS = {
	CHALLENGE: (userId: string) => `webauthn:challenge:${userId}`,
	REGISTRATION: (userId: string) => `webauthn:registration:${userId}`,
	AUTHENTICATION: (userId: string) => `webauthn:authentication:${userId}`,
} as const

// ===== ERROR MESSAGES =====

export const WEBAUTHN_ERRORS = {
	CHALLENGE_EXPIRED: 'webauthn.challenge_expired',
	INVALID_SIGNATURE: 'webauthn.invalid_signature',
	COUNTER_MISMATCH: 'webauthn.counter_mismatch',
	CREDENTIAL_NOT_FOUND: 'webauthn.credential_not_found',
	ATTESTATION_FAILED: 'webauthn.attestation_failed',
	USER_VERIFICATION_FAILED: 'webauthn.user_verification_failed',
	UNSUPPORTED_ALGORITHM: 'webauthn.unsupported_algorithm',
} as const
