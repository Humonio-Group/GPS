<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import { toast } from "vue-sonner";
import type { Terms } from "~/types/entities/terms";
import type { Nullable } from "~/types/primitives/objects";
import type { User } from "~/types/entities/user";
import { EntityType } from "~/types/entities/entities";
import { buildUserEntity } from "~/lib/user";
import { type AvailableLocale, fromId } from "~/types/misc/language";
import { buildTermEntity } from "~/lib/terms";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Check, X, Eye, EyeOff } from "lucide-vue-next";
import TermDialog from "~/components/settings/terms/TermDialog.vue";
import ImageCropDialog from "~/components/primitives/ImageCropDialog.vue";

const { t, setLocale } = useI18n();

definePageMeta({
  layout: "authentication",
});

useHead({
  title: t(""),
});

const route = useRoute();
const { token, lang } = route.query;

const api = useApi();
const logger = useLogger();

const avatar = ref<Nullable<Blob>>(null);
const avatarUrl = ref<Nullable<string>>(null);
watch(avatar, (newVal) => {
  if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value);
  if (newVal) avatarUrl.value = URL.createObjectURL(newVal);
});

const user = ref<Nullable<User>>(null);
const terms = ref<Terms>([]);
const acceptedTerms = ref<number[]>([]);
const loading = ref<boolean>(false);

const showPassword = ref<boolean>(false);

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.object({
      value: z.string()
        .min(8)
        .max(150)
        .regex(/[0-9]/)
        .regex(/[a-z]/)
        .regex(/[A-Z]/)
        .regex(/[^a-zA-Z0-9]/),
      confirm: z.string(),
    }).refine(data => data.value === data.confirm, {
      path: ["confirm"],
    }),
  })),
});

onMounted(async () => {
  const locale = fromId(Number(lang));
  if (locale) await setLocale(locale as AvailableLocale);

  try {
    const response = await api.get(`/password_requests/${token}`, { version: 2, endpointVersion: 1 }, {
      query: {
        lang,
        include: "user,terms,lang",
      },
    });

    const _terms = response.included.filter((e: any) => e.type === EntityType.TERM);
    const _user = response.included.find((e: any) => e.type === EntityType.USER);

    user.value = buildUserEntity(_user, undefined);
    terms.value = _terms.map(buildTermEntity);

    form.resetForm({
      values: {
        firstName: user.value!.name.first,
        lastName: user.value!.name.last,
        email: user.value!.contact.email,
      },
    });
  }
  catch (e: any) {
    logger.error(e);
    toast.error(t("toasts.error.default", { code: e.statusCode }));
  }
});

const submit = form.handleSubmit(async (values) => {
  logger.log(values);
  loading.value = true;

  try {
    let filename: Nullable<string> = null;

    if (avatar.value) {
      const fileReponse = await useFileUpload(user.value!.key).upload(avatar.value, 4);
      filename = fileReponse.data.attributes.file.filename;
    }

    await api.put(`/password_requests/${token}`, { version: 2, endpointVersion: 1 }, {
      body: {
        meta: {
          termsAccepted: true,
          profilePicture: filename,
        },
        data: {
          type: EntityType.PASSWORD_REQUEST,
          attributes: {
            password: values.password.value,
          },
        },
        lang: Number(lang),
      },
    });
    navigateTo(useLocalePath()("/auth/portal"));
  }
  catch (e: any) {
    logger.error(e);
    toast.error(t("toasts.error.default", { code: e.statusCode }));
  }
  finally {
    loading.value = false;
  }
});
const avatarCrop = useImageCrop("avatarCropInput", (blob) => {
  avatar.value = blob;
});

function handleTermCheck(id: number) {
  if (acceptedTerms.value.includes(id)) acceptedTerms.value.splice(acceptedTerms.value.indexOf(id), 1);
  else acceptedTerms.value.push(id);
}
function selectAll() {
  acceptedTerms.value = terms.value.reduce((acc, cur) => {
    acc = [...acc, cur.id];
    return acc;
  }, [] as number[]);
}
function deselectAll() {
  acceptedTerms.value = [];
}
function handleAllCheck() {
  if (acceptedTerms.value.length === terms.value.length) deselectAll();
  else selectAll();
}

function openAvatarDialog() {
  avatarCrop.inputRef.value?.click();
}

const formValid = computed(() => form.meta.value.valid);

const passwordValue = computed(() => form.values.password?.value ?? "");
const passwordRules = computed(() => [
  { key: "min", valid: passwordValue.value.length >= 8 },
  { key: "max", valid: passwordValue.value.length <= 150 },
  { key: "digit", valid: /[0-9]/.test(passwordValue.value) },
  { key: "lowercase", valid: /[a-z]/.test(passwordValue.value) },
  { key: "uppercase", valid: /[A-Z]/.test(passwordValue.value) },
  { key: "special", valid: /[^a-zA-Z0-9]/.test(passwordValue.value) },
  { key: "match", valid: !!passwordValue.value && passwordValue.value === (form.values.password?.confirm ?? "") },
]);
</script>

<template>
  <PageRoot
    name="welcome"
    class="w-full py-6"
    wrapper
    wrapper-class="w-full max-w-3xl mx-auto"
  >
    <form
      v-if="user"
      class="w-full"
      @submit="submit"
    >
      <UiCard class="w-full">
        <UiCardHeader>
          <UiCardTitle>{{ $t("welcome.title") }}</UiCardTitle>
          <UiCardDescription>{{ $t("welcome.description") }}</UiCardDescription>
        </UiCardHeader>

        <UiCardContent class="grid grid-cols-1 @md:grid-cols-2 gap-4">
          <div class="space-y-2 @md:col-span-2">
            <UiLabel
              for="avatarCropInput"
            >
              {{ $t("labels.fields.avatar") }}
            </UiLabel>

            <div class="flex flex-col items-center justify-center gap-2">
              <UiAvatar class="size-48 rounded-2xl">
                <UiAvatarImage
                  v-if="avatarUrl"
                  :src="avatarUrl"
                />
                <UiAvatarFallback>{{ user?.name.first[0] }}{{ user?.name.last[0] }}</UiAvatarFallback>
              </UiAvatar>

              <input
                id="avatarCropInput"
                ref="avatarCropInput"
                type="file"
                accept="image/*"
                class="hidden"
                :disabled="loading"
                @change="avatarCrop.onFileChange"
              >
              <UiButton
                type="button"
                variant="outline"
                :disabled="loading"
                @click="openAvatarDialog"
              >
                {{ $t("btn.change") }}
              </UiButton>
              <ImageCropDialog
                v-if="avatarCrop.src.value"
                v-model:open="avatarCrop.open.value"
                :src="avatarCrop.src.value"
                :mime-type="avatarCrop.mimeType.value"
                @crop="avatarCrop.onConfirm"
                @update:open="avatarCrop.onOpenChange"
              />
            </div>
          </div>

          <UiFormField
            v-slot="{ componentField }"
            name="firstName"
          >
            <UiFormItem>
              <UiFormLabel>{{ $t("labels.fields.first-name") }}</UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  disabled
                />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>
          <UiFormField
            v-slot="{ componentField }"
            name="lastName"
          >
            <UiFormItem>
              <UiFormLabel>{{ $t("labels.fields.last-name") }}</UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  disabled
                />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>

          <UiFormField
            v-slot="{ componentField }"
            name="email"
          >
            <UiFormItem class="@md:col-span-2">
              <UiFormLabel>{{ $t("labels.fields.email") }}</UiFormLabel>
              <UiFormControl>
                <UiInput
                  type="email"
                  v-bind="componentField"
                  disabled
                />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>

          <UiFormField name="password">
            <UiFormField
              v-slot="{ componentField }"
              name="password.value"
            >
              <UiFormItem class="@md:col-span-2">
                <UiFormLabel>{{ $t("labels.fields.password") }}</UiFormLabel>
                <UiFormControl>
                  <div class="relative group">
                    <UiInput
                      :type="showPassword ? 'text' : 'password'"
                      v-bind="componentField"
                      :disabled="loading"
                    />
                    <UiButton
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      tabindex="-1"
                      class="absolute top-1 right-1 text-muted-foreground! opacity-0 group-hover:opacity-100"
                      @click="showPassword = !showPassword"
                    >
                      <EyeOff v-if="showPassword" />
                      <Eye v-else />
                    </UiButton>
                  </div>
                </UiFormControl>
              </UiFormItem>
            </UiFormField>
            <UiFormField
              v-slot="{ componentField }"
              name="password.confirm"
            >
              <UiFormItem class="@md:col-span-2">
                <UiFormLabel>{{ $t("labels.fields.password-confirm") }}</UiFormLabel>
                <UiFormControl>
                  <div class="relative group">
                    <UiInput
                      :type="showPassword ? 'text' : 'password'"
                      v-bind="componentField"
                      :disabled="loading"
                    />
                    <UiButton
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      tabindex="-1"
                      class="absolute top-1 right-1 text-muted-foreground! opacity-0 group-hover:opacity-100"
                      @click="showPassword = !showPassword"
                    >
                      <EyeOff v-if="showPassword" />
                      <Eye v-else />
                    </UiButton>
                  </div>
                </UiFormControl>
              </UiFormItem>
            </UiFormField>

            <ul class="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-1 @md:col-span-2 px-1">
              <li
                v-for="rule in passwordRules"
                :key="rule.key"
                class="flex items-center gap-1.5 text-xs transition-colors"
                :class="rule.valid ? 'text-green-600' : 'text-muted-foreground'"
              >
                <Check
                  v-if="rule.valid"
                  class="size-3.5 shrink-0"
                />
                <X
                  v-else
                  class="size-3.5 shrink-0"
                />
                {{ $t(`welcome.password-rules.${rule.key}`) }}
              </li>
            </ul>
          </UiFormField>

          <UiSeparator class="@md:col-span-2" />

          <div class="@md:col-span-2">
            <p class="font-medium text-sm">
              {{ $t("welcome.conditions") }}
            </p>
            <div
              v-for="term in terms"
              :key="`term-${term.id}`"
              class="flex items-center gap-6 p-2 pl-3 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors duration-75"
            >
              <UiLabel class="flex-1 cursor-pointer">
                <UiCheckbox
                  class="size-5"
                  :model-value="acceptedTerms.includes(term.id)"
                  :disabled="loading"
                  @update:model-value="handleTermCheck(term.id)"
                />

                {{ term.name }}
              </UiLabel>

              <TermDialog
                :term="term"
                trigger
              >
                <UiButton
                  size="sm"
                  variant="outline"
                >
                  {{ $t("btn.read") }}
                </UiButton>
              </TermDialog>
            </div>

            <UiSeparator class="my-2" />

            <UiLabel class="p-3 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors duration-75">
              <UiCheckbox
                :model-value="acceptedTerms.length === terms.length"
                class="size-5"
                :disabled="loading"
                @update:model-value="handleAllCheck"
              />

              {{ $t("welcome.all-terms") }}
            </UiLabel>
          </div>
        </UiCardContent>

        <UiCardFooter class="justify-end">
          <UiButton
            type="submit"
            :disabled="acceptedTerms.length !== terms.length || loading || !formValid"
          >
            {{ $t("btn.save") }}
            <UiSpinner v-if="loading" />
          </UiButton>
        </UiCardFooter>
      </UiCard>
    </form>
  </PageRoot>
</template>
