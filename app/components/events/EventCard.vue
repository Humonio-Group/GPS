<script setup lang="ts">
import { type Event, EventStatus } from "~/types/entities/event";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

interface EventCardProps {
  event: Event;
  class?: HTMLAttributes["class"];
}

const props = defineProps<EventCardProps>();

const { relativeDate } = useDateUtils();
const { difference } = useTimeUtils();

const time = ref<string>();
const timer = useInterval(() => {
  time.value = difference(props.event.dates.end, new Date());
}, { immediate: true, delay: 30000 });

onMounted(() => {
  if (props.event.status !== EventStatus.NOW) return;
  timer.start();
});
</script>

<template>
  <div :class="cn('py-4 flex flex-col gap-4', props.class)">
    <div class="flex items-start gap-2">
      <!-- todo: upload avatar - loic -->
      <div class="grid auto-rows-min">
        <p>{{ event.name }}</p>
        <p class="text-sm text-muted-foreground">
          {{ event.course.name }} - {{ event.course.description }}
        </p>

        <div class="mt-3">
          <p
            v-if="event.status === EventStatus.PASSED"
            class="text-sm text-muted-foreground"
          >
            {{ $t("labels.time.ended", 2, { named: { time: relativeDate(event.dates.end) } }) }}
          </p>
          <p
            v-if="event.status === EventStatus.NOW"
            class="text-sm text-muted-foreground"
          >
            {{ $t("labels.time.ends-in", { time }) }}
          </p>
          <p
            v-if="event.status === EventStatus.INCOMING"
            class="text-sm text-muted-foreground"
          >
            {{ $t("labels.time.starts-in", { time: relativeDate(event.dates.start) }) }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <UiButton
        v-if="event.status === EventStatus.NOW && event.metadata.link"
        as-child
      >
        <NuxtLink
          :to="event.metadata.link"
          external
          target="_blank"
        >
          Rejoindre la visio
        </NuxtLink>
      </UiButton>
      <UiButton v-if="event.status === EventStatus.NOW && event.metadata.location?.mapsLink">
        <NuxtLink
          :to="event.metadata.location!.mapsLink"
          external
          target="_blank"
        >
          Ouvrir la carte
        </NuxtLink>
      </UiButton>
    </div>
  </div>
</template>
