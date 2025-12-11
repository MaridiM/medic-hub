# File: modules\auth\recovery\recovery.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/recovery/recovery.module.ts`

## Category
Backend

## File Type
TS (recovery.module.ts)

## Size
339 characters, 11 lines

## Full Code

```typescript
import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { RecoveryResolver } from './recovery.resolver'
import { RecoveryService } from './recovery.service'

@Module({
	providers: [RecoveryResolver, RecoveryService, SecurityEventService],
})
export class RecoveryModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.381Z*
