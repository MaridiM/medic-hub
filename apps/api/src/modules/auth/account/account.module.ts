import { NotificationService } from '@/modules/notification'
import { AccountLockService } from '@/modules/security'
import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { SessionService } from '../session'
import { VerificationService } from '../verification'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
// Import enums registration
import './models/enums'

@Module({
	providers: [
		AccountService,
		AccountResolver,
		VerificationService,
		SecurityEventService,
		SessionService,
		AccountLockService,
		NotificationService,
	],
})
export class AccountModule {}
