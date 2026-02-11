<script setup lang="ts">
import { Gauge } from "lucide-vue-next";
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

    <UiCardContent />
  </UiCard>
</template>
