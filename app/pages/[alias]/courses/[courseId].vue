<script setup lang="ts">
import { Play } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";
import StageCollapsible from "~/components/course/stages/StageCollapsible.vue";

const { t } = useI18n();

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const store = useCoursesStore();
const { selectedCourse: course, availableStages: stages, loading } = storeToRefs(store);

watch(course, val => useHead({
  title: t("courses.specimen.overview.title", { name: val!.name }),
}), { immediate: true });

store.selectCourse(Number(id.value));

onMounted(async () => {
  store.loadStages().then();
});
</script>

<template>
  <PageRoot
    :name="`course.specimen.${id!}`"
    wrapper
    wrapper-class="max-w-4xl mx-auto @container/course-page! flex flex-col gap-4"
  >
    <div
      v-if="loading.specific.specimen"
      class="h-24 grid place-items-center"
    >
      <UiSpinner />
    </div>
    <template v-else>
      <header class="grid gap-4">
        <section class="flex flex-col gap-2">
          <aside class="relative w-full">
            <NuxtImg
              class="relative h-48 w-full rounded-lg"
              :src="course!.picture ?? course!.program.picture"
              :placeholder="[50, 50, 25, 75]"
            />
            <span class="absolute inset-0 block bg-linear-to-t from-background via-background/85 via-40% to-transparent" />

            <footer class="absolute top-4 left-4 flex items-center flex-wrap gap-2 max-w-2xl">
              <UiBadge variant="secondary">
                Application
              </UiBadge>
              <UiBadge variant="secondary">
                Prise en main
              </UiBadge>
            </footer> <!-- todo: program categories - loic -->
          </aside>

          <article class="px-4 shrink-0 gap-4 flex items-start justify-between">
            <header class="max-w-2xl">
              <h1 class="text-2xl font-black line-clamp-1">
                {{ course!.name }}
              </h1>
              <MarkdownRenderer
                :content="course!.program.description"
                class="text-muted-foreground text-sm *:mx-0! *:max-w-auto! line-clamp-4"
              />
            </header>

            <UiButton>
              Reprendre
              <Play />
            </UiButton>
          </article>
        </section>

        <nav
          v-if="false"
          class="flex items-center gap-2 overflow-x-auto"
        >
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
              :to="`/${alias!}/courses/${id!}/events`"
              active-class="bg-accent!"
            >
              {{ $t("navigation.course.events") }}
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
        </nav> <!-- todo: remove it if agree - loic -->
      </header>

      <main class="px-4 flex flex-col gap-4">
        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Objectifs pédagogiques
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Modalités
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Méthodes pédagogiques
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Évaluation et certificat
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Formateurs
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Participants
          </h3>
        </section>

        <UiSeparator />

        <section class="grid gap-2">
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Plan de formation
          </h3>

          <main class="grid gap-2">
            <StageCollapsible
              v-for="stage in stages"
              :key="`stage-${stage.id}`"
              :stage="stage"
            />

            <div
              v-if="loading.specific.stages"
              class="w-full h-24 grid place-items-center"
            >
              <UiSpinner />
            </div>
          </main>
        </section>

        <UiSeparator />

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Événements
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Communauté
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Résultats
          </h3>
        </section>

        <UiSeparator />

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Accessibilité
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Contact pédagogique
          </h3>
        </section>

        <section>
          <h3 class="text-sm text-muted-foreground uppercase font-semibold">
            Organisme de formation
          </h3>
        </section>

        <p class="text-xs text-muted-foreground text-center">
          Dernière mise à jour : 3 février 2026
        </p>
      </main>
    </template>
  </PageRoot>
</template>
