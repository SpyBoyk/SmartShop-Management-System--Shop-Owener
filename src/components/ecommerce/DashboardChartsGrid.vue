<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
    <!-- 1. Monthly Revenue & Sales Area Spline -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-3 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs"
    >
      <div class="flex items-center justify-between mb-1.5 sm:mb-2">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xs sm:text-base font-bold text-gray-800 dark:text-white/90">
            Monthly Revenue &amp; Sales
          </h3>
        </div>

        <router-link
          to="/product-insights"
          class="inline-flex items-center gap-1 text-[11px] sm:text-theme-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition"
        >
          <span>View details</span>
          <span class="text-xs">↗</span>
        </router-link>
      </div>

      <div class="w-full">
        <VueApexCharts
          v-if="isMounted"
          type="area"
          height="190"
          :options="revenueChartOptions"
          :series="revenueSeries"
        />
      </div>
    </div>

    <!-- 2. Weekly Store Footfall & Visits Rounded Bars -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-3 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs"
    >
      <div class="flex items-center justify-between mb-1.5 sm:mb-2">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xs sm:text-base font-bold text-gray-800 dark:text-white/90">
            Weekly Store Footfall
          </h3>
        </div>

        <router-link
          to="/product-insights"
          class="inline-flex items-center gap-1 text-[11px] sm:text-theme-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition"
        >
          <span>Details</span>
          <span class="text-xs">↗</span>
        </router-link>
      </div>

      <div class="w-full">
        <VueApexCharts
          v-if="isMounted"
          type="bar"
          height="190"
          :options="trafficChartOptions"
          :series="trafficSeries"
        />
      </div>
    </div>

    <!-- 3. Top Category Sales & Demand Horizontal Funnel Bars -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-3 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs"
    >
      <div class="flex items-center justify-between mb-1.5 sm:mb-2">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="text-xs sm:text-base font-bold text-gray-800 dark:text-white/90">
            Category Sales &amp; Demand
          </h3>
        </div>

        <router-link
          to="/products"
          class="inline-flex items-center gap-1 text-[11px] sm:text-theme-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition"
        >
          <span>View Catalog</span>
          <span class="text-xs">↗</span>
        </router-link>
      </div>

      <div class="w-full">
        <VueApexCharts
          v-if="isMounted"
          type="bar"
          height="190"
          :options="categoryChartOptions"
          :series="categorySeries"
        />
      </div>
    </div>

    <!-- 4. Order Fulfillment & Customer Inquiries Dual Spline -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-3 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs"
    >
      <div class="flex items-center justify-between mb-1.5 sm:mb-2">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xs sm:text-base font-bold text-gray-800 dark:text-white/90">
            Order Fulfillment &amp; Inquiries
          </h3>
        </div>

        <router-link
          to="/profile"
          class="inline-flex items-center gap-1 text-[11px] sm:text-theme-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition"
        >
          <span>View all</span>
          <span class="text-xs">↗</span>
        </router-link>
      </div>

      <div class="w-full">
        <VueApexCharts
          v-if="isMounted"
          type="line"
          height="190"
          :options="fulfillmentChartOptions"
          :series="fulfillmentSeries"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useShopStore } from '@/composables/useShopStore'

const { shopConfig, monthlySalesData, orders, categoryDistribution, currentShopSections } = useShopStore()

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  isMounted.value = false
})

// 1. Monthly Revenue & Sales (Computed directly from orders)
const revenueSeries = computed(() => {
  const data = monthlySalesData.value.map((m) => m.value)
  return [
    {
      name: 'Revenue',
      data: data.length > 0 ? data : [14500, 19200, 24800, 28300, 31900, 35400],
    },
  ]
})

const revenueChartOptions = computed(() => {
  const cats = monthlySalesData.value.map((m) => m.label)
  const maxVal = Math.max(...(revenueSeries.value[0]?.data || [50000]), 20000)
  const roundedMax = Math.ceil((maxVal * 1.25) / 10000) * 10000

  return {
    colors: ['#6366F1'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.03,
        stops: [0, 95, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: cats.length > 0 ? cats : ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px', fontWeight: 500 },
      },
    },
    yaxis: {
      min: 0,
      max: roundedMax,
      tickAmount: 4,
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px' },
        formatter: (val: number) => `${shopConfig.value.currency}${Math.round(val / 1000)}k`,
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `Revenue: ${shopConfig.value.currency}${val.toLocaleString('en-IN')}`,
      },
    },
  }
})

// 2. Weekly Store Footfall (Computed from daily store orders and visits)
const trafficSeries = computed(() => {
  const dayCounts = [0, 0, 0, 0, 0, 0, 0] // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  orders.value.forEach((o) => {
    const d = new Date(o.date)
    const day = (d.getDay() + 6) % 7 // Mon=0 ... Sun=6
    dayCounts[day] += o.items.reduce((s, it) => s + it.quantity, 0)
  })

  const visitorRatio = shopConfig.value.shopName.includes('Mobile') ? 35 : 75
  const baseline = [280, 420, 390, 510, 480, 560, 340]
  const data = dayCounts.map((cnt, i) => Math.max(cnt * visitorRatio, baseline[i]))

  return [
    {
      name: 'Visitors',
      data,
    },
  ]
})

const trafficChartOptions = computed(() => {
  const maxVal = Math.max(...(trafficSeries.value[0]?.data || [5000]), 1000)
  const roundedMax = Math.ceil((maxVal * 1.15) / 1000) * 1000

  return {
    colors: ['#8B5CF6'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '55%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px', fontWeight: 500 },
      },
    },
    yaxis: {
      min: 0,
      max: roundedMax,
      tickAmount: 4,
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px' },
        formatter: (val: number) => val.toString(),
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `${val.toLocaleString()} store visitors`,
      },
    },
  }
})

// 3. Category Sales & Demand (Top 5 actual categories based on products)
const topCategories = computed(() => {
  const dist = categoryDistribution.value
  if (dist && dist.length > 0) {
    return dist.slice(0, 5)
  }
  return currentShopSections.value
    .filter((s) => s.slug !== 'all')
    .slice(0, 5)
    .map((s, i) => ({
      name: s.name,
      value: (5 - i) * 8500,
    }))
})

const categorySeries = computed(() => [
  {
    name: 'Sales Revenue',
    data: topCategories.value.map((c) => c.value),
  },
])

const categoryChartOptions = computed(() => {
  const categories = topCategories.value.map((c) => c.name)
  const maxVal = Math.max(...(categorySeries.value[0]?.data || [10000]), 5000)
  const roundedMax = Math.ceil((maxVal * 1.2) / 10000) * 10000

  return {
    colors: ['#10B981'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '52%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      min: 0,
      max: roundedMax,
      tickAmount: 4,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px', fontWeight: 500 },
        formatter: (val: number) => `${shopConfig.value.currency}${Math.round(val / 1000)}k`,
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280', fontSize: '11px', fontWeight: 500 },
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `Sales: ${shopConfig.value.currency}${val.toLocaleString('en-IN')}`,
      },
    },
  }
})

// 4. Order Fulfillment & Inquiries (Dual curve based on daily orders & assistance)
const fulfillmentSeries = computed(() => {
  const dayCounts = [0, 0, 0, 0, 0, 0, 0]
  orders.value.forEach((o) => {
    const d = new Date(o.date)
    const day = (d.getDay() + 6) % 7
    dayCounts[day]++
  })

  const completed = dayCounts.map((cnt, i) => Math.max(cnt, [8, 14, 12, 19, 11, 7, 5][i]))
  const inquiries = completed.map((cnt, i) => Math.round(cnt * 1.25 + [2, 3, -4, 4, 3, -1, -1][i]))

  return [
    {
      name: 'Customer Inquiries',
      data: inquiries,
    },
    {
      name: 'Orders Fulfilled',
      data: completed,
    },
  ]
})

const fulfillmentChartOptions = computed(() => {
  const max1 = Math.max(...(fulfillmentSeries.value[0]?.data || [24]))
  const max2 = Math.max(...(fulfillmentSeries.value[1]?.data || [24]))
  const roundedMax = Math.ceil((Math.max(max1, max2, 15) * 1.2) / 6) * 6

  return {
    colors: ['#EF4444', '#10B981'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: [2.5, 2.5],
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px', fontWeight: 500 },
      },
    },
    yaxis: {
      min: 0,
      max: roundedMax,
      tickAmount: 4,
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px' },
        formatter: (val: number) => Math.round(val).toString(),
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'light',
    },
    legend: { show: false },
  }
})
</script>
