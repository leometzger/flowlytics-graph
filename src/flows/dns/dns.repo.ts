import * as camelcaseKeys from 'camelcase-keys'
import {Client} from '@elastic/elasticsearch'
import {DNSFlow, DNSResponseCode} from './dns.models'
import {Injectable} from '@nestjs/common'
import {SearchResponse} from '../../common/elasticsearch.models'
import {get, map} from 'lodash/fp'

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

const fromBucketsToResponseCode = (bucket): DNSResponseCode => {
  return {
    code: bucket.key,
    count: get('doc_count', bucket)
  }
}
const fromBucketsToResponseCodeTS = (bucket): DNSResponseCode => {
  return {
    code: bucket.key.code,
    unixDatetime: bucket.key.date,
    count: get('doc_count', bucket)
  }
}
@Injectable()
export class DnsFlowsAggregationRepo {
  constructor(private esClient: Client) {}

  async countFlowsByResponseCodes(): Promise<DNSResponseCode[]> {
     const resp = await this.esClient.search({
      index: PACKET_BEAT_INDEX,
      body: {
        size: 0,
        query: {
          match: {
            type: PACKETBEAT_TYPE,
          }
        },
        aggs: {
          responseCodes: {
            terms: {
              field: "dns.response_code"
            }
          }
        }
      }
    })
    const buckets = resp.body.aggregations.responseCodes.buckets

    return map(fromBucketsToResponseCode, buckets)
  }

  async countFlowsByResponseCodeByInterval(interval: string): Promise<DNSResponseCode[]> {
     const resp = await this.esClient.search({
      index: PACKET_BEAT_INDEX,
      body: {
        size: 0,
        aggs: {
          responseCodes: {
            composite: {
              sources: [
                {date: {date_histogram: {field: "@timestamp", calendar_interval: interval}}},
                {code: {terms: {field: "dns.response_code"}}},
              ]
            }
          }
        }
      }
    })
    const buckets = resp.body.aggregations.responseCodes.buckets

    return map(fromBucketsToResponseCodeTS, buckets)
  }
}
