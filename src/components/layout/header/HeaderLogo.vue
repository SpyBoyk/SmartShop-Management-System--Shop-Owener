<template>
  <router-link to="/" @click="closeMobileSidebar" class="lg:hidden flex items-center justify-center">
    <img class="h-7 sm:h-9 w-auto max-w-[125px] sm:max-w-[160px] object-contain" src="/images/logo/smartshop-logo-clean.png" alt="SmartShop" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
const { closeMobileSidebar } = useSidebar()
</script>
