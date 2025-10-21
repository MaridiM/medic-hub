import { Global, Module } from '@nestjs/common'

import { AccountLockModule } from './account-lock'
import { RateLimitModule } from './rate-limit'

/**
 * Main Security Module (Global)
 *
 * This module bundles all security-related features, making them available
 * application-wide. It includes:
 * - RateLimitModule: For request throttling and brute-force protection.
 * - AccountLockModule: For account lockout mechanisms.
 *
 * Being global, its providers (like services and guards) are available for
 * dependency injection in any other module without needing to import SecurityModule.
 */
@Global()
@Module({
	imports: [RateLimitModule, AccountLockModule],
	exports: [RateLimitModule, AccountLockModule],
})
export class SecurityModule {}
