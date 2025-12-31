<script setup lang="ts">
import { ChevronsUpDown, LogOut, User, Settings } from "lucide-vue-next";
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
              LM
            </span> <!-- todo: user avatar - loic -->

            <div class="flex flex-col">
              <p class="text-sm font-medium truncate">
                Loïc MAES
              </p> <!-- todo: user full name - loic -->
              <span class="text-xs text-muted-foreground leading-none truncate">loic@humonio.com</span> <!-- todo: user email - loic -->
            </div>

            <ChevronsUpDown class="ml-auto" />
          </UiSidebarMenuButton>
        </UiDropdownMenuTrigger>
      </UiSidebarMenuItem>

      <UiDropdownMenuContent
        :side="isMobile ? 'top' : 'right'"
        :align="isMobile ? 'center' : 'end'"
      >
        <UiDropdownMenuGroup class="py-1 pl-1 pr-2 flex items-center gap-2">
          <span class="shrink-0 grid place-items-center size-8 rounded-md text-xs font-medium text-sidebar-primary-foreground bg-sidebar-primary">
            LM
          </span> <!-- todo: user avatar - loic -->

          <div class="flex flex-col">
            <p class="text-sm font-medium truncate">
              Loïc MAES
            </p> <!-- todo: user full name - loic -->
            <span class="text-xs text-muted-foreground leading-none truncate">loic@humonio.com</span> <!-- todo: user email - loic -->
          </div>
        </UiDropdownMenuGroup>

        <UiDropdownMenuSeparator />

        <UiDropdownMenuGroup>
          <UiDropdownMenuItem>
            <User />
            {{ $t("navigation.user-menu.profile") }}
          </UiDropdownMenuItem>
          <UiDropdownMenuItem>
            <Settings />
            {{ $t("navigation.user-menu.settings") }}
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>

        <UiDropdownMenuSeparator />

        <UiDropdownMenuGroup>
          <UiDropdownMenuItem variant="destructive">
            <LogOut />
            {{ $t("navigation.user-menu.log-out") }}
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </UiSidebarMenu>
</template>
