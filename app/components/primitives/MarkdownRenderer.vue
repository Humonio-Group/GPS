<script setup lang="ts">
import { cn } from "~/lib/utils";

interface MarkdownRendererProps {
  content: string;
  useMarkdown?: boolean;
  class?: string;
}

const props = defineProps<MarkdownRendererProps>();
const { render } = useMarkdown();

const html = computed(() => render(props.content || ""));
</script>

<template>
  <ClientOnly>
    <div
      :class="cn('html-wrapper', props.class)"
      v-html="props.useMarkdown ? html : (content || '')"
    />
  </ClientOnly>
</template>

<style lang="scss">
.html-wrapper {

}
</style>
