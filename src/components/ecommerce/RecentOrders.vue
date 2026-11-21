<template>
  <ComponentCard>
    <template #title>
      <div class="flex items-center gap-2">
        <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white/90">
          {{
            viewMode === 'best'
              ? 'Top-Selling Items'
              : viewMode === 'matrix'
              ? 'Department Performance Matrix'
              : 'Recent Customer Bills'
          }}
        </h3>
      </div>
    </template>

    <template #action>
      <div class="flex items-center gap-1 max-w-full overflow-x-auto no-scrollbar rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
        <button
          @click="viewMode = 'best'"
          :class="[
            'rounded-md px-2 py-1 text-[11px] font-semibold transition whitespace-nowrap',
            viewMode === 'best'
              ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          ]"
        >
          Top Selling ({{ bestSellingProducts.length }})
        </button>
        <button
          @click="viewMode = 'matrix'"
          :class="[
            'rounded-md px-2 py-1 text-[11px] font-semibold transition whitespace-nowrap',
            viewMode === 'matrix'
              ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          ]"
        >
          Department Matrix ({{ categoryMatrix.length }})
        </button>
        <button
          @click="viewMode = 'recent'"
          :class="[
            'rounded-md px-2 py-1 text-[11px] font-semibold transition whitespace-nowrap',
            viewMode === 'recent'
              ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          ]"
        >
          Recent Bills ({{ recentOrders.length }})
        </button>
      </div>
    </template>

    <!-- Table 1: Best Selling Products Mode (Exact BasicTableOne Component Style) -->
    <div
      v-if="viewMode === 'best'"
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.02]">
              <th class="px-3.5 py-2.5 text-left w-4/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Product</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Price</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Units Sold</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Revenue</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(prod, index) in bestSellingProducts"
              :key="prod.id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition"
            >
              <td class="px-3.5 py-3 sm:px-4">
                <div class="flex items-center gap-2.5">
                  <div
                    :class="[
                      'w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0',
                      index === 0
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        : index === 1
                        ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        : index === 2
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                        : 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                    ]"
                  >
                    #{{ index + 1 }}
                  </div>
                  <div class="min-w-0">
                    <span class="block font-medium text-gray-800 text-theme-xs dark:text-white/90 truncate">
                      {{ prod.name }}
                    </span>
                    <span class="block text-gray-400 text-[11px]">
                      {{ prod.category }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-600 text-theme-xs dark:text-gray-300 font-medium">
                  {{ shopConfig.currency }}{{ prod.price }}
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-800 text-theme-xs dark:text-white/90 font-semibold">
                  {{ prod.quantity }} units
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold inline-block',
                    {
                      'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400':
                        index < 3,
                      'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400':
                        index >= 3,
                    },
                  ]"
                >
                  {{ index < 3 ? 'Top Seller' : 'In Stock' }}
                </span>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-emerald-600 dark:text-emerald-400 font-bold text-theme-xs">
                  {{ shopConfig.currency }}{{ formatNumber(prod.revenue) }}
                </p>
              </td>
            </tr>
            <tr v-if="bestSellingProducts.length === 0">
              <td colspan="5" class="px-5 py-6 text-center text-theme-xs text-gray-400">
                No sales data available yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table 2: Department Performance Matrix Mode (Exact BasicTableOne Component Style) -->
    <div
      v-else-if="viewMode === 'matrix'"
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.02]">
              <th class="px-3.5 py-2.5 text-left w-3/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Department</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-1/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">SKUs</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Available Stock</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Units Sold</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Avg Unit Price</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-1/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Revenue</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="cat in categoryMatrix"
              :key="cat.name"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition"
            >
              <td class="px-3.5 py-3 sm:px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0">
                    <component :is="getCategoryIcon(cat.slug)" class="w-4 h-4" />
                  </div>
                  <span class="block font-medium text-gray-800 text-theme-xs dark:text-white/90">
                    {{ cat.name }}
                  </span>
                </div>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-600 text-theme-xs dark:text-gray-300 font-medium">
                  {{ cat.skus }}
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-600 text-theme-xs dark:text-gray-300 font-medium">
                  {{ cat.totalStock }}
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-800 text-theme-xs dark:text-white/90 font-semibold">
                  {{ cat.totalSold }} sold
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-600 text-theme-xs dark:text-gray-300 font-medium">
                  {{ shopConfig.currency }}{{ cat.avgPrice.toFixed(2) }}
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold inline-block',
                    cat.share >= 20
                      ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400'
                      : cat.share >= 10
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                  ]"
                >
                  {{ cat.share >= 20 ? 'High Performer' : cat.share >= 10 ? 'Steady' : 'Normal' }}
                </span>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-emerald-600 dark:text-emerald-400 font-bold text-theme-xs">
                  {{ shopConfig.currency }}{{ formatNumber(cat.revenue) }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table 3: Recent Orders Mode (Exact BasicTableOne Component Style) -->
    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.02]">
              <th class="px-3.5 py-2.5 text-left w-3/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Order ID</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-3/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Customer</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Date & Time</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
              </th>
              <th class="px-3.5 py-2.5 text-left w-2/12 sm:px-4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Amount</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="order in recentOrders"
              :key="order.id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition"
            >
              <td class="px-3.5 py-3 sm:px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 flex items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-bold text-[10px] shrink-0">
                    POS
                  </div>
                  <div class="min-w-0">
                    <span class="block font-medium text-gray-800 text-theme-xs dark:text-white/90">
                      {{ order.id }}
                    </span>
                    <span class="block text-gray-400 text-[11px] truncate max-w-xs">
                      {{ order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ') }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-600 text-theme-xs dark:text-gray-300 font-medium">
                  {{ order.customerName || 'Walk-in Customer' }}
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-gray-500 text-[11px] whitespace-nowrap">
                  {{ new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) }},
                  {{ new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </p>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <span
                  class="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400 inline-block"
                >
                  Completed
                </span>
              </td>
              <td class="px-3.5 py-3 sm:px-4">
                <p class="text-emerald-600 dark:text-emerald-400 font-bold text-theme-xs">
                  {{ shopConfig.currency }}{{ order.total.toFixed(2) }}
                </p>
              </td>
            </tr>
            <tr v-if="recentOrders.length === 0">
              <td colspan="5" class="px-5 py-8 text-center text-xs text-gray-400">
                No orders generated yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ComponentCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useShopStore } from '@/composables/useShopStore'
import {
  Pill,
  FlaskConical,
  Bandage,
  Sparkles,
  HeartPulse,
  Activity,
  Wheat,
  Droplet,
  Milk,
  Cookie,
  Coffee,
  Sparkle,
  Smartphone,
  Headphones,
  Cable,
  Shield,
  Layers,
  Watch,
  Package,
} from 'lucide-vue-next'

const {
  shopConfig,
  bestSellingProducts,
  recentOrders,
  currentShopSections,
  productsWithStats,
  totalSales,
} = useShopStore()

const viewMode = ref<'best' | 'matrix' | 'recent'>('best')

const sectionIconMap: Record<string, any> = {
  // Medical Shop / Pharmacy
  'tablets-capsules': Pill,
  'syrups-suspensions': FlaskConical,
  'first-aid-surgical': Bandage,
  'personal-care-hygiene': Sparkles,
  'baby-mother-care': HeartPulse,
  'medical-devices-wellness': Activity,

  // Supermarket
  'grains-pulses': Wheat,
  'oils-ghee': Droplet,
  'dairy-bakery': Milk,
  'snacks-biscuits': Cookie,
  'beverages': Coffee,
  'household-care': Sparkle,

  // Mobile / Electronics
  'smartphones': Smartphone,
  'audio-headphones': Headphones,
  'chargers-cables': Cable,
  'cases-protection': Shield,
  'power-banks': Layers,
  'wearables': Watch,
}

function getCategoryIcon(slug: string) {
  return sectionIconMap[slug] || Package
}

const categoryMatrix = computed(() => {
  const sections = currentShopSections.value.filter((s) => s.slug !== 'all')
  return sections.map((sec) => {
    const catProds = productsWithStats.value.filter((p) => p.category === sec.name)
    const skus = catProds.length
    const totalStock = catProds.reduce((sum, p) => sum + p.available, 0)
    const totalSold = catProds.reduce((sum, p) => sum + p.sold, 0)
    const revenue = catProds.reduce((sum, p) => sum + p.revenue, 0)
    const avgP = skus > 0 ? catProds.reduce((sum, p) => sum + p.price, 0) / skus : 0
    const share = totalSales.value > 0 ? Math.round((revenue / totalSales.value) * 100) : 0

    return {
      name: sec.name,
      slug: sec.slug,
      skus,
      totalStock,
      totalSold,
      avgPrice: avgP,
      revenue,
      share,
    }
  }).sort((a, b) => b.revenue - a.revenue)
})

function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString('en-IN')
}
</script>
