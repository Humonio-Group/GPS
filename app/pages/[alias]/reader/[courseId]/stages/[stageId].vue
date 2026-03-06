<script setup lang="ts">
import { Play } from "lucide-vue-next";
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import type { Content } from "~/types/entities/course";

const route = useRoute();
const stageId = computed(() => Number(route.params.stageId || -1));
const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();

const store = useCoursesStore();
const { availableStages: stages, loading } = storeToRefs(store);
const stage = computed(() => stages.value.find(s => s.id === stageId.value));
const duration = computed(() => stage.value!.contents.filter(c => (c.duration ?? 0) > 0).reduce((acc, content) => {
  acc += content.duration!;
  return acc;
}, 0) - stage.value!.contents.filter(c => (c.duration ?? 0) > 0 && c.progress.value >= 1).reduce((acc, content) => {
  acc += content.duration!;
  return acc;
}, 0));

const started = computed(() => stage.value?.contents.some(c => c.progress.viewed));
const completed = computed(() => stage.value?.progress.completed === stage.value?.progress.total);
const nextContent = computed(() => {
  let nextContent: Content = stage.value!.contents[0]!;
  if (started.value && !completed.value) nextContent = stage.value!.contents.filter(c => c.progress.value < 1)[0]!;

  return `/${alias.value}/reader/${id.value}/${nextContent.id}`;
});

const { fromMinutes } = useTimeUtils();

const variants = [
  "from-cyan-500 dark:from-cyan-300",
  "from-yellow-500 dark:from-yellow-300",
  "from-red-500 dark:from-red-300",
  "from-green-500 dark:from-green-300",
  "from-purple-500 dark:from-purple-300",
];

function randomVariant() {
  return variants[Math.floor(Math.random() * variants.length)];
}
</script>

<template>
  <PageRoot :name="`reader.stage.${stage?.name}`">
    <div
      v-if="!stage && loading.specific.stages"
      class="h-24 grid place-items-center"
    >
      <UiSpinner />
    </div>
    <template v-else-if="stage">
      <div class="relative isolate h-[55dvh] @md:h-[65dvh] w-full rounded-2xl overflow-hidden">
        <NuxtImg
          v-if="stage.picture"
          class="size-full object-cover"
          :src="stage.picture"
        />
        <span
          v-else
          class="block size-full bg-radial-[at_100%_-35%] bg-size-[150%] to-transparent to-90%"
          :class="randomVariant()"
        />
      </div>

      <main class="px-8">
        <header class="flex flex-col py-8">
          <div class="flex items-center justify-between">
            <div class="overflow-hidden">
              <span class="block h-1 rounded-full w-12 bg-primary mb-2" />
              <h2 class="text-3xl font-bold line-clamp-2 break-all">
                {{ stage.name }}
              </h2>
              <p class="whitespace-pre-line text-pretty text-muted-foreground break-all">
                {{ stage.description }}
              </p>
            </div>

            <UiButton as-child>
              <NuxtLinkLocale :to="nextContent">
                <span v-if="completed">{{ $t("btn.see-again") }}</span>
                <span v-else-if="started">{{ $t("btn.resume") }}</span>
                <span v-else>{{ $t("btn.start") }}</span>

                <Play />
              </NuxtLinkLocale>
            </UiButton>
          </div>

          <div class="mt-3 flex items-center flex-wrap gap-2">
            <UiBadge variant="outline">
              {{ $t("labels.content-type.e-learning") }}
            </UiBadge>

            <UiBadge v-if="completed">
              {{ $t("labels.state.completed") }}
            </UiBadge>
            <UiBadge
              v-else-if="started"
              variant="secondary"
              class="text-primary"
            >
              {{ $t("labels.state.in-progress") }} · <span class="font-bold">{{ Math.round((stage.progress.completed / stage.progress.total) * 100) }}%</span>
            </UiBadge>
            <UiBadge
              v-else
              variant="outline"
            >
              {{ $t("labels.state.to-start") }}
            </UiBadge>

            <p
              v-if="stage.progress.total > 0"
              class="text-sm text-muted-foreground"
            >
              {{ $t("reader.stage.activities", { completed: stage.progress.completed, total: stage.progress.total }) }}
            </p>
            <span
              v-if="stage.progress.total > 0 && duration > 0"
              class="hidden @md:block"
            >·</span>
            <p
              v-if="duration > 0"
              class="text-sm text-muted-foreground"
            >
              {{ $t("reader.stage.remaining", { time: fromMinutes(duration, "short") }) }}
            </p>
          </div>
        </header>

        <main
          v-if="stage.locked && stage.conditions.length"
          class="max-w-3xl mx-auto"
        >
          <UiCard class="border-destructive/20 bg-destructive/10">
            <UiCardHeader>
              <UiCardTitle>
                {{ $t("reader.stage.locked.title") }}
              </UiCardTitle>
              <UiCardDescription>
                {{ $t("reader.stage.locked.description") }}
              </UiCardDescription>
            </UiCardHeader>

            <UiCardContent class="flex flex-col *:py-2 divide-y divide-destructive/20">
              <div
                v-for="condition in stage.conditions"
                :key="condition.label"
                class="flex items-center gap-2 [&_>svg]:size-4 [&_>svg]:text-destructive"
              >
                <component :is="condition.icon" />
                <p>{{ condition.label }}</p>
              </div>
            </UiCardContent>
          </UiCard>
        </main>
      </main>
    </template>
  </PageRoot>
</template>
