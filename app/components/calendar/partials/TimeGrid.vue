<script setup lang="ts">
import { isToday } from "date-fns";

interface TimeGridProps {
  days: Date[];
}

const props = defineProps<TimeGridProps>();

const { hours } = useCalendarGrid();

const nowPosition = ref<number | null>(null);
const todayColumnIndex = computed(() => props.days.findIndex(d => isToday(d)));

const updateNowPosition = () => {
  if (todayColumnIndex.value === -1) {
    nowPosition.value = null;
    return;
  }
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  nowPosition.value = (minutes / 1440) * 100;
};

let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  updateNowPosition();
  intervalId = setInterval(updateNowPosition, 60000);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div
    class="relative grid overflow-auto"
    style="grid-template-columns: 3.5rem 1fr;"
  >
    <!-- Time labels column -->
    <div class="border-r">
      <div
        v-for="hour in hours"
        :key="hour"
        class="h-14 flex items-start justify-end pr-2 text-xs text-muted-foreground select-none"
      >
        <span class="relative -top-2.5">{{ hour.toString().padStart(2, "0") }}:00</span>
      </div>
    </div>

    <!-- Events area -->
    <div class="relative">
      <div
        class="grid"
        :style="{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }"
      >
        <div
          v-for="(day, dayIndex) in days"
          :key="dayIndex"
          class="relative border-r last:border-r-0"
        >
          <!-- Hour lines -->
          <div
            v-for="hour in hours"
            :key="hour"
            class="h-14 border-b border-border/50"
          />

          <!-- Events slot -->
          <div class="absolute inset-0">
            <slot
              :name="`day-${dayIndex}`"
              :day="day"
            />
          </div>

          <!-- Now indicator -->
          <div
            v-if="todayColumnIndex === dayIndex && nowPosition !== null"
            class="absolute left-0 right-0 z-10 pointer-events-none"
            :style="{ top: `${nowPosition}%` }"
          >
            <div class="relative flex items-center">
              <span class="absolute -left-1.5 size-3 rounded-full bg-red-500" />
              <span class="w-full h-0.5 bg-red-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
