<script setup lang="ts">
import { TrendingUp } from "lucide-vue-next";
import type { Action } from "~/types/entities/action";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";

interface ActionDetailsDialogProps {
  action: Action;
}

const props = defineProps<ActionDetailsDialogProps>();

const tasks = computed(() => [...props.action.tasks]
  .sort((a, b) => a.order - b.order)
  .sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)));

const completedCount = computed(() => tasks.value.filter(t => t.done).length);
const totalCount = computed(() => tasks.value.length);
</script>

<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <slot />
    </UiDialogTrigger>

    <UiDialogContent>
      <section>
        <MarkdownRenderer :content="action.description.original" />
      </section>

      <!-- objective -->
      <UiCard class="p-4 gap-3 flex-row">
        <TrendingUp class="size-4 text-muted-foreground" />

        <UiCardHeader class="flex-1 px-0">
          <UiCardTitle>{{ action.objective.name }}</UiCardTitle>
          <UiCardDescription>{{ action.objective.description }}</UiCardDescription>
        </UiCardHeader>
      </UiCard>

      <section
        v-if="action.tasks.length"
        class="grid gap-2"
      >
        <header class="flex items-center justify-between">
          <h3 class="text-lg font-bold">
            {{ $t("courses.specimen.actions.tasklist") }}
          </h3>

          <UiBadge variant="outline">
            {{ $t("courses.specimen.actions.count", { done: completedCount, total: totalCount }) }}
          </UiBadge>
        </header>

        <ul>
          <li
            v-for="task in tasks"
            :key="`a${action.id}-task#${task.name.substring(0, 8)}`"
            class="flex items-center gap-2"
          >
            <UiLabel
              :for="`a${action.id}-task#${task.name.substring(0, 8)}`"
              class="text-base! font-normal! leading-normal!"
            >
              <UiCheckbox
                :id="`a${action.id}-task#${task.name.substring(0, 8)}`"
                v-model="task.done"
                class="size-5"
              /> <!-- todo: update task/action to sync with server -->

              <span :class="{ 'text-muted-foreground line-through': task.done }">
                {{ task.name }}
              </span>
            </UiLabel>
          </li>
        </ul>
      </section>
    </UiDialogContent>
  </UiDialog>
</template>
