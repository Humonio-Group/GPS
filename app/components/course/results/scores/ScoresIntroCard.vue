<script setup lang="ts">
import { Gauge, Info } from "lucide-vue-next";

const { selectedCourse: course } = storeToRefs(useCoursesStore());
const scores = computed(() => course.value?.scores ?? []);
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="inline-flex items-center gap-2">
        <Gauge class="size-4" />
        {{ $t("courses.specimen.results.scores.title") }}
      </UiCardTitle>

      <UiCardDescription>
        {{ $t("courses.specimen.results.scores.description") }}
      </UiCardDescription>
    </UiCardHeader>

    <UiCardContent class="grid divide-y">
      <article
        v-for="(score, index) in scores"
        :key="`score-${score.id}`"
        class="py-3"
        :class="{ 'pt-0': index === 0, 'pb-0': index === scores.length - 1 }"
      >
        <header class="flex items-center gap-2">
          <p>{{ score.name }}</p>

          <UiPopover>
            <UiPopoverTrigger>
              <Info class="size-4 text-muted-foreground" />
            </UiPopoverTrigger>
            <UiPopoverContent>
              <header>
                <p class="font-bold">
                  {{ score.name }}
                </p>
                <p class="text-sm text-muted-foreground whitespace-pre-line text-pretty">
                  {{ score.description }}
                </p>
              </header>

              <UiSeparator class="my-3" />

              <main class="grid">
                <div class="flex items-baseline gap-3">
                  <span class="text-xs font-bold text-muted-foreground">MIN.</span>
                  <p>{{ score.config.min }}</p>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-xs font-bold text-muted-foreground">MAX.</span>
                  <p>{{ score.config.max }}</p>
                </div>
              </main>
            </UiPopoverContent>
          </UiPopover>
        </header>

        <main class="flex items-center gap-2">
          <UiProgress
            :model-value="score.progress.percent * 100"
            :style="`color: ${score.color}`"
          />
          <p
            class="text-sm font-semibold whitespace-nowrap"
            :style="`color: ${score.color}`"
          >
            {{ score.progress.value }} / {{ score.config.max }}
          </p>
        </main>
      </article>
    </UiCardContent>
  </UiCard>
</template>
