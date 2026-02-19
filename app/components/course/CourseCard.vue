<script setup lang="ts">
import type { Course } from "~/types/entities/course";
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";

interface CourseCardProps {
  course: Course;
  class?: HTMLAttributes["class"];
}

const props = defineProps<CourseCardProps>();

const { daysBetween, relativeDifference } = useTimeUtils();
const { alias } = useWorkspaceUtils();

const link = computed(() => `/${alias.value}/courses/${props.course.id}`);
</script>

<template>
  <UiCard
    :class="cn(
      'relative p-4 gap-4 flex flex-col w-full',
      'hover:border-primary focus:border-primary hover:scale-103 focus:scale-103 hover:shadow-2xl focus:shadow-2xl hover:z-10 focus:z-10 transition-all duration-150',
      props.class,
    )"
  >
    <NuxtImg
      :src="course.picture || course.program.picture"
      :placeholder="[50, 50, 25, 75]"
      class="w-full h-32 @sm:h-48 object-cover rounded-md"
    />

    <div class="flex-1 flex flex-col justify-between @md:py-3">
      <UiCardHeader class="px-0 flex flex-col gap-1">
        <UiCardTitle class="line-clamp-2">
          {{ course.name }}
        </UiCardTitle>
        <UiCardDescription class="line-clamp-2">
          {{ course.description }}
        </UiCardDescription>
      </UiCardHeader>

      <UiCardFooter class="mt-4 px-0">
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
