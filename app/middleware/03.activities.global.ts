export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.courseId || !to.params.contentId) return;

  const store = useCoursesStore();
  const { selectedCourse: course, hasStagesLoaded, hasActivitiesLoaded } = storeToRefs(store);

  if (!course.value) return;

  if (hasStagesLoaded.value) {
    if (!hasActivitiesLoaded.value) store.loadCourseContents().then();
    return;
  }

  store.loadStages().then(() => store.loadCourseContents());
});
