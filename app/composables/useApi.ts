import type { HttpObject } from "~/types/primitives/objects";

export const useApi = () => {
  const { public: config } = useRuntimeConfig();

  const url = (product: 1 | 2, version: 1 | 2 | 3) =>
    `${config.api[`${product}`]}/v${version}`;
  const path = (api: string, endpoint: string) =>
    `${api}/${endpoint.startsWith("/") ? endpoint.substring(1) : endpoint}`;

  const params = (obj?: HttpObject): HttpObject => ({
    key: config.api.key,
    ...obj,
  });
  const headers = (obj?: HttpObject) => ({
    "X-PLATFORM": config.platform,
    ...obj,
  });

  return {
    url,
    path,
    params,
    headers,
  };
};
