<script setup lang="ts">
import type { CarouselApi } from "~/components/ui/carousel";
import { watchOnce } from "@vueuse/core";
import { type BarChartData, type GaugeChartData, type IndividualChoiceChartData, type LeaderBoardChartData, type PolarChartData, type ValueChartData, GraphType } from "~/types/entities/graph";
import { TrendingUp } from "lucide-vue-next";
import { BarChart, GaugeChart, IndividualChoice, LeaderBoard, PolarChart, ValueChart } from "~/components/charts";
import type { Content } from "~/types/entities/course";

interface ContentGraphsSliderProps {
  content: Content;
}

const props = defineProps<ContentGraphsSliderProps>();

const api = ref<CarouselApi>();
const totalCount = ref<number>(0);
const current = ref<number>(0);

const slides = computed(() => props.content.graphs ?? []);

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
    class="max-w-4xl w-full mx-auto relative flex flex-col gap-4 outline-none"
    @init-api="api = $event"
  >
    <UiCard class="w-full py-4 gap-4">
      <UiCardHeader class="flex items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <TrendingUp class="text-primary size-4" />
          <UiCardTitle class="text-sm">
            {{ $t("reader.results.title") }}
          </UiCardTitle>
        </div>

        <div
          v-if="slides.length > 1"
          class="flex items-center gap-2"
        >
          <UiCarouselPrevious
            :disabled="!canScrollPrev"
            class="relative left-0! top-0! translate-0 ring-0 border-0 bg-transparent! hover:bg-primary/15!"
          />

          <div class="flex items-center justify-center gap-1">
            <span
              v-for="(_, index) in totalCount"
              :key="`indicate-slide#${index}`"
              class="block h-2 w-2 rounded-full bg-foreground opacity-40 transition-all duration-100 cursor-pointer"
              :class="{ 'opacity-100 w-4': current === index }"
              @click="carouselApi?.scrollTo(index)"
            />
          </div>

          <UiCarouselNext
            :disabled="!canScrollNext"
            class="relative right-0! top-0! translate-0 ring-0 border-0 bg-transparent! hover:bg-primary/15!"
          />
        </div>
      </UiCardHeader>

      <UiSeparator />

      <UiCardContent class="px-4">
        <UiCarouselContent>
          <UiCarouselItem
            v-for="graph in slides"
            :key="`graph-${graph.id}`"
            class="h-[40dvh] min-h-64 max-h-104 flex flex-col gap-3 px-16 pt-4 pb-10"
          >
            <div
              v-if="graph.title || graph.description"
              class="text-center shrink-0"
            >
              <h3
                v-if="graph.title"
                class="text-sm font-semibold"
              >
                {{ graph.title }}
              </h3>
              <p
                v-if="graph.description"
                class="text-xs text-muted-foreground mt-0.5"
              >
                {{ graph.description }}
              </p>
            </div>

            <div class="flex-1 min-h-0">
              <BarChart
                v-if="[GraphType.HORIZONTAL_BAR, GraphType.VERTICAL_BAR].includes(graph.type)"
                :orientation="graph.type === GraphType.VERTICAL_BAR ? 'vertical' : 'horizontal'"
                :data="graph.data as BarChartData"
              />
              <PolarChart
                v-else-if="graph.type === GraphType.POLAR"
                :data="graph.data as PolarChartData"
              />
              <GaugeChart
                v-else-if="graph.type === GraphType.GAUGE"
                :data="graph.data as GaugeChartData"
              />
              <ValueChart
                v-else-if="graph.type === GraphType.VALUE"
                :data="graph.data as ValueChartData"
              />
              <IndividualChoice
                v-else-if="graph.type === GraphType.INDIVIDUAL_CHOICE"
                :data="graph.data as IndividualChoiceChartData"
              />
              <LeaderBoard
                v-else-if="graph.type === GraphType.LEADER_BOARD"
                :data="graph.data as LeaderBoardChartData"
              />
            </div>
          </UiCarouselItem>
        </UiCarouselContent>
      </UiCardContent>
    </UiCard>
  </UiCarousel>
</template>
