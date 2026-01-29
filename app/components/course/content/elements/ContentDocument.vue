<script setup lang="ts">
import { Eye } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";

interface ContentDocumentProps {
  content: Content;
}

defineProps<ContentDocumentProps>();
</script>

<template>
  <UiCard class="w-full mx-auto max-w-4xl">
    <UiCardContent class="flex items-center justify-between">
      <p class="truncate text-muted-foreground">
        {{ content.activity.document!.name }}
      </p>

      <div class="flex items-center gap-1">
        <UiDialog>
          <UiDialogTrigger as-child>
            <UiButton
              size="icon"
              variant="outline"
            >
              <Eye />
            </UiButton>
          </UiDialogTrigger>
          <UiDialogContent class="max-w-[calc(100dvw-2rem)]! w-full h-[calc(100dvh-2rem)] p-0">
            <UiPdfViewer
              class="size-full!"
              :source="content.activity.document!.url"
              :allow-print="content.activity.document!.permissions.download"
              :allow-download="content.activity.document!.permissions.download"
              :allow-zoom="content.activity.document!.permissions.zoom"
            />
          </UiDialogContent>
        </UiDialog>
      </div>
    </UiCardContent>
  </UiCard>
</template>
