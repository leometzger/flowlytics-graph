import {Field, Int, ObjectType} from '@nestjs/graphql';
import {GraphQLModel} from '../common/graphql'

@ObjectType()
export class Agent extends GraphQLModel<Agent> {
  @Field()
  hostname: string

  @Field()
  name: string

  @Field()
  version: string
}

@ObjectType()
export class Destination extends GraphQLModel<Destination> {
  @Field(type => Int)
  bytes: number

  @Field()
  ip: string

  @Field({nullable: true})
  mac?: string

  @Field(type => Int, {nullable: true})
  packets?: number

  @Field(type => Int)
  port: number
}

@ObjectType()
export class Event extends GraphQLModel<Event> {
  @Field()
  dataset: string

  @Field(type => Int)
  duration: number

  @Field()
  start: string 

  @Field()
  end: string

  @Field()
  kind: 'event'

  @Field()
  category: string
}

@ObjectType()
export class Flow extends GraphQLModel<Flow> {
  @Field()
  final: boolean

  @Field()
  id: string

  @Field(type => Int)
  vlan: number
}

@ObjectType()
export class Network extends GraphQLModel<Network> {
  @Field(type => Int)
  bytes: number

  @Field()
  communityId?: string

  @Field(type => Int, {nullable: true})
  packets?: number

  @Field()
  transport: string

  @Field()
  direction: string

  @Field()
  protocol: string
  
  @Field()
  type: string
}

@ObjectType()
export class Source extends GraphQLModel<Source> {
  @Field(type => Int)
  bytes: number

  @Field()
  ip: string

  @Field({nullable: true})
  mac?: string

  @Field(type => Int, {nullable: true})
  packets?: number

  @Field(type => Int)
  port: number
}

@ObjectType()
export class Server extends GraphQLModel<Server> {
  @Field()
  ip: string

  @Field(type => Int)
  port: number

  @Field(type => Int)
  bytes: number
}

@ObjectType()
export class Client extends GraphQLModel<Client> {
  @Field()
  ip: string

  @Field(type => Int)
  port: number

  @Field(type => Int)
  bytes: number
}


@ObjectType()
export class FlowEvent extends GraphQLModel<FlowEvent> {
  @Field()
  method: string

  @Field()
  status: string

  @Field()
  query: string

  @Field()
  resource: string

  @Field()
  type: string

  @Field(type => Agent)
  agent: Agent

  @Field(type => Destination)
  destination: Destination

  @Field(type => Event)
  event: Event

  @Field(type => Flow)
  flow: Flow

  @Field(type => Network)
  network: Network

  @Field(type => Source)
  source: Source

  @Field(type => Server)
  server: Server
}

