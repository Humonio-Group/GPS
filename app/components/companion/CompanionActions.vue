<script setup lang="ts">
import { Archive, Edit2, Trash } from "lucide-vue-next";
import RenameDialog from "~/components/companion/actions/RenameDialog.vue";

interface CompanionActionsProps {
  conversation: any;
}

defineProps<CompanionActionsProps>();

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
          <UiDropdownMenuItem>
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
