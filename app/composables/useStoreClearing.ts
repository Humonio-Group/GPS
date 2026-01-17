export const useStoreClearing = () => {
  useCoursesStore().$reset();
  useTicketStore().$reset();
};
