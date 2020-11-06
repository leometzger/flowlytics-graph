import {Module} from '@nestjs/common';
import {FlowResolver} from './flows.resolver';
import {FlowsEventsRepo} from './flows.repo'
import {Client} from '@elastic/elasticsearch'

const client = new Client({node: 'http://127.0.0.1:9200'})

@Module({
  imports: [],
  exports: [],
  providers: [
    FlowResolver, 
    FlowsEventsRepo,
    {
      provide: Client,
      useValue: client
    }
  ],
})
export class FlowsModule {}
