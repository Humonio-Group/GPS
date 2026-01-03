<script setup lang="ts">
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";

const store = useCoursesStore();
const { selectedCourse: course } = storeToRefs(store);

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const route = useRoute();
const contentId = computed(() => route.params.contentId);
</script>

<template>
  <LayoutRoot name="course-content">
    <UiSidebarProvider>
      <UiSidebarInset class="overflow">
        <NuxtPage :key="contentId as string" />
      </UiSidebarInset>

      <UiSidebar side="right">
        <UiSidebarContent class="overflow-y-auto">
          <UiCollapsible
            v-for="stage in course!.stages"
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
                <UiSidebarMenu>
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
    </UiSidebarProvider>
  </LayoutRoot>
</template>
