<script setup lang="ts">
import type { People } from "~/types/entities/user";

interface TeacherCardProps {
  people: People;
  showCV?: boolean;
}

defineProps<TeacherCardProps>();
</script>

<template>
  <article class="flex items-center gap-3">
    <UiAvatar>
      <UiAvatarImage
        v-if="people.avatar"
        :src="people.avatar"
      />
      <UiAvatarFallback>{{ people.name.first[0] }}{{ people.name.last[0] }}</UiAvatarFallback>
    </UiAvatar>

    <div class="grid *:leading-none gap-0.5">
      <p class="font-medium">
        {{ people.name.full }}
      </p>
      <span
        v-if="false"
        class="text-sm text-muted-foreground"
      >{{ people.contact.email }}</span>
    </div>

    <UiBadge
      v-if="showCV"
      variant="outline"
      class="ml-auto"
    >
      CV
    </UiBadge>
  </article>
</template>
