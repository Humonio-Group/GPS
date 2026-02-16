<script setup lang="ts">
import { Heart, Crown } from "lucide-vue-next";
import type { Content, ContentComment } from "~/types/entities/course";
import HeartFill from "~/components/icons/HeartFill.vue";
import { UserRole } from "~/types/entities/user";

interface CommentBubbleProps {
  content: Content;
  comment: ContentComment;
}

const props = defineProps<CommentBubbleProps>();
defineEmits<{
  select: [number];
}>();
const store = useCoursesStore();

const liking = ref<boolean>(false);
const hasReplies = computed(() => !!props.comment.replies.length);

async function toggleLike() {
  liking.value = true;
  await store.likeComment(props.comment);
  liking.value = false;
}
</script>

<template>
  <section
    class="grid gap-2 py-3"
    :class="{ 'p-0': comment.replyTo }"
  >
    <article class="grid gap-2">
      <header class="relative flex items-center gap-2">
        <UiAvatar class="size-7">
          <UiAvatarImage
            v-if="comment.author.avatar"
            :src="comment.author.avatar"
          />
          <UiAvatarFallback>{{ comment.author.name.substring(0, 2) }}</UiAvatarFallback>
        </UiAvatar>

        <p class="text-sm font-medium">
          {{ comment.author.name }}
        </p>

        <UiTooltip v-if="comment.role !== UserRole.PARTICIPANT">
          <UiTooltipTrigger>
            <Crown class="size-3.5 text-primary" />
          </UiTooltipTrigger>
          <UiTooltipContent side="right">
            <p>{{ $t(`auth.roles.developer`) }}</p>
          </UiTooltipContent>
        </UiTooltip>

        <span class="text-xs text-muted-foreground ml-auto">
          il y a 3h
        </span>
      </header>

      <main>
        <p class="whitespace-pre-line text-muted-foreground">
          {{ comment.content }}
        </p>
      </main>

      <footer class="flex items-center">
        <UiButton
          v-if="!comment.replyTo"
          size="sm"
          variant="ghost"
          class="-ml-2 px-2 text-muted-foreground!"
          @click="$emit('select', comment.id)"
        >
          {{ $t("reader.comments.reply") }}
        </UiButton>
        <UiButton
          size="sm"
          variant="ghost"
          class="px-2 text-muted-foreground"
          :class="{ 'text-primary!': comment.liked, '-ml-2': comment.replyTo }"
          @click="toggleLike"
        >
          <HeartFill v-if="comment.liked" />
          <Heart v-else />

          {{ comment.stats.likes }}
        </UiButton>
      </footer>
    </article>

    <article
      v-if="hasReplies"
      class="grid gap-0"
    >
      <CommentBubble
        v-for="reply in comment.replies"
        :key="reply.id"
        :content="content"
        :comment="reply"
        class="pl-4"
      />
    </article>
  </section>
</template>
