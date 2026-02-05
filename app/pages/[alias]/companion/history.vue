<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const { t } = useI18n();

useHead({
  title: `${t("companion.history.title")} - ${useBrand().name}`,
});
</script>

<template>
  <PageRoot name="companion.history">
    CONVERSATIONS HISTORY
  </PageRoot>
</template>
