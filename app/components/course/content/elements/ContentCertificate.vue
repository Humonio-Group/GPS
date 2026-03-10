<script setup lang="ts">
import { X } from "lucide-vue-next";
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
      <UiDialogContent
        :show-close-button="false"
        class="w-full max-w-[calc(100dvw-2rem)]! h-[calc(100dvh-2rem)] p-0"
      >
        <UiPdfViewer
          class="size-full!"
          :source="content.activity.certificate!.url"
        />

        <UiDialogClose as-child>
          <UiButton
            variant="secondary"
            class="absolute bottom-4 right-4"
          >
            <X />
            {{ $t("btn.close.default") }}
          </UiButton>
        </UiDialogClose>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
