import { Global, Module } from '@nestjs/common'

import { NotificationService } from './notification.service'

/**
 * Global Notification Module
 *
 * Provides centralized notification services for the entire application.
 * Registered as a global module, making NotificationService available
 * everywhere without explicit imports.
 *
 * @remarks
 * - Supports multiple delivery channels (Email, SMS, Push)
 * - Handles rate limiting and duplicate detection
 * - Tracks delivery success/failure
 * - Respects user preferences and reputation
 *
 * @example
 * ```typescript
 * // No need to import in other modules, automatically available
 * @Injectable()
 * export class MyService {
 *   constructor(private readonly notificationService: NotificationService) {}
 *
 *   async doSomething() {
 *     await this.notificationService.notify2FAMethodAdded(user, 'TOTP', 'My App', 'en')
 *   }
 * }
 * ```
 */
@Global()
@Module({
	providers: [NotificationService],
})
export class NotificationModule {}
