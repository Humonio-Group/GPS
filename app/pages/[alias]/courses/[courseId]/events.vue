<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import EventCard from "~/components/events/EventCard.vue";

const store = useCoursesStore();
const { selectedCourse: course, nowEvents, incomingEvents, passedEvents, loading } = storeToRefs(store);

const events = computed(() => course.value?.events ?? []);

store.loadEvents();
</script>

<template>
  <PageRoot name="course.specific.events">
    <div class="grid grid-cols-1 @xl:grid-cols-2 @2xl:grid-cols-3 gap-6">
      <div class="@2xl:col-span-2">
        <section
          v-if="incomingEvents.length"
          class="grid"
        >
          <header>
            <h2 class="text-lg font-bold">
              {{ $t("events.sections.incoming") }}
            </h2>
          </header>
          <main class="grid divide-y">
            <EventCard
              v-for="event in incomingEvents"
              :key="event.id"
              :event="event"
            />
          </main>
        </section>
        <section
          v-if="passedEvents.length"
          class="grid"
        >
          <header>
            <h2 class="text-lg font-bold">
              {{ $t("events.sections.passed") }}
            </h2>
          </header>
          <main class="grid divide-y">
            <EventCard
              v-for="event in passedEvents"
              :key="event.id"
              :event="event"
            />
          </main>
        </section>
      </div>

      <section class="grid @xl:sticky @xl:top-20 px-6 py-5 bg-card text-card-foreground border rounded-xl">
        <header class="flex items-center gap-2">
          <span class="block size-3 rounded-full bg-destructive animate-pulse" />

          <h2 class="text-lg font-bold">
            {{ $t("events.sections.now") }}
          </h2>
        </header>
        <main
          v-if="nowEvents.length"
          class="grid divide-y"
        >
          <EventCard
            v-for="event in nowEvents"
            :key="event.id"
            :event="event"
          />
        </main>
        <UiEmpty v-else>
          <UiEmptyHeader>
            <UiEmptyTitle>Oh non...</UiEmptyTitle>
            <UiEmptyDescription>Il semblerait qu'aucun événement ne soit en cours.</UiEmptyDescription>
          </UiEmptyHeader> <!-- todo: translate - loic -->
        </UiEmpty>
      </section>
    </div>

    <UiEmpty v-if="!events.length && !loading.specific.events">
      <UiEmptyHeader>
        <UiEmptyTitle>Oh non...</UiEmptyTitle>
        <UiEmptyDescription>Il semblerait que vous n'ayez aucun événement.</UiEmptyDescription>
      </UiEmptyHeader> <!-- todo: translate - loic -->
    </UiEmpty>

    <div
      v-if="loading.specific.events"
      class="grid place-items-center"
      :class="{ 'h-24': !events.length }"
    >
      <UiSpinner />
    </div>
  </PageRoot>
</template>
