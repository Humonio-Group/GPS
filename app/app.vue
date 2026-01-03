<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "~/components/ui/sonner";
import type { Theme } from "~/types/misc/theme";

const { t } = useI18n();

useColorMode().preference = "light";
const theme = computed((): Theme => useColorMode().preference as Theme);

let originalTitle = "";

window.addEventListener("focus", () => {
  if (!originalTitle.length) return;
  useHead({
    title: originalTitle,
  });
});

window.addEventListener("blur", () => {
  originalTitle = document.title;

  useHead({
    title: t("labels.miss-you"),
  });
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout />
    <NuxtLoadingIndicator />

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
