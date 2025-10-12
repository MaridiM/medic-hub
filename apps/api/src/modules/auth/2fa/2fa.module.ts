import { MailService, SmsService } from '@/modules/libs'
import { Module } from '@nestjs/common'

import { TwoFactorResolver } from './2fa.resolver'
import { TwoFactorVerifiedGuard } from './guards'
import { BackupCodeService, DeviceTrustService, SecurityEventService, TwoFactorMethodService } from './services'

/**
 * Two-Factor Authentication Module
 *
 * Provides enterprise-grade 2FA functionality:
 * - Multiple 2FA methods (TOTP, OTP Email/SMS, WebAuthn, Passkeys)
 * - Backup codes management
 * - Device trust scoring
 * - Security event logging
 * - Risk-based authentication
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
	providers: [
		// GraphQL Resolver
		TwoFactorResolver,

		// Core Services
		TwoFactorMethodService,
		BackupCodeService,
		DeviceTrustService,
		SecurityEventService,

		// Guards
		TwoFactorVerifiedGuard,

		// Providers
		MailService,
		SmsService,
	],
	// exports: [
	// 	// Export services for use in other modules
	// 	TwoFactorMethodService,
	// 	BackupCodeService,
	// 	DeviceTrustService,
	// 	SecurityEventService,
	// 	TwoFactorVerifiedGuard,
	// ],
})
export class TwoFactorModule {}
