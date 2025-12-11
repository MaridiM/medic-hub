# File: modules\auth\account\account.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/account/account.module.ts`

## Category
Backend

## File Type
TS (account.module.ts)

## Size
712 characters, 26 lines

## Full Code

```typescript
import { NotificationService } from '@/modules/notification'
import { AccountLockService } from '@/modules/security'
import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { SessionService } from '../session'
import { VerificationService } from '../verification'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
// Import enums registration
import './models/enums'

@Module({
	providers: [
		AccountService,
		AccountResolver,
		VerificationService,
		SecurityEventService,
		SessionService,
		AccountLockService,
		NotificationService,
	],
})
export class AccountModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.257Z*
