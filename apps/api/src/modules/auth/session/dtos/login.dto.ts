import { User } from '@/modules/auth/account'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

/**
 * Login credentials input
 */
@InputType('LoginInput', {
	description: 'User credentials for authentication',
})
export class LoginInput {
	@Field({
		description: 'User email address',
	})
	email: string

	@Field({
		description: 'User password (min 8 characters)',
	})
	password: string
}

/**
 * Login response with user data
 */
@ObjectType('LoginResponse', {
	description: 'Response after successful authentication',
})
export class LoginResponse {
	@Field(() => User, {
		nullable: true,
		description: 'Authenticated user data',
	})
	user?: User
}
