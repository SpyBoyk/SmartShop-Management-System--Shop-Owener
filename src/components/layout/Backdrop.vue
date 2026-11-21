<template>
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-9990 lg:hidden"
    @click="closeMobileSidebar"
  ></div>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
const { closeMobileSidebar, isMobileOpen } = useSidebar()
</script>
