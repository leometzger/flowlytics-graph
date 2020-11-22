import {Module} from '@nestjs/common';
import {DnsResolver} from './dns.resolver'
import {DnsResponseCodeResolver} from './dns.responses.resolver'
import {DnsFlowsRepo} from './dns.repo'
import {DnsFlowsAggregationRepo} from './dns.aggregation.repo'
import {Client} from '@elastic/elasticsearch'
import {ConfigService} from '@nestjs/config';

@Module({
  imports: [],
  exports: [],
  providers: [
    DnsResolver,
    DnsFlowsRepo,
    DnsResponseCodeResolver,
    DnsFlowsAggregationRepo,
    {
      provide: Client,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const hostname = config.get('ELASTICSEARCH_HOST')
        const port = config.get('ELASTICSEARCH_PORT')

        return new Client({node: `http://${hostname}:${port}`})
      }
    }
  ]
})
export class DnsModule {}
