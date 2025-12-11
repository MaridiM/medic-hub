# File: modules\auth\2fa\utils\validation.util.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/utils/validation.util.ts`

## Category
Backend

## File Type
TS (validation.util.ts)

## Size
2583 characters, 89 lines

## Full Code

```typescript
import type { I2FAMethodDataBase, IOtpEmailMethodData, IOtpSmsMethodData, ITotpMethodData } from '../types'

/**
 * Type guard for base 2FA method data.
 * Checks common fields present in all method types.
 */
function isMethodDataBase(data: unknown): data is I2FAMethodDataBase {
	if (typeof data !== 'object' || data === null) return false

	const obj = data as Record<string, unknown>

	return typeof obj.createdAt === 'string' && typeof obj.updatedAt === 'string'
}

/**
 * Type guard for TOTP method data.
 * Validates complete TOTP configuration structure.
 */
export function isTotpMethodData(data: unknown): data is ITotpMethodData {
	if (!isMethodDataBase(data)) return false

	const obj = data as Record<string, unknown>

	return (
		typeof obj.secret === 'string' &&
		obj.secret.length > 0 &&
		(obj.algorithm === 'SHA1' || obj.algorithm === 'SHA256' || obj.algorithm === 'SHA512') &&
		(obj.digits === 6 || obj.digits === 8) &&
		(obj.period === 30 || obj.period === 60) &&
		typeof obj.issuer === 'string' &&
		typeof obj.accountName === 'string'
	)
}

/**
 * Type guard for OTP Email method data.
 * Validates email-based OTP configuration.
 */
export function isOtpEmailMethodData(data: unknown): data is IOtpEmailMethodData {
	if (!isMethodDataBase(data)) return false

	const obj = data as Record<string, unknown>

	return (
		typeof obj.email === 'string' &&
		obj.email.includes('@') && // Basic email validation
		typeof obj.sentCount === 'number' &&
		obj.sentCount >= 0
	)
}

/**
 * Type guard for OTP SMS method data.
 * Validates SMS-based OTP configuration.
 */
export function isOtpSmsMethodData(data: unknown): data is IOtpSmsMethodData {
	if (!isMethodDataBase(data)) return false

	const obj = data as Record<string, unknown>

	return (
		typeof obj.phone === 'string' &&
		obj.phone.startsWith('+') && // E.164 format starts with +
		obj.phone.length >= 10 && // Minimum valid phone length
		typeof obj.sentCount === 'number' &&
		obj.sentCount >= 0
	)
}

/**
 * Validates decrypted method data based on expected type.
 *
 * @param data - Decrypted data to validate
 * @param methodType - Expected 2FA method type
 * @returns True if data matches expected structure
 */
export function validateMethodData(data: unknown, methodType: string): boolean {
	switch (methodType) {
		case 'TOTP':
			return isTotpMethodData(data)
		case 'OTP_EMAIL':
			return isOtpEmailMethodData(data)
		case 'OTP_SMS':
			return isOtpSmsMethodData(data)
		default:
			return false
	}
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.239Z*
