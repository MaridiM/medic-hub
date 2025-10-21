import { SecurityEventService } from '@/modules/security-event'
import { Module } from '@nestjs/common'

import { RecoveryResolver } from './recovery.resolver'
import { RecoveryService } from './recovery.service'

@Module({
	providers: [RecoveryResolver, RecoveryService, SecurityEventService],
})
export class RecoveryModule {}
