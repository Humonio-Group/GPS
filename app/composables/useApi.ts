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

  const get = <T = any>(_path: string, apiOptions: ApiOptions & { vanilla?: boolean }, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      if (apiOptions.vanilla) {
        $fetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
          method: "GET",
          headers: headers(h),
          query: params(q),
          ...(body ? { body } : {}),
          credentials: "include",
        })
          .then((response) => {
            if (!response) {
              resolve(null);
              return;
            }

            resolve(response as T);
          })
          .catch((error: any) => {
            const status = error.statusCode;

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
      }
      else {
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
      }
    });
  };
  const post = <T = any>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      $fetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "POST",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (!response) {
            resolve(null);
            return;
          }

          resolve(response as T);
        })
        .catch((error: any) => {
          const status = error.statusCode;

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
  const patch = <T = any>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      $fetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "PATCH",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (!response) {
            resolve(null);
            return;
          }

          resolve(response as T);
        })
        .catch((error: any) => {
          const status = error.statusCode;

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
  const put = <T = any>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      $fetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "PUT",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (!response) {
            resolve(null);
            return;
          }

          resolve(response as T);
        })
        .catch((error: any) => {
          const status = error.statusCode;

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
  const destroy = <T = any>(_path: string, apiOptions: ApiOptions, _fetchBody: FetchBody = {}): Promise<T | null> => {
    const { headers: h, query: q, body } = _fetchBody;

    return new Promise((resolve, reject) => {
      $fetch<T>(path(url(apiOptions.version, apiOptions.endpointVersion), _path), {
        method: "DELETE",
        headers: headers(h),
        query: params(q),
        ...(body ? { body } : {}),
        credentials: "include",
      })
        .then((response) => {
          if (!response) {
            resolve(null);
            return;
          }

          resolve(response as T);
        })
        .catch((error: any) => {
          const status = error.statusCode;

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
