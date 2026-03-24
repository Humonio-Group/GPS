<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const { isMobile } = useBrowser();

interface TicketsListProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<TicketsListProps>();

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <UiSheet
    v-if="isMobile"
    v-model:open="open"
  >
    <UiSheetContent
      side="right"
      class=""
    >
      <UiSheetHeader>
        <UiSheetTitle>{{ $t("support.title") }}</UiSheetTitle>
      </UiSheetHeader>

      <div :class="cn('p-4 pt-0', props.class)">
        <slot />
      </div>
    </UiSheetContent>
  </UiSheet>
  <nav
    v-else
    :class="cn('shrink-0 w-70! border-l p-2 bg-sidebar text-sidebar-foreground grid gap-2', props.class)"
  >
    <slot />
  </nav>
</template>
