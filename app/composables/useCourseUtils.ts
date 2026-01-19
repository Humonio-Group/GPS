export const useCourseUtils = () => {
  const store = useCoursesStore();
  const { selectedCourse: course } = storeToRefs(store);

  return {
    id: computed(() => course.value?.id ?? null),
  };
};
