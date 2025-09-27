import { Field, HideField, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	fullName: string

	@Field(() => String)
	email: string

	@Field(() => String)
	phone: string

	@HideField()
	password: string | null

	@Field(() => String, { nullable: true })
	firstName: string

	@Field(() => String, { nullable: true })
	lastName: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
