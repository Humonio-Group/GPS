<script setup lang="ts">
import { type Event, EventStatus } from "~/types/entities/event";
import { File, Video, MapPin, Clock, BookOpen, Users } from "lucide-vue-next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EventPopoverProps {
  event: Event;
}

const props = defineProps<EventPopoverProps>();

const { t } = useNuxtApp().$i18n;
const { alias } = useWorkspaceUtils();

const statusLabel = computed(() => {
  switch (props.event.status) {
    case EventStatus.INCOMING: return t("events.sections.incoming");
    case EventStatus.NOW: return t("events.sections.now", 1);
    case EventStatus.PASSED: return t("events.sections.passed");
    default: return "";
  }
});

const statusColor = computed(() => {
  switch (props.event.status) {
    case EventStatus.INCOMING: return "bg-blue-500";
    case EventStatus.NOW: return "bg-green-500";
    case EventStatus.PASSED: return "bg-muted-foreground/50";
    default: return "bg-muted-foreground/50";
  }
});

const dateLabel = computed(() => {
  const start = props.event.dates.start;
  const end = props.event.dates.end;
  const startDate = format(start, "EEEE d MMMM yyyy", { locale: fr });
  const startTime = format(start, "HH:mm", { locale: fr });
  const endTime = format(end, "HH:mm", { locale: fr });
  const endDate = format(end, "EEEE d MMMM yyyy", { locale: fr });

  if (startDate === endDate) {
    return `${startDate}, ${startTime} – ${endTime}`;
  }
  return `${format(start, "d MMM yyyy HH:mm", { locale: fr })} – ${format(end, "d MMM yyyy HH:mm", { locale: fr })}`;
});

const facilitatorNames = computed(() => {
  return props.event.facilitators.map(f => `${f.firstName} ${f.lastName}`).join(", ");
});
</script>

<template>
  <div class="grid gap-3 max-w-xs">
    <div class="grid gap-1">
      <div class="flex items-center gap-2">
        <span :class="['size-2.5 rounded-full shrink-0', statusColor]" />
        <span class="text-xs text-muted-foreground">{{ statusLabel }}</span>
      </div>
      <p class="font-semibold leading-snug">
        {{ event.name }}
      </p>
    </div>

    <div class="grid gap-2 text-sm">
      <div class="flex items-start gap-2 text-muted-foreground">
        <Clock class="size-4 shrink-0 mt-0.5" />
        <span>{{ dateLabel }}</span>
      </div>

      <div class="flex items-start gap-2 text-muted-foreground">
        <BookOpen class="size-4 shrink-0 mt-0.5" />
        <span>{{ event.course.name }} – {{ event.course.description }}</span>
      </div>

      <div
        v-if="event.facilitators.length"
        class="flex items-start gap-2 text-muted-foreground"
      >
        <Users class="size-4 shrink-0 mt-0.5" />
        <span>{{ facilitatorNames }}</span>
      </div>

      <div
        v-if="event.metadata.location"
        class="flex items-start gap-2 text-muted-foreground"
      >
        <MapPin class="size-4 shrink-0 mt-0.5" />
        <span>{{ event.metadata.location.name }}, {{ event.metadata.location.city }}</span>
      </div>
    </div>

    <div
      v-if="event.metadata.link || event.metadata.location?.mapsLink"
      class="flex items-center gap-2 pt-1 border-t"
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
          <Video class="size-4" />
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
          <MapPin class="size-4" />
          {{ $t("btn.open.map") }}
        </NuxtLink>
      </UiButton>
      <UiButton
        size="sm"
        variant="outline"
        as-child
      >
        <NuxtLinkLocale :to="`/${alias}/reader/${event.course.id}/${event.contentId}`">
          <File class="size-4" />
          {{ $t("btn.open.content") }}
        </NuxtLinkLocale>
      </UiButton>
    </div>
  </div>
</template>
