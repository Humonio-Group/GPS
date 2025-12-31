<script setup lang="ts">
import { ArrowRight, Award } from "lucide-vue-next";
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="inline-flex items-center gap-1">
        <Award class="size-4" />
        {{ $t("courses.specimen.results.badges.title") }}
      </UiCardTitle>
      <UiCardDescription>
        {{ $t("courses.specimen.results.badges.description", { course: "Formation à la plateforme Qigu" }) }} <!-- todo: bind program name - loic -->
      </UiCardDescription>
    </UiCardHeader>

    <UiCardContent>
      <div class="flex items-center gap-2 flex-wrap">
        <slot>
          <span class="text-muted-foreground italic">
            {{ $t("courses.specimen.results.badges.no-badges") }}
          </span>
        </slot>
      </div>
    </UiCardContent>

    <UiCardFooter class="justify-end">
      <UiButton
        size="sm"
        variant="link"
      >
        {{ $t("courses.specimen.results.badges.all-badges") }}
        <ArrowRight />
      </UiButton>
      <!-- todo: all badges dialog - loic -->
    </UiCardFooter>
  </UiCard>
</template>
