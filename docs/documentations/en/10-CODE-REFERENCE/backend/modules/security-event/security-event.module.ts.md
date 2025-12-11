# File: modules\security-event\security-event.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security-event/security-event.module.ts`

## Category
Backend

## File Type
TS (security-event.module.ts)

## Size
552 characters, 19 lines

## Full Code

```typescript
import { Global, Module } from '@nestjs/common'

import { SecurityEventService } from './security-event.service'

/**
 * SecurityEventModule
 *
 * Global module providing centralized security event tracking across the entire platform.
 * Automatically available in all modules without explicit imports.
 *
 * Used by: Auth, 2FA, Session, Account, Recovery, WebAuthn, Passkeys, Device Management, etc.
 */
@Global()
@Module({
	providers: [SecurityEventService],
	exports: [SecurityEventService],
})
export class SecurityEventModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.623Z*
