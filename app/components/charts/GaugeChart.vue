<script setup lang="ts">
import type { GaugeChartData } from "~/types/entities/graph";
import { computed, ref, onMounted } from "vue";
import type { Options as HighchartsOptions } from "highcharts";

const props = defineProps<{
  data: GaugeChartData;
}>();

const resolvedColor = ref("var(--chart-1)");

onMounted(() => {
  const style = getComputedStyle(document.documentElement);
  resolvedColor.value = style.getPropertyValue("--chart-1").trim() || "var(--chart-1)";
});

const chartOptions = computed<HighchartsOptions>(() => {
  const suffix = props.data.percent ? "%" : "";

  return {
    chart: {
      type: "solidgauge",
      backgroundColor: "transparent",
      style: {
        fontFamily: "inherit",
      },
    },
    title: {
      text: undefined,
    },
    pane: {
      center: ["50%", "70%"],
      size: "85%",
      startAngle: -90,
      endAngle: 90,
      background: [{
        backgroundColor: "var(--muted)",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
        borderWidth: 0,
        borderRadius: 10,
      }],
    },
    yAxis: {
      min: props.data.min,
      max: props.data.max,
      stops: [
        [1, resolvedColor.value],
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: true,
          y: -20,
          borderWidth: 0,
          useHTML: true,
          format: `<div style="text-align:center"><span style="font-size:2rem;font-weight:700;color:var(--chart-1)">{y}${suffix}</span></div>`,
        },
        innerRadius: "60%",
        borderRadius: 10,
      },
    },
    series: [{
      type: "solidgauge" as const,
      name: "Value",
      data: [props.data.value],
      color: resolvedColor.value,
    }],
  };
});
</script>

<template>
  <div class="gauge-chart-wrapper h-full w-full">
    <highcharts :options="chartOptions" />
  </div>
</template>

<style scoped>
.gauge-chart-wrapper :deep(div) {
  height: 100%;
}
</style>
