import {Resolver, Query, Args, ResolveField, Parent} from '@nestjs/graphql'
import {DNSFlow, DNSResponseCode} from './dns.models'
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../../auth/graphql-guard'
import {DnsFlowsRepo} from './dns.repo';
import {DnsFlowsAggregationRepo} from './dns.aggregation.repo'
import {DNSResponseQuery} from './resolver.args';


@Resolver(of => DNSResponseCode)
export class DnsResponseCodeResolver {
  constructor(
    private repository: DnsFlowsRepo,
    private aggRepository: DnsFlowsAggregationRepo
  ) {}

  @Query(returns => [DNSResponseCode])
  @UseGuards(GqlAuthGuard)
  async dnsResponses(
    @Args('query', {type: () => DNSResponseQuery, nullable: true}) query?: DNSResponseQuery
  ): Promise<DNSResponseCode[]> {
    if (query && query.interval) {
      return this.aggRepository.countFlowsByResponseCodeByInterval(query.interval)
    }
    return this.aggRepository.countFlowsByResponseCodes()
  }

  @ResolveField()
  async flows(@Parent() dnsResponseCode: DNSResponseCode): Promise<DNSFlow[]> {
    return this.repository.getDnsFlowEventsByResponseCode(dnsResponseCode.code)
  }
}
