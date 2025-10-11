import { IsEnum, IsOptional, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_CHANNELS, OTP_VALIDATION_PATTERNS, type OtpChannel } from '../constants'

@InputType()
export class EnableOtpInput {
	@Field(() => String, { description: 'Preferred delivery channel' })
	@IsEnum(OTP_CHANNELS, { message: 'Channel must be either email or sms' })
	channel: OtpChannel

	@Field(() => String, { nullable: true, description: 'Phone number (required for SMS)' })
	@IsOptional()
	@IsString()
	@Matches(OTP_VALIDATION_PATTERNS.PHONE, {
		message: 'Phone must be in E.164 format (e.g., +1234567890)',
	})
	phone?: string
}
