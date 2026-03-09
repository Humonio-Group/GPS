import type { HttpObject } from "~/types/primitives/objects";
import type { ApiOptions, FetchBody } from "~/types/primitives/api";
import { toast } from "vue-sonner";

export const useApi = () => {
  const { public: config } = useRuntimeConfig();
  const t = useNuxtApp().$i18n.t;

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
          .catch(async (error: any) => {
            const status = error.statusCode;

            useLogger().log("[API GET ERROR]", status);

            switch (status) {
              case 401: {
                if (!useRoute().path.includes("/welcome")) await navigateTo(useLocalePath()("/auth/login"));
                toast.error(t("toasts.error.expired-session"));
                return reject(error);
              }
              default: {
                toast.error(t("toasts.error.default", { code: status }));
                return reject(error);
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
          .then(async (response) => {
            if (response.error.value) {
              const status = response.error.value.statusCode;

              switch (status) {
                case 401: {
                  if (!useRoute().path.includes("/welcome")) await navigateTo(useLocalePath()("/auth/login"));
                  return resolve(null);
                }
                default: {
                  toast.error(t("toasts.error.default", { code: response.error.value.statusCode }));
                  return reject(response.error.value);
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
        .catch(async (error: any) => {
          const status = error.statusCode;

          switch (status) {
            case 401: {
              if (!useRoute().path.includes("/welcome")) await navigateTo(useLocalePath()("/auth/login"));
              toast.error(t("toasts.error.expired-session"));
              return resolve(null);
            }
            default: {
              toast.error(t("toasts.error.default", { code: status }));
              return reject(error);
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
        .catch(async (error: any) => {
          const status = error.statusCode;

          switch (status) {
            case 401: {
              if (!useRoute().path.includes("/welcome")) await navigateTo(useLocalePath()("/auth/login"));
              toast.error(t("toasts.error.expired-session"));
              return resolve(null);
            }
            default: {
              toast.error(t("toasts.error.default", { code: status }));
              return reject(error);
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
        .catch(async (error: any) => {
          const status = error.statusCode;

          switch (status) {
            case 401: {
              if (!useRoute().path.includes("/welcome")) await navigateTo(useLocalePath()("/auth/login"));
              toast.error(t("toasts.error.expired-session"));
              return resolve(null);
            }
            default: {
              toast.error(t("toasts.error.default", { code: status }));
              return reject(error);
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
        .catch(async (error: any) => {
          const status = error.statusCode;

          switch (status) {
            case 401: {
              if (!useRoute().path.includes("/welcome")) await navigateTo(useLocalePath()("/auth/login"));
              toast.error(t("toasts.error.expired-session"));
              return resolve(null);
            }
            default: {
              toast.error(t("toasts.error.default", { code: status }));
              return reject(error);
            }
          }
        });
    });
  };

  const sse = <T = any>(
    _path: string,
    apiOptions: ApiOptions,
    _fetchBody: FetchBody = {},
    callbacks: { onMessage?: (data: T) => void; onError?: (error: any) => void; onComplete?: () => void } = {},
  ): AbortController => {
    const { headers: h, query: q } = _fetchBody;
    const controller = new AbortController();

    const endpoint = path(url(apiOptions.version, apiOptions.endpointVersion), _path);
    const queryString = new URLSearchParams(
      Object.entries(params(q)).map(([k, v]) => [k, String(v)]),
    ).toString();

    $fetch.raw(`${endpoint}?${queryString}`, {
      method: "POST",
      headers: {
        ...headers(h),
        Accept: "text/event-stream",
      },
      query: {
        ...params(q),
      },
      ...(_fetchBody.body ? { body: _fetchBody.body } : {}),
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response: any) => {
        if (!response.ok) {
          if (response.status === 401) {
            if (!useRoute().path.includes("/welcome")) navigateTo(useLocalePath()("/auth/login"));
            return;
          }
          callbacks.onError?.(new Error(`SSE connection failed: ${response.status}`));
          return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            callbacks.onComplete?.();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const dataLine = part
              .split("\n")
              .find(line => line.startsWith("data: "));
            if (dataLine) {
              try {
                const data = JSON.parse(dataLine.slice(6));
                callbacks.onMessage?.(data as T);
              }
              catch {
                // non-JSON data, skip
              }
            }
          }
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          callbacks.onError?.(error);
        }
      });

    return controller;
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
    delete: destroy,
    destroy,
    sse,
  };
};
