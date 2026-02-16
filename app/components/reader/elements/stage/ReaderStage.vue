<script setup lang="ts">
import type { Content, Stage } from "~/types/entities/course";
import ReaderStageTrigger from "~/components/reader/elements/stage/ReaderStageTrigger.vue";
import ReaderStageContent from "~/components/reader/elements/stage/ReaderStageContent.vue";

interface ReaderStageProps {
  stage: Stage;
  content?: Content;
  defaultOpen?: boolean;
}

const props = withDefaults(defineProps<ReaderStageProps>(), {
  defaultOpen: true,
});

const open = ref<boolean>(props.defaultOpen);
provide("open", open);

const route = useRoute();
const { availableStages: stages } = storeToRefs(useCoursesStore());
const active = computed(() => (stages.value.find(s => s.contents.some(c => c.id === props.content?.id))?.id || Number(route.params.stageId || -1)) === props.stage.id);
</script>

<template>
  <div
    class="rounded-lg"
    :class="{ 'bg-primary/15': active }"
  >
    <UiCollapsible v-model:open="open">
      <div class="px-2">
        <ReaderStageTrigger
          :active
          :stage
        />
      </div>
      <UiCollapsibleContent>
        <ReaderStageContent :stage />
      </UiCollapsibleContent>
    </UiCollapsible>
  </div>
</template>
