import * as bodybuilder from 'bodybuilder'
import {Client} from '@elastic/elasticsearch'
import {DNSResponseCode} from './dns.models'
import {Injectable} from '@nestjs/common'
import {get, map} from 'lodash/fp'

export const PACKET_BEAT_INDEX = 'packetbeat-7.8.0-2020.11.20-000001'
const PACKETBEAT_TYPE = 'dns'


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
    const searchBody = bodybuilder()
      .query('match', {type: PACKETBEAT_TYPE})
      .size(0)
      .aggregation('terms', {field: 'dns.response_code'}, 'responseCodes')
      .build()

     const resp = await this.esClient.search({
      index: PACKET_BEAT_INDEX,
      body: searchBody
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
