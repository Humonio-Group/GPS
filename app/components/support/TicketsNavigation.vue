<script setup lang="ts">
import { Plus, MessageSquareDashed, Search } from "lucide-vue-next";
import TicketsList from "~/components/support/TicketsList.vue";
import TicketItem from "~/components/support/elements/TicketItem.vue";
import CreateTicketDialog from "~/components/support/dialogs/CreateTicketDialog.vue";
import { useLocalStorage } from "@vueuse/core";

const store = useTicketStore();
const { tickets: _tickets, loading } = storeToRefs(store);

const createTicketOpen = ref<boolean>(false);
const showClosedTickets = useLocalStorage("gps.show-closed-tickets", "true");
const search = ref<string>("");

const tickets = computed(() => _tickets.value
  .filter(t => showClosedTickets.value === "true" || !t.dates.closedAt)
  .filter(t => t.title.toLowerCase().includes(search.value)));
</script>

<template>
  <TicketsList class="flex flex-col gap-2">
    <header class="grid gap-3">
      <h1 class="text-lg font-bold">
        {{ $t("support.title") }}
      </h1>
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <Search class="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <UiInput
            :model-value="search"
            :placeholder="$t('labels.placeholder.search')"
            class="pl-9"
            @update:model-value="search = ($event as string).trim().toLowerCase()"
          />
        </div>

        <UiButton
          size="icon"
          @click="createTicketOpen = true"
        >
          <Plus />
        </UiButton>
      </div>
      <UiLabel class="flex items-center gap-2 justify-between">
        {{ $t("support.show-closed-tickets") }}
        <UiSwitch
          :model-value="showClosedTickets === 'true'"
          @update:model-value="showClosedTickets = $event.toString()"
        />
      </UiLabel>
    </header>

    <UiSeparator />

    <UiEmpty v-if="!loading.list && !tickets.length">
      <UiEmptyHeader>
        <UiEmptyMedia variant="icon">
          <MessageSquareDashed class="text-muted-foreground" />
        </UiEmptyMedia>
        <UiEmptyTitle>
          {{ $t("support.no-tickets.title") }}
        </UiEmptyTitle>
        <UiEmptyDescription>
          <template v-if="search.length">
            {{ $t("support.no-tickets.with-search") }}
          </template>
          <template v-else-if="showClosedTickets">
            {{ $t("support.no-tickets.include-closed") }}
          </template>
          <template v-else>
            {{ $t("support.no-tickets.default") }}
          </template>
        </UiEmptyDescription>
      </UiEmptyHeader>
      <UiEmptyContent>
        <UiButton @click="createTicketOpen = true">
          <Plus />
          {{ $t("btn.open.ticket") }}
        </UiButton>
      </UiEmptyContent>
    </UiEmpty>
    <div
      v-else
      class="flex-1 shrink-0 flex flex-col gap-2 overflow-y-auto"
    >
      <TicketItem
        v-for="ticket in tickets"
        :key="`ticket#${ticket.id}`"
        :ticket="ticket"
      />
    </div>

    <div
      v-if="loading.list"
      class="h-16 grid place-items-center"
    >
      <UiSpinner />
    </div>

    <CreateTicketDialog v-model:open="createTicketOpen" />
  </TicketsList>
</template>
