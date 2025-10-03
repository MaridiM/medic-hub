import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String)
	@IsUUID(4)
	@IsNotEmpty()
	token: string
}
