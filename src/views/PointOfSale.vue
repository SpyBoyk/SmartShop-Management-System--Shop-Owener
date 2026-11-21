<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Product Scanner & POS Billing" />

    <!-- Top Status & Mode Bar -->
    <div
      class="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 shrink-0 shadow-theme-xs"
        >
          <ScanBarcode class="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white/90 truncate">
              POS Scanner &amp; Billing
            </h1>
            <span
              :class="[
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border shrink-0',
                currentShopMeta.badgeClass,
              ]"
            >
              <span>{{ currentShopMeta.icon }}</span>
              <span class="hidden xs:inline">{{ currentShopMeta.shortName }}</span>
            </span>
          </div>
          <p class="hidden sm:block text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
            D-Mart style continuous scanning with dynamic open database auto-pricing
          </p>
        </div>
      </div>

      <!-- Quick Toggles -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Sound Effect Toggle -->
        <button
          type="button"
          @click="soundEnabled = !soundEnabled"
          :title="soundEnabled ? 'Mute scanner beep' : 'Enable scanner beep'"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] cursor-pointer"
        >
          <Volume2 v-if="soundEnabled" class="h-4 w-4 text-emerald-500" />
          <VolumeX v-else class="h-4 w-4 text-gray-400" />
          <span class="hidden md:inline">{{ soundEnabled ? 'Sound On' : 'Muted' }}</span>
        </button>

        <!-- Quick Cart Count Badge -->
        <button
          type="button"
          @click="mobileActiveTab = 'bill'"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition cursor-pointer"
        >
          <ShoppingCart class="h-4 w-4" />
          <span>{{ cartTotalQuantity }} <span class="hidden xs:inline">items</span> (₹{{ formattedCartSum }})</span>
        </button>
      </div>
    </div>

    <!-- Mobile Screen Quick Section Switcher (lg:hidden) -->
    <div class="lg:hidden flex items-center justify-between gap-1 p-1 mb-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
      <button
        type="button"
        @click="mobileActiveTab = 'scanner'"
        :class="[
          'flex-1 py-2 px-1.5 rounded-lg text-xs font-semibold transition text-center flex items-center justify-center gap-1 cursor-pointer',
          mobileActiveTab === 'scanner'
            ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800',
        ]"
      >
        <ScanBarcode class="h-3.5 w-3.5" />
        <span>Scanner</span>
      </button>

      <button
        type="button"
        @click="mobileActiveTab = 'catalog'"
        :class="[
          'flex-1 py-2 px-1.5 rounded-lg text-xs font-semibold transition text-center flex items-center justify-center gap-1 cursor-pointer',
          mobileActiveTab === 'catalog'
            ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800',
        ]"
      >
        <Search class="h-3.5 w-3.5" />
        <span>Catalog</span>
      </button>

      <button
        type="button"
        @click="mobileActiveTab = 'bill'"
        :class="[
          'flex-1 py-2 px-1.5 rounded-lg text-xs font-semibold transition text-center flex items-center justify-center gap-1 cursor-pointer',
          mobileActiveTab === 'bill'
            ? 'bg-brand-500 text-white shadow-xs'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800',
        ]"
      >
        <Receipt class="h-3.5 w-3.5" />
        <span>Bill ({{ cartTotalQuantity }})</span>
      </button>
    </div>

    <!-- Main Scanner & POS Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
      <!-- LEFT COLUMN: SCANNER, BARCODE & CATALOG SEARCH (7 Cols) -->
      <div class="lg:col-span-7 space-y-4 sm:space-y-5">
        <!-- SCANNER WORKSPACE CARD -->
        <div
          :class="[
            'rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs',
            { 'hidden lg:block': mobileActiveTab !== 'scanner' },
          ]"
        >
          <!-- Scanner Header with Mode Tabs -->
          <div class="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 min-w-0">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  :class="isCameraActive ? 'bg-emerald-400' : 'bg-brand-400'"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2.5 w-2.5"
                  :class="isCameraActive ? 'bg-emerald-500' : 'bg-brand-500'"
                ></span>
              </span>
              <h2 class="text-base font-semibold text-gray-800 dark:text-white/90 truncate">
                Scanner Station
              </h2>
            </div>

            <!-- Tab Buttons -->
            <div class="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800 shrink-0">
              <button
                type="button"
                @click="activeScanTab = 'camera'; if (!isCameraActive) startCamera()"
                :class="[
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition cursor-pointer',
                  activeScanTab === 'camera'
                    ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                ]"
              >
                <Camera class="h-3.5 w-3.5" />
                <span>Live Camera</span>
              </button>
              <button
                type="button"
                @click="activeScanTab = 'barcode'"
                :class="[
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition cursor-pointer',
                  activeScanTab === 'barcode'
                    ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                ]"
              >
                <ScanBarcode class="h-3.5 w-3.5" />
                <span>Barcode Gun</span>
              </button>
            </div>
          </div>

          <!-- TAB 1: LIVE CAMERA QR/BARCODE SCANNER -->
          <div v-show="activeScanTab === 'camera'" class="space-y-3">
            <div class="relative overflow-hidden rounded-xl bg-gray-950 aspect-video max-h-[220px] sm:max-h-[300px] flex items-center justify-center">
              <!-- Video Feed -->
              <video
                ref="videoRef"
                autoplay
                playsinline
                muted
                class="w-full h-full object-cover"
                :class="{ hidden: !isCameraActive }"
              ></video>

              <!-- Viewfinder Overlay (When Camera Active) -->
              <div
                v-if="isCameraActive"
                class="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                <!-- Semi-transparent vignette border -->
                <div class="relative w-64 h-48 sm:w-72 sm:h-52 border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                  <!-- Corner Reticles -->
                  <div class="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm"></div>
                  <div class="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm"></div>
                  <div class="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm"></div>
                  <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-sm"></div>

                  <!-- Laser scan line animation -->
                  <div class="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-scanner-laser"></div>

                  <!-- Instruction badge -->
                  <div class="absolute bottom-2 inset-x-0 text-center">
                    <span class="inline-block bg-black/70 backdrop-blur-xs text-[11px] text-emerald-300 px-2.5 py-0.5 rounded-full">
                      Align QR or Barcode inside frame
                    </span>
                  </div>
                </div>
              </div>

              <!-- Camera Inactive / Standby State -->
              <div
                v-if="!isCameraActive"
                class="flex flex-col items-center justify-center p-4 sm:p-6 text-center text-gray-400"
              >
                <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-800/80 flex items-center justify-center mb-2.5">
                  <Camera class="h-6 w-6 text-gray-300" />
                </div>
                <h3 class="text-xs sm:text-sm font-semibold text-gray-200 mb-1">Camera Scanner Standby</h3>
                <p class="text-[11px] sm:text-xs text-gray-400 max-w-xs mb-3">
                  Scan QR codes and barcodes continuously from your device camera.
                </p>
                <button
                  type="button"
                  @click="startCamera"
                  :disabled="isCameraStarting"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-theme-xs hover:bg-brand-600 transition cursor-pointer disabled:opacity-50"
                >
                  <Camera class="h-4 w-4" />
                  <span>{{ isCameraStarting ? 'Starting Scanner...' : 'Start Camera Scanner' }}</span>
                </button>
              </div>

              <!-- Last Scanned Floating Alert Badge -->
              <transition
                enter-active-class="transform ease-out duration-300 transition"
                enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:scale-95"
                enter-to-class="translate-y-0 opacity-100 sm:scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="lastScannedSuccess"
                  class="absolute top-3 inset-x-3 bg-emerald-600/95 backdrop-blur-md text-white rounded-xl p-2.5 shadow-lg flex items-center justify-between text-xs z-20"
                >
                  <div class="flex items-center gap-2 truncate">
                    <CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-200" />
                    <span class="font-bold truncate">{{ lastScannedSuccess.name }}</span>
                    <span class="text-emerald-200 font-semibold">₹{{ lastScannedSuccess.price }}</span>
                  </div>
                  <span class="bg-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-semibold shrink-0">
                    Added to Bill!
                  </span>
                </div>
              </transition>
            </div>

            <!-- Camera Controls (When Active) -->
            <div v-if="isCameraActive" class="flex items-center justify-between pt-1">
              <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active scanner</span>
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  v-if="hasMultipleCameras"
                  type="button"
                  @click="switchCamera"
                  class="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <RefreshCw class="h-3 w-3" />
                  <span>Switch</span>
                </button>
                <button
                  type="button"
                  @click="stopCamera"
                  class="inline-flex items-center gap-1 rounded-lg border border-error-200 bg-error-50 px-2.5 py-1 text-xs font-medium text-error-700 hover:bg-error-100 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400 cursor-pointer"
                >
                  <CameraOff class="h-3 w-3" />
                  <span>Stop</span>
                </button>
              </div>
            </div>

            <!-- Camera Error Banner if any -->
            <div
              v-if="cameraErrorMessage"
              class="rounded-xl border border-amber-300/60 bg-amber-50/90 dark:border-amber-500/30 dark:bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1.5"
            >
              <div class="flex items-start gap-2">
                <span class="text-base shrink-0">⚠️</span>
                <div class="text-[11px] leading-relaxed">
                  <p class="font-semibold">{{ cameraErrorMessage }}</p>
                  <div class="mt-1.5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      @click="activeScanTab = 'barcode'"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/60 dark:bg-amber-500/20 text-amber-900 dark:text-amber-100 font-bold hover:opacity-90 cursor-pointer"
                    >
                      Use Barcode Gun / Manual Input
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2 / DEDICATED INPUT: HARDWARE SCANNER & BARCODE SEARCH -->
          <div :class="{ 'mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-800': activeScanTab === 'camera' }">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              USB Barcode Gun / Manual Barcode Input
            </label>
            <form @submit.prevent="handleBarcodeSubmit" class="flex flex-col sm:flex-row gap-2.5">
              <div class="relative flex-1">
                <input
                  ref="barcodeInputRef"
                  v-model="barcodeInputValue"
                  type="text"
                  placeholder="Scan barcode gun or enter code (e.g. 890172518101)"
                  class="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent pl-9 pr-3 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  @keydown.enter.prevent="handleBarcodeSubmit"
                />
                <ScanBarcode class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button
                type="submit"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-center text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition shrink-0 cursor-pointer"
              >
                <Plus class="h-4 w-4" />
                <span>Scan &amp; Add</span>
              </button>
            </form>
          </div>
        </div>

        <!-- MANUAL PRODUCT SEARCH & CATALOG QUICK-ADD -->
        <div
          :class="[
            'rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs',
            { 'hidden lg:block': mobileActiveTab !== 'catalog' },
          ]"
        >
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3.5">
            <div>
              <h2 class="text-base font-semibold text-gray-800 dark:text-white/90">
                Catalog Search &amp; Manual Quick-Add
              </h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Browse catalog or create a custom one-time item for this bill
              </p>
            </div>

            <button
              type="button"
              @click="openCustomItemModal = true"
              class="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-400 transition cursor-pointer shadow-theme-xs"
            >
              <Plus class="h-3.5 w-3.5" />
              <span>+ Custom Manual Item</span>
            </button>
          </div>

          <!-- Search Bar -->
          <div class="relative mb-3">
            <input
              v-model="catalogSearchQuery"
              type="text"
              placeholder="Search by product name, barcode or category..."
              class="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent pl-9 pr-4 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              v-if="catalogSearchQuery"
              @click="catalogSearchQuery = ''"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <!-- Category Quick Filter Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-3">
            <button
              type="button"
              @click="selectedCategoryFilter = 'all'"
              :class="[
                'rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition cursor-pointer',
                selectedCategoryFilter === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
              ]"
            >
              All Categories
            </button>
            <button
              v-for="cat in currentShopCategories"
              :key="cat"
              type="button"
              @click="selectedCategoryFilter = cat"
              :class="[
                'rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition cursor-pointer',
                selectedCategoryFilter === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
              ]"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Product Catalog Grid / Scrollable Results -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
            <div
              v-for="prod in filteredCatalogProducts"
              :key="prod.id"
              class="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-brand-200 bg-gray-50/40 hover:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-gray-800 transition shadow-2xs group"
            >
              <div class="min-w-0 pr-2">
                <p class="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {{ prod.name }}
                </p>
                <div class="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  <span class="truncate">{{ prod.category }}</span>
                  <span v-if="prod.weight">• {{ prod.weight }}</span>
                  <span>• Stock: {{ prod.stock }}</span>
                </div>
                <div class="text-xs font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">
                  ₹{{ prod.price.toLocaleString('en-IN') }}
                </div>
              </div>

              <button
                type="button"
                @click="addProductToCart(prod)"
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-700 shadow-2xs hover:bg-brand-500 hover:text-white hover:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-brand-500 transition cursor-pointer shrink-0"
                title="Add to Bill"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>

            <div
              v-if="filteredCatalogProducts.length === 0"
              class="col-span-2 py-8 text-center text-xs text-gray-400"
            >
              No products found matching "{{ catalogSearchQuery }}".
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: LIVE CART & BILLING SUM (5 Cols) -->
      <div
        :class="[
          'lg:col-span-5 space-y-3 sm:space-y-4',
          { 'hidden lg:block': mobileActiveTab !== 'bill' },
        ]"
      >
        <div
          class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs flex flex-col min-h-[480px] lg:min-h-[580px]"
        >
          <!-- Cart Header -->
          <div class="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800 mb-3.5">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 shrink-0">
                <Receipt class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-gray-800 dark:text-white/90">
                  Active Bill &amp; Scanned Entries
                </h2>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ cartItems.length }} line {{ cartItems.length === 1 ? 'item' : 'items' }} • D-Mart Process
                </p>
              </div>
            </div>

            <button
              v-if="cartItems.length > 0"
              type="button"
              @click="clearCart"
              class="text-xs text-error-600 hover:text-error-700 dark:text-error-400 font-medium cursor-pointer"
            >
              Clear Bill
            </button>
          </div>

          <!-- Customer Name Input -->
          <div class="mb-3.5">
            <div class="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <span>Customer Details</span>
              <span class="text-gray-400 text-[11px]">Optional</span>
            </div>
            <input
              v-model="customerName"
              type="text"
              placeholder="Customer Name (e.g. Walk-in Customer)"
              class="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <!-- Scanned Items Table / List (Fully Dynamic & Editable) -->
          <div class="flex-1 overflow-y-auto max-h-[340px] space-y-2 mb-3 pr-1">
            <div
              v-for="item in cartItems"
              :key="item.productId"
              class="p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-800/40 space-y-1.5"
            >
              <!-- Row 1: Product Name, Category & Delete Button -->
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {{ item.productName }}
                  </div>
                  <div class="text-[10px] text-gray-400">
                    {{ item.category }}
                  </div>
                </div>

                <button
                  type="button"
                  @click="removeFromCart(item.productId)"
                  class="flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 transition cursor-pointer"
                  title="Remove this item"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>

              <!-- Row 2: Dynamic Editable Unit Price, Editable Quantity Stepper, and Dynamic Line Total -->
              <div class="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-gray-800/80 text-xs">
                <!-- Editable Unit Price -->
                <div class="flex items-center gap-1">
                  <span class="text-gray-400 text-[11px]">₹</span>
                  <input
                    v-model.number="item.price"
                    type="number"
                    min="0"
                    @input="onItemPriceChange(item)"
                    title="Click to edit unit price"
                    class="h-7 w-16 rounded-md border border-gray-200 bg-white px-1.5 text-xs font-semibold text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                  <span class="text-gray-400 text-[10px]">each</span>
                </div>

                <!-- Quantity Stepper with Direct Editable Number Input -->
                <div class="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    @click="updateQuantity(item.productId, item.quantity - 1)"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 cursor-pointer"
                  >
                    <Minus class="h-3 w-3" />
                  </button>
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    @input="onItemQtyInput(item)"
                    class="h-7 w-11 rounded-md border border-gray-200 bg-white text-center text-xs font-bold text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    @click="updateQuantity(item.productId, item.quantity + 1)"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 cursor-pointer"
                  >
                    <Plus class="h-3 w-3" />
                  </button>
                </div>

                <!-- Dynamic Line Total -->
                <div class="text-right shrink-0">
                  <span class="font-extrabold text-sm text-gray-900 dark:text-white">
                    ₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="cartItems.length === 0"
              class="flex flex-col items-center justify-center py-12 text-center text-gray-400"
            >
              <div class="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                <ScanBarcode class="h-6 w-6 text-gray-400" />
              </div>
              <p class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                No items added yet
              </p>
              <p class="text-[11px] text-gray-400 max-w-[220px] mt-0.5">
                Scan product barcodes via camera, barcode gun, or catalog search.
              </p>
            </div>
          </div>

          <!-- LIVE BILLING TOTAL / SUM CALCULATION -->
          <div class="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <!-- Subtotal -->
            <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Subtotal ({{ cartTotalQuantity }} items)</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">
                ₹{{ subtotalAmount.toLocaleString('en-IN') }}
              </span>
            </div>

            <!-- GST / Tax row -->
            <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input
                  v-model="applyTax"
                  type="checkbox"
                  class="rounded border-gray-300 text-brand-500 focus:ring-brand-400 h-3.5 w-3.5"
                />
                <span>Apply GST (5%)</span>
              </label>
              <span class="font-medium text-gray-800 dark:text-gray-200">
                ₹{{ taxAmount.toLocaleString('en-IN') }}
              </span>
            </div>

            <!-- Discount Row -->
            <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-1.5">
                <span>Discount (₹)</span>
                <input
                  v-model.number="discountAmount"
                  type="number"
                  min="0"
                  :max="subtotalAmount"
                  placeholder="0"
                  class="h-6 w-16 rounded border border-gray-200 bg-gray-50 px-1.5 text-xs text-right text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <span class="font-medium text-emerald-600 dark:text-emerald-400">
                - ₹{{ Number(discountAmount || 0).toLocaleString('en-IN') }}
              </span>
            </div>

            <!-- PROMINENT AMOUNT TO TELL CUSTOMER BOX -->
            <div
              class="mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white shadow-theme-xs flex items-center justify-between"
            >
              <div>
                <span class="text-[10px] uppercase tracking-wider font-bold text-white/80 block">
                  Amount to Tell Customer
                </span>
                <span class="text-xs text-white/90">
                  {{ cartTotalQuantity }} items • Total Bill Amount
                </span>
              </div>
              <div class="text-right">
                <div class="text-2xl sm:text-3xl font-black tracking-tight">
                  ₹{{ grandTotalSum.toLocaleString('en-IN') }}
                </div>
              </div>
            </div>

            <!-- Two Main Action Buttons: Show Payment QR & Save to Database -->
            <div class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                @click="openQrModal = true"
                :disabled="cartItems.length === 0"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-500 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-theme-xs hover:bg-brand-50 dark:hover:bg-brand-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer w-full"
                title="Display QR code on screen for customer to scan and pay"
              >
                <QrCode class="h-4 w-4" />
                <span>Show Payment QR</span>
              </button>

              <button
                type="button"
                @click="saveSaleToDatabase"
                :disabled="cartItems.length === 0 || isSavingSale"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-theme-xs disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer w-full"
                title="Deduct stock inventory and record sale in database"
              >
                <CheckCircle2 class="h-4 w-4" />
                <span>{{ isSavingSale ? 'Saving...' : 'Save to Database' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Bottom Mobile Cart Summary Pill (lg:hidden) -->
    <transition
      enter-active-class="transform ease-out duration-200 transition"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="cartItems.length > 0 && mobileActiveTab !== 'bill'"
        class="lg:hidden fixed bottom-3 inset-x-3 z-40 bg-gray-950/95 text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between border border-gray-800 backdrop-blur-md"
      >
        <div>
          <div class="text-[11px] text-gray-300 font-medium">
            {{ cartTotalQuantity }} items • Total Sum
          </div>
          <div class="text-base font-black text-emerald-400">
            ₹{{ grandTotalSum.toLocaleString('en-IN') }}
          </div>
        </div>

        <button
          type="button"
          @click="mobileActiveTab = 'bill'"
          class="rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Bill / Pay</span>
          <span>→</span>
        </button>
      </div>
    </transition>

    <!-- MODAL 0: STORE PAYMENT SCANNER QR MODAL -->
    <div
      v-if="openQrModal"
      class="fixed inset-0 z-99999 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-white p-5 sm:p-6 dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 text-center animate-in fade-in zoom-in-95 duration-150"
      >
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
          <div class="flex items-center gap-2">
            <QrCode class="h-5 w-5 text-brand-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">
              Scan &amp; Pay QR Code
            </h3>
          </div>
          <button
            type="button"
            @click="openQrModal = false"
            class="text-gray-400 hover:text-gray-600 text-base cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3">
          <div class="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {{ currentShopMeta.name }}
          </div>

          <!-- Dynamic UPI QR Code Image with Bill Amount -->
          <div class="flex justify-center p-3 bg-white rounded-2xl border border-gray-200 shadow-inner w-fit mx-auto">
            <img
              :src="storeQrCodeUrl"
              alt="Store Payment QR"
              class="w-52 h-52 object-contain"
            />
          </div>

          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Total Bill to Pay</div>
            <div class="text-3xl font-black text-brand-600 dark:text-brand-400">
              ₹{{ grandTotalSum.toLocaleString('en-IN') }}
            </div>
          </div>

          <p class="text-[11px] text-gray-400">
            Customer can scan using Google Pay, PhonePe, Paytm, BHIM or any UPI scanner.
          </p>

          <div class="pt-2 flex items-center gap-2">
            <button
              type="button"
              @click="openQrModal = false"
              class="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              @click="confirmPaidAndSave"
              class="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-theme-xs"
            >
              Confirm &amp; Save Bill
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 1: MANUAL CUSTOM ITEM MODAL -->
    <div
      v-if="openCustomItemModal"
      class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white p-5 dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150"
      >
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
          <div class="flex items-center gap-2">
            <Plus class="h-5 w-5 text-brand-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">
              Add Custom Manual Item
            </h3>
          </div>
          <button
            type="button"
            @click="openCustomItemModal = false"
            class="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleCustomItemSubmit" class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Item Name <span class="text-error-500">*</span>
            </label>
            <input
              v-model="customItemName"
              type="text"
              required
              placeholder="e.g. Loose Brown Sugar / Custom Service"
              class="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Unit Price (₹) <span class="text-error-500">*</span>
              </label>
              <input
                v-model.number="customItemPrice"
                type="number"
                min="1"
                required
                placeholder="100"
                class="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Quantity <span class="text-error-500">*</span>
              </label>
              <input
                v-model.number="customItemQty"
                type="number"
                min="1"
                required
                placeholder="1"
                class="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              v-model="customItemCategory"
              class="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="General">General / Miscellaneous</option>
              <option v-for="c in currentShopCategories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="openCustomItemModal = false"
              class="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 cursor-pointer"
            >
              Add Item to Bill
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 1.5: QUICK ADD UNREGISTERED SCANNED ITEM MODAL -->
    <div
      v-if="openQuickAddModal"
      class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white p-5 dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150"
      >
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
          <div class="flex items-center gap-2">
            <Sparkles class="h-5 w-5 text-amber-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">
              New Product Scanned!
            </h3>
          </div>
          <button
            type="button"
            @click="openQuickAddModal = false"
            class="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>

        <div class="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <ScanBarcode class="h-5 w-5 text-amber-600 shrink-0" />
            <div class="min-w-0">
              <p class="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Detected Barcode / Serial:</p>
              <p class="text-xs font-mono font-bold text-amber-950 dark:text-amber-100 truncate">{{ unregisteredBarcode }}</p>
            </div>
          </div>
          <span class="text-[10px] bg-amber-200/60 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-medium shrink-0">
            Ready to Save
          </span>
        </div>

        <form @submit.prevent="saveQuickAddProduct" class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Product Name <span class="text-error-500">*</span>
            </label>
            <input
              v-model="unregisteredName"
              type="text"
              required
              autofocus
              placeholder="e.g. Apple 20W Power Adapter"
              class="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Selling Price (₹) <span class="text-error-500">*</span>
              </label>
              <input
                v-model="unregisteredPrice"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="1799"
                class="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                v-model="unregisteredCategory"
                class="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="General">General</option>
                <option v-for="c in currentShopCategories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              type="button"
              @click="quickBillUnknownItem"
              class="w-full sm:w-auto rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200 cursor-pointer"
            >
              Quick Bill as Generic
            </button>
            <button
              type="submit"
              class="w-full sm:w-auto rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition cursor-pointer shadow-xs"
            >
              + Save & Add to Bill
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: PRINTABLE BILL / INVOICE RECEIPT MODAL -->
    <div
      v-if="completedInvoice"
      class="fixed inset-0 z-99999 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <!-- Printable Area Wrapper -->
        <div id="printable-receipt" class="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <!-- Header -->
          <div class="text-center pb-4 border-b border-dashed border-gray-300 dark:border-gray-700">
            <div class="inline-flex items-center justify-center gap-1.5 font-bold text-lg text-brand-600 dark:text-brand-400">
              <span>{{ currentShopMeta.icon }}</span>
              <span>{{ currentShopMeta.name }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ currentShopMeta.tagline }}
            </p>
            <p class="text-[11px] text-gray-400 mt-1">
              Receipt #: <span class="font-mono font-semibold">{{ completedInvoice.id }}</span> • Date: {{ completedInvoice.formattedDate }}
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Customer: <span class="font-medium text-gray-800 dark:text-gray-200">{{ completedInvoice.customerName }}</span>
            </p>
          </div>

          <!-- Items Table -->
          <div class="py-3 border-b border-dashed border-gray-300 dark:border-gray-700 text-xs">
            <div class="grid grid-cols-12 font-semibold text-gray-500 dark:text-gray-400 pb-1.5 border-b border-gray-100 dark:border-gray-800">
              <span class="col-span-6">Item</span>
              <span class="col-span-2 text-center">Qty</span>
              <span class="col-span-2 text-right">Price</span>
              <span class="col-span-2 text-right">Total</span>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-800 max-h-48 overflow-y-auto">
              <div
                v-for="item in completedInvoice.items"
                :key="item.productId"
                class="grid grid-cols-12 py-1.5 text-xs"
              >
                <span class="col-span-6 font-medium truncate">{{ item.productName }}</span>
                <span class="col-span-2 text-center text-gray-500">{{ item.quantity }}</span>
                <span class="col-span-2 text-right text-gray-500">₹{{ item.price }}</span>
                <span class="col-span-2 text-right font-semibold">₹{{ item.total }}</span>
              </div>
            </div>
          </div>

          <!-- Total Calculation Breakdown -->
          <div class="py-3 border-b border-dashed border-gray-300 dark:border-gray-700 space-y-1.5 text-xs">
            <div class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>₹{{ completedInvoice.subtotal.toLocaleString('en-IN') }}</span>
            </div>
            <div v-if="completedInvoice.tax > 0" class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>GST (5%)</span>
              <span>₹{{ completedInvoice.tax.toLocaleString('en-IN') }}</span>
            </div>
            <div v-if="completedInvoice.discount > 0" class="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span>- ₹{{ completedInvoice.discount.toLocaleString('en-IN') }}</span>
            </div>
            <div class="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-800">
              <span>Grand Total</span>
              <span class="text-brand-600 dark:text-brand-400">₹{{ completedInvoice.grandTotal.toLocaleString('en-IN') }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-3 text-center text-[11px] text-gray-400">
            <p>Payment: <span class="font-semibold text-gray-700 dark:text-gray-300 uppercase">{{ completedInvoice.paymentMode }}</span></p>
            <p class="mt-1 font-medium text-gray-500">Thank you for your purchase! Visit again.</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
          <button
            type="button"
            @click="closeInvoice"
            class="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 cursor-pointer"
          >
            New Sale
          </button>
          <button
            type="button"
            @click="printReceipt"
            class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition cursor-pointer shadow-theme-xs"
          >
            <Printer class="h-4 w-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useShopStore, type Product, type OrderItem } from '@/composables/useShopStore'
import { resolveGlobalProduct } from '@/composables/useGlobalProductLookup'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { DecodeHintType, BarcodeFormat } from '@zxing/library'
import {
  ScanBarcode,
  Camera,
  CameraOff,
  Plus,
  Minus,
  Trash2,
  Search,
  Receipt,
  Printer,
  CheckCircle2,
  Volume2,
  VolumeX,
  ShoppingCart,
  Sparkles,
  RefreshCw,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  QrCode,
} from 'lucide-vue-next'

const {
  products,
  currentShopMeta,
  currentShopCategories,
  createOrder,
  showNotification,
  findProductByBarcode,
  addProduct,
} = useShopStore()

// --- State ---
const soundEnabled = ref(true)
const mobileActiveTab = ref<'scanner' | 'catalog' | 'bill'>('scanner')
const activeScanTab = ref<'camera' | 'barcode'>('camera')
const barcodeInputValue = ref('')
const barcodeInputRef = ref<HTMLInputElement | null>(null)

// Camera State (@zxing/browser continuous multi-format reader with enhanced hints)
const hints = new Map()
hints.set(DecodeHintType.TRY_HARDER, true)
hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.ITF,
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
])

const videoRef = ref<HTMLVideoElement | null>(null)
const zxingScanner = new BrowserMultiFormatReader(hints)
let zxingControls: IScannerControls | null = null
let lastScannedBarcode = ''
let lastScanTimestamp = 0

// Scanner Mutex & Pause Controls
const isProcessingScan = ref(false)
const isScanPaused = ref(false)

// Quick Add Unregistered Barcode Modal State
const openQuickAddModal = ref(false)
const unregisteredBarcode = ref('')
const unregisteredName = ref('')
const unregisteredPrice = ref<number | string>('')
const unregisteredCategory = ref('General')

const isCameraActive = ref(false)
const isCameraStarting = ref(false)
const cameraErrorMessage = ref('')
const hasMultipleCameras = ref(false)
const availableVideoDevices = ref<MediaDeviceInfo[]>([])
const selectedCameraDeviceId = ref<string | undefined>(undefined)

const isSecureOrigin = computed(() => {
  if (typeof window === 'undefined') return true
  return window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
})

// Success Toast
const lastScannedSuccess = ref<{ name: string; price: number } | null>(null)

// Catalog Search
const catalogSearchQuery = ref('')
const selectedCategoryFilter = ref<string>('all')

// Custom Item Modal
const openCustomItemModal = ref(false)
const customItemName = ref('')
const customItemPrice = ref<number | ''>('')
const customItemQty = ref(1)
const customItemCategory = ref('General')

// Cart / Billing Entries
const cartItems = ref<OrderItem[]>([])
const customerName = ref('')
const applyTax = ref(true)
const discountAmount = ref<number>(0)
const selectedPaymentMode = ref<'cash' | 'upi' | 'card' | 'credit'>('upi')
const isCheckingOut = ref(false)
const openQrModal = ref(false)
const isSavingSale = ref(false)

const storeQrCodeUrl = computed(() => {
  const upiString = `upi://pay?pa=smartshop@upi&pn=${encodeURIComponent(
    currentShopMeta.value.name
  )}&am=${grandTotalSum.value}&cu=INR&tn=${encodeURIComponent('Bill Payment')}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`
})

// Completed Invoice for Receipt Modal
interface CompletedInvoice {
  id: string
  formattedDate: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  grandTotal: number
  paymentMode: string
}
const completedInvoice = ref<CompletedInvoice | null>(null)

const paymentMethods = [
  { id: 'upi', name: 'UPI / QR', icon: Smartphone },
  { id: 'cash', name: 'Cash', icon: Banknote },
  { id: 'card', name: 'Card', icon: CreditCard },
  { id: 'credit', name: 'Khata', icon: Wallet },
]

// --- Audio Synth (Cashier Beep) ---
function playScannerBeep() {
  if (!soundEnabled.value) return
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1050, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch (e) {
    // Ignore audio permission or autoplay restrictions
  }
}

// --- Cart Calculations ---
const cartTotalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.total, 0)
})

const formattedCartSum = computed(() => {
  return subtotalAmount.value.toLocaleString('en-IN')
})

const taxAmount = computed(() => {
  if (!applyTax.value) return 0
  return Math.round(subtotalAmount.value * 0.05)
})

const grandTotalSum = computed(() => {
  const disc = Number(discountAmount.value || 0)
  const total = subtotalAmount.value + taxAmount.value - disc
  return Math.max(0, Math.round(total))
})

// --- Filtered Catalog ---
const filteredCatalogProducts = computed(() => {
  const q = catalogSearchQuery.value.toLowerCase().trim()
  const cat = selectedCategoryFilter.value

  return products.value.filter(p => {
    const matchesCat = cat === 'all' || p.category === cat
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    return matchesCat && matchesQuery
  }).slice(0, 24)
})

// --- Cart Operations (Standard D-Mart Style) ---
function addProductToCart(product: {
  id: string
  name: string
  price: number
  category?: string
  barcode?: string
}) {
  playScannerBeep()

  const cleanBarcode = product.barcode ? product.barcode.trim().replace(/^0+/, '') : ''

  // Look for existing item in active bill:
  // 1. By matching barcode
  // 2. By matching productId
  // 3. By matching clean product name
  const existingIndex = cartItems.value.findIndex(item => {
    if (cleanBarcode && item.barcode) {
      if (item.barcode.trim().replace(/^0+/, '') === cleanBarcode) return true
    }
    if (item.productId && item.productId === product.id) return true
    if (item.productName.trim().toLowerCase() === product.name.trim().toLowerCase()) return true
    return false
  })

  if (existingIndex !== -1) {
    // D-Mart Rule: IF SAME PRODUCT OCCURS -> USE + (INCREMENT QUANTITY)
    cartItems.value[existingIndex].quantity += 1
    cartItems.value[existingIndex].total =
      cartItems.value[existingIndex].quantity * cartItems.value[existingIndex].price

    lastScannedSuccess.value = {
      name: `${cartItems.value[existingIndex].productName} (Qty: ${cartItems.value[existingIndex].quantity})`,
      price: cartItems.value[existingIndex].total,
    }

    showNotification({
      type: 'success',
      title: 'Quantity Increased (+1)',
      message: `${cartItems.value[existingIndex].productName} × ${cartItems.value[existingIndex].quantity} = ₹${cartItems.value[existingIndex].total.toLocaleString('en-IN')}`,
      duration: 2500,
    })
  } else {
    // Brand new item line
    cartItems.value.push({
      productId: product.id,
      barcode: product.barcode,
      productName: product.name,
      category: product.category || 'General',
      quantity: 1,
      price: product.price,
      total: product.price,
    })

    lastScannedSuccess.value = { name: product.name, price: product.price }

    showNotification({
      type: 'success',
      title: 'Item Added to Bill',
      message: `${product.name} (₹${product.price}) added to bill.`,
      duration: 2500,
    })
  }

  setTimeout(() => {
    lastScannedSuccess.value = null
  }, 2200)
}

function updateQuantity(productId: string, newQty: number) {
  if (newQty <= 0) {
    removeFromCart(productId)
    return
  }
  const item = cartItems.value.find(i => i.productId === productId)
  if (item) {
    item.quantity = newQty
    item.total = item.quantity * item.price
  }
}

function removeFromCart(productId: string) {
  cartItems.value = cartItems.value.filter(i => i.productId !== productId)
}

function clearCart() {
  if (cartItems.value.length === 0) return
  if (confirm('Are you sure you want to clear the active bill?')) {
    cartItems.value = []
    discountAmount.value = 0
  }
}

function onItemPriceChange(item: OrderItem) {
  item.price = Math.max(0, Number(item.price) || 0)
  item.total = item.price * item.quantity
}

function onItemQtyInput(item: OrderItem) {
  item.quantity = Math.max(1, Number(item.quantity) || 1)
  item.total = item.price * item.quantity
}

function saveSaleToDatabase() {
  if (cartItems.value.length === 0) return
  isSavingSale.value = true

  setTimeout(() => {
    createOrder(cartItems.value, customerName.value.trim() || 'Walk-in Customer')
    showNotification({
      type: 'success',
      title: 'Sale Saved in Database!',
      message: `Bill of ₹${grandTotalSum.value.toLocaleString('en-IN')} recorded & stock updated!`,
      duration: 4000,
    })
    cartItems.value = []
    customerName.value = ''
    discountAmount.value = 0
    isSavingSale.value = false
    openQrModal.value = false
    mobileActiveTab.value = 'scanner'
  }, 250)
}

function confirmPaidAndSave() {
  saveSaleToDatabase()
}

// --- Barcode / QR Lookup & Processing (Standard D-Mart Process) ---
async function processBarcodeScan(barcode: string) {
  const cleanCode = (barcode || '').trim()
  if (!cleanCode) return
  const normalizedCode = cleanCode.replace(/^0+/, '')

  // 1. D-Mart Rule: If product already exists on current customer bill, directly increment quantity (+)
  const existingBillItem = cartItems.value.find(item => {
    if (item.barcode && item.barcode.trim().replace(/^0+/, '') === normalizedCode) return true
    return false
  })

  if (existingBillItem) {
    existingBillItem.quantity += 1
    existingBillItem.total = existingBillItem.quantity * existingBillItem.price

    playScannerBeep()
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([80, 40, 80])
      } catch (e) {}
    }

    lastScannedSuccess.value = {
      name: `${existingBillItem.productName} (Qty: ${existingBillItem.quantity})`,
      price: existingBillItem.total,
    }

    showNotification({
      type: 'success',
      title: 'Quantity Increased (+1)',
      message: `${existingBillItem.productName} × ${existingBillItem.quantity} = ₹${existingBillItem.total.toLocaleString('en-IN')}`,
      duration: 2500,
    })
    return
  }

  // 2. Check local store inventory
  const lookup = findProductByBarcode(cleanCode)
  if (lookup && lookup.product) {
    const matched = lookup.product
    addProductToCart({
      id: matched.id,
      barcode: matched.barcode || cleanCode,
      name: matched.name,
      price: matched.price,
      category: matched.category,
    })

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([80, 40, 80])
      } catch (e) {}
    }
    return
  }

  // 3. Dynamic Live Fetch: Queries Open Food Facts, Open Beauty Facts, Open Products Facts & UPCitemdb
  try {
    const globalInfo = await resolveGlobalProduct(cleanCode)

    // Ensure we don't duplicate store product if already stored under this barcode
    let storeProduct = products.value.find(
      p => p.barcode && p.barcode.trim().replace(/^0+/, '') === normalizedCode
    )

    if (!storeProduct) {
      storeProduct = addProduct({
        name: globalInfo.name,
        price: globalInfo.price,
        stock: 50,
        unit: globalInfo.unit || 'piece',
        category: globalInfo.category || currentShopCategories.value[0] || 'General',
        barcode: cleanCode,
        weight: globalInfo.weight || '',
      })
    }

    // Add to current active bill
    addProductToCart({
      id: storeProduct.id,
      barcode: storeProduct.barcode || cleanCode,
      name: storeProduct.name,
      price: storeProduct.price,
      category: storeProduct.category,
    })

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100])
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Open API fetch failed, prompting quick-add:', err)
    unregisteredBarcode.value = cleanCode
    unregisteredName.value = ''
    unregisteredPrice.value = ''
    unregisteredCategory.value = currentShopCategories.value[0] || 'General'
    openQuickAddModal.value = true

    playScannerBeep()

    showNotification({
      type: 'warning',
      title: 'New Barcode Scanned!',
      message: `Code: ${cleanCode}. Enter price & name to save and add to bill.`,
      duration: 4000,
    })
  }
}

function saveQuickAddProduct() {
  if (!unregisteredName.value.trim() || !unregisteredPrice.value) return

  const newProd = addProduct({
    name: unregisteredName.value.trim(),
    price: Number(unregisteredPrice.value),
    stock: 50,
    unit: 'piece',
    category: unregisteredCategory.value || 'General',
    barcode: unregisteredBarcode.value,
  })

  addProductToCart(newProd)
  playScannerBeep()

  showNotification({
    type: 'success',
    title: 'Product Saved & Billed!',
    message: `${newProd.name} added to inventory and bill.`,
    duration: 3500,
  })

  openQuickAddModal.value = false
  unregisteredBarcode.value = ''
  unregisteredName.value = ''
  unregisteredPrice.value = ''

  // Freeze scanner for 2 seconds after adding so camera doesn't immediately re-scan the item
  isScanPaused.value = true
  lastScanTimestamp = Date.now()
  setTimeout(() => {
    isScanPaused.value = false
  }, 2000)
}

function quickBillUnknownItem() {
  const code = unregisteredBarcode.value || 'Item'
  const customProd: Product = {
    id: 'scanned-' + Date.now().toString(36),
    name: `Item (${code})`,
    price: Number(unregisteredPrice.value) || 0,
    category: 'Scanned Items',
    stock: 99,
    unit: 'piece',
    barcode: code,
  }

  addProductToCart(customProd)
  playScannerBeep()

  openQuickAddModal.value = false
  unregisteredBarcode.value = ''
  unregisteredName.value = ''
  unregisteredPrice.value = ''

  isScanPaused.value = true
  lastScanTimestamp = Date.now()
  setTimeout(() => {
    isScanPaused.value = false
  }, 2000)
}

function handleBarcodeSubmit() {
  if (!barcodeInputValue.value.trim()) return
  processBarcodeScan(barcodeInputValue.value)
  barcodeInputValue.value = ''
  nextTick(() => {
    barcodeInputRef.value?.focus()
  })
}

// --- Custom Manual Item Addition ---
function handleCustomItemSubmit() {
  if (!customItemName.value || !customItemPrice.value) return

  const customProduct = {
    id: 'custom-' + Date.now().toString(36),
    name: customItemName.value.trim(),
    price: Number(customItemPrice.value),
    category: customItemCategory.value,
  }

  playScannerBeep()

  const qty = Number(customItemQty.value) || 1
  cartItems.value.push({
    productId: customProduct.id,
    productName: customProduct.name,
    category: customProduct.category,
    quantity: qty,
    price: customProduct.price,
    total: customProduct.price * qty,
  })

  showNotification({
    type: 'success',
    title: 'Manual Item Added',
    message: `"${customProduct.name}" added to bill.`,
    duration: 3000,
  })

  // Reset form
  customItemName.value = ''
  customItemPrice.value = ''
  customItemQty.value = 1
  openCustomItemModal.value = false
}

// --- Live Camera Continuous Video Scanner (@zxing/browser) ---
async function startCamera() {
  cameraErrorMessage.value = ''
  isCameraStarting.value = true

  try {
    // 1. Guard against insecure origin / missing mediaDevices in mobile browsers
    const hasMedia =
      typeof navigator !== 'undefined' &&
      Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

    if (!hasMedia) {
      isCameraStarting.value = false
      isCameraActive.value = false
      cameraErrorMessage.value =
        'Camera API is blocked on plain HTTP by your mobile browser. Mobile browsers require a Secure Context (HTTPS or tunnel) to access the live video camera. Run "npx untun tunnel http://localhost:5173" to get a free trusted HTTPS link for your mobile, or use the Barcode Gun / Manual Input.'
      return
    }

    // 2. Stop any currently active scanner or video stream
    stopCamera()

    // 3. Discover available video input devices (front/back cameras, webcams)
    if (navigator?.mediaDevices?.enumerateDevices) {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        availableVideoDevices.value = devices
        hasMultipleCameras.value = devices.length > 1

        // Auto-select rear/environment camera on mobile if not manually selected
        if (!selectedCameraDeviceId.value && devices.length > 0) {
          const rearCamera = devices.find(d => /back|rear|environment/i.test(d.label))
          selectedCameraDeviceId.value = rearCamera ? rearCamera.deviceId : devices[0].deviceId
        }
      } catch (devErr) {
        console.warn('Could not list video input devices:', devErr)
      }
    }

    isCameraActive.value = true
    await nextTick()

    if (!videoRef.value) {
      throw new Error('Video element not available in template')
    }

    // 4. Continuous live stream scanning with @zxing/browser (HD autofocus constraints)
    const SAME_PRODUCT_CAMERA_COOLDOWN_MS = 2800 // Prevent rapid fire when kept in front of camera

    const scanCallback = async (result: any) => {
      if (!result) return

      // Strict Mutex & Modal Guards:
      // 1. If currently processing an async scan, drop frame immediately
      if (isProcessingScan.value || isScanPaused.value) return

      // 2. If any modal is open (Quick Add, Custom Item, QR Payment, Invoice), scanner is frozen
      if (
        openQuickAddModal.value ||
        openCustomItemModal.value ||
        openQrModal.value ||
        completedInvoice.value
      ) {
        return
      }

      const barcode = result.getText()
      const now = Date.now()

      // Avoid repeatedly adding the same product while kept in front of the camera
      if (barcode === lastScannedBarcode && now - lastScanTimestamp < SAME_PRODUCT_CAMERA_COOLDOWN_MS) {
        return
      }

      lastScannedBarcode = barcode
      lastScanTimestamp = now
      isProcessingScan.value = true

      try {
        // D-Mart Process: Increments quantity (+) if already on bill, or adds new product
        await processBarcodeScan(barcode)
      } finally {
        setTimeout(() => {
          isProcessingScan.value = false
        }, 800)
      }
    }

    const hdConstraints: MediaStreamConstraints = {
      video: selectedCameraDeviceId.value
        ? {
            deviceId: { exact: selectedCameraDeviceId.value },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
          }
        : {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
          },
    }

    try {
      zxingControls = await zxingScanner.decodeFromConstraints(
        hdConstraints,
        videoRef.value,
        scanCallback
      )
    } catch (constraintErr) {
      console.warn('HD constraint failed, falling back to default device:', constraintErr)
      zxingControls = await zxingScanner.decodeFromVideoDevice(
        selectedCameraDeviceId.value,
        videoRef.value,
        scanCallback
      )
    }

    isCameraStarting.value = false
  } catch (err: any) {
    console.error('Camera error:', err)
    isCameraStarting.value = false
    isCameraActive.value = false
    cameraErrorMessage.value =
      err.message || 'Could not access camera. Please allow camera permissions or check device.'
  }
}

function stopCamera() {
  if (zxingControls) {
    try {
      zxingControls.stop()
    } catch (e) {
      console.warn('Error stopping ZXing scanner:', e)
    }
    zxingControls = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  isCameraActive.value = false
}

async function switchCamera() {
  if (availableVideoDevices.value.length < 2) return
  stopCamera()

  const currentIndex = availableVideoDevices.value.findIndex(
    d => d.deviceId === selectedCameraDeviceId.value
  )
  const nextIndex = (currentIndex + 1) % availableVideoDevices.value.length
  selectedCameraDeviceId.value = availableVideoDevices.value[nextIndex].deviceId

  await startCamera()
}

// --- Checkout & Invoice Printing ---
function completeCheckout() {
  if (cartItems.value.length === 0) return

  isCheckingOut.value = true

  setTimeout(() => {
    // 1. Commit to useShopStore (deducts inventory, saves order in database & feeds charts)
    const newOrder = createOrder(
      cartItems.value,
      customerName.value.trim() || 'Walk-in Customer'
    )

    // 2. Prepare printable invoice
    completedInvoice.value = {
      id: newOrder.id,
      formattedDate: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      customerName: newOrder.customerName || 'Walk-in Customer',
      items: [...cartItems.value],
      subtotal: subtotalAmount.value,
      tax: taxAmount.value,
      discount: Number(discountAmount.value || 0),
      grandTotal: grandTotalSum.value,
      paymentMode: selectedPaymentMode.value,
    }

    isCheckingOut.value = false

    showNotification({
      type: 'success',
      title: 'Sale Completed!',
      message: `Invoice #${newOrder.id} generated for ₹${grandTotalSum.value.toLocaleString('en-IN')}`,
      duration: 4000,
    })
  }, 400)
}

function closeInvoice() {
  completedInvoice.value = null
  cartItems.value = []
  customerName.value = ''
  discountAmount.value = 0
}

function printReceipt() {
  window.print()
}

onMounted(async () => {
  // Auto-focus barcode input
  nextTick(() => {
    barcodeInputRef.value?.focus()
  })

  // Auto-start camera only when mediaDevices is available in a secure origin
  const hasCameraApi =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

  if (hasCameraApi) {
    try {
      await startCamera()
    } catch (e) {
      console.warn('Auto start camera error:', e)
    }
  }
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
@keyframes scannerLaser {
  0% {
    top: 5%;
    opacity: 0.8;
  }
  50% {
    top: 90%;
    opacity: 1;
  }
  100% {
    top: 5%;
    opacity: 0.8;
  }
}

.animate-scanner-laser {
  animation: scannerLaser 2s ease-in-out infinite;
}

@media print {
  body * {
    visibility: hidden;
  }
  #printable-receipt,
  #printable-receipt * {
    visibility: visible;
  }
  #printable-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 16px;
  }
}
</style>

