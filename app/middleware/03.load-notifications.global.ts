export default defineNuxtRouteMiddleware(() => {
  const store = useNotificationStore();
  const { notifications } = storeToRefs(store);

  if (notifications.value.length) return;
  store.loadNotifications().then();
});
