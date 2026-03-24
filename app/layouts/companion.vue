<script setup lang="ts">
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import DefaultSidebar from "~/components/navigation/DefaultSidebar.vue";
import GettingHelp from "~/components/navigation/entities/GettingHelp.vue";
import { Bell, BellDot, MoreVertical, Plus, Send, History, Edit } from "lucide-vue-next";
import CompanionActions from "~/components/companion/CompanionActions.vue";
import HistoryDialog from "~/components/companion/HistoryDialog.vue";

const { alias } = useWorkspaceUtils();
const { isMobile } = useResponsive();
const { notifications, hasNewNotifications, loading } = storeToRefs(useNotificationStore());

const store = useCompanionStore();
const { selectedConversation: conversation, canWrite } = storeToRefs(store);

const route = useRoute();
const showInput = computed<boolean>(() => route.meta.showInput as boolean && !!conversation.value && !conversation.value.dates.archivedAt);

const message = ref<string>("");

async function sendMessage() {
  const value = message.value.trim();
  if (!value.length || !canWrite.value) return;

  store.sendMessage(value).then();
  message.value = "";
}
</script>

<template>
  <LayoutRoot name="companion">
    <UiSidebarProvider>
      <DefaultSidebar show-search />

      <UiSidebarInset class="relative flex flex-col max-h-dvh overflow-y-auto">
        <header
          class="top-0 py-3 px-4 flex items-center gap-2 bg-background z-50"
          :class="{ 'shrink-0 sticky border-b': !!conversation, 'absolute top-0 inset-x-0': !conversation }"
        >
          <UiSidebarTrigger v-if="isMobile" />

          <div
            v-if="conversation"
            class="flex items-center gap-2 overflow-hidden"
          >
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiAvatar class="size-6 rounded-full">
                  <UiAvatarImage
                    v-if="conversation.agent.avatar"
                    :src="conversation.agent.avatar"
                  />
                  <UiAvatarFallback>{{ conversation.agent.name.substring(0, 2) }}</UiAvatarFallback>
                </UiAvatar>
              </UiTooltipTrigger>
              <UiTooltipContent side="right">
                <p>{{ conversation.agent.name }}</p>
              </UiTooltipContent>
            </UiTooltip>

            <h1 class="font-medium truncate min-w-0">
              {{ conversation.title }}
            </h1>
          </div>

          <div class="ml-auto flex items-center">
            <template v-if="isMobile">
              <UiTooltip>
                <UiTooltipTrigger as-child>
                  <UiButton
                    size="icon-sm"
                    variant="ghost"
                    as-child
                  >
                    <NuxtLinkLocale :to="`/${alias}/notifications`">
                      <UiSpinner v-if="!notifications.length && loading.list" />
                      <BellDot v-else-if="hasNewNotifications" />
                      <Bell v-else />
                    </NuxtLinkLocale>
                  </UiButton>
                </UiTooltipTrigger>
                <UiTooltipContent>
                  <p>{{ $t("navigation.actions.notifications") }}</p>
                </UiTooltipContent>
              </UiTooltip>

              <GettingHelp />
            </template>

            <UiButton
              v-if="conversation"
              size="icon-sm"
              variant="ghost"
              as-child
            >
              <NuxtLinkLocale :to="`/${alias}/companion`">
                <Edit />
              </NuxtLinkLocale>
            </UiButton>

            <HistoryDialog>
              <UiButton
                size="icon-sm"
                variant="ghost"
              >
                <History />
              </UiButton>
            </HistoryDialog>

            <CompanionActions
              v-if="conversation"
              :conversation="conversation"
            >
              <UiButton
                size="icon-sm"
                variant="ghost"
              >
                <MoreVertical />
              </UiButton>
            </CompanionActions>
          </div>
        </header>

        <main class="p-2 py-0 flex-1 flex flex-col max-h-full">
          <NuxtPage />

          <footer
            v-if="showInput"
            class="sticky bottom-0 mx-auto w-full max-w-5xl shrink-0 flex flex-col py-4 bg-background gap-2"
          >
            <div class="relative flex-1">
              <UiButton
                v-if="false"
                size="icon"
                variant="ghost"
                class="absolute bottom-0.75 left-0.75"
              >
                <Plus />
              </UiButton>
              <UiTextarea
                v-model="message"
                :placeholder="$t('companion.message-placeholder')"
                class="min-h-9 py-3 px-4 max-h-32 resize-none rounded-xl pr-14 appearance-none bg-background!"
                rows="1"
                submit-on-enter
                @submit="sendMessage"
              />
              <UiButton
                size="icon"
                class="absolute bottom-1.75 right-1.75"
                :disabled="!canWrite"
                @click="sendMessage"
              >
                <Send />
              </UiButton>
            </div>
            <p class="text-muted-foreground text-center text-xs px-2">
              {{ $t("companion.warning") }}
            </p>
          </footer>
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
