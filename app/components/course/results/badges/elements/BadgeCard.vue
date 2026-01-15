<script setup lang="ts">
import type { Badge } from "~/types/entities/badge";
import { Check } from "lucide-vue-next";

interface BadgeCardProps {
  badge: Badge;
}

defineProps<BadgeCardProps>();

const { formatDate } = useDateUtils();
const { formatTime } = useTimeUtils();
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger as-child>
      <UiCard class="p-4 gap-3 flex-row">
        <UiAvatar
          class="size-10 @sm/badges-dialog:size-12 rounded-md bg-accent"
          :class="{ 'bg-primary': badge.unlockedAt }"
        >
          <UiAvatarImage
            v-if="badge.picture"
            :src="badge.picture"
            :class="{ 'grayscale-100': !badge.unlockedAt }"
          />
          <UiAvatarFallback>{{ badge.name.substring(0, 2) }}</UiAvatarFallback>
        </UiAvatar>

        <UiCardHeader class="px-0 flex flex-col flex-1">
          <UiCardTitle class="truncate max-w-full">
            {{ badge.name }}
          </UiCardTitle>
          <UiCardDescription>
            {{ badge.unlockedAt
              ? $t("labels.unlocked-at", 1, {
                named: {
                  date: formatDate("medium")(badge.unlockedAt),
                  time: formatTime("short")(badge.unlockedAt),
                },
              })
              : $t("labels.locked") }}
          </UiCardDescription>
        </UiCardHeader>
      </UiCard>
    </UiPopoverTrigger>
    <UiPopoverContent>
      <ul>
        <li
          v-for="(condition, index) in badge.conditions"
          :key="`b${badge.id}-c#${index}`"
          class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-muted-foreground"
          :class="{ '[&_>svg]:text-primary!': badge.unlockedAt }"
        >
          <component :is="badge.unlockedAt ? Check : condition.icon" />
          <p>{{ condition.label }}</p>
        </li>
      </ul>
    </UiPopoverContent>
  </UiPopover>
</template>
