<script setup lang="ts">
import { Check, ChevronRight, Lock, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, ChartLine, Users, Calendar, HelpCircle, Zap, Newspaper } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import CommentsDialog from "~/components/course/content/comments/CommentsDialog.vue";
import ContentRating from "~/components/course/content/comments/ContentRating.vue";

const store = useCoursesStore();
const { selectedCourse: course, availableStages: stages, allContents, loading } = storeToRefs(store);

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const route = useRoute();
const contentId = computed(() => route.params.contentId);

const activeContent = computed(() => allContents.value.find(c => c.id === Number(contentId.value)));
const activeStage = computed(() => course.value!.stages.find(s => s.contents.map(c => c.id).includes(Number(activeContent.value?.id ?? -1))));
provide("content", activeContent);

const scrollProgress = ref<number>(0);
function handleScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = max > 0 ? (window.scrollY / max) * 100 : 0;
}

window.addEventListener("scroll", handleScroll);
onBeforeUnmount(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>

<template>
  <LayoutRoot name="course-content">
    <UiSidebarProvider style="--sidebar-width: 20rem;">
      <UiSidebar class="overflow-y-auto">
        <UiSidebarHeader class="px-4! pt-5! pb-4! flex flex-col items-start gap-4">
          <UiButton
            variant="ghost"
            size="sm"
            as-child
          >
            <NuxtLinkLocale :to="`/${alias}/courses/${course?.id}`">
              <ArrowLeft />
              {{ $t("btn.back") }}
            </NuxtLinkLocale>
          </UiButton>

          <p class="font-bold line-clamp-2 leading-none">
            {{ course?.name }}
          </p>
        </UiSidebarHeader>

        <UiSidebarContent class="isolate">
          <UiSidebarGroup
            v-if="loading.specific.stages"
            class="grid place-items-center"
          >
            <UiSpinner />
          </UiSidebarGroup>
          <template
            v-for="(stage, index) in stages"
            v-else
            :key="`stage-${stage.id}`"
          >
            <UiSidebarSeparator
              v-if="index > 0"
              class="w-full! mx-0"
            />
            <UiCollapsible
              v-slot="{ open }"
              :default-open="true"
            >
              <UiSidebarGroup>
                <div class="sticky top-0 bg-sidebar z-10 flex items-center">
                  <Check
                    v-if="stage.contents.filter(c => c.progress.value >= 1).length === stage.contents.length"
                    class="size-3 shrink-0"
                  />

                  <UiSidebarGroupLabel class="flex items-center gap-1">
                    <UiPopover v-if="stage.locked">
                      <UiPopoverTrigger>
                        <Lock class="size-3 text-muted-foreground" />
                      </UiPopoverTrigger>
                      <UiPopoverContent class="grid gap-2">
                        <div
                          v-for="(condition, i) in stage.conditions"
                          :key="`stage#${stage.id}-condition#${i}`"
                          class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-muted-foreground"
                        >
                          <component :is="condition.icon" />
                          <p class="text-sm">
                            {{ condition.label }}
                          </p>
                        </div>
                      </UiPopoverContent>
                    </UiPopover>
                    {{ stage.name }}
                  </UiSidebarGroupLabel>

                  <UiCollapsibleTrigger as-child>
                    <UiSidebarGroupAction class="top-1.5 right-1">
                      <ChevronUp v-if="open" />
                      <ChevronDown v-else />
                    </UiSidebarGroupAction>
                  </UiCollapsibleTrigger>
                </div>
                <UiCollapsibleContent>
                  <div
                    v-if="loading.specific.stageContents.includes(stage.reference)"
                    class="grid place-items-center"
                  >
                    <UiSpinner />
                  </div>
                  <template v-else>
                    <UiSidebarMenu>
                      <UiSidebarMenuItem
                        v-for="content in stage.contents"
                        :key="`stage-${stage.id}-c#${content.id}`"
                      >
                        <UiSidebarMenuButton v-if="content.locked">
                          <span class="truncate flex-1">{{ content.name }}</span>
                          <UiPopover>
                            <UiPopoverTrigger as-child>
                              <Lock class="size-3 text-muted-foreground" />
                            </UiPopoverTrigger>
                            <UiPopoverContent class="grid gap-1.5">
                              <div
                                v-for="condition in content.conditions"
                                :key="`c#${content.id}-condition#${condition.label}`"
                                class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-muted-foreground"
                              >
                                <component :is="condition.icon" />
                                <p class="text-sm">
                                  {{ condition.label }}
                                </p>
                              </div>
                            </UiPopoverContent>
                          </UiPopover>
                        </UiSidebarMenuButton>
                        <UiSidebarMenuButton
                          v-else
                          as-child
                        >
                          <NuxtLinkLocale
                            :to="`/${alias}/reader/${id}/${content.id}`"
                            active-class="bg-sidebar-primary! text-sidebar-primary-foreground! *:text-sidebar-primary-foreground!"
                          >
                            <NuxtImg
                              class="aspect-square size-6 rounded-sm"
                              :src="content.picture"
                            />

                            <span class="truncate">
                              {{ content.name }}
                            </span>

                            <UiCircularProgress
                              v-if="content.progress.viewed"
                              class="size-4 ml-auto"
                              :model-value="content.progress.value * 100"
                            />
                            <span
                              v-else-if="content.duration && content.duration > 0"
                              class="shrink-0 ml-auto text-xs text-muted-foreground"
                            >{{ content.duration }} min</span>
                          </NuxtLinkLocale>
                        </UiSidebarMenuButton>
                      </UiSidebarMenuItem>
                    </UiSidebarMenu>
                  </template>
                </UiCollapsibleContent>
              </UiSidebarGroup>
            </UiCollapsible>
          </template>
        </UiSidebarContent>

        <UiSidebarFooter class="border-t">
          <UiSidebarGroup>
            <UiSidebarMenu>
              <UiSidebarMenuItem>
                <UiSidebarMenuButton as-child>
                  <NuxtLinkLocale
                    :to="`/${alias}/courses/${course?.id}/actions`"
                    active-class="bg-sidebar-primary! text-sidebar-primary-foreground!"
                  >
                    <Newspaper />
                    {{ $t("navigation.reader.community") }}
                  </NuxtLinkLocale>
                </UiSidebarMenuButton>
              </UiSidebarMenuItem>
              <UiSidebarMenuItem>
                <UiSidebarMenuButton as-child>
                  <NuxtLinkLocale
                    :to="`/${alias}/courses/${course?.id}/events`"
                    active-class="bg-sidebar-primary! text-sidebar-primary-foreground!"
                  >
                    <Calendar />
                    {{ $t("navigation.reader.events") }}
                  </NuxtLinkLocale>
                </UiSidebarMenuButton>
              </UiSidebarMenuItem>
              <UiSidebarMenuItem>
                <UiSidebarMenuButton as-child>
                  <NuxtLinkLocale
                    :to="`/${alias}/courses/${course?.id}/actions`"
                    active-class="bg-sidebar-primary! text-sidebar-primary-foreground!"
                  >
                    <Zap />
                    {{ $t("navigation.reader.actions") }}
                  </NuxtLinkLocale>
                </UiSidebarMenuButton>
              </UiSidebarMenuItem>
              <UiSidebarMenuItem>
                <UiSidebarMenuButton as-child>
                  <NuxtLinkLocale
                    :to="`/${alias}/courses/${course?.id}/people`"
                    active-class="bg-sidebar-primary! text-sidebar-primary-foreground!"
                  >
                    <Users />
                    {{ $t("navigation.reader.people") }}
                  </NuxtLinkLocale>
                </UiSidebarMenuButton>
              </UiSidebarMenuItem>
              <UiSidebarMenuItem>
                <UiSidebarMenuButton as-child>
                  <NuxtLinkLocale
                    :to="`/${alias}/courses/${course?.id}/results`"
                    active-class="bg-sidebar-primary! text-sidebar-primary-foreground!"
                  >
                    <ChartLine />
                    {{ $t("navigation.reader.results") }}
                  </NuxtLinkLocale>
                </UiSidebarMenuButton>
              </UiSidebarMenuItem>
              <UiSidebarSeparator class="mx-0 w-full" />
              <UiSidebarMenuItem>
                <UiSidebarMenuButton as-child>
                  <NuxtLinkLocale :to="`/${alias}/support`">
                    <HelpCircle />
                    {{ $t("navigation.reader.support") }}
                  </NuxtLinkLocale>
                </UiSidebarMenuButton>
              </UiSidebarMenuItem>
            </UiSidebarMenu>
          </UiSidebarGroup>
        </UiSidebarFooter>
      </UiSidebar>

      <UiSidebarInset class="flex flex-col">
        <main
          class="flex flex-col flex-1 p-6 pt-0"
        >
          <nav class="sticky top-0 pb-2 pt-3 flex items-center gap-6 justify-between bg-background">
            <div class="h-1 absolute top-0 inset-x-0 w-full bg-accent rounded-full overflow-hidden">
              <span
                class="block h-1 bg-primary rounded-full"
                :style="`width: ${scrollProgress}%`"
              />
            </div>

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
