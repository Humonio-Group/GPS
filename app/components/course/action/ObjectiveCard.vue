<script setup lang="ts">
import { TrendingUp, Zap, Settings, Wrench } from "lucide-vue-next";
import { type Objective, ObjectiveSection } from "~/types/entities/action";

interface ObjectiveCardProps {
  objective: Objective;
}

defineProps<ObjectiveCardProps>();
</script>

<template>
  <UiCard class="p-4 gap-3 flex-row">
    <TrendingUp
      v-if="objective.section === ObjectiveSection.OBJECTIVE"
      class="size-4 text-muted-foreground"
    />
    <Zap
      v-else-if="objective.section === ObjectiveSection.IMPACT"
      class="size-4 text-muted-foreground"
    />
    <Settings
      v-else-if="objective.section === ObjectiveSection.DO"
      class="size-4 text-muted-foreground"
    />
    <Wrench
      v-else-if="objective.section === ObjectiveSection.LEARN"
      class="size-4 text-muted-foreground"
    />

    <UiCardHeader class="flex-1 px-0">
      <UiCardTitle>{{ objective.name }}</UiCardTitle>
      <UiCardDescription>{{ objective.description }}</UiCardDescription>
    </UiCardHeader>
  </UiCard>
</template>
