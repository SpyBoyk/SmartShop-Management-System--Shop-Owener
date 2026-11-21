import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Customer-Facing Sales Dashboard',
      },
    },
    {
      path: '/pos',
      name: 'PointOfSale',
      component: () => import('../views/PointOfSale.vue'),
      meta: {
        title: 'Product Scanner & POS Billing',
      },
    },
    {
      path: '/scanner',
      redirect: '/pos',
    },
    {
      path: '/product-insights',
      name: 'ProductInsights',
      component: () => import('../views/ProductInsights.vue'),
      meta: {
        title: 'Product Insights',
      },
    },
    {
      path: '/products/new',
      name: 'AddProduct',
      component: () => import('../views/Products/AddProduct.vue'),
      meta: {
        title: 'Add Product',
      },
    },
    {
      path: '/products/edit/:id',
      name: 'EditProduct',
      component: () => import('../views/Products/EditProduct.vue'),
      meta: {
        title: 'Edit Product',
      },
    },
    {
      path: '/products/:category?',
      name: 'Products',
      component: () => import('../views/Products/ProductsList.vue'),
      meta: {
        title: 'Products',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Sign In',
      },
    },
    {
      path: '/login',
      redirect: '/signin',
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Create Account',
      },
    },
    {
      path: '/register',
      redirect: '/signup',
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/Auth/ForgotPassword.vue'),
      meta: {
        title: 'Forgot Password',
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/Auth/ResetPassword.vue'),
      meta: {
        title: 'Reset Password',
      },
    },
    {
      path: '/billing',
      redirect: '/',
    },
    {
      path: '/shop-setup',
      redirect: '/',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const pageTitle = to.meta.title || 'Sales Dashboard'
  document.title = `${pageTitle} | SmartShop - Business Dashboard`
  next()
})

// Auto-reload on stale dynamic import chunk error (e.g. following a fresh GitHub Pages deployment)
router.onError((error, to) => {
  const isChunkError =
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed') ||
    error?.name === 'ChunkLoadError'

  if (isChunkError) {
    const reloadKey = 'chunk_reload_' + to.fullPath
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, 'true')
      window.location.href = window.location.origin + router.resolve(to).href
    }
  }
})

router.afterEach(() => {
  // Clear chunk reload keys after successful navigation
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i)
    if (key?.startsWith('chunk_reload_')) {
      sessionStorage.removeItem(key)
    }
  }
})
