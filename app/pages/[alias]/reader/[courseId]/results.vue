<script setup lang="ts">
import { ChartSpline, Clock } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import StatCard from "~/components/course/results/stats/StatCard.vue";
import BadgeIntroCard from "~/components/course/results/badges/BadgeIntroCard.vue";
import StatsGrid from "~/components/course/results/stats/StatsGrid.vue";
import CertificationIntroCard from "~/components/course/results/certifications/CertificationIntroCard.vue";
import ScoresIntroCard from "~/components/course/results/scores/ScoresIntroCard.vue";

const { t } = useI18n();

const store = useCoursesStore();
const { selectedCourse: course } = storeToRefs(store);

const id = computed(() => useRoute().params.courseId as string);
const { fromMinutes } = useTimeUtils();
const { parsePercent } = useNumberUtils();

watch(course, val => useHead({
  title: t("courses.specimen.results.title", { name: val!.name }),
}), { immediate: true });
</script>

<template>
  <PageRoot
    :name="`courses.specimen.${id}.results`"
    class="w-full p-6"
    wrapper
    wrapper-class="text-sm @container/results grid gap-4 max-w-7xl w-full mx-auto"
  >
    <h1 class="text-3xl font-extrabold">
      {{ $t("courses.specimen.results.page-title") }}
    </h1>

    <StatsGrid>
      <StatCard>
        <template #icon>
          <Clock />
        </template>
        <template #value>
          {{ fromMinutes(store.totalDurationPassed) }}
        </template>
        <template #label>
          {{ $t("courses.specimen.results.stats.time-elapsed") }}
        </template>
      </StatCard>
      <StatCard>
        <template #icon>
          <ChartSpline />
        </template>
        <template #value>
          {{ parsePercent(store.courseProgress) }}
        </template>
        <template #label>
          {{ $t("courses.specimen.results.stats.progress") }}
        </template>
      </StatCard>
    </StatsGrid>

    <BadgeIntroCard v-if="course!.badges.length" />

    <ScoresIntroCard v-if="course!.scores.length" />

    <CertificationIntroCard v-if="false" /> <!-- todo: implement certificates - loic -->
  </PageRoot>
</template>
