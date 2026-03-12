<script setup lang="ts">
import { BookDashed, Filter, Search } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const { t } = useI18n();

const store = useCoursesStore();
const { courses: _courses, loading } = storeToRefs(store);
const { company } = storeToRefs(useCompanyStore());

useHead({
  title: `${t("courses.home.title")} - ${company.value?.name}`,
});

const search = ref<string>("");
const courses = computed(() => _courses.value?.filter(c => c.name.toLowerCase().includes(search.value ?? "") || c.description.toLowerCase().includes(search.value ?? "")));

store.loadCourses();
</script>

<template>
  <PageRoot
    name="courses.home"
    wrapper
    wrapper-class="mx-auto w-full max-w-7xl grid gap-4 pb-2"
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
            :model-value="search"
            :placeholder="$t('labels.search')"
            @update:model-value="search = ($event as string).trim().toLowerCase()"
          />
        </div>

        <UiButton
          v-if="false"
          size="icon"
          variant="outline"
          disabled
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
    <div
      v-else-if="courses?.length"
      class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(17.5rem,1fr))] isolate"
    >
      <CourseCard
        v-for="course in courses"
        :key="`course-${course.id}`"
        :course="course"
      />
    </div>
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
