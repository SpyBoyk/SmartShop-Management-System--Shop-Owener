<template>
  <div
    :class="[
      'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] min-w-0 max-w-full overflow-hidden',
      className,
    ]"
  >
    <!-- Card Header -->
    <div
      v-if="title || desc || $slots.action || $slots.title"
      class="px-3 sm:px-6 py-2.5 sm:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 min-w-0"
    >
      <div class="min-w-0 grow">
        <slot name="title">
          <h3 v-if="title" class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white/90">
            {{ title }}
          </h3>
        </slot>
        <p v-if="desc" class="mt-0.5 text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
          {{ desc }}
        </p>
      </div>
      <div v-if="$slots.action" class="flex flex-wrap items-center gap-1.5 sm:gap-2.5 min-w-0 shrink-0">
        <slot name="action"></slot>
      </div>
    </div>

    <!-- Card Body -->
    <div
      :class="[
        'p-2.5 sm:p-5 lg:p-6 min-w-0 max-w-full',
        (title || desc || $slots.action || $slots.title) && 'border-t border-gray-100 dark:border-gray-800',
      ]"
    >
      <div class="space-y-3 sm:space-y-5 min-w-0 max-w-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  className?: string
  desc?: string
}

defineProps<Props>()
</script>
