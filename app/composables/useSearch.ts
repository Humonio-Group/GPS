export function useSearch<T = any>(serie: Ref<T[]>, ...searchKeys: string[]) {
  const search = ref<string>("");

  const clear = () => search.value = "";
  const sanitize = (input: string) => input.trim().toLowerCase();
  const matches = (...values: string[]): boolean => values.some(v => sanitize(v).includes(sanitize(search.value || "")));

  const resolve = (obj: unknown, path: string): string =>
    path.split(".").reduce((o, k) => (o as Record<string, unknown>)?.[k], obj) as string ?? "";

  const keys = (entity: T) => searchKeys.reduce((acc, cur) => {
    acc = [...acc, resolve(entity, cur)];
    return acc;
  }, [] as string[]);
  const results = computed<T[]>(() => serie.value.filter(s => matches(...keys(s))));

  return {
    search,
    clear,
    sanitize,
    matches,
    results,
  };
}
