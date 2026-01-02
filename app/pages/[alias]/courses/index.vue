<script setup lang="ts">
import { BookDashed, Filter, Search } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const store = useCoursesStore();
const { courses, loading } = storeToRefs(store);

store.loadCourses();
</script>

<template>
  <PageRoot
    name="courses.home"
    class="grid gap-4"
  >
    <header class="grid gap-4">
      <section>
        <h1 class="text-3xl font-extrabold">
          {{ $t("courses.home.title") }}
        </h1>
      </section>

      <section class="flex items-center gap-2">
        <div class="relative flex-1">
          <Search class="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <UiInput
            class="pl-8"
            :placeholder="$t('labels.search')"
          />
        </div>

        <UiButton
          size="icon"
          variant="outline"
        >
          <Filter />
        </UiButton>
      </section>
    </header>

    <div
      v-if="!store.hasFirstLoadedCourses && loading.coursesList"
      class="w-full grid place-items-center h-24"
    >
      <UiSpinner />
    </div>
    <CourseCard
      v-for="course in courses"
      v-else-if="courses?.length"
      :key="`course-${course.id}`"
      :course="course"
    />
    <UiEmpty v-else>
      <UiEmptyHeader>
        <UiEmptyMedia variant="icon">
          <BookDashed />
        </UiEmptyMedia>
        <UiEmptyTitle>
          {{ $t("courses.home.empty.title") }}
        </UiEmptyTitle>
        <UiEmptyDescription>
          {{ $t("courses.home.empty.description") }}
        </UiEmptyDescription>
      </UiEmptyHeader>
    </UiEmpty>
  </PageRoot>
</template>
