# File: modules\security\account-lock\account-lock.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/account-lock/account-lock.module.ts`

## Category
Backend

## File Type
TS (account-lock.module.ts)

## Size
471 characters, 15 lines

## Full Code

```typescript
import { NotificationService } from '@/modules/notification'
import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { AccountLockService } from './account-lock.service'

/**
 * Account Lock Module
 * Provides services for account lockout and progressive delay mechanisms.
 */
@Module({
	providers: [AccountLockService, SecurityEventService, NotificationService],
})
export class AccountLockModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.543Z*
