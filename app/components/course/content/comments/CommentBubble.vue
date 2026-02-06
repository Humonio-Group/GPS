<script setup lang="ts">
import { Heart, Copy, Check, MoreHorizontal, Crown } from "lucide-vue-next";
import type { Content, ContentComment } from "~/types/entities/course";
import { useClipboard } from "@vueuse/core";

interface CommentBubbleProps {
  content: Content;
  comment: ContentComment;
}

const props = defineProps<CommentBubbleProps>();
const store = useCoursesStore();

const open = ref<boolean>(false);
const liking = ref<boolean>(false);
const replying = ref<boolean>(false);
const replyMessage = ref<string>("");
const hasReplies = computed(() => !!props.comment.replies.length);

const { handleChatShortcuts } = useKeyboard();
const { copy, copied } = useClipboard();

async function toggleLike() {
  liking.value = true;
  await store.likeComment(props.comment);
  liking.value = false;
}
function sendReply(event: KeyboardEvent) {
  handleChatShortcuts(event, async () => {
    const value = replyMessage.value.trim();
    if (!value.length) return;

    replying.value = true;
    await store.createComment(props.content, value, props.comment);
    replying.value = false;
    replyMessage.value = "";
  });
}
</script>

<template>
  <article class="flex flex-col">
    <UiCollapsible
      v-model:open="open"
      class="grid gap-2"
    >
      <header class="flex gap-2">
        <div class="pt-1">
          <UiAvatar>
            <UiAvatarImage
              v-if="comment.author.avatar?.length"
              :src="comment.author.avatar"
            />
            <UiAvatarFallback>
              {{ comment.author.name.substring(0, 2) }}
            </UiAvatarFallback>
          </UiAvatar>
        </div>

        <div class="flex flex-col items-start gap-1">
          <div class="group/context flex items-center gap-3">
            <div class="px-4 py-3 flex flex-col items-start bg-accent text-accent-foreground w-max rounded-2xl">
              <span class="text-xs text-muted-foreground font-medium flex items-center gap-2 [&_>svg]:size-3.5 [&_>svg]:text-primary">{{ comment.author.name }} <Crown v-if="comment.admin" /></span>
              <p class="whitespace-pre-line">
                {{ comment.content }}
              </p>
            </div>
            <UiDropdownMenu>
              <UiDropdownMenuTrigger as-child>
                <UiButton
                  variant="ghost"
                  size="icon-sm"
                  class="opacity-0 group-hover/context:opacity-100 transition-opacity duration-100 text-muted-foreground!"
                >
                  <MoreHorizontal />
                </UiButton>
              </UiDropdownMenuTrigger>
              <UiDropdownMenuContent>
                <UiDropdownMenuItem @click="copy(comment.content)">
                  <Check v-if="copied" />
                  <Copy v-else />
                  {{ copied ? $t("labels.copied", 1) : $t("btn.copy.default") }}
                </UiDropdownMenuItem>
              </UiDropdownMenuContent>
            </UiDropdownMenu>
          </div>

          <div class="flex items-center">
            <UiButton
              variant="ghost"
              size="sm"
              :class="{ 'text-primary!': comment.liked }"
              :disabled="liking"
              @click="toggleLike"
            >
              <Heart />
              {{ comment.stats.likes || 0 }}
            </UiButton>
            <UiCollapsibleTrigger as-child>
              <UiButton
                v-if="hasReplies"
                variant="ghost"
                size="sm"
                class="text-muted-foreground!"
              >
                {{ $t(`reader.comments.replies.${open ? "hide" : "show"}`) }} ({{ comment.replies.length }})
              </UiButton>
              <UiButton
                v-else-if="!comment.replyTo"
                variant="ghost"
                size="sm"
                class="text-muted-foreground!"
              >
                {{ $t("reader.comments.reply") }}
              </UiButton>
            </UiCollapsibleTrigger>
          </div>
        </div>
      </header>

      <UiCollapsibleContent v-if="!comment.replyTo">
        <div class="grid gap-2 pl-10">
          <UiTextarea
            v-model="replyMessage"
            :placeholder="$t('reader.comments.placeholder')"
            :disabled="replying"
            class="min-h-9 resize-none"
            @keydown="sendReply"
          />

          <CommentBubble
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :content="content"
          />
        </div>
      </UiCollapsibleContent>
    </UiCollapsible>
  </article>
</template>
