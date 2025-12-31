<script setup lang="ts">
import StageItemCompletionBadge from "~/components/course/stages/stage-elements/StageItemCompletionBadge.vue";
</script>

<template>
  <UiCollapsible>
    <UiCard class="p-0 gap-0 cursor-pointer">
      <UiCollapsibleTrigger as-child>
        <UiCardHeader class="flex flex-col-reverse @md:flex-row @md:items-center gap-2 @md:gap-4 p-6 justify-between">
          <div class="grid">
            <UiCardTitle class="truncate">
              <slot name="name" />
            </UiCardTitle>
            <UiCardDescription class="line-clamp-3">
              <slot name="description" />
            </UiCardDescription>
          </div>

          <StageItemCompletionBadge :contents="{}" />
        </UiCardHeader>
      </UiCollapsibleTrigger>
      <UiCollapsibleContent as-child>
        <UiCardContent class="p-6 pt-0 grid gap-2">
          <slot name="contents" />
        </UiCardContent>
      </UiCollapsibleContent>
    </UiCard>
  </UiCollapsible>
</template>
