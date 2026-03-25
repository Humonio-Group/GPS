<script setup lang="ts">
import { Play, RefreshCw } from "lucide-vue-next";
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

const isLoading = computed<{
  loadingProgram: boolean;
  loadingPeople: boolean;
  loadingStages: boolean;
  loadingContents: boolean;
}>(() => {
  const { specific } = loading.value;

  const loadingProgram = specific.specimen;
  const loadingPeople = specific.people;
  const loadingStages = specific.stages;
  const loadingContents = !!specific.stageContents.length && loadedContents.value.progress < 1;

  return {
    loadingProgram,
    loadingPeople,
    loadingStages,
    loadingContents,
  };
});
const loadedContents = computed<{
  loaded: number;
  total: number;
  progress: number;
}>(() => {
  if (!course.value) return {
    loaded: 0,
    total: 0,
    progress: 0,
  };

  const stages = course.value.stages.filter(stage => !stage.hidden);
  const total = stages.map(s => s.progress.total).reduce((acc, curr) => {
    acc += curr;
    return acc;
  }, 0);
  const loaded = stages.map(s => s.contents.length).reduce((acc, curr) => {
    acc += curr;
    return acc;
  }, 0);

  return {
    loaded,
    total,
    progress: Math.round((loaded / (total || 1)) * 100) / 100,
  };
});
const loadedElementsImages = computed<string[]>(() => {
  if (!course.value) return [];

  const participants = course.value.participants.filter(p => !!p.avatar).map(p => p.avatar!);
  const contents = course.value.stages.map(s => s.contents.reduce((acc, curr) => {
    if (!curr.picture) return acc;
    acc = [...acc, curr.picture];
    return acc;
  }, [] as string[])).reduce((acc, curr) => {
    acc = [...acc, ...curr];
    return acc;
  }, [] as string[]);

  return [...participants, ...contents];
});
const loadingProgress = computed<number>(() => {
  if (!course.value || course.value.id !== id.value) return 0;

  const stages = course.value.stages.length ? 1 : 0;
  const contents = loadedContents.value.progress * 4;
  const people = (course.value.participants.length || course.value.facilitators.length || !!course.value.manager) ? 1 : 0;

  const count = (stages + contents + people + 1) / 7;
  return Math.round(count * 100) / 100;
});

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
  if (!completed.value && started.value) return allContents.value.find(c => c.progress.viewed && c.progress.value < 1 && !c.locked) ?? allContents.value[0];
  return allContents.value[0];
});

onMounted(async () => {
  scrollContainer.value = document.querySelector("[data-slot='sidebar-inset']") as HTMLElement;

  await store.selectCourse(Number(id.value));

  await store.loadPeople();
  await store.loadStages();
});
</script>

<template>
  <PageRoot
    :name="`course.specimen.${id!}`"
    class="min-h-full"
    wrapper
    wrapper-class="@container/course-page! h-full flex flex-col gap-6"
  >
    <Transition
      name="loading"
      mode="out-in"
    >
      <div
        v-if="loadingProgress < 1"
        key="loadingCourse"
        class="flex-1 grid place-items-center px-6"
      >
        <div class="flex flex-col w-full max-w-lg gap-16">
          <UiIconCloud
            :images="loadedElementsImages"
            class="max-w-sm mx-auto"
          />

          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold truncate">
              {{ course?.name }}
            </h3>

            <UiProgress
              :model-value="loadingProgress"
              use-unit
            />

            <p class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw class="animate-spin size-3.5" />

              <template v-if="isLoading.loadingProgram">
                {{ $t("courses.loading.steps.course") }}
              </template>
              <template v-else-if="isLoading.loadingPeople">
                {{ $t("courses.loading.steps.people") }}
              </template>
              <template v-else-if="isLoading.loadingStages">
                {{ $t("courses.loading.steps.stages") }}
              </template>
              <template v-else-if="isLoading.loadingContents">
                {{ $t("courses.loading.steps.contents", { count: loadedContents.loaded, total: loadedContents.total }) }}
              </template>
            </p>
          </div>
        </div>
      </div>
      <div
        v-else-if="course"
        key="courseContent"
        class="pb-10 gap-10 flex flex-col relative @container"
      >
        <header class="grid gap-4 mb-6">
          <section class="flex flex-col gap-6">
            <aside class="relative w-full overflow-hidden">
              <Motion
                tag="div"
                :style="{ y: imageY }"
                class="relative h-128 w-full overflow-hidden"
              >
                <NuxtImg
                  class="h-full w-full object-cover"
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

            <article class=" max-w-4xl w-full mx-auto px-6 shrink-0 gap-4 flex items-start justify-between py-3">
              <header class="max-w-2xl grid gap-1.5">
                <h1 class="text-2xl font-black line-clamp-1">
                  {{ course!.name }}
                </h1>
                <MarkdownRenderer
                  :content="course!.program.description"
                  class="text-muted-foreground text-sm *:mx-0! *:max-w-auto! line-clamp-4"
                />
              </header>
            </article>
          </section>
        </header>

        <main class="max-w-4xl w-full mx-auto grid grid-cols-1 px-6 gap-12 @xl:grid-cols-2">
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

          <section class="grid gap-3 @xl:col-span-2">
            <h3 class="text-xs text-muted-foreground uppercase font-semibold">
              {{ $t("courses.specimen.overview.sections.learning-plan") }}
            </h3>

            <main class="grid gap-3">
              <StageCollapsible
                v-for="stage in stages"
                :key="`stage-${stage.id}`"
                :stage="stage"
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
        </main>

        <footer class="@container/footer fixed left-0 bottom-3 w-full px-3 flex justify-end">
          <div class="bg-background rounded-full w-full @2xl/footer:w-min">
            <UiButton
              v-if="nextContent"
              variant="outline"
              class="w-full @2xl/footer:w-min h-auto gap-8 justify-between p-4 pl-8 rounded-full! border-primary/50! shadow-2xl bg-primary/10 hover:bg-primary/15"
              as-child
            >
              <NuxtLinkLocale :to="`/${alias}/reader/${id}/${nextContent.id}`">
                <div class="flex flex-col *:leading-none gap-1">
                  <span class="text-primary uppercase text-xs! opacity-40">
                    <template v-if="completed">
                      {{ $t("btn.see-again") }}
                    </template>
                    <template v-else-if="started">
                      {{ $t("btn.resume") }}
                    </template>
                    <template v-else>
                      {{ $t("btn.start") }}
                    </template>
                  </span>

                  <p class="text-base!">
                    {{ nextContent.name }}
                  </p>

                  <span
                    v-if="nextContent.duration"
                    class="text-xs opacity-50"
                  >{{ $t("labels.time.short.minutes", { value: nextContent.duration }) }}</span>
                </div>

                <div class="grid aspect-square w-10 place-items-center bg-primary text-primary-foreground rounded-full">
                  <Play />
                </div>
              </NuxtLinkLocale>
            </UiButton>
          </div>
        </footer>

        <p
          v-if="course"
          class="@xl:col-span-2 text-xs text-muted-foreground text-center"
        >
          {{ $t("labels.date-time.last-update-at", { date: format(course!.program.dates.updatedAt, "d MMM yyyy", { locale: locales[locale]! }) }) }}
        </p>
      </div>
    </Transition>
  </PageRoot>
</template>

<style scoped>
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.25s ease;
  will-change: opacity;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

.loading-enter-to,
.loading-leave-from {
  opacity: 1;
}
</style>
