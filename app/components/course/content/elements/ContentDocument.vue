<script setup lang="ts">
import { Eye, SquareArrowOutUpRight } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";

interface ContentDocumentProps {
  content: Content;
}

defineProps<ContentDocumentProps>();
</script>

<template>
  <UiCard class="w-full mx-auto max-w-4xl">
    <UiCardContent class="flex items-center justify-between">
      <p class="truncate text-muted-foreground">
        {{ content.activity.document!.name }}
      </p>

      <div class="flex items-center gap-1">
        <UiButton
          size="icon"
          variant="outline"
          disabled
        >
          <Eye />
        </UiButton>
        <UiButton
          size="icon"
          variant="outline"
          as-child
        >
          <NuxtLink
            :to="content.activity.document!.url"
            external
          >
            <SquareArrowOutUpRight />
          </NuxtLink>
        </UiButton>
      </div>
    </UiCardContent>
  </UiCard>
</template>
