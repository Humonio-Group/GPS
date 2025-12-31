<script setup lang="ts">
import { CircleHelp, Headphones, LibraryBig, SquareArrowOutUpRight } from "lucide-vue-next";
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
          <CircleHelp />
          {{ $t("navigation.actions.getting-help.help-center") }}
        </UiDropdownMenuItem>
        <UiDropdownMenuItem>
          <Headphones />
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
          <SquareArrowOutUpRight class="ml-auto size-3 text-muted-foreground!" />
        </UiDropdownMenuItem>
        <UiDropdownMenuItem>
          {{ $t("navigation.actions.getting-help.ai.ai-assistant") }}
          <SquareArrowOutUpRight class="ml-auto size-3 text-muted-foreground!" />
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>

      <UiDropdownMenuSeparator />
      <UiDropdownMenuGroup>
        <UiDropdownMenuItem>
          <LibraryBig />
          {{ $t("navigation.actions.getting-help.other-resources") }}
        </UiDropdownMenuItem>
      </UiDropdownMenuGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
