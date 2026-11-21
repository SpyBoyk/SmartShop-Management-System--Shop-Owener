<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400 cursor-pointer"
      @click.prevent="toggleDropdown"
      title="User Account"
    >
      <span class="overflow-hidden rounded-full h-8 w-8 sm:h-9 sm:w-9 border border-gray-200 dark:border-gray-700 shrink-0">
        <img :src="currentUser?.avatar || '/images/user/owner.jpg'" :alt="currentUser?.name || 'User'" class="w-full h-full object-cover" />
      </span>

      <span class="hidden md:block ml-2 mr-1 font-medium text-xs sm:text-theme-sm">{{ userFirstName }}</span>

      <ChevronDownIcon class="hidden sm:block w-3.5 h-3.5" :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-2 flex w-[230px] sm:w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-9999"
    >
      <div class="px-2 pt-1 pb-2">
        <span class="block font-semibold text-gray-800 text-theme-sm dark:text-white">
          {{ currentUser?.name || 'Store Manager' }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate">
          {{ currentUser?.email || 'manager@smartshop.com' }}
        </span>
        <span class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          {{ currentUser?.role || 'Store Admin' }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-3 pb-3 border-y border-gray-100 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            @click="closeDropdown"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <button
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-2 font-medium text-rose-600 dark:text-rose-400 rounded-lg group text-theme-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition text-left w-full cursor-pointer"
      >
        <LogoutIcon
          class="text-rose-500 group-hover:text-rose-600"
        />
        Sign out
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, InfoCircleIcon, LogoutIcon, SettingsIcon, UserCircleIcon } from '@/icons'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/composables/useAuthStore'

const router = useRouter()
const { currentUser, logout } = useAuthStore()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userFirstName = computed(() => {
  if (!currentUser.value?.name) return 'Account'
  return currentUser.value.name.split(' ')[0]
})

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Edit profile' },
  { href: '/profile', icon: SettingsIcon, text: 'Account settings' },
  { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  logout()
  closeDropdown()
  router.push('/signin')
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
