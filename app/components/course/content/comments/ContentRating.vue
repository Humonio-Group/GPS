<script setup lang="ts">
import { Star } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import type { Nullable } from "~/types/primitives/objects";
import StarFill from "~/components/icons/StarFill.vue";

interface ContentRatingProps {
  content: Content;
}

const props = defineProps<ContentRatingProps>();

const hover = ref<Nullable<number>>(null);
const rating = ref<boolean>(false);
const store = useCoursesStore();

async function rate() {
  rating.value = true;
  await store.rateContent(props.content, hover.value!);
  rating.value = false;
}
</script>

<template>
  <div
    class="flex items-center gap-0.5 text-muted-foreground/50 hover:text-muted-foreground! cursor-pointer"
    @mouseleave="hover = null"
  >
    <UiTooltip
      v-for="i in 5"
      :key="`star-${i}`"
    >
      <UiTooltipTrigger>
        <StarFill
          v-if="i <= (hover ?? content.stats.rate ?? 0)"
          class="text-primary size-5"
          :class="{ 'opacity-50 pointer-events-none': rating }"
          @mouseenter="hover = i"
          @click="rate"
        />
        <Star
          v-else
          class="size-5"
          :class="{ 'opacity-50 pointer-events-none': rating }"
          @mouseenter="hover = i"
          @click="rate"
        />
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>{{ $t(`labels.rating-level[${i - 1}]`) }}</p>
      </UiTooltipContent>
    </UiTooltip>
  </div>
</template>
