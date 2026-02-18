<script setup lang="ts">
import type { PolarChartData } from "~/types/entities/graph";
import { computed, ref, onMounted, watch } from "vue";
import type { Options as HighchartsOptions } from "highcharts";

const props = defineProps<{
  data: PolarChartData;
}>();

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

const chartOptions = computed<HighchartsOptions>(() => {
  const yMax = props.data.percent
    ? 100
    : Math.max(...props.data.series.map(s => s.config.max));

  const suffix = props.data.percent ? "%" : "";

  return {
    chart: {
      polar: true,
      type: "column",
      backgroundColor: "transparent",
      style: {
        fontFamily: "inherit",
      },
    },
    title: {
      text: undefined,
    },
    pane: {
      size: "80%",
    },
    xAxis: {
      categories: props.data.series.map(s =>
        props.data.percent
          ? `${s.name}<br><b>(${s.data}%)</b>`
          : s.name,
      ),
      tickmarkPlacement: "on",
      lineWidth: 0,
      tickPositions: props.data.series.map((_, i) => i),
      labels: {
        useHTML: true,
        style: {
          color: "var(--muted-foreground)",
          fontSize: "12px",
          textAlign: "center",
        },
      },
    },
    yAxis: {
      min: 0,
      max: yMax,
      gridLineInterpolation: "circle",
      lineWidth: 0,
      labels: {
        style: {
          color: "var(--muted-foreground)",
          fontSize: "12px",
        },
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "transparent",
      borderWidth: 0,
      shadow: false,
      padding: 0,
      headerFormat: `<div style="background:var(--popover);border:1px solid var(--border);border-radius:8px;padding:8px 12px;box-shadow:0 4px 12px rgba(0,0,0,.15);font-size:12px;color:var(--popover-foreground)">`,
      pointFormat: `<div style="display:flex;align-items:center;gap:8px;padding:2px 0">
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:{point.color}"></span>
          <span>{point.category}</span>
          <span style="font-weight:600;margin-left:12px">{point.y}${suffix}</span>
        </div>`,
      footerFormat: "</div>",
    },
    plotOptions: {
      series: {
        label: {
          enabled: false,
        },
      },
      column: {
        pointPadding: 0,
        groupPadding: 0,
        borderWidth: 0,
        colorByPoint: true,
      },
    },
    credits: {
      enabled: false,
    },
    series: [{
      type: "column" as const,
      name: "Data",
      data: props.data.series.map((s, i) => ({
        y: s.data,
        color: resolvedColors.value[i] ?? `var(--chart-${(i % 5) + 1})`,
      })),
      pointPlacement: "on",
    }],
  };
});
</script>

<template>
  <div class="polar-chart-wrapper h-full w-full">
    <highcharts :options="chartOptions" />
  </div>
</template>

<style scoped>
.polar-chart-wrapper :deep(div) {
  height: 100%;
}
</style>
