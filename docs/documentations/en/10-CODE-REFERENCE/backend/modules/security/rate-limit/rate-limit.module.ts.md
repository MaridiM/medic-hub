# File: modules\security\rate-limit\rate-limit.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/rate-limit/rate-limit.module.ts`

## Category
Backend

## File Type
TS (rate-limit.module.ts)

## Size
745 characters, 29 lines

## Full Code

```typescript
import { SecurityEventService } from '@/modules/security-event'
import { Global, Module } from '@nestjs/common'

import { RateLimitGuard } from './guards'
import { RateLimitService } from './rate-limit.service'

/**
 * Global Rate Limiting Module
 *
 * Provides application-wide request throttling with Redis backend.
 * Automatically registered as APP_GUARD in CoreModule.
 *
 * @example
 * ```typescript
 * // In your resolver:
 * @RateLimit({ points: 5, duration: 300 })
 * @Mutation(() => Boolean)
 * async sensitiveOperation() {
 *   // ...
 * }
 * ```
 */
@Global()
@Module({
	providers: [RateLimitService, RateLimitGuard, SecurityEventService],
	exports: [RateLimitService],
})
export class RateLimitModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.581Z*
