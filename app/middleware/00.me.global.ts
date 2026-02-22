export default defineNuxtRouteMiddleware(async () => {
  const store = useUserStore();
  const { user } = storeToRefs(store);

  if (store.isLoggedIn) return;

  await store.fetchUser();
  if (user.value?.termsToApprove) return navigateTo(useLocalePath()("/auth/terms"));
});
