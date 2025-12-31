<script setup lang="ts">
import { BookDashed } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const { alias } = useWorkspaceUtils();
</script>

<template>
  <PageRoot
    name="courses.home"
    class="text-sm text-muted-foreground"
  >
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

      <UiEmptyContent>
        <UiButton as-child>
          <NuxtLinkLocale :to="`/${alias}/courses/123`">
            First Course
          </NuxtLinkLocale>
        </UiButton>
      </UiEmptyContent>
    </UiEmpty>
  </PageRoot>
</template>
