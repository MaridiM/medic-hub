# File: modules\auth\2fa\dtos\admin-2fa.dto.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/dtos/admin-2fa.dto.ts`

## Category
Backend

## File Type
TS (admin-2fa.dto.ts)

## Size
2409 characters, 101 lines

## Full Code

```typescript
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

import { Field, InputType, Int } from '@nestjs/graphql'
import { ESecurityEvent, ESecuritySeverity } from '@prisma/__generated__'

/**
 * Input for disabling a user's 2FA
 */
@InputType('DisableUser2FAInput')
export class DisableUser2FAInput {
	@Field(() => String, { description: 'User ID whose 2FA should be disabled' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for disabling 2FA' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string

	@Field(() => Boolean, {
		nullable: true,
		defaultValue: true,
		description: 'Whether to notify the user via email',
	})
	@IsOptional()
	@IsBoolean()
	notifyUser?: boolean
}

/**
 * Input for revoking a user's device
 */
@InputType('RevokeUserDeviceInput')
export class RevokeUserDeviceInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Device ID to revoke' })
	@IsString()
	@IsNotEmpty()
	deviceId: string

	@Field(() => String, { description: 'Reason for revoking device' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for revoking all user devices
 */
@InputType('RevokeAllUserDevicesInput')
export class RevokeAllUserDevicesInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => String, { description: 'Reason for revoking all devices' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	reason: string
}

/**
 * Input for getting user security events
 */
@InputType('GetUserSecurityEventsInput')
export class GetUserSecurityEventsInput {
	@Field(() => String, { description: 'User ID' })
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field(() => Int, { nullable: true, defaultValue: 50, description: 'Number of events to return' })
	@IsOptional()
	limit?: number

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by event types',
	})
	@IsOptional()
	@IsEnum(ESecurityEvent, { each: true })
	events?: ESecurityEvent[]

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by severity levels',
	})
	@IsOptional()
	@IsEnum(ESecuritySeverity, { each: true })
	severities?: ESecuritySeverity[]
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.124Z*
