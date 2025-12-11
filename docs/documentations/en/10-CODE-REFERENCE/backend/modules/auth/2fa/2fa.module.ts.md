# File: modules\auth\2fa\2fa.module.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/modules/auth/2fa/2fa.module.ts`

## Category
Backend

## File Type
TS (2fa.module.ts)

## Size
1385 characters, 60 lines

## Full Code

```typescript
import { NotificationService } from '@/modules/notification'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { TwoFactorVerifiedGuard } from './guards'
import { AdminTwoFactorResolver, TwoFactorResolver } from './resolvers'
import {
	AdminTwoFactorService,
	BackupCodeService,
	DeviceTrustService,
	SecurityEventService,
	TwoFactorCronService,
	TwoFactorMethodService,
	WebAuthnService,
} from './services'

/**
 * Two-Factor Authentication Module
 *
 * Provides enterprise-grade 2FA functionality:
 * - Multiple 2FA methods (TOTP, OTP Email/SMS, WebAuthn, Passkeys)
 * - Backup codes management
 * - Device trust scoring
 * - Security event logging
 * - Risk-based authentication
 * - Administrative management (NEW)
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [TwoFactorModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [
		// GraphQL Resolvers
		TwoFactorResolver,
		AdminTwoFactorResolver,

		// Core Services
		TwoFactorMethodService,
		BackupCodeService,
		DeviceTrustService,
		SecurityEventService,
		AdminTwoFactorService,
		TwoFactorCronService,
		WebAuthnService,

		// Guards
		TwoFactorVerifiedGuard,

		// Notifications
		NotificationService,
	],
})
export class TwoFactorModule {}

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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.110Z*
