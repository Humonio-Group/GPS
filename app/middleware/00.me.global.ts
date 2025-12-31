export default defineNuxtRouteMiddleware(async () => {
  const store = useUserStore();

  if (store.isLoggedIn) return;

  await store.fetchUser();
});
