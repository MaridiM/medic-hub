# File: modules\auth\2fa\dtos\verify-2fa.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/dtos/verify-2fa.dto.ts`

## Category
Backend

## File Type
TS (verify-2fa.dto.ts)

## Size
1293 characters, 48 lines

## Full Code

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

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.136Z*
