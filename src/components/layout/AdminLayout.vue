<template>
  <div class="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
    <app-sidebar />
    <Backdrop />
    <ToastContainer />
    <div
      class="flex-1 flex flex-col min-w-0 w-full transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px] lg:w-[calc(100%-290px)]' : 'lg:ml-[90px] lg:w-[calc(100%-90px)]']"
    >
      <app-header />
      <main class="flex-1 p-2.5 sm:p-4 md:p-6 mx-auto w-full max-w-(--breakpoint-2xl) min-w-0">
        <slot></slot>
      </main>
      <!-- Footer -->
      <footer class="p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6 pt-0">
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          Developed by <span class="font-semibold text-gray-800 dark:text-white/90">Kalpesh</span> &amp; 
          <a 
            href="https://tailadmin.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-brand-500 hover:text-brand-600 transition-colors duration-200 font-medium"
          >
            TailAdmin
          </a>
          ~ Distributed by 
          <a 
            href="https://themewagon.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-brand-500 hover:text-brand-600 transition-colors duration-200 font-medium"
          >
            ThemeWagon
          </a>
          .
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import Backdrop from './Backdrop.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
const { isExpanded, isHovered } = useSidebar()
</script>
