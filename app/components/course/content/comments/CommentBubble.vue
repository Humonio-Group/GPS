<script setup lang="ts">
import { Heart, Crown, Reply, Flag } from "lucide-vue-next";
import type { Content, ContentComment } from "~/types/entities/course";
import HeartFill from "~/components/icons/HeartFill.vue";
import { UserRole } from "~/types/entities/user";
import CommentReportDialog from "~/components/course/content/comments/CommentReportDialog.vue";

interface CommentBubbleProps {
  content: Content;
  comment: ContentComment;
  showActions?: boolean;
}

const props = withDefaults(defineProps<CommentBubbleProps>(), {
  showActions: true,
});
defineEmits<{
  select: [number];
}>();
const store = useCoursesStore();

const { user } = storeToRefs(useUserStore());
const reportDialogOpen = ref<boolean>(false);

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

        <span
          v-if="false"
          class="text-xs text-muted-foreground ml-auto"
        >
          il y a 3h
        </span> <!-- todo: bind createdAt date - loic -->
      </header>

      <main>
        <p class="whitespace-pre-line text-muted-foreground">
          {{ comment.content }}
        </p>
      </main>

      <footer
        v-if="showActions"
        class="flex items-center"
      >
        <UiTooltip v-if="!comment.replyTo">
          <UiTooltipTrigger as-child>
            <UiButton
              size="icon-sm"
              variant="ghost"
              class="-ml-2 px-2 text-muted-foreground!"
              @click="$emit('select', comment.id)"
            >
              <Reply />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent side="right">
            <p>{{ $t("reader.comments.reply") }}</p>
          </UiTooltipContent>
        </UiTooltip>
        <UiTooltip>
          <UiTooltipTrigger as-child>
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
          </UiTooltipTrigger>
          <UiTooltipContent side="right">
            <p>{{ $t("reader.comments.like") }}</p>
          </UiTooltipContent>
        </UiTooltip>
        <UiTooltip v-if="comment.author.id !== user!.id">
          <UiTooltipTrigger as-child>
            <UiButton
              variant="ghost"
              size="icon-sm"
              class="px-2 text-muted-foreground"
              @click="reportDialogOpen = true"
            >
              <Flag />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent side="right">
            <p>{{ $t("btn.report") }}</p>
          </UiTooltipContent>
        </UiTooltip>
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

    <CommentReportDialog
      v-if="showActions"
      v-model:open="reportDialogOpen"
      :content
      :comment
    />
  </section>
</template>
