<script setup lang="ts">
import { Book } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";

interface StageContentIconProps {
  content: Content;
}

defineProps<StageContentIconProps>();
</script>

<template>
  <NuxtImg
    v-if="content.picture"
    class="size-7 rounded-sm bg-primary object-cover object-center shrink-0"
    :placeholder="[50, 50, 25, 75]"
    :src="content.picture"
  />
  <div
    v-else
    class="grid place-items-center size-7 rounded-sm bg-primary shrink-0 [&_>svg]:size-4.5 text-primary-foreground"
  >
    <Book />
  </div>
</template>
