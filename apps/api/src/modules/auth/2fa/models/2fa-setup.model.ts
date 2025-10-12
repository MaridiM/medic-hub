import { Field, ObjectType } from '@nestjs/graphql'

/**
 * TOTP setup response (QR code + secret)
 */
@ObjectType('TotpSetup')
export class TotpSetupModel {
	@Field(() => String, { description: 'Method ID (temporary until verified)' })
	methodId: string

	@Field(() => String, { description: 'QR code as data URL' })
	qrCodeUrl: string

	@Field(() => String, { description: 'Manual entry key (same as in QR code)' })
	manualEntryKey: string

	@Field(() => String, { description: 'Issuer name (app name)' })
	issuer: string

	@Field(() => String, { description: 'Account name (user email)' })
	accountName: string
}

/**
 * OTP setup response
 */
@ObjectType('OtpSetup')
export class OtpSetupModel {
	@Field(() => String, { description: 'Method ID' })
	methodId: string

	@Field(() => String, { description: 'Where codes will be sent' })
	destination: string

	@Field(() => String, { description: 'Success message' })
	message: string
}

/**
 * 2FA setup completion response
 */
@ObjectType('TwoFactorSetupComplete')
export class TwoFactorSetupCompleteModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { description: 'Method ID' })
	methodId: string

	@Field(() => [String], { description: 'Backup recovery codes (show only once!)' })
	backupCodes: string[]

	@Field(() => String, { description: 'Warning message about backup codes' })
	message: string
}

/**
 * Backup codes regeneration response
 */
@ObjectType('BackupCodesRegenerated')
export class BackupCodesRegeneratedModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => [String], { description: 'New backup codes' })
	backupCodes: string[]

	@Field(() => String, { description: 'Warning message' })
	message: string
}

/**
 * Generic success response
 */
@ObjectType('TwoFactorSuccess')
export class TwoFactorSuccessModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => String, { nullable: true, description: 'Success message' })
	message?: string
}
