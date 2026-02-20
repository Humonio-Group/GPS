<script setup lang="ts">
import { Archive, ArchiveX, Edit2, Trash } from "lucide-vue-next";
import RenameDialog from "~/components/companion/actions/RenameDialog.vue";

interface CompanionActionsProps {
  conversation: any;
}

defineProps<CompanionActionsProps>();

const store = useCompanionStore();

const renameDialogOpen = ref<boolean>(false);
</script>

<template>
  <div>
    <UiDropdownMenu>
      <UiDropdownMenuTrigger as-child>
        <slot />
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent align="end">
        <UiDropdownMenuGroup>
          <UiDropdownMenuItem @click="renameDialogOpen = true">
            <Edit2 />
            {{ $t("btn.action.rename") }}
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>

        <UiDropdownMenuSeparator />

        <UiDropdownMenuGroup>
          <UiDropdownMenuItem
            v-if="conversation.dates.archivedAt"
            @click="store.restore(conversation.id)"
          >
            <ArchiveX />
            {{ $t("btn.action.restore") }}
          </UiDropdownMenuItem>
          <UiDropdownMenuItem
            v-else
            @click="store.archive(conversation.id)"
          >
            <Archive />
            {{ $t("btn.action.archive") }}
          </UiDropdownMenuItem>
          <UiDropdownMenuItem variant="destructive">
            <Trash />
            {{ $t("btn.action.delete") }}
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <RenameDialog
      v-model:open="renameDialogOpen"
      :conversation="conversation"
    />
  </div>
</template>
