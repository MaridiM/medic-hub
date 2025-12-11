# File: modules\auth\account\dtos\change-password.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/account/dtos/change-password.dto.ts`

## Category
Backend

## File Type
TS (change-password.dto.ts)

## Size
597 characters, 28 lines

## Full Code

```typescript
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

/**
 * Password change input
 */
@InputType('ChangePasswordInput', {
	description: 'Input data for changing user password',
})
export class ChangePasswordInput {
	@Field({
		description: 'Current password (for verification)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field({
		description: 'New password (minimum 8 characters, must differ from old)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.278Z*
