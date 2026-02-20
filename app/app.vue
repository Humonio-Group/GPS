<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "~/components/ui/sonner";
import type { Theme } from "~/types/misc/theme";
import LoadingIndicator from "~/components/loader/LoadingIndicator.vue";

const theme = computed((): Theme => useColorMode().preference as Theme);

useFancyLeaveTitle();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- <NuxtLoadingIndicator /> -->
    <LoadingIndicator />

    <NuxtLayout />

    <ClientOnly>
      <Toaster
        :rich-colors="true"
        close-button
        position="top-center"
        close-button-position="top-right"
        :theme="theme"
      />
    </ClientOnly>
  </div>
</template>
