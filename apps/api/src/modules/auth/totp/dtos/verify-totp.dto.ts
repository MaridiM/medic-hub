import { IsNotEmpty, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { VALIDATION_PATTERNS } from '../constants'

@InputType()
export class VerifyTotpInput {
	@Field(() => String, { description: '6-digit TOTP code or backup code' })
	@IsString({ message: 'Code must be a string' })
	@IsNotEmpty({ message: 'Code is required' })
	@Matches(VALIDATION_PATTERNS.TOTP_OR_BACKUP, {
		message: 'Code must be 6 digits or 8-character backup code',
	})
	code: string
}
