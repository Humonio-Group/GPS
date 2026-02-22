<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import TermDialog from "~/components/settings/terms/TermDialog.vue";

const { t } = useI18n();

definePageMeta({
  layout: "authentication",
});

useHead({
  title: t(""),
});

const store = useTermStore();
const { terms, loading } = storeToRefs(store);

const acceptedTerms = ref<number[]>([]);

store.fetchTermsToApprove();

function updateTermStatus(id: number) {
  if (acceptedTerms.value.includes(id)) acceptedTerms.value.splice(acceptedTerms.value.indexOf(id), 1);
  else acceptedTerms.value.push(id);
}
function selectAll() {
  acceptedTerms.value = terms.value.reduce((acc, cur) => {
    acc = [...acc, cur.id];
    return acc;
  }, [] as number[]);
}
function deselectAll() {
  acceptedTerms.value = [];
}
function handleAllCheck() {
  if (acceptedTerms.value.length === terms.value.length) deselectAll();
  else selectAll();
}
async function submit() {
  await store.acceptTerms(...acceptedTerms.value);
}
</script>

<template>
  <PageRoot
    name="auth.terms"
    class="flex w-full"
    wrapper
    wrapper-class="@container/profile-settings max-w-4xl mx-auto w-full grid gap-6"
  >
    <header class="grid gap-1.5 max-w-[55ch]">
      <h1 class="text-3xl font-extrabold">
        {{ $t("auth.terms.title") }}
      </h1>

      <p class="text-sm text-muted-foreground max-w-[55ch]">
        {{ $t("auth.terms.description") }}
      </p>
    </header>

    <main
      v-if="loading.items"
      class="grid gap-2"
    >
      <UiSkeleton
        v-for="i in (Math.floor(Math.random() * 3) + 1)"
        :key="`sk-item-${i}`"
        class="h-12 rounded-lg"
      />
    </main>
    <main
      v-else
      class="grid gap-2"
    >
      <div
        v-for="term in terms"
        :key="term.id"
        class="flex items-center gap-2 p-2 pl-3 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors duration-75"
      >
        <UiLabel class="text-base! flex items-center gap-2 flex-1 truncate cursor-pointer">
          <UiCheckbox
            :model-value="acceptedTerms.includes(term.id)"
            class="size-5"
            @update:model-value="updateTermStatus(term.id)"
          />
          {{ term.name }}
        </UiLabel>
        <TermDialog
          :term="term"
          :open="false"
          trigger
        >
          <UiButton
            size="sm"
            variant="outline"
          >
            {{ $t("btn.read") }}
          </UiButton>
        </TermDialog>
      </div>

      <UiSeparator />

      <UiLabel
        class="text-base! flex-1 cursor-pointer flex items-center gap-2 p-3 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors duration-75"
      >
        <UiCheckbox
          :model-value="acceptedTerms.length === terms.length"
          class="size-5"
          @update:model-value="handleAllCheck"
        />

        {{ $t("labels.accept-all-terms") }}
      </UiLabel>
    </main>

    <footer
      v-if="!loading.items"
      class="flex justify-end"
    >
      <UiButton
        :disabled="acceptedTerms.length !== terms.length || loading.saving"
        @click="submit"
      >
        {{ $t("btn.save") }}
        <UiSpinner v-if="loading.saving" />
      </UiButton>
    </footer>
  </PageRoot>
</template>
