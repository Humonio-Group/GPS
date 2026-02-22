<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import CalendarView from "~/components/calendar/CalendarView.vue";

const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);

const events = computed(() => course.value?.events ?? []);

store.loadEvents();
</script>

<template>
  <PageRoot name="course.specific.events">
    <CalendarView
      class="flex-1 min-h-0"
      :views-allowed="['list', 'month', 'week', 'day']"
      :default-view="'list'"
      :events="events"
      :loading="loading.specific.events"
    />
  </PageRoot>
</template>
