const publicPaths = [
  "/auth/login",
  "/auth/portal",
  "/auth/terms",
  "/welcome",
];

export default defineNuxtRouteMiddleware(async (to) => {
  const alias = to.params.alias;
  const { user } = storeToRefs(useUserStore());
  const store = useCompanyStore();

  if (!user.value && !publicPaths.includes(to.path)) return navigateTo("/auth/login");
  if (user.value && !alias && !publicPaths.includes(to.path)) return navigateTo("/auth/portal");
  if (store.isLoaded && storeToRefs(store).company.value!.alias === alias) return;

  if (user.value) await store.fetchCompany(alias as string);
});
