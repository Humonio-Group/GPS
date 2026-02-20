<script setup lang="ts">
import type { Content, ContentComment } from "~/types/entities/course";
import CommentBubble from "~/components/course/content/comments/CommentBubble.vue";

interface CommentReportDialogProps {
  content: Content;
  comment: ContentComment;
}

defineProps<CommentReportDialogProps>();
const open = defineModel<boolean>("open", { default: false });

const store = useCoursesStore();
</script>

<template>
  <UiAlertDialog v-model:open="open">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>{{ $t("dialogs.report-comment.title") }}</UiAlertDialogTitle>
        <UiAlertDialogDescription>{{ $t("dialogs.report-comment.description") }}</UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <section class="px-4 border rounded-lg">
        <CommentBubble
          :content
          :comment
          :show-actions="false"
        />
      </section>

      <UiAlertDialogFooter>
        <UiAlertDialogCancel>{{ $t("btn.cancel") }}</UiAlertDialogCancel>
        <UiAlertDialogAction @click="store.reportComment(comment)">
          {{ $t("btn.report") }}
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
