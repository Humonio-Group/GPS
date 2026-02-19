<script setup lang="ts">
import { Calendar, Clock } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import ContentDetails from "~/components/course/content/ContentDetails.vue";
import ContentDetailItem from "~/components/course/content/header/ContentDetailItem.vue";
import { StatementFactory } from "~/types/entities/xapi";
import type { Content } from "~/types/entities/course";
import ContentGraphsSlider from "~/components/course/content/graphs/ContentGraphsSlider.vue";

const { t } = useI18n();

definePageMeta({
  layout: "course-content",
});

const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);
const content = inject("content") as ComputedRef<Content>;

watch(content, async (val) => {
  if (!val) return;

  useHead({
    title: `${val?.name} - ${course.value!.name}`,
  });
  const statementFactory = new StatementFactory(val);

  if (val.permissions.commentable) store.loadComments(val).then();

  if (val.completeOnOpen && val.progress.value < 1) {
    const { statement, headers } = statementFactory.prepare({
      id: "http://adlnet.gov/expapi/verbs/completed",
      display: {
        "en-US": "completed",
        "fr-FR": "complété",
      },
    });
    await store.sendXAPIStatement(val.reference, 1, statement, headers);
    return;
  }
  if (val.progress.viewed) return;

  const { statement, headers } = statementFactory.prepare({
    id: "http://adlnet.gov/expapi/verbs/initialized",
    display: {
      "en-US": "initialized",
      "fr-FR": "initalisé",
    },
  });
  await store.sendXAPIStatement(val.reference, 0, statement, headers);
}, { immediate: true });
const stage = computed(() => course.value!.stages.find(s => s.contents.map(c => c.id).includes(Number(content.value.id))));

const { formatDate, sameDate } = useDateUtils();
const { formatTime } = useTimeUtils();

const workshop = computed(() => {
  if (!content!.value?.activity.blended) return null;
  const { start, end } = content!.value!.activity.blended;
  const isSame = sameDate(start, end);

  return t("labels.date-time.interval", isSame ? 1 : 2, {
    named: {
      start: formatDate("medium")(start),
      end: formatDate("medium")(end),
      startTime: formatTime("short")(start),
      endTime: formatTime("short")(end),
    },
  });
});
</script>

<template>
  <PageRoot
    name="course.content-reader"
    class="pb-6! flex flex-col gap-6 flex-1"
  >
    <div
      v-if="loading.specific.activity && !content"
      class="h-24 w-full grid place-items-center"
    >
      <UiSpinner />
    </div>

    <template v-else-if="content">
      <header class="w-full max-w-4xl mx-auto pb-6 md:pt-8 lg:pt-12 xl:pt-16 2xl:pt-20 border-b flex flex-col gap-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtImg
              class="block aspect-square size-10 rounded-md bg-primary"
              :src="content.picture"
            />

            <div class="grid">
              <p
                v-if="stage"
                class="order-1 @lg:order-0 text-muted-foreground text-xs truncate leading-none"
              >
                {{ stage?.name }}
              </p>
              <h3 class="text-2xl font-bold leading-none">
                {{ content!.name }}
              </h3>
            </div>
          </div>

          <UiCircularProgress
            v-if="content!.progress.viewed"
            :model-value="content!.progress.value * 100"
          />
        </div>

        <ul
          v-if="content!.duration"
          class="grid gap-2"
        >
          <ContentDetailItem
            v-if="content!.duration"
            :icon="Clock"
            tooltip="labels.duration"
            :value="$t('labels.time.long.minutes', content!.duration, { named: { value: content!.duration } })"
          />
          <ContentDetailItem
            v-if="workshop"
            :icon="Calendar"
            tooltip="labels.workshop-date"
            :value="workshop"
          />
        </ul>
      </header>

      <ContentGraphsSlider
        v-if="content.progress.value >= 1 && content.graphs.length"
        :content="content!"
      />

      <ContentDetails :content="content!" />
    </template>
  </PageRoot>
</template>
