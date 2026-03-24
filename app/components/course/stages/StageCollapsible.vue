<script setup lang="ts">
import type { Stage } from "~/types/entities/course";
import StageContentItem from "~/components/course/stages/StageContentItem.vue";
import StageItemConditions from "~/components/course/stages/stage-elements/StageItemConditions.vue";

interface StageProps {
  stage: Stage;
}

const props = defineProps<StageProps>();

const store = useCoursesStore();
const { loading: loads } = storeToRefs(store);

const loading = computed(() => loads.value.specific.stageContents.includes(props.stage.reference));

onMounted(() => {
  if (!props.stage.contents.length) store.loadContents(props.stage.reference);
});
</script>

<template>
  <UiCollapsible>
    <UiCard class="p-0 gap-0 cursor-pointer">
      <UiCollapsibleTrigger as-child>
        <UiCardHeader class="flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-4 p-4 justify-between">
          <div class="grid gap-1">
            <UiCardTitle class="truncate max-w-xl">
              {{ stage.name }}
            </UiCardTitle>
            <UiCardDescription class="text-xs">
              {{ $t("courses.specimen.overview.contents-progress", { current: stage.progress.completed, max: stage.progress.total }) }}{{ stage.duration ? ` · ${$t("labels.time.short.minutes", { value: stage.duration })}` : '' }}
            </UiCardDescription>
          </div>

          <div class="flex items-center gap-2">
            <StageItemConditions
              v-if="stage.locked"
              :stage="stage"
            />
            <UiCircularProgress
              v-else
              filled
              class="size-7"
              :model-value="(stage.progress.completed / stage.progress.total) * 100"
            />
          </div>
        </UiCardHeader>
      </UiCollapsibleTrigger>
      <UiCollapsibleContent as-child>
        <UiCardContent class="p-4 pt-0 grid gap-2 overflow-hidden">
          <div
            v-if="(stage.description || stage.picture) && false"
            class="flex flex-col @lg:flex-row @lg:items-center gap-2 @lg:gap-4 mb-2"
          >
            <NuxtImg
              v-if="stage.picture"
              :src="stage.picture"
              class="@lg:w-48 rounded-lg"
            />
            <p
              v-if="stage.description"
              class="whitespace-pre-line text-muted-foreground text-sm"
            >
              {{ stage.description }}
            </p>
          </div>

          <template v-if="!stage.contents.length && loading">
            <UiSkeleton
              v-for="i in (Math.floor(Math.random() * 4) + 1)"
              :key="i"
              class="h-12 w-full"
            />
          </template>
          <StageContentItem
            v-for="content in stage.contents"
            v-else
            :key="`stage-${stage.id}-c${content.id}`"
            :content="content"
          />

          <p
            v-if="!loading && !stage.contents.length"
            class="text-sm text-muted-foreground italic"
          >
            {{ $t("courses.specimen.overview.stages.empty") }}
          </p>
        </UiCardContent>
      </UiCollapsibleContent>
    </UiCard>
  </UiCollapsible>
</template>
