<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { useClipboard } from "@vueuse/core";

interface CompanionMessageContextProps {
  message: string;
}

defineProps<CompanionMessageContextProps>();

const { copy, copied } = useClipboard();
</script>

<template>
  <UiContextMenu>
    <UiContextMenuTrigger as-child>
      <slot />
    </UiContextMenuTrigger>
    <UiContextMenuContent>
      <UiContextMenuGroup>
        <UiContextMenuItem @click="copy(message)">
          <template v-if="copied">
            <Check />
            {{ $t("labels.copied") }}
          </template>
          <template v-else>
            <Copy />
            {{ $t("btn.copy.default") }}
          </template>
        </UiContextMenuItem>
      </UiContextMenuGroup>
    </UiContextMenuContent>
  </UiContextMenu>
</template>
