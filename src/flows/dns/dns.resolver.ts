import {Resolver, Query} from '@nestjs/graphql'
import {DNSFlow} from './dns.models'
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../../auth/graphql-guard'
import {DnsFlowsRepo} from './dns.repo';


@Resolver(of => DNSFlow)
export class DnsResolver {
  constructor(private repository: DnsFlowsRepo) {}

  @Query(returns => [DNSFlow])
  @UseGuards(GqlAuthGuard)
  async dns() {
    return this.repository.getDnsFlowEvents()
  }
}
