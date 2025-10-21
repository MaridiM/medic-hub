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
