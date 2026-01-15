<script setup lang="ts">
import { Edit2 } from "lucide-vue-next";
import type { Manager, People } from "~/types/entities/user";
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";

interface PeopleCardProps {
  people: People;
  manager?: boolean;
  class?: HTMLAttributes["class"];
}

const props = defineProps<PeopleCardProps>();

const store = useCoursesStore();
const { loading } = storeToRefs(store);

const isManager = computed(() => props.manager && Object.keys(props.people).includes("settings"));
const manager = computed(() => isManager.value ? props.people as Manager : null);
</script>

<template>
  <div :class="cn('flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-75 cursor-pointer', props.class)">
    <UiAvatar class="rounded-md">
      <UiAvatarImage
        v-if="people.avatar"
        :src="people.avatar"
      />
      <UiAvatarFallback>{{ people.name.first[0] }}{{ people.name.last[0] }}</UiAvatarFallback>
    </UiAvatar>
    <div class="flex-1 grid gap-1">
      <p class="font-semibold leading-none flex items-center gap-3">
        {{ people.name.full }} <span
          v-if="isManager && manager!.invitationStatus !== 'accepted'"
          class="text-sm text-muted-foreground"
          :class="{ 'text-destructive': manager!.invitationStatus === 'declined' }"
        >{{ $t(`labels.state.${manager!.invitationStatus}`) }}</span>
      </p>
      <span class="text-sm leading-none text-muted-foreground">{{ people.contact.email }}</span>
    </div>

    <UiDropdownMenu v-if="isManager">
      <UiDropdownMenuTrigger as-child>
        <UiButton
          size="icon-sm"
          variant="ghost"
          :disabled="loading.specific.updateManager"
          @click.stop
        >
          <Edit2 />
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent align="end">
        <UiDropdownMenuCheckboxItem
          :model-value="manager!.settings.shareActions"
          :disabled="loading.specific.updateManager"
          @click="store.patchManagerSettings(manager!.reference, { actions: !manager!.settings.shareActions })"
        >
          {{ $t("courses.specimen.people.manager.settings.share-actions") }}
        </UiDropdownMenuCheckboxItem>
        <UiDropdownMenuCheckboxItem
          :model-value="manager!.settings.shareResults"
          :disabled="loading.specific.updateManager"
          @click="store.patchManagerSettings(manager!.reference, { results: !manager!.settings.shareResults })"
        >
          {{ $t("courses.specimen.people.manager.settings.share-results") }}
        </UiDropdownMenuCheckboxItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </div>
</template>
