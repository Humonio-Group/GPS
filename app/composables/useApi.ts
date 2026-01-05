import type { HttpObject } from "~/types/primitives/objects";
import type { ApiOptions, FetchBody } from "~/types/primitives/api";

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

  const get = <T>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      useFetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "GET",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (response.error.value) {
            const status = response.error.value.statusCode;

            switch (status) {
              case 401: {
                navigateTo(useRuntimeConfig().public.urls.auth, { external: true });
                return;
              }
              default: {
                reject(response.error.value);
                return;
              }
            }
          }
          if (!response.data.value) {
            resolve(null);
            return;
          }

          resolve(response.data.value as T);
        });
    });
  };
  const post = <T>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      useFetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "POST",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (response.error.value) {
            const status = response.error.value.statusCode;

            switch (status) {
              case 401: {
                navigateTo(useRuntimeConfig().public.urls.auth, { external: true });
                return;
              }
              default: {
                reject(response.error.value);
                return;
              }
            }
          }
          if (!response.data.value) {
            resolve(null);
            return;
          }

          resolve(response.data.value as T);
        });
    });
  };
  const patch = <T>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      useFetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "PATCH",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (response.error.value) {
            const status = response.error.value.statusCode;

            switch (status) {
              case 401: {
                navigateTo(useRuntimeConfig().public.urls.auth, { external: true });
                return;
              }
              default: {
                reject(response.error.value);
                return;
              }
            }
          }
          if (!response.data.value) {
            resolve(null);
            return;
          }

          resolve(response.data.value as T);
        });
    });
  };
  const put = <T>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      useFetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "PUT",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (!response.data.value) {
            resolve(null);
            return;
          }

          resolve(response.data.value as T);
        })
        .catch((error: any) => {
          const status = (error as any).statusCode ?? -1;

          switch (status) {
            case 401: {
              navigateTo(useRuntimeConfig().public.urls.auth, { external: true });
              return;
            }
            default: {
              reject(error);
              return;
            }
          }
        });
    });
  };
  const destroy = <T>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      useFetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "DELETE",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (response.error.value) {
            const status = response.error.value.statusCode;

            switch (status) {
              case 401: {
                navigateTo(useRuntimeConfig().public.urls.auth, { external: true });
                return;
              }
              default: {
                reject(response.error.value);
                return;
              }
            }
          }
          if (!response.data.value) {
            resolve(null);
            return;
          }

          resolve(response.data.value as T);
        });
    });
  };

  return {
    url,
    path,
    params,
    headers,

    get,
    post,
    patch,
    put,
    destroy,
  };
};
