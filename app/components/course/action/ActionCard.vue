<script setup lang="ts">
import type { Action } from "~/types/entities/action";
import ActionDetailsDialog from "~/components/course/action/ActionDetailsDialog.vue";

interface ActionCardProps {
  action: Action;
}

const props = defineProps<ActionCardProps>();

const { isBefore, formatDate } = useDateUtils();
const late = computed(() => isBefore(props.action.end));
</script>

<template>
  <ActionDetailsDialog :action="action">
    <UiCard class="p-4 gap-4 flex-row cursor-pointer">
      <UiCardHeader class="px-0 flex-1 flex flex-col gap-1 overflow-hidden">
        <UiCardTitle class="truncate w-full">
          {{ action.description.raw }}
        </UiCardTitle>
        <UiCardDescription :class="{ 'text-destructive!': late }">
          {{ late
            ? $t("labels.state.late")
            : $t("courses.specimen.actions.to-finish-for", { date: formatDate("medium")(action.end) }) }}
        </UiCardDescription>
      </UiCardHeader>

      <UiCardFooter class="px-0">
        <UiCircularProgress :model-value="action.progression * 100" />
      </UiCardFooter>
    </UiCard>
  </ActionDetailsDialog>
</template>
