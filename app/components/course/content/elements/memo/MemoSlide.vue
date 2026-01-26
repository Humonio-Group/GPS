<script setup lang="ts">
import type { PageActivity } from "~/types/entities/activity";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";

interface MemoSlideProps {
  slide: PageActivity;
}

defineProps<MemoSlideProps>();
</script>

<template>
  <UiCard class="h-full max-h-[80dvh] md:max-h-[75dvh] lg:max-h-[70dvh] overflow-y-auto">
    <UiCardContent class="grid gap-4">
      <template
        v-for="element in slide.elements"
        :key="`element#${element.order}`"
      >
        <div
          v-if="element.type === 'picture' && element.url"
          class="grid gap-2"
        >
          <div class="aspect-16/11 @lg/slide-item:aspect-video grid place-items-center">
            <NuxtImg
              :src="element.url"
              class="max-h-full max-w-full rounded-lg mx-auto"
            />
          </div>
          <span
            v-if="element.text.length"
            class="text-sm text-muted-foreground"
          >{{ element.text }}</span>
        </div>
        <MarkdownRenderer
          v-if="element.type === 'body'"
          :content="element.text"
          use-markdown
        />
      </template>
    </UiCardContent>
  </UiCard>
</template>
