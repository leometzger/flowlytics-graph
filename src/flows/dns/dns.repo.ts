import * as camelcaseKeys from 'camelcase-keys'
import * as bodybuilder from 'bodybuilder'
import {Client} from '@elastic/elasticsearch'
import {DNSFlow} from './dns.models'
import {Injectable} from '@nestjs/common'
import {SearchResponse} from '../../common/elasticsearch.models'
import {map} from 'lodash/fp'

export const PACKET_BEAT_INDEX = 'packetbeat-7.8.0-2020.11.20-000001'
const PACKETBEAT_TYPE = 'dns'

const fromHitToDnsFlow = (hit): DNSFlow => camelcaseKeys(hit._source, {deep: true})
const fromHitsToDnsFlows = map(fromHitToDnsFlow)

@Injectable()
export class DnsFlowsRepo {
  constructor(private esClient: Client) {}

  async getDnsFlowEvents(responseCode?: string): Promise<DNSFlow[]> {
    const searchBody = bodybuilder()
      .query('match', 'type', PACKETBEAT_TYPE)
      .size(100)
      .build()

    const resp = await this.esClient.search<SearchResponse<DNSFlow>>({
      index: PACKET_BEAT_INDEX,
      body: searchBody 
    })

    return fromHitsToDnsFlows(resp.body.hits.hits)
  }

  async getDnsFlowEventsByResponseCode(responseCode: string): Promise<DNSFlow[]> {
    const resp = await this.esClient.search<SearchResponse<DNSFlow>>({
      index: PACKET_BEAT_INDEX,
      body: bodybuilder()
      .query('match', 'type', 'dns')
      .filter('match', 'dns.response_code', 'nxdomain')
      .size(100)
      .build()
    })

    return fromHitsToDnsFlows(resp.body.hits.hits)
  }
}
