<script setup lang="ts">
import { Archive, Edit2, Trash } from "lucide-vue-next";

interface CompanionActionsProps {
  conversation: any;
}

defineProps<CompanionActionsProps>();
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <slot />
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end">
      <UiDropdownMenuGroup>
        <UiDropdownMenuItem>
          <Edit2 />
          {{ $t("btn.action.rename") }}
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>

      <UiDropdownMenuSeparator />

      <UiDropdownMenuGroup>
        <UiDropdownMenuItem>
          <Archive />
          {{ $t("btn.action.archive") }}
        </UiDropdownMenuItem>
        <UiDropdownMenuItem variant="destructive">
          <Trash />
          {{ $t("btn.action.delete") }}
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
