export function useSearch() {
  const search = ref<string>("");

  const clear = () => search.value = "";
  const sanitize = (input: string) => input.trim().toLowerCase();
  const matches = (...values: string[]): boolean => values.some(v => sanitize(v).includes(sanitize(search.value || "")));

  return {
    search,
    clear,
    sanitize,
    matches,
  };
}
