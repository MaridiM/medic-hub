import { IsNotEmpty, IsString, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangePasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string
}
