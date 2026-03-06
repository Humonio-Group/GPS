<script setup lang="ts">
import {
  ArrowLeft,
  Calendar,
  ChartLine,
  HelpCircle,
  Newspaper,
  Users,
  Zap,
} from "lucide-vue-next";
import ReaderStage from "~/components/reader/elements/stage/ReaderStage.vue";
import type { Content, Contents } from "~/types/entities/course";

const { alias } = useWorkspaceUtils();

const store = useCoursesStore();
const { selectedCourse: course, availableStages: stages, loading } = storeToRefs(store);
const selectedContent = inject("content") as Ref<Content>;
watch(selectedContent, async (val) => {
  if (!val) return;
  await nextTick();
  document.getElementById(`content-${val.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

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
        v-for="stage in stages"
        v-else
        :key="`stage-${stage.id}`"
      >
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
