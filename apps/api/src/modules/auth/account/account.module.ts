import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
	providers: [AccountService, AccountResolver, VerificationService],
})
export class AccountModule {}
