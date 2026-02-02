<script setup lang="ts">
import StageItemCompletionBadge from "~/components/course/stages/stage-elements/StageItemCompletionBadge.vue";
import type { Stage } from "~/types/entities/course";
import StageContentItem from "~/components/course/stages/StageContentItem.vue";

interface StageProps {
  stage: Stage;
}

const props = defineProps<StageProps>();

const store = useCoursesStore();
const { loading: loads } = storeToRefs(store);

const loading = computed(() => loads.value.specific.stageContents.includes(props.stage.reference));

onMounted(() => store.loadContents(props.stage.reference));
</script>

<template>
  <UiCollapsible>
    <UiCard class="p-0 gap-0 cursor-pointer">
      <UiCollapsibleTrigger as-child>
        <UiCardHeader class="flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-4 p-6 justify-between">
          <div class="grid">
            <UiCardTitle class="truncate">
              {{ stage.name }}
            </UiCardTitle>
            <UiCardDescription
              v-if="stage.description"
              class="line-clamp-3 whitespace-pre-line"
            >
              {{ stage.description }}
            </UiCardDescription>
          </div>

          <StageItemCompletionBadge :contents="stage.progress" />
        </UiCardHeader>
      </UiCollapsibleTrigger>
      <UiCollapsibleContent as-child>
        <UiCardContent class="p-6 pt-0 grid gap-2">
          <StageContentItem
            v-for="content in stage.contents"
            :key="`stage-${stage.id}-c${content.id}`"
            :content="content"
          />

          <div
            v-if="loading"
            class="grid place-items-center"
          >
            <UiSpinner />
          </div>
          <p
            v-else-if="!stage.contents.length"
            class="text-sm text-muted-foreground italic"
          >
            {{ $t("courses.specimen.overview.stages.empty") }}
          </p>
        </UiCardContent>
      </UiCollapsibleContent>
    </UiCard>
  </UiCollapsible>
</template>
