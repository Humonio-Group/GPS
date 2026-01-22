<script setup lang="ts">
import { CalendarX, Search, X } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import EventCard from "~/components/events/EventCard.vue";

const store = useEventStore();
const { events, passedEvents, nowEvents, incomingEvents, loading } = storeToRefs(store);
const search = ref<string>("");

const now = computed(() => nowEvents.value.filter((e) => {
  if (e.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim())) return true;
  if (e.course.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim())) return true;
  return e.course.description.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim());
}));
const incoming = computed(() => incomingEvents.value.filter((e) => {
  if (e.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim())) return true;
  if (e.course.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim())) return true;
  return e.course.description.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim());
}));
const passed = computed(() => passedEvents.value.filter((e) => {
  if (e.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim())) return true;
  if (e.course.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim())) return true;
  return e.course.description.toLocaleLowerCase().includes(search.value.toLocaleLowerCase().trim());
}));

store.loadEvents();
</script>

<template>
  <PageRoot
    name="events"
    wrapper
    wrapper-class="grid gap-10 mx-auto w-full max-w-7xl"
  >
    <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div class="grid">
        <h1 class="text-3xl font-bold">
          {{ $t("events.title") }}
        </h1>
        <p class="text-muted-foreground max-w-[40ch]">
          {{ $t("events.caption") }}
        </p>
      </div>

      <div class="relative">
        <UiButton
          v-if="search.length"
          variant="ghost"
          size="icon-xs"
          class="rounded-full absolute top-1 left-1"
          @click="search = ''"
        >
          <X />
        </UiButton>
        <Search
          v-else
          class="size-4 absolute top-2.5 left-2.5 text-muted-foreground"
        />
        <UiInput
          v-model="search"
          class="pl-8"
          :placeholder="$t('labels.search')"
        />
      </div>
    </header>

    <main
      v-if="events.length"
      class="grid grid-cols-1 @xl:grid-cols-2 @2xl:grid-cols-3 gap-8"
    >
      <div class="@container/events @2xl:col-span-2 grid gap-8">
        <section
          v-if="incoming.length"
          class="grid @lg:col-span-2"
        >
          <h2 class="text-lg font-bold">
            {{ $t("events.sections.incoming") }}
          </h2>
          <div class="grid gap-4 divide-y">
            <EventCard
              v-for="(event, index) in incoming"
              :key="index"
              :event="event"
              class="px-0"
            />
          </div>
        </section>

        <section
          v-if="passed.length"
          class="grid @lg:col-span-2"
        >
          <h2 class="text-lg font-bold">
            {{ $t("events.sections.passed") }}
          </h2>
          <div class="grid gap-4 divide-y">
            <EventCard
              v-for="(event, index) in passed"
              :key="index"
              :event="event"
              class="px-0"
            />
          </div>
        </section>
      </div>

      <section class="@container/events @xl:sticky @xl:top-20 grid h-min gap-2 px-6 pt-5 pb-2 rounded-xl border bg-card text-card-foreground row-start-1 @xl:row-auto @xl:col-start-2 @2xl:col-start-3 auto-rows-min">
        <header class="flex items-center gap-3">
          <span class="block size-3 rounded-full bg-destructive animate-pulse" />

          <h2 class="text-lg font-bold">
            {{ $t("events.sections.now", now.length) }}
          </h2>
        </header>

        <div
          v-if="now.length"
          class="grid divide-y!"
        >
          <EventCard
            v-for="(event, index) in now"
            :key="index"
            :event="event"
            class="px-0"
          />
        </div>
        <UiEmpty v-else>
          <UiEmptyHeader>
            <UiEmptyTitle>Oh non...</UiEmptyTitle>
            <UiEmptyDescription>Il semblerait que vous n'ayez aucun session en cours.</UiEmptyDescription>
          </UiEmptyHeader>
        </UiEmpty>
      </section>
    </main>

    <UiEmpty v-if="!events.length && !loading">
      <UiEmptyHeader>
        <UiEmptyMedia variant="icon">
          <CalendarX class="text-muted-foreground" />
        </UiEmptyMedia>
        <UiEmptyTitle>
          Oh non...
        </UiEmptyTitle>
        <UiEmptyDescription>
          Il semblerait que vous n'ayez eu aucune session.
        </UiEmptyDescription>
      </UiEmptyHeader>
    </UiEmpty>

    <div
      v-if="loading"
      class="w-full grid place-items-center"
      :class="{ 'h-24': !events.length }"
    >
      <UiSpinner />
    </div>
  </PageRoot>
</template>
