<script setup lang="ts">
import type { Events } from "~/types/entities/event";
import { CalendarX } from "lucide-vue-next";
import CalendarToolbar from "~/components/calendar/CalendarToolbar.vue";
import MonthView from "~/components/calendar/views/MonthView.vue";
import WeekView from "~/components/calendar/views/WeekView.vue";
import DayView from "~/components/calendar/views/DayView.vue";
import ListView from "~/components/calendar/views/ListView.vue";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";
import type { CalendarViewType } from "~/types/entities/calendar";
import { startOfDay, endOfDay } from "date-fns";

interface CalendarViewProps {
  events: Events;
  loading?: boolean;
  viewsAllowed?: CalendarViewType[];
  defaultView?: CalendarViewType;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<CalendarViewProps>(), {
  loading: false,
});

const { currentDate, view, next, prev, goToToday, goToDate, currentLabel } = useCalendarNavigation();
if (props.defaultView) view.value = props.defaultView;

const filterStart = ref("");
const filterEnd = ref("");

const filteredEvents = computed<Events>(() => {
  if (!filterStart.value && !filterEnd.value) return props.events;

  const rangeStart = filterStart.value ? startOfDay(new Date(filterStart.value)).getTime() : 0;
  const rangeEnd = filterEnd.value ? endOfDay(new Date(filterEnd.value)).getTime() : Infinity;

  return props.events.filter((event) => {
    const eventStart = event.dates.start.getTime();
    const eventEnd = event.dates.end.getTime();
    return eventStart < rangeEnd && eventEnd > rangeStart;
  });
});

const handleSelectDay = (date: Date) => {
  goToDate(date);
  view.value = "day";
};
</script>

<template>
  <div :class="cn('flex flex-col min-h-0', props.class)">
    <div class="shrink-0">
      <CalendarToolbar
        :label="currentLabel"
        :view="view"
        :views-allowed="viewsAllowed"
        :filter-start="filterStart"
        :filter-end="filterEnd"
        @prev="prev"
        @next="next"
        @today="goToToday"
        @update:view="view = $event"
        @update:filter-start="filterStart = $event"
        @update:filter-end="filterEnd = $event"
      />
    </div>

    <div
      class="min-h-0 rounded-lg border bg-card text-card-foreground overflow-y-auto"
      :class="{ 'flex-1': view !== 'list' }"
    >
      <div
        v-if="loading && !filteredEvents.length"
        class="flex items-center justify-center h-96"
      >
        <UiSpinner />
      </div>

      <template v-else-if="filteredEvents.length">
        <MonthView
          v-if="view === 'month'"
          :current-date="currentDate"
          :events="filteredEvents"
          @select-day="handleSelectDay"
        />
        <WeekView
          v-else-if="view === 'week'"
          :current-date="currentDate"
          :events="filteredEvents"
          @select-day="handleSelectDay"
        />
        <DayView
          v-else-if="view === 'day'"
          :current-date="currentDate"
          :events="filteredEvents"
        />
        <ListView
          v-else
          :current-date="currentDate"
          :events="filteredEvents"
        />
      </template>

      <div
        v-else
        class="flex items-center justify-center h-96"
      >
        <UiEmpty>
          <UiEmptyHeader>
            <UiEmptyMedia variant="icon">
              <CalendarX class="text-muted-foreground" />
            </UiEmptyMedia>
            <UiEmptyTitle>
              {{ $t("events.empty.sessions.title") }}
            </UiEmptyTitle>
            <UiEmptyDescription>
              {{ $t("events.empty.sessions.description") }}
            </UiEmptyDescription>
          </UiEmptyHeader>
        </UiEmpty>
      </div>
    </div>
  </div>
</template>
