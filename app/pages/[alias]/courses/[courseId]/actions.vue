<script setup lang="ts">
import { Zap, Plus } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import ActionCard from "~/components/course/action/ActionCard.vue";

const id = computed(() => useRoute().params.courseId as string);

const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);

store.loadActions();
</script>

<template>
  <PageRoot
    :name="`courses.specimen.${id}.actions`"
    class="text-sm text-muted-foreground grid gap-4"
  >
    <header
      v-if="false"
      class="flex items-center justify-between"
    >
      <!-- todo: tabs - loic -->
      <div class="flex gap-2">
        <UiButton
          variant="outline"
          size="sm"
        >
          Personnelles
          <UiBadge
            class="text-[0.55rem]! px-1.5"
            variant="secondary"
          >
            {{ course!.actions.length }}
          </UiBadge>
        </UiButton>
        <UiButton
          variant="outline"
          size="sm"
        >
          Publiques
          <UiBadge
            class="text-[0.55rem]! px-1.5"
            variant="secondary"
          >
            {{ course!.actions.length }}
          </UiBadge>
        </UiButton>
        <UiButton
          variant="outline"
          size="sm"
        >
          Suivies
          <UiBadge
            class="text-[0.55rem]! px-1.5"
            variant="secondary"
          >
            {{ course!.actions.length }}
          </UiBadge>
        </UiButton>
      </div>

      <UiButton>
        <Plus />
        {{ $t("btn.create.action") }}
      </UiButton>
    </header>

    <div
      v-if="course!.actions.length > 0"
      class="grid gap-4"
    >
      <ActionCard
        v-for="action in course!.actions"
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
        <UiButton>
          <Plus />
          {{ $t("btn.create.action") }}
        </UiButton>
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
