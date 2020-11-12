import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
  @Field()
  username: string

  @Field()
  password: string
}

@ObjectType()
export class AuthToken {
  @Field()
  access_token: string
}