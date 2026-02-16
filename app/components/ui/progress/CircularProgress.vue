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
  filled?: boolean;
}

const props = withDefaults(defineProps<CircularProgressProps>(), {
  modelValue: 0,
  showValue: false,
  filled: false,
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
    :class="cn('shrink-0 aspect-square relative inline-grid place-items-center size-5 text-primary', props.class)"
  >
    <template v-if="modelValue >= 100">
      <div
        v-if="filled"
        class="aspect-square size-full rounded-full grid place-items-center bg-primary text-primary-foreground"
      >
        <Check class="size-3.5" />
      </div>
      <Check
        v-else
        class="size-full"
      />
    </template>
    <template v-else>
      <svg
        :viewBox="`0 0 ${SVG_SIZE} ${SVG_SIZE}`"
        class="size-full transform -rotate-90"
      >
        <!-- Background circle -->
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="STROKE_WIDTH"
          class="stroke-[currentColor]/20 fill-none"
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
          class="stroke-[currentColor] fill-none transition-all"
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
