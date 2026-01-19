<script setup lang="ts">
import { cn } from "~/lib/utils";

interface MarkdownRendererProps {
  content: string;
  useMarkdown?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<MarkdownRendererProps>(), {
  useMarkdown: false,
});

const { render } = useMarkdown();

const html = computed(() => props.useMarkdown ? render(props.content || "") : props.content);
</script>

<template>
  <div
    :class="cn('html-wrapper', props.class)"
    v-html="html"
  />
</template>
