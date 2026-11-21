<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <ComponentCard>
        <!-- Product Not Found State -->
        <div v-if="productNotFound" class="py-12 text-center space-y-4">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/10">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">Product Not Found</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">The product you are trying to edit does not exist or was removed.</p>
          <router-link
            to="/products"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
          >
            Back to Products
          </router-link>
        </div>

        <!-- Edit Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
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
              <p class="font-semibold text-success-900 dark:text-white">Updated Successfully!</p>
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
                Available Stock <span class="text-error-500">*</span>
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
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Updating...' : 'Update Product' }}</span>
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
const { shopConfig, products, updateProduct, currentShopCategories } = useShopStore()

const productId = computed(() => (route.params.id as string) || '')
const productNotFound = ref(false)

const availableCategories = computed(() => {
  const currentList = [...currentShopCategories.value]
  if (form.category && !currentList.includes(form.category)) {
    currentList.push(form.category)
  }
  return currentList
})

const form = reactive({
  name: '',
  weight: '',
  category: currentShopCategories.value[0] || 'General',
  price: null as number | null,
  stock: 0,
  unit: 'pack',
  barcode: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const pageTitle = computed(() => {
  const name = form.name ? ` (${form.name})` : ''
  return `${shopConfig.value?.shopName || 'SmartShop'} - Edit Product${name}`
})

onMounted(() => {
  const currentId = productId.value
  if (!currentId) {
    productNotFound.value = true
    return
  }

  const existing = products.value.find(p => p.id === currentId)
  if (!existing) {
    productNotFound.value = true
    return
  }

  let rawName = existing.name || ''
  let rawWeight = existing.weight || ''
  const match = rawName.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match) {
    rawName = match[1].trim()
    if (!rawWeight) {
      rawWeight = match[2].trim()
    }
  }

  form.name = rawName
  form.weight = rawWeight
  form.category = existing.category || 'Grains & Pulses'
  form.price = existing.price != null ? existing.price : null
  form.stock = existing.stock != null ? existing.stock : 0
  form.unit = existing.unit || 'pack'
  form.barcode = existing.barcode || ''
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
  let updatedName = form.name.trim()
  let updatedWeight = form.weight.trim()
  const match = updatedName.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match) {
    updatedName = match[1].trim()
    if (!updatedWeight) {
      updatedWeight = match[2].trim()
    }
  }

  updateProduct(productId.value, {
    name: updatedName,
    weight: updatedWeight || undefined,
    category: form.category,
    price: Number(form.price),
    stock: Number(form.stock),
    unit: form.unit,
    barcode: form.barcode.trim() || undefined,
  })

  successMessage.value = `"${updatedName}" has been updated successfully. Redirecting...`

  setTimeout(() => {
    router.push('/products')
  }, 1000)
}
</script>

