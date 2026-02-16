<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import { MessageCircle, X } from "lucide-vue-next";
import CommentBubble from "~/components/course/content/comments/CommentBubble.vue";
import type { Nullable } from "~/types/primitives/objects";

interface CommentsDialogProps {
  content: Content;
}

const props = defineProps<CommentsDialogProps>();

const comment = ref<string>("");
const replyTo = ref<Nullable<number>>(null);
const commentReplyingTo = computed(() => props.content.topic.comments.find(c => c.id === (replyTo.value ?? -1)) ?? null);

const store = useCoursesStore();
const adding = ref<boolean>(false);

const { handleChatShortcuts } = useKeyboard();

function commentEvent(event: KeyboardEvent) {
  handleChatShortcuts(event, async () => {
    const value = comment.value?.trim() ?? "";
    if (!value.length) return;

    adding.value = true;
    await store.createComment(props.content, comment.value, commentReplyingTo.value ?? undefined);
    if (replyTo.value !== null) replyTo.value = null;
    adding.value = false;
    comment.value = "";
  });
}
</script>

<template>
  <UiSheet>
    <UiSheetTrigger as-child>
      <UiButton
        variant="ghost"
        size="icon-sm"
      >
        <MessageCircle />
      </UiButton>
    </UiSheetTrigger>
    <UiSheetContent class="max-w-2xl!">
      <UiSheetHeader class="flex flex-col pb-0">
        <UiSheetTitle>
          {{ $t("reader.comments.label") }} <span class="text-muted-foreground font-normal">({{ content.topic.comments.length >= 100 ? "99+" : content.topic.comments.length }})</span>
        </UiSheetTitle>
      </UiSheetHeader>

      <div class="shrink-0 px-4">
        <div class="p-5 rounded-lg bg-primary/10 dark:bg-primary/15 flex items-start gap-2">
          <MessageCircle class="text-primary size-4" />

          <p class="text-muted-foreground text-sm leading-tight opacity-65">
            Posez vos questions ou échangez avec vos pairs sur cette activité
          </p>
        </div>
      </div>

      <div class="px-4 min-h-0 flex-1 overflow-y-auto">
        <main class="flex-1 min-h-0 grid auto-rows-min divide-y gap-2">
          <CommentBubble
            v-for="com in content.topic.comments"
            :key="com.id"
            :content="content"
            :comment="com"
            @select="replyTo = $event"
          />
          <p
            v-if="!content.topic.comments.length"
            class="mt-3 text-muted-foreground text-sm"
          >
            {{ $t("reader.comments.empty") }}
          </p>
        </main>

        <div class="sticky bottom-0 isolate py-4 bg-background">
          <div
            v-if="commentReplyingTo"
            class="flex items-start p-3 pb-4 -mb-1.5 bg-accent text-accent-foreground border-x border-t rounded-t-md -z-10"
          >
            <div class="flex-1 grid auto-rows-min">
              <p class="text-xs font-semibold text-muted-foreground">
                {{ commentReplyingTo.author.name }}
              </p>
              <p class="truncate text-sm">
                {{ commentReplyingTo.content }}
              </p>
            </div>

            <UiButton
              variant="ghost"
              size="icon-xs"
              class="shrink-0"
              @click="replyTo = null"
            >
              <X />
            </UiButton>
          </div>
          <UiTextarea
            id="comment"
            v-model="comment"
            :disabled="adding"
            :placeholder="$t('reader.comments.placeholder')"
            class="min-h-9 resize-none bg-background! disabled:opacity-100! disabled:text-current/50"
            @keydown="commentEvent"
          />
        </div>
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
