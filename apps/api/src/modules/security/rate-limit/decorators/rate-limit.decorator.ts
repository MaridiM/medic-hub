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
