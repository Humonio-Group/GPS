<script setup lang="ts">
import { ChartSpline, Clock } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import StatCard from "~/components/course/results/stats/StatCard.vue";
import BadgeIntroCard from "~/components/course/results/badges/BadgeIntroCard.vue";
import StatsGrid from "~/components/course/results/stats/StatsGrid.vue";
import CertificationIntroCard from "~/components/course/results/certifications/CertificationIntroCard.vue";

const id = computed(() => useRoute().params.courseId as string);
const { fromMinutes } = useTimeUtils();
const { parsePercent } = useNumberUtils();
</script>

<template>
  <PageRoot
    :name="`courses.specimen.${id}.results`"
    class="text-sm text-muted-foreground @container/results grid gap-4"
  >
    <StatsGrid>
      <StatCard>
        <template #icon>
          <Clock />
        </template>
        <template #value>
          {{ fromMinutes(255) }}
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
          {{ parsePercent(.4) }}
        </template>
        <template #label>
          {{ $t("courses.specimen.results.stats.progress") }}
        </template>
      </StatCard>
    </StatsGrid>

    <BadgeIntroCard />

    <CertificationIntroCard />
  </PageRoot>
</template>
