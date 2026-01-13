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

export interface ApiResponseData<T = any> {
  attributes: T;
  type: string;
  id: number;
  relationships: any[];
}

export interface ApiResponse<T = any> {
  data: ApiResponseData<T> | ApiResponseData<T>[];
  included: any[];
  links?: any[];
  meta: any;
}
