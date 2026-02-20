<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { Conversation } from "~/types/entities/conversation";

interface RenameDialogProps {
  conversation: Conversation;
}

const props = defineProps<RenameDialogProps>();

const open = defineModel<boolean>("open", { default: false });
const loading = ref<boolean>(false);
watch(open, (val) => {
  if (!val) return;
  form.resetForm({
    values: {
      title: props.conversation.title,
    },
  });
});

const store = useCompanionStore();

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    title: z.string().max(255),
  })),
  initialValues: {
    title: props.conversation.title,
  },
});
const submit = form.handleSubmit(async (values) => {
  loading.value = true;
  await store.rename(props.conversation.id, values.title);
  loading.value = false;
  open.value = false;
});
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>{{ $t("companion.dialogs.rename.title") }}</UiDialogTitle>
        <UiDialogDescription>{{ $t("companion.dialogs.rename.description") }}</UiDialogDescription>
      </UiDialogHeader>

      <form
        class="grid gap-4"
        @submit="submit"
      >
        <UiFormField
          v-slot="{ componentField }"
          name="title"
        >
          <UiFormItem>
            <UiFormLabel />
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                :disabled="loading"
              />
            </UiFormControl>
          </UiFormItem>
        </UiFormField>

        <UiDialogFooter>
          <UiDialogClose as-child>
            <UiButton
              type="button"
              variant="secondary"
              :disabled="loading"
            >
              {{ $t("btn.cancel") }}
            </UiButton>
          </UiDialogClose>
          <UiButton
            type="submit"
            :disabled="loading"
          >
            {{ $t("btn.save") }}
            <UiSpinner v-if="loading" />
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
