<script setup lang="ts">
import { Send } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import type { Nullable } from "~/types/primitives/objects";

const { t } = useI18n();

definePageMeta({
  layout: "companion",
});

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
  handleChatShortcuts(event, send);
}
async function send() {
  const value = message.value.trim();
  if (!value.length || agent.value === null) return;

  await store.createConversation(agent.value!, value);
}
</script>

<template>
  <PageRoot class="w-full max-w-7xl mx-auto flex-1 py-2 px-6 grid place-items-center">
    <div class="relative w-full md:w-3/5 flex flex-col items-center gap-2">
      <div class="absolute w-full top-0 left-1/2 -translate-x-1/2 -translate-y-[160%] flex items-center justify-center gap-4">
        <div class="relative size-min">
          <UiAvatar class="size-11 md:size-13">
            <UiAvatarImage
              v-if="company?.icon"
              :src="company?.icon"
            />
            <UiAvatarFallback>{{ company?.name.substring(0, 2) }}</UiAvatarFallback>
          </UiAvatar>
          <NuxtImg
            v-if="isXmas"
            class="absolute -top-3 -right-3 object-contain size-9"
            src="/assets/images/xmas-hat.png"
          />
          <NuxtImg
            v-if="isEaster"
            class="absolute -bottom-1.5 -right-1 object-contain size-8"
            src="/assets/images/easter-eggs.webp"
          />
        </div>

        <h1 class="text-3xl md:text-4xl">
          {{ $t(`companion.intro.greetings.${index}`, { name: user!.name.first }) }}
        </h1>
      </div>

      <div class="rounded-2xl border grid gap-1 w-full p-1 pt-2 shadow-lg/7">
        <div class="relative">
          <UiTextarea
            v-model="message"
            :disabled="loading.creating"
            class="min-h-16 px-5 rounded-lg! py-3 border-none! shadow-none! max-h-48 resize-none outline-0! ring-0! bg-background!"
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
          class="flex justify-end gap-2 md:gap-4 p-2"
        >
          <UiSelect
            v-model="agent"
            :disabled="loading.creating"
          >
            <UiSelectTrigger
              size="sm"
              class="border-none! shadow-none! bg-accent! text-accent-foreground! mr-auto pl-1.5 pr-2"
            >
              <UiAvatar class="size-5 rounded-full!">
                <UiAvatarImage
                  v-if="selectedAgent?.avatar"
                  :src="selectedAgent.avatar"
                />
                <UiAvatarFallback class="text-xs text-foreground!">
                  {{ selectedAgent?.name }}
                </UiAvatarFallback>
              </UiAvatar>
              {{ selectedAgent?.name }}
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem
                v-for="_agent in agents"
                :key="_agent.key"
                :value="_agent.id"
              >
                <UiAvatar class="size-5 rounded-full!">
                  <UiAvatarImage
                    v-if="_agent.avatar"
                    :src="_agent.avatar"
                  />
                  <UiAvatarFallback class="text-xs">
                    {{ _agent.name[0] }}
                  </UiAvatarFallback>
                </UiAvatar>

                {{ _agent.name }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>

          <UiButton
            size="icon"
            :disabled="!canSend || loading.creating"
            @click="send"
          >
            <UiSpinner v-if="loading.creating" />
            <Send v-else />
          </UiButton>
        </div>
      </div>
    </div>
  </PageRoot>
</template>
