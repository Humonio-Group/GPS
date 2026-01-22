<script setup lang="ts">
import type { Content } from "~/types/entities/course";

interface ContentTasklistProps {
  content: Content;
}

const props = defineProps<ContentTasklistProps>();

const tasks = computed(() => props.content.activity.tasks ?? []);
</script>

<template>
  <div class="flex flex-col gap-2 w-full max-w-4xl mx-auto">
    <UiLabel
      v-for="task in tasks"
      :key="task.id"
      class="flex items-center gap-2 text-base! font-normal!"
    >
      <UiCheckbox :model-value="task.checked" />
      <p>{{ task.label }}</p>
    </UiLabel>
  </div>
</template>
