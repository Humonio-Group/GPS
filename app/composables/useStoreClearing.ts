export const useStoreClearing = (user: boolean = true) => {
  useCompanyStore().$reset();
  useCoursesStore().$reset();
  useTicketStore().$reset();
  if (user) useUserStore().$reset();
  useCompanionStore().$reset();
  useNotificationStore().$reset();
};
