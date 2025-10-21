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
