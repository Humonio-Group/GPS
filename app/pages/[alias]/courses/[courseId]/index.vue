<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import StageCollapsible from "~/components/course/stages/StageCollapsible.vue";

const { t } = useI18n();

const { id } = useCourseUtils();

const store = useCoursesStore();
const { selectedCourse: course, availableStages: stages, loading } = storeToRefs(store);

watch(course, val => useHead({
  title: t("courses.specimen.overview.title", { name: val!.name }),
}), { immediate: true });

onMounted(() => store.loadStages());
</script>

<template>
  <PageRoot
    :name="`courses.specimen.${id}.home`"
    class="text-sm text-muted-foreground grid gap-4"
  >
    <StageCollapsible
      v-for="stage in stages"
      :key="`stage-${stage.id}`"
      :stage="stage"
    />

    <div
      v-if="loading.specific.stages"
      class="w-full h-24 grid place-items-center"
    >
      <UiSpinner />
    </div>
  </PageRoot>
</template>
