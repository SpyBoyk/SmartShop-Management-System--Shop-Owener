<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-3.5 sm:p-4.5 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs"
  >
    <div class="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white/90">
            Sales & Target Trends
          </h3>
          <span class="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            Analytics
          </span>
        </div>
        <p class="text-theme-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {{ selectedOptionLabel }} comparison against target benchmark
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Dual legend indicators -->
        <div class="hidden sm:flex items-center gap-3 mr-1 text-theme-xs">
          <span class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#174478]"></span> Revenue
          </span>
          <span class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#10B981]"></span> Target
          </span>
        </div>

        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button
            v-for="option in options"
            :key="option.value"
            @click="selected = option.value"
            :class="[
              selected === option.value
                ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400',
              'px-2 py-0.5 font-medium rounded-md text-[11px] hover:text-gray-900 dark:hover:text-white transition',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="w-full">
      <div id="chartThree" class="w-full">
        <VueApexCharts
          v-if="isMounted"
          :type="chartType"
          height="215"
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

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  isMounted.value = false
})

const { shopConfig, dailySales, weeklySales, monthlySalesData, yearlySales } = useShopStore()

const options = [
  { value: 'daily', label: 'Daily (7D)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const selected = ref('daily')

const selectedOptionLabel = computed(() => {
  const match = options.find(o => o.value === selected.value)
  return match ? match.label : 'Daily'
})

const chartType = computed(() => {
  return selected.value === 'daily' ? 'area' : 'bar'
})

const series = computed(() => {
  if (selected.value === 'daily') {
    return [
      {
        name: 'Sales Revenue',
        data: dailySales.value.map(d => d.value),
      },
      {
        name: 'Target Baseline',
        data: dailySales.value.map(d => Math.round(d.value * 0.88)),
      },
    ]
  } else if (selected.value === 'weekly') {
    return [
      {
        name: 'Weekly Sales',
        data: weeklySales.value.map(w => w.value),
      },
      {
        name: 'Weekly Target',
        data: weeklySales.value.map(w => Math.round(w.value * 0.85)),
      },
    ]
  } else if (selected.value === 'monthly') {
    return [
      {
        name: 'Monthly Revenue',
        data: monthlySalesData.value.map(m => m.value),
      },
      {
        name: 'Monthly Target',
        data: monthlySalesData.value.map(m => Math.round(m.value * 0.82)),
      },
    ]
  } else {
    return [
      {
        name: 'Yearly Turnover',
        data: yearlySales.value.map(y => y.value),
      },
      {
        name: 'Yearly Benchmark',
        data: yearlySales.value.map(y => Math.round(y.value * 0.80)),
      },
    ]
  }
})

const currentCategories = computed(() => {
  if (selected.value === 'daily') {
    return dailySales.value.map(d => d.label)
  } else if (selected.value === 'weekly') {
    return weeklySales.value.map(w => w.label)
  } else if (selected.value === 'monthly') {
    return monthlySalesData.value.map(m => m.label)
  } else {
    return yearlySales.value.map(y => y.label)
  }
})

const chartOptions = computed(() => ({
  colors: ['#174478', '#10B981'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '42%',
    },
  },
  fill: {
    type: selected.value === 'daily' ? 'gradient' : 'solid',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.40,
      opacityTo: 0.05,
      stops: [0, 95, 100],
    },
  },
  stroke: {
    curve: 'smooth',
    width: selected.value === 'daily' ? [2.5, 2] : [0, 0],
    dashArray: selected.value === 'daily' ? [0, 3] : [0, 0],
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: currentCategories.value,
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
    strokeDashArray: 3,
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `${shopConfig.value.currency}${val.toLocaleString('en-IN')}`,
    },
  },
  legend: {
    show: false,
  },
}))

function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString('en-IN')
}
</script>
