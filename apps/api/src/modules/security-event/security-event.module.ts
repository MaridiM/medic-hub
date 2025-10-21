import { Global, Module } from '@nestjs/common'

import { SecurityEventService } from './security-event.service'

/**
 * SecurityEventModule
 *
 * Global module providing centralized security event tracking across the entire platform.
 * Automatically available in all modules without explicit imports.
 *
 * Used by: Auth, 2FA, Session, Account, Recovery, WebAuthn, Passkeys, Device Management, etc.
 */
@Global()
@Module({
	providers: [SecurityEventService],
	exports: [SecurityEventService],
})
export class SecurityEventModule {}
