<template>
  <div class="flex flex-wrap items-center justify-between gap-1 sm:gap-3 mb-2 sm:mb-4 min-w-0">
    <h2 :class="['font-semibold text-gray-800 dark:text-white/90 min-w-0 truncate', titleClass || 'text-xs sm:text-base md:text-lg']">
      {{ pageTitle }}
    </h2>
    <nav class="min-w-0 shrink-0">
      <ol class="flex items-center gap-1 text-[10px] sm:text-xs">
        <li>
          <router-link
            class="inline-flex items-center gap-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
            to="/"
          >
            Home
            <svg
              class="stroke-current"
              width="12"
              height="12"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke=""
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </li>
        <li class="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[110px] xs:max-w-[160px] sm:max-w-[280px]">
          {{ pageTitle }}
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbProps {
  pageTitle: string
  titleClass?: string
}

defineProps<BreadcrumbProps>()
</script>
