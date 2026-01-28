<script setup lang="ts">
import { ChevronDown, Plus } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import CreateActionDialog from "~/components/course/action/CreateActionDialog.vue";

interface ContentActionProps {
  content: Content;
}

const props = defineProps<ContentActionProps>();

const action = computed(() => props.content.activity.action!);
</script>

<template>
  <div class="@container/action-dialog mx-auto max-w-4xl w-full flex items-center justify-center gap-2">
    <CreateActionDialog :content="content">
      <UiButton
        :variant="action.main ? 'default' : 'outline'"
        :disabled="action.disabled"
      >
        {{ action.label }}
        <Plus />
      </UiButton>
    </CreateActionDialog>

    <template v-if="content.activity.results.length">
      <UiButton
        v-if="content.activity.results.length === 1"
        variant="outline"
      >
        {{ content.activity.results[0]!.label }}
      </UiButton>
      <UiDropdownMenu v-else>
        <UiDropdownMenuTrigger as-child>
          <UiButton variant="outline">
            {{ $t("btn.see-my-results") }}
            <ChevronDown />
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent>
          <UiDropdownMenuItem
            v-for="(result, index) in content.activity.results"
            :key="`${result.label}.${index}`"
          >
            {{ result.label }}
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </template>
  </div>
</template>
