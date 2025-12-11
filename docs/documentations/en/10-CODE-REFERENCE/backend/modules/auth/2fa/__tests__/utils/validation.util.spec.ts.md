# File: modules\auth\2fa\__tests__\utils\validation.util.spec.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/__tests__/utils/validation.util.spec.ts`

## Category
Backend

## File Type
TS (validation.util.spec.ts)

## Size
4036 characters, 143 lines

## Full Code

```typescript
import { isOtpEmailMethodData, isOtpSmsMethodData, isTotpMethodData, validateMethodData } from '../../utils'

describe('ValidationUtil', () => {
	describe('isTotpMethodData', () => {
		it('should return true for valid TOTP data', () => {
			const validData = {
				secret: 'JBSWY3DPEHPK3PXP',
				algorithm: 'SHA1' as const,
				digits: 6 as const,
				period: 30 as const,
				issuer: 'TestApp',
				accountName: 'test@example.com',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isTotpMethodData(validData)).toBe(true)
		})

		it('should return false for TOTP data with missing secret', () => {
			const invalidData = {
				algorithm: 'SHA1',
				digits: 6,
				period: 30,
				issuer: 'TestApp',
				accountName: 'test@example.com',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isTotpMethodData(invalidData)).toBe(false)
		})

		it('should return false for TOTP data with invalid algorithm', () => {
			const invalidData = {
				secret: 'JBSWY3DPEHPK3PXP',
				algorithm: 'MD5', // ❌ Invalid
				digits: 6,
				period: 30,
				issuer: 'TestApp',
				accountName: 'test@example.com',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isTotpMethodData(invalidData)).toBe(false)
		})
	})

	describe('isOtpEmailMethodData', () => {
		it('should return true for valid OTP Email data', () => {
			const validData = {
				email: 'test@example.com',
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isOtpEmailMethodData(validData)).toBe(true)
		})

		it('should return false for invalid email', () => {
			const invalidData = {
				email: 'not-an-email', // ❌ Missing @
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isOtpEmailMethodData(invalidData)).toBe(false)
		})

		it('should return false for negative sentCount', () => {
			const invalidData = {
				email: 'test@example.com',
				sentCount: -5, // ❌ Negative
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isOtpEmailMethodData(invalidData)).toBe(false)
		})
	})

	describe('isOtpSmsMethodData', () => {
		it('should return true for valid OTP SMS data', () => {
			const validData = {
				phone: '+1234567890',
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isOtpSmsMethodData(validData)).toBe(true)
		})

		it('should return false for phone not in E.164 format', () => {
			const invalidData = {
				phone: '1234567890', // ❌ Missing +
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isOtpSmsMethodData(invalidData)).toBe(false)
		})

		it('should return false for too short phone number', () => {
			const invalidData = {
				phone: '+123', // ❌ Too short
				sentCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(isOtpSmsMethodData(invalidData)).toBe(false)
		})
	})

	describe('validateMethodData', () => {
		it('should validate TOTP data correctly', () => {
			const totpData = {
				secret: 'JBSWY3DPEHPK3PXP',
				algorithm: 'SHA1' as const,
				digits: 6 as const,
				period: 30 as const,
				issuer: 'TestApp',
				accountName: 'test@example.com',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			expect(validateMethodData(totpData, 'TOTP')).toBe(true)
			expect(validateMethodData(totpData, 'OTP_EMAIL')).toBe(false)
		})

		it('should return false for unknown method type', () => {
			const data = { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
			expect(validateMethodData(data, 'UNKNOWN_METHOD')).toBe(false)
		})
	})
})

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.254Z*
