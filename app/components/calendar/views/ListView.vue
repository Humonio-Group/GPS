<script setup lang="ts">
import { type Event, EventStatus } from "~/types/entities/event";
import { File, Video, MapPin, Clock, BookOpen, Users } from "lucide-vue-next";
import { format, startOfMonth, endOfMonth, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface ListViewProps {
  currentDate: Date;
  events: Event[];
}

const props = defineProps<ListViewProps>();
const { alias } = useWorkspaceUtils();

interface DayGroup {
  date: Date;
  events: Event[];
}

const groupedEvents = computed<DayGroup[]>(() => {
  const monthStart = startOfMonth(props.currentDate);
  const monthEnd = endOfMonth(props.currentDate);
  const startTime = monthStart.getTime();
  const endTime = monthEnd.getTime();

  const filtered = props.events
    .filter((e) => {
      const eStart = e.dates.start.getTime();
      const eEnd = e.dates.end.getTime();
      return eStart < endTime && eEnd > startTime;
    })
    .sort((a, b) => a.dates.start.getTime() - b.dates.start.getTime());

  const groups = new Map<string, DayGroup>();
  for (const event of filtered) {
    const key = format(event.dates.start, "yyyy-MM-dd");
    const existing = groups.get(key);
    if (existing) {
      existing.events.push(event);
    }
    else {
      groups.set(key, { date: event.dates.start, events: [event] });
    }
  }

  return Array.from(groups.values());
});

const statusDot = (status: EventStatus): string => {
  switch (status) {
    case EventStatus.INCOMING: return "bg-blue-500";
    case EventStatus.NOW: return "bg-green-500";
    case EventStatus.PASSED: return "bg-muted-foreground/50";
    default: return "bg-muted-foreground/50";
  }
};

const timeRange = (event: Event): string => {
  return `${format(event.dates.start, "HH:mm", { locale: fr })} – ${format(event.dates.end, "HH:mm", { locale: fr })}`;
};

const facilitatorNames = (event: Event): string => {
  return event.facilitators.map(f => `${f.firstName} ${f.lastName}`).join(", ");
};
</script>

<template>
  <div class="divide-y">
    <div
      v-if="!groupedEvents.length"
      class="flex items-center justify-center py-16 text-muted-foreground text-sm"
    >
      {{ $t("calendar.list-empty") }}
    </div>

    <div
      v-for="group in groupedEvents"
      :key="group.date.toISOString()"
      class="grid grid-cols-[8rem_1fr] gap-4 py-4 px-4"
    >
      <!-- Date column -->
      <div class="flex flex-col items-start gap-0.5 pt-1">
        <span class="text-xs text-muted-foreground uppercase">
          {{ format(group.date, "EEEE", { locale: fr }) }}
        </span>
        <span
          :class="[
            'text-2xl font-bold leading-none',
            isToday(group.date) && 'text-primary',
          ]"
        >
          {{ format(group.date, "d") }}
        </span>
        <span class="text-xs text-muted-foreground">
          {{ format(group.date, "MMMM", { locale: fr }) }}
        </span>
      </div>

      <!-- Events column -->
      <div class="grid gap-2">
        <div
          v-for="event in group.events"
          :key="event.id"
          class="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
        >
          <span :class="['size-2.5 rounded-full shrink-0 mt-1.5', statusDot(event.status)]" />

          <div class="grid gap-1 min-w-0 flex-1">
            <p class="font-medium leading-snug">
              {{ event.name }}
            </p>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span class="flex items-center gap-1.5">
                <Clock class="size-3.5 shrink-0" />
                {{ timeRange(event) }}
              </span>
              <span class="flex items-center gap-1.5">
                <BookOpen class="size-3.5 shrink-0" />
                {{ event.course.name }}
              </span>
              <span
                v-if="event.facilitators.length"
                class="flex items-center gap-1.5"
              >
                <Users class="size-3.5 shrink-0" />
                {{ facilitatorNames(event) }}
              </span>
              <span
                v-if="event.metadata.location"
                class="flex items-center gap-1.5"
              >
                <MapPin class="size-3.5 shrink-0" />
                {{ event.metadata.location.name }}
              </span>
            </div>

            <div
              v-if="event.metadata.link || event.metadata.location?.mapsLink"
              class="flex items-center gap-2 mt-1"
            >
              <UiButton
                v-if="event.metadata.link"
                size="sm"
                variant="outline"
                as-child
              >
                <NuxtLink
                  :to="event.metadata.link"
                  external
                  target="_blank"
                >
                  <Video class="size-3.5" />
                  {{ $t("calendar.join-video") }}
                </NuxtLink>
              </UiButton>
              <UiButton
                v-if="event.metadata.location?.mapsLink"
                size="sm"
                variant="outline"
                as-child
              >
                <NuxtLink
                  :to="event.metadata.location!.mapsLink"
                  external
                  target="_blank"
                >
                  <MapPin class="size-3.5" />
                  {{ $t("btn.open.map") }}
                </NuxtLink>
              </UiButton>
              <UiButton
                size="sm"
                variant="outline"
                as-child
              >
                <NuxtLink :to="`/${alias}/reader/${event.course.id}/${event.contentId}`">
                  <File class="size-3.5" />
                  {{ $t("btn.open.content") }}
                </NuxtLink>
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
