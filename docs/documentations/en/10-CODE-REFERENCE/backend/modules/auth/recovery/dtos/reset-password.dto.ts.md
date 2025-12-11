# File: modules\auth\recovery\dtos\reset-password.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/recovery/dtos/reset-password.dto.ts`

## Category
Backend

## File Type
TS (reset-password.dto.ts)

## Size
255 characters, 13 lines

## Full Code

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ResetPasswordInput {
	@Field(() => String)
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.375Z*
