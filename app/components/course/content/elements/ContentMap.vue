<script setup lang="ts">
import type { Content } from "~/types/entities/course";

interface ContentMapProps {
  content: Content;
}

defineProps<ContentMapProps>();
</script>

<template>
  <iframe
    class="w-full max-w-4xl mx-auto aspect-[16/11] rounded-lg"
    :src="content.activity.blended!.map"
    frameborder="0"
  />
</template>
