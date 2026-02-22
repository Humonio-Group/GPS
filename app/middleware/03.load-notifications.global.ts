export default defineNuxtRouteMiddleware(() => {
  const store = useNotificationStore();
  const { notifications } = storeToRefs(store);

  const { user } = storeToRefs(useUserStore());

  if (notifications.value.length) return;
  if (user.value) store.loadNotifications().then();
});
