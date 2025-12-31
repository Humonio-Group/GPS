<script setup lang="ts">

</script>

<template>
  <UiCard class="flex-row px-6 gap-4 items-center">
    <div class="size-12 rounded-lg bg-primary/5 text-primary/50 grid place-items-center [&_>svg]:size-6">
      <slot name="icon" />
    </div>

    <UiCardHeader class="flex-1 px-0 flex flex-col">
      <UiCardTitle>
        <slot name="value" />
      </UiCardTitle>
      <UiCardDescription>
        <slot name="label" />
      </UiCardDescription>
    </UiCardHeader>
  </UiCard>
</template>
