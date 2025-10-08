import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { TOTP_SECRET_LENGTH, VALIDATION_PATTERNS } from '../constants'

@InputType()
export class EnableTotpInput {
	@Field(() => String, { description: 'TOTP secret from generation step' })
	@IsString({ message: 'Secret must be a string' })
	@IsNotEmpty({ message: 'Secret is required' })
	@Length(TOTP_SECRET_LENGTH, TOTP_SECRET_LENGTH, {
		message: `Secret must be exactly ${TOTP_SECRET_LENGTH} characters`,
	})
	@Matches(VALIDATION_PATTERNS.TOTP_SECRET, { message: 'Invalid secret format' })
	secret: string

	@Field(() => String, { description: '6-digit TOTP code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(VALIDATION_PATTERNS.TOTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}
