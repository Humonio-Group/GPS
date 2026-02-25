<script setup lang="ts">
import { MarkdownEditor } from "~/components/ui/markdown-editor";
import { Plus } from "lucide-vue-next";
import { v4 as uuid } from "uuid";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { today, getLocalTimeZone, type DateValue, fromDate } from "@internationalized/date";
import z from "zod";
import type { Strategy } from "~/types/entities/strategy";
import type { Nullable } from "~/types/primitives/objects";

interface CreateActionFromTemplateDialog {
  trigger?: boolean;
}

const { t, locale } = useI18n();

defineProps<CreateActionFromTemplateDialog>();

const api = useApi();
const logger = useLogger();
const { formatDate } = useDateUtils();

const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);

const loadingStrategies = ref<boolean>(false);
const open = defineModel<boolean>("open", { default: false });
watch(open, async (val) => {
  if (!val) return;
  await loadAction();
}, { immediate: true });

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
    visibility: z.enum(["public", "private"]).default("public"),
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
const { tasks, add: addTask, keyDown: handleTaskKeydown } = useTasks(val => form.setFieldValue("tasks", val.map(t => ({ label: t.label, checked: t.checked }))));

const deadline = computed({
  get: () => fromDate(form.values.deadline ?? new Date(), getLocalTimeZone()),
  set: (value: DateValue) => form.setFieldValue("deadline", value.toDate(getLocalTimeZone())),
});

const action = ref<any>();
const templates = ref<any[]>([]);
const selectedTemplateId = ref<Nullable<number>>(null);
const selectedTemplate = computed<Nullable<any>>(() => templates.value.find((t: any) => t.id === selectedTemplateId.value) || null);
watch(selectedTemplate, (val) => {
  if (!val) {
    form.resetForm({
      values: {
        objective: strategies.value[0]!.id,
        deadline: new Date(),
      },
    });
    tasks.value = [
      { id: uuid(), checked: false, label: "" },
    ];
    return;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Number(val.initial.deadline || 0));

  form.resetForm({
    values: {
      objective: val.initial.strategy,
      description: val.initial.description,
      deadline: dueDate,
      tasks: [],
    },
  });
  tasks.value = val.initial.tasks.map((t: any) => ({
    id: uuid(),
    ...t,
  }));
});
const strategies = ref<Strategy[]>([]);

const submit = form.handleSubmit(async (values) => {
  open.value = !(await store.createAction(selectedTemplate.value?.reference ?? action.value.actionPlan.id, values));
});

async function loadAction() {
  loadingStrategies.value = true;

  try {
    const response = await api.get(`/journeys/${course.value!.id}/action-creation-config`, { version: 2, endpointVersion: 3, vanilla: true });
    const { defaultActionPlan, strategies: _strategies, templates: _templates } = response.data;
    logger.log(_templates);

    action.value = defaultActionPlan;
    templates.value = _templates.map((t: any) => {
      const fields = t.embedContent.fields;

      return {
        id: t.id,
        reference: t.actionPlanId,
        name: t.displayName,
        readonly: {
          strategy: fields.isStrategiesReadonly,
          description: fields.isDescriptionReadonly,
          deadline: fields.isDueDateReadonly,
          tasks: fields.isTasklistReadonly,
        },
        initial: {
          strategy: fields.preFilledStrategies[0],
          description: fields.preFilledDescription,
          deadline: fields.preFilledDueDate,
          tasks: fields.preFilledTasklist.map((task: any) => ({ checked: false, label: task.name })),
        },
      };
    });
    strategies.value = _strategies.map((s: any) => ({
      id: s.id,
      name: s.name,
      description: s.description,
    }));

    form.resetForm({
      values: {
        objective: strategies.value[0]!.id,
      },
    });
    tasks.value = [
      { id: uuid(), checked: false, label: "" },
    ];
  }
  catch (e) {
    logger.error(e);
  }
  finally {
    loadingStrategies.value = false;
  }
}
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogTrigger
      v-if="trigger"
      as-child
    >
      <slot />
    </UiDialogTrigger>

    <UiDialogContent class="@container max-w-3xl! w-[calc(100%-2rem)] max-h-[calc(85dvh-2rem)] overflow-y-auto pb-0">
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
        <div
          v-if="templates.length"
          class="space-y-2"
        >
          <UiLabel for="template">
            Modèle
          </UiLabel>
          <UiSelect
            id="template"
            v-model="selectedTemplateId"
          >
            <UiSelectTrigger class="w-full">
              <UiSelectValue />
            </UiSelectTrigger>

            <UiSelectContent>
              <UiSelectItem :value="null">
                Aucun modèle
              </UiSelectItem>
              <UiSelectItem
                v-for="template in templates"
                :key="template.id"
                :value="template.id"
              >
                {{ template.name }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>

        <UiFormField
          v-slot="{ componentField }"
          name="objective"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("labels.fields.objective") }}</UiFormLabel>
            <UiSelect
              v-bind="componentField"
              :disabled="selectedTemplate && selectedTemplate.readonly.strategy"
            >
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
              <MarkdownEditor
                :show-menu-bar="false"
                :editable="!selectedTemplate || !selectedTemplate.readonly.description "
              />
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
                  :disabled="selectedTemplate && selectedTemplate.readonly.deadline"
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
        <UiFormField name="tasks">
          <UiFormItem class="space-y-2">
            <div class="flex items-center justify-between">
              <UiLabel>{{ $t("labels.fields.tasks") }}</UiLabel>
              <UiButton
                v-if="!selectedTemplate || !selectedTemplate.readonly.tasks"
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
                :disabled="selectedTemplate && selectedTemplate.readonly.tasks"
                class="border-none shadow-none px-1 bg-background!"
                :placeholder="$t('labels.placeholder.task')"
                @keydown="handleTaskKeydown(task.id, $event)"
              />
            </div>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="visibility"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("labels.fields.visibility") }}</UiFormLabel>
            <UiFormControl>
              <UiRadioGroup
                :model-value="componentField.modelValue"
                @update:model-value="componentField['onUpdate:modelValue']"
              >
                <div class="grid grid-cols-1 @md:grid-cols-2 gap-2">
                  <UiLabel
                    for="visibility-public"
                    class="cursor-pointer flex items-center gap-2 p-4 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground"
                  >
                    <UiRadioGroupItem
                      id="visibility-public"
                      value="public"
                    />

                    {{ $t("labels.visibility.public", 2) }}
                  </UiLabel>
                  <UiLabel
                    for="visibility-private"
                    class="cursor-pointer flex items-center gap-2 p-4 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground"
                  >
                    <UiRadioGroupItem
                      id="visibility-private"
                      value="private"
                    />

                    {{ $t("labels.visibility.private", 2) }}
                  </UiLabel>
                </div>
              </UiRadioGroup>
            </UiFormControl>
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
          <UiButton
            type="submit"
            :disabled="loading.specific.creatingAction"
          >
            {{ $t("btn.create.action") }}
            <UiSpinner v-if="loading.specific.creatingAction" />
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
