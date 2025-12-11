# File: modules\security\rate-limit\decorators\skip-rate-limit.decorator.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/rate-limit/decorators/skip-rate-limit.decorator.ts`

## Category
Backend

## File Type
TS (skip-rate-limit.decorator.ts)

## Size
514 characters, 21 lines

## Full Code

```typescript
import { SetMetadata } from '@nestjs/common'

import { SKIP_RATE_LIMIT_KEY } from '../constants/rate-limit.constants'

/**
 * Skip rate limit decorator.
 *
 * Excludes specific endpoints from global rate limiting.
 * Use sparingly - only for public health checks or internal endpoints.
 *
 * @example
 * ```typescript
 * @SkipRateLimit()
 * @Query(() => String)
 * async healthCheck() {
 *   return 'OK'
 * }
 * ```
 */
export const SkipRateLimit = () => SetMetadata(SKIP_RATE_LIMIT_KEY, true)

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.567Z*
