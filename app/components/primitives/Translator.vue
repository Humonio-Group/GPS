<script setup lang="ts">
import type { Translation } from "~/types/primitives/translations";

interface TranslatorProps {
  translation: Translation;
}

const { locale } = useI18n();

defineProps<TranslatorProps>();
</script>

<template>
  {{ translation[locale] }}
</template>
