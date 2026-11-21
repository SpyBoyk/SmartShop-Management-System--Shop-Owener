<template>
  <aside
    :class="[
      'fixed top-14 sm:top-16 lg:top-0 mt-0 flex flex-col px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] lg:h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200 shadow-xl lg:shadow-none',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-4 hidden lg:flex flex-col justify-center items-center w-full border-b border-gray-100 dark:border-gray-800/80 mb-3',
      ]"
    >
      <router-link to="/" @click="closeMobileSidebar" class="flex flex-col items-center justify-center">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="h-14 w-auto max-w-[195px] object-contain transition-all duration-200"
          src="/images/logo/smartshop-logo-clean.png"
          alt="SmartShop"
        />
        <img
          v-else
          class="h-11 w-11 object-contain transition-all duration-200"
          src="/images/logo/smartshop-icon.png"
          alt="SmartShop"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pt-3 lg:pt-0"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-6">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-2.5 px-3 text-[11px] font-semibold tracking-wider uppercase flex leading-[20px] text-gray-400 dark:text-gray-500',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-1.5">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="handleMenuClick(groupIndex, index, item)"
                  :class="[
                    'menu-item group w-full transition-all duration-150',
                    isParentActive(item)
                      ? 'menu-item-active'
                      : isSubmenuOpen(groupIndex, index)
                      ? 'menu-item-expanded'
                      : 'menu-item-inactive',
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isParentActive(item)
                        ? 'menu-item-icon-active'
                        : isSubmenuOpen(groupIndex, index)
                        ? 'text-gray-800 dark:text-gray-200'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text truncate"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-4 h-4 transition-transform duration-200 shrink-0',
                      {
                        'rotate-180': isSubmenuOpen(groupIndex, index),
                        'text-brand-500 dark:text-brand-400': isParentActive(item),
                        'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300': !isParentActive(item),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  @click="closeMobileSidebar"
                  :class="[
                    'menu-item group transition-all duration-150',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text truncate"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                    class="overflow-hidden"
                  >
                    <ul class="relative mt-1 ml-5 pl-3.5 space-y-1 border-l-2 border-gray-100 dark:border-gray-800/80">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          @click="closeMobileSidebar"
                          :class="[
                            'menu-dropdown-item group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150',
                            isActive(subItem.path)
                              ? 'menu-dropdown-item-active'
                              : 'menu-dropdown-item-inactive',
                          ]"
                        >
                          <span class="flex items-center gap-2.5 truncate">
                            <!-- Proper Vector SVG Icon for Submenus (Like Main Menus) -->
                            <component
                              v-if="subItem.icon"
                              :is="subItem.icon"
                              class="w-4 h-4 shrink-0 transition-colors"
                              :class="isActive(subItem.path) ? 'text-brand-500 dark:text-brand-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'"
                            />
                            <span
                              v-else
                              :class="[
                                'h-1.5 w-1.5 rounded-full transition-all duration-200 shrink-0',
                                isActive(subItem.path)
                                  ? 'bg-brand-500 scale-125'
                                  : 'bg-gray-300 group-hover:bg-gray-400 dark:bg-gray-600 dark:group-hover:bg-gray-400'
                              ]"
                            />
                            <span class="truncate">{{ subItem.name }}</span>
                          </span>
                          <span class="flex items-center gap-1 ml-auto shrink-0">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
  SettingsIcon,
  TaskIcon,
  BoxIcon,
  ErrorHexaIcon,
  BarChartIcon,
  CheckIcon,
  UserGroupIcon,
} from "../../icons";
import {
  Pill,
  FlaskConical,
  Bandage,
  Sparkles,
  HeartPulse,
  Activity,
  Wheat,
  Droplet,
  Milk,
  Cookie,
  Coffee,
  Sparkle,
  Smartphone,
  Headphones,
  Cable,
  Shield,
  Layers,
  Watch,
  ScanBarcode,
} from "lucide-vue-next";
import SidebarWidget from "./SidebarWidget.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar";
import { useShopStore } from "@/composables/useShopStore";

const route = useRoute();
const router = useRouter();

const { isExpanded, isMobileOpen, isHovered, openSubmenu, closeMobileSidebar } = useSidebar();
const { currentShopSections, currentShopMeta } = useShopStore();

const sectionIconMap = {
  // Medical Shop / Pharmacy
  'tablets-capsules': Pill,
  'syrups-suspensions': FlaskConical,
  'first-aid-surgical': Bandage,
  'personal-care-hygiene': Sparkles,
  'baby-mother-care': HeartPulse,
  'medical-devices-wellness': Activity,

  // Supermarket
  'grains-pulses': Wheat,
  'oils-ghee': Droplet,
  'dairy-bakery': Milk,
  'snacks-biscuits': Cookie,
  'beverages': Coffee,
  'household-care': Sparkle,

  // Mobile Shop
  'smartphones': Smartphone,
  'audio-earbuds': Headphones,
  'chargers-cables': Cable,
  'cases-covers': Shield,
  'screen-protectors': Layers,
  'power-banks-wearables': Watch,
};

function getSectionIcon(slug) {
  return sectionIconMap[slug] || BoxIcon;
}

function isActive(path) {
  if (!path || !route.path) return false;
  const currentPath = route.path.split('#')[0].split('?')[0];
  const targetPath = path.split('#')[0].split('?')[0];
  return currentPath === targetPath;
}

function isParentActive(item) {
  if (!item) return false;
  if (item.path && isActive(item.path)) return true;
  if (item.path && item.path !== '/' && (route.path === item.path || route.path.startsWith(item.path + '/'))) return true;
  if (item.subItems && Array.isArray(item.subItems)) {
    return item.subItems.some((subItem) => isActive(subItem.path));
  }
  return false;
}

const menuGroups = computed(() => [
  {
    title: "MENU",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: "/",
      },
      {
        icon: ScanBarcode,
        name: "Product Scanner / POS",
        path: "/pos",
      },
      {
        icon: BoxCubeIcon,
        name: "Product Insights",
        path: "/product-insights",
      },
      {
        name: "Products",
        icon: BoxIcon,
        path: "/products",
        subItems: currentShopSections.value
          .filter((s) => s.slug !== "all")
          .map((s) => ({
            name: s.name,
            icon: getSectionIcon(s.slug),
            path: `/products/${s.slug}`,
            pro: false,
          })),
      },
      {
        icon: CalenderIcon,
        name: "Calendar",
        path: "/calendar",
      },
      {
        icon: UserCircleIcon,
        name: "User Profile",
        path: "/profile",
      },
      {
        name: "Forms",
        icon: ListIcon,
        subItems: [
          { name: "Form Elements", path: "/form-elements", icon: ListIcon, pro: false },
        ],
      },
      {
        name: "Tables",
        icon: TableIcon,
        subItems: [{ name: "Basic Tables", path: "/basic-tables", icon: TableIcon, pro: false }],
      },
      {
        icon: PageIcon,
        name: "Pages",
        subItems: [
          { name: "Blank Page", path: "/blank", icon: PageIcon, pro: false },
          { name: "404 Error", path: "/error-404", icon: ErrorHexaIcon, pro: false },
        ],
      },
    ],
  },
  {
    title: "OTHERS",
    items: [
      {
        icon: PieChartIcon,
        name: "Charts",
        subItems: [
          { name: "Line Chart", path: "/line-chart", icon: PieChartIcon, pro: false },
          { name: "Bar Chart", path: "/bar-chart", icon: BarChartIcon, pro: false },
        ],
      },
      {
        icon: BoxCubeIcon,
        name: "Ui Elements",
        subItems: [
          { name: "Alerts", path: "/alerts", icon: ErrorHexaIcon, pro: false },
          { name: "Avatars", path: "/avatars", icon: UserCircleIcon, pro: false },
          { name: "Badge", path: "/badge", icon: CheckIcon, pro: false },
          { name: "Buttons", path: "/buttons", icon: BoxCubeIcon, pro: false },
          { name: "Images", path: "/images", icon: DocsIcon, pro: false },
          { name: "Videos", path: "/videos", icon: PageIcon, pro: false },
        ],
      },
      {
        icon: PlugInIcon,
        name: "Authentication",
        subItems: [
          { name: "Sign In", path: "/signin", icon: UserCircleIcon, pro: false },
          { name: "Sign Up", path: "/signup", icon: UserGroupIcon, pro: false },
          { name: "Forgot Password", path: "/forgot-password", icon: SettingsIcon, pro: false },
          { name: "Reset Password", path: "/reset-password", icon: TaskIcon, pro: false },
        ],
      },
    ],
  },
]);

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  if (isSubmenuOpen(groupIndex, itemIndex)) {
    openSubmenu.value = `closed-${key}`;
  } else {
    openSubmenu.value = key;
  }
};

const handleMenuClick = (groupIndex, itemIndex, item) => {
  const key = `${groupIndex}-${itemIndex}`;
  if (item.path) {
    if (route.path !== item.path) {
      router.push(item.path);
      openSubmenu.value = key;
    } else {
      toggleSubmenu(groupIndex, itemIndex);
    }
    closeMobileSidebar();
  } else {
    toggleSubmenu(groupIndex, itemIndex);
  }
};

// Auto-close sidebar on mobile whenever the route changes
watch(
  () => route.fullPath,
  () => {
    closeMobileSidebar();
  }
);

const isAnySubmenuRouteActive = computed(() => {
  return (menuGroups.value || []).some((group) =>
    (group.items || []).some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  const item = menuGroups.value?.[groupIndex]?.items?.[itemIndex];
  if (!item) {
    return false;
  }
  if (openSubmenu.value === `closed-${key}`) {
    return false;
  }
  if (openSubmenu.value === key) {
    return true;
  }
  return isParentActive(item);
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
