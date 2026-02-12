<script setup lang="ts">
import { Book, Calendar, MessageCircle, User, Settings } from "lucide-vue-next";
import { useDebounceFn, useMagicKeys, whenever } from "@vueuse/core";
import type { AcceptableValue } from "reka-ui";
import type { Content } from "~/types/entities/course";

const open = defineModel<boolean>("open", { default: false });
const { alias } = useWorkspaceUtils();
const { log, error } = useLogger();

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const { meta_k } = useMagicKeys();
whenever(meta_k, () => {
  open.value = true;
});

const search = ref<string>("");
const searching = ref<boolean>(false);
const results = ref<Content[]>([]);

const applySearch = useDebounceFn(async (keywords: string) => {
  searching.value = true;

  try {
    const response = await useApi().get("/activity_users", { version: 2, endpointVersion: 1 }, {
      query: {
        journeys: (courses.value ?? []).map(course => course.id).join(","),
        keywords,
        types: "3,4",
        limit: -1,
      },
    });
    log(response);
  }
  catch (e) {
    error(e);
    // todo: toast it - loic
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
  log(value);

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
        const id = Number(val.split(".")[1]);
        log(`[COMMAND] Navigating to content #${id}`);
        return;
      }
    }
  }
}

coursesStore.loadCourses();
</script>

<template>
  <UiCommandDialog v-model:open="open">
    <UiCommand @update:model-value="handleAction">
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
          <UiCommandGroup :heading="$t('navigation.command-group.contents')">
            <UiCommandItem
              v-for="content in results"
              :key="`content-${content.id}`"
              :value="`content.${content.id}`"
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
