# File: modules\auth\2fa\types\method-data.types.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/types/method-data.types.ts`

## Category
Backend

## File Type
TS (method-data.types.ts)

## Size
4865 characters, 167 lines

## Full Code

```typescript
import { E2FAMethod } from '@prisma/__generated__'

/**
 * Base interface for all 2FA method data
 * All method-specific data extends this
 */
export interface I2FAMethodDataBase {
	[key: string]: unknown
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

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.209Z*
