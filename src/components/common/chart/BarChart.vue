<template>
  <BarChart v-bind="barChartProps" :chart-id="chartId" :height="230" />
</template>
<script lang="ts" setup>
import { BarChart, useBarChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { timeFormat } from '@/utils/date';

Chart.register(...registerables);

const props = defineProps({
  chartId: {
    type: String,
    default: 'bar-chart',
  },
  labels: {
    type: Array,
    default: () => [],
  },
  datasets: {
    type: Array,
    default: () => [],
  },
});

const data: any = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}));

const options = computed(() => ({
  interaction: {
    intersect: false,
    mode: 'index',
  },
  responsive: true,
  maintainAspectRatio: false,
  barThickness: 18,
  maxBarThickness: 18,
  borderRadius: 15,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'rgba(255, 255, 255, 0.3)',
      },
      ticks: {
        color: 'white',
        callback: function (value) {
          if (value > 1) {
            const time = timeFormat(value).split(' ');
            if (time[0]) {
              return time[0];
            } else {
              return time[1];
            }
          } else {
            return value;
          }
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'white',
        autoSkip: true,
        autoSkipPadding: 20,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';

          if (context.parsed.y !== null) {
            label += timeFormat(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
}));

const { barChartProps, barChartRef } = useBarChart({
  chartData: data,
  options,
});
</script>

<style lang="scss" scoped></style>
