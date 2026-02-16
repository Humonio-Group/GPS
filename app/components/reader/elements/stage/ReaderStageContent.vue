<script setup lang="ts">
import type { Stage } from "~/types/entities/course";
import ReaderContent from "~/components/reader/elements/contents/ReaderContent.vue";

interface ReaderStageContentProps {
  stage: Stage;
}

const props = defineProps<ReaderStageContentProps>();
const contents = computed(() => props.stage.contents);

const { loading } = storeToRefs(useCoursesStore());
const isLoading = computed(() => loading.value.specific.stageContents.includes(props.stage.reference));
</script>

<template>
  <div class="grid p-2">
    <div
      v-if="isLoading"
      class="grid gap-1 place-items-center"
    >
      <UiSkeleton
        v-for="i in (Math.floor(Math.random() * 3) + 1)"
        :key="i"
        class="h-8 w-full"
      />
    </div>
    <template
      v-for="content in contents"
      v-else
      :key="`stage#${stage.id}-content#${content.id}`"
    >
      <ReaderContent :content />
    </template>
  </div>
</template>
