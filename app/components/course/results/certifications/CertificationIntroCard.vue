<script setup lang="ts">
import { Newspaper } from "lucide-vue-next";
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="inline-flex items-center gap-2">
        <Newspaper class="size-4" />
        {{ $t("courses.specimen.results.certifications.title") }}
      </UiCardTitle>

      <UiCardDescription>
        {{ $t("courses.specimen.results.certifications.description") }}
      </UiCardDescription>
    </UiCardHeader>

    <UiCardContent />
  </UiCard>
</template>
