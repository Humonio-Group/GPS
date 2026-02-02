<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import { EntityType } from "~/types/entities/entities";
import type { TaskActivity } from "~/types/entities/activity";

interface ContentTasklistProps {
  content: Content;
}

const props = defineProps<ContentTasklistProps>();
const { selectedCourse: course } = storeToRefs(useCoursesStore());
const api = useApi();
const logger = useLogger();

const tasks = computed(() => props.content.activity.tasks ?? []);

async function handleCheck(task: TaskActivity, value: boolean) {
  logger.log("[TASKLIST] Handle change, verify course");
  if (!course.value) return;

  logger.log("[TASKLIST] Update task checked statement and send request");
  task.checked = value;
  await api.post("/taskslist_answers", { version: 2, endpointVersion: 1 }, {
    body: {
      data: {
        type: EntityType.TASKLIST_ANSWER,
        attributes: {
          checked: task.checked,
        },
        relationships: {
          journey: {
            data: {
              type: EntityType.JOURNEY,
              id: course.value!.id,
            },
          },
          task: {
            data: {
              type: EntityType.TASK,
              id: task.id,
            },
          },
        },
      },
    },
  });
}
</script>

<template>
  <div class="flex flex-col gap-2 w-full max-w-4xl mx-auto">
    <UiLabel
      v-for="task in tasks"
      :key="task.id"
      class="flex items-center gap-2 text-base! font-normal!"
    >
      <UiCheckbox
        class="size-5"
        :model-value="task.checked"
        @update:model-value="handleCheck(task, $event as boolean)"
      />
      <p>{{ task.label }}</p>
    </UiLabel>
  </div>
</template>
