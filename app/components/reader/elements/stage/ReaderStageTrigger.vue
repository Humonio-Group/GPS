<script setup lang="ts">
import { Lock, ChevronRight } from "lucide-vue-next";
import type { Stage } from "~/types/entities/course";

interface ReaderStageTriggerProps {
  stage: Stage;
  active?: boolean;
}

const props = defineProps<ReaderStageTriggerProps>();
const progress = computed(() => {
  const { completed, total } = props.stage.progress;
  return (completed / total) * 100;
});

const open = inject("open") as Ref<boolean>;
const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();
</script>

<template>
  <div
    class="group/stage relative flex items-center gap-2 p-2 rounded-lg bg-transparent transition-colors duration-75"
    :class="{ 'hover:bg-primary/15': !active, 'rounded-b-none! border-b border-b-primary/20': active && open }"
  >
    <div class="grid *:leading-tight">
      <p class="font-semibold text-sm truncate">
        {{ stage.name }}
      </p>
      <span
        class="text-xs text-muted-foreground"
      >e-learning</span>
    </div>

    <div class="shrink-0 ml-auto z-10 flex items-center gap-1">
      <div class=" md:group-hover/stage:hidden">
        <Lock
          v-if="stage.locked"
          class="text-muted-foreground size-4"
        />
        <UiCircularProgress
          v-else
          :model-value="progress"
          class="block size-6"
          filled
        />
      </div>
      <div class="z-10 md:hidden md:group-hover/stage:flex">
        <UiButton
          variant="ghost"
          size="icon-sm"
          class="-mr-1 hover:bg-transparent! text-primary!"
          as-child
        >
          <NuxtLinkLocale :to="`/${alias}/reader/${id}/stages/${stage.id}`">
            <ChevronRight class="size-5" />
          </NuxtLinkLocale>
        </UiButton>
      </div>
    </div>

    <span
      class="absolute inset-0 block"
      @click="open = !open"
    />
  </div>
</template>
