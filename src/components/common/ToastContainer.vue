<template>
  <div class="fixed top-20 right-4 sm:right-6 z-[999999] flex flex-col gap-3 pointer-events-none w-full max-w-sm sm:max-w-md px-3 sm:px-0">
    <transition-group
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in activeNotifications"
        :key="toast.id"
        class="pointer-events-auto relative overflow-hidden rounded-xl border bg-white p-4 shadow-theme-lg dark:bg-gray-900 transition-all"
        :class="[
          toast.type === 'success'
            ? 'border-success-500/30 dark:border-success-500/20'
            : toast.type === 'error'
            ? 'border-error-500/30 dark:border-error-500/20'
            : toast.type === 'warning'
            ? 'border-warning-500/30 dark:border-warning-500/20'
            : 'border-blue-light-500/30 dark:border-blue-light-500/20'
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            :class="[
              toast.type === 'success'
                ? 'bg-success-50 text-success-500 dark:bg-success-500/15'
                : toast.type === 'error'
                ? 'bg-error-50 text-error-500 dark:bg-error-500/15'
                : toast.type === 'warning'
                ? 'bg-warning-50 text-warning-500 dark:bg-warning-500/15'
                : 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15'
            ]"
          >
            <!-- Success Icon -->
            <svg
              v-if="toast.type === 'success'"
              class="h-5 w-5 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <!-- Error Icon -->
            <svg
              v-else-if="toast.type === 'error'"
              class="h-5 w-5 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <!-- Info / Warning Icon -->
            <svg
              v-else
              class="h-5 w-5 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 pr-2">
            <h5 class="text-sm font-semibold text-gray-800 dark:text-white/90">
              {{ toast.title }}
            </h5>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            @click="removeNotification(toast.id)"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '@/composables/useShopStore'

const { activeNotifications, removeNotification } = useShopStore()
</script>

