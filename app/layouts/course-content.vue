<script setup lang="ts">
import { ChevronRight, ArrowRight, MessageCircle } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import CommentsDialog from "~/components/course/content/comments/CommentsDialog.vue";
import ContentRating from "~/components/course/content/comments/ContentRating.vue";
import type { Content } from "~/types/entities/course";
import StarFill from "~/components/icons/StarFill.vue";
import ReaderContentTableTrigger from "~/components/reader/ReaderContentTableTrigger.vue";

const store = useCoursesStore();
const { selectedCourse: course, allContents } = storeToRefs(store);

const { alias } = useWorkspaceUtils();
const { fromMinutes } = useTimeUtils();

const route = useRoute();
const contentId = computed(() => route.params.contentId);
const commentsOpen = ref<boolean>(false);

const activeContent = computed(() => allContents.value.find(c => c.id === Number(contentId.value)));
const activeStage = computed(() => course.value!.stages.find(s => s.contents.map(c => c.id).includes(Number(activeContent.value?.id ?? -1))));
provide("content", activeContent);
provide("stage", activeStage);

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

        <main class="flex flex-col flex-1 pt-0 pb-18 md:pb-24">
          <nav class="sticky top-0 z-20 px-6 pb-2 pt-3 h-12.25 flex items-center gap-6 justify-between bg-background border-b">
            <div class="flex items-center gap-4">
              <ReaderContentTableTrigger />

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

                  <template v-if="activeStage">
                    <UiBreadcrumbSeparator>
                      <ChevronRight class="opacity-50" />
                    </UiBreadcrumbSeparator>
                    <UiBreadcrumbItem class="*:truncate max-w-20 md:max-w-48">
                      <UiBreadcrumbLink
                        class="truncate max-w-20 md:max-w-48"
                        as-child
                      >
                        <NuxtLinkLocale
                          :to="`/${alias}/reader/${course!.id}/stages/${activeStage.id}`"
                          class="hover:text-primary!"
                        >
                          <span>{{ activeStage.name }}</span>
                        </NuxtLinkLocale>
                      </UiBreadcrumbLink>
                    </UiBreadcrumbItem>
                  </template>

                  <template v-if="activeStage && activeContent">
                    <UiBreadcrumbSeparator>
                      <ChevronRight class="opacity-50" />
                    </UiBreadcrumbSeparator>
                    <UiBreadcrumbItem class="*:truncate max-w-20 md:max-w-48">
                      <span>{{ activeContent.name }}</span>
                    </UiBreadcrumbItem>
                  </template>
                </UiBreadcrumbList>
              </UiBreadcrumb>
            </div>
            <div class="flex items-center">
              <CommentsDialog
                v-if="activeContent && activeContent.permissions.commentable"
                v-model:open="commentsOpen"
                :content="activeContent"
              />
            </div>
          </nav>

          <section class="min-h-0 flex-1">
            <NuxtPage />
          </section>

          <section
            v-if="activeContent"
            class="max-w-4xl mx-auto w-full flex flex-col gap-4"
          >
            <section
              v-if="activeContent?.permissions.rateable"
              class="flex flex-col @lg:flex-row @lg:items-center gap-2 @lg:gap-4"
            >
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <StarFill class="size-4 opacity-50" />
                <p>{{ $t("reader.mark-content") }}</p>
              </div>
              <ContentRating :content="activeContent" />

              <div
                v-if="false"
                class="@lg:ml-auto"
              >
                stats
              </div> <!-- todo: bind content rating stats - loic -->
            </section>

            <UiSeparator v-if="activeContent?.permissions.commentable && activeContent?.permissions.rateable" />

            <UiButton
              v-if="activeContent?.permissions.commentable"
              variant="ghost"
              class="h-auto text-muted-foreground! justify-between -mx-4"
              @click="commentsOpen = true"
            >
              <div class="flex items-center gap-2">
                <MessageCircle />
                <span>{{ $t("reader.comments.label") }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="activeContent.topic.comments.length"
                  class="text-xs"
                >{{ $t("labels.comments", activeContent.topic.comments.length, { named: { count: activeContent.topic.comments.length } }) }}</span>
                <ChevronRight />
              </div>
            </UiButton>

            <section
              v-if="next"
              class="px-6"
            >
              <NuxtLinkLocale
                :to="`/${alias}/reader/${course!.id}/${next.id}`"
                class="group"
              >
                <UiCard class="group-hover:border-primary">
                  <UiCardContent class="flex items-center gap-3">
                    <NuxtImg
                      v-if="next.picture"
                      :src="next.picture"
                      class="size-10 rounded-lg bg-primary object-cover"
                    />

                    <div class="grid gap-1 auto-rows-min">
                      <div class="flex items-center gap-1">
                        <p class="text-xs leading-none uppercase font-medium text-primary">
                          {{ $t("labels.next-activity") }}
                        </p>

                        <div
                          v-if="next.duration"
                          class="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <p>
                            · {{ fromMinutes(next.duration, "short") }}
                          </p>
                        </div>
                      </div>
                      <p class="text-lg leading-tight font-semibold truncate">
                        {{ next.name }}
                      </p>
                    </div>

                    <ArrowRight class="shrink-0 ml-auto size-5 text-primary" />
                  </UiCardContent>
                </UiCard>
              </NuxtLinkLocale>
            </section>
          </section>
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
