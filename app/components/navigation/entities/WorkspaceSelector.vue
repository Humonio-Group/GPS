<script setup lang="ts">
import { ChevronsUpDown } from "lucide-vue-next";
import { useSidebar } from "~/components/ui/sidebar";

const { isMobile } = useSidebar();
const { company } = storeToRefs(useCompanyStore());
</script>

<template>
  <UiSidebarMenu>
    <UiDropdownMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenuTrigger as-child>
          <UiSidebarMenuButton size="lg">
            <UiAvatar class="rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <UiAvatarImage
                v-if="company!.icon"
                :src="company!.icon"
              />
              <UiAvatarFallback class="text-xs font-medium">
                {{ company!.name.substring(0, 2) }}
              </UiAvatarFallback>
            </UiAvatar>

            <div class="flex flex-col truncate">
              <p class="font-semibold">
                {{ company!.name }}
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
