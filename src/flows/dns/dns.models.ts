import {FlowEvent} from '../flows.models'
import {Field, Int, ObjectType} from '@nestjs/graphql';
import {GraphQLModel} from '../../common/graphql'


@ObjectType()
export class DNSQuestion extends GraphQLModel<DNSQuestion> {
  @Field()
  name: string

  @Field()
  type: string

  @Field()
  class: string
}

@ObjectType()
export class DNSFlags {
  @Field()
  authoritative: boolean

  @Field()
  truncatedResponse: boolean

  @Field()
  recursionDesired: boolean

  @Field()
  recursionAvailable: boolean

  @Field()
  authenticData: boolean

  @Field()
  checkingDisabled: boolean
}

@ObjectType()
export class DNS extends GraphQLModel<DNS> {
  @Field(type => Int)
  id?: number

  @Field(type => DNSQuestion)
  question?: DNSQuestion

  @Field()
  responseCode?: string

  @Field()
  flags?: DNSFlags

  @Field(type => Int)
  answersCount?: number

  @Field()
  opCode?: string

  @Field(type => Int)
  additionalsCount?: number

  @Field()
  type?: string
}


@ObjectType()
export class DNSFlow extends FlowEvent {
  @Field()
  dns: DNS
}