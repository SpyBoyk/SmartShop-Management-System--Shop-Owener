import { ref, computed } from 'vue'
import { useShopStore, type ShopType, SHOP_TYPE_META } from './useShopStore'

export interface User {
  id: string
  name: string
  email: string
  role: string
  shopType: ShopType
  avatar: string
  createdAt: string
  password?: string
}

export interface ResetCodeRecord {
  email: string
  code: string
  expiresAt: number
}

const STORAGE_USERS_KEY = 'smartshop_registered_users'
const STORAGE_CURRENT_USER_KEY = 'smartshop_current_user'
const STORAGE_RESET_CODES_KEY = 'smartshop_reset_codes'

// Default starter accounts
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Kalpesh Patel',
    email: 'kalpesh@smartshop.com',
    role: 'Store Owner & Admin',
    shopType: 'grocery',
    avatar: '/images/user/owner.jpg',
    createdAt: '2026-01-15T09:00:00Z',
    password: 'password123',
  },
  {
    id: 'usr-2',
    name: 'Dr. Sarah Mehta',
    email: 'sarah@pharmacy.com',
    role: 'Chief Pharmacist',
    shopType: 'medical',
    avatar: '/images/user/user-17.jpg',
    createdAt: '2026-02-10T11:30:00Z',
    password: 'password123',
  },
  {
    id: 'usr-3',
    name: 'Alex Rivera',
    email: 'alex@mobilestore.com',
    role: 'Electronics Manager',
    shopType: 'mobile',
    avatar: '/images/user/user-18.jpg',
    createdAt: '2026-03-01T14:20:00Z',
    password: 'password123',
  },
]

function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error reading registered users from localStorage:', e)
  }
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS))
  return [...DEFAULT_USERS]
}

function saveStoredUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
  } catch (e) {
    console.error('Error saving users to localStorage:', e)
  }
}

function getStoredCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Error reading current user from localStorage:', e)
  }
  // Default to Kalpesh if not logged in
  return DEFAULT_USERS[0]
}

// Global reactive state
const currentUser = ref<User | null>(getStoredCurrentUser())
const registeredUsers = ref<User[]>(getStoredUsers())
const activeResetCodes = ref<ResetCodeRecord[]>([])

export function useAuthStore() {
  const { setShopType, showNotification } = useShopStore()

  const isAuthenticated = computed(() => currentUser.value !== null)

  // Login
  function login(emailInput: string, passwordInput: string, shopType?: ShopType, keepLoggedIn: boolean = true): { success: boolean; error?: string; user?: User } {
    const cleanEmail = emailInput.trim().toLowerCase()
    const allUsers = getStoredUsers()
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail)

    if (!user) {
      return { success: false, error: 'No account found with this email address.' }
    }

    if (user.password && user.password !== passwordInput) {
      return { success: false, error: 'Incorrect password. Please try again or reset your password.' }
    }

    // Apply chosen or existing shop type
    const finalShopType: ShopType = shopType || user.shopType || 'grocery'
    const updatedUser = { ...user, shopType: finalShopType }
    currentUser.value = updatedUser

    if (keepLoggedIn) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser))
    } else {
      sessionStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser))
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
    }

    setShopType(finalShopType, false)

    showNotification({
      type: 'success',
      title: 'Welcome back, ' + updatedUser.name.split(' ')[0] + '!',
      message: `Signed in as ${updatedUser.role} (${SHOP_TYPE_META[finalShopType]?.name || 'SmartShop'}).`,
      duration: 3500,
    })

    return { success: true, user: updatedUser }
  }

  // Register
  function register(data: {
    name: string
    email: string
    password: string
    shopType: ShopType
    role?: string
  }): { success: boolean; error?: string; user?: User } {
    const cleanEmail = data.email.trim().toLowerCase()
    const allUsers = getStoredUsers()

    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' }
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' }
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role || (data.shopType === 'medical' ? 'Pharmacist' : data.shopType === 'mobile' ? 'Store Manager' : 'Store Admin'),
      shopType: data.shopType,
      avatar: '/images/user/owner.jpg',
      createdAt: new Date().toISOString(),
      password: data.password,
    }

    allUsers.push(newUser)
    saveStoredUsers(allUsers)
    registeredUsers.value = allUsers

    // Auto log in after registration
    currentUser.value = newUser
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser))
    setShopType(data.shopType, false)

    showNotification({
      type: 'success',
      title: 'Account Created Successfully!',
      message: `Welcome to SmartShop, ${newUser.name}. Your ${SHOP_TYPE_META[data.shopType]?.name} workspace is ready.`,
      duration: 4000,
    })

    return { success: true, user: newUser }
  }

  // Forgot Password: generate verification code
  function requestPasswordReset(emailInput: string): { success: boolean; error?: string; code?: string } {
    const cleanEmail = emailInput.trim().toLowerCase()
    const allUsers = getStoredUsers()
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail)

    if (!user) {
      return { success: false, error: 'We could not find any active account associated with that email.' }
    }

    // Generate 6-digit numeric verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 mins expiry

    // Save code
    try {
      const existingRaw = localStorage.getItem(STORAGE_RESET_CODES_KEY)
      const existing: ResetCodeRecord[] = existingRaw ? JSON.parse(existingRaw) : []
      const filtered = existing.filter(r => r.email !== cleanEmail)
      filtered.push({ email: cleanEmail, code, expiresAt })
      localStorage.setItem(STORAGE_RESET_CODES_KEY, JSON.stringify(filtered))
      activeResetCodes.value = filtered
    } catch (e) {
      console.error('Error saving reset code:', e)
    }

    return { success: true, code }
  }

  // Verify Reset Code
  function verifyResetCode(emailInput: string, codeInput: string): { valid: boolean; error?: string } {
    const cleanEmail = emailInput.trim().toLowerCase()
    const cleanCode = codeInput.trim()

    try {
      const raw = localStorage.getItem(STORAGE_RESET_CODES_KEY)
      if (!raw) return { valid: false, error: 'No verification code found. Please request a new code.' }
      const codes: ResetCodeRecord[] = JSON.parse(raw)
      const record = codes.find(r => r.email === cleanEmail && r.code === cleanCode)

      if (!record) {
        return { valid: false, error: 'Invalid verification code. Please check the 6-digit code and try again.' }
      }

      if (Date.now() > record.expiresAt) {
        return { valid: false, error: 'This verification code has expired. Please request a new code.' }
      }

      return { valid: true }
    } catch (e) {
      return { valid: false, error: 'Error validating code.' }
    }
  }

  // Reset Password with code
  function resetPassword(emailInput: string, codeInput: string, newPassword: string): { success: boolean; error?: string } {
    const verification = verifyResetCode(emailInput, codeInput)
    if (!verification.valid) {
      return { success: false, error: verification.error }
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' }
    }

    const cleanEmail = emailInput.trim().toLowerCase()
    const allUsers = getStoredUsers()
    const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === cleanEmail)

    if (userIndex === -1) {
      return { success: false, error: 'User account not found.' }
    }

    allUsers[userIndex].password = newPassword
    saveStoredUsers(allUsers)
    registeredUsers.value = allUsers

    // If current logged in user is this person, update session
    if (currentUser.value && currentUser.value.email.toLowerCase() === cleanEmail) {
      currentUser.value.password = newPassword
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser.value))
    }

    // Clean up used code
    try {
      const raw = localStorage.getItem(STORAGE_RESET_CODES_KEY)
      if (raw) {
        const codes: ResetCodeRecord[] = JSON.parse(raw)
        const updated = codes.filter(r => r.email !== cleanEmail)
        localStorage.setItem(STORAGE_RESET_CODES_KEY, JSON.stringify(updated))
        activeResetCodes.value = updated
      }
    } catch (e) {
      console.error(e)
    }

    showNotification({
      type: 'success',
      title: 'Password Reset Successful!',
      message: 'Your password has been updated securely. You can now sign in with your new password.',
      duration: 4000,
    })

    return { success: true }
  }

  // Sign out
  function logout() {
    currentUser.value = null
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
    sessionStorage.removeItem(STORAGE_CURRENT_USER_KEY)

    showNotification({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out of your SmartShop account.',
      duration: 3000,
    })
  }

  return {
    currentUser,
    registeredUsers,
    isAuthenticated,
    DEFAULT_USERS,
    login,
    register,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    logout,
  }
}

