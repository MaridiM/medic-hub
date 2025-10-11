import { Field, Int, ObjectType } from '@nestjs/graphql'

import { OTP_CHANNELS } from '../constants'

@ObjectType('OtpSent')
export class OtpSentModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { description: 'Delivery channel used', defaultValue: OTP_CHANNELS.EMAIL })
	channel: string

	@Field(() => Int, { description: 'Code expires in (seconds)' })
	expiresIn: number

	@Field(() => String, { description: 'Success message' })
	message: string
}
