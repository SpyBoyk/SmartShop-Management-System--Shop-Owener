<template>
  <header
    class="sticky top-0 flex w-full bg-white border-b border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 h-14 sm:h-16 items-center"
  >
    <div class="flex items-center justify-between w-full px-2.5 sm:px-4 lg:px-6 min-w-0 h-full">
      <!-- Left: Hamburger Menu Button & Logo -->
      <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          @click="handleToggle"
          aria-label="Toggle Sidebar Menu"
          class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 transition shrink-0 cursor-pointer"
          :class="[
            isMobileOpen
              ? 'bg-gray-100 dark:bg-gray-800 text-brand-500'
              : '',
          ]"
        >
          <svg
            v-if="isMobileOpen"
            class="fill-current w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
            />
          </svg>
          <svg
            v-else
            class="fill-current w-3.5 h-3.5 sm:w-4 sm:h-4"
            viewBox="0 0 16 12"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
            />
          </svg>
        </button>
        <HeaderLogo />
      </div>

      <!-- Center: SearchBar on desktop only -->
      <div class="hidden lg:block flex-1 max-w-sm xl:max-w-md mx-4">
        <SearchBar />
      </div>

      <!-- Right Header Actions: POS Shortcut, Shop Type Switcher, Theme Toggler, User Menu -->
      <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <!-- POS Scanner Quick Link -->
        <router-link
          v-if="route.path !== '/pos'"
          to="/pos"
          @click="closeMobileSidebar"
          class="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-xs font-bold transition shadow-2xs"
          title="Open POS Scanner"
        >
          <span>📷</span>
          <span class="hidden xs:inline">POS</span>
        </router-link>

        <!-- Active Store Type Switcher -->
        <div class="relative" ref="shopSwitcherRef">
          <button
            @click.stop="isShopSwitcherOpen = !isShopSwitcherOpen"
            class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition shadow-2xs hover:opacity-90 cursor-pointer"
            :class="currentShopMeta.badgeClass"
            title="Switch Store Workspace"
          >
            <span class="text-sm">{{ currentShopMeta.icon }}</span>
            <span class="hidden sm:inline font-semibold text-gray-800 dark:text-white">{{ currentShopMeta.shortName }}</span>
            <svg class="w-3 h-3 opacity-60 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Store Switcher Dropdown -->
          <div
            v-if="isShopSwitcherOpen"
            class="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl border border-gray-200 bg-white p-1.5 sm:p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 z-99999"
          >
            <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Switch Business Type
            </div>
            <div class="space-y-1">
              <button
                v-for="st in availableShopTypes"
                :key="st.id"
                @click="onSelectShop(st.id)"
                class="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer"
                :class="currentShopType === st.id ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 font-semibold' : 'hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'"
              >
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ st.icon }}</span>
                  <div>
                    <div class="font-medium text-gray-800 dark:text-white">{{ st.name }}</div>
                    <div class="text-[10px] text-gray-400 line-clamp-1">{{ st.tagline }}</div>
                  </div>
                </div>
                <span v-if="currentShopType === st.id" class="text-brand-500 text-xs font-bold">✓</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Theme Toggler -->
        <ThemeToggler />

        <!-- User Profile Avatar Menu -->
        <UserMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import { useShopStore, type ShopType } from '@/composables/useShopStore'
import ThemeToggler from '../common/ThemeToggler.vue'
import SearchBar from './header/SearchBar.vue'
import HeaderLogo from './header/HeaderLogo.vue'
import NotificationMenu from './header/NotificationMenu.vue'
import UserMenu from './header/UserMenu.vue'

const { toggleSidebar, toggleMobileSidebar, closeMobileSidebar, isMobileOpen } = useSidebar()
const { currentShopType, currentShopMeta, setShopType, SHOP_TYPE_META } = useShopStore()

const availableShopTypes = Object.values(SHOP_TYPE_META)
const isShopSwitcherOpen = ref(false)
const shopSwitcherRef = ref<HTMLElement | null>(null)
const router = useRouter()
const route = useRoute()

function onSelectShop(type: ShopType) {
  setShopType(type)
  isShopSwitcherOpen.value = false
  closeMobileSidebar()
  // If user is currently on a specific category page (e.g. /products/grains-pulses), redirect to /products
  if (route.path.startsWith('/products/')) {
    router.push('/products')
  }
}

function handleClickOutside(e: MouseEvent) {
  if (shopSwitcherRef.value && !shopSwitcherRef.value.contains(e.target as Node)) {
    isShopSwitcherOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}

const dropdownOpen = ref(false)
const notifying = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  notifying.value = false
}

const isApplicationMenuOpen = ref(false)

const toggleApplicationMenu = () => {
  isApplicationMenuOpen.value = !isApplicationMenuOpen.value
}
</script>
