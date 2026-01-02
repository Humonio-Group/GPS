<script setup lang="ts">
import type { Course } from "~/types/entities/course";

interface CourseCardProps {
  course: Course;
}

const props = defineProps<CourseCardProps>();

const { daysBetween, relativeDifference } = useTimeUtils();
const { alias } = useWorkspaceUtils();

const link = computed(() => `/${alias.value}/courses/${props.course.id}`);
</script>

<template>
  <UiCard class="relative p-4 gap-4 flex flex-col @md:flex-row">
    <NuxtImg
      :src="course.picture || course.program.picture"
      :placeholder="[50, 50, 25, 75]"
      class="@md:aspect-video w-full h-32 @sm:h-48 @md:h-auto @md:w-48 object-cover rounded-md"
    />

    <div class="flex-1 flex flex-col justify-between @md:py-3">
      <UiCardHeader class="px-0 flex flex-col gap-1">
        <UiCardTitle>{{ course.name }}</UiCardTitle>
        <UiCardDescription>{{ course.description }}</UiCardDescription>
      </UiCardHeader>

      <UiCardFooter class="mt-4 @md:mt-0 px-0">
        <p
          class="text-xs text-muted-foreground"
          :class="{
            'text-destructive!': daysBetween(Date.now(), course.dates.end) < 1,
          }"
        >
          {{ $t("labels.ends-in", { time: relativeDifference(course.dates.end) }) }}
        </p>
      </UiCardFooter>
    </div>

    <NuxtLinkLocale
      class="absolute inset-0"
      :to="link"
    />
  </UiCard>
</template>
