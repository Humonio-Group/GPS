<script setup lang="ts">
import { Lock } from "lucide-vue-next";
import type { Action, Objective } from "~/types/entities/action";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";
import type { Nullable } from "~/types/primitives/objects";
import { EntityType } from "~/types/entities/entities";
import { buildActionEntity } from "~/lib/action";
import ObjectiveCard from "~/components/course/action/ObjectiveCard.vue";

interface ActionActivityDialogProps {
  actionId: number;
}
const props = defineProps<ActionActivityDialogProps>();
const emit = defineEmits<{
  close: [];
}>();

const open = defineModel<boolean>("open", { default: false });
watch(open, (val) => {
  if (!val) {
    emit("close");
    return;
  }

  loadAction();
});

const store = useCoursesStore();
const action = ref<Nullable<Action>>(null);
const loading = ref<boolean>(false);
const updating = ref<boolean>(false);
const selectedStrategy = ref<Nullable<Objective>>(null);
const { alias } = useWorkspaceUtils();
const { selectedCourse: course } = storeToRefs(store);

const tasks = computed(() => action.value?.tasks ?? []);

const completedCount = computed(() => tasks.value.filter(t => t.done).length);
const totalCount = computed(() => tasks.value.length);
const api = useApi();

async function loadAction() {
  const id = props.actionId;
  loading.value = true;

  try {
    const response = await api.get(`/actions/${id}`, { version: 2, endpointVersion: 1, vanilla: true }, {
      query: {
        "include": "topic,journey,journey.program,followers,requesterFollow,impactMapCategory1,impactMapCategory2,impactMapCategory3,impactMapCategory4,changr,changr.content,user,recommended,recommended.recommendedStrategies,recommended.activityUsers",
        "fields[actions]": "default,stats,tasklist",
        "fields[programs]": "config.impact",
        "fields[topics]": "default,recipient,stats.all",
        "fields[contents]": "display,design,embedContent",
        "fields[strategies]": "display,section",
        "fields[changrs]": "specific",
        "fields[journeys]": "displayName",
        "fields[tags]": "displayName,stats,stats.users",
        "fields[users]": "name,picture,email",
        "fields[activityUsers]": "default,graphics",
      },
    });

    const { data, included } = response;
    action.value = buildActionEntity(data, included);
    useLogger().log("[ACTION DIALOG]", action.value);
  }
  catch (e) {
    useLogger().error(e);
    open.value = false;
    // todo: toast - loic
  }
  finally {
    loading.value = false;
  }
}
async function updateAction() {
  if (!action.value) return;
  updating.value = true;

  try {
    await useApi().put(`/actions/${action.value.id}`, { version: 2, endpointVersion: 1 }, {
      body: {
        data: {
          type: EntityType.ACTION,
          attributes: {
            tasklist: tasks.value.map(t => ({ name: t.name, done: t.done })),
          },
        },
      },
    });
    action.value.progression = tasks.value.filter(t => t.done).length / totalCount.value;
    store.updateAction(props.actionId, action.value);
  }
  catch (e) {
    console.error(e);
    // todo: toast - loic
  }
  finally {
    updating.value = false;
  }
}
function selectStrategy(strategy: Objective) {
  if (selectedStrategy.value?.id === strategy.id) selectedStrategy.value = null;
  else selectedStrategy.value = strategy;
}
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogTrigger as-child>
      <slot />
    </UiDialogTrigger>
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>
          {{ $t("courses.specimen.actions.details-title") }}
        </UiDialogTitle>
      </UiDialogHeader>

      <div
        v-if="loading"
        class="h-24 grid place-items-center"
      >
        <UiSpinner />
      </div>
      <template v-else-if="action">
        <!-- objective -->
        <section
          v-if="action.hasImpactMap"
          class="grid gap-2"
        >
          <div class="flex items-center flex-wrap gap-2">
            <UiButton
              v-for="strategy in action.strategies"
              :key="strategy.id"
              :variant="selectedStrategy?.id === strategy.id ? 'secondary' : 'outline'"
              @click="selectStrategy(strategy)"
            >
              {{ strategy.name }}
            </UiButton>
          </div>
          <ObjectiveCard
            v-if="selectedStrategy"
            :objective="selectedStrategy"
          />
        </section>
        <ObjectiveCard
          v-else
          :objective="action.objective"
        />

        <!-- description -->
        <section>
          <MarkdownRenderer
            :content="action.description.original"
            use-markdown
          />
        </section>

        <UiSeparator />

        <!-- tasklist -->
        <section
          v-if="action.tasks.length"
          class="grid gap-2"
        >
          <header class="flex items-center justify-between">
            <h3 class="text-lg font-bold">
              {{ $t("courses.specimen.actions.tasklist") }}
            </h3>

            <UiBadge variant="outline">
              {{ $t("courses.specimen.actions.count", totalCount, { named: { done: completedCount, total: totalCount } }) }}
            </UiBadge>
          </header>

          <ul>
            <li
              v-for="task in tasks"
              :key="`a${action.id}-task#${task.name.substring(0, 8)}`"
              class="flex items-center gap-2"
            >
              <UiLabel
                :for="`a${action.id}-task#${task.name.substring(0, 8)}`"
                class="text-base! font-normal! leading-normal! cursor-pointer"
              >
                <UiCheckbox
                  :id="`a${action.id}-task#${task.name.substring(0, 8)}`"
                  :model-value="task.done"
                  class="size-5"
                  :disabled="updating"
                  @update:model-value="(val) => {
                    task.done = val as boolean;
                    updateAction();
                  }"
                />

                <span :class="{ 'text-muted-foreground line-through': task.done, 'opacity-50': updating }">
                  {{ task.name }}
                </span>
              </UiLabel>
            </li>
          </ul>
        </section>

        <!-- recommendations -->
        <template v-if="action.recommendations.length">
          <UiSeparator />

          <section class="flex flex-col gap-2 overflow-hidden">
            <header class="flex items-center justify-between">
              <h3 class="text-lg font-bold">
                {{ $t("courses.specimen.actions.recommendations") }}
              </h3>
            </header>

            <template
              v-for="recommendation in action.recommendations"
              :key="recommendation.id"
            >
              <UiButton
                v-if="recommendation.locked"
                variant="outline"
                class="pl-1.5 overflow-hidden"
              >
                <div class="size-6 grid place-items-center">
                  <Lock class="size-4 text-muted-foreground" />
                </div>

                <span class="flex-1 truncate">{{ recommendation.name }}</span>
              </UiButton>
              <UiButton
                v-else
                variant="outline"
                class="pl-1.5 overflow-hidden"
                as-child
              >
                <NuxtLinkLocale :to="`/${alias}/reader/${course!.id}/${recommendation.id}`">
                  <NuxtImg
                    class="size-6 rounded-sm object-cover bg-primary"
                    :src="recommendation.icon"
                  />

                  <span class="flex-1 truncate">{{ recommendation.name }}</span>
                </NuxtLinkLocale>
              </UiButton>
            </template>
          </section>
        </template>
      </template>
    </UiDialogContent>
  </UiDialog>
</template>
