<script setup lang="ts">
import type { DefaultSidebarItemProps } from "~/components/navigation";

const props = defineProps<DefaultSidebarItemProps>();

const { alias } = useWorkspaceUtils();
const path = (p: string) => p.startsWith("/") ? p.substring(1) : p;

const activeClass = computed(() => props.item.exact
  ? { exactActiveClass: "bg-sidebar-accent! text-sidebar-accent-foreground!" }
  : { activeClass: "bg-sidebar-accent! text-sidebar-accent-foreground!" });
</script>

<template>
  <UiSidebarMenuItem>
    <UiSidebarMenuButton
      :tooltip="item.label"
      as-child
    >
      <NuxtLinkLocale
        :to="`/${alias!}/${path(item.path)}`"
        v-bind="activeClass"
      >
        <component :is="item.icon" />
        <span class="flex-1 truncate">
          {{ item.label }}
        </span>
      </NuxtLinkLocale>
    </UiSidebarMenuButton>
    <UiSidebarMenuSub v-if="item.children?.length">
      <UiSidebarMenuSubItem
        v-for="(sub, i) in item.children"
        :key="`sb-${index}-sub-${i}`"
      >
        <UiSidebarMenuSubButton as-child>
          <NuxtLinkLocale
            :to="`/${alias!}/${path(sub.path)}`"
            v-bind="activeClass"
          >
            <span class="flex-1 truncate">
              {{ sub.label }}
            </span>
          </NuxtLinkLocale>
        </UiSidebarMenuSubButton>
      </UiSidebarMenuSubItem>
    </UiSidebarMenuSub>
  </UiSidebarMenuItem>
</template>
