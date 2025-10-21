import { Global, Module } from '@nestjs/common'

import { MailModule } from './mail'
import { SmsModule } from './sms'

/**
 * Global Communication Module
 *
 * This module bundles all external communication channels, such as email and SMS.
 * By making it global, services like MailService and SmsService are available
 * for dependency injection throughout the application without needing to import
 * this module in feature modules.
 */
@Global()
@Module({
	imports: [MailModule, SmsModule],
	exports: [MailModule, SmsModule], // Export modules to make their services (MailService, SmsService) available
})
export class ProviderModule {}
