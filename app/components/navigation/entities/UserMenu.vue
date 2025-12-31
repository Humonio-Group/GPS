<script setup lang="ts">
import { ChevronsUpDown, LogOut, User, Settings } from "lucide-vue-next";
import { useSidebar } from "~/components/ui/sidebar";

const { isMobile } = useSidebar();
const { user } = storeToRefs(useUserStore());
</script>

<template>
  <UiSidebarMenu>
    <UiDropdownMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenuTrigger as-child>
          <UiSidebarMenuButton size="lg">
            <UiAvatar class="rounded-md text-sidebar-primary-foreground bg-sidebar-primary">
              <UiAvatarImage
                v-if="user!.avatar"
                :src="user!.avatar"
              />
              <UiAvatarFallback class="text-xs font-medium">
                {{ user!.name.first[0] }}{{ user!.name.last[0] }}
              </UiAvatarFallback>
            </UiAvatar>

            <div class="flex flex-col">
              <p class="text-sm font-medium truncate">
                {{ user!.name.full }}
              </p>
              <span class="text-xs text-muted-foreground leading-none truncate">{{ user!.contact.email }}</span>
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
          <UiAvatar class="rounded-md text-sidebar-primary-foreground bg-sidebar-primary">
            <UiAvatarImage
              v-if="user!.avatar"
              :src="user!.avatar"
            />
            <UiAvatarFallback class="text-xs font-medium">
              {{ user!.name.first[0] }}{{ user!.name.last[0] }}
            </UiAvatarFallback>
          </UiAvatar>

          <div class="flex flex-col">
            <p class="text-sm font-medium truncate">
              {{ user!.name.full }}
            </p>
            <span class="text-xs text-muted-foreground leading-none truncate">{{ user!.contact.email }}</span>
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
