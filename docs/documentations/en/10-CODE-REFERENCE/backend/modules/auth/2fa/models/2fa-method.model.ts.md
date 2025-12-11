# File: modules\auth\2fa\models\2fa-method.model.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/models/2fa-method.model.ts`

## Category
Backend

## File Type
TS (2fa-method.model.ts)

## Size
2028 characters, 72 lines

## Full Code

```typescript
import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { E2FAMethod } from '@prisma/__generated__'

/**
 * 2FA Method response model
 */
@ObjectType('TwoFactorMethod')
export class TwoFactorMethodModel {
	@Field(() => String, { description: 'Method ID' })
	id: string

	@Field(() => E2FAMethod, { description: 'Method type' })
	method: E2FAMethod

	@Field(() => String, { nullable: true, description: 'User-provided name' })
	name?: string

	@Field(() => Boolean, { description: 'Whether method is active' })
	isActive: boolean

	@Field(() => Boolean, { description: 'Whether this is the primary method' })
	isPrimary: boolean

	@Field(() => Date, { nullable: true, description: 'Last time this method was used' })
	lastUsedAt?: Date

	@Field(() => Int, { description: 'Number of times used' })
	useCount: number

	@Field(() => Date, { description: 'When method was created' })
	createdAt: Date
}

/**
 * 2FA Methods list with status
 */
@ObjectType('TwoFactorMethodsList')
export class TwoFactorMethodsListModel {
	@Field(() => [TwoFactorMethodModel], { description: 'Available 2FA methods' })
	methods: TwoFactorMethodModel[]

	@Field(() => TwoFactorMethodModel, { nullable: true, description: 'Primary method' })
	primary?: TwoFactorMethodModel

	@Field(() => Int, { description: 'Total number of active methods' })
	totalActive: number

	@Field(() => Boolean, { description: 'Whether user has 2FA enabled' })
	is2FAEnabled: boolean
}

/**
 * Backup codes status
 */
@ObjectType('BackupCodesStatus')
export class BackupCodesStatusModel {
	@Field(() => Int, { description: 'Total backup codes generated' })
	total: number

	@Field(() => Int, { description: 'Codes already used' })
	used: number

	@Field(() => Int, { description: 'Remaining unused codes' })
	remaining: number

	@Field(() => Int, { description: 'Expired codes' })
	expired: number

	@Field(() => Boolean, { description: 'Whether running low on codes' })
	isLow: boolean
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.144Z*
