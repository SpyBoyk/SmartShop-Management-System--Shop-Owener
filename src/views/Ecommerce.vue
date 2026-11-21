<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="space-y-4 md:space-y-5">
      <!-- 4 KPI Metric Cards across the top in a single horizontal row -->
      <EcommerceMetrics />

      <!-- The 4 Distinct Attractive Charts from reference UI in 2 by 2 format with store data -->
      <DashboardChartsGrid />

      <!-- Operational Tables: Recent Bills & Top-Selling Items -->
      <div id="best-selling" class="scroll-mt-24">
        <RecentOrders />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EcommerceMetrics from '@/components/ecommerce/EcommerceMetrics.vue'
import DashboardChartsGrid from '@/components/ecommerce/DashboardChartsGrid.vue'
import RecentOrders from '@/components/ecommerce/RecentOrders.vue'
import { useShopStore } from '@/composables/useShopStore'

const { shopConfig } = useShopStore()

const currentPageTitle = computed(() => `${shopConfig.value.shopName} - Sales Dashboard`)
</script>
