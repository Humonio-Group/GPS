<script setup lang="ts">
import type { Action } from "~/types/entities/action";
import ActionActivityDialog from "~/components/course/action/ActionActivityDialog.vue";

interface ActionCardProps {
  action: Action;
}

const props = defineProps<ActionCardProps>();

const { isOn, isOnOrBefore, formatDate } = useDateUtils();
const end = computed(() => {
  const date = new Date(props.action.end);
  date.setDate(date.getDate() + 1);
  return date;
});
const today = computed(() => {
  const _end = new Date(props.action.end);
  _end.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isOn(_end, today);
});
const late = computed(() => isOnOrBefore(end.value));
</script>

<template>
  <ActionActivityDialog :action-id="action.id">
    <UiCard class="p-4 gap-4 flex-row cursor-pointer hover:border-primary hover:scale-101 transition-all duration-100">
      <UiCardHeader class="px-0 flex-1 flex flex-col gap-1 overflow-hidden">
        <UiCardTitle class="truncate w-full">
          {{ action.description.raw }}
        </UiCardTitle>
        <UiCardDescription :class="{ 'text-primary!': action.progression >= 1, 'text-destructive!': late && action.progression < 1 }">
          <template v-if="action.progression >= 1">
            {{ $t("labels.state.done", 2) }}
          </template>
          <template v-else-if="late">
            {{ $t("courses.specimen.actions.to-finish-for", today ? 1 : 2, { named: { date: formatDate("medium")(action.end) } }) }} · {{ $t("labels.state.late") }}
          </template>
          <template v-else>
            {{ $t("courses.specimen.actions.to-finish-for", today ? 1 : 2, { named: { date: formatDate("medium")(action.end) } }) }}
          </template>
        </UiCardDescription>
      </UiCardHeader>

      <UiCardFooter class="px-0">
        <UiCircularProgress :model-value="action.progression * 100" />
      </UiCardFooter>
    </UiCard>
  </ActionActivityDialog>
</template>
