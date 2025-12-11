# File: modules\auth\session\session.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/session/session.module.ts`

## Category
Backend

## File Type
TS (session.module.ts)

## Size
622 characters, 24 lines

## Full Code

```typescript
import 'reflect-metadata'

import { NotificationService } from '@/modules/notification'
import { AccountLockService } from '@/modules/security'
import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
	providers: [
		SessionResolver,
		SessionService,
		VerificationService,
		SecurityEventService,
		AccountLockService,
		NotificationService,
	],
})
export class SessionModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.431Z*
