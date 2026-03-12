<script setup lang="ts">
import { Book, Calendar, MessageCircle, User, Settings } from "lucide-vue-next";
import { useDebounceFn, useMagicKeys, whenever } from "@vueuse/core";
import type { AcceptableValue } from "reka-ui";
import type { UiCommand } from "#components";
import type { Nullable } from "~/types/primitives/objects";
import { EntityType } from "~/types/entities/entities";

interface ResultContent {
  id: number;
  name: string;
  picture: Nullable<string>;
  course: {
    id: number;
    name: string;
  };
}

const open = defineModel<boolean>("open", { default: false });
const { alias } = useWorkspaceUtils();
const { error } = useLogger();

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const { meta_k } = useMagicKeys();
whenever(meta_k, () => {
  open.value = true;
});

const search = ref<string>("");
const searching = ref<boolean>(false);
const results = ref<ResultContent[]>([]);
const groupedResults = computed(() => {
  const courses = results.value.map(r => r.course.id).reduce((acc, curr) => {
    if (acc.includes(curr)) return acc;

    acc = [...acc, curr];
    return acc;
  }, [] as number[]);
  return courses.map((c: number) => {
    const contents = results.value.filter(r => r.course.id === c);
    const courseName = contents[0]?.course.name;

    if (!courseName) return null;

    return {
      id: c,
      name: courseName,
      contents,
    };
  }).filter(c => !!c);
});
const commandRef = ref<InstanceType<typeof UiCommand> | null>(null);

const applySearch = useDebounceFn(async (keywords: string) => {
  const filteredCount = commandRef.value?.filterState?.filtered.count ?? 0;
  if (filteredCount > 0) {
    results.value = [];
    return;
  }

  searching.value = true;

  try {
    const response = await useApi().get("/activity_users", { version: 2, endpointVersion: 1 }, {
      query: {
        "journeys": (courses.value ?? []).map(course => course.id).join(","),
        "keyword": keywords,
        "type": "3,4",
        "fields[activityUsers]": "title,design,permissions",
        "fields[journeys]": "name,displayName",
        "include": "journey",
        "limit": -1,
        "sort": "content_name",
      },
    });

    const { data, included } = response;
    results.value = data.map((result: any) => {
      const course = included.find((j: any) => j.type === EntityType.JOURNEY && j.id === result.relationships.journey.data[0]!.id);
      return {
        id: result.id,
        name: result.attributes.title,
        picture: result.attributes.design?.picture?.thumbnail,
        course: {
          id: course.id,
          name: course.attributes.displayName,
        },
      };
    }) as ResultContent[];

    await nextTick();
    commandRef.value?.filterItems();
  }
  catch (e) {
    error(e);
    search.value = "";
    results.value = [];
    if (commandRef.value?.filterState) {
      commandRef.value.filterState.search = "";
    }
  }
  finally {
    searching.value = false;
  }
}, 250);
watch(search, (val) => {
  if (val.length < 3) results.value = [];
  else applySearch(val);
});

const localePath = useLocalePath();
function handleAction(value: AcceptableValue) {
  open.value = false;

  switch (value) {
    case "courses": {
      navigateTo(localePath(`/${alias.value}/courses`));
      break;
    }
    case "coach": {
      navigateTo(localePath(`/${alias.value}/companion`));
      break;
    }
    case "calendar": {
      navigateTo(localePath(`/${alias.value}/events`));
      break;
    }
    case "profile": {
      navigateTo(localePath(`/${alias.value}/profile`));
      break;
    }
    case "settings": {
      navigateTo(localePath(`/${alias.value}/profile/settings`));
      break;
    }
    default: {
      const val = value as string;
      if (val.startsWith("courses.")) {
        const id = Number(val.split(".")[1]);
        navigateTo(localePath(`/${alias.value}/courses/${id}`));
        return;
      }
      if (val.startsWith("contents.")) {
        const [_key, courseItem, idItem] = val.split(".");
        const course = Number(courseItem);
        const id = Number(idItem);

        navigateTo(localePath(`/${alias.value}/reader/${course}/${id}`));
        return;
      }
    }
  }
}

coursesStore.loadCourses();
</script>

<template>
  <UiCommandDialog v-model:open="open">
    <UiCommand
      ref="commandRef"
      @update:model-value="handleAction"
    >
      <UiCommandList>
        <UiCommandInput @update-search="search = $event" />

        <div
          v-if="searching"
          class="h-24 w-full grid place-items-center"
        >
          <UiSpinner />
        </div>
        <UiCommandEmpty v-else>
          {{ $t("navigation.command-group.empty") }}
        </UiCommandEmpty>

        <UiCommandGroup :heading="$t('navigation.command-group.suggested')">
          <UiCommandItem value="courses">
            <Book />
            {{ $t("navigation.my-courses") }}
          </UiCommandItem>
          <UiCommandItem value="coach">
            <MessageCircle />
            {{ $t("navigation.ai-coach") }}
          </UiCommandItem>
          <UiCommandItem value="calendar">
            <Calendar />
            {{ $t("navigation.events") }}
          </UiCommandItem>
        </UiCommandGroup>

        <UiCommandGroup :heading="$t('navigation.command-group.user')">
          <UiCommandItem value="profile">
            <User />
            {{ $t("navigation.user-menu.profile") }}
          </UiCommandItem>
          <UiCommandItem value="settings">
            <Settings />
            {{ $t("navigation.user-menu.settings") }}
          </UiCommandItem>
        </UiCommandGroup>

        <template v-if="courses?.length">
          <UiCommandSeparator />
          <UiCommandGroup :heading="$t('navigation.command-group.courses')">
            <UiCommandItem
              v-for="course in courses"
              :key="course.id"
              :value="`courses.${course.id}`"
            >
              <NuxtImg
                class="block aspect-square w-4 rounded-xs object-cover"
                :src="course.picture ?? course.program.picture"
              />
              <span class="truncate">{{ course.name }} - {{ course.description }}</span>
            </UiCommandItem>
          </UiCommandGroup>
        </template>

        <template v-if="results.length">
          <UiCommandSeparator />
          <UiCommandGroup
            v-for="group in groupedResults"
            :key="`course-group.${group.id}`"
            :heading="group.name"
          >
            <UiCommandItem
              v-for="content in group.contents"
              :key="`contents.${group.id}.${content.id}`"
              :value="`contents.${group.id}.${content.id}`"
            >
              <NuxtImg
                class="aspect-square object-cover size-4 rounded-sm"
                :src="content.picture"
              />
              <span class="truncate">{{ content.name }}</span>
            </UiCommandItem>
          </UiCommandGroup>
        </template>
      </UiCommandList>
    </UiCommand>
  </UiCommandDialog>
</template>
