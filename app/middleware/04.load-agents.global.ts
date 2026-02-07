export default defineNuxtRouteMiddleware(() => {
  const { company } = storeToRefs(useCompanyStore());
  if (!company.value) return;

  const store = useCompanionStore();
  const { agents } = storeToRefs(store);
  if (agents.value.length) return;

  store.loadAgents().then();
});
