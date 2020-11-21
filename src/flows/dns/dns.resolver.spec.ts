import {DnsFlowsRepo, DnsFlowsAggregationRepo} from "./dns.repo"
import {DnsResponseCodeResolver} from "./dns.resolver"
import {Test} from "@nestjs/testing";
import {DNSResponseCode} from "./dns.models";
import {Client} from "@elastic/elasticsearch";


describe('DNSResponseCodeResolver', () => {
  let dnsFlowsRepo: DnsFlowsRepo
  let dnsFlowsAggregationRepo: DnsFlowsAggregationRepo
  let dnsResponseCodeResolver: DnsResponseCodeResolver
  let nxResponseCode: DNSResponseCode
  let noErrorResponseCode: DNSResponseCode
  let nxResponseCodeTS: DNSResponseCode
  let noErrorResponseCodeTS: DNSResponseCode

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DnsFlowsRepo,
        DnsFlowsAggregationRepo,
        DnsResponseCodeResolver,
        {
          provide: Client,
          useValue: {search: jest.fn()}
        }
      ]
    }).compile()
    dnsFlowsRepo = await moduleRef.get<DnsFlowsRepo>(DnsFlowsRepo)
    dnsFlowsAggregationRepo = await moduleRef.get<DnsFlowsAggregationRepo>(DnsFlowsAggregationRepo)
    dnsResponseCodeResolver = await moduleRef.get<DnsResponseCodeResolver>(DnsResponseCodeResolver)
    nxResponseCode = {
      code: 'NXDOMAIN',
      count: 10
    }
    nxResponseCodeTS = {...nxResponseCode, unixDatetime: 1605916800000}
    noErrorResponseCode = {
      code: 'NOERROR',
      count: 100
    }
    noErrorResponseCodeTS = {...noErrorResponseCode, unixDatetime: 1605916800000}
  })

  describe('dnsResponses', () => {
    it('should return all grouped response codes', async () => {
      const response = [nxResponseCode, noErrorResponseCode]
      jest.spyOn(dnsFlowsAggregationRepo, 'countFlowsByResponseCodes').mockResolvedValueOnce(response)

      const result = await dnsResponseCodeResolver.dnsResponses()

      expect(result).toEqual(response)
    })

    it('should return response code as timeseries when is passed interval', async () => {
      const response = [nxResponseCodeTS, noErrorResponseCodeTS]
      jest.spyOn(dnsFlowsAggregationRepo, 'countFlowsByResponseCodeByInterval').mockResolvedValueOnce(response)

      const result = await dnsResponseCodeResolver.dnsResponses({interval: '6d'})

      expect(result).toEqual(response)
    })
  });
})

