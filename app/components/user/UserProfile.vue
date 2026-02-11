<script setup lang="ts">
import { Edit2 } from "lucide-vue-next";
import type { People, User } from "~/types/entities/user";

interface UserProfileProps {
  user: User | People;
}

const props = defineProps<UserProfileProps>();
const { user: me } = storeToRefs(useUserStore());
const { alias } = useWorkspaceUtils();

const { formatDate } = useDateUtils();
const isMe = computed(() => me.value?.id === props.user?.id);
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col items-center gap-4">
      <UiAvatar class="size-32">
        <UiAvatarImage
          v-if="user.avatar"
          :src="user.avatar"
        />
        <UiAvatarFallback>
          {{ user.name.first[0] }}{{ user.name.last[0] }}
        </UiAvatarFallback>
      </UiAvatar>

      <div class="flex items-center gap-2">
        <p class="text-3xl font-bold">
          {{ user.name.full }}
        </p>

        <UiButton
          v-if="isMe"
          variant="ghost"
          size="icon-sm"
          as-child
        >
          <NuxtLinkLocale :to="`/${alias}/profile/settings`">
            <Edit2 />
          </NuxtLinkLocale>
        </UiButton>
      </div>
    </header>

    <main class="mx-auto w-full max-w-3xl flex flex-col gap-4">
      <ul class="grid *:py-3 divide-y">
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.details.first-name") }}</span>
          <p>{{ user.name.first }}</p>
        </li>
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground">{{ $t("profile.details.last-name") }}</span>
          <p>{{ user.name.last }}</p>
        </li>
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.details.email") }}</span>
          <p>
            <NuxtLink
              :to="`mailto:${user.contact.email}`"
              target="_blank"
              external
              class="underline-offset-4 hover:underline"
            >
              {{ user.contact.email }}
            </NuxtLink>
          </p>
        </li>
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.details.phone") }}</span>
          <p>
            <NuxtLink
              v-if="user.contact.phone"
              :to="`tel:${user.contact.phone}`"
              target="_blank"
              external
              class="underline-offset-4 hover:underline"
            >
              {{ user.contact.phone }}
            </NuxtLink>
            <template v-else>
              -
            </template>
          </p>
        </li>
        <li
          v-if="user.social.linkedin"
          class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6"
        >
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.details.linked-in") }}</span>
          <p>
            <NuxtLink
              :to="user.social.linkedin"
              target="_blank"
              external
              class="underline-offset-4 hover:underline"
            >
              {{ user.social.linkedin?.replace("https://www.linkedin.com/in/", "@") }}
            </NuxtLink>
          </p>
        </li>
      </ul>
      <p
        v-if="Object.keys(user).includes('dates')"
        class="text-sm text-muted-foreground self-center"
      >
        {{ $t("profile.details.created-at", { date: formatDate("medium")((user as User).dates.creation) }) }}
      </p>
    </main>
  </div>
</template>
