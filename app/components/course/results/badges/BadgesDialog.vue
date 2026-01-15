<script setup lang="ts">
import BadgeCard from "~/components/course/results/badges/elements/BadgeCard.vue";

const store = useCoursesStore();
const { selectedCourse: course } = storeToRefs(store);

const badges = computed(() => [...(course.value?.badges ?? [])].sort((a, b) => {
  if (!a.unlockedAt) return 1;
  if (!b.unlockedAt) return -1;
  return a.unlockedAt.getTime() - b.unlockedAt.getTime();
}));
</script>

<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <slot />
    </UiDialogTrigger>
    <UiDialogContent class="@container/badges-dialog max-w-4xl!">
      <UiDialogHeader>
        <UiDialogTitle>
          {{ $t("courses.specimen.results.badges.all-badges") }}
        </UiDialogTitle>
      </UiDialogHeader>

      <div class="grid @lg/badges-dialog:grid-cols-2 gap-4">
        <BadgeCard
          v-for="badge in badges"
          :key="`c${course!.id}-b#${badge.id}-all`"
          :badge="badge"
        />
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
