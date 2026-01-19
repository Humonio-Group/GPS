<script setup lang="ts">
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";
import type { Term } from "~/types/entities/terms";

const { locale } = useI18n();

interface TermDialogProps {
  term: Term;
}

defineProps<TermDialogProps>();

const df = new Intl.DateTimeFormat(locale.value, {
  dateStyle: "medium",
  timeStyle: "short",
});
const open = defineModel<boolean>("open", { required: true });
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogContent class="max-h-[80dvh] max-w-4xl! overflow-y-auto">
      <MarkdownRenderer
        :content="term.description"
        use-markdown
      />

      <UiDialogFooter>
        <p class="text-sm text-muted-foreground">
          {{ $t("labels.time.last-update", { date: df.format(term.lastUpdate) }) }}
        </p>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
