<script setup lang="ts">
import type { Event } from "~/types/entities/event";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import TimeGrid from "~/components/calendar/partials/TimeGrid.vue";
import EventBlock from "~/components/calendar/partials/EventBlock.vue";
import EventPopover from "~/components/calendar/partials/EventPopover.vue";

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

const props = defineProps<WeekViewProps>();

const emit = defineEmits<{
  "select-day": [date: Date];
  "select-event": [event: Event];
}>();

const { weekDays } = useCalendarGrid();
const { eventsForDay, positionEvents } = useCalendarEvents();

const days = computed(() => weekDays(props.currentDate));

const dayPositionedEvents = computed(() => {
  return days.value.map(day => positionEvents(eventsForDay(props.events, day), day));
});
</script>

<template>
  <div class="flex flex-col isolate">
    <!-- Day headers -->
    <div
      class="sticky top-0 grid border-b bg-card z-10"
      :style="{ gridTemplateColumns: '3.5rem repeat(7, 1fr)' }"
    >
      <div class="border-r" />
      <div
        v-for="(day, i) in days"
        :key="i"
        class="py-2 text-center border-r last:border-r-0 cursor-pointer hover:bg-accent/50 transition-colors"
        @click="emit('select-day', day)"
      >
        <div class="text-xs text-muted-foreground capitalize">
          {{ format(day, "EEE", { locale: fr }) }}
        </div>
        <div
          :class="[
            'text-lg font-semibold flex items-center justify-center mx-auto size-9 rounded-full',
            isToday(day) && 'bg-primary text-primary-foreground',
          ]"
        >
          {{ format(day, "d") }}
        </div>
      </div>
    </div>

    <!-- Time grid -->
    <TimeGrid :days="days">
      <template
        v-for="(day, dayIndex) in days"
        :key="dayIndex"
        #[`day-${dayIndex}`]
      >
        <UiPopover
          v-for="posEvent in dayPositionedEvents[dayIndex]"
          :key="posEvent.event.id"
        >
          <UiPopoverTrigger as-child>
            <EventBlock
              :event="posEvent.event"
              :style="posEvent.style"
              variant="time-grid"
            />
          </UiPopoverTrigger>
          <UiPopoverContent
            side="right"
            :side-offset="8"
            class="w-80"
          >
            <EventPopover :event="posEvent.event" />
          </UiPopoverContent>
        </UiPopover>
      </template>
    </TimeGrid>
  </div>
</template>
