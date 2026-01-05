<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const { t } = useI18n();

useHead({
  title: t("profile.settings.tab"),
});
</script>

<template>
  <PageRoot name="profile.settings">
    <header>
      <h1>{{ $t("profile.settings.title") }}</h1>
    </header>

    <section />
  </PageRoot>
</template>
