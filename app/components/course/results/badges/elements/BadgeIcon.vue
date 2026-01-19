<script setup lang="ts">
import type { Badge } from "~/types/entities/badge";

interface BadgeIconProps {
  badge: Badge;
}

defineProps<BadgeIconProps>();
</script>

<template>
  <UiTooltip>
    <UiTooltipTrigger as-child>
      <UiAvatar class="size-12 rounded-md bg-primary text-primary-foreground/35">
        <UiAvatarImage
          v-if="badge.picture"
          :src="badge.picture"
        />
        <UiAvatarFallback>{{ badge.name.substring(0, 2) }}</UiAvatarFallback>
      </UiAvatar>
    </UiTooltipTrigger>
    <UiTooltipContent>
      <p>{{ badge.name }}</p>
    </UiTooltipContent>
  </UiTooltip>
</template>
