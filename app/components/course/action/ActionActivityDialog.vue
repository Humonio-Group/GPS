<script setup lang="ts">
import { TrendingUp } from "lucide-vue-next";
import type { Action } from "~/types/entities/action";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";
import type { Nullable } from "~/types/primitives/objects";
import { EntityType } from "~/types/entities/entities";

interface ActionActivityDialogProps {
  actionId: Nullable<number>;
}
const props = defineProps<ActionActivityDialogProps>();
const emit = defineEmits<{ (e: "close"): void }>();

const open = defineModel<boolean>("open", { default: false });
watch(open, (val) => {
  if (!val) return;
  emit("close");
});
watch(props, (val) => {
  if (!val.actionId || !open.value) {
    action.value = null;
    return;
  }
  loadAction();
});

const action = ref<Nullable<Action>>(null);
const loading = ref<boolean>(false);

const tasks = computed(() => action.value
  ? [...action.value.tasks]
      .sort((a, b) => a.order - b.order)
      .sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0))
  : []);

const completedCount = computed(() => tasks.value.filter(t => t.done).length);
const totalCount = computed(() => tasks.value.length);

async function loadAction() {
  const id = props.actionId;
  loading.value = true;

  try {
    const response = await useApi().get(`/actions/${id}`, { version: 2, endpointVersion: 1 }, {
      query: {
        include: "impactMapCategory4",
      },
    });

    const strategy = response.included.filter((i: any) => i.type === EntityType.STRATEGY)[0];
    action.value = {
      id: response.data.id,
      objective: {
        id: strategy.id,
        name: strategy.attributes.displayName,
        description: strategy.attributes.displayDesc,
      },
      description: {
        original: response.data.attributes.description,
        raw: response.data.attributes.rawDescription,
      },
      end: new Date(response.data.attributes.dates.endAction),
      progression: response.data.attributes.progression,
      tasks: response.data.attributes.tasklist.map((t: any, index: number) => ({
        order: index,
        ...t,
      })),
      stats: {
        likes: response.data.attributes.stats.nbLikes,
        followers: response.data.attributes.stats.nbFollowers,
        comments: response.data.attributes.stats.nbComments,
      },
    };
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
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogContent>
      <div
        v-if="loading"
        class="h-24 grid place-items-center"
      >
        <UiSpinner />
      </div>
      <template v-else-if="action">
        <section>
          <MarkdownRenderer :content="action.description.original" />
        </section>

        <!-- objective -->
        <UiCard class="p-4 gap-3 flex-row">
          <TrendingUp class="size-4 text-muted-foreground" />

          <UiCardHeader class="flex-1 px-0">
            <UiCardTitle>{{ action.objective.name }}</UiCardTitle>
            <UiCardDescription>{{ action.objective.description }}</UiCardDescription>
          </UiCardHeader>
        </UiCard>

        <section
          v-if="action.tasks.length"
          class="grid gap-2"
        >
          <header class="flex items-center justify-between">
            <h3 class="text-lg font-bold">
              {{ $t("courses.specimen.actions.tasklist") }}
            </h3>

            <UiBadge variant="outline">
              {{ $t("courses.specimen.actions.count", { done: completedCount, total: totalCount }) }}
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
                class="text-base! font-normal! leading-normal!"
              >
                <UiCheckbox
                  :id="`a${action.id}-task#${task.name.substring(0, 8)}`"
                  v-model="task.done"
                  class="size-5"
                /> <!-- todo: update task/action to sync with server -->

                <span :class="{ 'text-muted-foreground line-through': task.done }">
                  {{ task.name }}
                </span>
              </UiLabel>
            </li>
          </ul>
        </section>
      </template>
    </UiDialogContent>
  </UiDialog>
</template>
