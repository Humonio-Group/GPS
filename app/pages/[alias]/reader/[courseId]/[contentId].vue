<script setup lang="ts">
import { ArrowLeft, ArrowRight, Clock } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import ContentDetails from "~/components/course/content/ContentDetails.vue";

definePageMeta({
  layout: "course-content",
});

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const store = useCoursesStore();
const { selectedCourse: course, allContents } = storeToRefs(store);

const contentId = useRoute().params.contentId;
const content = computed(() => allContents.value.find(c => c.id === Number(contentId)));
watch(content, val => useHead({
  title: `${val?.name} - ${course.value!.name}`,
}), { immediate: true });
const stage = computed(() => course.value!.stages.find(s => s.contents.map(c => c.id).includes(Number(contentId))));
</script>

<template>
  <PageRoot
    name="course.content-reader"
    class="p-6 flex flex-col gap-6 min-h-dvh"
  >
    <nav class="py-2 bg-background sticky top-0 flex items-center justify-between">
      <UiButton
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale :to="`/${alias}/courses/${id}`">
          <ArrowLeft />
          {{ $t("btn.back") }}
        </NuxtLinkLocale>
      </UiButton>

      <UiSidebarTrigger />
    </nav>

    <header class="w-full max-w-4xl mx-auto pb-6 border-b flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <p class="text-2xl font-bold">
          {{ content!.name }}
        </p>

        <UiCircularProgress
          v-if="content!.progress.viewed"
          :model-value="content!.progress.value * 100"
        />
      </div>

      <ul
        v-if="content!.duration"
        class="grid gap-2"
      >
        <li
          v-if="content!.duration"
          class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-muted-foreground"
        >
          <Clock />
          {{ $t("labels.time.long.minutes", content!.duration, { named: { value: content!.duration } }) }}
        </li>
      </ul>
    </header>

    <ContentDetails :content="content!" />

    <footer class="w-full max-w-4xl mx-auto flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
      <UiButton variant="link">
        <ArrowLeft />
        {{ $t("btn.previous-content") }}
      </UiButton>

      <p
        v-if="stage"
        class="order-1 @lg:order-0 text-muted-foreground text-sm text-center truncate"
      >
        {{ stage?.name }}
      </p>

      <UiButton variant="link">
        {{ $t("btn.next-content") }}
        <ArrowRight />
      </UiButton>
    </footer>
  </PageRoot>
</template>
