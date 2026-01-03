<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "~/components/ui/sonner";
import type { Theme } from "~/types/misc/theme";

useColorMode().preference = "light";
const theme = computed((): Theme => useColorMode().preference as Theme);

useFancyLeaveTitle();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <NuxtLayout />

    <ClientOnly>
      <Toaster
        :rich-colors="true"
        close-button
        position="bottom-right"
        close-button-position="top-right"
        :theme="theme"
      />
    </ClientOnly>
  </div>
</template>
