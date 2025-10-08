import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Totp')
export class TotpModel {
	@Field(() => String, { description: 'QR code as data URL' })
	qrCodeUrl: string

	@Field(() => String, {
		description: 'Manual entry key (same as in QR code)',
	})
	manualEntryKey: string

	@Field(() => String, { description: 'Issuer name (app name)' })
	issuer: string

	@Field(() => String, { description: 'Account name (user email)' })
	accountName: string
}
