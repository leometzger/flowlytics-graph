import {Module} from '@nestjs/common';
import {FlowResolver} from './flows.resolver';
import {FlowsEventsRepo} from './flows.repo'
import {Client} from '@elastic/elasticsearch'
import {ConfigService} from '@nestjs/config';
import {DnsModule} from './dns/dns.module';


@Module({
  imports: [
    DnsModule
  ],
  exports: [],
  providers: [
    FlowResolver, 
    FlowsEventsRepo,
    {
      provide: Client,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const hostname = config.get('ELASTICSEARCH_HOST')
        const port = config.get('ELASTICSEARCH_PORT')

        return new Client({node: `http://${hostname}:${port}`})
      }
    }
  ],
})
export class FlowsModule {}
