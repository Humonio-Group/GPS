<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import { MessageCircle } from "lucide-vue-next";
import CommentBubble from "~/components/course/content/comments/CommentBubble.vue";
import ContentRating from "~/components/course/content/comments/ContentRating.vue";

interface CommentsDialogProps {
  content: Content;
}

const props = defineProps<CommentsDialogProps>();

const rateable = computed(() => props.content.permissions.rateable);
const commentable = computed(() => props.content.permissions.commentable);
const showSeparator = computed(() => rateable.value && commentable.value);
const comment = ref<string>("");

const store = useCoursesStore();
const adding = ref<boolean>(false);

const { handleChatShortcuts } = useKeyboard();

function commentEvent(event: KeyboardEvent) {
  handleChatShortcuts(event, async () => {
    const value = comment.value?.trim() ?? "";
    if (!value.length) return;

    adding.value = true;
    await store.createComment(props.content, comment.value);
    adding.value = false;
    comment.value = "";
  });
}
</script>

<template>
  <UiDrawer>
    <UiDrawerTrigger as-child>
      <UiButton
        variant="ghost"
        size="icon-sm"
      >
        <MessageCircle />
      </UiButton>
    </UiDrawerTrigger>
    <UiDrawerContent class="after:pointer-events-none!">
      <main class="max-h-full overflow-y-auto px-6 pt-4 pb-10">
        <div class="max-w-5xl mx-auto w-full grid gap-8">
          <section
            v-if="rateable"
            class="flex flex-col gap-2 items-center"
          >
            <p class="text-sm font-medium">
              {{ $t("reader.mark-content") }}
            </p>

            <ContentRating :content="content" />
          </section>

          <UiSeparator v-if="showSeparator" />

          <section
            v-if="commentable"
            class="flex flex-col gap-2"
          >
            <UiLabel
              class="text-sm font-medium"
              for="comment"
            >
              {{ $t("reader.comments.label") }} <span class="text-muted-foreground font-normal">({{ content.topic.comments.length >= 100 ? "99+" : content.topic.comments.length }})</span>
            </UiLabel>

            <UiTextarea
              id="comment"
              v-model="comment"
              :disabled="adding"
              :placeholder="$t('reader.comments.placeholder')"
              class="min-h-9 resize-none"
              @keydown="commentEvent"
            />

            <main class="mt-3 grid gap-2">
              <CommentBubble
                v-for="com in content.topic.comments"
                :key="com.id"
                :content="content"
                :comment="com"
              />
              <p
                v-if="!content.topic.comments.length"
                class="mt-3 text-muted-foreground text-sm"
              >
                {{ $t("reader.comments.empty") }}
              </p>
            </main>
          </section>
        </div>
      </main>
    </UiDrawerContent>
  </UiDrawer>
</template>
