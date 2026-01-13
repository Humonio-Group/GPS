export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.courseId) return;

  const courseId = Number(to.params.courseId as string);
  const store = useCoursesStore();
  const { selectedCourse: course } = storeToRefs(store);

  if (course.value?.id === courseId) return;
  console.log("Loading selected course");
  await store.loadCourse(courseId).then();
});
