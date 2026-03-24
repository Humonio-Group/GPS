<script setup lang="ts">
import { ChevronDown, Plus } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import CreateActionDialog from "~/components/course/action/CreateActionDialog.vue";
import type { Nullable } from "~/types/primitives/objects";
import ActionActivityDialog from "~/components/course/action/ActionActivityDialog.vue";

interface ContentActionProps {
  content: Content;
}

const props = defineProps<ContentActionProps>();

const action = computed(() => props.content.activity.action!);
const selectedAction = ref<Nullable<number>>(null);

const getActionId = (url: string): number => Number(url.split("=")[1] ?? -1);
</script>

<template>
  <div class="@container/action-dialog mx-auto max-w-4xl w-full flex items-center justify-center gap-2">
    <template v-if="content.activity.results.length">
      <UiButton
        v-if="content.activity.results.length === 1"
        size="xl"
        variant="outline"
        @click="selectedAction = getActionId(content.activity.results[0]!.internalUrl)"
      >
        {{ content.activity.results[0]!.label }}
      </UiButton>
      <UiDropdownMenu v-else>
        <UiDropdownMenuTrigger as-child>
          <UiButton
            size="xl"
            variant="outline"
          >
            {{ $t("btn.see-my-results") }}
            <ChevronDown />
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent>
          <UiDropdownMenuItem
            v-for="(result, index) in content.activity.results"
            :key="`${result.label}.${index}`"
            @click="selectedAction = getActionId(result.internalUrl)"
          >
            {{ result.label }}
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>

      <ActionActivityDialog
        v-for="(result, index) in content.activity.results"
        :key="`modal-${result.label}.${index}`"

        :open="selectedAction === getActionId(result.internalUrl)"
        :action-id="getActionId(result.internalUrl)"
        @close="selectedAction = null"
      />
    </template>
    <CreateActionDialog
      v-else
      :content="content"
    >
      <UiButton
        size="xl"
        :variant="action.main ? 'default' : 'outline'"
        :disabled="action.disabled"
      >
        {{ action.label }}
        <Plus />
      </UiButton>
    </CreateActionDialog>
  </div>
</template>
