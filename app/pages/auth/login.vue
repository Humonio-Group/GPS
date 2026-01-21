<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

definePageMeta({
  layout: "authentication",
});

const store = useUserStore();
const { loading } = storeToRefs(store);

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    login: z.string().email(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
  })),
});
const submit = form.handleSubmit(async (values) => {
  await store.login(values);
});
</script>

<template>
  <PageRoot
    name="auth.login"
    class="flex flex-col gap-2 max-w-lg w-full"
  >
    <UiButton
      variant="ghost"
      size="sm"
      class="self-start"
      as-child
    >
      <NuxtLink
        to="https://humonio.com"
        external
      >
        <ArrowLeft />
        {{ $t("btn.back") }}
      </NuxtLink>
    </UiButton>

    <form @submit="submit">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>
            {{ $t("auth.login-title") }}
          </UiCardTitle>
        </UiCardHeader>

        <UiCardContent class="grid gap-4">
          <UiFormField
            v-slot="{ componentField }"
            name="login"
          >
            <UiFormItem>
              <UiFormLabel>{{ $t("auth.fields.email") }}</UiFormLabel>
              <UiFormControl v-bind="componentField">
                <UiInput
                  type="email"
                  placeholder="Ex. john.doe@example.xyz"
                  :disabled="loading.loggingIn"
                />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>
          <UiFormField
            v-slot="{ componentField }"
            name="password"
          >
            <UiFormItem>
              <UiFormLabel>{{ $t("auth.fields.password") }}</UiFormLabel>
              <UiFormControl v-bind="componentField">
                <UiInput
                  type="password"
                  placeholder="··········"
                  :disabled="loading.loggingIn"
                />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>
        </UiCardContent>

        <UiCardFooter class="flex-col md:flex-row gap-2 md:gap-4 md:justify-between">
          <UiFormField
            v-slot="{ componentField }"
            name="rememberMe"
          >
            <UiFormItem class="w-full sm:w-auto flex items-center gap-3">
              <UiFormLabel class="flex-1">
                {{ $t("auth.fields.remember-me") }}
              </UiFormLabel>
              <UiFormControl>
                <UiSwitch
                  :disabled="loading.loggingIn"
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField['onUpdate:modelValue']"
                />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>

          <UiButton
            type="submit"
            class="w-full sm:w-auto"
            :disabled="loading.loggingIn"
          >
            {{ $t("auth.action") }}
            <UiSpinner v-if="loading.loggingIn" />
          </UiButton>
        </UiCardFooter>
      </UiCard>
    </form>
  </PageRoot>
</template>
