import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TotpEnabled')
export class TotpEnabledModel {
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
