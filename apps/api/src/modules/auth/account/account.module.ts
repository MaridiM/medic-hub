import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
// Import enums registration
import './models/enums'

@Module({
	providers: [AccountService, AccountResolver, VerificationService],
})
export class AccountModule {}
