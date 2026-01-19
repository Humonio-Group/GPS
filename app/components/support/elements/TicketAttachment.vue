<script setup lang="ts">
interface TicketAttachmentProps {
  url: string;
}

defineProps<TicketAttachmentProps>();
</script>

<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <NuxtImg
        :src="url"
        class="max-w-80 max-h-80 rounded-xl block"
        :placeholer="[50, 50, 25, 75]"
      />
    </UiDialogTrigger>
    <UiDialogContent class="p-0 max-w-[calc(100%-2rem)]! max-h-[calc(100dvh-2rem)]">
      <NuxtImg
        :src="url"
        class="w-full max-h-full rounded-xl block"
        :placeholer="[50, 50, 25, 75]"
      />
    </UiDialogContent>
  </UiDialog>
</template>
