<script setup lang="ts">
import { Send } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import IaGif from "~/assets/images/ia.gif";
import type { Nullable } from "~/types/primitives/objects";

const { t } = useI18n();

const store = useCompanionStore();
const { agents, loading } = storeToRefs(store);
const { company } = storeToRefs(useCompanyStore());
const { user } = storeToRefs(useUserStore());

const agent = ref<Nullable<number>>(agents.value[0]?.id ?? null);
const message = ref<string>("");
const index = computed(() => Math.floor(Math.random() * 3));
const canSend = computed(() => message.value.trim().length);

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
      <UiAvatar class="size-22 md:size-28">
        <UiAvatarImage :src="IaGif" />
      </UiAvatar>

      <h1 class="text-2xl md:text-3xl font-bold text-center md:max-w-[20ch]">
        {{ $t(`companion.intro.greetings.${index}`, { name: user!.name.first }) }}
      </h1>

      <div class="grid gap-2 w-full mt-12">
        <UiTextarea
          v-model="message"
          :disabled="loading.creating"
          class="min-h-9 max-h-48 resize-none"
          :placeholder="$t('companion.intro.ask-question')"
          @keydown="submit"
        />
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
