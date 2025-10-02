import 'reflect-metadata'

import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
	providers: [SessionResolver, SessionService, VerificationService],
})
export class SessionModule {}
