<script setup lang="ts">
import type { TicketComment } from "~/types/entities/ticket";
import TicketAttachment from "~/components/support/elements/TicketAttachment.vue";

interface TicketMessageProps {
  comment: TicketComment;
}

const props = defineProps<TicketMessageProps>();

const { formatDate } = useDateUtils();
const { formatTime } = useTimeUtils();

const { user } = storeToRefs(useUserStore());

const isMe = computed(() => props.comment.sender.id === user.value!.id);
</script>

<template>
  <div
    class="relative flex gap-2 items-end max-w-2/3 group/text-message"
    :class="{ 'self-end': isMe }"
  >
    <UiAvatar
      class="mb-1"
      :class="{ 'order-1': isMe }"
    >
      <UiAvatarImage
        v-if="comment.sender.avatar"
        :src="comment.sender.avatar"
      />
      <UiAvatarFallback class="text-sm text-muted-foreground">
        {{ comment.sender.firstName[0] }}{{ comment.sender.lastName[0] }}
      </UiAvatarFallback>
    </UiAvatar>

    <div
      class="flex flex-col items-start gap-2"
      :class="{ 'items-end!': isMe }"
    >
      <div
        v-if="comment.attachments.length"
        class="flex flex-col gap-1"
      >
        <TicketAttachment
          v-for="(attachment, index) in comment.attachments"
          :key="`comment#${comment.id}-a#${index}`"
          :url="attachment"
        />
      </div>

      <p
        class="rounded-xl px-3 py-2 bg-accent text-accent-foreground whitespace-pre-wrap text-pretty"
        :class="{ 'bg-primary/25!': isMe }"
      >
        {{ comment.message }}
      </p>

      <span
        class="opacity-0 whitespace-nowrap pointer-events-none select-none group-hover/text-message:opacity-100 text-sm text-muted-foreground absolute top-full transition-opacity duration-75"
        :class="{ 'left-15': !isMe, 'right-15': isMe }"
      >
        {{ $t("labels.date-time.sent-at", { date: formatDate("medium")(comment.dates.createdAt), time: formatTime("short")(comment.dates.createdAt) }) }}
      </span>
    </div>
  </div>
</template>
