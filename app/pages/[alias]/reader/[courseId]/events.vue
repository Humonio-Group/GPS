<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import { CalendarX } from "lucide-vue-next";
import CalendarView from "~/components/calendar/CalendarView.vue";

const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);

const events = computed(() => course.value?.events ?? []);

store.loadEvents();
</script>

<template>
  <PageRoot name="course.specific.events">
    <div class="">
      <!-- <template v-if="false">
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

          <UiEmpty v-if="!loading.specific.events && !passedEvents.length && !incomingEvents.length">
            <UiEmptyHeader>
              <UiEmptyTitle>
                {{ $t("events.empty.other-sessions.title") }}
              </UiEmptyTitle>
              <UiEmptyDescription>
                {{ $t("events.empty.other-sessions.description") }}
              </UiEmptyDescription>
            </UiEmptyHeader>
          </UiEmpty>
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
              <UiEmptyTitle>
                {{ $t("events.empty.active-sessions.title") }}
              </UiEmptyTitle>
              <UiEmptyDescription>
                {{ $t("events.empty.active-sessions.description") }}
              </UiEmptyDescription>
            </UiEmptyHeader>
          </UiEmpty>
        </section>
      </template> -->

      <CalendarView
        class="flex-1 min-h-0"
        :views-allowed="['list']"
        :default-view="'list'"
        :events="events"
        :loading="loading.specific.events"
      />
    </div>
  </PageRoot>
</template>
