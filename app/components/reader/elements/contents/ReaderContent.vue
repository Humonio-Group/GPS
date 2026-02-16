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
    variant="ghost"
    :as-child="!content.locked"
    class="bg-transparent justify-start pl-1.5 pr-2.5 overflow-hidden hover:bg-primary/15 dark:hover:bg-primary/15"
  >
    <template v-if="content.locked">
      <div class="size-7 grid place-items-center">
        <Lock />
      </div>

      <span class="flex-1 truncate">
        {{ content.name }}
      </span>
    </template>
    <NuxtLinkLocale
      v-else
      :to="`/${alias}/reader/${id}/${content.id}`"
      active-class="bg-sidebar-primary! text-sidebar-primary-foreground! *:text-sidebar-primary-foreground!"
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
