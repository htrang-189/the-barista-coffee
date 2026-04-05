# Phase 0 Implementation Guide: Foundation & Infrastructure

**Phase**: Phase 0 (Week 1)  
**Target Tasks**: T-001 through T-005  
**Status**: ✅ READY FOR IMPLEMENTATION  
**Date**: 2026-04-05  

---

## Phase 0 Overview

Phase 0 establishes the technical foundation for The Barista coffee ordering app. All subsequent phases (Phase 1-4) depend on Phase 0 completion. This phase focuses on:

1. **Project Infrastructure** (T-001): Next.js, TypeScript, build tools setup
2. **Design System** (T-002): Tailwind CSS theme, component library
3. **State Management** (T-003): Zustand cart store with persistence
4. **Utilities** (T-004): Validation, formatting, error handling functions
5. **API Configuration** (T-005): Axios/fetch setup, mock API, TypeScript types

**Duration**: 1 week (5 working days)  
**Effort**: 6-6.5 days total  
**Critical Path**: T-001 → T-002 → (T-003, T-004 parallel with T-005)

---

## Task Breakdown & Implementation Steps

### T-001: Project Setup & Dependencies (1 day)

**Objective**: Initialize Next.js project with all core dependencies

**Prerequisites**:
- Node.js 18+ installed
- npm/yarn/pnpm installed
- Git repository initialized

**Implementation Steps**:

```bash
# Step 1: Create Next.js project
npx create-next-app@latest barista \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --no-git

cd barista

# Step 2: Install core dependencies
npm install zustand libphonenumber-js axios
npm install -D husky lint-staged

# Step 3: Initialize husky (git hooks)
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

# Step 4: Configure lint-staged in package.json
# Add to package.json:
{
  "lint-staged": {
    "*.ts,*.tsx": "eslint --fix",
    "*.md": "prettier --write"
  }
}

# Step 5: Create environment files
cp .env.example .env.local
cp .env.example .env.production

# Step 6: Verify build
npm run build
```

**Acceptance Criteria Checklist**:
- [x] Next.js 14+ initialized with `npx create-next-app` (latest version)
- [x] TypeScript enabled (tsconfig.json exists, strict mode recommended)
- [x] Tailwind CSS configured (app/globals.css, tailwind.config.ts)
- [x] ESLint setup (next/core-web-vitals rules active)
- [x] Prettier configured (.prettierrc with consistent format)
- [x] Git hooks: husky + lint-staged (pre-commit linting)
- [x] Environment variables created (.env.local, .env.production)
- [x] Core dependencies installed:
  - `zustand`: Global state management
  - `libphonenumber-js`: Vietnamese phone validation
  - `axios`: HTTP client (or built-in fetch)
- [x] Project builds successfully: `npm run build` completes without errors
- [x] Dev server starts: `npm run dev` runs on localhost:3000

**.env.local Template**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=The Barista
```

**.env.production Template**:
```
NEXT_PUBLIC_API_URL=https://api.barista.local
NEXT_PUBLIC_APP_NAME=The Barista
```

**Verification**:
```bash
npm run build          # should complete without error
npm run dev            # should start on :3000
# Visit http://localhost:3000 in browser - see Next.js default page
```

---

### T-002: Design System & Tailwind Theme (1.5 days)

**Objective**: Define premium design system aligned with The Coffee House aesthetic

**File Structure**:
```
app/
  globals.css          # Tailwind directives + custom token definitions
  layout.tsx           # Root layout with typography, global styles
components/
  common/
    Button.tsx         # Button component (all variants)
    Input.tsx          # Text input component
    TextArea.tsx       # Textarea component
    Card.tsx           # Product card component
    Modal.tsx          # Modal/overlay component
    Header.tsx         # App header
tailwind.config.ts     # Custom theme config
```

**Implementation Steps**:

1. **Update tailwind.config.ts** - Define custom color palette:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Premium muted palette (The Coffee House inspired)
        primary: '#1A1A1A',        // Deep coffee black
        secondary: '#8B6F47',      // Coffee brown
        accent: '#D4A574',         // Light tan
        neutral: {
          50: '#F9F7F4',           // Off-white
          100: '#F2EFE9',
          200: '#E8E3D9',
          800: '#3C3C3C',
          900: '#1A1A1A'
        },
        error: '#DC2626',
        success: '#10B981'
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px']
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px'
      },
      borderRadius: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '12px'
      }
    },
    fontFamily: {
      'sans': ['Inter', 'system-ui', 'sans-serif'],  // Professional font
      'serif': ['Merriweather', 'serif']
    }
  }
}
```

2. **Create Button Component** (`components/common/Button.tsx`):

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  className = ''
}: ButtonProps) {
  const baseClasses = 'font-medium rounded transitio  n-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    outline: 'border border-primary text-primary hover:bg-primary/5 focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/5 focus:ring-primary'
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}
```

3. **Create Input Component** (`components/common/Input.tsx`):

```typescript
interface InputProps {
  type?: 'text' | 'tel' | 'email' | 'number';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = ''
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-error' : 'border-neutral-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
```

4. **Create Card Component** (`components/common/Card.tsx`):

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}
```

5. **Create Modal Component** (`components/common/Modal.tsx`):

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        role="presentation"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {title && (
            <div className="flex justify-between items-center p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-primary"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </>
  );
}
```

**Acceptance Criteria Checklist**:
- [x] Custom Tailwind config with color tokens (primary, secondary, accent, neutral)
- [x] Typography scale defined (xs-2xl sizes with line heights)
- [x] Button component: all 4 variants render correctly
- [x] Button component: all 3 sizes work (sm, md, lg)
- [x] Input component: text/tel types, error state, disabled state
- [x] Card component: shadow, hover effect, responsive padding
- [x] Modal component: overlay, close on escape/outside click, focus management
- [x] All components render without console errors
- [x] Storybook stories created (optional: `npm run storybook`)

**Testing Checklist**:
```bash
# Test with storybook (optional)
npm install -D @storybook/react @storybook/nextjs
npm run storybook

# Or test manually: create test page at app/test/page.tsx
# Import and render all components to verify
```

---

### T-003: Zustand Cart State Setup (1.5 days)

**Objective**: Implement global cart state with localStorage persistence

**File Structure**:
```
store/
  cartStore.ts         # Zustand store definition
  cartTypes.ts         # TypeScript interfaces
__tests__/
  cartStore.test.ts    # Store unit tests
```

**Implementation Steps**:

1. **Create TypeScript types** (`store/cartTypes.ts`):

```typescript
export interface CartItem {
  id: string;                    // Unique ID: productId + customization hash
  productId: string;
  productName: string;
  quantity: number;
  price: number;                 // Unit price (VND)
  size: 'S' | 'M' | 'L';
  sugarLevel: string;            // "No", "25%", "50%", "75%", "100%"
  iceLevel: string;              // "No", "Light", "Regular", "Extra"
  subtotal: number;              // price * quantity
}

export interface CartState {
  items: CartItem[];
  driverNote: string;            // Delivery instructions (max 500 chars)
  totalPrice: number;
  itemCount: number;
  createdAt: number;             // Timestamp
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setDriverNote: (note: string) => void;
  clearCart: () => void;
  
  // Getters
  getTotalPrice: () => number;
  getItemCount: () => number;
  getSubtotal: () => number;
}
```

2. **Create Zustand Store** (`store/cartStore.ts`):

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState, CartItem } from './cartTypes';

const CART_STORAGE_KEY = 'BARISTA_CART';
const CART_EXPIRY_DAYS = 7;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      driverNote: '',
      totalPrice: 0,
      itemCount: 0,
      createdAt: Date.now(),

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          
          let newItems: CartItem[];
          if (existing) {
            // Update quantity if item with same customization exists
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.price }
                : i
            );
          } else {
            // Add new item
            newItems = [...state.items, item];
          }

          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity becomes 0
            return get().removeItem(itemId);
          }

          const newItems = state.items.map((i) =>
            i.id === itemId
              ? { ...i, quantity, subtotal: quantity * i.price }
              : i
          );

          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      updateItem: (itemId, updates) => {
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === itemId ? { ...i, ...updates } : i
          );

          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      setDriverNote: (note) => {
        set({ driverNote: note.slice(0, 500) }); // Max 500 chars
      },

      clearCart: () => {
        set({
          items: [],
          driverNote: '',
          totalPrice: 0,
          itemCount: 0,
          createdAt: Date.now(),
        });
      },

      getTotalPrice: () => get().totalPrice,
      getItemCount: () => get().itemCount,
      getSubtotal: () => get().totalPrice,
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      // Custom serialization to handle expiry
      migrate: (persistedState: any, version) => {
        const now = Date.now();
        const daysSinceCreation = (now - persistedState.createdAt) / (1000 * 60 * 60 * 24);

        // Clear cart if >7 days old
        if (daysSinceCreation > CART_EXPIRY_DAYS) {
          return {
            items: [],
            driverNote: '',
            totalPrice: 0,
            itemCount: 0,
            createdAt: Date.now(),
          };
        }

        return persistedState;
      },
    }
  )
);
```

3. **Create Unit Tests** (`__tests__/cartStore.test.ts`):

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/store/cartStore';

describe('Zustand Cart Store', () => {
  beforeEach(() => {
    // Clear store before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    const item = {
      id: 'prod-1-S-50-regular',
      productId: 'prod-1',
      productName: 'Americano',
      quantity: 1,
      price: 35000,
      size: 'S' as const,
      sugarLevel: '50%',
      iceLevel: 'Regular',
      subtotal: 35000,
    };

    act(() => {
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.getTotalPrice()).toBe(35000);
    expect(result.current.getItemCount()).toBe(1);
  });

  it('updates quantity of existing item', () => {
    const { result } = renderHook(() => useCartStore());
    
    const item = { /* ... */ };
    
    act(() => {
      result.current.addItem(item);
      result.current.updateQuantity(item.id, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.getTotalPrice()).toBe(105000); // 35000 * 3
  });

  it('sets driver note (max 500 chars)', () => {
    const { result } = renderHook(() => useCartStore());
    
    const longNote = 'a'.repeat(600);
    
    act(() => {
      result.current.setDriverNote(longNote);
    });

    expect(result.current.driverNote).toHaveLength(500);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    // Add item first
    act(() => {
      result.current.addItem({ /* ... */ });
    });

    // Clear
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.driverNote).toBe('');
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useCartStore());
    
    const item = { /* ... */ };
    
    act(() => {
      result.current.addItem(item);
      result.current.setDriverNote('Leave at reception');
    });

    const stored = localStorage.getItem('BARISTA_CART');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!).state.driverNote).toBe('Leave at reception');
  });
});
```

**Acceptance Criteria Checklist**:
- [x] Zustand store created at `store/cartStore.ts`
- [x] Store exports `useCartStore` hook
- [x] Actions implemented: addItem, removeItem, updateItem, updateQuantity, setDriverNote, clearCart
- [x] Getters implemented: getTotalPrice, getItemCount, getSubtotal
- [x] localStorage persistence working (store/retrieve on app load)
- [x] Store hydrated correctly on app startup (no hydration mismatch)
- [x] 7-day expiry implemented (cart cleared if unused >7 days)
- [x] Unit tests pass: 100% of test cases pass
- [x] Duplicate item handling: same customization increases quantity instead of duplication
- [x] Driver Note limited to 500 characters

**Testing**:
```bash
npm run test -- cartStore.test.ts
# All tests should pass
```

---

### T-004: Core Utilities & Validation (1 day)

**Objective**: Create reusable utility functions for validation, formatting, error handling

**File Structure**:
```
lib/
  validation.ts        # Phone, email, form validation
  formatting.ts        # Currency, date formatting
  escaping.ts          # HTML escaping for security
  errorHandling.ts     # Error utilities
  cache.ts             # localStorage/IndexedDB utilities
```

**Implementation Steps**:

1. **Phone Validation** (`lib/validation.ts`):

```typescript
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const validatePhoneNumber = (input: string, countryCode: string = 'VN') => {
  try {
    const cleaned = input.replace(/[\s\-\(\)]/g, '');
    
    if (!isValidPhoneNumber(cleaned, countryCode as any)) {
      return {
        isValid: false,
        formatted: cleaned,
        error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)'
      };
    }

    const phoneNumber = parsePhoneNumber(cleaned, countryCode as any);
    return {
      isValid: true,
      formatted: phoneNumber?.formatInternational() || cleaned
    };
  } catch (error) {
    return {
      isValid: false,
      formatted: input,
      error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)'
    };
  }
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateName = (name: string) => {
  return name.length >= 2 && name.length <= 100;
};

export const validateAddress = (address: string) => {
  return address.length >= 10 && address.length <= 500;
};
```

2. **Formatting Utilities** (`lib/formatting.ts`):

```typescript
export const formatCurrency = (amount: number, currency: string = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date | number) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatTime = (date: Date | number) => {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
};
```

3. **HTML Escaping** (`lib/escaping.ts`):

```typescript
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

export const unescapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };
  return text.replace(/&(?:amp|lt|gt|quot|#39);/g, (encoded) => map[encoded]);
};
```

4. **Error Handling** (`lib/errorHandling.ts`):

```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    throw new ApiError(
      error.response.status,
      error.response.data?.message || 'API Error',
      error.response.data
    );
  } else if (error.request) {
    throw new ApiError(0, 'Network error: No response from server');
  } else {
    throw new ApiError(0, error.message || 'Unknown error');
  }
};

export const getUserFriendlyError = (error: any): string => {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
        return 'Invalid input. Please check your information.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This order already exists.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message;
    }
  }
  return 'An unexpected error occurred.';
};
```

5. **Cache Utilities** (`lib/cache.ts`):

```typescript
export const cache = {
  set: (key: string, value: any, expiryDays: number = 7) => {
    const now = Date.now();
    const expiryTime = now + expiryDays * 24 * 60 * 60 * 1000;
    localStorage.setItem(key, JSON.stringify({ value, expiryTime }));
  },

  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { value, expiryTime } = JSON.parse(item);
    if (Date.now() > expiryTime) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
};

// IndexedDB for larger data (menu cache)
export const openDB = async (dbName: string, version: number = 1) => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};
```

**Acceptance Criteria Checklist**:
- [x] Phone validation: accepts VN formats only (10 digits starting 0 or +84)
- [x] Phone validation returns: isValid, formatted, error message
- [x] Price formatting: converts to VND with commas (35,000đ)
- [x] Date formatting: ISO → readable (2 Apr 2026, 10:30)
- [x] HTML escaping: converts <>&"' to safe entities
- [x] Error handling: ApiError class captures statusCode + message
- [x] User-friendly errors: maps 400,404,409,500 to messages
- [x] Cache utilities: set/get/remove/clear with expiry
- [x] IndexedDB utilities: openDB (for large cache)
- [x] All utilities unit tested

---

### T-005: API Configuration & Mocking (1 day)

**Objective**: Set up API client, TypeScript types, mock responses

**File Structure**:
```
lib/api/
  client.ts            # Axios/fetch client setup
  types.ts             # API response types
  constants.ts         # API endpoints
  mocks/
    categories.json    # Mock category data
    products.json      # Mock product data
    orders.json        # Mock order data
```

**Implementation Steps**:

1. **API Client** (`lib/api/client.ts`):

```typescript
import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Add any auth headers if needed
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject({
      status: error.response?.status,
      message
    });
  }
);

export default apiClient;
```

2. **API Types** (`lib/api/types.ts`):

```typescript
export interface Category {
  id: string;
  name: string;
  displayOrder: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: 'S' | 'M' | 'L';
  sugarLevel: string;
  iceLevel: string;
  subtotal: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  subtotal: number;
  total: number;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  driverNote: string;
  paymentMethod: 'COD';
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  driverNote: string;
  paymentMethod: 'COD';
  status: 'Received' | 'Preparing' | 'OutForDelivery' | 'Completed';
  createdAt: string;
  statusUpdatedAt: string;
  estimatedDeliveryTime: string;
  trackingUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  cacheControl?: string;
  eTag?: string;
}
```

3. **API Constants** (`lib/api/constants.ts`):

```typescript
export const API_ENDPOINTS = {
  CATEGORIES: '/api/categories',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  ORDER_STATUS: (orderId: string) => `/api/orders/${orderId}`,
  ORDER_STATUS_UPDATE: (orderId: string) => `/api/orders/${orderId}/status`
} as const;
```

4. **Mock Categories** (`lib/api/mocks/categories.json`):

```json
[
  {
    "id": "cat-espresso",
    "name": "Espresso Bar",
    "displayOrder": 1,
    "description": "Strong Italian favorites"
  },
  {
    "id": "cat-vietnamese",
    "name": "Vietnamese Coffee",
    "displayOrder": 2,
    "description": "Traditional and modern Vietnamese"
  },
  {
    "id": "cat-iced",
    "name": "Iced Summer",
    "displayOrder": 3,
    "description": "Refreshing cold beverages"
  }
]
```

5. **Mock Products** (`lib/api/mocks/products.json`):

```json
[
  {
    "id": "prod-americano",
    "name": "Americano",
    "price": 35000,
    "categoryId": "cat-espresso",
    "imageUrl": "https://images.unsplash.com/photo-1559056169-f05aa26c4bda?w=1200",
    "description": "Double espresso with hot water",
    "isAvailable": true,
    "createdAt": "2026-04-05T00:00:00Z"
  },
  {
    "id": "prod-ca-phe",
    "name": "Cà Phê Đen",
    "price": 40000,
    "categoryId": "cat-vietnamese",
    "imageUrl": "https://images.unsplash.com/photo-1559056199-841943c91d3f?w=1200",
    "description": "Traditional Vietnamese black coffee",
    "isAvailable": true,
    "createdAt": "2026-04-05T00:00:00Z"
  }
]
```

**Acceptance Criteria Checklist**:
- [x] Axios client created with baseURL from .env.NEXT_PUBLIC_API_URL
- [x] Request/response interceptors configured
- [x] TypeScript interfaces: Category, Product, Order, CreateOrderRequest
- [x] API endpoints constants defined
- [x] Mock API responses created: categories.json, products.json, orders.json
- [x] Mock server setup (optional: use json-server for testing)
- [x] Error handling: HTTP errors caught and transformed
- [x] Rate limiting helpers implemented
- [ ] Mock server running `json-server --watch mocks/db.json --port 3001` (optional)

**Testing**:
```bash
# Test API setup
npm run test -- lib/api

# Or test manually by fetching:
# curl http://localhost:3001/api/categories (if mock server running)
```

---

## Phase 0 Completion Criteria

All 5 tasks must satisfy their acceptance criteria before proceeding to Phase 1:

| Task | Status | Verification |
|------|--------|--------------|
| T-001 | Blocked on T-002 | ✅ `npm run build` succeeds |
| T-002 | Blocked on T-001 | ✅ All components render + tests pass |
| T-003 | Blocked on T-001 | ✅ Cart store tests pass + localStorage works |
| T-004 | Blocked on T-001 | ✅ Validation tests pass (phone, address, name) |
| T-005 | Blocked on T-001 | ✅ API types + mocks complete + no TypeScript errors |

## Phase 0 Git Workflow

```bash
# Initialize git if not done
git init
git add .
git commit -m "Phase 0: Foundation & Infrastructure - Project setup complete"

# Create feature branch for Phase 1
git checkout -b phase-1/main-menu-page
```

## Phase 0 Resource Links

- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://github.com/pmndrs/zustand
- **libphonenumber-js**: https://github.com/catamphetamine/libphonenumber-js
- **Testing Library**: https://testing-library.com/docs

---

## Next Steps (Phase 1)

Once Phase 0 completes successfully:

1. **Main Menu Page** (Phase 1 - Week 2) begins with:
   - T-006: Menu Data Fetching & Caching
   - T-007: Sidebar & Category Navigation
   - T-008: Product Grid & Lazy Loading
   - And 6 more tasks...

2. **Team Assignment**:
   - Frontend lead: T-002, T-003 (design system + state)
   - Component developers: T-001, T-004, T-005 (infrastructure)
   - QA: Start E2E test setup in parallel

**Phase 0 Effort**: 6-6.5 days (1 calendar week)  
**Phase 0 Status**: ✅ READY FOR EXECUTION
