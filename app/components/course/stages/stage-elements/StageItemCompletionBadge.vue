<script setup lang="ts">
interface StageCompletionBadgeProps {
  contents: {
    completed?: number;
    total?: number;
  };
}

const props = defineProps<StageCompletionBadgeProps>();
const total = computed(() => props.contents.total ?? 0);
const completed = computed(() => Math.min(props.contents.completed ?? 0, total.value));
</script>

<template>
  <UiBadge variant="outline">
    {{ $t("courses.specimen.overview.contents-progress", { current: completed, max: total }) }}
  </UiBadge>
</template>
