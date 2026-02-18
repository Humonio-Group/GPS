<script setup lang="ts">
import type { BarChartData } from "~/types/entities/graph";
import { computed, ref, onMounted, watch } from "vue";
import type { Options as HighchartsOptions } from "highcharts";

const props = withDefaults(defineProps<{
  data: BarChartData;
  orientation?: "horizontal" | "vertical";
}>(), {
  orientation: "horizontal",
});

const resolvedColors = ref<string[]>([]);

function resolveChartColors(count: number): string[] {
  const style = getComputedStyle(document.documentElement);
  return Array.from({ length: count }, (_, i) =>
    style.getPropertyValue(`--chart-${(i % 5) + 1}`).trim(),
  );
}

onMounted(() => {
  resolvedColors.value = resolveChartColors(props.data.series.length);
});

watch(() => props.data.series.length, (len) => {
  resolvedColors.value = resolveChartColors(len);
});

const chartOptions = computed<HighchartsOptions>(() => ({
  chart: {
    type: props.orientation === "horizontal" ? "bar" : "column",
    backgroundColor: "transparent",
    style: {
      fontFamily: "inherit",
    },
  },
  title: {
    text: undefined,
  },
  xAxis: {
    categories: props.data.categories,
    lineColor: "transparent",
    tickLength: 0,
    labels: {
      style: {
        color: "var(--muted-foreground)",
        fontSize: "12px",
      },
    },
  },
  yAxis: {
    title: {
      text: undefined,
    },
    allowDecimals: false,
    gridLineWidth: 0,
    labels: {
      style: {
        color: "var(--muted-foreground)",
        fontSize: "12px",
      },
    },
  },
  legend: {
    enabled: props.data.series.length > 1,
    itemStyle: {
      color: "var(--foreground)",
      fontWeight: "normal",
      fontSize: "12px",
    },
    itemHoverStyle: {
      color: "var(--foreground)",
    },
  },
  tooltip: {
    shared: true,
    useHTML: true,
    backgroundColor: "transparent",
    borderWidth: 0,
    shadow: false,
    padding: 0,
    headerFormat: `<div style="background:var(--popover);border:1px solid var(--border);border-radius:8px;padding:8px 12px;box-shadow:0 4px 12px rgba(0,0,0,.15);font-size:12px;color:var(--popover-foreground)">
      <div style="font-weight:600;margin-bottom:4px">{point.key}</div>`,
    pointFormat: `<div style="display:flex;align-items:center;gap:8px;padding:2px 0">
        <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:{series.color}"></span>
        <span style="flex:1">{series.name}</span>
        <span style="font-weight:600;margin-left:12px">{point.y}</span>
      </div>`,
    footerFormat: "</div>",
  },
  plotOptions: {
    series: {
      borderRadius: 12,
      borderWidth: 0,
    },
  },
  credits: {
    enabled: false,
  },
  series: props.data.series.map((s, i) => ({
    type: props.orientation === "horizontal" ? "bar" as const : "column" as const,
    name: s.name,
    data: s.data,
    color: resolvedColors.value[i] ?? `var(--chart-${(i % 5) + 1})`,
  })),
}));
</script>

<template>
  <div class="bar-chart-wrapper h-full w-full">
    <highcharts :options="chartOptions" />
  </div>
</template>

<style scoped>
.bar-chart-wrapper :deep(div) {
  height: 100%;
}
</style>
