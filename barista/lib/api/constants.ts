export const API_ENDPOINTS = {
  CATEGORIES: '/api/categories',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  ORDER_STATUS: (orderId: string) => `/api/orders/${orderId}`,
  ORDER_STATUS_UPDATE: (orderId: string) => `/api/orders/${orderId}/status`,
} as const;

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RATE_LIMIT_REQUESTS: 10,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
} as const;

export const CACHE_DURATIONS = {
  CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
  PRODUCTS: 60 * 60 * 1000, // 1 hour
  ORDER: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
