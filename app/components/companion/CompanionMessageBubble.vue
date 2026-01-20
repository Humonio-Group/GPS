<script setup lang="ts">
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";
import CompanionMessageContext from "~/components/companion/CompanionMessageContext.vue";

interface AiMessageBubbleProps {
  message: string;
  markdown?: boolean;
  reverse?: boolean;
  showActions?: boolean;
}

defineProps<AiMessageBubbleProps>();
</script>

<template>
  <CompanionMessageContext :message="message">
    <div
      class="group w-full flex flex-col items-start"
      :class="{ 'items-end!': reverse }"
    >
      <div
        class="relative max-w-[calc(100%-3rem)] @sm:max-w-3/4 @md:max-w-2/3 @lg:max-w-4/5 w-full"
        :class="{ 'px-4 py-3 rounded-xl bg-primary/25 w-auto!': reverse }"
      >
        <MarkdownRenderer
          v-if="markdown"
          :content="message"
          use-markdown
        />
        <p
          v-else
          class="whitespace-pre-line"
        >
          {{ message }}
        </p>
      </div>
    </div>
  </CompanionMessageContext>
</template>
