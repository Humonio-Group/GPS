<script setup lang="ts">
import { v4 as uuid } from "uuid";
import type { Content } from "~/types/entities/course";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Plus } from "lucide-vue-next";
import { z } from "zod";
import { MarkdownEditor } from "~/components/ui/markdown-editor";
import { today, getLocalTimeZone, type DateValue, fromDate } from "@internationalized/date";

interface CreateActionDialogProps {
  content: Content;
}
interface FormTask {
  id: string;
  checked: boolean;
  label: string;
}

const { locale, t } = useI18n();
const { formatDate } = useDateUtils();

const props = defineProps<CreateActionDialogProps>();
const open = defineModel<boolean>("open", { default: false });
watch(open, async (val) => {
  if (!val) return;
  await strategyStore.loadStrategies(props.content.activity.action!.reference);
  form.resetForm({
    values: {
      objective: strategies.value[0]!.id,
    },
  });
  tasks.value = [
    { id: uuid(), checked: false, label: "" },
  ];
});

const strategyStore = useStrategyStore();
const { loading: loadingStrategies, strategies } = storeToRefs(strategyStore);

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    objective: z.number().min(0),
    description: z.string({ message: t("labels.form-errors.tasks.description-required") }),
    deadline: z.date().default(() => new Date()),
    tasks: z.array(z.object({
      checked: z.boolean().default(false),
      label: z.string(),
    })).min(1).superRefine((val, ctx) => {
      if (val.some(t => t.label.trim().length === 0))
        ctx.addIssue({
          code: "custom",
          message: t("labels.form-errors.tasks.task-label-non-empty"),
        });
    }),
  })),
  initialValues: {
    tasks: [
      {
        checked: false,
        label: "",
      },
    ],
  },
});

const deadline = computed({
  get: () => fromDate(form.values.deadline ?? new Date(), getLocalTimeZone()),
  set: (value: DateValue) => form.setFieldValue("deadline", value.toDate(getLocalTimeZone())),
});
const tasks = ref<FormTask[]>([{ id: uuid(), checked: false, label: "" }]);
watch(tasks, val => form.setFieldValue("tasks", val.map(t => ({ checked: t.checked, label: t.label }))), { deep: true });

const submit = form.handleSubmit(async (values) => {
  useLogger().log("Create action.", values);
});

async function addTask() {
  const task = {
    id: uuid(),
    checked: false,
    label: "",
  };
  tasks.value = [...tasks.value, task];

  await nextTick();
  const taskInput = document.getElementById(`task-input-${task.id}`);
  if (!taskInput) return;

  taskInput.focus();
  taskInput.scrollIntoView({ behavior: "smooth" });
}
async function removeTask(id: string) {
  const index = tasks.value.findIndex(t => t.id === id);
  if (index === -1) return;
  if (tasks.value.length <= 1) return;

  const previousIndex = Math.max(0, index - 1);
  tasks.value.splice(index, 1);
  await nextTick();

  const previousTaskInput = document.getElementById(`task-input-${tasks.value[previousIndex]?.id}`);
  previousTaskInput?.focus();
  previousTaskInput?.scrollIntoView({ behavior: "smooth" });
}
async function handleTaskKeydown(id: string, event: KeyboardEvent) {
  switch (event.key) {
    case "Enter": {
      addTask().then();
      break;
    }
    case "Backspace": {
      const index = tasks.value.findIndex(t => t.id === id);
      if (index === -1) return;

      const taskValue = tasks.value[index]?.label ?? "";
      if (taskValue.length > 0) return;
      removeTask(id).then();
      break;
    }
    default: {
      return;
    }
  }

  event.preventDefault();
  event.stopPropagation();
}
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogTrigger as-child>
      <slot />
    </UiDialogTrigger>

    <UiDialogContent class="max-w-3xl! w-[calc(100%-2rem)] max-h-[calc(85dvh-2rem)] overflow-y-auto pb-0">
      <UiDialogHeader>
        <UiDialogTitle>{{ $t("dialogs.create-action.title") }}</UiDialogTitle>
        <UiDialogDescription>{{ $t("dialogs.create-action.description") }}</UiDialogDescription>
      </UiDialogHeader>

      <div
        v-if="loadingStrategies"
        class="h-24 grid place-items-center"
      >
        <UiSpinner />
      </div>
      <form
        v-else
        class="grid gap-4"
        @submit="submit"
      >
        <UiFormField
          v-slot="{ componentField }"
          name="objective"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("labels.fields.objective") }}</UiFormLabel>
            <UiSelect v-bind="componentField">
              <UiFormControl>
                <UiSelectTrigger class="w-full">
                  <UiSelectValue />
                </UiSelectTrigger>
              </UiFormControl>

              <UiSelectContent>
                <UiSelectItem
                  v-for="strategy in strategies"
                  :key="strategy.id"
                  :value="strategy.id"
                >
                  {{ strategy.name }}
                </UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="description"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("labels.fields.description") }}</UiFormLabel>
            <UiFormControl v-bind="componentField">
              <MarkdownEditor :show-menu-bar="false" />
            </UiFormControl>
            <UiFormDescription>
              <i18n-t keypath="dialogs.create-action.markdown-handled">
                <template #link>
                  <NuxtLink
                    to="https://docs.framasoft.org/fr/grav/markdown.html"
                    target="_blank"
                    class="underline-offset-4 hover:underline"
                  >
                    {{ $t("btn.know-more") }}
                  </NuxtLink>
                </template>
              </i18n-t>
            </UiFormDescription>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ value }"
          name="deadline"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("labels.fields.deadline") }}</UiFormLabel>
            <UiPopover>
              <UiPopoverTrigger as-child>
                <UiButton
                  variant="outline"
                  class="justify-start"
                >
                  {{ formatDate("medium")(value) }}
                </UiButton>
              </UiPopoverTrigger>
              <UiPopoverContent class="w-min p-2">
                <UiFormControl>
                  <UiCalendar
                    v-model="deadline"
                    :locale
                    layout="month-and-year"
                    disable-days-outside-current-view
                    :min-value="today(getLocalTimeZone())"
                  />
                </UiFormControl>
              </UiPopoverContent>
            </UiPopover>
          </UiFormItem>
        </UiFormField>
        <!-- <div
          :key="`form-iteration-${iteration}`"
          class="space-y-2"
        >
          <div class="flex items-center justify-between">
            <UiLabel>
              {{ $t("labels.fields.tasks") }}
            </UiLabel>

            <UiButton
              type="button"
              variant="ghost"
              size="icon-xs"
              @click="addTask"
            >
              <Plus />
            </UiButton>
          </div>

          <div class="space-y-2">
            <div
              v-for="(task, index) in tasks.fields.value"
              :key="`task#${task.key}`"
              class="flex items-center gap-2"
            >
              <UiFormField
                v-slot="{ componentField }"
                :name="`tasks[${index}].checked`"
              >
                <UiFormItem>
                  <UiFormControl>
                    <UiCheckbox
                      class="size-5"
                      :checked="componentField.modelValue"
                      @update:checked="componentField['onUpdate:modelValue']"
                    />
                  </UiFormControl>
                </UiFormItem>
              </UiFormField>
              <UiFormField
                v-slot="{ componentField }"
                :name="`tasks[${index}].label`"
              >
                <UiFormItem class="w-full">
                  <UiFormControl>
                    <UiInput
                      v-bind="componentField"
                      :id="`task-input-${task.key}`"
                      class="border-none shadow-none px-1"
                      :placeholder="$t('labels.placeholder.task')"
                      @keydown="handleTaskKeydown(task.key, $event)"
                    />
                  </UiFormControl>
                </UiFormItem>
              </UiFormField>
            </div>
          </div>
        </div> -->
        <UiFormField name="tasks">
          <UiFormItem class="space-y-2">
            <div class="flex items-center justify-between">
              <UiLabel>{{ $t("labels.fields.tasks") }}</UiLabel>
              <UiButton
                size="icon-xs"
                variant="ghost"
                @click="addTask"
              >
                <Plus />
              </UiButton>
            </div>
            <div
              v-for="task in tasks"
              :key="task.id"
              class="flex items-center gap-2"
            >
              <UiCheckbox
                v-model="task.checked"
                class="size-5"
              />
              <UiInput
                :id="`task-input-${task.id}`"
                v-model="task.label"
                class="border-none shadow-none px-1 bg-background!"
                :placeholder="$t('labels.placeholder.task')"
                @keydown="handleTaskKeydown(task.id, $event)"
              />
            </div>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiDialogFooter class="py-4 sticky bottom-0 bg-background">
          <UiDialogClose as-child>
            <UiButton
              type="button"
              variant="secondary"
            >
              {{ $t("btn.cancel") }}
            </UiButton>
          </UiDialogClose>
          <UiButton type="submit">
            {{ $t("btn.create.action") }}
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
