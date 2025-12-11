# File: modules\auth\session\dtos\login.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/session/dtos/login.dto.ts`

## Category
Backend

## File Type
TS (login.dto.ts)

## Size
697 characters, 35 lines

## Full Code

```typescript
import { User } from '@/modules/auth/account'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

/**
 * Login credentials input
 */
@InputType('LoginInput', {
	description: 'User credentials for authentication',
})
export class LoginInput {
	@Field({
		description: 'User email address',
	})
	email: string

	@Field({
		description: 'User password (min 8 characters)',
	})
	password: string
}

/**
 * Login response with user data
 */
@ObjectType('LoginResponse', {
	description: 'Response after successful authentication',
})
export class LoginResponse {
	@Field(() => User, {
		nullable: true,
		description: 'Authenticated user data',
	})
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.416Z*
