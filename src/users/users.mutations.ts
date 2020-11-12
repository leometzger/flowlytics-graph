import {Field, InputType} from '@nestjs/graphql'

@InputType()
export class UserInput {
  @Field()
  username: string

  @Field()
  password: string

  @Field()
  email: string
}