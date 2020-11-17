import {Client} from '@elastic/elasticsearch'
import {Injectable} from '@nestjs/common'
import {FlowEvent} from './flows.models'
import {SearchResponse} from '../common/elasticsearch'

const PACKET_BEAT_INDEX = 'packetbeat-7.8.0-2020.11.16-000001'

@Injectable()
export class FlowsEventsRepo {
  constructor(private esClient: Client) {}

  async getAllFlowEvents() {
    const resp = await this.esClient.search<SearchResponse<FlowEvent>>({
      index: PACKET_BEAT_INDEX,
      body: {
        size: 100,
        from: 5000,
      }
    })

    return resp.body.hits.hits.map(hit => {
      return hit._source
    })
  }
}
