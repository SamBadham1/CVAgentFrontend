<script setup lang="ts">
import { computed } from "vue";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "vue-chartjs";
import type { ChartJsConfig } from "../../lib/chartTypes";
import styles from "./Chat.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const TEXT_COLOR = "#c8cdd3";
const GRID_COLOR = "rgba(255, 255, 255, 0.08)";

const props = defineProps<{
  config: ChartJsConfig;
}>();

const themed = computed<ChartJsConfig>(() => {
  const config = props.config;
  return {
    ...config,
    options: {
      ...config.options,
      plugins: {
        ...config.options?.plugins,
        title: {
          ...config.options?.plugins?.title,
          color: TEXT_COLOR,
        },
        legend: {
          ...config.options?.plugins?.legend,
          labels: { color: TEXT_COLOR },
        },
      },
      scales: config.options?.scales
        ? Object.fromEntries(
            Object.entries(config.options.scales).map(([key, scale]) => [
              key,
              {
                ...scale,
                ticks: { ...scale.ticks, color: TEXT_COLOR },
                grid: { color: GRID_COLOR },
              },
            ]),
          )
        : undefined,
    },
  };
});

const chartComponent = computed(() => {
  switch (props.config.type) {
    case "line":
      return Line;
    case "pie":
      return Pie;
    case "doughnut":
      return Doughnut;
    default:
      return Bar;
  }
});

// vue-chartjs prop types are per-chart-type; the config shapes are compatible.
const chartData = computed(() => themed.value.data as never);
const chartOptions = computed(() => (themed.value.options ?? {}) as never);
</script>

<template>
  <div :class="styles.chartBlock">
    <component :is="chartComponent" :data="chartData" :options="chartOptions" />
  </div>
</template>
