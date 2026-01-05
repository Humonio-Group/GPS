<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const { locale, t } = useI18n();

const store = useUserStore();
const { user } = storeToRefs(store);
const { company } = storeToRefs(useCompanyStore());

useHead({
  title: `${t("profile.title")} - ${company.value!.name}`,
});

const df = new Intl.DateTimeFormat(locale.value, {
  dateStyle: "medium",
});
</script>

<template>
  <PageRoot
    name="profile"
    class="flex flex-col gap-8 @container/profile"
  >
    <header class="flex flex-col items-center gap-4">
      <UiAvatar class="size-32">
        <UiAvatarImage
          v-if="user!.avatar"
          :src="user!.avatar"
        />
        <UiAvatarFallback>
          {{ user!.name.first[0] }}{{ user!.name.last[0] }}
        </UiAvatarFallback>
      </UiAvatar>

      <p class="text-3xl font-bold">
        {{ user!.name.full }}
      </p>
    </header>

    <main class="mx-auto w-full max-w-3xl flex flex-col gap-4">
      <ul class="grid *:py-3 divide-y">
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.first-name") }}</span>
          <p>{{ user!.name.first }}</p>
        </li>
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground">{{ $t("profile.last-name") }}</span>
          <p>{{ user!.name.last }}</p>
        </li>
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.email") }}</span>
          <p>{{ user!.contact.email }}</p>
        </li>
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.phone") }}</span>
          <p>{{ user!.contact.phone }}</p>
        </li>
        <li class="flex flex-col @md/profile:flex-row @md/profile:items-center @md/profile:justify-between @md/profile:gap-6">
          <span class="text-muted-foreground text-sm @md/profile:text-base">{{ $t("profile.linked-in") }}</span>
          <p>
            <NuxtLink
              :to="user!.social.linkedin"
              target="_blank"
              external
              class="underline-offset-4 hover:underline"
            >
              {{ user!.social.linkedin.replace("https://www.linkedin.com/in/", "@") }}
            </NuxtLink>
          </p>
        </li>
      </ul>
      <p class="text-sm text-muted-foreground self-center">
        {{ $t("profile.created-at", { date: df.format(user!.dates.creation) }) }}
      </p>
    </main>
  </PageRoot>
</template>
