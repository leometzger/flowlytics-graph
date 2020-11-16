import * as camelcaseKeys from 'camelcase-keys'
import {Client} from '@elastic/elasticsearch'
import {Injectable} from '@nestjs/common'
import {DNSFlow} from './dns.models'
import {SearchResponse} from '../../common/elasticsearch'

const PACKET_BEAT_INDEX = 'packetbeat-7.8.0-2020.11.16-000001'
const PACKETBEAT_TYPE = 'dns'

@Injectable()
export class DnsFlowsRepo {
  constructor(private esClient: Client) {}

  async getDnsFlowEvents() {
    const resp = await this.esClient.search<SearchResponse<DNSFlow>>({
      index: PACKET_BEAT_INDEX,
      body: {
        query: {
          match: {type: PACKETBEAT_TYPE}
        }
      }
    })

    return resp.body.hits.hits.map(hit => {
      return camelcaseKeys(hit._source, {deep: true})
    })
  }
}
