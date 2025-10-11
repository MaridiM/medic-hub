import { IsNotEmpty, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_VALIDATION_PATTERNS } from '../constants'

@InputType()
export class VerifyOtpInput {
	@Field(() => String, { description: '6-digit OTP code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(OTP_VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}

@InputType()
export class VerifyBackupCodeInput {
	@Field(() => String, { description: 'Backup recovery code' })
	@IsString({ message: 'Backup code must be a string' })
	@IsNotEmpty({ message: 'Backup code is required' })
	@Matches(OTP_VALIDATION_PATTERNS.BACKUP_CODE, { message: 'Invalid backup code format' })
	backupCode: string
}
