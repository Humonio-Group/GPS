<script setup lang="ts">
import type { IndividualChoiceChartData } from "~/types/entities/graph";
import { CircleCheck, Circle } from "lucide-vue-next";

defineProps<{
  data: IndividualChoiceChartData;
}>();
</script>

<template>
  <div class="h-full w-full overflow-y-auto flex flex-col gap-2">
    <div
      v-for="(item, index) in data.series"
      :key="`choice-${index}`"
      class="flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors"
      :class="item.checked
        ? 'bg-primary/10 border-primary'
        : 'border-border'"
    >
      <img
        v-if="item.picture"
        :src="item.picture"
        :alt="item.name"
        class="size-10 rounded-full object-cover shrink-0"
      >

      <div class="flex-1 min-w-0">
        <p
          class="text-sm truncate"
          :class="item.checked ? 'font-semibold text-primary' : 'text-foreground'"
        >
          {{ item.name }}
        </p>
        <p
          v-if="item.description"
          class="text-xs text-muted-foreground mt-0.5 truncate"
        >
          {{ item.description }}
        </p>
      </div>

      <CircleCheck
        v-if="item.checked"
        class="size-5 shrink-0 text-primary"
      />
      <Circle
        v-else
        class="size-5 shrink-0 text-muted-foreground/40"
      />
    </div>
  </div>
</template>
