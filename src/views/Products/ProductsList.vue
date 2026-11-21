<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="breadcrumbTitle" />

    <div class="space-y-6">
      <ComponentCard>
        <template #title>
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 shadow-xs dark:bg-brand-500/15 dark:text-brand-400 text-base">
              <span>{{ activeSection.iconEmoji }}</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white/90">
                  {{ currentSectionTitle }}
                </h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {{ totalItems }} items
                </span>
              </div>
            </div>
          </div>
        </template>
        <template #action>
          <div class="flex flex-wrap items-center gap-2 sm:gap-2.5 justify-start sm:justify-end min-w-0 shrink-0">
            <!-- Single Section Dropdown Filter -->
            <div class="relative z-20 bg-transparent w-32 sm:w-36 md:w-40 shrink-0">
              <select
                :value="currentSlug"
                @change="onSectionSelect"
                class="dark:bg-dark-900 h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 cursor-pointer"
              >
                <option
                  v-for="sec in sections"
                  :key="sec.slug"
                  :value="sec.slug"
                  class="dark:bg-gray-900 dark:text-gray-300"
                >
                  {{ sec.iconEmoji }} {{ sec.name }}
                </option>
              </select>
              <span
                class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-2 top-1/2 dark:text-gray-400"
              >
                <svg
                  class="stroke-current"
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative w-28 sm:w-32 md:w-36 shrink-0">
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  class="fill-current"
                  width="13"
                  height="13"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                class="h-9 w-full rounded-lg border border-gray-300 bg-white py-1 pl-8 pr-6 text-xs font-medium text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 8.586L4.707 3.293a1 1 0 00-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 001.414 1.414L10 11.414l5.293 5.293a1 1 0 001.414-1.414L11.414 10l5.293-5.293a1 1 0 00-1.414-1.414L10 8.586z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>

            <!-- Add Product Button -->
            <router-link
              :to="addLink"
              class="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg bg-brand-500 text-xs font-semibold text-white shadow-theme-xs hover:bg-brand-600 focus:outline-hidden transition-colors whitespace-nowrap shrink-0"
            >
              <svg
                class="w-3.5 h-3.5 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>+ Add Product</span>
            </router-link>
          </div>
        </template>

        <!-- Mobile View: Compact Product Cards (md:hidden) -->
        <div class="md:hidden space-y-2">
          <div
            v-for="prod in paginatedProducts"
            :key="prod.id"
            class="p-2.5 rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800/60 shadow-2xs space-y-1.5"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="font-bold text-xs text-gray-900 dark:text-white truncate">
                  {{ prod.name }}
                </div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span class="truncate">{{ prod.category }}</span>
                  <span v-if="prod.weight">• {{ prod.weight }}</span>
                  <span v-if="prod.barcode" class="font-mono text-[10px] text-gray-400">• #{{ prod.barcode.slice(-4) }}</span>
                </div>
              </div>

              <div class="text-right shrink-0">
                <div class="text-xs font-black text-brand-600 dark:text-brand-400">
                  {{ shopConfig.currency }}{{ prod.price }}
                </div>
                <span
                  :class="[
                    'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5',
                    {
                      'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                        prod.status === 'In Stock',
                      'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500':
                        prod.status === 'Low Stock',
                      'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                        prod.status === 'Out of Stock',
                    },
                  ]"
                >
                  {{ prod.stock }} in stock
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800/80 text-[11px]">
              <div class="text-gray-400 text-[10px]">
                Sold: <span class="font-semibold text-gray-600 dark:text-gray-300">{{ prod.sold }}</span> • Rev: <span class="font-semibold text-gray-600 dark:text-gray-300">{{ shopConfig.currency }}{{ prod.revenue }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <router-link
                  :to="`/products/edit/${prod.id}`"
                  class="font-semibold text-xs text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10"
                >
                  Edit
                </router-link>
                <button
                  type="button"
                  @click="handleDeleteProduct(prod)"
                  class="font-semibold text-xs text-error-600 dark:text-error-400 px-2 py-0.5 rounded bg-error-50 dark:bg-error-500/10 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="py-6 text-center text-xs text-gray-400">
            No products found in this section.
          </div>
        </div>

        <!-- Desktop Datatable (hidden on mobile, visible md+) -->
        <div
          class="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] min-w-0 max-w-full"
        >
          <div class="w-full max-w-full overflow-x-auto custom-scrollbar">
            <table class="w-full text-left">
              <colgroup>
                <col class="w-auto min-w-[170px]" />
                <col class="w-[95px]" />
                <col class="w-[85px]" />
                <col class="w-[85px]" />
                <col class="w-[95px]" />
                <col class="w-[80px]" />
                <col class="w-[105px]" />
                <col class="w-[75px]" />
              </colgroup>
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.02]">
                  <th class="px-3.5 py-3 text-left min-w-[170px] sm:min-w-[190px] sm:px-4">
                    <div class="flex items-center gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Name</span>
                    </div>
                  </th>
                  <th class="w-[110px] px-3 py-3 text-left whitespace-nowrap sm:px-3.5">
                    <div class="flex items-center gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <span>Weight / Size</span>
                    </div>
                  </th>
                  <th class="w-[100px] px-3 py-3 text-left whitespace-nowrap sm:px-3.5">
                    <div class="flex items-center gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>Unit</span>
                    </div>
                  </th>
                  <th class="w-[95px] px-3 py-3 text-left whitespace-nowrap sm:px-3.5">
                    <div class="flex items-center gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Price</span>
                    </div>
                  </th>
                  <th class="w-[105px] px-3 py-3 text-left whitespace-nowrap sm:px-3.5">
                    <div class="flex items-center gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>Available</span>
                    </div>
                  </th>
                  <th class="w-[90px] px-3 py-3 text-left whitespace-nowrap sm:px-3.5">
                    <div class="flex items-center gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>Sold</span>
                    </div>
                  </th>
                  <th class="w-[115px] px-3 py-3 text-left whitespace-nowrap sm:px-3.5">
                    <div class="flex items-center gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Status</span>
                    </div>
                  </th>
                  <th class="w-[85px] px-3.5 py-3 text-right whitespace-nowrap sm:px-4">
                    <div class="flex items-center justify-end gap-1.5 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span>Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(prod, index) in paginatedProducts"
                  :key="prod.id"
                  class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition"
                >
                  <!-- Name (Product Name Only - Wraps normally) -->
                  <td class="px-3.5 py-3.5 sm:px-4 min-w-[170px] sm:min-w-[190px]">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-6 h-6 flex items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 font-bold text-[10px] shrink-0"
                      >
                        {{ getCleanName(prod.name).charAt(0) }}
                      </div>
                      <span class="font-medium text-gray-800 text-xs dark:text-white/90 leading-snug">
                        {{ getCleanName(prod.name) }}
                      </span>
                    </div>
                  </td>

                  <!-- Weight / Size Column (Digits in small font size text-xs) -->
                  <td class="w-[110px] px-3 py-3.5 sm:px-3.5 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-md font-medium text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {{ getProductWeight(prod) }}
                    </span>
                  </td>

                  <!-- Unit Column (e.g. Per jar, Per pack, Per bottle) -->
                  <td class="w-[100px] px-3 py-3.5 sm:px-3.5 whitespace-nowrap">
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Per {{ prod.unit || 'pack' }}
                    </span>
                  </td>

                  <!-- Price (Digits in small font size text-xs) -->
                  <td class="w-[95px] px-3 py-3.5 sm:px-3.5 whitespace-nowrap">
                    <p class="text-gray-800 font-medium text-xs dark:text-white/90">
                      {{ shopConfig.currency }}{{ prod.price.toFixed(2) }}
                    </p>
                  </td>

                  <!-- Available Stock (Digits in small font size text-xs) -->
                  <td class="w-[105px] px-3 py-3.5 sm:px-3.5 whitespace-nowrap">
                    <p class="text-gray-600 text-xs dark:text-gray-300 font-medium">
                      {{ prod.available }} {{ prod.unit || 'units' }}
                    </p>
                  </td>

                  <!-- Sold Quantity (Digits in small font size text-xs) -->
                  <td class="w-[90px] px-3 py-3.5 sm:px-3.5 whitespace-nowrap">
                    <p class="text-gray-800 font-medium text-xs dark:text-white/90">
                      {{ prod.sold }} sold
                    </p>
                  </td>

                  <!-- Status Badge (No wrap) -->
                  <td class="w-[115px] px-3 py-3.5 sm:px-3.5 whitespace-nowrap">
                    <span
                      :class="[
                        'rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap inline-block',
                        {
                          'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                            prod.status === 'In Stock' || prod.status === 'Top Seller',
                          'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                            prod.status === 'Low Stock',
                          'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                            prod.status === 'Out of Stock',
                        },
                      ]"
                    >
                      {{ prod.status }}
                    </span>
                  </td>

                  <!-- Action Buttons (No wrap) -->
                  <td class="w-[85px] px-3.5 py-3.5 sm:px-4 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <router-link
                        :to="`/products/edit/${prod.id}`"
                        class="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 bg-gray-50 hover:bg-brand-50 hover:text-brand-500 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-brand-500/15 dark:hover:text-brand-400 transition-colors"
                        title="Edit product"
                      >
                        <PencilIcon class="w-3.5 h-3.5" />
                      </router-link>
                      <button
                        @click="handleDeleteProduct(prod)"
                        class="flex h-7 w-7 items-center justify-center rounded-md text-[#d9534f] bg-[#fff3f0] hover:bg-[#ffe5e0] hover:text-[#c9302c] dark:bg-[#d9534f]/15 dark:text-[#ff8a80] dark:hover:bg-[#d9534f]/25 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <TrashIcon class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="filteredProducts.length === 0">
                  <td colspan="8" class="px-5 py-8 text-center text-xs text-gray-400">
                    No products found in this section.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div
            class="px-5 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-white/[0.02]"
          >
            <div class="flex flex-wrap items-center gap-3">
              <!-- Rows per page select with 5, 10, 20, 50, 100 -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Rows per page:
                </span>
                <select
                  v-model.number="pageSize"
                  @change="currentPage = 1"
                  class="h-8 rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-brand-500 focus:outline-hidden cursor-pointer"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>

              <!-- Range Info -->
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Showing
                <span class="font-semibold text-gray-800 dark:text-white">{{ totalItems > 0 ? startIndex + 1 : 0 }}</span>
                to
                <span class="font-semibold text-gray-800 dark:text-white">{{ endIndex }}</span>
                of
                <span class="font-semibold text-gray-800 dark:text-white">{{ totalItems }}</span>
                items
              </p>
            </div>

            <!-- Page Buttons -->
            <div class="flex items-center gap-1.5">
              <button
                :disabled="currentPage <= 1"
                @click="currentPage--"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Previous page"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg text-xs font-semibold transition',
                  currentPage === page
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                ]"
              >
                {{ page }}
              </button>

              <button
                :disabled="currentPage >= totalPages"
                @click="currentPage++"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Next page"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useShopStore } from '@/composables/useShopStore'
import { PencilIcon, TrashIcon } from '@/icons'

const route = useRoute()
const router = useRouter()
const { shopConfig, productsWithStats, deleteProduct, currentShopSections, currentShopMeta } = useShopStore()

function getCleanName(name?: string): string {
  if (!name) return ''
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

function getProductWeight(prod: any): string {
  if (prod.weight && prod.weight.trim()) {
    return prod.weight.trim()
  }
  const match = (prod.name || '').match(/\(([^)]+)\)/)
  if (match) {
    return match[1].trim()
  }
  return prod.unit ? `1 ${prod.unit}` : '-'
}

function handleDeleteProduct(prod: any) {
  const displayName = getCleanName(prod.name)
  if (window.confirm(`Are you sure you want to delete "${displayName}" from inventory?`)) {
    deleteProduct(prod.id)
  }
}

const searchQuery = ref((route.query.q as string) || '')

watch(
  () => route.query.q,
  (val) => {
    if (typeof val === 'string') {
      searchQuery.value = val
    }
  }
)

const sections = computed(() => currentShopSections.value)

function onSectionSelect(event: Event) {
  const target = event.target as HTMLSelectElement
  if (target && target.value) {
    router.push('/products/' + target.value)
  }
}

const currentSlug = computed(() => {
  const param = (route.params.category as string) || 'all'
  return sections.value.some(s => s.slug === param) ? param : 'all'
})

const activeSection = computed(() => {
  return sections.value.find(s => s.slug === currentSlug.value) || sections.value[0] || { slug: 'all', name: 'All Products', iconEmoji: '🏷️', desc: 'All products' }
})

const currentSectionTitle = computed(() => {
  return activeSection.value.name
})

const addLink = computed(() => {
  if (currentSlug.value && currentSlug.value !== 'all') {
    return `/products/new?section=${currentSlug.value}`
  }
  return '/products/new'
})

const currentSectionDesc = computed(() => {
  return activeSection.value.desc
})

const breadcrumbTitle = computed(() => {
  return `${shopConfig.value?.shopName || 'SmartShop'} - Products (${activeSection.value.name})`
})

function matchesCategory(prodCategory: string, slug: string): boolean {
  if (!slug || slug === 'all') return true
  const target = sections.value.find(s => s.slug === slug)
  if (!target) return false
  const catLower = (prodCategory || '').toLowerCase().trim()
  const targetLower = target.name.toLowerCase().trim()
  return catLower === targetLower || catLower.includes(targetLower) || targetLower.includes(catLower)
}

function getProductCount(slug: string): number {
  return productsWithStats.value.filter(p => matchesCategory(p.category, slug)).length
}

const filteredProducts = computed(() => {
  let list = productsWithStats.value.filter(p => matchesCategory(p.category, currentSlug.value))
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p => {
      const clean = getCleanName(p.name).toLowerCase()
      const cat = (p.category || '').toLowerCase()
      const wt = getProductWeight(p).toLowerCase()
      return clean.includes(q) || cat.includes(q) || wt.includes(q)
    })
  }
  return list
})

// --- Pagination (5, 10, 20, 50, 100) ---
const pageSize = ref(10)
const currentPage = ref(1)

// Auto-reset to page 1 whenever section or search changes
watch([currentSlug, searchQuery], () => {
  currentPage.value = 1
})

const totalItems = computed(() => filteredProducts.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value) || 1)

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, totalItems.value))

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const pages: number[] = []
  for (let i = 1; i <= total; i++) {
    pages.push(i)
  }
  return pages
})
</script>
