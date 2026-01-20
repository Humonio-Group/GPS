<script setup lang="ts">
import { Send, Mic } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import IaGif from "~/assets/images/ia.gif";

const { t } = useI18n();

const { company } = storeToRefs(useCompanyStore());
const { user } = storeToRefs(useUserStore());

const model = ref<string>("gpt-4o-mini");
const message = ref<string>("");
const index = computed(() => Math.floor(Math.random() * 3));

useHead({
  title: `${t("home.title")} - ${company.value!.name}`,
});
</script>

<template>
  <PageRoot class="w-full max-w-7xl mx-auto flex-1 py-2 grid place-items-center">
    <div class="w-full md:w-3/5 flex flex-col items-center gap-2">
      <UiAvatar class="size-22 md:size-28">
        <UiAvatarImage :src="IaGif" />
      </UiAvatar>

      <h1 class="text-2xl md:text-3xl font-bold text-center md:max-w-[20ch]">
        {{ $t(`companion.intro.greetings.${index}`, { name: user!.name.first }) }}
      </h1>

      <div class="grid gap-2 w-full mt-12">
        <UiTextarea
          v-model="message"
          class="min-h-9 max-h-48 resize-none"
          :placeholder="$t('companion.intro.ask-question')"
        />
        <div
          v-if="message.trim().length"
          class="flex justify-between gap-1 md:gap-4"
        >
          <UiSelect v-model="model">
            <UiSelectTrigger>
              <UiSelectValue />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem value="gpt-4o-mini">
                GPT 4o Mini
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>

          <div class="flex items-center gap-1">
            <UiButton
              size="icon"
              variant="ghost"
              disabled
            >
              <Mic />
            </UiButton>
            <UiButton size="icon">
              <Send />
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </PageRoot>
</template>
