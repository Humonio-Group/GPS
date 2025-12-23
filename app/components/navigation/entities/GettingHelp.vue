<script setup lang="ts">
import { CircleHelp } from "lucide-vue-next";
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton
        size="icon-sm"
        variant="ghost"
      >
        <CircleHelp />
      </UiButton>
    </UiDropdownMenuTrigger>

    <UiDropdownMenuContent
      side="bottom"
      align="end"
    >
      <UiDropdownMenuGroup>
        <UiDropdownMenuItem>
          {{ $t("navigation.actions.getting-help.help-center") }}
        </UiDropdownMenuItem>
        <UiDropdownMenuItem>
          {{ $t("navigation.actions.getting-help.support") }}
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>

      <UiDropdownMenuSeparator />
      <UiDropdownMenuGroup>
        <UiDropdownMenuLabel>
          {{ $t("navigation.actions.getting-help.ai.label") }}
        </UiDropdownMenuLabel>

        <UiDropdownMenuItem>
          {{ $t("navigation.actions.getting-help.ai.intelligence") }}
        </UiDropdownMenuItem>
        <UiDropdownMenuItem>
          {{ $t("navigation.actions.getting-help.ai.ai-assistant") }}
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>

      <UiDropdownMenuSeparator />
      <UiDropdownMenuGroup>
        <UiDropdownMenuItem>
          {{ $t("navigation.actions.getting-help.other-resources") }}
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
