<script setup lang="ts">
import { BookDashed } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const { t } = useI18n();

const { company } = storeToRefs(useCompanyStore());

useHead({
  title: `${t("home.title")} - ${company.value!.name}`,
});
</script>

<template>
  <PageRoot class="text-sm text-muted-foreground">
    <UiEmpty>
      <UiEmptyHeader>
        <UiEmptyMedia variant="icon">
          <BookDashed />
        </UiEmptyMedia>
        <UiEmptyTitle>
          Oups...
        </UiEmptyTitle>
        <UiEmptyDescription>
          Pas encore développé...
        </UiEmptyDescription>
      </UiEmptyHeader>
    </UiEmpty>
  </PageRoot>
</template>
