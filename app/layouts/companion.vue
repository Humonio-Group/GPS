<script setup lang="ts">
import LayoutRoot from "~/components/primitives/composing/LayoutRoot.vue";
import DefaultSidebar from "~/components/navigation/DefaultSidebar.vue";
import GettingHelp from "~/components/navigation/entities/GettingHelp.vue";
import { Bell, BellDot, MoreVertical, Plus, Send, History } from "lucide-vue-next";
import CompanionActions from "~/components/companion/CompanionActions.vue";

const { alias } = useWorkspaceUtils();
const { notifications, hasNewNotifications, loading } = storeToRefs(useNotificationStore());

const store = useCompanionStore();
const { selectedConversation: conversation, canWrite } = storeToRefs(store);

const message = ref<string>("");

async function sendMessage() {
  if (!canWrite.value) return;
  await store.sendMessage(message.value);
  message.value = "";
}
</script>

<template>
  <LayoutRoot name="companion">
    <UiSidebarProvider>
      <DefaultSidebar />

      <UiSidebarInset class="px-4 md:pl-2 flex flex-col max-h-dvh overflow-y-auto">
        <header class="shrink-0 sticky top-0 py-4 flex items-center gap-2 bg-background z-50">
          <UiSidebarTrigger />
          <h1 class="font-bold">
            {{ conversation?.title }}
          </h1>

          <div class="ml-auto flex items-center">
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

            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  size="icon"
                  variant="ghost"
                >
                  <History />
                </UiButton>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ $t("labels.tooltips.conversation-history") }}</p>
              </UiTooltipContent>
            </UiTooltip>

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

          <footer class="sticky bottom-0 mx-auto w-full max-w-5xl shrink-0 flex py-4 bg-background">
            <div class="relative flex-1">
              <UiButton
                size="icon-sm"
                variant="ghost"
                class="absolute bottom-0.75 left-0.75"
              >
                <Plus />
              </UiButton>
              <UiTextarea
                v-model="message"
                placeholder="Message..."
                class="min-h-9 max-h-32 resize-none px-9"
                submit-on-enter
                @submit="sendMessage"
              />
              <UiButton
                size="icon-sm"
                class="absolute bottom-0.75 right-0.75"
                :disabled="!canWrite"
                @click="sendMessage"
              >
                <Send />
              </UiButton>
            </div>
          </footer>
        </main>
      </UiSidebarInset>
    </UiSidebarProvider>
  </LayoutRoot>
</template>
