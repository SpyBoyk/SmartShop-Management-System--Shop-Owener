<template>
  <div
    class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs"
  >
    <div
      class="px-4 pt-3.5 bg-white shadow-default rounded-2xl pb-3 dark:bg-gray-900 sm:px-5 sm:pt-4"
    >
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white/90">Monthly Target & Revenue</h3>
          <p class="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            Target vs Revenue for {{ currentMonthName }}
          </p>
        </div>
        <span class="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          {{ targetPercentage }}% Achieved
        </span>
      </div>

      <div class="relative max-h-[145px] my-0.5">
        <div id="chartTwo" class="h-full flex items-center justify-center">
          <div class="radial-bar-chart">
            <VueApexCharts
              v-if="isMounted"
              type="radialBar"
              height="180"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </div>
        <span
          class="absolute left-1/2 top-[78%] -translate-x-1/2 -translate-y-[78%] rounded-full bg-success-50 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-success-600 dark:bg-success-500/15 dark:text-success-500"
        >
          +{{ Math.min(100, targetPercentage) }}% Target
        </span>
      </div>

      <p class="mx-auto text-center text-[11px] text-gray-500 font-medium">
        Today: <span class="font-bold text-gray-900 dark:text-white">{{ shopConfig.currency }}{{ formatNumber(todaySales) }}</span> ({{ todayOrders }} orders)
      </p>
    </div>

    <div class="flex items-center justify-center gap-4 px-4 py-2 sm:gap-8 sm:py-2.5">
      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-13h-2v6h6v-2h-4z"/>
          </svg>
        </div>
        <div>
          <p class="text-[10px] text-gray-400 uppercase font-semibold">Target</p>
          <p class="text-xs sm:text-sm font-bold text-gray-800 dark:text-white/90 leading-tight">
            {{ shopConfig.currency }}{{ formatNumber(monthlyTargetAmount) }}
          </p>
        </div>
      </div>

      <div class="w-px bg-gray-200 h-5 dark:bg-gray-800"></div>

      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
          </svg>
        </div>
        <div>
          <p class="text-[10px] text-gray-400 uppercase font-semibold">Revenue</p>
          <p class="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
            {{ shopConfig.currency }}{{ formatNumber(monthlyRevenue) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useShopStore } from '@/composables/useShopStore'

const { shopConfig, todaySales, todayOrders, monthlyRevenue } = useShopStore()

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  isMounted.value = false
})

const currentMonthName = computed(() =>
  new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
)

const monthlyTargetAmount = computed(() => {
  // Target benchmark
  return Math.max(100000, Math.round(monthlyRevenue.value * 1.25))
})

const targetPercentage = computed(() => {
  if (monthlyTargetAmount.value <= 0) return 0
  return Math.min(100, Math.round((monthlyRevenue.value / monthlyTargetAmount.value) * 100))
})

const series = computed(() => [targetPercentage.value])

const chartOptions = {
  colors: ['#174478'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'radialBar',
    sparkline: { enabled: true },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: { size: '70%' },
      track: {
        background: '#E5E7EB',
        strokeWidth: '100%',
      },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: -10,
          fontSize: '22px',
          fontWeight: '700',
          formatter: (val: number) => `${val}%`,
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ['#174478'],
  },
  stroke: { lineCap: 'round' },
}

function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString('en-IN')
}
</script>
