import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateAccountInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number
}
