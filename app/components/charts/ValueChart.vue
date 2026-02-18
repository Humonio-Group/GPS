<script setup lang="ts">
import type { ValueChartData } from "~/types/entities/graph";

defineProps<{
  data: ValueChartData;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full gap-1">
    <span class="text-7xl font-black text-primary">
      {{ data.title }}{{ data.percent ? "%" : "" }}
    </span>
    <span class="text-sm text-muted-foreground">
      {{ data.subtitle }}
    </span>
  </div>
</template>
