<script setup lang="ts">
import { ArrowRight, Award } from "lucide-vue-next";
import BadgeIcon from "~/components/course/results/badges/elements/BadgeIcon.vue";
import BadgesDialog from "~/components/course/results/badges/BadgesDialog.vue";

const store = useCoursesStore();
const { selectedCourse: course, unlockedBadges: badges } = storeToRefs(store);
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="inline-flex items-center gap-1">
        <Award class="size-4" />
        {{ $t("courses.specimen.results.badges.title") }}
      </UiCardTitle>
      <UiCardDescription>
        {{ $t("courses.specimen.results.badges.description", { course: course!.name }) }}
      </UiCardDescription>
    </UiCardHeader>

    <UiCardContent class="flex items-center gap-2 flex-wrap">
      <div
        v-if="!badges.length"
        class="flex items-center gap-2 flex-wrap"
      >
        <p class="text-sm text-muted-foreground italic">
          {{ $t("courses.specimen.results.badges.no-badges") }}
        </p>
      </div>
      <BadgeIcon
        v-for="badge in badges"
        :key="`c${course!.id}-b#${badge.id}`"
        :badge="badge"
      />
    </UiCardContent>

    <UiCardFooter class="justify-end">
      <BadgesDialog>
        <UiButton
          size="sm"
          variant="link"
        >
          {{ $t("courses.specimen.results.badges.all-badges") }}
          <ArrowRight />
        </UiButton>
      </BadgesDialog>
    </UiCardFooter>
  </UiCard>
</template>
