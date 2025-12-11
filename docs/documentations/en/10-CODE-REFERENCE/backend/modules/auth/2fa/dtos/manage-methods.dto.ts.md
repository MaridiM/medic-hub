# File: modules\auth\2fa\dtos\manage-methods.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/dtos/manage-methods.dto.ts`

## Category
Backend

## File Type
TS (manage-methods.dto.ts)

## Size
1697 characters, 67 lines

## Full Code

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

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.128Z*
