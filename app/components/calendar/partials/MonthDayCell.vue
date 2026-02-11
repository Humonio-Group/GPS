<script setup lang="ts">
import type { Event } from "~/types/entities/event";
import { isToday, isSameMonth } from "date-fns";
import EventBlock from "~/components/calendar/partials/EventBlock.vue";
import EventPopover from "~/components/calendar/partials/EventPopover.vue";

interface MonthDayCellProps {
  day: Date;
  currentMonth: Date;
  events: Event[];
  maxVisible?: number;
  lastRow?: boolean;
  lastCol?: boolean;
}

const props = withDefaults(defineProps<MonthDayCellProps>(), {
  maxVisible: 2,
});

const emit = defineEmits<{
  "select-day": [date: Date];
}>();

const { monthEventsForDay } = useCalendarEvents();

const dayEvents = computed(() => monthEventsForDay(props.events, props.day, props.maxVisible));
const visible = computed(() => dayEvents.value.visible);
const remaining = computed(() => dayEvents.value.remaining);

const isCurrentMonth = computed(() => isSameMonth(props.day, props.currentMonth));
const today = computed(() => isToday(props.day));
</script>

<template>
  <div
    :class="[
      'p-1 cursor-pointer transition-colors hover:bg-accent/50 overflow-hidden',
      !lastRow && 'border-b',
      !lastCol && 'border-r',
      !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
    ]"
    @click="emit('select-day', day)"
  >
    <div class="flex items-center justify-center mb-1">
      <span
        :class="[
          'text-sm flex items-center justify-center size-7 rounded-full',
          today && 'bg-primary text-primary-foreground font-bold',
        ]"
      >
        {{ day.getDate() }}
      </span>
    </div>

    <div
      class="grid gap-0.5"
      @click.stop
    >
      <UiPopover
        v-for="event in visible"
        :key="event.id"
      >
        <UiPopoverTrigger as-child>
          <EventBlock
            :event="event"
            variant="month"
          />
        </UiPopoverTrigger>
        <UiPopoverContent
          side="right"
          :side-offset="8"
          class="w-80"
        >
          <EventPopover :event="event" />
        </UiPopoverContent>
      </UiPopover>
      <button
        v-if="remaining > 0"
        class="text-xs text-muted-foreground hover:text-foreground transition-colors px-1 text-left"
        @click.stop="emit('select-day', day)"
      >
        {{ $t("calendar.more", { count: remaining }) }}
      </button>
    </div>
  </div>
</template>
