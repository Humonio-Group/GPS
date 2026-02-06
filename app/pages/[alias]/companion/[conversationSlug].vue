<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import CompanionMessageBubble from "~/components/companion/CompanionMessageBubble.vue";
import { ConversationMessageRole } from "~/types/entities/conversation";

definePageMeta({
  layout: "companion",
});

const store = useCompanionStore();
const { selectedConversation: conversation, loading } = storeToRefs(store);
const { alias } = useWorkspaceUtils();

const bottomTrigger = useTemplateRef("bottomTrigger");
watch(conversation, async () => {
  await nextTick();
  bottomTrigger.value?.scrollIntoView({ behavior: "smooth" });
}, { immediate: true, deep: true });

store.selectConversation(useRoute().params.conversationSlug as string).then(async () => {
  await nextTick();
  if (conversation.value) return;

  navigateTo(useLocalePath()(`/${alias.value}/companion/history`));
});

onMounted(() => bottomTrigger.value?.scrollIntoView({ behavior: "smooth" }));
onBeforeRouteLeave(() => store.selectConversation());
</script>

<template>
  <PageRoot
    name="companion.conversation"
    class="flex-1 flex mx-auto max-w-5xl w-full flex-col gap-6 pb-48 pt-16"
  >
    <div
      v-if="loading.item && !conversation?.messages.length"
      class="h-24 grid place-items-center w-full"
    >
      <UiSpinner />
    </div>

    <template v-if="conversation?.messages.length">
      <CompanionMessageBubble
        v-for="(message, index) in conversation.messages"
        :key="index"
        :message="message.content"
        :markdown="message.role === ConversationMessageRole.ASSISTANT"
        :reverse="message.role === ConversationMessageRole.USER"
      />
    </template>

    <span
      v-if="loading.thinking"
      class="animate-pulse size-2.5 rounded-full bg-foreground"
    />

    <div
      ref="bottomTrigger"
      class="h-0"
    />
  </PageRoot>
</template>
