<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next";

interface ContentDetailItemProps {
  icon: LucideIcon;
  tooltip: string;
  value: string;
}

defineProps<ContentDetailItemProps>();
</script>

<template>
  <li class="flex items-center gap-2 [&_svg]:size-3.5 [&_svg]:text-muted-foreground [&_svg]:shrink-0">
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <component :is="icon" />
      </UiTooltipTrigger>
      <UiTooltipContent side="bottom">
        {{ $t(tooltip) }}
      </UiTooltipContent>
    </UiTooltip>

    <p class="text-xs text-muted-foreground">
      {{ value }}
    </p>
  </li>
</template>
