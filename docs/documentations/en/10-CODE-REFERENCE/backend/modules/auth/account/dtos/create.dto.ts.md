# File: modules\auth\account\dtos\create.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/account/dtos/create.dto.ts`

## Category
Backend

## File Type
TS (create.dto.ts)

## Size
921 characters, 44 lines

## Full Code

```typescript
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

/**
 * Account creation input
 */
@InputType('CreateAccountInput', {
	description: 'Input data for creating a new user account',
})
export class CreateAccountInput {
	@Field({
		description: 'Full name (alphanumeric with hyphens allowed)',
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	fullName: string

	@Field({
		description: 'Email address (must be unique)',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field({
		description: 'Password (minimum 8 characters)',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field({
		description: 'Phone number in E.164 format (e.g., +1234567890)',
	})
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.317Z*
