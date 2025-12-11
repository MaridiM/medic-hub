# File: modules\auth\account\dtos\change-email.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/account/dtos/change-email.dto.ts`

## Category
Backend

## File Type
TS (change-email.dto.ts)

## Size
445 characters, 20 lines

## Full Code

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

/**
 * Email change input
 */
@InputType('ChangeEmailInput', {
	description: 'Input data for changing user email address',
})
export class ChangeEmailInput {
	@Field({
		description: 'New email address (must be unique and different from current)',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.267Z*
