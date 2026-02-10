<script setup lang="ts">
import { type Event, EventStatus } from "~/types/entities/event";
import type { CSSProperties } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "~/lib/utils";

interface EventBlockProps {
  event: Event;
  style?: CSSProperties;
  variant?: "month" | "time-grid";
}

const props = withDefaults(defineProps<EventBlockProps>(), {
  variant: "time-grid",
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const statusColor = computed(() => {
  switch (props.event.status) {
    case EventStatus.INCOMING: return "bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300";
    case EventStatus.NOW: return "bg-green-500/15 border-green-500/30 text-green-700 dark:text-green-300";
    case EventStatus.PASSED: return "bg-muted border-muted-foreground/20 text-muted-foreground";
    default: return "bg-muted border-muted-foreground/20 text-muted-foreground";
  }
});

const dotColor = computed(() => {
  switch (props.event.status) {
    case EventStatus.INCOMING: return "bg-blue-500";
    case EventStatus.NOW: return "bg-green-500";
    case EventStatus.PASSED: return "bg-muted-foreground/50";
    default: return "bg-muted-foreground/50";
  }
});

const timeLabel = computed(() => {
  return format(props.event.dates.start, "HH:mm", { locale: fr });
});
</script>

<template>
  <button
    :class="cn(
      'rounded-md border text-left transition-colors hover:opacity-80 cursor-pointer overflow-hidden',
      statusColor,
      variant === 'time-grid' ? 'absolute px-2 py-1 text-xs grid gap-0.5 content-start' : 'py-0.5 px-2 text-xs flex items-center gap-1.5 w-full',
    )"
    :style="variant === 'time-grid' ? style : undefined"
    @click="emit('click', event)"
  >
    <span
      v-if="variant === 'month'"
      :class="cn('size-1.5 shrink-0 rounded-full', dotColor)"
    />
    <span
      v-if="variant === 'time-grid'"
      class="text-[0.65rem] opacity-75"
    >
      {{ timeLabel }}
    </span>
    <span class="truncate font-medium">
      {{ event.name }}
    </span>
  </button>
</template>
