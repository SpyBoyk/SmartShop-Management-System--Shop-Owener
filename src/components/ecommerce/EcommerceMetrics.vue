<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
    <!-- 1. Total Sales -->
    <div
      class="group rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs hover:border-brand-500/40 hover:shadow-md transition-all duration-300"
    >
      <div class="flex items-center justify-between">
        <div
          class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-brand-50 text-brand-600 rounded-xl dark:bg-brand-500/10 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <span
          class="inline-flex items-center gap-0.5 rounded-full bg-success-50 py-0.5 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-semibold text-success-600 dark:bg-success-500/15 dark:text-success-500"
        >
          +12.5%
        </span>
      </div>

      <div class="mt-2 sm:mt-2.5">
        <span class="text-[11px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400">Total Sales</span>
        <h4 class="mt-0.5 font-bold text-gray-800 text-sm sm:text-lg dark:text-white/90 truncate">
          {{ shopConfig.currency }}{{ formatNumber(totalSales) }}
        </h4>
      </div>
    </div>

    <!-- 2. Today's Sales -->
    <div
      class="group rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-300"
    >
      <div class="flex items-center justify-between">
        <div
          class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-500/10 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        <span
          class="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 py-0.5 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-500"
        >
          {{ todayOrders }} Orders
        </span>
      </div>

      <div class="mt-2 sm:mt-2.5">
        <span class="text-[11px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400">Today's Sales</span>
        <h4 class="mt-0.5 font-bold text-gray-800 text-sm sm:text-lg dark:text-white/90 truncate">
          {{ shopConfig.currency }}{{ formatNumber(todaySales) }}
        </h4>
      </div>
    </div>

    <!-- 3. Total Orders -->
    <div
      class="group rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all duration-300"
    >
      <div class="flex items-center justify-between">
        <div
          class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-500/10 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>

        <span
          class="inline-flex items-center gap-0.5 rounded-full bg-blue-50 py-0.5 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-500"
        >
          +8.4%
        </span>
      </div>

      <div class="mt-2 sm:mt-2.5">
        <span class="text-[11px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400">Total Orders</span>
        <h4 class="mt-0.5 font-bold text-gray-800 text-sm sm:text-lg dark:text-white/90 truncate">
          {{ totalOrders }}
        </h4>
      </div>
    </div>

    <!-- 4. Monthly Revenue -->
    <div
      class="group rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all duration-300"
    >
      <div class="flex items-center justify-between">
        <div
          class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 text-amber-600 rounded-xl dark:bg-amber-500/10 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <span
          class="inline-flex items-center gap-0.5 rounded-full bg-amber-50 py-0.5 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
        >
          +14.2%
        </span>
      </div>

      <div class="mt-2 sm:mt-2.5">
        <span class="text-[11px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</span>
        <h4 class="mt-0.5 font-bold text-gray-800 text-sm sm:text-lg dark:text-white/90 truncate">
          {{ shopConfig.currency }}{{ formatNumber(monthlyRevenue) }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '@/composables/useShopStore'

const {
  shopConfig,
  totalSales,
  todaySales,
  totalOrders,
  todayOrders,
  monthlyRevenue,
} = useShopStore()

function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString('en-IN')
}
</script>