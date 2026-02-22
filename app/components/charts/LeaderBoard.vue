<script setup lang="ts">
import { Search, X } from "lucide-vue-next";
import type { LeaderBoardChartData } from "~/types/entities/graph";

const props = defineProps<{
  data: LeaderBoardChartData;
}>();

const sortedSeries = computed(() =>
  [...props.data.series].sort((a, b) => a.position - b.position),
);
const { search, results, clear } = useSearch(sortedSeries, "label");

function getInitials(label: string): string {
  return label
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
</script>

<template>
  <div class="h-full w-full p-2 overflow-y-auto flex flex-col gap-1.5">
    <div class="relative mb-2">
      <UiButton
        v-if="search.length"
        variant="ghost"
        size="icon-xs"
        class="size-6 rounded-full absolute top-1.5 left-1.5"
        @click="clear"
      >
        <X />
      </UiButton>
      <Search
        v-else
        class="size-4 text-muted-foreground absolute top-2.5 left-2.5"
      />

      <UiInput
        v-model="search"
        :placeholder="$t('labels.search')"
        class="pl-8"
      />
    </div>

    <div
      v-for="entry in results"
      :key="`lb-${entry.position}`"
      class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors border"
      :class="{
        'bg-yellow-500/10 border-yellow-500': entry.position === 1,
        'bg-gray-400/10 border-gray-400': entry.position === 2,
        'bg-amber-700/10 border-amber-700': entry.position === 3,
        'bg-primary/10 border-primary': entry.position > 3 && entry.highlighted,
        'border-transparent hover:bg-muted/50': entry.position > 3 && !entry.highlighted,
      }"
    >
      <span class="flex items-center justify-center text-xs font-bold w-6 shrink-0 text-muted-foreground">
        {{ entry.position }}
      </span>

      <img
        v-if="entry.picture"
        :src="entry.picture"
        :alt="entry.label"
        class="size-8 rounded-full object-cover shrink-0"
      >
      <span
        v-else
        class="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0"
      >
        {{ getInitials(entry.label) }}
      </span>

      <span
        class="flex-1 text-sm truncate"
        :class="entry.highlighted ? 'font-semibold' : 'font-normal'"
      >
        {{ entry.label }}
      </span>

      <span class="text-sm font-semibold tabular-nums shrink-0">
        {{ entry.value }}
      </span>
    </div>
  </div>
</template>
