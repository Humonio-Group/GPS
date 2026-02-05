<script setup lang="ts">
import { Lock } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";

interface StageContentConditionsProps {
  content: Content;
}

defineProps<StageContentConditionsProps>();
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger @click.stop>
      <Lock class="size-4 text-muted-foreground" />
    </UiPopoverTrigger>
    <UiPopoverContent class="grid gap-1.5">
      <div
        v-for="condition in content.conditions"
        :key="condition.label"
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
