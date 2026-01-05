import type { HttpObject } from "~/types/primitives/objects";

export interface ApiOptions {
  version: 1 | 2;
  endpointVersion: 1 | 2 | 3;
}

export interface FetchBody {
  headers?: HttpObject;
  query?: HttpObject;
  body?: HttpObject;
}

export interface ApiResponse<T = any> {
  data: {
    attributes: T;
    type: string;
    id: number;
    relationships: any[];
  };
  included: any[];
  links?: any[];
  meta: any;
}
