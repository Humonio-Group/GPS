<script setup lang="ts">
import { ChevronRight, ArrowRight, ArrowLeft } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import CommentsDialog from "~/components/course/content/comments/CommentsDialog.vue";
import ContentRating from "~/components/course/content/comments/ContentRating.vue";
import type { Content } from "~/types/entities/course";

const store = useCoursesStore();
const { selectedCourse: course, allContents } = storeToRefs(store);

const { alias } = useWorkspaceUtils();

const route = useRoute();
const contentId = computed(() => route.params.contentId);

const activeContent = computed(() => allContents.value.find(c => c.id === Number(contentId.value)));
const activeStage = computed(() => course.value!.stages.find(s => s.contents.map(c => c.id).includes(Number(activeContent.value?.id ?? -1))));
provide("content", activeContent);

const { progress: scrollProgress } = useScrollIsland();

const next = computed<Content | undefined>(() => {
  const currentIndex = allContents.value.findIndex(c => c.id === activeContent.value?.id);
  let index = currentIndex + 1;

  if (index >= allContents.value.length || !allContents.value[index]) return undefined;

  let nextContent: Content = allContents.value[index]!;
  while (nextContent!.locked) {
    index++;
    if (index >= allContents.value.length) return;

    const c: Content | undefined = allContents.value[index];
    if (!c) return;
    nextContent = c;
  }

  return nextContent;
});
const previous = computed<Content | undefined>(() => {
  const currentIndex = allContents.value.findIndex(c => c.id === activeContent.value?.id);
  let index = currentIndex - 1;

  if (index < 0 || !allContents.value[index]) return undefined;

  let previous: Content = allContents.value[index]!;
  while (previous!.locked) {
    index--;
    if (index < 0) return;

    const c: Content | undefined = allContents.value[index];
    if (!c) return;
    previous = c;
  }

  return previous;
});
</script>

<template>
  <LayoutRoot name="course-content">
    <UiSidebarProvider style="--sidebar-width: 20rem;">
      <ReaderContentTable :content="activeContent" />

      <UiSidebarInset class="flex flex-col relative isolate">
        <div class="h-1 absolute top-0 inset-x-0 w-full rounded-full overflow-hidden z-10">
          <span
            class="block h-1 bg-linear-to-r from-primary/10 to-primary rounded-full"
            :style="`width: ${scrollProgress}%`"
          />
        </div>

        <main
          class="flex flex-col flex-1 p-6 pt-0"
        >
          <nav class="sticky top-0 pb-2 pt-3 flex items-center gap-6 justify-between bg-background">
            <div class="flex items-center gap-2">
              <UiSidebarTrigger />

              <UiBreadcrumb>
                <UiBreadcrumbList>
                  <UiBreadcrumbItem>
                    <UiBreadcrumbLink
                      class="truncate max-w-20 md:max-w-48"
                      as-child
                    >
                      <NuxtLinkLocale
                        :to="`/${alias}/courses/${course?.id}`"
                        class="hover:text-primary!"
                      >
                        {{ course?.name }} {{ course?.name }}
                      </NuxtLinkLocale>
                    </UiBreadcrumbLink>
                  </UiBreadcrumbItem>
                  <UiBreadcrumbSeparator v-if="activeStage || activeContent">
                    <ChevronRight class="opacity-50" />
                  </UiBreadcrumbSeparator>

                  <template v-if="activeStage">
                    <UiBreadcrumbItem class="*:truncate max-w-20 md:max-w-48">
                      <span>{{ activeStage.name }}</span>
                    </UiBreadcrumbItem>
                    <UiBreadcrumbSeparator>
                      <ChevronRight class="opacity-50" />
                    </UiBreadcrumbSeparator>
                  </template>

                  <UiBreadcrumbItem
                    v-if="activeContent"
                    class="*:truncate max-w-20 md:max-w-48"
                  >
                    <span>{{ activeContent?.name }}</span>
                  </UiBreadcrumbItem>
                </UiBreadcrumbList>
              </UiBreadcrumb>
            </div>
            <div class="flex items-center">
              <CommentsDialog
                v-if="activeContent && activeContent.permissions.commentable"
                :content="activeContent"
              />
            </div>
          </nav>

          <main class="min-h-0 flex-1">
            <NuxtPage />
          </main>

          <footer
            v-if="activeContent"
            class="sticky bottom-6 flex items-center justify-between gap-4"
          >
            <div>
              <div
                v-if="activeContent.permissions.rateable"
                class="flex items-center bg-accent rounded-full overflow-hidden h-9 px-3"
              >
                <ContentRating :content="activeContent" />
              </div>
            </div>

            <div class="flex items-center bg-accent rounded-full overflow-hidden">
              <UiButton
                v-if="!!previous"
                variant="ghost"
                size="icon-lg"
                as-child
              >
                <NuxtLinkLocale
                  :to="`/${alias}/reader/${course!.id}/${previous.id}`"
                >
                  <ArrowLeft />
                </NuxtLinkLocale>
              </UiButton>
              <UiButton
                v-else
                variant="ghost"
                size="icon-lg"
                disabled
              >
                <ArrowLeft />
              </UiButton>

              <UiButton
                v-if="next"
                variant="ghost"
                size="icon-lg"
                as-child
              >
                <NuxtLinkLocale :to="`/${alias}/reader/${course!.id}/${next.id}`">
                  <ArrowRight />
                </NuxtLinkLocale>
              </UiButton>
              <UiButton
                v-else
                variant="ghost"
                size="icon-lg"
                disabled
              >
                <ArrowRight />
              </UiButton>
            </div>
          </footer>
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
