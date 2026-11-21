<template>
  <FullScreenLayout>
    <div class="min-h-screen flex flex-col lg:flex-row w-full bg-white dark:bg-gray-900">
      <!-- Left Form Section -->
      <div class="flex flex-col justify-between w-full lg:w-1/2 min-h-screen p-6 sm:p-10 lg:p-14">
        <!-- Top Back Link -->
        <div>
          <router-link
            to="/signin"
            class="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sign In
          </router-link>
        </div>

        <!-- Center Form -->
        <div class="w-full max-w-md mx-auto my-auto py-8">
          <div class="mb-6 sm:mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and we'll send a 6-digit recovery code to reset your password.
            </p>
          </div>

          <!-- Error Alert Banner -->
          <div
            v-if="errorMessage"
            class="mb-5 flex items-center gap-3 rounded-xl border border-error-200 bg-error-50/80 p-3.5 text-xs text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
          >
            <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Generated Code Showcase -->
          <div
            v-if="generatedCode"
            class="mb-6 p-4 rounded-2xl border border-success-200 bg-success-50/80 dark:border-success-500/20 dark:bg-success-500/10"
          >
            <div class="flex items-center gap-2 mb-2 text-success-700 dark:text-success-400 font-bold text-sm">
              <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Recovery Code Generated</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Your 6-digit verification code for <span class="font-bold text-gray-800 dark:text-white">{{ email }}</span>:
            </p>
            <div class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-success-200 dark:border-gray-700 mb-3 shadow-xs">
              <span class="text-2xl font-mono font-bold tracking-widest text-brand-600 dark:text-brand-400">
                {{ generatedCode }}
              </span>
              <span class="text-[11px] font-semibold text-gray-400">Valid 15m</span>
            </div>
            <router-link
              :to="`/reset-password?email=${encodeURIComponent(email)}&code=${generatedCode}`"
              class="flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-xs shadow-xs hover:bg-brand-600 transition"
            >
              <span>Continue to Set New Password →</span>
            </router-link>
          </div>

          <form v-if="!generatedCode" @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Registered Email Address <span class="text-error-500">*</span>
              </label>
              <input
                v-model="email"
                type="email"
                id="email"
                required
                placeholder="name@company.com"
                class="h-11 w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
              />
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white transition rounded-xl bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-70 cursor-pointer"
              >
                <span v-if="isLoading" class="inline-block animate-spin mr-2">⟳</span>
                <span>{{ isLoading ? 'Sending Code...' : 'Send Reset Code' }}</span>
              </button>
            </div>
          </form>

          <!-- Footer Link -->
          <div class="mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Remember your password?
            <router-link
              to="/signin"
              class="font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 ml-1 transition"
            >
              Back to Sign In
            </router-link>
          </div>
        </div>

        <!-- Bottom Spacer -->
        <div class="text-xs text-gray-400 text-center lg:text-left">
          &copy; {{ new Date().getFullYear() }} SmartShop. All rights reserved.
        </div>
      </div>

      <!-- Right Hero Section (Full-Height Seamless Dark Panel) -->
      <div
        class="hidden lg:flex lg:w-1/2 min-h-screen bg-brand-950 dark:bg-white/5 items-center justify-center relative p-12 overflow-hidden"
      >
        <div class="flex flex-col items-center justify-center z-1 w-full max-w-md text-center">
          <CommonGridShape />
          <router-link to="/" class="block mb-6">
            <img class="h-14 w-auto max-w-[210px] object-contain" src="/images/logo/smartshop-logo-clean.png" alt="SmartShop" />
          </router-link>
          <h2 class="text-2xl font-bold text-white mb-3 tracking-tight">
            Account Recovery
          </h2>
          <p class="text-sm text-gray-300 dark:text-white/60 leading-relaxed max-w-sm">
            Quickly verify and recover access to your retail dashboard and business records.
          </p>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { useAuthStore } from '@/composables/useAuthStore'

const { requestPasswordReset } = useAuthStore()

const email = ref('kalpesh@smartshop.com')
const generatedCode = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleSubmit = () => {
  errorMessage.value = ''
  isLoading.value = true

  setTimeout(() => {
    const result = requestPasswordReset(email.value)
    isLoading.value = false

    if (!result.success) {
      errorMessage.value = result.error || 'Failed to generate reset code.'
      return
    }

    generatedCode.value = result.code || ''
  }, 300)
}
</script>
