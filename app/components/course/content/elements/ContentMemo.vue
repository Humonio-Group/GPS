<script setup lang="ts">
import MemoSlide from "~/components/course/content/elements/memo/MemoSlide.vue";
import type { Content } from "~/types/entities/course";
import type { CarouselApi } from "~/components/ui/carousel";
import { watchOnce } from "@vueuse/core";

interface ContentMemoProps {
  content: Content;
}

const props = defineProps<ContentMemoProps>();

const api = ref<CarouselApi>();
const totalCount = ref<number>(0);
const current = ref<number>(0);

const slides = computed(() => props.content.activity.pages ?? []);

watchOnce(api, (value) => {
  if (!value) return;

  totalCount.value = value.scrollSnapList().length;
  current.value = value.selectedScrollSnap();

  value.on("select", () => current.value = value.selectedScrollSnap());
});
</script>

<template>
  <UiCarousel
    v-slot="{ canScrollNext, canScrollPrev, carouselApi }"
    class="max-w-4xl w-full mx-auto relative flex flex-col gap-4"
    @init-api="api = $event"
  >
    <UiCarouselContent>
      <UiCarouselItem
        v-for="slide in slides"
        :key="`content#${content.id}-slide#${slide.id}`"
        class="@container/slide-item"
      >
        <MemoSlide :slide="slide" />
      </UiCarouselItem>
    </UiCarouselContent>

    <div class="flex items-center justify-center gap-6">
      <UiCarouselPrevious
        :disabled="!canScrollPrev"
        class="relative top-[unset] left-[unset] translate-y-0"
      />
      <div class="flex items-center justify-center gap-1">
        <span
          v-for="(_, index) in totalCount"
          :key="`indicate-slide#${index}`"
          class="block h-2 w-3 rounded-full bg-foreground opacity-40 transition-all duration-100 cursor-pointer"
          :class="{ 'opacity-100 w-8': current === index }"
          @click="carouselApi?.scrollTo(index)"
        />
      </div>
      <UiCarouselNext
        :disabled="!canScrollNext"
        class="relative top-[unset] right-[unset] translate-y-0"
      />
    </div>
  </UiCarousel>
</template>
