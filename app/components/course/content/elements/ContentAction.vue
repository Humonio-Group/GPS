<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import CreateActionDialog from "~/components/course/action/CreateActionDialog.vue";

interface ContentActionProps {
  content: Content;
}

const props = defineProps<ContentActionProps>();

const action = computed(() => props.content.activity.action!);
</script>

<template>
  <div class="@container/action-dialog mx-auto max-w-4xl w-full grid place-items-center">
    <CreateActionDialog :content="content">
      <UiButton
        :variant="action.main ? 'default' : 'outline'"
        :disabled="action.disabled"
      >
        {{ action.label }}
        <Plus />
      </UiButton>
    </CreateActionDialog>
  </div>
</template>
