<script setup lang="ts">
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import ContentDetails from "~/components/course/content/ContentDetails.vue";
import ContentDetailItem from "~/components/course/content/header/ContentDetailItem.vue";
import { StatementFactory } from "~/types/entities/xapi";
import type { Content } from "~/types/entities/course";

const { t } = useI18n();

definePageMeta({
  layout: "course-content",
});

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

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
    class="p-6 pt-4 flex flex-col gap-6 flex-1"
  >
    <div
      v-if="loading.specific.activity && !content"
      class="h-24 w-full grid place-items-center"
    >
      <UiSpinner />
    </div>
    <template v-else-if="content">
      <header class="w-full max-w-4xl mx-auto pb-6 border-b flex flex-col gap-6">
        <div class="flex items-center justify-between">
          <p class="text-2xl font-bold">
            {{ content!.name }}
          </p>

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

      <ContentDetails :content="content!" />

      <footer class="w-full max-w-4xl mx-auto flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <UiButton
          variant="link"
          :disabled="!content.navigation.previous"
          :as-child="content.navigation.previous !== null"
        >
          <NuxtLinkLocale
            v-if="content.navigation.previous"
            :to="`/${alias}/reader/${id}/${content.navigation.previous}`"
          >
            <ArrowLeft />
            {{ $t("btn.previous-content") }}
          </NuxtLinkLocale>
          <template v-else>
            <ArrowLeft />
            {{ $t("btn.previous-content") }}
          </template>
        </UiButton>

        <p
          v-if="stage"
          class="order-1 @lg:order-0 text-muted-foreground text-sm text-center truncate"
        >
          {{ stage?.name }}
        </p>

        <UiButton
          variant="link"
          :disabled="!content.navigation.next"
          :as-child="content.navigation.next !== null"
        >
          <NuxtLinkLocale
            v-if="content.navigation.next"
            :to="`/${alias}/reader/${id}/${content.navigation.next}`"
          >
            {{ $t("btn.next-content") }}
            <ArrowRight />
          </NuxtLinkLocale>
          <template v-else>
            {{ $t("btn.next-content") }}
            <ArrowRight />
          </template>
        </UiButton>
      </footer>
    </template>
  </PageRoot>
</template>
