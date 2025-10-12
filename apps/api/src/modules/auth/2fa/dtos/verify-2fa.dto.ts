import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { VALIDATION_PATTERNS } from '../constants'

/**
 * Generic 2FA verification input
 * Supports TOTP codes, OTP codes, and backup codes
 */
@InputType('Verify2FAInput')
export class Verify2FAInput {
	@Field(() => String, { description: '6-digit code or 8-character backup code' })
	@IsString()
	@IsNotEmpty()
	code: string

	@Field(() => String, {
		nullable: true,
		description: 'Specific method ID to verify (uses primary if not specified)',
	})
	@IsOptional()
	@IsString()
	methodId?: string

	@Field(() => Boolean, { nullable: true, description: 'Remember this device for future logins' })
	@IsOptional()
	@IsBoolean()
	trustDevice?: boolean
}

/**
 * Backup code verification input
 */
@InputType('VerifyBackupCodeInput')
export class VerifyBackupCodeInput {
	@Field(() => String, { description: '8-character backup code' })
	@IsString()
	@IsNotEmpty()
	@Matches(VALIDATION_PATTERNS.BACKUP_CODE, { message: 'Invalid backup code format' })
	backupCode: string

	@Field(() => String, { nullable: true, description: 'Method ID this code is for' })
	@IsOptional()
	@IsString()
	methodId?: string
}
