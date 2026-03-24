<script setup lang="ts">
import { Bell, BellDot } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import DefaultSidebar from "~/components/navigation/DefaultSidebar.vue";
import GettingHelp from "~/components/navigation/entities/GettingHelp.vue";

const { alias } = useWorkspaceUtils();
const { isMobile } = useResponsive();

const { notifications, hasNewNotifications, loading } = storeToRefs(useNotificationStore());
</script>

<template>
  <LayoutRoot>
    <UiSidebarProvider>
      <DefaultSidebar show-search />

      <UiSidebarInset class="flex flex-col max-h-dvh! overflow-y-auto">
        <header
          v-if="isMobile"
          class="shrink-0 sticky top-0 px-4 py-3 flex items-center gap-2 bg-background z-50"
        >
          <UiSidebarTrigger />

          <div class="ml-auto flex items-center">
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  size="icon-sm"
                  variant="ghost"
                  as-child
                >
                  <NuxtLinkLocale :to="`/${alias}/notifications`">
                    <UiSpinner v-if="!notifications.length && loading.list" />
                    <BellDot v-else-if="hasNewNotifications" />
                    <Bell v-else />
                  </NuxtLinkLocale>
                </UiButton>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ $t("navigation.actions.notifications") }}</p>
              </UiTooltipContent>
            </UiTooltip>
            <GettingHelp />
          </div>
        </header>

        <main class="flex-1 flex flex-col min-h-0">
          <NuxtPage />
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
