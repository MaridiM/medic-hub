# File: modules\auth\verification\dtos\verification.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/verification/dtos/verification.dto.ts`

## Category
Backend

## File Type
TS (verification.dto.ts)

## Size
400 characters, 19 lines

## Full Code

```typescript
import { IsNotEmpty, IsUUID } from 'class-validator'

import { User } from '@/modules/auth/account'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class VerificationInput {
	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
}

@ObjectType()
export class VerificationResponse {
	@Field(() => User, { nullable: true })
	user?: User
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.460Z*
