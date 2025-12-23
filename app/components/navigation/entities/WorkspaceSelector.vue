<script setup lang="ts">
import { ChevronsUpDown } from "lucide-vue-next";
import { useSidebar } from "~/components/ui/sidebar";

const { isMobile } = useSidebar();
</script>

<template>
  <UiSidebarMenu>
    <UiDropdownMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenuTrigger as-child>
          <UiSidebarMenuButton size="lg">
            <span class="shrink-0 grid place-items-center size-8 rounded-md text-xs font-medium text-sidebar-primary-foreground bg-sidebar-primary">
              TH
            </span> <!-- todo: workspace icon - loic -->

            <div class="flex flex-col truncate">
              <p class="font-semibold">
                Think <!-- todo: workspace name - loic -->
              </p>
              <span class="text-xs text-muted-foreground leading-none">
                Gratuit <!-- todo: workspace plan - loic -->
              </span>
            </div>

            <ChevronsUpDown class="ml-auto" />
          </UiSidebarMenuButton>
        </UiDropdownMenuTrigger>
      </UiSidebarMenuItem>

      <UiDropdownMenuContent
        class="max-h-48 overflow-y-auto"
        :side="isMobile ? 'bottom' : 'right'"
        :align="isMobile ? 'center' : 'start'"
      >
        <UiDropdownMenuItem as-child>
          <NuxtLinkLocale to="/humonio">
            <span class="shrink-0 grid place-items-center size-6 rounded-sm text-xs font-medium text-sidebar-accent-foreground bg-sidebar-accent">
              Hu
            </span> <!-- todo: workspace icon - loic -->
            Humonio <!-- todo: workspace name - loic -->
          </NuxtLinkLocale>
        </UiDropdownMenuItem> <!-- todo: other workspaces list - loic -->
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </UiSidebarMenu>
</template>
