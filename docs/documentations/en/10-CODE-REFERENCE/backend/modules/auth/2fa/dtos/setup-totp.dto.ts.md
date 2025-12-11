# File: modules\auth\2fa\dtos\setup-totp.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/dtos/setup-totp.dto.ts`

## Category
Backend

## File Type
TS (setup-totp.dto.ts)

## Size
1227 characters, 42 lines

## Full Code

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

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.133Z*
