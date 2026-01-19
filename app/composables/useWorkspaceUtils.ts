export const useWorkspaceUtils = () => {
  const store = useCompanyStore();
  const { company } = storeToRefs(store);

  return {
    alias: computed(() => company.value?.alias ?? null),
  };
};
