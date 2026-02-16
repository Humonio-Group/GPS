<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const route = useRoute();
const stageId = computed(() => Number(route.params.stageId || -1));

const store = useCoursesStore();
const { availableStages: stages, loading } = storeToRefs(store);
const stage = computed(() => stages.value.find(s => s.id === stageId.value));
</script>

<template>
  <PageRoot :name="`reader.stage.${stage?.name}`">
    <div
      v-if="!stage && loading.specific.stages"
      class="h-24 grid place-items-center"
    >
      <UiSpinner />
    </div>
    <template v-else-if="stage">
      {{ stage.name }}
    </template>
  </PageRoot>
</template>
