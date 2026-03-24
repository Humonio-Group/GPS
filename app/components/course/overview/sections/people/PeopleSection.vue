<script setup lang="ts">
import PeopleEntitySection from "~/components/course/overview/sections/people/elements/PeopleEntitySection.vue";
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";

interface PeopleSectionProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<PeopleSectionProps>();

const store = useCoursesStore();
const { selectedCourse: course } = storeToRefs(store);
</script>

<template>
  <div
    v-if="course"
    :class="cn(
      'grid grid-cols-1 items-start gap-4',
      course.participants.length > 1 && course.facilitators.length ? '@xl:grid-cols-2' : '',
      props.class,
    )"
  >
    <PeopleEntitySection
      v-if="course.facilitators.length > 0"
      :people="course.facilitators"
      translation-key="courses.specimen.overview.sections.teachers"
    />

    <PeopleEntitySection
      v-if="course.participants.length > 1"
      :people="course.participants"
      translation-key="courses.specimen.overview.sections.learners"
    />
  </div>
</template>
