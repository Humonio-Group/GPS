<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Check } from "lucide-vue-next";
import { computed } from "vue";
import { cn } from "@/lib/utils";

export interface CircularProgressProps {
  modelValue?: number;
  class?: HTMLAttributes["class"];
  showValue?: boolean;
  valueClass?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<CircularProgressProps>(), {
  modelValue: 0,
  showValue: false,
});

const SVG_SIZE = 120;
const STROKE_WIDTH = 16;

const radius = computed(() => (SVG_SIZE - STROKE_WIDTH) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const progress = computed(() => {
  const value = Math.min(100, Math.max(0, props.modelValue ?? 0));
  return circumference.value - (value / 100) * circumference.value;
});
const center = computed(() => SVG_SIZE / 2);
</script>

<template>
  <div
    data-slot="circular-progress"
    :class="cn('relative inline-flex items-center justify-center size-5', props.class)"
  >
    <Check
      v-if="modelValue >= 100"
      class="size-5 text-primary"
    />
    <template v-else>
      <svg
        :width="SVG_SIZE"
        :height="SVG_SIZE"
        :viewBox="`0 0 ${SVG_SIZE} ${SVG_SIZE}`"
        class="h-full w-full transform -rotate-90"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Background circle -->
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="STROKE_WIDTH"
          class="stroke-primary/20 fill-none"
        />

        <!-- Progress circle -->
        <circle
          data-slot="circular-progress-indicator"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="STROKE_WIDTH"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progress"
          class="stroke-primary fill-none transition-all"
          stroke-linecap="round"
        />
      </svg>

      <!-- Optional centered value display -->
      <div
        v-if="showValue"
        :class="cn('absolute inset-0 flex items-center justify-center text-sm font-semibold', valueClass)"
      >
        {{ Math.round(modelValue ?? 0) }}%
      </div>
    </template>
  </div>
</template>
