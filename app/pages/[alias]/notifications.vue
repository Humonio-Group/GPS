<script setup lang="ts">
import { ArrowDown, BellOff } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import NotificationLine from "~/components/notifications/NotificationLine.vue";
import { EntityType } from "~/types/entities/entities";
import type { Nullable } from "~/types/primitives/objects";

const store = useNotificationStore();
const { notifications, canLoadMore, loading } = storeToRefs(store);

const selectedFilter = ref<Nullable<EntityType>>(null);
const filteredNotifications = computed(() => notifications.value.filter(n => n.data.type === selectedFilter.value || !selectedFilter.value));

store.loadNotifications();
</script>

<template>
  <PageRoot
    name="notifications"
    class="grid gap-6 mx-auto w-full max-w-3xl"
  >
    <header class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">
        {{ $t("notifications.title") }}
      </h1>

      <div class="flex items-center gap-1">
        <UiButton
          :variant="selectedFilter === null ? 'secondary' : 'outline'"
          @click="selectedFilter = null"
        >
          {{ $t("notifications.filters.all") }}
        </UiButton>
        <UiButton
          :variant="selectedFilter === EntityType.NOTIFICATION ? 'secondary' : 'outline'"
          @click="selectedFilter = EntityType.NOTIFICATION"
        >
          {{ $t("notifications.filters.notifications") }}
        </UiButton>
        <UiButton
          :variant="selectedFilter === EntityType.BADGE ? 'secondary' : 'outline'"
          @click="selectedFilter = EntityType.BADGE"
        >
          {{ $t("notifications.filters.badges") }}
        </UiButton>
        <UiButton
          :variant="selectedFilter === EntityType.CONTENT ? 'secondary' : 'outline'"
          @click="selectedFilter = EntityType.CONTENT"
        >
          {{ $t("notifications.filters.contents") }}
        </UiButton>
      </div>
    </header>

    <main class="grid gap-6">
      <template v-if="filteredNotifications.length">
        <div class="grid divide-y -mx-4 overflow-hidden rounded-lg">
          <NotificationLine
            v-for="notification in filteredNotifications"
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
