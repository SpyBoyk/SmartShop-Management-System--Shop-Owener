<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <ComponentCard>
        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
          <!-- Success notification -->
          <div
            v-if="successMessage"
            class="rounded-xl border border-success-200 bg-success-50 p-4 text-sm font-medium text-success-800 dark:border-success-800/40 dark:bg-success-500/10 dark:text-success-300 flex items-center gap-3 transition-all"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400">
              <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-success-900 dark:text-white">Added Successfully!</p>
              <p class="text-xs text-success-700 dark:text-success-400 mt-0.5">{{ successMessage }}</p>
            </div>
          </div>

          <!-- Error notification -->
          <div
            v-if="errorMessage"
            class="rounded-xl border border-error-200 bg-error-50 p-4 text-xs font-medium text-error-700 dark:border-error-800/40 dark:bg-error-500/10 dark:text-error-400"
          >
            {{ errorMessage }}
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Product Name -->
            <div class="sm:col-span-1">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Product Name <span class="text-error-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="e.g. Amul Butter, Basmati Rice"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                required
              />
            </div>

            <!-- Weight / Size -->
            <div class="sm:col-span-1">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Weight / Size <span class="text-xs text-gray-400 font-normal">(e.g. 500g, 1L, 5kg)</span>
              </label>
              <input
                v-model="form.weight"
                type="text"
                placeholder="e.g. 500g, 1L, 10kg, 250ml"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <!-- Category / Section -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Category Section <span class="text-error-500">*</span>
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="form.category"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Category</option>
                  <option
                    v-for="cat in availableCategories"
                    :key="cat"
                    :value="cat"
                    class="dark:bg-gray-900 dark:text-gray-300"
                  >
                    {{ cat }}
                  </option>
                </select>
                <span
                  class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
                >
                  <svg
                    class="stroke-current"
                    width="18"
                    height="18"
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
            </div>

            <!-- Price -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Unit Price ({{ shopConfig.currency }}) <span class="text-error-500">*</span>
              </label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0.5"
                placeholder="0.00"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                required
              />
            </div>

            <!-- Available Stock Quantity -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Initial Available Stock <span class="text-error-500">*</span>
              </label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                placeholder="e.g. 50"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                required
              />
            </div>

            <!-- Unit of Measure -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Packaging / Unit <span class="text-error-500">*</span>
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="form.unit"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 cursor-pointer"
                  required
                >
                  <option value="pack">pack</option>
                  <option value="bag">bag</option>
                  <option value="kg">kg</option>
                  <option value="bottle">bottle</option>
                  <option value="pouch">pouch</option>
                  <option value="jar">jar</option>
                  <option value="tetra">tetra</option>
                  <option value="unit">unit</option>
                </select>
                <span
                  class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
                >
                  <svg
                    class="stroke-current"
                    width="18"
                    height="18"
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
            </div>

            <!-- Barcode / SKU (Optional) -->
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Barcode / SKU (Optional)
              </label>
              <input
                v-model="form.barcode"
                type="text"
                placeholder="e.g. 890123456789"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <router-link
              to="/products"
              class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 transition"
            >
              <svg v-if="!isSubmitting" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Saving...' : 'Save Product' }}</span>
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useShopStore } from '@/composables/useShopStore'

const route = useRoute()
const router = useRouter()
const { shopConfig, addProduct, currentShopCategories, currentShopSections } = useShopStore()

const pageTitle = computed(() => `${shopConfig.value?.shopName || 'SmartShop'} - Add Product`)

const availableCategories = computed(() => currentShopCategories.value)

const form = reactive({
  name: '',
  weight: '',
  category: currentShopCategories.value[0] || 'General',
  price: null as number | null,
  stock: 25,
  unit: 'pack',
  barcode: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

onMounted(() => {
  const sec = (route.query.section as string) || ''
  if (sec) {
    const targetSec = currentShopSections.value.find((s) => s.slug === sec)
    if (targetSec && targetSec.slug !== 'all') {
      form.category = targetSec.name
    } else {
      const match = availableCategories.value.find(
        (c) =>
          c.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(sec) ||
          sec.includes(c.toLowerCase().split(' ')[0])
      )
      if (match) {
        form.category = match
      }
    }
  } else if (!form.category && currentShopCategories.value.length > 0) {
    form.category = currentShopCategories.value[0]
  }
})

function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.name.trim()) {
    errorMessage.value = 'Product name is required.'
    return
  }
  if (!form.price || form.price <= 0) {
    errorMessage.value = 'Please enter a valid price.'
    return
  }
  if (form.stock == null || form.stock < 0) {
    errorMessage.value = 'Stock quantity cannot be negative.'
    return
  }

  isSubmitting.value = true
  let cleanName = form.name.trim()
  let cleanWeight = form.weight.trim()
  const match = cleanName.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match) {
    cleanName = match[1].trim()
    if (!cleanWeight) {
      cleanWeight = match[2].trim()
    }
  }

  addProduct({
    name: cleanName,
    weight: cleanWeight || undefined,
    category: form.category,
    price: Number(form.price),
    stock: Number(form.stock),
    unit: form.unit,
    barcode: form.barcode.trim() || undefined,
  })

  successMessage.value = `"${cleanName}" has been successfully added to ${form.category}. Redirecting...`

  setTimeout(() => {
    router.push('/products')
  }, 1200)
}
</script>
