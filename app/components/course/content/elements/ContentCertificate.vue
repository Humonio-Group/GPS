<script setup lang="ts">
import type { Content } from "~/types/entities/course";

interface ContentCertificateProps {
  content: Content;
}
const props = defineProps<ContentCertificateProps>();

const activity = computed(() => props.content.activity.certificate!);
</script>

<template>
  <div class="w-full max-w-4xl mx-auto flex items-center justify-center gap-2">
    <UiDialog>
      <UiDialogTrigger as-child>
        <UiButton
          :variant="activity.main ? 'default' : 'outline'"
          :disabled="activity.disabled"
        >
          {{ activity.label }}
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent class="w-full max-w-[calc(100dvw-2rem)]! h-[calc(100dvh-2rem)] p-0">
        <UiPdfViewer
          class="size-full!"
          :source="content.activity.certificate!.url"
        />
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
