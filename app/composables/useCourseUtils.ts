export const useCourseUtils = () => {
  const id = computed(() => useRoute().params.courseId as string | undefined);

  return {
    id,
  };
};
