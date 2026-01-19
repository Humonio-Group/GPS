<script setup lang="ts">
import { MoreVertical, X } from "lucide-vue-next";
import type { Ticket } from "~/types/entities/ticket";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

interface TicketActionsProps {
  ticket: Ticket;
  class?: HTMLAttributes["class"];
}

const props = defineProps<TicketActionsProps>();

const store = useTicketStore();
const { loading } = storeToRefs(store);
const open = ref<boolean>(false);
</script>

<template>
  <div :class="cn('', props.class)">
    <UiDropdownMenu>
      <UiDropdownMenuTrigger as-child>
        <UiButton
          size="icon"
          variant="ghost"
          :disabled="loading.closing"
        >
          <MoreVertical />
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent align="end">
        <UiDropdownMenuItem
          variant="destructive"
          :disabled="loading.closing"
          @click="open = true"
        >
          <X />
          {{ $t("btn.close.ticket") }}
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <UiAlertDialog v-model:open="open">
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>
            {{ $t("support.close-dialog.title", { ticketId: ticket.id }) }}
          </UiAlertDialogTitle>
          <UiAlertDialogDescription>
            {{ $t("support.close-dialog.description") }}
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>

        <UiAlertDialogFooter>
          <UiAlertDialogCancel>
            {{ $t("btn.cancel") }}
          </UiAlertDialogCancel>
          <UiAlertDialogAction @click="store.closeTicket(ticket.id)">
            {{ $t("btn.close.default") }}
          </UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>
