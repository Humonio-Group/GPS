export const useWorkspaceUtils = () => {
  const alias = computed(() => useRoute().params.alias as string | undefined);

  return {
    alias,
  };
};
