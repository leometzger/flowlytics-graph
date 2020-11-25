import {DnsFlowsAggregationRepo, PACKET_BEAT_INDEX} from "./dns.aggregation.repo"
import {Test} from "@nestjs/testing";
import {Client} from "@elastic/elasticsearch";


describe('DNSFlowsRepo', () => {
  let repository: DnsFlowsAggregationRepo
  let esSearch = jest.fn()

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DnsFlowsAggregationRepo,
        {
          provide: Client,
          useValue: {search: esSearch}
        }
      ]
    }).compile()
    repository = await moduleRef.get<DnsFlowsAggregationRepo>(DnsFlowsAggregationRepo)
    esSearch.mockReset()
    esSearch.mockReturnValueOnce({
      body: {aggregations: {responseCodes: {buckets: []}}}
    })
  })

  it('should query elasticsearch with default values', async () => {
    await repository.countFlowsByResponseCodes()

    expect(esSearch).toBeCalledWith({
      index: PACKET_BEAT_INDEX,
      body: 
      {
        size: 0,
        query: {
          match: {
            type: 'dns',
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
  })

  it('should query by index type and response code', async () => {
    await repository.countFlowsByResponseCodeByInterval('1d')

    expect(esSearch).toBeCalledWith({
      index: PACKET_BEAT_INDEX,
      body: {
        size: 0,
        aggs: {
          responseCodes: {
            composite: {
              sources: [
                {date: {date_histogram: {field: "@timestamp", calendar_interval: '1d'}}},
                {code: {terms: {field: "dns.response_code"}}},
              ]
            }
          }
        }
      }
    })
  })
})