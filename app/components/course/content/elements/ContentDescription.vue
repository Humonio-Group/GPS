<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";

interface ContentDescriptionProps {
  content: Content;
}

defineProps<ContentDescriptionProps>();
</script>

<template>
  <MarkdownRenderer :content="content.description || ''" />
</template>
