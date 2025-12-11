# File: modules\auth\recovery\dtos\new-password.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/recovery/dtos/new-password.dto.ts`

## Category
Backend

## File Type
TS (new-password.dto.ts)

## Size
339 characters, 18 lines

## Full Code

```typescript
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.367Z*
