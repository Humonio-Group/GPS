<script setup lang="ts">
import { Send, Mail } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { Course } from "~/types/entities/course";

const open = defineModel<boolean>("open", { required: true });
watch(open, (val) => {
  if (!val) return;
  form.resetForm({
    values: {
      course: courses.value?.[0]!.id,
      category: categories.value?.[0]!.id,
    },
  });
});

const coursesStore = useCoursesStore();
const store = useTicketStore();
const { courses: _courses, loading: courseLoader } = storeToRefs(coursesStore);
const { categories, loading: ticketLoader } = storeToRefs(store);

const { public: config } = useRuntimeConfig();
const { contacts } = config;

const courses = computed(() => {
  if (!_courses.value) return [];

  const ids: number[] = [];
  const c: Course[] = [];
  _courses.value!.forEach((course) => {
    if (ids.includes(course.program.id)) return;
    ids.push(course.program.id);
    c.push(course);
  });

  return c;
});
const { truncate } = useStringUtils();

coursesStore.loadCourses();
store.loadCategories();

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    course: z.number().int().gt(0),
    category: z.number().int().gt(0),
    subject: z.string().transform(val => val.trim()),
    message: z.string().transform(val => val.trim()),
  })),
});
const selectedCategory = computed(() => categories.value?.find(c => c.id === form.values.category));
const submit = form.handleSubmit(async (values) => {
  open.value = !(await store.createTicket(values.course, values.category, values.subject, values.message));
});
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogContent class="@container/dialog-content">
      <UiDialogHeader>
        <UiDialogTitle>{{ $t("support.create-dialog.title") }}</UiDialogTitle>
        <UiDialogDescription>{{ $t("support.create-dialog.description") }}</UiDialogDescription>
      </UiDialogHeader>

      <form
        class="grid gap-4"
        @submit.prevent.stop="submit"
      >
        <UiFormField
          v-slot="{ componentField }"
          name="course"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("support.create-dialog.fields.course") }} <UiSpinner v-if="courseLoader.coursesList" /></UiFormLabel>
            <UiSelect
              :model-value="componentField.modelValue"
              :disabled="courseLoader.coursesList || ticketLoader.create"
              @update:model-value="componentField['onUpdate:modelValue']"
            >
              <UiFormControl>
                <UiSelectTrigger class="w-full overflow-hidden">
                  <span class="flex-1 truncate">
                    <UiSelectValue />
                  </span>
                </UiSelectTrigger>
              </UiFormControl>
              <UiSelectContent class="w-full">
                <UiSelectItem
                  v-for="course in courses"
                  :key="`course#${course.id}`"
                  :value="course.id"
                >
                  {{ truncate(course.name, 55) }}
                </UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="category"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("support.create-dialog.fields.category.label") }} <UiSpinner v-if="ticketLoader.categories" /></UiFormLabel>
            <UiSelect
              :model-value="componentField.modelValue"
              :disabled="ticketLoader.categories || ticketLoader.create"
              @update:model-value="componentField['onUpdate:modelValue']"
            >
              <UiFormControl>
                <UiSelectTrigger class="w-full truncate">
                  <UiSelectValue />
                </UiSelectTrigger>
                <UiSelectContent class="w-full">
                  <UiSelectItem
                    v-for="category in categories"
                    :key="`category#${category.id}`"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiFormControl>
            </UiSelect>
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="subject"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("support.create-dialog.fields.subject") }}</UiFormLabel>
            <UiFormControl v-bind="componentField">
              <UiInput
                :placeholder="$t('support.create-dialog.placeholders.subject')"
                :disabled="ticketLoader.create"
              />
            </UiFormControl>
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="message"
        >
          <UiFormItem>
            <UiFormLabel>{{ $t("support.create-dialog.fields.message") }}</UiFormLabel>
            <UiFormControl v-bind="componentField">
              <UiTextarea
                :placeholder="selectedCategory?.description ?? ''"
                class="h-24 resize-none"
                :disabled="ticketLoader.create"
              />
            </UiFormControl>
          </UiFormItem>
        </UiFormField>

        <UiDialogFooter>
          <UiDialogClose as-child>
            <UiButton
              variant="secondary"
              type="button"
            >
              {{ $t("btn.cancel") }}
            </UiButton>
          </UiDialogClose>
          <UiButton :disabled="ticketLoader.create">
            {{ $t("btn.send") }}
            <UiSpinner v-if="ticketLoader.create" />
            <Send v-else />
          </UiButton>
        </UiDialogFooter>
      </form>

      <UiSeparator />

      <ul class="grid *:py-2 divide-y">
        <li class="flex flex-col @md/dialog-content:flex-row @md/dialog-content:items-start @md/dialog-content:justify-between @md/dialog-content:gap-4">
          <p class="text-muted-foreground max-w-1/2">
            {{ $t("support.create-dialog.contacts.dto") }}
          </p>
          <UiButton
            variant="link"
            as-child
          >
            <NuxtLink :to="`mailto:${contacts.email}?subject=${$t('support.create-dialog.contacts.dto-related-question')}`">
              {{ contacts.dto }}
              <Mail />
            </NuxtLink>
          </UiButton>
        </li>
        <li class="flex flex-col @md/dialog-content:flex-row @md/dialog-content:items-start @md/dialog-content:justify-between @md/dialog-content:gap-4">
          <p class="text-muted-foreground max-w-1/2">
            {{ $t("support.create-dialog.contacts.dpo") }}
          </p>
          <UiButton
            variant="link"
            as-child
          >
            <NuxtLink :to="`mailto:${contacts.email}?subject=${$t('support.create-dialog.contacts.dpo-related-question')}`">
              {{ contacts.dpo }}
              <Mail />
            </NuxtLink>
          </UiButton>
        </li>
      </ul>
    </UiDialogContent>
  </UiDialog>
</template>
