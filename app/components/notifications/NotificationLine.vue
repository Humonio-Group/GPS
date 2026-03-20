<script setup lang="ts">
import {
  EventName,
  type Notification,
  type NotificationBadgeData,
  type NotificationContentData, type NotificationCustomMessageData,
} from "~/types/entities/notification";
import { EntityType } from "~/types/entities/entities";

interface NotificationLineProps {
  notification: Notification;
}

const props = defineProps<NotificationLineProps>();

const { alias } = useWorkspaceUtils();
const { relativeDate } = useDateUtils();
const store = useNotificationStore();

const detailsDialogOpen = ref<boolean>(false);

async function handleClick() {
  store.sendReadStatement(props.notification.id).then();

  switch (props.notification.data.type) {
    case EntityType.BADGE: {
      const data = props.notification.data as NotificationBadgeData;

      navigateTo(useLocalePath()(`/${alias.value}/reader/${data.courseId}/results`));
      break;
    }
    case EntityType.CONTENT: {
      const data = props.notification.data as NotificationContentData;

      navigateTo(useLocalePath()(`/${alias.value}/reader/${data.courseId}/${data.contentId}`));
      break;
    }
    case EntityType.NOTIFICATION: {
      detailsDialogOpen.value = true;
      break;
    }
  }
}
</script>

<template>
  <article
    class="py-3 px-4 flex items-start gap-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
    @click="handleClick"
  >
    <UiAvatar class="shrink-0 size-9 rounded-lg bg-primary">
      <UiAvatarImage
        v-if="notification.data.picture"
        :src="notification.data.picture"
      />
      <UiAvatarFallback class="bg-primary text-primary-foreground">
        {{ notification.title?.substring(0, 2) }}
      </UiAvatarFallback>
    </UiAvatar>

    <header class="flex-1 grid">
      <h3 class="text-sm font-semibold">
        {{ notification.title }}
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ notification.course.name }} · {{ notification.course.description }}
      </p>

      <span class="text-xs text-muted-foreground mt-3">
        {{ relativeDate(notification.dates.createdAt) }}
      </span>
    </header>

    <span
      v-if="!notification.dates.readAt"
      class="shrink-0 block size-2 rounded-full self-center bg-primary"
    />

    <UiDialog
      v-if="notification.event === EventName.CUSTOM_MESSAGE_SENT"
      v-model:open="detailsDialogOpen"
    >
      <UiDialogContent :show-close-button="false">
        <UiDialogHeader>
          <UiDialogTitle>
            {{ (notification.data as NotificationCustomMessageData).title }}
          </UiDialogTitle>
          <UiDialogDescription>
            {{ (notification.data as NotificationCustomMessageData).text }}
          </UiDialogDescription>
        </UiDialogHeader>

        <UiDialogFooter>
          <UiDialogClose as-child>
            <UiButton variant="secondary">
              {{ $t("btn.close.default") }}
            </UiButton>
          </UiDialogClose>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </article>
</template>
