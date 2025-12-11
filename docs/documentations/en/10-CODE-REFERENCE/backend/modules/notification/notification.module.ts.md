# File: modules\notification\notification.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/notification/notification.module.ts`

## Category
Backend

## File Type
TS (notification.module.ts)

## Size
1034 characters, 36 lines

## Full Code

```typescript
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.506Z*
