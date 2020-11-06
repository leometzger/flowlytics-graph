import {Resolver, Query} from '@nestjs/graphql'
import {FlowEvent} from './flows.models'
import {FlowsEventsRepo} from './flows.repo'


@Resolver(of => FlowEvent)
export class FlowResolver {
  constructor(private repository: FlowsEventsRepo) {}

  @Query(returns => [FlowEvent])
  async flows() {
    return this.repository.getAllFlowEvents()
  }
}