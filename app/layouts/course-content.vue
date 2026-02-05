<script setup lang="ts">
import { Lock, ChevronDown, ChevronUp } from "lucide-vue-next";
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";

const store = useCoursesStore();
const { availableStages: stages, loading } = storeToRefs(store);

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
            v-for="stage in stages"
            v-else
            v-slot="{ open }"
            :key="`stage-${stage.id}`"
            :default-open="true"
          >
            <UiSidebarGroup>
              <div class="flex items-center gap-1">
                <UiSidebarGroupLabel>
                  <UiPopover>
                    <UiPopoverTrigger>
                      <Lock class="size-3 text-muted-foreground" />
                    </UiPopoverTrigger>
                    <UiPopoverContent class="grid gap-2">
                      <!-- TODO: <div class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-muted-foreground">
                        <component :is="condition.icon" />
                        <p class="text-sm">{{ condition.label }}</p>
                      </div> - loic -->
                    </UiPopoverContent>
                  </UiPopover>
                  {{ stage.name }}
                </UiSidebarGroupLabel>
              </div>

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
