<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import { Menu, MoreVertical, X } from "lucide-vue-next";
import TicketsNavigation from "~/components/support/TicketsNavigation.vue";
import { TicketStatus } from "~/types/entities/ticket";
import TicketActions from "~/components/support/elements/TicketActions.vue";

const { isMobile } = useBrowser();
const open = ref<boolean>(false);

const store = useTicketStore();
const { selectedTicket: ticket } = storeToRefs(store);

store.loadTickets();
</script>

<template>
  <PageRoot
    name="support.home"
    class="rounded-lg border overflow-hidden flex flex-1 max-h-full!"
  >
    <TicketsNavigation v-model:open="open" />

    <main class="flex-1 flex flex-col">
      <header
        v-if="isMobile || ticket"
        class="bg-background shrink-0 pl-5 pr-3 border-b flex items-center gap-2 h-16"
      >
        <UiButton
          v-if="isMobile"
          size="icon-sm"
          variant="ghost"
          @click="open = !open"
        >
          <Menu />
        </UiButton>

        <template v-if="ticket">
          <h1 class="font-bold">
            {{ ticket.title }}
          </h1>

          <UiBadge
            v-if="ticket.metadata.status === TicketStatus.CLOSED"
            variant="secondary"
            class="ml-1"
          >
            {{ $t("labels.state.resolved") }}
          </UiBadge>
          <UiBadge
            v-else-if="ticket.metadata.status === TicketStatus.NEW"
            variant="outline"
            class="ml-1"
          >
            {{ $t("labels.state.new") }}
          </UiBadge>
          <UiBadge
            v-else-if="ticket.metadata.status === TicketStatus.IN_PROGRESS"
            variant="destructive"
            class="ml-1"
          >
            {{ $t("labels.state.in-progress") }}
          </UiBadge>
          <UiBadge
            v-else-if="ticket.metadata.status === TicketStatus.REVIEWABLE"
            class="ml-1"
          >
            {{ $t("labels.state.reviewable") }}
          </UiBadge>

          <TicketActions
            v-if="ticket.metadata.status !== TicketStatus.CLOSED"
            :ticket="ticket"
            class="ml-auto"
          />
        </template>
      </header>

      <NuxtPage />
    </main>
  </PageRoot>
</template>
