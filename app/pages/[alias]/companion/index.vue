<script setup lang="ts">
import { Send } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import type { Nullable } from "~/types/primitives/objects";

const { t } = useI18n();

const { isEaster, isHalloween, isXmas } = useHolidays();

const store = useCompanionStore();
const { agents, loading } = storeToRefs(store);
const { company } = storeToRefs(useCompanyStore());
const { user } = storeToRefs(useUserStore());

const agent = ref<Nullable<number>>(agents.value[0]?.id ?? null);
const message = ref<string>("");
const index = computed(() => Math.floor(Math.random() * 3));
const canSend = computed(() => message.value.trim().length);

const selectedAgent = computed(() => agents.value.find(a => a.id === agent.value) ?? null);

watch(agents, (val) => {
  if (!val || !val.length || agent.value !== null) return;

  agent.value = val[0]!.id;
});

const { handleChatShortcuts } = useKeyboard();

useHead({
  title: `${t("companion.intro.title")} - ${company.value!.name}`,
});

function submit(event: KeyboardEvent) {
  handleChatShortcuts(event, async () => {
    const value = message.value.trim();
    if (!value.length || agent.value === null) return;

    await store.createConversation(agent.value!, value);
  });
}
</script>

<template>
  <PageRoot class="w-full max-w-7xl mx-auto flex-1 py-2 grid place-items-center">
    <div class="w-full md:w-3/5 flex flex-col items-center gap-2">
      <div class="relative size-min">
        <UiAvatar
          v-if="selectedAgent?.avatar"
          class="size-22 md:size-28"
        >
          <UiAvatarImage :src="selectedAgent?.avatar" />
        </UiAvatar>
        <NuxtImg
          v-if="isXmas"
          class="absolute -top-3 -right-3 object-contain size-16"
          src="/assets/images/xmas-hat.png"
        />
        <NuxtImg
          v-if="isEaster"
          class="absolute -bottom-1.5 -right-1 object-contain size-10"
          src="/assets/images/easter-eggs.webp"
        />
      </div>

      <h1 class="text-2xl md:text-3xl font-bold text-center md:max-w-[20ch]">
        {{ $t(`companion.intro.greetings.${index}`, { name: user!.name.first }) }}
      </h1>

      <div class="grid gap-2 w-full mt-12">
        <div class="relative">
          <UiTextarea
            v-model="message"
            :disabled="loading.creating"
            class="min-h-9 max-h-48 resize-none"
            :placeholder="$t('companion.intro.ask-question')"
            @keydown="submit"
          />
          <NuxtImg
            v-if="isHalloween"
            class="absolute bottom-0 translate-y-full right-2 object-contain size-14 dark:invert"
            src="/assets/images/halloween.png"
          />
        </div>
        <div
          class="flex justify-between gap-1 md:gap-4"
        >
          <UiSelect
            v-model="agent"
            :disabled="loading.creating"
          >
            <UiSelectTrigger>
              <UiSelectValue />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem
                v-for="_agent in agents"
                :key="_agent.key"
                :value="_agent.id"
              >
                {{ _agent.name }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>

          <div
            v-if="canSend"
            class="flex items-center gap-1"
          >
            <UiButton
              size="icon"
              :disabled="loading.creating"
            >
              <UiSpinner v-if="loading.creating" />
              <Send v-else />
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </PageRoot>
</template>
