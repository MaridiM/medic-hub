import { IsEnum } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_CHANNELS, type OtpChannel } from '../constants'

@InputType()
export class SendOtpInput {
	@Field(() => String, { description: 'Delivery channel for OTP code' })
	@IsEnum(OTP_CHANNELS, { message: 'Channel must be either email or sms' })
	channel: OtpChannel
}
