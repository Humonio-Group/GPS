<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

onBeforeMount(() => {
  const { alias } = useWorkspaceUtils();
  navigateTo(`/${alias.value}/courses`);
});
</script>

<template>
  <PageRoot name="home">
    <!-- todo: implement home page (as dashboard) - loic -->
  </PageRoot>
</template>
