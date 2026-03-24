<script setup lang="ts">
import { useSidebar } from "~/components/ui/sidebar";

const { isMobile, open } = useSidebar();
</script>

<template>
  <UiSidebarTrigger :class="{ hidden: open && !isMobile }" />
</template>
