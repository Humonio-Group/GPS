<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import CalendarView from "~/components/calendar/CalendarView.vue";

const store = useEventStore();
const { events, loading } = storeToRefs(store);

store.loadEvents();
</script>

<template>
  <PageRoot
    name="events"
    class="flex-1 flex flex-col min-h-0 p-6"
    wrapper
    wrapper-class="flex flex-col gap-6 mx-auto w-full flex-1 min-h-0"
  >
    <CalendarView
      class="flex-1 min-h-0"
      :events="events"
      :loading="loading"
    />
  </PageRoot>
</template>
