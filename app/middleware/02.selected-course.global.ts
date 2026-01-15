export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.courseId) return;

  const courseId = Number(to.params.courseId as string);
  const store = useCoursesStore();
  const { selectedCourse: course, hasStagesLoaded, hasActivitiesLoaded } = storeToRefs(store);

  if (course.value?.id === courseId) return;
  await store.loadCourse(courseId).then();

  if (!course.value) return navigateTo(`${useWorkspaceUtils().alias.value}/courses`);

  store.loadBadges().then();

  if (hasStagesLoaded.value) {
    if (!hasActivitiesLoaded.value) store.loadCourseContents().then();
    return;
  }
  store.loadStages().then(() => store.loadCourseContents());
});
