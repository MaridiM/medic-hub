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
