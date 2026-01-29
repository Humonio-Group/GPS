<script setup lang="ts">
import { TrendingUp } from "lucide-vue-next";
import type { Action } from "~/types/entities/action";
import MarkdownRenderer from "~/components/primitives/MarkdownRenderer.vue";
import type { Nullable } from "~/types/primitives/objects";
import { EntityType } from "~/types/entities/entities";

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

const action = ref<Nullable<Action>>(null);
const loading = ref<boolean>(false);
const updating = ref<boolean>(false);

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
      tasks: response.data.attributes.tasklist.map((t: any) => ({
        name: t.name,
        done: t.done,
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
  }
  catch (e) {
    console.error(e);
    // todo: toast - loic
  }
  finally {
    updating.value = false;
  }
}
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogTrigger as-child>
      <slot />
    </UiDialogTrigger>
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
      </template>
    </UiDialogContent>
  </UiDialog>
</template>
