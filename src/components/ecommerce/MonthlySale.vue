<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Revenue</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Last 6 months revenue progression
        </p>
      </div>

      <span class="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
        {{ shopConfig.currency }}{{ formatNumber(monthlySalesData.reduce((a, b) => a + b.value, 0)) }} Total
      </span>
    </div>

    <div class="w-full">
      <div id="chartOne" class="w-full">
        <VueApexCharts
          v-if="isMounted"
          type="bar"
          height="230"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useShopStore } from '@/composables/useShopStore'

const { shopConfig, monthlySalesData } = useShopStore()

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  isMounted.value = false
})

const series = computed(() => [
  {
    name: 'Revenue',
    data: monthlySalesData.value.map(m => m.value),
  },
])

const chartOptions = computed(() => ({
  colors: ['#174478'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      borderRadius: 6,
    },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: monthlySalesData.value.map(m => m.label),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#9CA3AF', fontSize: '11px', fontWeight: 500 },
    },
  },
  yaxis: {
    labels: {
      style: { colors: '#9CA3AF', fontSize: '11px' },
      formatter: (val: number) => shopConfig.value.currency + formatNumber(val),
    },
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `${shopConfig.value.currency}${val.toLocaleString('en-IN')}`,
    },
  },
}))

function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString('en-IN')
}
</script>
