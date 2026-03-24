<script setup lang="ts">
import type { CalendarViewType } from "~/types/entities/calendar";
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-vue-next";

interface CalendarToolbarProps {
  label: string;
  viewsAllowed?: CalendarViewType[];
  view: CalendarViewType;
  filterStart?: string;
  filterEnd?: string;
}

const search = defineModel<string>("search", { default: "" });

const props = withDefaults(defineProps<CalendarToolbarProps>(), {
  viewsAllowed: () => ["month", "week", "day", "list"],
  filterStart: "",
  filterEnd: "",
});

const emit = defineEmits<{
  "prev": [];
  "next": [];
  "today": [];
  "update:view": [view: CalendarViewType];
  "update:filterStart": [value: string];
  "update:filterEnd": [value: string];
  "clear:search": [];
}>();

const showFilter = ref(!!props.filterStart || !!props.filterEnd);
const hasFilter = computed(() => !!props.filterStart || !!props.filterEnd);

const clearFilter = () => {
  emit("update:filterStart", "");
  emit("update:filterEnd", "");
  showFilter.value = false;
};

const views = computed((): { value: CalendarViewType; labelKey: string }[] => {
  return [
    { value: "month", labelKey: "calendar.views.month" },
    { value: "week", labelKey: "calendar.views.week" },
    { value: "day", labelKey: "calendar.views.day" },
    { value: "list", labelKey: "calendar.views.list" },
  ].filter(view => props.viewsAllowed.includes(view.value as CalendarViewType)) as { value: CalendarViewType; labelKey: string }[];
});
</script>

<template>
  <div class="sticky top-0 grid gap-2 pb-4">
    <div class="flex items-center justify-between">
      <h1
        class="text-3xl font-extrabold capitalize mb-2"
        :class="{ 'sm:mr-0': views.length > 1 }"
      >
        {{ label }}
      </h1>

      <div class="flex items-center gap-2">
        <div class="flex items-center">
          <UiButton
            variant="ghost"
            size="icon-sm"
            @click="emit('prev')"
          >
            <ChevronLeft class="size-4" />
          </UiButton>
          <UiButton
            variant="ghost"
            size="icon-sm"
            @click="emit('next')"
          >
            <ChevronRight class="size-4" />
          </UiButton>
        </div>

        <UiButton
          variant="outline"
          size="sm"
          @click="emit('today')"
        >
          {{ $t("calendar.today") }}
        </UiButton>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div
        v-if="views.length > 1"
        class="order-1 sm:-order-1 flex items-center rounded-lg border bg-muted p-0.5"
      >
        <button
          v-for="v in views"
          :key="v.value"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            view === v.value
              ? 'bg-background text-foreground shadow-sm font-medium'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="emit('update:view', v.value)"
        >
          {{ $t(v.labelKey) }}
        </button>
      </div>

      <div
        class="w-full flex items-center gap-2"
        :class="{ 'sm:w-auto': views.length > 1 }"
      >
        <div
          class="relative"
          :class="{ 'w-full': views.length === 1 }"
        >
          <UiInput
            v-model="search"
            :placeholder="$t('labels.search')"
            class="pl-8"
            :class="{ 'w-full': views.length === 1 }"
          />

          <UiButton
            v-if="search?.length"
            variant="ghost"
            size="icon-sm"
            class="size-6 absolute top-1.5 left-1.5 rounded-full"
            @click="$emit('clear:search')"
          >
            <X />
          </UiButton>
          <Search
            v-else
            class="size-4 absolute top-2.5 left-2.5 text-muted-foreground pointer-events-none"
          />
        </div>

        <UiButton
          :variant="hasFilter ? 'default' : 'outline'"
          size="icon-sm"
          @click="showFilter = !showFilter"
        >
          <Filter class="size-4" />
        </UiButton>
      </div>
    </div>

    <!-- Date range filter -->
    <div
      v-if="showFilter"
      class="flex items-center gap-2 flex-wrap"
    >
      <span class="text-sm text-muted-foreground">
        {{ $t("calendar.filter.from") }}
      </span>
      <UiInput
        type="date"
        class="w-auto text-sm h-8"
        :model-value="filterStart"
        @update:model-value="emit('update:filterStart', $event as string)"
      />
      <span class="text-sm text-muted-foreground">
        {{ $t("calendar.filter.to") }}
      </span>
      <UiInput
        type="date"
        class="w-auto text-sm h-8"
        :model-value="filterEnd"
        :min="filterStart || undefined"
        @update:model-value="emit('update:filterEnd', $event as string)"
      />
      <UiButton
        v-if="hasFilter"
        variant="ghost"
        size="icon-sm"
        @click="clearFilter"
      >
        <X class="size-4" />
      </UiButton>
    </div>
  </div>
</template>
