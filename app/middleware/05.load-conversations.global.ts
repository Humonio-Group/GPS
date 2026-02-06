export default defineNuxtRouteMiddleware(async () => {
  const { company } = storeToRefs(useCompanyStore());
  if (!company.value) return;

  const store = useCompanionStore();
  const { conversations } = storeToRefs(store);
  if (conversations.value.length > 0) return;

  store.loadConversations().then();
});
