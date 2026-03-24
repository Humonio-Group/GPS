<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import { Lock } from "lucide-vue-next";

interface ReaderContentProps {
  content: Content;
}

defineProps<ReaderContentProps>();

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();
</script>

<template>
  <UiButton
    v-if="content.locked"
    :id="`content-${content.id}`"
    variant="ghost"
    class="bg-transparent justify-start pl-1.5 pr-2.5 overflow-hidden hover:bg-primary/15 dark:hover:bg-primary/15"
  >
    <div class="size-7 grid place-items-center">
      <UiPopover>
        <UiPopoverTrigger>
          <Lock class="text-muted-foreground" />
        </UiPopoverTrigger>
        <UiPopoverContent class="grid gap-1.5">
          <div
            v-for="condition in content.conditions"
            :key="`c#${content.id}-condition#${condition.label}`"
            class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-muted-foreground"
          >
            <component
              :is="condition.icon"
              class="shrink-0"
            />
            <p class="text-sm">
              {{ condition.label }}
            </p>
          </div>
        </UiPopoverContent>
      </UiPopover>
    </div>

    <span class="flex-1 truncate">
      {{ content.name }}
    </span>
  </UiButton>
  <UiButton
    v-else
    :id="`content-${content.id}`"
    variant="ghost"
    as-child
    class="bg-transparent justify-start pl-1.5 pr-2.5 overflow-hidden hover:bg-primary/15 dark:hover:bg-primary/15"
  >
    <NuxtLinkLocale
      :to="`/${alias}/reader/${id}/${content.id}`"
      active-class="opacity-100! bg-sidebar-primary! text-sidebar-primary-foreground! *:text-sidebar-primary-foreground!"
      :class="{ 'opacity-60': content.progress.value >= 1 }"
    >
      <NuxtImg
        class="size-6 rounded-sm bg-primary aspect-square object-cover"
        :src="content.picture"
      />

      <span class="truncate">
        {{ content.name }}
      </span>

      <div
        v-if="content.progress.viewed || (content.duration ?? 0) > 0"
        class="flex ml-auto *:text-current!"
      >
        <UiCircularProgress
          v-if="content.progress.viewed"
          :model-value="content.progress.value * 100"
        />
        <span
          v-else-if="(content.duration ?? 0) > 0"
          class="text-muted-foreground/50 text-xs shrink-0"
        >{{ content.duration }} min</span>
      </div>
    </NuxtLinkLocale>
  </UiButton>
</template>
