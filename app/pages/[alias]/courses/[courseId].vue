<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const store = useCoursesStore();
const { selectedCourse: course, loading } = storeToRefs(store);

store.selectCourse(Number(id.value));
</script>

<template>
  <PageRoot
    :name="`course.specimen.${id!}`"
    class="@container/course-page"
  >
    <div
      v-if="loading.specific.specimen"
      class="w-full grid place-items-center h-24"
    >
      <UiSpinner />
    </div>
    <template v-else>
      <header class="grid gap-4">
        <section class="flex flex-col-reverse @xl/course-page:flex-row gap-4">
          <article class="shrink-0 flex-1/2 flex flex-col gap-4 justify-between">
            <header>
              <h1 class="text-2xl font-black line-clamp-1">
                {{ course!.name }}
              </h1>
              <MarkdownRenderer
                :content="course!.program.description"
                class="text-muted-foreground text-sm"
              />
            </header>

            <footer class="flex items-center flex-wrap gap-2">
              <UiBadge variant="secondary">
                Application
              </UiBadge>
              <UiBadge variant="secondary">
                Prise en main
              </UiBadge>
            </footer> <!-- todo: program categories - loic -->
          </article>

          <aside class="w-full @md/course-page:max-w-64 @lg/course-page:max-w-80 @xl/course-page:max-w-96">
            <NuxtImg
              class="aspect-video object-cover object-center bg-muted rounded-lg"
              :src="course!.picture ?? course!.program.picture"
              :placeholder="[50, 50, 25, 75]"
            />
          </aside>
        </section>

        <nav class="flex items-center gap-2 overflow-x-auto">
          <UiButton
            as-child
            size="sm"
            variant="outline"
          >
            <NuxtLinkLocale
              :to="`/${alias!}/courses/${id!}`"
              exact-active-class="bg-accent!"
            >
              {{ $t("navigation.course.overview") }}
            </NuxtLinkLocale>
          </UiButton>
          <UiButton
            as-child
            size="sm"
            variant="outline"
          >
            <NuxtLinkLocale
              :to="`/${alias!}/courses/${id!}/peoples`"
              active-class="bg-accent!"
            >
              {{ $t("navigation.course.peoples") }}
            </NuxtLinkLocale>
          </UiButton>
          <UiButton
            as-child
            size="sm"
            variant="outline"
          >
            <NuxtLinkLocale
              :to="`/${alias!}/courses/${id!}/actions`"
              active-class="bg-accent!"
            >
              {{ $t("navigation.course.actions") }}
            </NuxtLinkLocale>
          </UiButton>
          <UiButton
            as-child
            size="sm"
            variant="outline"
          >
            <NuxtLinkLocale
              :to="`/${alias!}/courses/${id!}/results`"
              active-class="bg-accent!"
            >
              {{ $t("navigation.course.results") }}
            </NuxtLinkLocale>
          </UiButton>
        </nav>
      </header>

      <main class="py-4">
        <NuxtPage />
      </main>
    </template>
  </PageRoot>
</template>
