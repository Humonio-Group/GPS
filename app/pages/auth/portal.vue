<script setup lang="ts">
import { ChevronRight, Search, X } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

definePageMeta({
  layout: "authentication",
});

const store = useUserStore();
const { availableCompanies } = storeToRefs(store);

const search = ref<string>("");
const companies = computed(() => availableCompanies.value.filter(c => sanitize(c.name).includes(sanitize(search.value || "")) || sanitize(c.alias).includes(sanitize(search.value || ""))));

const sanitize = (input: string): string => input.trim().toLowerCase();
</script>

<template>
  <PageRoot
    name="auth.portal"
    class="w-full max-w-4xl flex flex-col items-center gap-6"
  >
    <h1 class="text-center font-bold text-xl">
      {{ $t("auth.portal.title") }}
    </h1>

    <div class="flex flex-col gap-3 w-full max-w-xl">
      <div class="relative mb-4">
        <UiInput
          v-model="search"
          :placeholder="$t('labels.search')"
          class="pr-8"
        />
        <UiButton
          v-if="search.length"
          class="absolute top-1.75 right-1.75 size-6 rounded-full"
          size="icon-xs"
          variant="ghost"
          @click="search = ''"
        >
          <X />
        </UiButton>
        <Search
          v-else
          class="size-4 text-muted-foreground absolute top-2.5 right-2.5"
        />
      </div>
      <template v-if="companies.length">
        <template
          v-for="(company, index) in companies"
          :key="company.alias"
        >
          <UiSeparator v-if="index > 0" />
          <UiButton
            as-child
            variant="ghost"
            class="h-auto! text-lg!"
          >
            <NuxtLinkLocale :to="`/${company.alias}/`">
              <UiAvatar class="rounded-lg">
                <UiAvatarImage
                  v-if="company.icon"
                  :src="company.icon"
                />
                <UiAvatarFallback>{{ company.name.substring(0, 2) }}</UiAvatarFallback>
              </UiAvatar>

              <p>{{ company.name }}</p>

              <ChevronRight class="ml-auto" />
            </NuxtLinkLocale>
          </UiButton>
        </template>
      </template>
      <UiEmpty v-else-if="search.length">
        <UiEmptyHeader>
          <UiEmptyTitle>
            {{ $t("auth.portal.empty.title") }}
          </UiEmptyTitle>
          <UiEmptyDescription>
            {{ $t("auth.portal.empty.description") }}
          </UiEmptyDescription>
        </UiEmptyHeader>
      </UiEmpty>
    </div>
  </PageRoot>
</template>
