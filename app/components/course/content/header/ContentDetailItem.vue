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
  <li class="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <component :is="icon" />
      </UiTooltipTrigger>
      <UiTooltipContent side="right">
        {{ $t(tooltip) }}
      </UiTooltipContent>
    </UiTooltip>

    {{ value }}
  </li>
</template>
