# File: modules\security\rate-limit\decorators\rate-limit.decorator.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/security/rate-limit/decorators/rate-limit.decorator.ts`

## Category
Backend

## File Type
TS (rate-limit.decorator.ts)

## Size
693 characters, 23 lines

## Full Code

```typescript
import { SetMetadata } from '@nestjs/common'

import { RATE_LIMIT_KEY } from '../constants/rate-limit.constants'
import type { RateLimitOptions } from '../types/rate-limit.types'

/**
 * Rate limit decorator for endpoint-specific throttling.
 *
 * Overrides global rate limit settings for specific resolvers/mutations.
 *
 * @param options - Rate limit configuration
 *
 * @example
 * ```typescript
 * @RateLimit({ points: 5, duration: 900 }) // 5 requests per 15 minutes
 * @Mutation(() => Boolean)
 * async login(@Args('data') input: LoginInput) {
 *   // ...
 * }
 * ```
 */
export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options)

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.565Z*
