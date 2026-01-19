<script setup lang="ts">
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";

const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const route = useRoute();
const contentId = computed(() => route.params.contentId);
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
          <UiCollapsible
            v-for="stage in course!.stages"
            v-else
            v-slot="{ open }"
            :key="`stage-${stage.id}`"
            :default-open="true"
          >
            <UiSidebarGroup>
              <UiSidebarGroupLabel>{{ stage.name }}</UiSidebarGroupLabel>

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
                <UiSidebarMenu v-else>
                  <UiSidebarMenuItem
                    v-for="content in stage.contents"
                    :key="`stage-${stage.id}-c#${content.id}`"
                  >
                    <UiSidebarMenuButton as-child>
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
              </UiCollapsibleContent>
            </UiSidebarGroup>
          </UiCollapsible>
        </UiSidebarContent>
      </UiSidebar>

      <UiSidebarInset class="overflow">
        <NuxtPage :key="contentId as string" />
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
