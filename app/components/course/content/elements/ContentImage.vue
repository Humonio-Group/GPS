<script setup lang="ts">
import type { Content } from "~/types/entities/course";

interface ContentImageProps {
  content: Content;
}

defineProps<ContentImageProps>();
</script>

<template>
  <NuxtImg
    :src="content.activity.image!"
    :placeholder="[50, 50, 25, 75]"
    class="rounded-lg mx-auto w-full max-w-4xl"
  />
  <!-- max-w-4xl -->
</template>
