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
          <!-- Success State -->
          <div v-if="isSuccess" class="text-center py-8">
            <div class="w-16 h-16 rounded-full bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset Successful!</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your password has been updated. Redirecting to Sign In...
            </p>
            <router-link
              to="/signin"
              class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-theme-xs hover:bg-brand-600 transition"
            >
              Sign In Now →
            </router-link>
          </div>

          <!-- Form State -->
          <div v-else>
            <div class="mb-6 sm:mb-8">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Set New Password
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Enter your 6-digit code and create a new password.
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

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Email -->
              <div>
                <label
                  for="email"
                  class="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address <span class="text-error-500">*</span>
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

              <!-- 6-Digit Code -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label
                    for="code"
                    class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    6-Digit Verification Code <span class="text-error-500">*</span>
                  </label>
                  <router-link to="/forgot-password" class="text-xs text-brand-500 hover:text-brand-600 font-semibold">
                    Resend code
                  </router-link>
                </div>
                <input
                  v-model="code"
                  type="text"
                  id="code"
                  required
                  maxlength="6"
                  placeholder="e.g. 482910"
                  class="h-11 w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-base font-mono tracking-widest text-gray-800 shadow-theme-xs placeholder:text-gray-400 placeholder:tracking-normal focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                />
              </div>

              <!-- New Password -->
              <div>
                <label
                  for="newPassword"
                  class="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    id="newPassword"
                    required
                    placeholder="At least 6 characters"
                    class="h-11 w-full rounded-xl border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Confirm New Password -->
              <div>
                <label
                  for="confirmPassword"
                  class="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  required
                  placeholder="Re-enter your new password"
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
                  <span>{{ isLoading ? 'Updating Password...' : 'Reset Password' }}</span>
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
            Security &amp; Peace of Mind
          </h2>
          <p class="text-sm text-gray-300 dark:text-white/60 leading-relaxed max-w-sm">
            Keep your business and sales data secure with encrypted credentials and verified account access.
          </p>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { useAuthStore } from '@/composables/useAuthStore'

const route = useRoute()
const router = useRouter()
const { resetPassword } = useAuthStore()

const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  if (route.query.email && typeof route.query.email === 'string') {
    email.value = route.query.email
  }
  if (route.query.code && typeof route.query.code === 'string') {
    code.value = route.query.code
  }
})

const handleSubmit = () => {
  errorMessage.value = ''

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match. Please ensure both passwords match.'
    return
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.'
    return
  }

  isLoading.value = true

  setTimeout(() => {
    const result = resetPassword(email.value, code.value, newPassword.value)
    isLoading.value = false

    if (!result.success) {
      errorMessage.value = result.error || 'Failed to reset password.'
      return
    }

    isSuccess.value = true

    setTimeout(() => {
      router.push('/signin')
    }, 2000)
  }, 300)
}
</script>
