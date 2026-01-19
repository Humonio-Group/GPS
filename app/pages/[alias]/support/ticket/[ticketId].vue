<script setup lang="ts">
import { Send, Plus } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import TicketMessage from "~/components/support/elements/TicketMessage.vue";
import { TicketStatus } from "~/types/entities/ticket";

const route = useRoute();
const ticketId = computed(() => Number(route.params.ticketId as string));
const bottomTrigger = useTemplateRef("bottomTrigger");
const messageContent = ref<string>("");

const { formatDate } = useDateUtils();
const { formatTime } = useTimeUtils();

const store = useTicketStore();
const { selectedTicket: ticket, loading } = storeToRefs(store);

store.selectTicket(ticketId.value);

function scrollToBottom() {
  bottomTrigger.value?.scrollIntoView({ behavior: "smooth" });
}
watch(ticket, async () => {
  await nextTick();
  scrollToBottom();
}, { immediate: true, deep: true });

async function sendMessage() {
  if (!(await store.sendMessage(ticket.value!.id, messageContent.value.trim()))) return;
  messageContent.value = "";
}

onBeforeRouteUpdate(() => store.selectTicket());
</script>

<template>
  <PageRoot
    :name="`support.ticket#${ticket?.id}`"
    class="flex-1 flex flex-col p-4 gap-4 overflow-hidden"
  >
    <template v-if="ticket">
      <div class="flex-1 overflow-y-auto flex flex-col gap-6">
        <span class="w-full text-center text-sm text-muted-foreground">
          {{ $t("labels.date-time.opened-at", { date: formatDate("medium")(ticket.dates.createdAt), time: formatTime("short")(ticket.dates.createdAt) }) }}
        </span>

        <TicketMessage
          v-for="comment in ticket!.comments"
          :key="`ticket#${ticket!.id}-comment#${comment.id}`"
          :comment="comment"
        />

        <span
          v-if="ticket.dates.closedAt"
          class="w-full text-center text-sm text-muted-foreground"
        >
          {{ $t("labels.date-time.resolved-at", { date: formatDate("medium")(ticket.dates.closedAt), time: formatTime("short")(ticket.dates.closedAt) }) }}
        </span>

        <div
          ref="bottomTrigger"
          class="h-0"
        />
      </div>

      <footer
        v-if="ticket.metadata.status !== TicketStatus.CLOSED"
        class="flex items-center gap-1 shrink-0"
      >
        <div class="relative w-full">
          <UiButton
            variant="ghost"
            size="icon-xs"
            class="absolute bottom-1.25 left-1.25"
            :disabled="loading.sending"
          >
            <Plus />
          </UiButton>

          <UiTextarea
            v-model="messageContent"
            :placeholder="$t('support.text-placeholder')"
            class="pl-9 min-h-9 max-h-32 resize-none"
            submit-on-enter
            :disabled="loading.sending"
            @submit="sendMessage"
          />
        </div>

        <UiButton
          variant="ghost"
          size="icon"
          :disabled="loading.sending || !messageContent.trim().length"
          @click="sendMessage"
        >
          <UiSpinner v-if="loading.sending" />
          <Send v-else />
        </UiButton>
      </footer>
    </template>
  </PageRoot>
</template>
