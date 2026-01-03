<script setup lang="ts">
import { CircularProgress } from "~/components/ui/progress";
import type { Content } from "~/types/entities/course";

interface StageContentProgressProps {
  content: Content;
}

defineProps<StageContentProgressProps>();
</script>

<template>
  <CircularProgress :model-value="content.progress.value * 100" />
</template>
