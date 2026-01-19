<script setup lang="ts">
import type { Ticket } from "~/types/entities/ticket";

interface TicketItemProps {
  ticket: Ticket;
}

defineProps<TicketItemProps>();

const { alias } = useWorkspaceUtils();
const { selectedTicketId } = storeToRefs(useTicketStore());
</script>

<template>
  <UiCard
    class="relative hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-75 py-3 gap-3"
    :class="{ 'bg-sidebar-accent! text-sidebar-accent-foreground!': selectedTicketId === ticket.id }"
  >
    <UiCardHeader class="px-3 flex flex-col gap-0">
      <UiCardTitle class="text-base truncate max-w-full">
        {{ ticket.title }}
      </UiCardTitle>
      <UiCardDescription class="line-clamp-1">
        {{ ticket.comments[0]!.message }}
      </UiCardDescription>
    </UiCardHeader>

    <UiCardFooter
      v-if="ticket.dates.closedAt"
      class="px-3"
    >
      <UiBadge
        variant="secondary"
        class="py-0.5 px-1.5 leading-none"
      >
        Résolu
      </UiBadge>
    </UiCardFooter>

    <NuxtLinkLocale
      :to="`/${alias}/support/ticket/${ticket.id}`"
      class="absolute inset-0"
    />
  </UiCard>
</template>
