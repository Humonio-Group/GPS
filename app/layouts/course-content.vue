<script setup lang="ts">
import { ChevronRight, ArrowRight, ArrowLeft } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import CommentsDialog from "~/components/course/content/comments/CommentsDialog.vue";
import ContentRating from "~/components/course/content/comments/ContentRating.vue";

const store = useCoursesStore();
const { selectedCourse: course, allContents } = storeToRefs(store);

const { alias } = useWorkspaceUtils();

const route = useRoute();
const contentId = computed(() => route.params.contentId);

const activeContent = computed(() => allContents.value.find(c => c.id === Number(contentId.value)));
const activeStage = computed(() => course.value!.stages.find(s => s.contents.map(c => c.id).includes(Number(activeContent.value?.id ?? -1))));
provide("content", activeContent);

const { progress: scrollProgress } = useScrollIsland();
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
            <div class="bg-accent rounded-full overflow-hidden" />

            <div class="flex items-center gap-4">
              <div
                v-if="activeContent.permissions.rateable"
                class="flex items-center bg-accent rounded-full overflow-hidden h-9 px-3"
              >
                <ContentRating :content="activeContent" />
              </div>
              <div class="flex items-center bg-accent rounded-full overflow-hidden">
                <UiButton
                  variant="ghost"
                  size="icon-lg"
                  :disabled="!activeContent.navigation.previous"
                  :as-child="!!activeContent.navigation.previous"
                >
                  <NuxtLinkLocale
                    v-if="!!activeContent?.navigation.previous"
                    :to="`/${alias}/reader/${course!.id}/${activeContent?.navigation.previous}`"
                  >
                    <ArrowLeft />
                  </NuxtLinkLocale>
                  <ArrowLeft v-else />
                </UiButton>
                <UiButton
                  variant="ghost"
                  size="icon-lg"
                  :disabled="!activeContent.navigation.next"
                  :as-child="!!activeContent.navigation.next"
                >
                  <NuxtLinkLocale
                    v-if="!!activeContent.navigation.next"
                    :to="`/${alias}/reader/${course!.id}/${activeContent?.navigation.next}`"
                  >
                    <ArrowRight />
                  </NuxtLinkLocale>
                  <ArrowRight v-else />
                </UiButton>
              </div>
            </div>
          </footer>
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
