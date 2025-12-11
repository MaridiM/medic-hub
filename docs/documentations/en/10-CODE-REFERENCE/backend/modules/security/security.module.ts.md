# File: modules\security\security.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/security.module.ts`

## Category
Backend

## File Type
TS (security.module.ts)

## Size
768 characters, 23 lines

## Full Code

```typescript
import { Global, Module } from '@nestjs/common'

import { AccountLockModule } from './account-lock'
import { RateLimitModule } from './rate-limit'

/**
 * Main Security Module (Global)
 *
 * This module bundles all security-related features, making them available
 * application-wide. It includes:
 * - RateLimitModule: For request throttling and brute-force protection.
 * - AccountLockModule: For account lockout mechanisms.
 *
 * Being global, its providers (like services and guards) are available for
 * dependency injection in any other module without needing to import SecurityModule.
 */
@Global()
@Module({
	imports: [RateLimitModule, AccountLockModule],
	exports: [RateLimitModule, AccountLockModule],
})
export class SecurityModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.617Z*
