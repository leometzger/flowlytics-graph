import {DnsFlowsRepo, PACKET_BEAT_INDEX} from "./dns.repo"
import {Test} from "@nestjs/testing";
import {Client} from "@elastic/elasticsearch";


describe('DNSFlowsRepo', () => {
  let repository: DnsFlowsRepo
  let esSearch = jest.fn()

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DnsFlowsRepo,
        {
          provide: Client,
          useValue: {search: esSearch}
        }
      ]
    }).compile()
    repository = await moduleRef.get<DnsFlowsRepo>(DnsFlowsRepo)
    esSearch.mockReset()
    esSearch.mockReturnValueOnce({
      body: {hits: {hits: []}}
    })
  })

  it('should query elasticsearch with default values', async () => {
    await repository.getDnsFlowEvents()

    expect(esSearch).toBeCalledWith({
      index: PACKET_BEAT_INDEX,
      body: {
        size: 100,
        query: {
          match: {type: 'dns'},
        }
      }
    })
  })

  it('should query by index type and response code', async () => {
    await repository.getDnsFlowEventsByResponseCode('nxdomain')

    expect(esSearch).toBeCalledWith({
      index: PACKET_BEAT_INDEX,
      body: {
        size: 100,
        query: {
          bool: {
            filter: {
              match: {"dns.response_code":"nxdomain"}
            },
            must: {
              match: {"type":"dns"}
            }
          }
        }
      }
    })
  })
})