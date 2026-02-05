<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

definePageMeta({
  layout: "authentication",
});

const store = useUserStore();
const { availableCompanies: companies } = storeToRefs(store);
</script>

<template>
  <PageRoot
    name="auth.portal"
    class="w-full max-w-4xl flex flex-col items-center gap-6"
  >
    <h1 class="text-center font-bold text-xl">
      {{ $t("Choisis ton espace de travail") }}
    </h1>

    <div class="flex items-center gap-3 flex-wrap">
      <UiButton
        v-for="company in companies"
        :key="company.alias"
        as-child
        variant="ghost"
        class="h-auto! flex-col text-base!"
      >
        <NuxtLinkLocale :to="`/${company.alias}/courses`">
          <UiAvatar class="size-16 rounded-lg">
            <UiAvatarImage
              v-if="company.icon"
              :src="company.icon"
            />
            <UiAvatarFallback>{{ company.name.substring(0, 2) }}</UiAvatarFallback>
          </UiAvatar>

          <p>{{ company.name }}</p>
        </NuxtLinkLocale>
      </UiButton>
    </div>
  </PageRoot>
</template>
