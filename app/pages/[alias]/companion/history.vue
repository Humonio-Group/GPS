<script setup lang="ts">
import { Search, X, Filter, ArrowDown01, ArrowDown10, Rocket } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import { watchOnce } from "@vueuse/core";
import type { Conversation } from "~/types/entities/conversation";

const { t } = useI18n();

useHead({
  title: `${t("companion.history.title")} - ${useBrand().name}`,
});

const { alias } = useWorkspaceUtils();
const { formatDate } = useDateUtils();
const store = useCompanionStore();
const { conversations: conversationsList, agents: agentsList } = storeToRefs(store);

const agents = computed(() => [...agentsList.value, ...conversationsList.value.map(c => c.agent)].reduce((acc, cur) => {
  if (acc.some(a => a.id === cur.id)) return acc;

  acc = [...acc, cur];
  return acc;
}, [] as Conversation["agent"][]));

const agentFilter = ref<number[]>(agents.value.reduce((acc, cur) => {
  acc = [...acc, cur.id];
  return acc;
}, [] as number[]));
const sort = ref<"newest-first" | "oldest-first">("newest-first");
watchOnce(agents, val => agentFilter.value = val.reduce((acc, cur) => {
  acc = [...acc, cur.id];
  return acc;
}, [] as number[]));

const { search, matches, clear } = useSearch();
const conversations = computed(() => conversationsList.value
  .filter(c => agentFilter.value.includes(c.agent.id))
  .filter(c => matches(c.title, c.agent.name))
  .sort((a, b) => {
    if (sort.value === "newest-first") return b.dates.createdAt.getTime() - a.dates.createdAt.getTime();
    return a.dates.createdAt.getTime() - b.dates.createdAt.getTime();
  }));

function toggleAgent(agentId: number) {
  console.log(agentFilter.value.includes(agentId));

  if (agentFilter.value.includes(agentId)) agentFilter.value = agentFilter.value.filter(a => a !== agentId);
  else agentFilter.value = [...agentFilter.value, agentId];
}
function selectAllAgents() {
  agentFilter.value = agents.value.reduce((acc, cur) => {
    acc = [...acc, cur.id];
    return acc;
  }, [] as number[]);
}
function unselectAllAgents() {
  agentFilter.value = [];
}
</script>

<template>
  <PageRoot
    name="companion.history"
    wrapper
    wrapper-class="max-w-5xl mx-auto w-full grid gap-4"
  >
    <header class="grid gap-4">
      <h1 class="text-3xl font-extrabold">
        {{ $t("companion.history.title") }}
      </h1>

      <div class="flex items-start gap-1">
        <div class="grid gap-1.5 flex-1">
          <div class="relative">
            <UiInput
              v-model="search"
              :placeholder="$t('labels.search')"
              class="pl-8"
              @click="clear"
            />

            <UiButton
              v-if="search.length"
              size="icon-xs"
              variant="ghost"
              class="rounded-full absolute top-1.5 left-1.5 size-6"
              @click="clear"
            >
              <X />
            </UiButton>
            <Search
              v-else
              class="absolute top-2.5 left-2.5 size-4 text-muted-foreground"
            />
          </div>
          <span
            v-if="search.length || agentFilter.length !== agents.length"
            class="text-xs text-muted-foreground ml-2"
          >{{ $t("labels.search-results", conversations.length, { named: { count: conversations.length, total: conversationsList.length } }) }}</span>
        </div>

        <UiPopover>
          <UiPopoverTrigger as-child>
            <UiButton
              size="icon"
              variant="outline"
            >
              <Filter />
            </UiButton>
          </UiPopoverTrigger>
          <UiPopoverContent
            align="end"
            class="grid w-full p-2 max-w-[calc(100dvw-3rem)] mx-6 sm:mx-0"
          >
            <UiLabel
              v-for="agent in agents"
              :key="agent.key"
              class="flex items-center gap-2 cursor-pointer! bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors duration-75 p-2 pr-3 rounded-md"
            >
              <UiAvatar class="size-6 rounded-sm">
                <UiAvatarImage
                  v-if="agent.avatar"
                  :src="agent.avatar"
                />
                <UiAvatarFallback>{{ agent.name.substring(0, 2) }}</UiAvatarFallback>
              </UiAvatar>

              <span class="flex-1 mr-4">{{ agent.name }}</span>

              <UiCheckbox
                :model-value="agentFilter.includes(agent.id)"
                @update:model-value="toggleAgent(agent.id)"
              />
            </UiLabel>

            <UiButton
              v-if="agentFilter.length === agents.length"
              class="w-min ml-auto"
              variant="ghost"
              size="sm"
              @click="unselectAllAgents"
            >
              Tout désélectionner
            </UiButton>
            <UiButton
              v-else
              class="w-min ml-auto"
              variant="ghost"
              size="sm"
              @click="selectAllAgents"
            >
              Tout sélectionner
            </UiButton>
          </UiPopoverContent>
        </UiPopover>

        <UiDropdownMenu>
          <UiDropdownMenuTrigger>
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  size="icon"
                  variant="outline"
                >
                  <ArrowDown01 v-if="sort == 'oldest-first'" />
                  <ArrowDown10 v-if="sort === 'newest-first'" />
                </UiButton>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ $t(`companion.history.filters.sort.${sort}`) }}</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent align="end">
            <UiDropdownMenuRadioGroup v-model="sort">
              <UiDropdownMenuRadioItem value="newest-first">
                {{ $t("companion.history.filters.sort.newest-first") }}
              </UiDropdownMenuRadioItem>
              <UiDropdownMenuRadioItem value="oldest-first">
                {{ $t("companion.history.filters.sort.oldest-first") }}
              </UiDropdownMenuRadioItem>
            </UiDropdownMenuRadioGroup>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </div>
    </header>

    <main
      v-if="conversations.length"
      class="grid gap-2"
    >
      <template
        v-for="(conversation, index) in conversations"
        :key="conversation.slug"
      >
        <UiSeparator v-if="index > 0" />
        <UiButton
          variant="ghost"
          class="h-auto! py-2 px-3 text-base! flex-col items-start gap-0"
          as-child
        >
          <NuxtLinkLocale
            :to="`/${alias}/companion/${conversation.slug}`"
            class="max-w-full overflow-hidden"
          >
            <span class="truncate max-w-full">
              {{ conversation.title }}
            </span>

            <div class="flex items-center gap-3 text-xs text-muted-foreground">
              <div class="flex items-center gap-1">
                <UiAvatar class="size-4.5">
                  <UiAvatarImage
                    v-if="conversation.agent.avatar"
                    :src="conversation.agent.avatar"
                  />
                  <UiAvatarFallback> {{ conversation.agent.name.substring(0, 2) }}</UiAvatarFallback>
                </UiAvatar>

                {{ conversation.agent.name }}
              </div>

              <UiSeparator orientation="vertical" />

              <span>{{ formatDate("long")(conversation.dates.createdAt) }}</span>
            </div>
          </NuxtLinkLocale>
        </UiButton>
      </template>
    </main>
    <UiEmpty v-else>
      <UiEmptyHeader>
        <UiEmptyTitle>
          {{ $t("companion.history.empty.title") }}
        </UiEmptyTitle>
        <UiEmptyDescription>
          {{ $t(`companion.history.empty.description.${!conversationsList.length ? 'no-entries' : 'no-match'}`) }}
        </UiEmptyDescription>
        <UiButton
          v-if="!conversationsList.length"
          as-child
        >
          <NuxtLinkLocale :to="`/${alias}/companion`">
            {{ $t("companion.history.empty.action") }}
            <Rocket />
          </NuxtLinkLocale>
        </UiButton>
      </UiEmptyHeader>
    </UiEmpty>
  </PageRoot>
</template>
