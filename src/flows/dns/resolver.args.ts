import {ArgsType, Field, InputType} from "@nestjs/graphql";

@InputType()
export class DNSResponseQuery {

  @Field()
  interval?: string
}