<script setup lang="ts">
import { Play } from "lucide-vue-next";
import { format } from "date-fns";
import * as locales from "date-fns/locale";
import { Motion, useScroll, useTransform } from "motion-v";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";
import StageCollapsible from "~/components/course/stages/StageCollapsible.vue";
import PeopleSection from "~/components/course/overview/sections/people/PeopleSection.vue";
import type { Nullable } from "~/types/primitives/objects";

const { t, locale } = useI18n();

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const store = useCoursesStore();
const { selectedCourse: course, availableStages: stages, allContents, loading } = storeToRefs(store);

const scrollContainer = ref<HTMLElement | null>(null);
const { scrollY } = useScroll({ container: scrollContainer });
const imageY = useTransform(scrollY, [0, 500], [0, 400]);

const selectedObjectiveId = ref<Nullable<number>>(null);
const selectedObjective = computed(() => course.value?.program.objectives.find(o => o.id === selectedObjectiveId.value) ?? null);
function selectObjective(objectiveId: number) {
  if (selectedObjectiveId.value === objectiveId) {
    selectedObjectiveId.value = null;
    return;
  }
  selectedObjectiveId.value = objectiveId;
}

watch(course, val => useHead({
  title: t("courses.specimen.overview.title", { name: val!.name }),
}), { immediate: true });

const completed = computed(() => allContents.value.every(c => c.progress.value >= 1));
const started = computed(() => allContents.value.some(c => c.progress.viewed));
const nextContent = computed(() => {
  if (completed.value) return allContents.value[0];
  return allContents.value.find(c => c.progress.viewed && c.progress.value < 1 && !c.locked);
});

onMounted(() => {
  scrollContainer.value = document.querySelector("[data-slot='sidebar-inset']") as HTMLElement;

  store.selectCourse(Number(id.value));

  store.loadStages();
});
</script>

<template>
  <PageRoot
    :name="`course.specimen.${id!}`"
    class="pb-8"
    wrapper
    wrapper-class="@container/course-page! flex flex-col gap-6"
  >
    <div
      v-if="loading.specific.specimen"
      class="h-24 grid place-items-center"
    >
      <UiSpinner />
    </div>
    <template v-else-if="course">
      <header class="grid gap-4">
        <section class="flex flex-col gap-6">
          <aside class="relative w-full overflow-hidden">
            <Motion
              tag="div"
              :style="{ y: imageY }"
              class="relative h-128 w-full overflow-hidden"
            >
              <NuxtImg
                class="h-full w-full object-cover rounded-3xl"
                :src="course!.picture ?? course!.program.picture"
                :placeholder="[50, 50, 25, 75]"
              />
            </Motion>

            <footer
              v-if="false"
              class="absolute top-4 left-4 flex items-center flex-wrap gap-2 max-w-2xl"
            >
              <UiBadge variant="secondary">
                Application
              </UiBadge>
              <UiBadge variant="secondary">
                Prise en main
              </UiBadge>
            </footer> <!-- todo: program categories - loic -->
          </aside>

          <article class=" max-w-4xl w-full mx-auto px-4 shrink-0 gap-4 flex items-start justify-between">
            <header class="max-w-2xl">
              <p class="text-xs text-muted-foreground">
                {{ course!.description }}
              </p>
              <h1 class="text-2xl font-black line-clamp-1">
                {{ course!.name }}
              </h1>
              <MarkdownRenderer
                :content="course!.program.description"
                class="text-muted-foreground text-sm *:mx-0! *:max-w-auto! line-clamp-4"
              />
            </header>

            <UiSkeleton
              v-if="loading.specific.stages || loading.specific.stageContents.length"
              class="h-9.5 w-[15ch]"
            />
            <UiButton
              v-else
              as-child
            >
              <NuxtLinkLocale :to="`/${alias}/reader/${id}/${nextContent?.id}`">
                <template v-if="completed">
                  {{ $t("btn.see-again") }}
                </template>
                <template v-else-if="started">
                  {{ $t("btn.resume") }}
                </template>
                <template v-else>
                  {{ $t("btn.start") }}
                </template>
                <Play />
              </NuxtLinkLocale>
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

      <main class="@container max-w-4xl w-full mx-auto px-4 grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <section class="@xl:col-span-2 grid gap-2">
          <h3 class="text-xs text-muted-foreground uppercase font-semibold">
            {{ $t("courses.specimen.overview.sections.objectives") }}
          </h3>

          <main class="flex flex-wrap gap-2">
            <UiButton
              v-for="objective in course.program.objectives"
              :key="`objective-${objective.id}`"
              variant="outline"
              size="sm"
              :class="{ 'border-primary! bg-primary/15 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/25': selectedObjectiveId === objective.id }"
              @click="selectObjective(objective.id)"
            >
              {{ objective.name }}
            </UiButton>
          </main>

          <footer
            v-if="selectedObjective"
            class="p-4 border rounded-lg bg-card text-card-foreground text-sm font-semibold"
          >
            <MarkdownRenderer
              :content="selectedObjective.description"
              use-markdown
            />
          </footer>
        </section>

        <template v-if="false">
          <section>
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.modalities") }}
            </h3>
          </section>

          <section>
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.methods") }}
            </h3>
          </section>

          <section class="@xl:col-span-2">
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.evaluation") }}
            </h3>
          </section>
        </template>

        <PeopleSection class="@xl:col-span-2" />

        <UiSeparator class="@xl:col-span-2" />

        <section class="grid gap-2 @xl:col-span-2">
          <h3 class="text-xs text-muted-foreground uppercase font-semibold">
            {{ $t("courses.specimen.overview.sections.learning-plan") }}
          </h3>

          <main class="grid gap-2">
            <template v-if="!stages.length && loading.specific.stages">
              <UiSkeleton
                v-for="i in (Math.floor(Math.random() * 4) + 1)"
                :key="i"
                class="h-18 w-full"
              />
            </template>
            <StageCollapsible
              v-for="stage in stages"
              v-else
              :key="`stage-${stage.id}`"
              :stage="stage"
            />

            <UiSkeleton
              v-if="loading.specific.stages"
              class="h-18 w-full"
            />
          </main>
        </section>

        <template v-if="false">
          <UiSeparator class="@xl:col-span-2" />

          <section>
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.events") }}
            </h3>
          </section>

          <section>
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.community") }}
            </h3>
          </section>

          <section class="@xl:col-span-2">
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.results") }}
            </h3>
          </section>

          <UiSeparator class="@xl:col-span-2" />

          <section>
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.accessibility") }}
            </h3>
          </section>

          <section>
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.contact") }}
            </h3>
          </section>

          <section>
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.company") }}
            </h3>
          </section>
        </template>

        <p
          v-if="course"
          class="@xl:col-span-2 text-xs text-muted-foreground text-center"
        >
          {{ $t("labels.date-time.last-update-at", { date: format(course!.program.dates.updatedAt, "d MMM yyyy", { locale: locales[locale]! }) }) }}
        </p>
      </main>
    </template>
  </PageRoot>
</template>
