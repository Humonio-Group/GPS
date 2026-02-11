<script setup lang="ts">
import type { Event } from "~/types/entities/event";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import TimeGrid from "~/components/calendar/partials/TimeGrid.vue";
import EventBlock from "~/components/calendar/partials/EventBlock.vue";
import EventPopover from "~/components/calendar/partials/EventPopover.vue";

interface DayViewProps {
  currentDate: Date;
  events: Event[];
}

const props = defineProps<DayViewProps>();

const { eventsForDay, positionEvents } = useCalendarEvents();

const days = computed(() => [props.currentDate]);

const positionedEvents = computed(() => {
  return positionEvents(eventsForDay(props.events, props.currentDate), props.currentDate);
});
</script>

<template>
  <div class="flex flex-col isolate">
    <!-- Day header -->
    <div
      class="grid border-b sticky top-0 bg-card z-10"
      :style="{ gridTemplateColumns: '3.5rem 1fr' }"
    >
      <div class="border-r" />
      <div class="py-2 text-center">
        <div class="text-xs text-muted-foreground capitalize">
          {{ format(currentDate, "EEEE", { locale: fr }) }}
        </div>
        <div
          :class="[
            'text-lg font-semibold flex items-center justify-center mx-auto size-9 rounded-full',
            isToday(currentDate) && 'bg-primary text-primary-foreground',
          ]"
        >
          {{ format(currentDate, "d") }}
        </div>
      </div>
    </div>

    <!-- Time grid -->
    <TimeGrid :days="days">
      <template #day-0>
        <UiPopover
          v-for="posEvent in positionedEvents"
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
            side="bottom"
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
