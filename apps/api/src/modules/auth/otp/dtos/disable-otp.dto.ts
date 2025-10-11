// src/modules/otp/dto/disable-otp.dto.ts
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { OTP_VALIDATION_PATTERNS } from '../constants'

@InputType()
export class DisableOtpInput {
	@Field(() => String, { description: 'User password for verification' })
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(1, { message: 'Password cannot be empty' })
	password: string

	@Field(() => String, { description: 'Current OTP code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(OTP_VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}
