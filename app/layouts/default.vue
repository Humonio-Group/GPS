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
      <DefaultSidebar />

      <UiSidebarInset class="px-4 md:pl-2 flex flex-col max-h-dvh! overflow-y-auto">
        <header class="shrink-0 sticky top-0 py-4 flex items-center gap-2 bg-background z-50">
          <UiSidebarTrigger />

          <!-- todo: breadcrumbs - loic -->

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

        <main class="p-2 pt-0 flex-1 flex flex-col min-h-0">
          <NuxtPage />
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
