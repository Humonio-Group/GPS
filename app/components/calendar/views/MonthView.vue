<script setup lang="ts">
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import MonthDayCell from "~/components/calendar/partials/MonthDayCell.vue";
import type { Events } from "~/types/entities/event";

interface MonthViewProps {
  currentDate: Date;
  events: Events;
}

const props = defineProps<MonthViewProps>();

const emit = defineEmits<{
  "select-day": [date: Date];
}>();

const { monthDays } = useCalendarGrid();

const weeks = computed(() => monthDays(props.currentDate));

const weekdayHeaders = computed(() => {
  return weeks.value[0]?.map(day => format(day, "EEE", { locale: fr })) ?? [];
});
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Weekday headers -->
    <div class="shrink-0 grid grid-cols-7 border-b">
      <div
        v-for="(header, i) in weekdayHeaders"
        :key="i"
        :class="[
          'py-2 text-center text-sm font-medium text-muted-foreground capitalize',
          i < weekdayHeaders.length - 1 && 'border-r',
        ]"
      >
        {{ header }}
      </div>
    </div>

    <!-- Weeks -->
    <div
      class="h-full flex-1 min-h-0 grid"
      :style="{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }"
    >
      <div
        v-for="(week, weekIndex) in weeks"
        :key="weekIndex"
        class="grid grid-cols-7 min-h-0"
      >
        <MonthDayCell
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          :day="day"
          :current-month="currentDate"
          :events="events"
          :last-row="weekIndex === weeks.length - 1"
          :last-col="dayIndex === 6"
          @select-day="emit('select-day', $event)"
        />
      </div>
    </div>
  </div>
</template>
