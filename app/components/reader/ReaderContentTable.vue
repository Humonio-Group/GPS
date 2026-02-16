<script setup lang="ts">
import {
  ArrowLeft,
  Calendar,
  ChartLine,
  Check, ChevronDown,
  ChevronUp,
  HelpCircle,
  Lock,
  Newspaper,
  Users,
  Zap,
} from "lucide-vue-next";
import ReaderStage from "~/components/reader/elements/stage/ReaderStage.vue";
import type { Content, Contents } from "~/types/entities/course";

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const store = useCoursesStore();
const { selectedCourse: course, availableStages: stages, loading } = storeToRefs(store);
const selectedContent = inject("content") as Ref<Content>;

const courseProgress = computed(() => {
  const contents = course.value?.stages.map(s => s.contents).reduce((acc, contents) => {
    acc = [...acc, ...contents];
    return acc;
  }, [] as Contents) ?? [];
  return contents.reduce((acc, content) => {
    acc += content.progress.value;
    return acc;
  }, 0) / (contents.length || 1);
});
</script>

<template>
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

      <div
        v-if="!loading.specific.stages && !loading.specific.stageContents.length"
        class="w-full flex items-center gap-2"
      >
        <span class="text-xs font-bold text-primary">{{ Math.round(courseProgress * 100) }} %</span>

        <UiProgress
          class="flex-1"
          :model-value="courseProgress * 100"
        />
      </div>
      <div
        v-else
        class="flex items-center gap-2 w-full"
      >
        <UiSkeleton class="h-2 w-[3ch]" />
        <UiSkeleton
          class="h-2 flex-1"
        />
      </div>
    </UiSidebarHeader>

    <UiSidebarContent class="isolate">
      <template v-if="loading.specific.stages">
        <UiSidebarGroup
          v-for="i in (Math.floor(Math.random() * 3) + 1)"
          :key="i"
          class="grid place-items-center py-0"
        >
          <UiSkeleton class="h-12 w-full" />
        </UiSidebarGroup>
      </template>
      <template
        v-for="(stage, index) in stages"
        v-else
        :key="`stage-${stage.id}`"
      >
        <template v-if="false">
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

        <UiSidebarGroup class="p-0 px-2">
          <ReaderStage
            :stage
            :content="selectedContent"
          />
        </UiSidebarGroup>
      </template>
    </UiSidebarContent>

    <UiSidebarFooter class="border-t">
      <UiSidebarGroup>
        <UiSidebarMenu>
          <UiSidebarMenuItem>
            <UiSidebarMenuButton disabled>
              <Newspaper />
              {{ $t("navigation.reader.community") }}
            </UiSidebarMenuButton>
          </UiSidebarMenuItem>
          <UiSidebarMenuItem>
            <UiSidebarMenuButton as-child>
              <NuxtLinkLocale
                :to="`/${alias}/reader/${course?.id}/events`"
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
                :to="`/${alias}/reader/${course?.id}/actions`"
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
                :to="`/${alias}/reader/${course?.id}/people`"
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
                :to="`/${alias}/reader/${course?.id}/results`"
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
</template>
