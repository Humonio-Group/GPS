const publicPaths = [
  "/auth/login",
  "/auth/portal",
];

export default defineNuxtRouteMiddleware(async (to) => {
  const alias = to.params.alias;
  const { user } = storeToRefs(useUserStore());
  const store = useCompanyStore();

  if (user.value && !alias && !publicPaths.includes(to.path)) return navigateTo("/auth/portal");
  if (store.isLoaded && storeToRefs(store).company.value!.alias === alias) return;

  await store.fetchCompany(alias as string);
});
