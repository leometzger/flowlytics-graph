import {Resolver, Query} from '@nestjs/graphql'
import {FlowEvent} from './flows.models'
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../auth/graphql-guard'
import {FlowsEventsRepo} from './flows.repo'


@Resolver(of => FlowEvent)
export class FlowResolver {
  constructor(private repository: FlowsEventsRepo) {}

  @Query(returns => [FlowEvent])
  @UseGuards(GqlAuthGuard)
  async flows() {
    return this.repository.getAllFlowEvents()
  }
}