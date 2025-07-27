import { User } from '@/modules/auth'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	password: string
}

@ObjectType()
export class LoginResponse {
	@Field(() => String, { nullable: true })
	accessToken?: string

	@Field(() => User, { nullable: true })
	user?: User
}
