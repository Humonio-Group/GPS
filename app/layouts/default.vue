<script setup lang="ts">
import { Bell, BellDot } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import DefaultSidebar from "~/components/navigation/DefaultSidebar.vue";
import GettingHelp from "~/components/navigation/entities/GettingHelp.vue";

const { alias } = useWorkspaceUtils();

const { notifications, hasNewNotifications, loading } = storeToRefs(useNotificationStore());
</script>

<template>
  <LayoutRoot>
    <UiSidebarProvider>
      <DefaultSidebar show-search />

      <UiSidebarInset class="flex flex-col max-h-dvh! overflow-y-auto">
        <main class="p-4 flex-1 flex flex-col min-h-0">
          <NuxtPage />
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
