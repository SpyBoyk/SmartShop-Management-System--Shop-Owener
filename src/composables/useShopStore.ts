import { ref, computed, watch } from 'vue'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  weight?: string
  barcode?: string
  alternateBarcodes?: string[]
}

export type ShopType = 'grocery' | 'medical' | 'mobile'

export interface ShopSection {
  slug: string
  name: string
  iconEmoji: string
  desc: string
}

export interface ShopTypeMeta {
  id: ShopType
  name: string
  shortName: string
  tagline: string
  icon: string
  badgeClass: string
  sections: ShopSection[]
}

export const SHOP_TYPE_META: Record<ShopType, ShopTypeMeta> = {
  grocery: {
    id: 'grocery',
    name: 'SmartShop Supermarket',
    shortName: 'Supermarket',
    tagline: 'Fresh Groceries, Staples & Daily Essentials',
    icon: '🛒',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20',
    sections: [
      { slug: 'all', name: 'All Products', iconEmoji: '🏷️', desc: 'Complete grocery & supermarket inventory' },
      { slug: 'grains-pulses', name: 'Grains & Pulses', iconEmoji: '🌾', desc: 'Rice, wheat atta, dals, and pulse inventory' },
      { slug: 'oils-ghee', name: 'Oils & Ghee', iconEmoji: '🫒', desc: 'Cooking oils, pure desi cow ghee, and cooking essentials' },
      { slug: 'dairy-bakery', name: 'Dairy & Bakery', iconEmoji: '🥛', desc: 'Butter, fresh milk, breads, and dairy items' },
      { slug: 'snacks-biscuits', name: 'Snacks & Biscuits', iconEmoji: '🍪', desc: 'Biscuits, namkeen, instant noodles, and snacks' },
      { slug: 'beverages', name: 'Beverages', iconEmoji: '☕', desc: 'Tea, premium coffee, juices, and daily beverages' },
      { slug: 'household-care', name: 'Household & Care', iconEmoji: '🧼', desc: 'Soaps, detergents, oral hygiene, and cleaning products' },
    ],
  },
  medical: {
    id: 'medical',
    name: 'SmartShop Pharmacy',
    shortName: 'Medical Shop',
    tagline: 'Medicines, Health Essentials & Surgical Supplies',
    icon: '💊',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/20',
    sections: [
      { slug: 'all', name: 'All Medicines', iconEmoji: '🏷️', desc: 'Complete pharmacy inventory & wellness products' },
      { slug: 'tablets-capsules', name: 'Tablets & Capsules', iconEmoji: '💊', desc: 'Oral solid medicines, pain relievers, and antibiotics' },
      { slug: 'syrups-suspensions', name: 'Syrups & Suspensions', iconEmoji: '🧪', desc: 'Cough syrups, antacids, laxatives, and oral liquids' },
      { slug: 'first-aid-surgical', name: 'First Aid & Surgical', iconEmoji: '🩹', desc: 'Bandages, antiseptics, cotton, and wound care' },
      { slug: 'personal-care-hygiene', name: 'Personal Care & Hygiene', iconEmoji: '🧴', desc: 'Sanitizers, pain sprays, face care, and hygiene items' },
      { slug: 'baby-mother-care', name: 'Baby & Mother Care', iconEmoji: '👶', desc: 'Diapers, baby formula, lotions, and pediatric care' },
      { slug: 'medical-devices-wellness', name: 'Medical Devices & Wellness', iconEmoji: '🩺', desc: 'BP monitors, oximeters, glucometers, and vaporizers' },
    ],
  },
  mobile: {
    id: 'mobile',
    name: 'SmartShop Mobile Hub',
    shortName: 'Mobile Shop',
    tagline: 'Smartphones, Audio Gear & Mobile Accessories',
    icon: '📱',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20',
    sections: [
      { slug: 'all', name: 'All Gadgets & Devices', iconEmoji: '🏷️', desc: 'Complete smartphones, audio, and accessories catalog' },
      { slug: 'smartphones', name: 'Smartphones', iconEmoji: '📱', desc: 'Flagship, premium, and budget Android & iOS phones' },
      { slug: 'audio-earbuds', name: 'Audio & Earbuds', iconEmoji: '🎧', desc: 'TWS earbuds, wireless neckbands, headphones, and speakers' },
      { slug: 'chargers-cables', name: 'Chargers & Cables', iconEmoji: '🔌', desc: 'Fast adapters, braided Type-C cables, and power bricks' },
      { slug: 'cases-covers', name: 'Cases & Covers', iconEmoji: '🛡️', desc: 'Armor cases, silicone shockproof covers, and wallet cases' },
      { slug: 'screen-protectors', name: 'Screen Protectors', iconEmoji: '💎', desc: 'Tempered glass, edge-to-edge guards, and privacy filters' },
      { slug: 'power-banks-wearables', name: 'Power Banks & Wearables', iconEmoji: '⌚', desc: 'Fast power banks, smartwatches, and fitness trackers' },
    ],
  },
}

export interface OrderItem {
  productId: string
  barcode?: string
  productName: string
  category: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  date: string
  timestamp: number
  customerName?: string
}

export interface ShopConfig {
  shopName: string
  ownerName: string
  currency: string
  gstEnabled: boolean
  gstRate: number
}

export interface NotificationToast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

const activeNotifications = ref<NotificationToast[]>([])

export function showNotification(options: {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}) {
  const id = 'notif-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  const notif: NotificationToast = {
    id,
    type: options.type || 'success',
    title: options.title,
    message: options.message,
    duration: options.duration || 4000,
  }
  activeNotifications.value.push(notif)
  setTimeout(() => {
    removeNotification(id)
  }, notif.duration)
  return id
}

export function removeNotification(id: string) {
  activeNotifications.value = activeNotifications.value.filter(n => n.id !== id)
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

// Comprehensive Real Supermarket Catalog (76 authentic products across 7 categories)
const defaultProducts: Product[] = [
  // --- Grains & Pulses ---
  { id: 'p-gp-1', name: 'India Gate Basmati Rice', weight: '5kg', category: 'Grains & Pulses', price: 460, stock: 45, unit: 'bag', barcode: '890172518101' },
  { id: 'p-gp-2', name: 'Aashirvaad Shudh Chakki Atta', weight: '10kg', category: 'Grains & Pulses', price: 395, stock: 38, unit: 'bag', barcode: '890103038202' },
  { id: 'p-gp-3', name: 'Tata Sampann Unpolished Toor Dal', weight: '1kg', category: 'Grains & Pulses', price: 178, stock: 34, unit: 'pack', barcode: '890103038203' },
  { id: 'p-gp-4', name: 'Tata Sampann Yellow Moong Dal', weight: '1kg', category: 'Grains & Pulses', price: 154, stock: 29, unit: 'pack', barcode: '890103038204' },
  { id: 'p-gp-5', name: 'Fortune Chana Dal', weight: '1kg', category: 'Grains & Pulses', price: 112, stock: 40, unit: 'pack', barcode: '890103038205' },
  { id: 'p-gp-6', name: 'Rajdhani Thick Poha', weight: '500g', category: 'Grains & Pulses', price: 46, stock: 55, unit: 'pack', barcode: '890103038206' },
  { id: 'p-gp-7', name: 'Fortune Fine Besan', weight: '1kg', category: 'Grains & Pulses', price: 118, stock: 32, unit: 'pack', barcode: '890103038207' },
  { id: 'p-gp-8', name: 'Organic Tattva Rajma Chitra', weight: '1kg', category: 'Grains & Pulses', price: 195, stock: 26, unit: 'pack', barcode: '890103038208' },
  { id: 'p-gp-9', name: 'Tata Sampann Kabuli Chana', weight: '1kg', category: 'Grains & Pulses', price: 185, stock: 28, unit: 'pack', barcode: '890103038209' },
  { id: 'p-gp-10', name: 'Daawat Rozana Super Basmati Rice', weight: '5kg', category: 'Grains & Pulses', price: 380, stock: 42, unit: 'bag', barcode: '890103038210' },
  { id: 'p-gp-11', name: 'Rajdhani Sooji Rawa', weight: '500g', category: 'Grains & Pulses', price: 42, stock: 48, unit: 'pack', barcode: '890103038211' },
  { id: 'p-gp-12', name: 'Tata Sampann Urad Dal Split', weight: '1kg', category: 'Grains & Pulses', price: 168, stock: 30, unit: 'pack', barcode: '890103038212' },

  // --- Oils & Ghee ---
  { id: 'p-og-1', name: 'Fortune Premium Kachi Ghani Mustard Oil', weight: '1L', category: 'Oils & Ghee', price: 162, stock: 35, unit: 'bottle', barcode: '890600728101' },
  { id: 'p-og-2', name: 'Amul Pure Cow Ghee', weight: '1L', category: 'Oils & Ghee', price: 635, stock: 24, unit: 'jar', barcode: '890600728102' },
  { id: 'p-og-3', name: 'Fortune Sunlite Refined Sunflower Oil', weight: '1L', category: 'Oils & Ghee', price: 148, stock: 40, unit: 'pouch', barcode: '890600728103' },
  { id: 'p-og-4', name: 'Dhara Filtered Groundnut Oil', weight: '1L', category: 'Oils & Ghee', price: 195, stock: 22, unit: 'bottle', barcode: '890600728104' },
  { id: 'p-og-5', name: 'Mother Dairy Pure Ghee', weight: '1L', category: 'Oils & Ghee', price: 615, stock: 20, unit: 'jar', barcode: '890600728105' },
  { id: 'p-og-6', name: 'Saffola Gold Pro Healthy Lifestyle Oil', weight: '1L', category: 'Oils & Ghee', price: 172, stock: 36, unit: 'pouch', barcode: '890600728106' },
  { id: 'p-og-7', name: 'Parachute 100% Pure Coconut Oil', weight: '500ml', category: 'Oils & Ghee', price: 145, stock: 30, unit: 'bottle', barcode: '890600728107' },
  { id: 'p-og-8', name: 'Figaro Extra Virgin Olive Oil', weight: '500ml', category: 'Oils & Ghee', price: 580, stock: 15, unit: 'tin', barcode: '890600728108' },
  { id: 'p-og-9', name: 'Patanjali Cow Desi Ghee', weight: '1L', category: 'Oils & Ghee', price: 595, stock: 25, unit: 'jar', barcode: '890600728109' },
  { id: 'p-og-10', name: 'Emami Healthy & Tasty Rice Bran Oil', weight: '1L', category: 'Oils & Ghee', price: 155, stock: 28, unit: 'pouch', barcode: '890600728110' },

  // --- Dairy & Bakery ---
  { id: 'p-db-1', name: 'Amul Butter Salted', weight: '500g', category: 'Dairy & Bakery', price: 275, stock: 22, unit: 'pack', barcode: '890126201101' },
  { id: 'p-db-2', name: 'Britannia Fresh Milk Bread', weight: '400g', category: 'Dairy & Bakery', price: 45, stock: 35, unit: 'pack', barcode: '890126201102' },
  { id: 'p-db-3', name: 'Amul Taaza Homogenised Toned Milk', weight: '1L', category: 'Dairy & Bakery', price: 68, stock: 45, unit: 'pack', barcode: '890126201103' },
  { id: 'p-db-4', name: 'Amul Fresh Malai Paneer', weight: '200g', category: 'Dairy & Bakery', price: 92, stock: 26, unit: 'pack', barcode: '890126201104' },
  { id: 'p-db-5', name: 'Amul Processed Cheese Slices', weight: '200g', category: 'Dairy & Bakery', price: 145, stock: 20, unit: 'pack', barcode: '890126201105' },
  { id: 'p-db-6', name: 'Mother Dairy Classic Dahi', weight: '400g', category: 'Dairy & Bakery', price: 38, stock: 40, unit: 'tub', barcode: '890126201106' },
  { id: 'p-db-7', name: 'Amul Fresh Low Fat Cream', weight: '250ml', category: 'Dairy & Bakery', price: 65, stock: 18, unit: 'pack', barcode: '890126201107' },
  { id: 'p-db-8', name: 'Britannia 100% Whole Wheat Brown Bread', weight: '400g', category: 'Dairy & Bakery', price: 55, stock: 28, unit: 'pack', barcode: '890126201108' },
  { id: 'p-db-9', name: 'Amul Diced Mozzarella Blend Cheese', weight: '200g', category: 'Dairy & Bakery', price: 135, stock: 16, unit: 'pouch', barcode: '890126201109' },
  { id: 'p-db-10', name: 'Epigamia Greek Yogurt Natural Plain', weight: '100g', category: 'Dairy & Bakery', price: 50, stock: 24, unit: 'cup', barcode: '890126201110' },
  { id: 'p-db-11', name: 'Mother Dairy Pure Cow White Butter', weight: '100g', category: 'Dairy & Bakery', price: 60, stock: 19, unit: 'pack', barcode: '890126201111' },

  // --- Snacks & Biscuits ---
  { id: 'p-sb-1', name: 'Parle-G Original Glucose Biscuits', weight: '800g', category: 'Snacks & Biscuits', price: 95, stock: 60, unit: 'pack', barcode: '890171910101' },
  { id: 'p-sb-2', name: "Haldiram's Nagpur Aloo Bhujia", weight: '400g', category: 'Snacks & Biscuits', price: 130, stock: 32, unit: 'pack', barcode: '890171910102' },
  { id: 'p-sb-3', name: 'Nestle Maggi Masala 2-Minute Instant Noodles', weight: 'Pack of 12', category: 'Snacks & Biscuits', price: 168, stock: 45, unit: 'pack', barcode: '890171910103' },
  { id: 'p-sb-4', name: "Lay's Classic Salted Potato Chips", weight: '115g', category: 'Snacks & Biscuits', price: 50, stock: 48, unit: 'pouch', barcode: '890171910104' },
  { id: 'p-sb-5', name: 'Britannia Good Day Cashew Cookies', weight: '600g', category: 'Snacks & Biscuits', price: 140, stock: 35, unit: 'pack', barcode: '890171910105' },
  { id: 'p-sb-6', name: 'Britannia Marie Gold Crisp Tea Biscuits', weight: '950g', category: 'Snacks & Biscuits', price: 135, stock: 30, unit: 'pack', barcode: '890171910106' },
  { id: 'p-sb-7', name: 'Kurkure Masala Munch Crispy Snack', weight: '150g', category: 'Snacks & Biscuits', price: 40, stock: 50, unit: 'pouch', barcode: '890171910107' },
  { id: 'p-sb-8', name: "Haldiram's Khatta Meetha Mixture", weight: '400g', category: 'Snacks & Biscuits', price: 115, stock: 28, unit: 'pack', barcode: '890171910108' },
  { id: 'p-sb-9', name: 'Parle Hide & Seek Chocolate Chip Biscuits', weight: '350g', category: 'Snacks & Biscuits', price: 110, stock: 34, unit: 'pack', barcode: '890171910109' },
  { id: 'p-sb-10', name: 'Cadbury Oreo Vanilla Cream Sandwich', weight: '300g', category: 'Snacks & Biscuits', price: 90, stock: 40, unit: 'pack', barcode: '890171910110' },
  { id: 'p-sb-11', name: 'Kissan Mixed Fruit Sweet Jam', weight: '500g', category: 'Snacks & Biscuits', price: 175, stock: 22, unit: 'jar', barcode: '890171910111' },
  { id: 'p-sb-12', name: 'Bingo Mad Angles Achaari Masti', weight: '130g', category: 'Snacks & Biscuits', price: 45, stock: 38, unit: 'pouch', barcode: '890171910112' },

  // --- Beverages ---
  { id: 'p-bv-1', name: 'Tata Tea Gold Leaf & Dust Blend', weight: '500g', category: 'Beverages', price: 295, stock: 30, unit: 'pack', barcode: '890105201101' },
  { id: 'p-bv-2', name: 'Nescafe Classic 100% Pure Instant Coffee', weight: '100g', category: 'Beverages', price: 340, stock: 22, unit: 'jar', barcode: '890105201102' },
  { id: 'p-bv-3', name: 'Real Activ 100% Mixed Fruit Juice', weight: '1L', category: 'Beverages', price: 125, stock: 32, unit: 'tetra', barcode: '890105201103' },
  { id: 'p-bv-4', name: 'Brooke Bond Red Label Natural Care Tea', weight: '500g', category: 'Beverages', price: 285, stock: 28, unit: 'pack', barcode: '890105201104' },
  { id: 'p-bv-5', name: 'Bru Instant Roasted Chicory Coffee Blend', weight: '100g', category: 'Beverages', price: 210, stock: 26, unit: 'pouch', barcode: '890105201105' },
  { id: 'p-bv-6', name: 'Cadbury Bournvita Pro-Health Chocolate Drink', weight: '1kg', category: 'Beverages', price: 440, stock: 18, unit: 'jar', barcode: '890105201106' },
  { id: 'p-bv-7', name: 'Tropicana 100% Orange Delight Juice', weight: '1L', category: 'Beverages', price: 135, stock: 25, unit: 'tetra', barcode: '890105201107' },
  { id: 'p-bv-8', name: 'Hamdard Rooh Afza Herbal Rose Sharbat', weight: '750ml', category: 'Beverages', price: 170, stock: 20, unit: 'bottle', barcode: '890105201108' },
  { id: 'p-bv-9', name: 'Brooke Bond Taj Mahal Rich Flavour Tea', weight: '500g', category: 'Beverages', price: 360, stock: 24, unit: 'pack', barcode: '890105201109' },
  { id: 'p-bv-10', name: 'Lipton Pure & Light Green Tea Bags', weight: 'Pack of 50', category: 'Beverages', price: 230, stock: 20, unit: 'box', barcode: '890105201110' },

  // --- Household & Care ---
  { id: 'p-hc-1', name: 'Surf Excel Easy Wash Detergent Powder', weight: '2kg', category: 'Household & Care', price: 285, stock: 28, unit: 'pack', barcode: '890103001101' },
  { id: 'p-hc-2', name: 'Dettol Original Germ Protection Bathing Soap', weight: 'Pack of 4', category: 'Household & Care', price: 195, stock: 25, unit: 'pack', barcode: '890103001102' },
  { id: 'p-hc-3', name: 'Colgate Strong Teeth Calcium Anticavity Toothpaste', weight: '300g', category: 'Household & Care', price: 130, stock: 45, unit: 'pack', barcode: '890103001103' },
  { id: 'p-hc-4', name: 'Vim Lemon Dishwash Concentrated Liquid Gel', weight: '750ml', category: 'Household & Care', price: 140, stock: 36, unit: 'bottle', barcode: '890103001104' },
  { id: 'p-hc-5', name: 'Harpic Power Plus Disinfectant Toilet Cleaner', weight: '1L', category: 'Household & Care', price: 190, stock: 30, unit: 'bottle', barcode: '890103001105' },
  { id: 'p-hc-6', name: 'Ariel Matic Front Load Detergent Powder', weight: '2kg', category: 'Household & Care', price: 460, stock: 18, unit: 'pack', barcode: '890103001106' },
  { id: 'p-hc-7', name: 'Dove Cream Beauty Bathing Bar', weight: 'Pack of 3', category: 'Household & Care', price: 210, stock: 22, unit: 'pack', barcode: '890103001107' },
  { id: 'p-hc-8', name: 'Head & Shoulders Cool Menthol Anti-Dandruff Shampoo', weight: '340ml', category: 'Household & Care', price: 320, stock: 20, unit: 'bottle', barcode: '890103001108' },
  { id: 'p-hc-9', name: 'Lizol Disinfectant Surface Cleaner Citrus', weight: '1L', category: 'Household & Care', price: 185, stock: 26, unit: 'bottle', barcode: '890103001109' },
  { id: 'p-hc-10', name: 'Colin Glass & Household Cleaner Spray', weight: '500ml', category: 'Household & Care', price: 98, stock: 28, unit: 'bottle', barcode: '890103001110' },
  { id: 'p-hc-11', name: 'Godrej aer Pocket Bathroom Air Freshener Fragrance', weight: 'Pack of 3', category: 'Household & Care', price: 165, stock: 35, unit: 'pack', barcode: '890103001111' },

  // --- Daily Essentials ---
  { id: 'p-de-1', name: 'Madhur Pure & Hygienic Refined Sugar', weight: '1kg', category: 'Daily Essentials', price: 54, stock: 90, unit: 'kg', barcode: '890123401101' },
  { id: 'p-de-2', name: 'Tata Salt Vacuum Evaporated Iodized Salt', weight: '1kg', category: 'Daily Essentials', price: 28, stock: 110, unit: 'pouch', barcode: '890123401102' },
  { id: 'p-de-3', name: 'Everest Turmeric Powder Haldi', weight: '200g', category: 'Daily Essentials', price: 62, stock: 45, unit: 'pack', barcode: '890123401103' },
  { id: 'p-de-4', name: 'MDH Deggi Mirch Red Pepper Powder', weight: '100g', category: 'Daily Essentials', price: 82, stock: 40, unit: 'box', barcode: '890123401104' },
  { id: 'p-de-5', name: 'Catch Coriander Powder Dhaniya', weight: '200g', category: 'Daily Essentials', price: 68, stock: 38, unit: 'box', barcode: '890123401105' },
  { id: 'p-de-6', name: 'Everest Royal Garam Masala Blend', weight: '100g', category: 'Daily Essentials', price: 92, stock: 42, unit: 'box', barcode: '890123401106' },
  { id: 'p-de-7', name: 'Catch Whole Cumin Seeds Sabut Jeera', weight: '100g', category: 'Daily Essentials', price: 95, stock: 35, unit: 'pouch', barcode: '890123401107' },
  { id: 'p-de-8', name: 'Catch Black Pepper Whole Kali Mirch', weight: '100g', category: 'Daily Essentials', price: 135, stock: 30, unit: 'pouch', barcode: '890123401108' },
  { id: 'p-de-9', name: 'MDH Kasoori Methi Dried Fenugreek Leaves', weight: '100g', category: 'Daily Essentials', price: 78, stock: 32, unit: 'box', barcode: '890123401109' },
  { id: 'p-de-10', name: 'Catch Small Mustard Seeds Rai', weight: '100g', category: 'Daily Essentials', price: 42, stock: 50, unit: 'pouch', barcode: '890123401110' },
]

// Comprehensive Real Pharmacy Catalog (Authentic Indian medicines, healthcare, and surgical supplies)
export const medicalDefaultProducts: Product[] = [
  // --- Tablets & Capsules ---
  { id: 'm-tc-1', name: 'Dolo 650 Tablet', weight: '15 tablets', category: 'Tablets & Capsules', price: 34, stock: 95, unit: 'strip', barcode: '890111700101' },
  { id: 'm-tc-2', name: 'Crocin 650 Advance Tablet', weight: '15 tablets', category: 'Tablets & Capsules', price: 32, stock: 80, unit: 'strip', barcode: '890111700102' },
  { id: 'm-tc-3', name: 'Pan 40 Tablet', weight: '15 tablets', category: 'Tablets & Capsules', price: 155, stock: 60, unit: 'strip', barcode: '890111700103' },
  { id: 'm-tc-4', name: 'Azithral 500mg Tablet', weight: '5 tablets', category: 'Tablets & Capsules', price: 119, stock: 45, unit: 'strip', barcode: '890111700104' },
  { id: 'm-tc-5', name: 'Montair LC Tablet', weight: '10 tablets', category: 'Tablets & Capsules', price: 185, stock: 50, unit: 'strip', barcode: '890111700105' },
  { id: 'm-tc-6', name: 'Combiflam Tablet', weight: '20 tablets', category: 'Tablets & Capsules', price: 44, stock: 75, unit: 'strip', barcode: '890111700106' },
  { id: 'm-tc-7', name: 'Becosules Z Capsules', weight: '20 capsules', category: 'Tablets & Capsules', price: 52, stock: 90, unit: 'strip', barcode: '890111700107' },
  { id: 'm-tc-8', name: 'Shelcal 500 Calcium Tablet', weight: '15 tablets', category: 'Tablets & Capsules', price: 131, stock: 65, unit: 'strip', barcode: '890111700108' },
  { id: 'm-tc-9', name: 'Neurobion Forte Tablet', weight: '30 tablets', category: 'Tablets & Capsules', price: 39, stock: 85, unit: 'strip', barcode: '890111700109' },
  { id: 'm-tc-10', name: 'Augmentin 625 Duo Tablet', weight: '10 tablets', category: 'Tablets & Capsules', price: 201, stock: 40, unit: 'strip', barcode: '890111700110' },
  { id: 'm-tc-11', name: 'Cetzine 10mg Tablet', weight: '10 tablets', category: 'Tablets & Capsules', price: 18, stock: 110, unit: 'strip', barcode: '890111700111' },
  { id: 'm-tc-12', name: 'Telma 40 Tablet', weight: '15 tablets', category: 'Tablets & Capsules', price: 210, stock: 55, unit: 'strip', barcode: '890111700112' },
  { id: 'm-tc-13', name: 'Glycomet 500 SR Tablet', weight: '20 tablets', category: 'Tablets & Capsules', price: 48, stock: 70, unit: 'strip', barcode: '890111700113' },

  // --- Syrups & Suspensions ---
  { id: 'm-ss-1', name: 'Benadryl Cough Formula Syrup', weight: '100ml', category: 'Syrups & Suspensions', price: 125, stock: 50, unit: 'bottle', barcode: '890111700201' },
  { id: 'm-ss-2', name: 'Ascoril LS Syrup', weight: '100ml', category: 'Syrups & Suspensions', price: 118, stock: 40, unit: 'bottle', barcode: '890111700202' },
  { id: 'm-ss-3', name: 'Gelusil Antacid Liquid Mint', weight: '200ml', category: 'Syrups & Suspensions', price: 135, stock: 45, unit: 'bottle', barcode: '890111700203' },
  { id: 'm-ss-4', name: 'Grilinctus Cough Syrup', weight: '100ml', category: 'Syrups & Suspensions', price: 120, stock: 35, unit: 'bottle', barcode: '890111700204' },
  { id: 'm-ss-5', name: 'Cremaffin Laxative Syrup', weight: '225ml', category: 'Syrups & Suspensions', price: 275, stock: 30, unit: 'bottle', barcode: '890111700205' },
  { id: 'm-ss-6', name: 'Calpol Paediatric Drops', weight: '15ml', category: 'Syrups & Suspensions', price: 68, stock: 55, unit: 'bottle', barcode: '890111700206' },
  { id: 'm-ss-7', name: 'Duphalac Oral Solution', weight: '150ml', category: 'Syrups & Suspensions', price: 245, stock: 25, unit: 'bottle', barcode: '890111700207' },

  // --- First Aid & Surgical ---
  { id: 'm-fa-1', name: 'Betadine Antiseptic Solution 10%', weight: '100ml', category: 'First Aid & Surgical', price: 130, stock: 45, unit: 'bottle', barcode: '890111700301' },
  { id: 'm-fa-2', name: 'Dettol Antiseptic Liquid', weight: '250ml', category: 'First Aid & Surgical', price: 145, stock: 60, unit: 'bottle', barcode: '890111700302' },
  { id: 'm-fa-3', name: 'Band-Aid Medicated Washproof Strips', weight: 'Pack of 50', category: 'First Aid & Surgical', price: 95, stock: 80, unit: 'box', barcode: '890111700303' },
  { id: 'm-fa-4', name: 'Cotton Roll Absorbent Surgical', weight: '100g', category: 'First Aid & Surgical', price: 55, stock: 70, unit: 'roll', barcode: '890111700304' },
  { id: 'm-fa-5', name: 'Crepe Bandage Elastic', weight: '10cm x 4m', category: 'First Aid & Surgical', price: 165, stock: 40, unit: 'piece', barcode: '890111700305' },
  { id: 'm-fa-6', name: '3M Micropore Surgical Tape', weight: '1 inch x 9m', category: 'First Aid & Surgical', price: 85, stock: 65, unit: 'roll', barcode: '890111700306' },
  { id: 'm-fa-7', name: 'Soframycin Skin Cream', weight: '30g', category: 'First Aid & Surgical', price: 62, stock: 55, unit: 'tube', barcode: '890111700307' },
  { id: 'm-fa-8', name: 'Burnol Antiseptic Cream', weight: '20g', category: 'First Aid & Surgical', price: 78, stock: 45, unit: 'tube', barcode: '890111700308' },

  // --- Personal Care & Hygiene ---
  { id: 'm-pc-1', name: 'Volini Pain Relief Spray', weight: '100g', category: 'Personal Care & Hygiene', price: 245, stock: 45, unit: 'bottle', barcode: '890111700401' },
  { id: 'm-pc-2', name: 'Moov Fast Pain Relief Ointment', weight: '50g', category: 'Personal Care & Hygiene', price: 185, stock: 50, unit: 'tube', barcode: '890111700402' },
  { id: 'm-pc-3', name: 'Savlon Antiseptic Disinfectant Liquid', weight: '500ml', category: 'Personal Care & Hygiene', price: 160, stock: 40, unit: 'bottle', barcode: '890111700403' },
  { id: 'm-pc-4', name: 'Lifebuoy Hand Sanitizer', weight: '500ml', category: 'Personal Care & Hygiene', price: 175, stock: 55, unit: 'bottle', barcode: '890111700404' },
  { id: 'm-pc-5', name: 'Whisper Ultra Clean Sanitary Pads', weight: 'Pack of 30', category: 'Personal Care & Hygiene', price: 299, stock: 65, unit: 'pack', barcode: '890111700405' },
  { id: 'm-pc-6', name: 'Himalaya Purifying Neem Face Wash', weight: '150ml', category: 'Personal Care & Hygiene', price: 190, stock: 48, unit: 'tube', barcode: '890111700406' },
  { id: 'm-pc-7', name: 'Sebamed Clear Face Cleansing Foam', weight: '150ml', category: 'Personal Care & Hygiene', price: 580, stock: 20, unit: 'bottle', barcode: '890111700407' },

  // --- Baby & Mother Care ---
  { id: 'm-bc-1', name: 'Pampers All Round Protection Pants (M)', weight: '48 pants', category: 'Baby & Mother Care', price: 699, stock: 40, unit: 'pack', barcode: '890111700501' },
  { id: 'm-bc-2', name: 'Himalaya Baby Powder', weight: '400g', category: 'Baby & Mother Care', price: 195, stock: 50, unit: 'bottle', barcode: '890111700502' },
  { id: 'm-bc-3', name: 'Johnsons Baby Shampoo No More Tears', weight: '200ml', category: 'Baby & Mother Care', price: 210, stock: 45, unit: 'bottle', barcode: '890111700503' },
  { id: 'm-bc-4', name: 'Sebamed Baby Gentle Protective Facial Cream', weight: '50ml', category: 'Baby & Mother Care', price: 420, stock: 25, unit: 'tube', barcode: '890111700504' },
  { id: 'm-bc-5', name: 'Woodwards Gripe Water', weight: '130ml', category: 'Baby & Mother Care', price: 65, stock: 60, unit: 'bottle', barcode: '890111700505' },
  { id: 'm-bc-6', name: 'Dexolac Stage 1 Infant Formula Powder', weight: '400g', category: 'Baby & Mother Care', price: 440, stock: 30, unit: 'tin', barcode: '890111700506' },

  // --- Medical Devices & Wellness ---
  { id: 'm-md-1', name: 'Omron HEM-7120 Blood Pressure Monitor', weight: '1 unit', category: 'Medical Devices & Wellness', price: 2190, stock: 18, unit: 'piece', barcode: '890111700601' },
  { id: 'm-md-2', name: 'Dr. Trust Finger Pulse Oximeter', weight: '1 unit', category: 'Medical Devices & Wellness', price: 1150, stock: 25, unit: 'piece', barcode: '890111700602' },
  { id: 'm-md-3', name: 'Accu-Chek Active Blood Glucose Monitor', weight: 'Kit + 10 strips', category: 'Medical Devices & Wellness', price: 1420, stock: 20, unit: 'kit', barcode: '890111700603' },
  { id: 'm-md-4', name: 'Accu-Chek Active Test Strips', weight: 'Pack of 50', category: 'Medical Devices & Wellness', price: 920, stock: 35, unit: 'box', barcode: '890111700604' },
  { id: 'm-md-5', name: 'Hicks Digital Thermometer Waterproof', weight: '1 unit', category: 'Medical Devices & Wellness', price: 195, stock: 60, unit: 'piece', barcode: '890111700605' },
  { id: 'm-md-6', name: 'Vicks Warm Steam Vaporizer Inhaler', weight: '1 unit', category: 'Medical Devices & Wellness', price: 380, stock: 32, unit: 'piece', barcode: '890111700606' },
  { id: 'm-md-7', name: 'N95 Medical Face Masks 5-Layer', weight: 'Pack of 10', category: 'Medical Devices & Wellness', price: 220, stock: 85, unit: 'pack', barcode: '890111700607' },
]

// Comprehensive Real Mobile & Gadgets Catalog (Authentic smartphones, audio, chargers, cases, screen guards, wearables)
export const mobileDefaultProducts: Product[] = [
  // --- Smartphones ---
  { id: 'mb-sp-1', name: 'Apple iPhone 15', weight: '128GB Black', category: 'Smartphones', price: 69999, stock: 12, unit: 'piece', barcode: '890222800101' },
  { id: 'mb-sp-2', name: 'Apple iPhone 14', weight: '128GB Blue', category: 'Smartphones', price: 57999, stock: 15, unit: 'piece', barcode: '890222800102' },
  { id: 'mb-sp-3', name: 'Samsung Galaxy S24 5G', weight: '256GB Onyx Black', category: 'Smartphones', price: 74999, stock: 10, unit: 'piece', barcode: '890222800103' },
  { id: 'mb-sp-4', name: 'Samsung Galaxy A55 5G', weight: '128GB Awesome Iceblue', category: 'Smartphones', price: 36999, stock: 18, unit: 'piece', barcode: '890222800104' },
  { id: 'mb-sp-5', name: 'OnePlus 12R 5G', weight: '256GB Cool Blue', category: 'Smartphones', price: 42999, stock: 16, unit: 'piece', barcode: '890222800105' },
  { id: 'mb-sp-6', name: 'OnePlus Nord CE 4 5G', weight: '128GB Celadon Marble', category: 'Smartphones', price: 24999, stock: 22, unit: 'piece', barcode: '890222800106' },
  { id: 'mb-sp-7', name: 'Redmi Note 13 Pro+ 5G', weight: '256GB Fusion Purple', category: 'Smartphones', price: 29999, stock: 20, unit: 'piece', barcode: '890222800107' },
  { id: 'mb-sp-8', name: 'Realme 12 Pro 5G', weight: '128GB Submarine Blue', category: 'Smartphones', price: 23999, stock: 24, unit: 'piece', barcode: '890222800108' },
  { id: 'mb-sp-9', name: 'Motorola Edge 50 Pro 5G', weight: '256GB Luxe Lavender', category: 'Smartphones', price: 31999, stock: 14, unit: 'piece', barcode: '890222800109' },

  // --- Audio & Earbuds ---
  { id: 'mb-au-1', name: 'Apple AirPods Pro 2nd Gen', weight: 'USB-C MagSafe', category: 'Audio & Earbuds', price: 21900, stock: 15, unit: 'piece', barcode: '890222800201' },
  { id: 'mb-au-2', name: 'Samsung Galaxy Buds 2 Pro', weight: 'Graphite', category: 'Audio & Earbuds', price: 14999, stock: 18, unit: 'piece', barcode: '890222800202' },
  { id: 'mb-au-3', name: 'Boat Airdopes 141 ANC TWS', weight: 'Black', category: 'Audio & Earbuds', price: 1499, stock: 65, unit: 'piece', barcode: '890222800203' },
  { id: 'mb-au-4', name: 'OnePlus Bullets Wireless Z2', weight: 'Acoustic Red', category: 'Audio & Earbuds', price: 1999, stock: 45, unit: 'piece', barcode: '890222800204' },
  { id: 'mb-au-5', name: 'Sony WH-1000XM5 Wireless Headphones', weight: 'Silver', category: 'Audio & Earbuds', price: 28990, stock: 8, unit: 'piece', barcode: '890222800205' },
  { id: 'mb-au-6', name: 'JBL Flip 6 Portable Bluetooth Speaker', weight: 'Squad Black', category: 'Audio & Earbuds', price: 9999, stock: 16, unit: 'piece', barcode: '890222800206' },
  { id: 'mb-au-7', name: 'Realme Buds Air 5 ANC TWS', weight: 'Deep Sea Blue', category: 'Audio & Earbuds', price: 3299, stock: 30, unit: 'piece', barcode: '890222800207' },

  // --- Chargers & Cables ---
  {
    id: 'mb-ch-1',
    name: 'Apple 20W USB-C Power Adapter',
    weight: 'Model A2246 / White',
    category: 'Chargers & Cables',
    price: 1799,
    stock: 45,
    unit: 'piece',
    barcode: '195949121234',
    alternateBarcodes: ['0195949121234', '19594912123', 'HHY63350DKX263MAY', 'MUVR3HN/A', 'A2246', '890222800301'],
  },
  { id: 'mb-ch-2', name: 'Samsung 25W Super Fast Travel Adapter', weight: 'Type-C Port', category: 'Chargers & Cables', price: 1299, stock: 40, unit: 'piece', barcode: '890222800302' },
  { id: 'mb-ch-3', name: 'OnePlus 65W SuperVOOC Power Adapter', weight: 'White Red', category: 'Chargers & Cables', price: 2199, stock: 28, unit: 'piece', barcode: '890222800303' },
  { id: 'mb-ch-4', name: 'Anker 30W GaN Fast Charger', weight: 'Black Ultra-compact', category: 'Chargers & Cables', price: 1599, stock: 35, unit: 'piece', barcode: '890222800304' },
  { id: 'mb-ch-5', name: 'Boat Rugged Type-C to Type-C Braided Cable', weight: '1.5 Meter', category: 'Chargers & Cables', price: 399, stock: 80, unit: 'piece', barcode: '890222800305' },
  { id: 'mb-ch-6', name: 'Apple USB-C to Lightning Cable', weight: '1 Meter', category: 'Chargers & Cables', price: 1699, stock: 40, unit: 'piece', barcode: '890222800306' },
  { id: 'mb-ch-7', name: 'Stuffcool 65W Multiport Desktop Charger', weight: '3 Ports (2C+1A)', category: 'Chargers & Cables', price: 2999, stock: 22, unit: 'piece', barcode: '890222800307' },

  // --- Cases & Covers ---
  { id: 'mb-cs-1', name: 'Spigen Tough Armor Case for iPhone 15', weight: 'Gunmetal Shockproof', category: 'Cases & Covers', price: 1499, stock: 35, unit: 'piece', barcode: '890222800401' },
  { id: 'mb-cs-2', name: 'Ringke Fusion Matte Case for Galaxy S24', weight: 'Smoke Black Clear', category: 'Cases & Covers', price: 1199, stock: 30, unit: 'piece', barcode: '890222800402' },
  { id: 'mb-cs-3', name: 'Nillkin Frosted Shield for OnePlus 12R', weight: 'Matte Peacock Blue', category: 'Cases & Covers', price: 899, stock: 40, unit: 'piece', barcode: '890222800403' },
  { id: 'mb-cs-4', name: 'DailyObjects Silicone MagSafe Soft Case', weight: 'Midnight Black', category: 'Cases & Covers', price: 1299, stock: 25, unit: 'piece', barcode: '890222800404' },
  { id: 'mb-cs-5', name: 'Kapaver Rugged Military Grade Bumper Case', weight: 'Carbon Fiber Finish', category: 'Cases & Covers', price: 799, stock: 50, unit: 'piece', barcode: '890222800405' },
  { id: 'mb-cs-6', name: 'Vintage Leather Flip Wallet Case', weight: 'Saddle Brown', category: 'Cases & Covers', price: 999, stock: 28, unit: 'piece', barcode: '890222800406' },

  // --- Screen Protectors ---
  { id: 'mb-sp-10', name: 'Spigen EZ Fit Tempered Glass for iPhone 15', weight: 'Pack of 2 with Tray', category: 'Screen Protectors', price: 1399, stock: 40, unit: 'box', barcode: '890222800501' },
  { id: 'mb-sp-11', name: 'Ringke Invisible Defender Glass for Galaxy S24', weight: '2-Pack Edge-to-Edge', category: 'Screen Protectors', price: 1099, stock: 35, unit: 'box', barcode: '890222800502' },
  { id: 'mb-sp-12', name: '9H Full Glue HD Tempered Glass', weight: 'Universal Curved Edge', category: 'Screen Protectors', price: 299, stock: 120, unit: 'piece', barcode: '890222800503' },
  { id: 'mb-sp-13', name: 'Matte Anti-Fingerprint Gaming Screen Guard', weight: 'Anti-Glare 9H', category: 'Screen Protectors', price: 449, stock: 65, unit: 'piece', barcode: '890222800504' },
  { id: 'mb-sp-14', name: 'Privacy Screen Protector 28-Degree Anti-Peep', weight: 'Black Tinted 9H Glass', category: 'Screen Protectors', price: 599, stock: 55, unit: 'piece', barcode: '890222800505' },
  { id: 'mb-sp-15', name: 'UV Liquid Curved Tempered Glass for Premium Phones', weight: 'With UV Light Machine', category: 'Screen Protectors', price: 799, stock: 30, unit: 'kit', barcode: '890222800506' },

  // --- Power Banks & Wearables ---
  { id: 'mb-pw-1', name: 'Anker MagGo 10000mAh Magnetic Power Bank', weight: 'Wireless Qi2 15W', category: 'Power Banks & Wearables', price: 4999, stock: 20, unit: 'piece', barcode: '890222800601' },
  { id: 'mb-pw-2', name: 'Mi 20000mAh Power Bank 3i Fast Charging', weight: '18W Dual Output', category: 'Power Banks & Wearables', price: 2099, stock: 45, unit: 'piece', barcode: '890222800602' },
  { id: 'mb-pw-3', name: 'Ambrane 10000mAh Pocket Power Bank', weight: '22.5W Metallic Blue', category: 'Power Banks & Wearables', price: 1199, stock: 50, unit: 'piece', barcode: '890222800603' },
  { id: 'mb-pw-4', name: 'Apple Watch Series 9 GPS', weight: '45mm Midnight Aluminum', category: 'Power Banks & Wearables', price: 42900, stock: 10, unit: 'piece', barcode: '890222800604' },
  { id: 'mb-pw-5', name: 'Samsung Galaxy Watch 6 Bluetooth', weight: '44mm Graphite', category: 'Power Banks & Wearables', price: 23999, stock: 12, unit: 'piece', barcode: '890222800605' },
  { id: 'mb-pw-6', name: 'Noise ColorFit Pulse 3 Smartwatch', weight: '1.96" TFT Display', category: 'Power Banks & Wearables', price: 1599, stock: 55, unit: 'piece', barcode: '890222800606' },
  { id: 'mb-pw-7', name: 'Boat Wave Call Bluetooth Calling Smartwatch', weight: 'Active Black', category: 'Power Banks & Wearables', price: 1399, stock: 60, unit: 'piece', barcode: '890222800607' },
]

// Realistic dynamic order generation tailored to shop domain
function generateRealisticOrders(catalog: Product[], shopDomain: ShopType = 'grocery'): Order[] {
  const seed: Order[] = []
  const customers = [
    'Amit Sharma', 'Pooja Verma', 'Suresh Patel', 'Neha Gupta', 'Vikram Singh',
    'Ananya Rao', 'Rahul Deshmukh', 'Priya Nair', 'Sunil Joshi', 'Kavita Reddy',
    'Rajesh Agarwal', 'Suman Roy', 'Sunita Devi', 'Deepak Nair', 'Meera Iyer',
    'Arjun Mehta', 'Ritu Kapoor', 'Manoj Tiwari', 'Shalini Sen', 'Harish Chandra',
    'Divya Balan', 'Gaurav Bhatia', 'Tanvi Saxena', 'Karan Malhotra', 'Swati Mishra'
  ]

  const now = new Date()

  // Items per cart based on domain (phones typically 1-2 items, groceries 2-4, medical 1-3)
  const pickItems = (itemCount: number) => {
    const list = [...catalog]
    const items: OrderItem[] = []
    const startIdx = Math.floor(Math.random() * list.length)
    const effectiveCount = Math.min(itemCount, list.length)
    for (let i = 0; i < effectiveCount; i++) {
      const prod = list[(startIdx + i * 3) % list.length]
      // Quantity: phones/devices usually 1, medicines 1-3, groceries 1-3
      let qty = 1
      if (shopDomain === 'grocery') {
        qty = (i % 2) + 1
      } else if (shopDomain === 'medical') {
        qty = (i % 3) + 1
      } else if (shopDomain === 'mobile') {
        qty = prod.price > 10000 ? 1 : ((i % 2) + 1)
      }
      items.push({
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        quantity: qty,
        price: prod.price,
        total: prod.price * qty,
      })
    }
    return items
  }

  let orderSeq = shopDomain === 'medical' ? 5100 : shopDomain === 'mobile' ? 3200 : 8900

  // 1. Orders for today (5 real customer receipts)
  for (let i = 0; i < 5; i++) {
    const count = shopDomain === 'mobile' ? 2 : 3
    const items = pickItems(count)
    const total = items.reduce((s, it) => s + it.total, 0)
    const orderDate = new Date(now.getTime() - (i + 1) * 3600000 * 2)
    seed.push({
      id: `ORD-${++orderSeq}`,
      items,
      total,
      date: orderDate.toISOString(),
      timestamp: orderDate.getTime(),
      customerName: customers[i % customers.length],
    })
  }

  // 2. Orders for previous 6 days (3 orders each day)
  for (let day = 1; day <= 6; day++) {
    for (let k = 0; k < 3; k++) {
      const count = shopDomain === 'mobile' ? (k === 0 ? 1 : 2) : (2 + (k % 2))
      const items = pickItems(count)
      const total = items.reduce((s, it) => s + it.total, 0)
      const d = new Date()
      d.setDate(d.getDate() - day)
      d.setHours(10 + k * 4, 15 + k * 12, 0, 0)
      seed.push({
        id: `ORD-${++orderSeq}`,
        items,
        total,
        date: d.toISOString(),
        timestamp: d.getTime(),
        customerName: customers[(day * 3 + k) % customers.length],
      })
    }
  }

  // 3. Orders across past 5 months (6 orders per month)
  for (let m = 1; m <= 5; m++) {
    for (let w = 0; w < 6; w++) {
      const count = shopDomain === 'mobile' ? 2 : 3
      const items = pickItems(count)
      const total = items.reduce((s, it) => s + it.total, 0)
      const d = new Date()
      d.setMonth(d.getMonth() - m)
      d.setDate(Math.min(28, 3 + w * 4))
      d.setHours(11 + (w % 6), 30, 0, 0)
      seed.push({
        id: `ORD-${++orderSeq}`,
        items,
        total,
        date: d.toISOString(),
        timestamp: d.getTime(),
        customerName: customers[(m * 5 + w) % customers.length],
      })
    }
  }

  return seed.sort((a, b) => b.timestamp - a.timestamp)
}

// Helper to sanitize product name and weight
export function sanitizeProduct(p: Product): Product {
  let name = (p.name || '').trim()
  let weight = (p.weight || '').trim()
  const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match) {
    name = match[1].trim()
    if (!weight) {
      weight = match[2].trim()
    }
  }
  return {
    ...p,
    name,
    weight,
  }
}

// Map each shop type to its default catalog
export function getDefaultCatalogForType(type: ShopType): Product[] {
  if (type === 'medical') return medicalDefaultProducts
  if (type === 'mobile') return mobileDefaultProducts
  return defaultProducts
}

// Active Shop Type State
const savedShopType = loadFromStorage<ShopType>('smartshop_store_type', 'grocery')
const validShopType: ShopType = (savedShopType === 'medical' || savedShopType === 'mobile' || savedShopType === 'grocery')
  ? savedShopType
  : 'grocery'

const currentShopType = ref<ShopType>(validShopType)

// Shop Config
const initialShopMeta = SHOP_TYPE_META[currentShopType.value]
const storedConfig = loadFromStorage<ShopConfig>('smartshop_config', {
  shopName: initialShopMeta.name,
  ownerName: 'Store Manager',
  currency: '₹',
  gstEnabled: true,
  gstRate: currentShopType.value === 'mobile' ? 18 : 5,
})

// Synchronize shop name with current shop type
storedConfig.shopName = initialShopMeta.name
saveToStorage('smartshop_config', storedConfig)

// Catalog & Orders Loading / Auto-seeding
const CATALOG_SEED_VERSION = 'smartshop_multishop_v7_real_barcodes'
const currentSeedVersion = localStorage.getItem('smartshop_multishop_version')

function loadProductsForType(type: ShopType): Product[] {
  const key = `smartshop_products_${type}`
  const defaults = getDefaultCatalogForType(type)
  if (currentSeedVersion !== CATALOG_SEED_VERSION) {
    saveToStorage(key, defaults)
    return defaults
  }
  return loadFromStorage<Product[]>(key, defaults).map(sanitizeProduct)
}

function loadOrdersForType(type: ShopType, catalog: Product[]): Order[] {
  const key = `smartshop_orders_${type}`
  const defaults = generateRealisticOrders(catalog, type)
  if (currentSeedVersion !== CATALOG_SEED_VERSION) {
    saveToStorage(key, defaults)
    return defaults
  }
  return loadFromStorage<Order[]>(key, defaults)
}

if (currentSeedVersion !== CATALOG_SEED_VERSION) {
  // Pre-seed all three shop types once
  const groceryCats = defaultProducts
  saveToStorage('smartshop_products_grocery', groceryCats)
  saveToStorage('smartshop_orders_grocery', generateRealisticOrders(groceryCats, 'grocery'))

  const medicalCats = medicalDefaultProducts
  saveToStorage('smartshop_products_medical', medicalCats)
  saveToStorage('smartshop_orders_medical', generateRealisticOrders(medicalCats, 'medical'))

  const mobileCats = mobileDefaultProducts
  saveToStorage('smartshop_products_mobile', mobileCats)
  saveToStorage('smartshop_orders_mobile', generateRealisticOrders(mobileCats, 'mobile'))

  localStorage.setItem('smartshop_multishop_version', CATALOG_SEED_VERSION)
}

// Reactive store references
const shopConfig = ref<ShopConfig>(storedConfig)
const products = ref<Product[]>(loadProductsForType(currentShopType.value))
const orders = ref<Order[]>(loadOrdersForType(currentShopType.value, products.value))

// Switch store type seamlessly
function setShopType(type: ShopType, notify = true) {
  if (type !== 'grocery' && type !== 'medical' && type !== 'mobile') return

  currentShopType.value = type
  saveToStorage('smartshop_store_type', type)

  const meta = SHOP_TYPE_META[type]
  shopConfig.value = {
    ...shopConfig.value,
    shopName: meta.name,
    gstRate: type === 'mobile' ? 18 : 5,
  }
  saveToStorage('smartshop_config', shopConfig.value)

  // Load target domain products & orders
  const loadedProds = loadProductsForType(type)
  products.value = loadedProds
  orders.value = loadOrdersForType(type, loadedProds)

  if (notify) {
    showNotification({
      type: 'success',
      title: `${meta.name} Activated!`,
      message: `Store switched to ${meta.shortName}. Inventory, submenus, and dashboard updated.`,
      duration: 3500,
    })
  }
}

// Auto-persist per active shop type
watch(
  products,
  (val) => {
    saveToStorage(`smartshop_products_${currentShopType.value}`, val)
  },
  { deep: true }
)

watch(
  orders,
  (val) => {
    saveToStorage(`smartshop_orders_${currentShopType.value}`, val)
  },
  { deep: true }
)

watch(
  shopConfig,
  (val) => {
    saveToStorage('smartshop_config', val)
  },
  { deep: true }
)

export function useShopStore() {
  // --- Config ---
  function updateConfig(config: Partial<ShopConfig>) {
    shopConfig.value = { ...shopConfig.value, ...config }
  }

  // --- Products ---
  function addProduct(product: Omit<Product, 'id'>) {
    let name = product.name.trim()
    let weight = (product.weight || '').trim()
    const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
    if (match) {
      name = match[1].trim()
      if (!weight) {
        weight = match[2].trim()
      }
    }
    const newProduct: Product = {
      ...product,
      name,
      weight,
      id: 'prod-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    }
    products.value.unshift(newProduct)
    showNotification({
      type: 'success',
      title: 'Added Successfully!',
      message: `"${name}" has been added to inventory.`,
      duration: 4500,
    })
    return newProduct
  }

  function updateProduct(id: string, updates: Partial<Product>) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      let next = { ...products.value[idx], ...updates }
      if (next.name) {
        next = sanitizeProduct(next)
      }
      products.value[idx] = next
      showNotification({
        type: 'success',
        title: 'Updated Successfully!',
        message: `"${products.value[idx].name}" updated.`,
      })
    }
  }

  function deleteProduct(id: string) {
    const p = products.value.find(item => item.id === id)
    const name = p ? p.name : 'Item'
    products.value = products.value.filter(item => item.id !== id)
    showNotification({
      type: 'info',
      title: 'Removed Item',
      message: `"${name}" was removed from inventory.`,
    })
  }

  function matchesBarcode(p: Product, raw: string, clean: string): boolean {
    const pCode = (p.barcode || '').trim().replace(/[\s\-\.]/g, '').toUpperCase()
    const pId = (p.id || '').trim().toUpperCase()

    // 1. Exact match on barcode or ID
    if (pCode && (pCode === clean || pCode === raw)) return true
    if (pId && (pId === clean || pId === raw)) return true

    // 2. Check alternate barcodes list
    if (p.alternateBarcodes && p.alternateBarcodes.length) {
      const matchAlt = p.alternateBarcodes.some((alt) => {
        const cleanAlt = alt.trim().replace(/[\s\-\.]/g, '').toUpperCase()
        return cleanAlt === clean || clean.includes(cleanAlt) || cleanAlt.includes(clean)
      })
      if (matchAlt) return true
    }

    // 3. UPC-A (12 digits) vs EAN-13 (13 digits with leading 0)
    if (clean.length === 12 && pCode === '0' + clean) return true
    if (clean.length === 13 && clean.startsWith('0') && pCode === clean.slice(1)) return true
    if (pCode.length === 12 && clean === '0' + pCode) return true
    if (pCode.length === 13 && pCode.startsWith('0') && clean === pCode.slice(1)) return true

    // 4. Substring match for serial/model codes if length >= 6
    if (clean.length >= 6) {
      if (pCode && (clean.includes(pCode) || pCode.includes(clean))) return true
      const pName = (p.name || '').toUpperCase()
      if (clean.length >= 8 && pName.includes(clean)) return true
    }

    return false
  }

  function findProductByBarcode(code: string): { product: Product; shopType?: ShopType } | null {
    if (!code) return null
    const raw = code.trim()
    const clean = raw.replace(/[\s\-\.]/g, '').toUpperCase()

    // 1. Search in current active shop products first
    const currentMatch = products.value.find((p) => matchesBarcode(p, raw, clean))
    if (currentMatch) {
      return { product: currentMatch, shopType: currentShopType.value }
    }

    // 2. Fallback: Search across all shop types (e.g. mobile gadget scanned while in grocery)
    const allShopTypes: ShopType[] = ['grocery', 'mobile', 'medical']
    for (const st of allShopTypes) {
      if (st === currentShopType.value) continue
      const catalog = loadProductsForType(st)
      const found = catalog.find((p) => matchesBarcode(p, raw, clean))
      if (found) {
        return { product: found, shopType: st }
      }
    }

    return null
  }

  function bulkAddProducts(items: Omit<Product, 'id'>[]) {
    items.forEach(item => addProduct(item))
  }

  // --- Orders ---
  function createOrder(items: OrderItem[], customerName?: string): Order {
    const totalAmount = items.reduce((sum, i) => sum + i.total, 0)
    const taxAmount = shopConfig.value.gstEnabled
      ? (totalAmount * shopConfig.value.gstRate) / 100
      : 0
    const finalTotal = Math.round((totalAmount + taxAmount) * 100) / 100

    const order: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      items,
      total: finalTotal,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      customerName: customerName || 'Walk-in Customer',
    }

    orders.value.unshift(order)

    // Deduct inventory stock
    items.forEach(item => {
      const product = products.value.find(p => p.id === item.productId)
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity)
      }
    })

    return order
  }

  // --- Analytics & KPIs ---
  const totalSales = computed(() => {
    return orders.value.reduce((sum, o) => sum + o.total, 0)
  })

  const todaySales = computed(() => {
    const today = new Date().toDateString()
    return orders.value
      .filter(o => new Date(o.date).toDateString() === today)
      .reduce((sum, o) => sum + o.total, 0)
  })

  const totalOrders = computed(() => orders.value.length)

  const todayOrders = computed(() => {
    const today = new Date().toDateString()
    return orders.value.filter(o => new Date(o.date).toDateString() === today).length
  })

  const totalProductsSold = computed(() => {
    return orders.value.reduce((sum, o) => {
      return sum + o.items.reduce((s, i) => s + i.quantity, 0)
    }, 0)
  })

  const monthlyRevenue = computed(() => {
    const now = new Date()
    return orders.value
      .filter(o => {
        const d = new Date(o.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, o) => sum + o.total, 0)
  })

  // 1. Daily Sales Graph (Last 7 Days)
  const dailySales = computed(() => {
    const days: { label: string; date: string; value: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toDateString()
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
      const value = orders.value
        .filter(o => new Date(o.date).toDateString() === dateStr)
        .reduce((sum, o) => sum + o.total, 0)
      days.push({ label, date: dateStr, value: Math.round(value) })
    }
    return days
  })

  // 2. Weekly Sales Trends (Last 4 Weeks)
  const weeklySales = computed(() => {
    const weeks: { label: string; value: number }[] = []
    for (let i = 3; i >= 0; i--) {
      const end = new Date()
      end.setDate(end.getDate() - i * 7)
      const start = new Date(end)
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)

      const label = `Week ${4 - i} (${start.getDate()} ${start.toLocaleDateString('en-IN', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('en-IN', { month: 'short' })})`
      const value = orders.value
        .filter(o => {
          const d = new Date(o.date)
          return d >= start && d <= end
        })
        .reduce((sum, o) => sum + o.total, 0)
      weeks.push({ label, value: Math.round(value) })
    }
    return weeks
  })

  // 3. Monthly Revenue Chart (Last 6 Months)
  const monthlySalesData = computed(() => {
    const months: { label: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const targetMonth = d.getMonth()
      const targetYear = d.getFullYear()
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })

      const value = orders.value
        .filter(o => {
          const od = new Date(o.date)
          return od.getMonth() === targetMonth && od.getFullYear() === targetYear
        })
        .reduce((sum, o) => sum + o.total, 0)

      months.push({ label, value: Math.round(value) })
    }
    return months
  })

  // 4. Yearly Sales Performance
  const yearlySales = computed(() => {
    const years: { label: string; value: number }[] = []
    const currentYear = new Date().getFullYear()
    for (let y = currentYear - 2; y <= currentYear; y++) {
      const value = orders.value
        .filter(o => new Date(o.date).getFullYear() === y)
        .reduce((sum, o) => sum + o.total, 0)
      years.push({ label: y.toString(), value: Math.round(value) })
    }
    return years
  })

  // Product Insights: Best-Selling Products
  const bestSellingProducts = computed(() => {
    const map: Record<string, { id: string; name: string; category: string; price: number; quantity: number; revenue: number }> = {}
    orders.value.forEach(o => {
      o.items.forEach(item => {
        if (!map[item.productId]) {
          const matchedProd = products.value.find(p => p.id === item.productId)
          map[item.productId] = {
            id: item.productId,
            name: item.productName,
            category: item.category,
            price: item.price || (matchedProd ? matchedProd.price : 0),
            quantity: 0,
            revenue: 0,
          }
        }
        map[item.productId].quantity += item.quantity
        map[item.productId].revenue += item.total
      })
    })
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)
  })

  // Product Insights: Category Distribution
  const categoryDistribution = computed(() => {
    const map: Record<string, number> = {}
    orders.value.forEach(o => {
      o.items.forEach(item => {
        const cat = item.category || 'General'
        map[cat] = (map[cat] || 0) + item.total
      })
    })

    const total = Object.values(map).reduce((a, b) => a + b, 0)
    return Object.entries(map)
      .map(([name, val]) => ({
        name,
        value: Math.round(val),
        percentage: total > 0 ? Math.round((val / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
  })

  // Products with real-time inventory and sales metrics
  const productsWithStats = computed(() => {
    const soldMap: Record<string, number> = {}
    const revenueMap: Record<string, number> = {}

    orders.value.forEach(order => {
      order.items.forEach(item => {
        soldMap[item.productId] = (soldMap[item.productId] || 0) + item.quantity
        revenueMap[item.productId] = (revenueMap[item.productId] || 0) + item.total
      })
    })

    return products.value.map(prod => {
      const sold = soldMap[prod.id] || 0
      const revenue = revenueMap[prod.id] || 0
      let status = 'In Stock'
      if (prod.stock <= 0) {
        status = 'Out of Stock'
      } else if (prod.stock < 15) {
        status = 'Low Stock'
      } else if (sold >= 3) {
        status = 'Top Seller'
      }

      return {
        ...prod,
        available: prod.stock,
        sold,
        revenue,
        status,
      }
    })
  })

  // Unique Categories
  const categories = computed(() => {
    const set = new Set<string>()
    products.value.forEach(p => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  })

  // Multi-Shop Store Type Helpers
  const currentShopMeta = computed(() => SHOP_TYPE_META[currentShopType.value])
  const currentShopSections = computed(() => SHOP_TYPE_META[currentShopType.value].sections)
  const currentShopCategories = computed(() =>
    SHOP_TYPE_META[currentShopType.value].sections.filter((s) => s.slug !== 'all').map((s) => s.name)
  )

  // Recent Orders list
  const recentOrders = computed(() => orders.value.slice(0, 15))

  return {
    currentShopType,
    currentShopMeta,
    currentShopSections,
    currentShopCategories,
    setShopType,
    SHOP_TYPE_META,
    shopConfig,
    products,
    productsWithStats,
    orders,
    updateConfig,
    findProductByBarcode,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkAddProducts,
    createOrder,
    totalSales,
    todaySales,
    totalOrders,
    todayOrders,
    totalProductsSold,
    monthlyRevenue,
    dailySales,
    weeklySales,
    monthlySalesData,
    yearlySales,
    bestSellingProducts,
    categoryDistribution,
    categories,
    recentOrders,
    activeNotifications,
    showNotification,
    removeNotification,
  }
}
