<script setup lang="ts">
import { Bell } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import DefaultSidebar from "~/components/navigation/DefaultSidebar.vue";
import GettingHelp from "~/components/navigation/entities/GettingHelp.vue";
</script>

<template>
  <LayoutRoot>
    <UiSidebarProvider>
      <DefaultSidebar />

      <UiSidebarInset class="px-4 md:pl-2">
        <header class="sticky top-0 py-4 flex items-center gap-2 bg-background">
          <UiSidebarTrigger />

          <!-- todo: breadcrumbs - loic -->

          <div class="ml-auto flex items-center">
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  size="icon-sm"
                  variant="ghost"
                >
                  <Bell />
                </UiButton>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ $t("navigation.actions.notifications") }}</p>
              </UiTooltipContent>
            </UiTooltip>
            <GettingHelp />
          </div>
        </header>

        <main class="p-2">
          <NuxtPage />
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
