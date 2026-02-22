export function useSearch(serie: Ref<any[]>, ...searchKeys: string[]) {
  const search = ref<string>("");

  const clear = () => search.value = "";
  const sanitize = (input: string) => input.trim().toLowerCase();
  const matches = (...values: string[]): boolean => values.some(v => sanitize(v).includes(sanitize(search.value || "")));

  const keys = (entity: any) => searchKeys.reduce((acc, cur) => {
    acc = [...acc, entity[cur]];
    return acc;
  }, [] as string[]);
  const results = computed(() => serie.value.filter(s => matches(...keys(s))));

  return {
    search,
    clear,
    sanitize,
    matches,
    results,
  };
}
