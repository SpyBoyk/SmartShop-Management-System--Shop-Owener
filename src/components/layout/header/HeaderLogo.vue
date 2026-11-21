<template>
  <router-link to="/" @click="closeMobileSidebar" class="lg:hidden flex items-center justify-center">
    <img class="h-8 sm:h-10 w-auto max-w-[135px] sm:max-w-[170px] object-contain" src="/images/logo/smartshop-logo-clean.png" alt="SmartShop" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
const { closeMobileSidebar } = useSidebar()
</script>
