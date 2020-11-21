export interface Explanation {
  value: number;
  description: string;
  details: Explanation[];
}

export interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

export interface BucketResult {
  key: string | object
  key_as_string?: string
  doc_count: number
}

export interface Pagination {
  size?: number
  from?: number
}

export interface TimeSeriesQuery {
  
}

export interface SearchResponse<T> {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: ShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: T;
      _version?: number;
      _explanation?: Explanation;
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      matched_queries?: string[];
      sort?: string[];
    }>;
  };
  aggregations?: any;
}
