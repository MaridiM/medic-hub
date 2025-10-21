import 'reflect-metadata'

import { NotificationService } from '@/modules/notification'
import { AccountLockService } from '@/modules/security'
import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
	providers: [
		SessionResolver,
		SessionService,
		VerificationService,
		SecurityEventService,
		AccountLockService,
		NotificationService,
	],
})
export class SessionModule {}
