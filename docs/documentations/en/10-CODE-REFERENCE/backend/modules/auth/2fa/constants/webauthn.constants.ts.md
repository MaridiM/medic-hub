# File: modules\auth\2fa\constants\webauthn.constants.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/constants/webauthn.constants.ts`

## Category
Backend

## File Type
TS (webauthn.constants.ts)

## Size
2571 characters, 98 lines

## Full Code

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

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.123Z*
