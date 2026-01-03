<script setup lang="ts">
import StageContentIcon from "~/components/course/stages/content-elements/StageContentIcon.vue";
import StageContentProgress from "~/components/course/stages/content-elements/StageContentProgress.vue";
import type { Content } from "~/types/entities/course";

interface StageContentItemProps {
  content: Content;
}

defineProps<StageContentItemProps>();

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();
</script>

<template>
  <div class="relative flex items-center gap-2 p-2 pr-3 rounded-lg border hover:bg-accent hover:text-accent-foreground">
    <StageContentIcon :content="content" />
    <p class="flex-1 truncate">
      {{ content.name }}
    </p>
    <span
      v-if="content.duration"
      class="text-sm text-muted-foreground"
    >{{ $t("labels.time.short.minutes", { value: content.duration }) }}</span>
    <StageContentProgress
      v-if="content.progress.viewed"
      :content="content"
    />

    <NuxtLinkLocale
      class="absolute inset-0"
      :to="`/${alias}/reader/${id}/${content.id}`"
    />
  </div>
</template>
