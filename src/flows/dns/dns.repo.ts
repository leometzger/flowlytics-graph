import * as camelcaseKeys from 'camelcase-keys'
import {Client} from '@elastic/elasticsearch'
import {DNSFlow} from './dns.models'
import {Injectable} from '@nestjs/common'
import {SearchResponse} from '../../common/elasticsearch.models'
import {map} from 'lodash/fp'

const PACKET_BEAT_INDEX = 'packetbeat-7.8.0-2020.11.20-000001'
const PACKETBEAT_TYPE = 'dns'

const fromHitToDnsFlow = (hit): DNSFlow => camelcaseKeys(hit._source, {deep: true})
const fromHitsToDnsFlows = map(fromHitToDnsFlow)

@Injectable()
export class DnsFlowsRepo {
  constructor(private esClient: Client) {}

  async getDnsFlowEvents(responseCode?: string): Promise<DNSFlow[]> {
    const resp = await this.esClient.search<SearchResponse<DNSFlow>>({
      index: PACKET_BEAT_INDEX,
      body: {
        size: 100,
        query: {
          bool: {
            must: [
              {match: {type: PACKETBEAT_TYPE}},
              {match: {'dns.response_code': responseCode}}
            ]
          }
        }
      }
    })

    return fromHitsToDnsFlows(resp.body.hits.hits)
  }
}
