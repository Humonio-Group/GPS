<script setup lang="ts">
import { Eye } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import { StatementFactory, XApiId } from "~/types/entities/xapi";

interface ContentLinkProps {
  content: Content;
}

const props = defineProps<ContentLinkProps>();
const store = useCoursesStore();

async function handleOpen(value: boolean) {
  if (!value) return;
  if (props.content.progress.value >= 1) return;

  const { statement, headers } = new StatementFactory(props.content).prepare({
    id: XApiId.COMPLETED,
    display: {
      "en-US": "completed",
      "fr-FR": "complété",
    },
  });
  await store.sendXAPIStatement(props.content.id, 1, statement, headers);
}
</script>

<template>
  <UiDialog @update:open="handleOpen">
    <UiDialogTrigger as-child>
      <UiButton
        class="@md:self-center"
        size="lg"
      >
        {{ $t("btn.open.link") }}
        <Eye />
      </UiButton>
    </UiDialogTrigger>
    <UiDialogContent class="w-full max-w-[calc(100dvw-2rem)]! h-[calc(100dvh-2rem)] overflow-hidden p-0">
      <iframe
        :src="content.activity.link"
        class="size-full block"
        allow="microphone; camera; autoplay; encrypted-media; fullscreen; picture-in-picture"
        frameborder="0"
      />
    </UiDialogContent>
  </UiDialog>
</template>
