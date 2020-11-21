import {Resolver, Query, Args, ResolveField, Parent} from '@nestjs/graphql'
import {DNSFlow, DNSResponseCode} from './dns.models'
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../../auth/graphql-guard'
import {DnsFlowsAggregationRepo, DnsFlowsRepo} from './dns.repo';
import {DNSResponseQuery} from './resolver.args';
import {Pagination} from 'src/common/elasticsearch.models';


@Resolver(of => DNSFlow)
export class DnsResolver {
  constructor(private repository: DnsFlowsRepo) {}

  @Query(returns => [DNSFlow])
  @UseGuards(GqlAuthGuard)
  async dns() {
    return this.repository.getDnsFlowEvents()
  }
}

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
  async flows(@Parent() dnsResponseCode: DNSResponseCode) {
    return this.repository.getDnsFlowEvents(dnsResponseCode.code)
  }
}
