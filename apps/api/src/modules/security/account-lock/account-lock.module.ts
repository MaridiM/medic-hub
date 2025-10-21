import { NotificationService } from '@/modules/notification'
import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { AccountLockService } from './account-lock.service'

/**
 * Account Lock Module
 * Provides services for account lockout and progressive delay mechanisms.
 */
@Module({
	providers: [AccountLockService, SecurityEventService, NotificationService],
})
export class AccountLockModule {}
