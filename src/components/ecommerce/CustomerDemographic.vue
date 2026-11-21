<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white/90">
          Most Popular Categories
        </h3>
        <p class="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Product sales distribution across categories
        </p>
      </div>

      <span class="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-500/10">
        {{ categoryDistribution.length }} Categories
      </span>
    </div>

    <!-- Category Donut Chart -->
    <div v-if="isMounted && categoryDistribution.length > 0" class="mb-3">
      <div class="h-[165px] flex items-center justify-center">
        <VueApexCharts type="donut" height="165" :options="chartOptions" :series="chartSeries" />
      </div>
    </div>

    <!-- Dynamic Category Progress Bars -->
    <div class="space-y-2.5">
      <div
        v-for="(cat, idx) in categoryDistribution.slice(0, 5)"
        :key="cat.name"
        class="flex items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            class="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold shrink-0"
            :style="{ backgroundColor: palette[idx % palette.length] + '20', color: palette[idx % palette.length] }"
          >
            {{ idx + 1 }}
          </span>
          <div class="truncate">
            <p class="font-medium text-gray-800 text-xs sm:text-theme-sm dark:text-white/90 truncate">
              {{ cat.name }}
            </p>
            <span class="block text-gray-400 text-[11px] font-mono">
              {{ shopConfig.currency }}{{ formatNumber(cat.value) }}
            </span>
          </div>
        </div>

        <div class="flex w-full max-w-[120px] items-center gap-2">
          <div class="relative block h-1.5 w-full max-w-[80px] rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: cat.percentage + '%', backgroundColor: palette[idx % palette.length] }"
            ></div>
          </div>
          <p class="font-bold text-gray-700 text-xs dark:text-gray-300 w-7 text-right font-mono">
            {{ cat.percentage }}%
          </p>
        </div>
      </div>

      <div v-if="categoryDistribution.length === 0" class="py-8 text-center text-xs text-gray-400">
        No sales recorded yet. Start billing to view category breakdown.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useShopStore } from '@/composables/useShopStore'

const { shopConfig, categoryDistribution, totalSales } = useShopStore()

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  isMounted.value = false
})

const palette = ['#174478', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316']

const chartSeries = computed(() => categoryDistribution.value.map(c => c.value))

const chartOptions = computed(() => ({
  colors: palette,
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'donut',
  },
  labels: categoryDistribution.value.map(c => c.name),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
      },
    },
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
