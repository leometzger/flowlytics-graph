import {Module} from '@nestjs/common';
import {DnsResolver} from './dns.resolver'
import {DnsFlowsRepo} from './dns.repo'
import {Client} from '@elastic/elasticsearch'
import {ConfigService} from '@nestjs/config';

@Module({
  imports: [],
  exports: [],
  providers: [
    DnsResolver,
    DnsFlowsRepo,
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
