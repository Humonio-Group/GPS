<script setup lang="ts">
import { Lock, Info } from "lucide-vue-next";
import type { Stage } from "~/types/entities/course";

interface ReaderStageTriggerProps {
  stage: Stage;
  active?: boolean;
}

defineProps<ReaderStageTriggerProps>();

const open = inject("open") as Ref<boolean>;
const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();
</script>

<template>
  <div
    class="group/stage relative flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent transition-colors duration-75"
    :class="{ 'hover:bg-primary/15': !active, 'rounded-b-none!': active && open, 'rounded-b-none! border-b border-b-primary/20': open, 'opacity-60': stage.progress.completed === stage.progress.total && !active }"
  >
    <div class="grid *:leading-tight">
      <p class="font-semibold text-sm truncate">
        {{ stage.name }}
      </p>
      <span
        class="text-xs text-muted-foreground"
      >{{ $t("labels.content-type.e-learning") }}</span>
    </div>

    <div class="shrink-0 ml-auto z-10 flex items-center gap-1">
      <UiPopover v-if="stage.locked">
        <UiPopoverTrigger>
          <Lock class="size-3 text-muted-foreground" />
        </UiPopoverTrigger>
        <UiPopoverContent class="grid gap-2">
          <div
            v-for="(condition, i) in stage.conditions"
            :key="`stage#${stage.id}-condition#${i}`"
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
      <UiButton
        variant="ghost"
        size="icon-sm"
        class="-mr-1 hover:bg-transparent! text-primary!"
        as-child
      >
        <NuxtLinkLocale :to="`/${alias}/reader/${id}/stages/${stage.id}`">
          <Info class="size-5" />
        </NuxtLinkLocale>
      </UiButton>
    </div>

    <span
      class="absolute inset-0 block"
      @click="open = !open"
    />
  </div>
</template>
