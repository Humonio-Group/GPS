export default defineNuxtRouteMiddleware(async (to) => {
  const alias = to.params.alias;
  const store = useCompanyStore();

  if (store.isLoaded && storeToRefs(store).company.value!.alias === alias) return;

  await store.fetchCompany(alias as string);
});
