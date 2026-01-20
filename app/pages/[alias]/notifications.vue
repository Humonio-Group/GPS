<script setup lang="ts">
import { ArrowDown, BellOff } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import NotificationLine from "~/components/notifications/NotificationLine.vue";

const store = useNotificationStore();
const { notifications, canLoadMore, loading } = storeToRefs(store);

store.loadNotifications();
</script>

<template>
  <PageRoot
    name="notifications"
    class="grid gap-6 mx-auto w-full max-w-3xl"
  >
    <header>
      <h1 class="text-3xl font-bold">
        {{ $t("notifications.title") }}
      </h1>
    </header>

    <main class="grid gap-6">
      <template v-if="notifications.length">
        <div class="grid divide-y -mx-4 overflow-hidden rounded-lg">
          <NotificationLine
            v-for="notification in notifications"
            :key="`notification#${notification.id}`"
            :notification="notification"
          />
        </div>

        <div class="py-2 flex justify-center">
          <UiButton
            v-if="canLoadMore"
            variant="outline"
            :disabled="loading.list"
            @click="store.loadNotifications()"
          >
            {{ $t("btn.load.following") }}
            <UiSpinner v-if="loading.list" />
            <ArrowDown v-else />
          </UiButton>
        </div>
      </template>
      <UiEmpty v-else-if="!loading.list">
        <UiEmptyHeader>
          <UiEmptyMedia variant="icon">
            <BellOff class="text-muted-foreground" />
          </UiEmptyMedia>
          <UiEmptyTitle>
            {{ $t("notifications.empty.title") }}
          </UiEmptyTitle>
          <UiEmptyDescription>
            {{ $t("notifications.empty.description") }}
          </UiEmptyDescription>
        </UiEmptyHeader>
      </UiEmpty>
      <div
        v-else
        class="grid place-items-center h-24"
      >
        <UiSpinner />
      </div>
    </main>
  </PageRoot>
</template>
