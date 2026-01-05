<script setup lang="ts">
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";

interface FlagIconProps {
  countryCode: string;
  class?: HTMLAttributes["class"];
}

const props = defineProps<FlagIconProps>();
</script>

<template>
  <span :class="cn(`fi fi-${countryCode} text-xs`, props.class)" />
</template>

<style scoped>
@import "flag-icons/css/flag-icons.min.css";
</style>
