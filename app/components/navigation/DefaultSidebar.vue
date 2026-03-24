<script setup lang="ts">
import { Bell, BellDot, Headphones, Search, PanelLeftOpen, PanelLeftClose } from "lucide-vue-next";
import DefaultSidebarItem from "~/components/navigation/entities/DefaultSidebarItem.vue";
import type { DefaultSidebarProps } from "~/components/navigation/index";
import WorkspaceSelector from "~/components/navigation/entities/WorkspaceSelector.vue";
import UserMenu from "~/components/navigation/entities/UserMenu.vue";
import GpsCommand from "~/components/navigation/GpsCommand.vue";
import { useSidebar } from "~/components/ui/sidebar";

defineProps<DefaultSidebarProps>();

const commandOpen = ref<boolean>(false);
const { alias } = useWorkspaceUtils();

const { notifications, hasNewNotifications, loading } = storeToRefs(useNotificationStore());

const contents = useProductNavigation();

const { open, setOpen, setOpenMobile, isMobile } = useSidebar();
function toggleSidebar() {
  if (isMobile.value) setOpenMobile(!open.value);
  else setOpen(!open.value);
}
</script>

<template>
  <div>
    <UiSidebar collapsible="icon">
      <UiSidebarHeader>
        <WorkspaceSelector />
      </UiSidebarHeader>

      <UiSidebarContent class="overflow-y-auto">
        <UiSidebarGroup>
          <UiSidebarGroupContent>
            <UiSidebarMenu>
              <UiSidebarMenuItem v-if="showSearch">
                <UiSidebarMenuButton
                  :tooltip="$t('labels.search')"
                  @click="commandOpen = true"
                >
                  <Search />
                  {{ $t("labels.search") }}

                  <UiKbd class="ml-auto">
                    ⌘k
                  </UiKbd>
                </UiSidebarMenuButton>
              </UiSidebarMenuItem>
              <UiSidebarMenuItem v-if="!isMobile">
                <NuxtLinkLocale :to="`/${alias}/notifications`">
                  <UiSidebarMenuButton :tooltip="$t('navigation.actions.notifications')">
                    <UiSpinner v-if="!notifications.length && loading.list" />
                    <BellDot v-else-if="hasNewNotifications" />
                    <Bell v-else />
                    {{ $t("navigation.actions.notifications") }}
                  </UiSidebarMenuButton>
                </NuxtLinkLocale>
              </UiSidebarMenuItem>
            </UiSidebarMenu>
          </UiSidebarGroupContent>
        </UiSidebarGroup>

        <UiSidebarGroup
          v-for="(content, i) in contents"
          :key="`sb-${i}`"
        >
          <UiSidebarGroupLabel v-if="content.label?.length">
            {{ content.label }}
          </UiSidebarGroupLabel>

          <UiSidebarMenu>
            <template
              v-for="(item, j) in content.children"
              :key="`sb-${i}-${j}`"
            >
              <DefaultSidebarItem
                :item="item"
                :index="j"
              />
              <UiSidebarSeparator
                v-if="item.separator"
                class="w-full mx-0!"
              />
            </template>
          </UiSidebarMenu>
        </UiSidebarGroup>
      </UiSidebarContent>

      <UiSidebarFooter>
        <UiSidebarMenu>
          <template v-if="!isMobile">
            <UiSidebarMenuItem>
              <NuxtLinkLocale :to="`/${alias}/support`">
                <UiSidebarMenuButton :tooltip="$t('navigation.actions.getting-help.support')">
                  <Headphones />
                  {{ $t("navigation.actions.getting-help.support") }}
                </UiSidebarMenuButton>
              </NuxtLinkLocale>
            </UiSidebarMenuItem>
            <UiSidebarMenuItem>
              <UiSidebarMenuButton
                :tooltip="$t(`labels.sidebar.${open ? 'collapse' : 'expand'}`)"
                @click="toggleSidebar"
              >
                <PanelLeftClose v-if="open" />
                <PanelLeftOpen v-else />
                {{ $t(`labels.sidebar.${open ? 'collapse' : 'expand'}`) }}
              </UiSidebarMenuButton>
            </UiSidebarMenuItem>
            <UiSidebarSeparator class="w-full mx-0" />
          </template>

          <UserMenu />
        </UiSidebarMenu>
      </UiSidebarFooter>

      <UiSidebarRail />
    </UiSidebar>

    <GpsCommand v-model:open="commandOpen" />
  </div>
</template>
