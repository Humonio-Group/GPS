<script setup lang="ts">
import { Lock, ChevronDown, ChevronUp, X } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import CommentsDialog from "~/components/course/content/comments/CommentsDialog.vue";

const store = useCoursesStore();
const { selectedCourse: course, availableStages: stages, allContents, loading } = storeToRefs(store);

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const route = useRoute();
const contentId = computed(() => route.params.contentId);

const activeContent = computed(() => allContents.value.find(c => c.id === Number(contentId.value)));
provide("content", activeContent);
</script>

<template>
  <LayoutRoot name="course-content">
    <UiSidebarProvider>
      <UiSidebar class="overflow-y-auto">
        <UiSidebarHeader class="h-16 flex items-start justify-center px-4">
          <p class="font-bold truncate">
            {{ $t("labels.table-of-contents") }}
          </p>
        </UiSidebarHeader>

        <UiSidebarContent>
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
            <UiSidebarSeparator v-if="index > 0" />
            <UiCollapsible
              v-slot="{ open }"
              :default-open="true"
            >
              <UiSidebarGroup>
                <UiSidebarGroupLabel class="flex items-center gap-1">
                  <UiPopover v-if="stage.locked">
                    <UiPopoverTrigger>
                      <Lock class="size-3 text-muted-foreground" />
                    </UiPopoverTrigger>
                    <UiPopoverContent class="grid gap-2">
                      <div
                        v-for="(condition, index) in stage.conditions"
                        :key="`stage#${stage.id}-condition#${index}`"
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
                  <UiSidebarGroupAction>
                    <ChevronUp v-if="open" />
                    <ChevronDown v-else />
                  </UiSidebarGroupAction>
                </UiCollapsibleTrigger>
                <UiCollapsibleContent>
                  <div
                    v-if="loading.specific.stageContents.includes(stage.reference)"
                    class="grid place-items-center"
                  >
                    <UiSpinner />
                  </div>
                  <template v-else>
                    <div
                      v-if="false && (stage.description || stage.picture)"
                      class="flex flex-col gap-2 px-2 mb-3"
                    >
                      <NuxtImg
                        v-if="stage.picture"
                        :src="stage.picture"
                        class="w-full rounded-lg"
                      />
                      <p
                        v-if="stage.description"
                        class="whitespace-pre-line text-sm text-muted-foreground"
                      >
                        {{ stage.description }}
                      </p>
                    </div>

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
                            active-class="bg-sidebar-accent! text-sidebar-accent-foreground!"
                          >
                            <span class="truncate">
                              {{ content.name }}
                            </span>

                            <UiCircularProgress
                              v-if="content.progress.viewed"
                              class="size-4 ml-auto"
                              :model-value="content.progress.value * 100"
                            />
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
      </UiSidebar>

      <UiSidebarInset class="flex flex-col">
        <main class="flex flex-col flex-1 p-6 pt-4">
          <nav class="sticky top-0 py-2 flex items-center gap-6 justify-between">
            <div class="flex items-center">
              <UiSidebarTrigger />
              <UiButton
                variant="ghost"
                size="icon-sm"
                as-child
              >
                <NuxtLinkLocale :to="`/${alias}/courses/${course!.id}`">
                  <X />
                </NuxtLinkLocale>
              </UiButton>
            </div>
            <div class="flex items-center">
              <CommentsDialog
                v-if="content && (content.permissions.rateable || content.permissions.commentable)"
                :content="content"
              />
            </div>
          </nav>

          <NuxtPage />
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
