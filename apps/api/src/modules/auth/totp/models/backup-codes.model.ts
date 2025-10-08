import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('BackupCodesStatus')
export class BackupCodesStatusModel {
	@Field(() => Int, { description: 'Total backup codes' })
	total: number

	@Field(() => Int, { description: 'Remaining unused codes' })
	remaining: number

	@Field(() => Int, { description: 'Used backup codes' })
	used: number
}
