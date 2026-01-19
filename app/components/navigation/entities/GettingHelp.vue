<script setup lang="ts">
import { CircleHelp, Headphones, LibraryBig, SquareArrowOutUpRight } from "lucide-vue-next";

const { alias } = useWorkspaceUtils();
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
        <UiDropdownMenuItem disabled>
          <CircleHelp />
          {{ $t("navigation.actions.getting-help.help-center") }}

          <UiBadge class="ml-auto shrink-0">
            W.I.P
          </UiBadge>
        </UiDropdownMenuItem>
        <NuxtLinkLocale :to="`/${alias}/support`">
          <UiDropdownMenuItem>
            <Headphones />
            {{ $t("navigation.actions.getting-help.support") }}
          </UiDropdownMenuItem>
        </NuxtLinkLocale>
      </UiDropdownMenuGroup>

      <UiDropdownMenuSeparator />
      <UiDropdownMenuGroup>
        <UiDropdownMenuLabel>
          {{ $t("navigation.actions.getting-help.ai.label") }}
        </UiDropdownMenuLabel>

        <NuxtLink
          to="https://chatgpt.com/g/g-67479b6827ec8191bce4bdebcb7fb6ca-humonio-intelligence-beta"
          external
          target="_blank"
        >
          <UiDropdownMenuItem>
            {{ $t("navigation.actions.getting-help.ai.intelligence") }}
            <SquareArrowOutUpRight class="ml-auto size-3 text-muted-foreground!" />
          </UiDropdownMenuItem>
        </NuxtLink>
        <NuxtLink
          to="https://chatgpt.com/g/g-68aec81824d4819198a9001c03b222f6-qigu-ai-assistant-beta"
          external
          target="_blank"
        >
          <UiDropdownMenuItem>
            {{ $t("navigation.actions.getting-help.ai.ai-assistant") }}
            <SquareArrowOutUpRight class="ml-auto size-3 text-muted-foreground!" />
          </UiDropdownMenuItem>
        </NuxtLink>
      </UiDropdownMenuGroup>

      <template v-if="false">
        <UiDropdownMenuSeparator />
        <UiDropdownMenuGroup>
          <UiDropdownMenuItem>
            <LibraryBig />
            {{ $t("navigation.actions.getting-help.other-resources") }}
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>
      </template> <!-- todo: make the library page - loic -->
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
