<script setup lang="ts">
import type { Conversation } from "~/types/entities/conversation";

interface DeleteConfirmDialogProps {
  conversation: Conversation;
}

const props = defineProps<DeleteConfirmDialogProps>();

const open = defineModel<boolean>("open", { default: false });
const store = useCompanionStore();
</script>

<template>
  <UiAlertDialog v-model:open="open">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>{{ $t("dialogs.delete-conversation.title") }}</UiAlertDialogTitle>
        <UiAlertDialogDescription>{{ $t("dialogs.delete-conversation.description", { title: conversation.title }) }}</UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <UiAlertDialogFooter>
        <UiAlertDialogCancel>{{ $t("btn.cancel") }}</UiAlertDialogCancel>
        <UiAlertDialogAction @click="store.delete(conversation.id)">
          {{ $t("btn.action.delete") }}
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
