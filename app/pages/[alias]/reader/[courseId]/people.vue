<script setup lang="ts">
import { Plus, Search, UserPlus, RefreshCw, X } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import PeopleProfileDialog from "~/components/course/people/PeopleProfileDialog.vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const { t } = useI18n();

const id = computed(() => useRoute().params.courseId as string);
const brand = useBrand();

const { user } = storeToRefs(useUserStore());
const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);

const search = ref<string>("");

const coaches = computed(() => course.value!.coaches.filter(entry =>
  entry.name.full.toLowerCase().includes(search.value.toLowerCase())
  || entry.contact.email.toLowerCase().includes(search.value.toLowerCase())));
const facilitators = computed(() => course.value!.facilitators.filter(entry =>
  entry.name.full.toLowerCase().includes(search.value.toLowerCase())
  || entry.contact.email.toLowerCase().includes(search.value.toLowerCase())));
const participants = computed(() => course.value!.participants.filter(entry =>
  entry.name.full.toLowerCase().includes(search.value.toLowerCase())
  || entry.contact.email.toLowerCase().includes(search.value.toLowerCase())));

const popoverOpen = ref<boolean>(false);
watch(popoverOpen, () => form.resetForm());
const form = useForm({
  validationSchema: toTypedSchema(z.object({
    email: z.string({ message: t("labels.form-errors.email.required") })
      .email({ message: t("labels.form-errors.email.invalid") })
      .refine(val => val.trim().toLowerCase() !== user.value!.contact.email.toLowerCase(), t("labels.form-errors.email.other-than-yours")),
    results: z.boolean().optional().default(false),
  })),
});
const submit = form.handleSubmit(async values =>
  popoverOpen.value = !(await store.inviteManager(values.email, values.results)));

store.loadPeople();
</script>

<template>
  <PageRoot
    :name="`courses.specimen.${id}.peoples`"
    class="w-full"
    wrapper
    wrapper-class="grid gap-4 max-w-7xl w-full mx-auto"
  >
    <h1 class="text-3xl font-extrabold">
      {{ $t("courses.specimen.people.page-title") }}
    </h1>

    <header class="flex flex-col @md:flex-row @md:items-center gap-2">
      <div class="relative flex-1">
        <Search class="absolute top-2.5 left-2.5 size-4 text-muted-foreground pointer-events-none" />
        <UiInput
          :model-value="search"
          class="px-9"
          :placeholder="$t('labels.placeholder.search')"
          @update:model-value="search = ($event as string).trim().toLowerCase()"
        />
        <UiButton
          v-if="search.trim().length"
          variant="ghost"
          size="icon-sm"
          class="rounded-full absolute top-0.5 right-0.5"
          @click="search = ''"
        >
          <X />
        </UiButton>
      </div>
    </header>

    <div class="grid items-start grid-cols-1 @lg:grid-cols-2 @xl:grid-cols-3 gap-4">
      <div class="grid gap-4 @lg:col-start-2 @xl:col-start-3">
        <UiCard class="gap-3 pb-3">
          <UiCardHeader class="flex items-center justify-between gap-4">
            <UiCardTitle>
              {{ $t("courses.specimen.people.your-manager") }}
            </UiCardTitle>

            <UiPopover v-model:open="popoverOpen">
              <UiPopoverTrigger as-child>
                <UiButton>
                  <template v-if="course!.manager">
                    <RefreshCw />
                    {{ $t("courses.specimen.people.manager.change") }}
                  </template>
                  <template v-else>
                    <UserPlus />
                    {{ $t("courses.specimen.people.manager.invite") }}
                  </template>
                </UiButton>
              </UiPopoverTrigger>
              <UiPopoverContent align="end">
                <form
                  class="flex flex-col gap-4"
                  @submit="submit"
                >
                  <p class="text-sm text-muted-foreground">
                    {{ $t("courses.specimen.people.manager.captions.authorize", { brand: brand.name }) }}
                  </p>
                  <UiFormField
                    v-slot="{ componentField }"
                    name="email"
                  >
                    <UiFormItem>
                      <UiFormLabel>
                        {{ $t("courses.specimen.people.manager.fields.email") }}
                      </UiFormLabel>
                      <UiFormControl v-bind="componentField">
                        <UiInput
                          type="email"
                          :placeholder="$t('labels.placeholder.generic.email').replace('.at.', '@')"
                          :disabled="loading.specific.inviteManager"
                        />
                      </UiFormControl>
                      <UiFormMessage />
                    </UiFormItem>
                  </UiFormField>

                  <UiSeparator />

                  <p class="text-sm text-muted-foreground">
                    {{ $t("courses.specimen.people.manager.captions.more-results") }}
                  </p>
                  <UiFormField
                    v-slot="{ componentField }"
                    name="results"
                  >
                    <UiFormItem class="flex items-center gap-4">
                      <UiFormLabel class="grid gap-0.5">
                        <p>{{ $t("courses.specimen.people.manager.fields.results.title") }}</p>
                        <span class="text-xs text-muted-foreground">{{ $t("courses.specimen.people.manager.fields.results.caption", { brand: brand.name }) }}</span>
                      </UiFormLabel>

                      <UiFormControl>
                        <UiCheckbox
                          :model-value="componentField.modelValue"
                          :disabled="loading.specific.inviteManager"
                          @update:model-value="componentField['onUpdate:modelValue']"
                        />
                      </UiFormControl>
                    </UiFormItem>
                  </UiFormField>

                  <UiButton
                    type="submit"
                    :disabled="loading.specific.inviteManager"
                  >
                    <UiSpinner v-if="loading.specific.inviteManager" />
                    <Plus v-else />
                    {{ $t("btn.invite") }}
                  </UiButton>
                </form>
              </UiPopoverContent>
            </UiPopover>
          </UiCardHeader>
          <UiCardContent
            v-if="course!.manager"
            class="grid gap-1 px-3"
          >
            <PeopleProfileDialog
              :people="course!.manager"
              manager
            />
          </UiCardContent>
        </UiCard>
        <UiCard
          v-if="coaches.length"
          class="gap-3 pb-3"
        >
          <UiCardHeader>
            <UiCardTitle>
              {{ $t("courses.specimen.people.coaches") }}
            </UiCardTitle>
          </UiCardHeader>
          <UiCardContent class="grid gap-1 px-3">
            <PeopleProfileDialog
              v-for="people in coaches"
              :key="`coach#${people.id}`"
              :people="people"
              class="-mx-3"
            />
          </UiCardContent>
        </UiCard>
        <UiCard
          v-if="facilitators.length"
          class="gap-3 pb-3"
        >
          <UiCardHeader>
            <UiCardTitle>
              {{ $t("courses.specimen.people.facilitators") }}
            </UiCardTitle>
          </UiCardHeader>
          <UiCardContent class="grid gap-1 px-3">
            <PeopleProfileDialog
              v-for="people in facilitators"
              :key="`facilitator#${people.id}`"
              :people="people"
              class="-mx-3"
            />
          </UiCardContent>
        </UiCard>
      </div>

      <UiCard
        v-if="participants.length"
        class="@lg:row-start-1 @xl:col-span-2 gap-3 pb-3"
      >
        <UiCardHeader>
          <UiCardTitle>
            {{ $t("courses.specimen.people.participants") }}
          </UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="grid gap-1">
          <PeopleProfileDialog
            v-for="people in participants"
            :key="`participant#${people.id}`"
            :people="people"
            class="-mx-3"
          />
        </UiCardContent>
      </UiCard>
    </div>

    <div
      v-if="loading.specific.people"
      class="h-16 grid place-items-center w-full"
    >
      <UiSpinner />
    </div>
  </PageRoot>
</template>
