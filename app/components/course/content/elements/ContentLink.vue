<script setup lang="ts">
import { SquareArrowOutUpRight } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";

interface ContentLinkProps {
  content: Content;
}

defineProps<ContentLinkProps>();
</script>

<template>
  <UiButton
    class="@md:self-center"
    size="lg"
    as-child
  >
    <NuxtLink
      :to="content.activity.link"
      target="_blank"
      rel="noopener noreferrer"
      external
    >
      {{ $t("btn.open-link") }}
      <SquareArrowOutUpRight />
    </NuxtLink>
  </UiButton>
</template>
