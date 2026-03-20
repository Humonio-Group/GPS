<script setup lang="ts">
import { Search } from "lucide-vue-next";
import DefaultSidebarItem from "~/components/navigation/entities/DefaultSidebarItem.vue";
import type { DefaultSidebarProps } from "~/components/navigation/index";
import WorkspaceSelector from "~/components/navigation/entities/WorkspaceSelector.vue";
import UserMenu from "~/components/navigation/entities/UserMenu.vue";
import GpsCommand from "~/components/navigation/GpsCommand.vue";

defineProps<DefaultSidebarProps>();

const commandOpen = ref<boolean>(false);

const contents = useProductNavigation();
</script>

<template>
  <div>
    <!-- variant="floating" -->
    <UiSidebar
      collapsible="icon"
    >
      <UiSidebarHeader>
        <WorkspaceSelector />
      </UiSidebarHeader>

      <UiSidebarContent class="overflow-y-auto">
        <UiSidebarGroup v-if="showSearch">
          <UiSidebarGroupContent>
            <UiSidebarMenu>
              <UiSidebarMenuItem>
                <UiSidebarMenuButton @click="commandOpen = true">
                  <Search />
                  {{ $t("labels.search") }}

                  <UiKbd class="ml-auto">
                    ⌘k
                  </UiKbd>
                </UiSidebarMenuButton>
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
        <UserMenu />
      </UiSidebarFooter>
    </UiSidebar>

    <GpsCommand v-model:open="commandOpen" />
  </div>
</template>
