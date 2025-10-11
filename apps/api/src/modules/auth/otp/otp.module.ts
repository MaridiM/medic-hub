import { Module } from '@nestjs/common'

import { VerificationService } from '../verification'

import { OtpResolver } from './otp.resolver'
import { OtpService } from './otp.service'

@Module({
	providers: [OtpResolver, OtpService, VerificationService],
})
export class OtpModule {}
