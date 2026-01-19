<script setup lang="ts">
import DefaultSidebarItem from "~/components/navigation/entities/DefaultSidebarItem.vue";
import type { DefaultSidebarProps } from "~/components/navigation/index";
import WorkspaceSelector from "~/components/navigation/entities/WorkspaceSelector.vue";
import UserMenu from "~/components/navigation/entities/UserMenu.vue";

defineProps<DefaultSidebarProps>();

const contents = useProductNavigation();
</script>

<template>
  <UiSidebar
    variant="floating"
    collapsible="icon"
  >
    <UiSidebarHeader>
      <WorkspaceSelector />
    </UiSidebarHeader>

    <UiSidebarContent class="overflow-y-auto">
      <UiSidebarGroup v-if="showSearch">
        <UiInput />
      </UiSidebarGroup>

      <UiSidebarGroup
        v-for="(content, i) in contents"
        :key="`sb-${i}`"
      >
        <UiSidebarMenu>
          <DefaultSidebarItem
            v-for="(item, j) in content.children"
            :key="`sb-${i}-${j}`"
            :item="item"
            :index="j"
          />
        </UiSidebarMenu>
      </UiSidebarGroup>
    </UiSidebarContent>

    <UiSidebarFooter>
      <UserMenu />
    </UiSidebarFooter>
  </UiSidebar>
</template>
