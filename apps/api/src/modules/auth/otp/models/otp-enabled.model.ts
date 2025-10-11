import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OtpEnabled')
export class OtpEnabledModel {
	@Field(() => Boolean, { description: 'Success status' })
	success: boolean

	@Field(() => [String], {
		description: 'Backup recovery codes (store securely!)',
	})
	backupCodes: string[]

	@Field(() => String, {
		description: 'Warning message about backup codes',
	})
	message: string
}
