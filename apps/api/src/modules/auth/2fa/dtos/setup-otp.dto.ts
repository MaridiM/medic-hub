import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf } from 'class-validator'

import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { E2FAMethod } from '@prisma/__generated__'

import { VALIDATION_PATTERNS } from '../constants'

registerEnumType(E2FAMethod, {
	name: 'E2FAMethod', // имя enum в схеме GraphQL
	description: 'Allowed OTP methods for setup (email or SMS).',
	valuesMap: {
		TOTP: { deprecationReason: 'Not allowed in SetupOtpInput' },
		WEBAUTHN: { deprecationReason: 'Not allowed in SetupOtpInput' },
		PASSKEY: { deprecationReason: 'Not allowed in SetupOtpInput' },
		BACKUP_CODE: { deprecationReason: 'Not allowed in SetupOtpInput' },
	},
})

/**
 * Input for setting up OTP (Email or SMS)
 */
@InputType('SetupOtpInput')
export class SetupOtpInput {
	@Field(() => E2FAMethod, {
		description: 'OTP method: OTP_EMAIL or OTP_SMS',
		defaultValue: E2FAMethod.OTP_EMAIL,
	})
	@IsOptional()
	@IsEnum(E2FAMethod)
	@IsIn([E2FAMethod.OTP_EMAIL, E2FAMethod.OTP_SMS], {
		message: 'method must be OTP_EMAIL or OTP_SMS',
	})
	method!: E2FAMethod

	@Field({ nullable: true, description: 'Email destination (required for OTP_EMAIL)' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_EMAIL)
	@IsEmail()
	email?: string

	@Field({ nullable: true, description: 'Phone in E.164, required for OTP_SMS' })
	@IsOptional()
	@ValidateIf(o => o.method === E2FAMethod.OTP_SMS)
	@Matches(VALIDATION_PATTERNS.PHONE_E164, {
		message: 'phone must be a valid E.164 number (e.g. +1234567890)',
	})
	phone?: string

	@Field({ nullable: true, description: 'Optional display name for the method' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string
}

/**
 * Input for sending OTP code
 */
@InputType('SendOtpCodeInput')
export class SendOtpCodeInput {
	@Field(() => String, { nullable: true, description: 'Method ID to send code to (uses primary if not specified)' })
	@IsOptional()
	@IsString()
	methodId?: string
}

/**
 * Input for verifying OTP code during setup
 */
@InputType('VerifyOtpSetupInput')
export class VerifyOtpSetupInput {
	@Field(() => String, { description: 'Method ID from setup' })
	@IsString()
	@IsNotEmpty()
	methodId: string

	@Field(() => String, { description: '6-digit OTP code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.OTP_CODE, { message: 'Code must be exactly 6 digits' })
	code: string
}
