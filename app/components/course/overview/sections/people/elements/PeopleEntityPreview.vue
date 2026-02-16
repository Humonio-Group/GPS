<script setup lang="ts">
import type { Peoples } from "~/types/entities/user";

interface PeopleEntityPreviewProps {
  people: Peoples;
  translationKey: string;
}

const props = defineProps<PeopleEntityPreviewProps>();
const displayed = computed(() => props.people.slice(0, 3));
const moreCount = computed(() => props.people.length - displayed.value.length);
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="flex items-center">
      <UiTooltip
        v-for="(person, index) in displayed"
        :key="`${person.id}-${person.name.first.toLowerCase()}`"
      >
        <UiTooltipTrigger>
          <UiAvatar
            class="outline-3 size-9 outline-background"
            :class="{ '-ml-2': index > 0 }"
          >
            <UiAvatarImage
              v-if="person.avatar"
              :src="person.avatar"
            />
            <UiAvatarFallback>{{ person.name.first[0] }}{{ person.name.last[0] }}</UiAvatarFallback>
          </UiAvatar>
        </UiTooltipTrigger>
        <UiTooltipContent>
          <p>{{ person.name.full }}</p>
        </UiTooltipContent>
      </UiTooltip>
      <UiAvatar class="outline-3 size-9 outline-background -ml-2">
        <UiAvatarFallback class="text-[0.65rem] text-muted-foreground font-semibold">
          +{{ Math.min(moreCount, 99) }}
        </UiAvatarFallback>
      </UiAvatar>
    </div>

    <p class="text-sm text-muted-foreground">
      <i18n-t
        :keypath="`${translationKey}.total-count`"
        :plural="people.length"
      >
        <template #count>
          <span class="text-foreground!">{{ people.length }}</span>
        </template>
      </i18n-t>
    </p>
  </div>
</template>
