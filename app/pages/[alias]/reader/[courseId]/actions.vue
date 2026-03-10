<script setup lang="ts">
import { Zap, Plus, X, Search } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import ActionCard from "~/components/course/action/ActionCard.vue";
import CreateActionFromTemplateDialog from "~/components/course/action/CreateActionFromTemplateDialog.vue";

const id = computed(() => useRoute().params.courseId as string);

const store = useCoursesStore();
const { isMobile } = useResponsive();
const { selectedCourse: course, loading } = storeToRefs(store);

const actions = computed(() => course.value?.actions ?? []);
const { search, results, clear } = useSearch(actions, "description.original");

store.loadActions();
</script>

<template>
  <PageRoot
    :name="`courses.specimen.${id}.actions`"
    class="w-full"
    wrapper
    wrapper-class="w-full max-w-7xl mx-auto grid gap-2"
  >
    <h1 class="text-3xl font-extrabold">
      {{ $t("courses.specimen.actions.page-title") }}
    </h1>

    <nav class="flex items-center w-full gap-1">
      <div class="relative flex-1">
        <UiInput
          v-model="search"
          class="w-full pl-8"
          :placeholder="$t('labels.search')"
        />
        <UiButton
          v-if="search.length"
          variant="ghost"
          size="icon-xs"
          class="absolute top-1.5 left-1.5 size-6 rounded-full"
          @click="clear"
        >
          <X />
        </UiButton>
        <Search
          v-else
          class="absolute top-2.5 left-2.5 size-4 text-muted-foreground"
        />
      </div>

      <CreateActionFromTemplateDialog
        v-if="actions.length"
        trigger
      >
        <UiButton :size="isMobile ? 'icon' : 'default'">
          <Plus />
          {{ $t("btn.create.action") }}
        </UiButton>
      </CreateActionFromTemplateDialog>
    </nav>

    <div
      v-if="results.length > 0"
      class="grid gap-2"
    >
      <ActionCard
        v-for="action in results"
        :key="`c${course!.id}-action#${action.id}`"
        :action="action"
      />
    </div>
    <UiEmpty v-else-if="!loading.specific.actions">
      <UiEmptyHeader>
        <UiEmptyMedia
          variant="icon"
          class="text-muted-foreground"
        >
          <Zap />
        </UiEmptyMedia>
        <UiEmptyTitle>
          {{ $t("courses.specimen.actions.empty.title") }}
        </UiEmptyTitle>
        <UiEmptyDescription>
          {{ $t("courses.specimen.actions.empty.description") }}
        </UiEmptyDescription>
      </UiEmptyHeader>

      <UiEmptyContent>
        <CreateActionFromTemplateDialog trigger>
          <UiButton>
            <Plus />
            {{ $t("btn.create.action") }}
          </UiButton>
        </CreateActionFromTemplateDialog>
      </UiEmptyContent>
    </UiEmpty>

    <div
      v-if="loading.specific.actions"
      class="grid place-items-center w-full"
    >
      <UiSpinner />
    </div>
  </PageRoot>
</template>
