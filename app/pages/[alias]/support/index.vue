<script setup lang="ts">
import { MessageSquareDashed } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
</script>

<template>
  <PageRoot
    name="support.empty"
    class="flex flex-col h-full"
  >
    <UiEmpty>
      <UiEmptyHeader>
        <UiEmptyMedia variant="icon">
          <MessageSquareDashed class="text-muted-foreground" />
        </UiEmptyMedia>
        <UiEmptyTitle>
          {{ $t("support.no-selected.title") }}
        </UiEmptyTitle>
        <UiEmptyDescription>
          {{ $t("support.no-selected.description") }}
        </UiEmptyDescription>
      </UiEmptyHeader>
    </UiEmpty>
  </PageRoot>
</template>
