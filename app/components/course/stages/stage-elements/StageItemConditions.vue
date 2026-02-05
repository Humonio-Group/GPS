<script setup lang="ts">
import type { Stage } from "~/types/entities/course";
import { Lock } from "lucide-vue-next";

interface StageItemConditionsProps {
  stage: Stage;
}

const props = defineProps<StageItemConditionsProps>();
const conditions = computed(() => props.stage.conditions ?? []);
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger @click.prevent.stop>
      <Lock class="size-4 text-muted-foreground" />
    </UiPopoverTrigger>
    <UiPopoverContent class="grid gap-2">
      <div
        v-for="(condition, index) in conditions"
        :key="`stage#${stage.id}-condition#${index}`"
        class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-muted-foreground"
      >
        <component :is="condition.icon" />
        <p class="text-sm">
          {{ condition.label }}
        </p>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
