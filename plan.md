# Implementation Plan: The Barista Premium Coffee Ordering Web App (v1.1.0)

**Version**: 1.1.0 | **Date**: 2026-04-05 | **Features Covered**: 001-main-menu-page, 002-checkout-page, 003-order-tracking

---

## Executive Summary

The Barista is a premium, guest-first coffee ordering web application targeting busy office workers. The app provides a frictionless experience across four screens: Browse Menu → Customize Drink → Checkout with Delivery Info → Real-time Order Tracking. The technical architecture prioritizes rapid performance (<15 sec per screen), premium aesthetic (The Coffee House brand reference), and mandatory customization features (Size/Sugar/Ice) with cash-on-delivery payment and driver delivery instructions.

**Core Architecture**: React/Next.js frontend with Tailwind CSS styling, global state management (Zustand or Context API) for cart persistence, REST API for products/orders, and polling-based real-time order status tracking. All three features share a common cart state model, ensuring seamless data flow from menu selection through order completion.

---

## Technical Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Frontend Framework** | React 18+ with Next.js 14+ | Server-side rendering for rapid initial load; SSG for menu/categories (static caching); built-in routing |
| **Styling** | Tailwind CSS v3+ with custom design tokens | Utility-first for rapid prototyping; custom color palette for premium aesthetic consistency |
| **State Management** | Zustand (recommended) or Context API (fallback) | Zustand for lighter bundle (cart-only state); Context API acceptable if already integrated |
| **HTTP Client** | fetch API or axios | Fetch API preferred (built-in, smaller bundle); axios if interceptors needed |
| **Real-time Updates** | Polling (5-10 sec interval) | Simpler than WebSocket; sufficient for order status (non-critical latency); can upgrade to WebSocket/SSE later |
| **Data Persistence** | localStorage + IndexedDB for cache | localStorage for small cart (<10 KB); IndexedDB for menu cache if size exceeds 50 KB |
| **Testing** | Vitest + React Testing Library (integration), Cypress (E2E) | Vitest for unit/integration (Next.js compatible); Cypress for full user flows |
| **Deployment** | Vercel or similar (Next.js native) | Next.js optimizations automatic; CDN edge caching for menus/images |
| **Phone Validation Library** | libphonenumber-js (Vietnamese specific) | Robust Vietnam+84 format validation; library well-maintained |
| **Image Optimization** | Next.js Image component | Automatic responsive sizing, AVIF/WebP formats, lazy loading |
| **Backend API** | REST (no GraphQL required) | Simple CRUD operations; REST sufficient for scope. Endpoints documented below |
| **Security** | CORS, CSP, HTML escaping for Driver Note | Standard web security; driver note field sanitized (XSS prevention) |

**Performance Goals** (Constitution III - Rapid Flow):
- Page load time: <2 seconds (menu), <1 second (checkout), <2 seconds (order tracking)
- Form validation response: <100ms (instant as user types)
- Order submission: <3 seconds (including redirect)
- Real-time status updates: <5 seconds propagation from backend

**Constraints**:
- Mobile-first responsive: 320px-768px primary, 768px+ secondary
- No authentication layer (guest-only)
- COD payment only (no payment gateway)
- Single-vendor menu (no multi-restaurant support)
- 30-item order limit per transaction

---

## Constitution Check & Alignment

**Gate Status: PASS** — All design decisions align with constitution principles.

| Principle | Design Decision | Verification |
|-----------|----------------|--------------|
| **I. Zero Auth** | No login required; guest-based checkout with URL order tracking (`/order/:order_id`) | Order Status Page passes order_id via URL; no authentication barrier |
| **II. Premium Aesthetic** | Tailwind design tokens (muted colors, generous whitespace, professional typography); The Coffee House reference images; minimalist icon set (SVG) | All pages follow minimal design; luxury color palette applied to all components; high-res image assets (1200px+) |
| **III. Rapid Flow** | Menu: <2s load + categories preload; Checkout: <15s form fill + <3s submit; Order Tracking: <2s page load + 5s status refresh | Page load times measured; form validation <100ms; submission <3s; polling 5-10s interval |
| **IV. Customization** | Size/Sugar/Ice modal on every product; selections preserved in cart state | Modal component handles 3 customizer types; cart state tracks customization per item |
| **V. COD Simplicity** | No payment gateway; checkout collects only Name/Phone/Address/Driver Note; immediate confirmation | Payment method fixed in API (COD only); form has 4 fields exactly; success callback immediate |
| **VI. Driver Note** | Mandatory at checkout; displayed on Order Status Page; supports emojis (🛵, 🏢, 🏪); 500 char max | Driver Note field in checkout form; passed through order state to status page; Unicode support enabled; HTML escaped for security |

---

## Data Model & Entity Relationships

### Core Entities

#### 1. Global Cart State (persisted in Zustand/Context)
```typescript
interface CartState {
  items: CartItem[];           // Current order items
  driverNote: string;          // Delivery instructions (mandatory at checkout)
  totalPrice: number;          // Calculated total
  itemCount: number;           // Total items (sum of quantities)
  createdAt: timestamp;        // Cart creation time
}

interface CartItem {
  id: string;                  // Unique ID (product_id + hash of customizations)
  productId: string;
  productName: string;
  quantity: number;
  price: number;               // Per-unit price
  size: 'S' | 'M' | 'L';
  sugarLevel: 'NoSugar' | '25%' | '50%' | '75%' | '100%';
  iceLevel: 'NoIce' | 'Light' | 'Regular' | 'Extra';
  subtotal: number;            // price × quantity
  addedAt: timestamp;
}
```

**Persistence**: 
- localStorage key: `BARISTA_CART` (JSON serialized)
- Max size: ~10 KB (typical for 10-15 items with full customization)
- TTL: 7 days (expires after 1 week without interaction)
- Sync trigger: Changes to cart → write to localStorage immediately (no debounce)

#### 2. Menu Data (cached in localStorage/IndexedDB)
```typescript
interface MenuCache {
  categories: Category[];
  products: Product[];
  lastUpdated: timestamp;
  cacheVersion: string;        // For invalidation on schema changes
}

interface Category {
  id: string;
  name: string;
  displayOrder: number;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;               // VND (e.g., 50000)
  categoryId: string;
  imageUrl: string;            // High-res (1200px+ width)
  description: string;         // 1-line max for card display
  isAvailable: boolean;        // false = "Sold Out" badge
  createdAt: timestamp;
}
```

**Caching Strategy**:
- First load ever: Fetch from API, store in localStorage/IndexedDB
- Subsequent loads: Serve cached data; refresh in background (no blocking wait)
- Cache invalidation: Check `ETag` header from API; auto-refresh if changed
- Offline mode: Serve cached data with "Using cached menu" banner
- No cache on first offline load (constraint)

#### 3. Submitted Order (created at checkout, persisted in backend)
```typescript
interface Order {
  id: string;                  // Unique order ID (UUID or alphanumeric)
  items: OrderItem[];
  subtotal: number;
  total: number;               // Including taxes/fees if applicable
  
  // Customer Info (from checkout form)
  customerName: string;
  phoneNumber: string;         // Validated Vietnamese format
  deliveryAddress: string;
  driverNote: string;          // 0-500 chars, emoji support, HTML-escaped
  
  // Metadata
  paymentMethod: 'COD';
  status: 'Received' | 'Preparing' | 'OutForDelivery' | 'Completed';
  createdAt: timestamp;
  statusUpdatedAt: timestamp;  // Last status change
  estimatedDeliveryTime: timestamp;
  
  // Tracking
  trackingUrl: string;         // Public URL: /order/{order_id}
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: 'S' | 'M' | 'L';
  sugarLevel: string;
  iceLevel: string;
  subtotal: number;
}
```

**Database Storage** (Backend):
- Primary store: PostgreSQL (UUID primary key, indexed on phoneNumber/createdAt for queries)
- Cache layer: Redis (order status tracking, TTL 30 days for guest access window)
- Archival: Orders >90 days moved to cold storage (optional for v1)

#### 4. Form Data (Checkout Page state)
```typescript
interface CheckoutFormState {
  customerName: string;
  phoneNumber: string;         // Validation: 10 digits starting with 0 OR +84
  deliveryAddress: string;
  driverNote: string;
  
  // Validation state
  errors: {
    customerName?: string;
    phoneNumber?: string;
    deliveryAddress?: string;
    driverNote?: string;
  };
  isValid: boolean;
  isSubmitting: boolean;
  submitError?: string;
}
```

**Form Validation Rules**:
- **Name**: Required, min 2 characters, max 100 characters, alphanumeric + spaces + hyphens
- **Phone**: STRICTLY Vietnamese only — 10 digits starting with 0 (e.g., 0912345678) OR +84 country code format (e.g., +84912345678) using libphonenumber-js
- **Address**: Required, min 10 characters, max 500 characters
- **Driver Note**: Optional, max 500 characters, supports Unicode/emojis, HTML-escaped on backend

---

## API Contracts

### 1. GET /api/categories
**Purpose**: Fetch all drink categories (sidebar menu)

**Request**:
```
GET /api/categories
Headers: Accept: application/json
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
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
    }
  ],
  "cacheControl": "public, max-age=86400",
  "eTag": "abc123def456"
}
```

**Cache**: 24 hours; use ETag for conditional requests

---

### 2. GET /api/products?categoryId={id}
**Purpose**: Fetch products for a selected category (with pagination/lazy-load)

**Request**:
```
GET /api/products?categoryId=cat-espresso&page=1&limit=20
Headers: Accept: application/json
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-americano",
      "name": "Americano",
      "price": 35000,
      "categoryId": "cat-espresso",
      "imageUrl": "https://cdn.barista.local/images/americano-1200x1200.jpg",
      "description": "Double espresso with hot water",
      "isAvailable": true
    },
    {
      "id": "prod-espresso-short",
      "name": "Espresso Cortado",
      "price": 40000,
      "categoryId": "cat-espresso",
      "imageUrl": "https://cdn.barista.local/images/cortado-1200x1200.jpg",
      "description": "Espresso with milk ratio 1:1",
      "isAvailable": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "hasMore": true
  },
  "cacheControl": "public, max-age=3600",
  "eTag": "xyz789uvw123"
}
```

**Cache**: 1 hour; implements lazy-load pagination

---

### 3. POST /api/orders
**Purpose**: Submit completed order from checkout (creates order record)

**Request**:
```json
{
  "items": [
    {
      "productId": "prod-americano",
      "productName": "Americano",
      "quantity": 2,
      "price": 35000,
      "size": "M",
      "sugarLevel": "50%",
      "iceLevel": "Regular",
      "subtotal": 70000
    }
  ],
  "subtotal": 70000,
  "total": 70000,
  "customerName": "Nguyễn Văn A",
  "phoneNumber": "+84912345678",
  "deliveryAddress": "123 Nguyen Hue Blvd, District 1, HCMC",
  "driverNote": "Leave at 🏢 reception, ring bell twice",
  "paymentMethod": "COD"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "order-abc123def456",
    "items": [...],
    "total": 70000,
    "customerName": "Nguyễn Văn A",
    "phoneNumber": "+84912345678",
    "deliveryAddress": "123 Nguyen Hue Blvd, District 1, HCMC",
    "driverNote": "Leave at 🏢 reception, ring bell twice",
    "paymentMethod": "COD",
    "status": "Received",
    "createdAt": "2026-04-05T10:30:00Z",
    "statusUpdatedAt": "2026-04-05T10:30:00Z",
    "trackingUrl": "/order/order-abc123def456"
  }
}
```

**Error Handling**:
- 400 Bad Request: Validation failed (invalid phone format, missing required fields)
- 409 Conflict: Duplicate order detected (same cart items, phone, within 1 minute) — return existing order_id
- 500 Server Error: Database failure — retry with exponential backoff

**Security**: 
- Request validated server-side (never trust client)
- Driver Note HTML-escaped on backend before storage
- Phone number re-validated server-side (libphonenumber-js)
- Rate limiting: 1 order per phone number per 60 seconds (prevents hammering)

---

### 4. GET /api/orders/{order_id}
**Purpose**: Fetch order details for tracking page (guest access via URL)

**Request**:
```
GET /api/orders/order-abc123def456
Headers: Accept: application/json
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "order-abc123def456",
    "items": [...],
    "total": 70000,
    "customerName": "Nguyễn Văn A",
    "phoneNumber": "+84912345678",
    "deliveryAddress": "123 Nguyen Hue Blvd, District 1, HCMC",
    "driverNote": "Leave at 🏢 reception, ring bell twice",
    "paymentMethod": "COD",
    "status": "Preparing",
    "createdAt": "2026-04-05T10:30:00Z",
    "statusUpdatedAt": "2026-04-05T11:15:00Z",
    "estimatedDeliveryTime": "2026-04-05T11:45:00Z"
  }
}
```

**Error Handling**:
- 404 Not Found: Order ID does not exist
- Special handling: Order IDs expire from public tracking after 30 days (guest access window)

**Security**: 
- No authentication required (guest access by design)
- Order ID should be unguessable (UUID or secure random alphanumeric)
- Rate limiting: 10 requests per order per minute (prevent enumeration attacks)

---

### 5. PATCH /api/orders/{order_id}/status
**Purpose**: Backend status update (NOT called by frontend; used by kitchen/driver system)

**Request** (internal only):
```json
{
  "status": "OutForDelivery",
  "estimatedDeliveryTime": "2026-04-05T11:47:00Z"
}
```

**Response**: 
```json
{ "success": true, "id": "order-abc123def456", "status": "OutForDelivery" }
```

---

## Component Hierarchy & Data Flow

### Application Structure
```
<App>
  ├── <Layout>
  │   ├── <Header> (logo, title)
  │   └── <CartProvider> (Zustand/Context)
  │       └── <MainRouter>
  │           ├── <MainMenuPage>
  │           │   ├── <Sidebar>
  │           │   │   └── <CategoryList>
  │           │   ├── <ProductGrid>
  │           │   │   └── <ProductCard>
  │           │   ├── <CustomizationModal>
  │           │   ├── <OrderSummaryModal>
  │           │   └── <StickyOrderBar>
  │           ├── <CheckoutPage>
  │           │   ├── <OrderSummary>
  │           │   ├── <CheckoutForm>
  │           │   │   ├── <TextInput> (Name)
  │           │   │   ├── <PhoneInput> (Phone)
  │           │   │   ├── <TextArea> (Address)
  │           │   │   └── <TextArea> (Driver Note)
  │           │   └── <SubmitButton>
  │           └── <OrderStatusPage>
  │               ├── <ProgressBar>
  │               ├── <OrderSummary>
  │               ├── <DriverNoteDisplay>
  │               └── <CallShopButton>
```

### Data Flow Diagram (simplified)
```
[User Browse] 
  → CategoryList (from API cache)
  → Product shown
  → Click "+" → CustomizationModal
  → Select Size/Sugar/Ice
  → Click "Add to Order"
  → CartState updated (Zustand)
  → StickyOrderBar updates total
  → User reviews → OrderSummaryModal (shows cart items)
  → Click "Checkout"
  → CheckoutPage loads with CartState pre-populated
  → Fill form + Driver Note
  → Click "Place Order"
  → POST /api/orders with {items + customerInfo + driverNote}
  → Success response with order_id
  → Redirect to /order/{order_id}
  → OrderStatusPage calls GET /api/orders/{order_id}
  → Display progress bar + order summary + Driver Note
  → Polling (5s interval) fetches status updates
  → User sees real-time progress
```

### State Flow Across Features
```
MainMenuPage (builds cart)
    ↓ (passes order via state)
CheckoutPage (adds customer info + Driver Note)
    ↓ (submits full order + driver note)
Backend API (persists order with all data)
    ↓ (returns order_id)
OrderStatusPage (receives order_id, fetches order including Driver Note)
    ↓ (displays Driver Note to confirm delivery instructions)
```

---

## State Management Implementation

### Zustand Store (Recommended)
```typescript
// store/cartStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  driverNote: string;
  totalPrice: number;
  itemCount: number;
  
  // Actions
  addItem(item: CartItem): void;
  removeItem(itemId: string): void;
  updateItem(itemId: string, updates: Partial<CartItem>): void;
  updateQuantity(itemId: string, quantity: number): void;
  setDriverNote(note: string): void;
  clearCart(): void;
  
  // Derived state
  getTotalPrice(): number;
  getItemCount(): number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      driverNote: '',
      totalPrice: 0,
      itemCount: 0,
      
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              )
            };
          }
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== itemId)
        }));
      },
      
      // ... other actions
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.subtotal, 0);
      },
    }),
    {
      name: 'BARISTA_CART',
      version: 1,
      // Persist to localStorage automatically
    }
  )
);
```

**Alternative: Context API** (if Zustand not available):
```typescript
// context/CartContext.tsx
export const CartContext = React.createContext<CartStore | null>(null);

export const CartProvider: React.FC<{children}> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  return (
    <CartContext.Provider value={state}>
      {children}
    </CartContext.Provider>
  );
};
```

**Persistence Strategy**:
- Write to localStorage on every cart change (no debounce; cart changes infrequently)
- On app load, hydrate cart from localStorage if exists and not expired
- Driver Note updates immediately reflected in localStorage (passed to checkout)
- Cart expires after 7 days of no interaction (clear from storage)

---

## Driver Note Data Pipeline

The Driver Note is the critical data thread connecting all three features:

### Path 1: Collection (Main Menu → Checkout)
```
[MainMenuPage]
  → User adds items to cart (CartState)
  → Navigate to Checkout
  → [CheckoutPage]
    → Display CartState items in order summary
    → User enters delivery info (4 fields)
    → User enters Driver Note (e.g., "Leave at 🏢, ring bell")
    → Click "Place Order"
    → POST /api/orders with driverNote field
```

### Path 2: Storage (Backend)
```
[Backend receives POST /api/orders]
  → Validate phone, address, driverNote (max 500 chars)
  → HTML escape driverNote (prevent XSS: convert < > & " ')
  → Store in PostgreSQL: orders.driver_note = (HTML-escaped value)
  → Return order_id to client
```

### Path 3: Display (Order Status Tracking)
```
[CheckoutPage receives response]
  → Extract order_id
  → Redirect to /order/{order_id}
  → [OrderStatusPage]
    → Fetch GET /api/orders/{order_id}
    → Backend retrieves order record
    → Response includes driver_note (escaped value)
    → Frontend displays in "Special Instructions for Driver" section
    → Unescape HTML entities on display (show "Leave at 🏢", not "Leave at &amp;#...")
    → User sees confirmation: Driver Note preserved exactly as entered
```

### Security Considerations
- **Input**: Driver Note accepted as plain text with emojis, accents, special chars
- **Storage**: HTML-escaped before database (XSS prevention)
- **Display**: Unescape on frontend only (safe user-generated content)
- **Validation**: Max 500 characters enforced client-side + server-side
- **Truncation**: No truncation; display full text in expandable section if >300 chars

---

## Real-time Order Status Updates

### Strategy: Polling (5-10 second interval)
**Rationale**: Simpler than WebSocket; order tracking doesn't require sub-second latency; reduces server load.

**Implementation** (OrderStatusPage):
```typescript
useEffect(() => {
  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const order = await response.json();
      setOrderStatus(order.status);
      setProgressBar(mapStatusToProgress(order.status));
    } catch (error) {
      console.error('Polling failed:', error);
      setError('Failed to fetch order status');
    }
  }, 5000); // 5 second interval

  return () => clearInterval(pollInterval);
}, [orderId]);
```

**Polling Behavior**:
- Start immediately on page load
- Poll every 5-10 seconds while user is on page
- Stop polling when order reaches "Completed" status
- Handle network failures gracefully (show "Offline" badge; resume on reconnection)
- Display "Last updated: [time]" + "Refresh" button for manual updates

**Future Enhancement: WebSocket/Server-Sent Events**
```
When real-time latency <1 second required, implement:
1. Server-Sent Events (SSE): One-way push from backend (preferred for fire-and-forget updates)
2. WebSocket: Bidirectional if driver app updates order status in near real-time

For v1, polling is sufficient + lower infrastructure cost.
```

---

## Mobile-First Responsive Design

### Breakpoints
- **Mobile (320px - 480px)**: Primary target; full-width layout, stacked components
- **Tablet (481px - 768px)**: Secondary target; 2-column layout for product grid
- **Desktop (769px+)**: Tertiary; 3+ column layout, centered modals

### Key Responsive Behaviors

#### Main Menu Page
```css
/* Mobile: 320px - 480px */
.sidebar {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  overflow-x: auto; /* Horizontal scroll for categories */
}

.product-grid {
  grid-template-columns: 1fr; /* Single column */
}

/* Tablet: 481px - 768px */
@media (min-width: 481px) {
  .sidebar {
    width: 25%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Vertical scroll for categories */
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
  }
}

/* Desktop: 769px+ */
@media (min-width: 769px) {
  .sidebar {
    width: 20%;
  }

  .product-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
  }
}
```

#### Customization Modal
```css
/* Mobile: full-screen overlay */
.modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
}

/* Desktop: centered overlay */
@media (min-width: 769px) {
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: auto;
    max-height: 90vh;
  }
}
```

#### Checkout Form
```css
/* Mobile: vertical stack, full-width inputs */
.form-field {
  width: 100%;
  margin-bottom: 1rem;
}

/* Desktop: grouped layout */
@media (min-width: 769px) {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
```

#### Order Status Page
```css
/* Mobile: full-width progress bar */
.progress-bar {
  width: 100%;
  height: 4px;
}

/* Desktop: centered with margins */
@media (min-width: 769px) {
  .progress-bar {
    width: 80%;
    margin: 2rem auto;
  }
}
```

### Sticky Bottom Bar (Main Menu)
```javascript
// On mobile: fixed at bottom, accounts for safe area (notch, home indicator)
const StickyOrderBar = () => {
  return (
    <div className="
      fixed bottom-0 left-0 right-0
      md:relative md:bottom-auto
      pb-safe /* Accounts for safe area on iOS */
    ">
      {/* Order total + View Order button */}
    </div>
  );
};
```

### Image Responsive Sizing
```html
<!-- High-res source (server: 1200px), display responsive -->
<Image
  src={productImageUrl}
  alt={productName}
  width={1200}
  height={1200}
  sizes="(max-width: 768px) 400px, (max-width: 1200px) 600px, 800px"
  className="w-full h-auto"
  placeholder="blur"
/>
```

### Accessibility (WCAG 2.1 AA)
- All interactive elements keyboard-navigable (Tab/Shift+Tab)
- modals closable via Escape key
- Buttons/links with aria-label for screen readers
- Form fields with <label> elements  (not just placeholder)
- Color contrast: 4.5:1 minimum for text
- Focus indicators: visible outline on keyboard navigation
- Mobile touch targets: minimum 44x44px (iOS/Android standard)

---

## Offline Capability Design

### Cache Strategy
```
1. First-time user, online:
   → Fetch menu (categories + products) from API
   → Store in localStorage (if <50 KB) or IndexedDB (if >50 KB)
   → Use fresh data immediately
   → Mark cache with timestamp + ETag

2. Subsequent loads, online:
   → Serve cached menu immediately (no network wait)
   → In background, check API for updates (ETag comparison)
   → If ETag changed, refresh cache silently
   → Show "Updated menu" toast on new items/prices

3. Offline (network failure):
   → Check localStorage/IndexedDB for cached menu
   → If cache exists, serve it with "Using cached menu" banner
   → Show "Last updated: [timestamp]" for user context
   → Disable checkout ("Checkout requires internet connection")
   → Allow cart building (offline-compatible)

4. First-time user, offline:
   → No cache available
   → Show "Unable to load menu. Please connect to internet"
   → Recommend retry
```

### Implementation
```typescript
// hooks/useMenu.ts
export const useMenu = () => {
  const [menu, setMenu] = useState<MenuCache | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Try cached first
        const cached = localStorage.getItem('BARISTA_MENU');
        if (cached) {
          setMenu(JSON.parse(cached));
          setIsCached(true);
          setIsLoading(false);
        }

        // Fetch fresh (online)
        if (navigator.onLine) {
          const response = await fetch('/api/categories+products');
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('BARISTA_MENU', JSON.stringify(data));
            setMenu(data);
            setIsCached(false);
          }
        }
      } catch (err) {
        if (!menu) setError('Failed to load menu. Please check connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();

    // Listen for online/offline events
    window.addEventListener('online', loadMenu);
    return () => window.removeEventListener('online', loadMenu);
  }, []);

  return { menu, isLoading, isCached, error };
};
```

### Banner Display
```jsx
{isCached && (
  <Banner type="info" dismissible>
    Using cached menu (last updated {lastUpdatedTime}). Some features may be unavailable.
  </Banner>
)}

{isOffline && (
  <Banner type="warning">
    You're offline. Checkout requires internet connection. Please reconnect.
  </Banner>
)}
```

---

## Form Validation Strategy

### Phone Number Validation (Vietnamese-specific)

```typescript
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const validateVietnamPhoneNumber = (input: string): {
  isValid: boolean;
  formatted: string;
  error?: string;
} => {
  try {
    // Remove spaces/dashes
    const cleaned = input.replace(/[\s\-]/g, '');
    
    // Try parsing as Vietnamese
    const phoneNumber = parsePhoneNumber(cleaned, 'VN');
    
    if (!phoneNumber || !isValidPhoneNumber(cleaned, 'VN')) {
      return {
        isValid: false,
        formatted: cleaned,
        error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)'
      };
    }
    
    // Format for display: +84-912-345-678
    return {
      isValid: true,
      formatted: phoneNumber.formatInternational()
    };
  } catch (err) {
    return {
      isValid: false,
      formatted: input,
      error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)'
    };
  }
};
```

### Checkout Form Validation Rules
```typescript
interface ValidationRules {
  customerName: {
    required: true;
    minLength: 2;
    maxLength: 100;
    pattern: /^[a-zA-Zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s\-'\.]+$/;
    error: 'Please enter a valid name (letters, spaces, hyphens only)';
  };
  
  phoneNumber: {
    required: true;
    validator: validateVietnamPhoneNumber;
    error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)';
  };
  
  deliveryAddress: {
    required: true;
    minLength: 10;
    maxLength: 500;
    error: 'Address must be 10-500 characters';
  };
  
  driverNote: {
    required: false;
    maxLength: 500;
    pattern: /.*/; // Accept any character (emoji, accents, etc.)
    error: 'Driver note must not exceed 500 characters';
  };
}
```

### Real-time Validation (as user types)
```typescript
const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    driverNote: ''
  });

  const [errors, setErrors] = useState({});

  const validateField = (name: string, value: string) => {
    const rule = ValidationRules[name];
    
    if (rule.required && !value.trim()) {
      return `${name} is required`;
    }
    
    if (value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }
    
    if (value.length > rule.maxLength) {
      return `${name} must not exceed ${rule.maxLength} characters`;
    }
    
    if (rule.validator) {
      const result = rule.validator(value);
      if (!result.isValid) return result.error;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.error;
    }
    
    return null;
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on blur/change
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const isFormValid = Object.values(errors).every(err => !err);

  return (
    <form>
      <input
        name="customerName"
        value={formData.customerName}
        onBlur={(e) => handleFieldChange(e)}
        placeholder="Enter your full name"
      />
      {errors.customerName && <span className="error">{errors.customerName}</span>}

      <input
        name="phoneNumber"
        type="tel"
        value={formData.phoneNumber}
        onBlur={(e) => handleFieldChange(e)}
        placeholder="0912345678 or +84912345678"
      />
      {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}

      {/* ... other fields ... */}

      <button disabled={!isFormValid}>Place Order</button>
    </form>
  );
};
```

---

## Implementation Task Breakdown

This section outlines the sequential implementation path, organized into phases from foundation to complete features. All tasks are independently deployable and testable.

### Phase 0: Foundation & Infrastructure (Week 1)
**Goal**: Set up project structure, design system, and core utilities

**Phase 0.1: Project Setup**
- [ ] Initialize Next.js project with TypeScript, Tailwind CSS
- [ ] Configure ESLint, Prettier, git hooks (husky)
- [ ] Set up Next.js API route structure (`/pages/api/`)
- [ ] Create environment configuration (.env.local, .env.production)
- [ ] Install core dependencies: Zustand, axios/fetch, libphonenumber-js

**Phase 0.2: Design System & Branding**
- [ ] Define Tailwind custom color palette (premium muted tones, The Coffee House reference)
- [ ] Create design tokens: spacing, typography (font sizes, weights), shadows, border radius
- [ ] Build reusable component library: Button, Input, Card, Modal, Header
- [ ] Set up image assets folder (high-res 1200px+ width, WebP/AVIF formats)
- [ ] Create SVG icon set (product placeholder icon, minimalist style)
- [ ] Document design system in Storybook (optional for v1 but recommended)

**Phase 0.3: State Management Setup**
- [ ] Create Zustand store for cart state (`store/cartStore.ts`)
- [ ] Implement cart persistence (localStorage with 7-day TTL)
- [ ] Create React Context wrapper or Zustand provider
- [ ] Write unit tests for store (add/remove/update actions)
- [ ] Test persistence: localStorage read/write/expiry

**Phase 0.4: Core Utilities**
- [ ] Phone validation utility (libphonenumber-js wrapper)
- [ ] Price formatting utility (VND currency)
- [ ] Date/time formatting utility (ISO → readable timestamps)
- [ ] HTML escaping utility (XSS prevention for driver note)
- [ ] Error handling utility (standardized error responses)
- [ ] LocalStorage/IndexedDB cache utilities

**Phase 0.5: API Configuration**
- [ ] Set up API base URL configuration (dev/prod)
- [ ] Create axios/fetch interceptors (auth headers if needed, error handling)
- [ ] Define TypeScript interfaces for all API responses (categories, products, orders)
- [ ] Create mock API responses for testing (JSON files)

**Deliverables**: 
- Project structure ready for feature development
- Design system documented
- Cart state management working + persisted
- Utilities tested and ready

---

### Phase 1: Main Menu Page (Week 2)

**Phase 1.1: Menu Data Fetching & Caching**
- [ ] Create API endpoint: `GET /api/categories` (or backend integration)
- [ ] Implement menu cache hook (useMenu) with localStorage/IndexedDB
- [ ] Handle offline mode: serve cached data, show "Cached menu" banner
- [ ] Implement ETag-based cache invalidation
- [ ] Test: First load (fetch), second load (cache), offline load (cache), online reconnect (refresh)

**Phase 1.2: Sidebar & Category Navigation**
- [ ] Build Sidebar component with scrollable category list
- [ ] Implement category click handler → filter products
- [ ] Pre-select first category on load
- [ ] Style sidebar responsive: horizontal scroll on mobile, vertical on desktop
- [ ] Add active category highlighting
- [ ] Test: Category filtering works, first category pre-selected, styling responsive

**Phase 1.3: Product Grid & Product Cards**
- [ ] Create API endpoint: `GET /api/products?categoryId={id}` (or integration)
- [ ] Implement lazy loading (infinite scroll) for product list
- [ ] Build ProductCard component: image, name, description (1-line), price, "+" button
- [ ] Add placeholder icon for failed image loads (SVG coffee cup)
- [ ] Implement "Sold Out" badge overlay for unavailable products
- [ ] Style responsive: 1 column mobile, 2 columns tablet, 3+ columns desktop
- [ ] Test: Products load, images render, placeholder appears on load failure, sold-out badge shows

**Phase 1.4: Customization Modal**
- [ ] Build CustomizationModal component (Size/Sugar/Ice selectors + quantity)
- [ ] Create Size selector: Small (S), Medium (M), Large (L) - radio buttons
- [ ] Create Sugar selector: No Sugar, 25%, 50%, 75%, 100% - radio buttons
- [ ] Create Ice selector: No Ice, Light, Regular, Extra - radio buttons
- [ ] Add quantity adjuster (-, quantity display, +)
- [ ] Calculate and display total price in real-time (price × quantity)
- [ ] Implement "Add to Order" button (saves customization to cart state)
- [ ] Implement modal close on Escape or outside click
- [ ] Style modal: full-screen on mobile, centered overlay on desktop
- [ ] Test: All customizer options work, price calculates correctly, cart updates on add, modal closes on escape

**Phase 1.5: Cart State Integration**
- [ ] Connect ProductCard "+" button to open CustomizationModal
- [ ] Implement cart item ID generation (product_id + customization hash)
- [ ] Handle duplicate customizations: update quantity instead of adding duplicate
- [ ] Write unit tests for cart add/update logic
- [ ] Test: Adding same customization twice increases quantity, different customizations are separate items

**Phase 1.6: Sticky Order Bar**
- [ ] Build StickyOrderBar component: shows total price + "View Order" button
- [ ] Only show when cart has items
- [ ] Display at bottom of screen (fixed position on mobile, relative on mobile scroll)
- [ ] Implement "View Order" click → open OrderSummaryModal
- [ ] Add 15-item soft warning ("You have 15+ items...") - dismissible toast
- [ ] Add 30-item hard block ("Maximum order size...") - prevent adding more items
- [ ] Style responsive: full-width mobile, constrained width desktop
- [ ] Test: Bar appears after first item added, total updates correctly, 15-item warning shows, 30-item block prevents adds

**Phase 1.7: Order Summary Modal (Overlay on Main Menu)**
- [ ] Build OrderSummaryModal component (triggered from StickyOrderBar "View Order")
- [ ] Display: order items (name, quantity, customizations, subtotal), total price
- [ ] Add edit controls: -/+ quantity per item, remove item button
- [ ] Implement item quantity update → recalculate total (real-time)
- [ ] Add "Continue Shopping" button (close modal, return to menu)
- [ ] Add "Proceed to Checkout" button (navigate to checkout page)
- [ ] Remove items when quantity reaches 0
- [ ] Show "Your cart is empty" state if all items removed
- [ ] Style modal: full-screen on mobile, centered overlay on desktop
- [ ] Test: Items display correctly, quantity updates work, total calculates, navigation works, modal closes

**Phase 1.8: Mobile Responsiveness & Polish**
- [ ] Test sidebar on mobile (horizontal scroll for categories)
- [ ] Test product grid stacking on mobile
- [ ] Test modal fullscreen on mobile <768px
- [ ] Test sticky bar positioning (respects safe area on iOS with notch)
- [ ] Optimize images: lazy loading, responsive sizes
- [ ] Add loading skeleton for product grid (while fetching)
- [ ] Test: All components responsive, no horizontal scroll on mobile, images optimize

**Phase 1.9: Accessibility & Testing**
- [ ] Add keyboard navigation: Tab/Shift+Tab through categories/products
- [ ] Add Escape key to close modals
- [ ] Add aria-label to buttons/images
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Add focus indicators (visible outline)
- [ ] Test touch targets: minimum 44x44px for mobile
- [ ] Write integration tests (Cypress or React Testing Library)
- [ ] Test: All interactive elements keyboard-accessible, screen reader compatible

**Deliverables**: 
- Fully functional Main Menu page
- Cart state persisting across sessions
- Modal overlays for customization & order review
- Mobile-responsive design
- Accessibility compliance

---

### Phase 2: Checkout Page (Week 3)

**Phase 2.1: Checkout Page Setup & Order Summary Display**
- [ ] Create CheckoutPage component
- [ ] Display order summary (all items with customizations, total price)
- [ ] Implement scrollable order summary if >5 items
- [ ] Show "Your cart is empty" state with "Go to Menu" button
- [ ] Style responsive: full-width form mobile, 2-column layout desktop (summary + form)
- [ ] Test: Order items display correctly, empty cart state works, layout responsive

**Phase 2.2: Checkout Form (4 required fields)**
- [ ] Build CheckoutForm component with 4 fields: Name, Phone, Address, Driver Note
- [ ] Create TextInput component for Name: text input, label, placeholder
- [ ] Create PhoneInput component for Phone: tel input, label, placeholder
- [ ] Create TextArea component for Address: textarea, label, placeholder
- [ ] Create TextArea component for Driver Note: textarea, label, placeholder (include emoji hint)
- [ ] Make Name, Phone, Address required; Driver Note optional
- [ ] Display form field labels above inputs (accessible, visible)
- [ ] Implement placeholder text: "Enter your full name", "0912345678 or +84912345678", etc.
- [ ] Style responsive: full-width inputs on mobile, no horizontal scroll
- [ ] Test: All fields display correctly, responsive layout, labels visible

**Phase 2.3: Real-time Form Validation**
- [ ] Implement validation rules (Name: 2-100 chars, Phone: Vietnamese format only, Address: 10-500 chars, Driver Note: 0-500 chars)
- [ ] Create validateField utility function
- [ ] Validate on blur: phone number format, required fields
- [ ] Validate on keyup: field length, pattern matching
- [ ] Show inline error messages for invalid inputs
- [ ] Display specific phone error: "Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)"
- [ ] Disable "Place Order" button until all required fields valid
- [ ] Test: Validation works for all fields, errors display correctly, button state changes based on validity

**Phase 2.4: Driver Note with Emoji Support**
- [ ] Ensure TextArea handles Unicode characters (emojis, accents, special characters)
- [ ] Accept emoji characters: 🛵, 🏢, 🏪 (and others)
- [ ] Accept Vietnamese accents: á, ă, ơ, ư, etc.
- [ ] Allow special characters: commas, periods, hyphens, parentheses
- [ ] Display in-field hint: "e.g., 'Leave at reception' or 'Call on arrival' or use emojis: 🛵, 🏢, 🏪"
- [ ] Test field with sample driver notes: "Leave at 🏢 reception", "Call when arriving 🛵", "3rd floor east wing"
- [ ] Confirm characters are preserved (no corruption, no stripping)
- [ ] Test: Emojis and accents render correctly in input field

**Phase 2.5: Order Submission Logic**
- [ ] Implement "Place Order" button click handler
- [ ] Validate all fields on submit
- [ ] If invalid fields, show error toast: "Please fill in all required fields"
- [ ] If valid, disable "Place Order" button immediately (prevent double-click)
- [ ] Show loading spinner with message "Processing your order..."
- [ ] POST to `/api/orders` endpoint with order data:
  ```json
  {
    "items": [...],
    "total": 70000,
    "customerName": "...",
    "phoneNumber": "+84912345678",
    "deliveryAddress": "...",
    "driverNote": "...",
    "paymentMethod": "COD"
  }
  ```
- [ ] Handle success response: extract order_id, show success message
- [ ] Show success message: "Order Confirmed! Order ID: [order_id]. Total: [amount]đ"
- [ ] Auto-redirect to `/order/{order_id}` after 2 seconds
- [ ] Test: Form validates on submit, disabled state works, loading spinner shows, success message displays, redirect works

**Phase 2.6: Error Handling & Network Resilience**
- [ ] Handle network errors: show error message "Order submission failed. Please try again" + "Retry" button
- [ ] Preserve form data on failure (all 4 fields retain user input)
- [ ] Re-enable "Place Order" button on error (user can retry)
- [ ] Handle validation errors from backend (400 Bad Request): display user-friendly message
- [ ] Handle server errors (500): show "Order submission failed. Please contact support"
- [ ] Implement retry logic: user clicks "Retry" button, re-submit with same data
- [ ] Log errors for debugging (console + optional backend logging)
- [ ] Test: Network error handled, form data preserved, retry works, error messages clear

**Phase 2.7: Loading Spinner & UX Polish**
- [ ] Design minimalist loading spinner (aligned with The Coffee House aesthetic)
- [ ] Show loading message: "Processing your order..."
- [ ] If submission >10 seconds, show extended message: "Taking longer than expected. Please wait or try again"
- [ ] Add Retry button after long wait (10+ seconds)
- [ ] Ensure spinner is visible on all screen sizes
- [ ] Test: Spinner appears, message displays, extended message after 10s

**Phase 2.8: Form Data Caching (P3 - Optional for v1)**
- [ ] Add "Save for next time" checkbox below form (unchecked by default)
- [ ] On form submit (if checkbox checked), save Name/Phone/Address to localStorage (90-day TTL)
- [ ] On return visit (within 90 days), auto-populate fields from cache
- [ ] Allow user to edit/clear auto-filled fields
- [ ] Handle cache expiry: clear after 90 days, show no data (graceful fallback)
- [ ] Test: Data saved on check, auto-populated on return, expiry works

**Phase 2.9: Mobile Responsiveness & Accessibility**
- [ ] Test form on mobile: all fields full-width, no horizontal scroll
- [ ] Test modal on mobile: full-screen or bottom sheet pattern
- [ ] Test touch target sizes: inputs/buttons 44x44px minimum
- [ ] Add keyboard navigation: Tab/Shift+Tab through form fields
- [ ] Add Escape key to not close form (prevent accidental close) — user must click back/close button
- [ ] Add form field labels with <label> elements (for screen readers)
- [ ] Add aria-required and aria-invalid attributes
- [ ] Test with screen reader: all fields labeled, validation messages announced
- [ ] Test: Responsive on mobile, keyboard-accessible, screen reader compatible

**Phase 2.10: Integration Testing**
- [ ] Test end-to-end: add items to cart → navigate to checkout → fill form → submit → redirect to order status
- [ ] Test with different network conditions (slow, offline, timeout)
- [ ] Test validation for all field combinations (valid/invalid phone, empty fields, etc.)
- [ ] Write Cypress tests for checkout flow
- [ ] Test: Complete flow end-to-end

**Deliverables**: 
- Fully functional Checkout page
- 4-field form with real-time validation
- Driver Note with full emoji/accent support
- Order submission working
- Error handling & retry logic
- Mobile-responsive & accessible

---

### Phase 3: Order Status / Tracking Page (Week 4)

**Phase 3.1: Order Status Page Setup**
- [ ] Create OrderStatusPage component
- [ ] Extract order_id from URL parameter (`/order/[order_id]`)
- [ ] Fetch GET `/api/orders/{order_id}` on page load
- [ ] Display loading state while fetching
- [ ] Handle invalid order ID: show "Order not found" + "Return to Home" button
- [ ] Store order data in local state
- [ ] Test: Order data fetches, loads correctly, error handling works

**Phase 3.2: Progress Bar (4-stage tracking)**
- [ ] Build ProgressBar component showing 4 stages: Received → Preparing → Out for Delivery → Completed
- [ ] Map order status to progress: Received (stage 1), Preparing (stage 2), OutForDelivery (stage 3), Completed (stage 4)
- [ ] Show current stage highlighted/filled, previous stages filled, future stages empty
- [ ] Display stage label with activity description (e.g., "Preparing: Usually 15-20 min")
- [ ] Animate progress bar when status changes
- [ ] Add timestamp for each stage (e.g., "Received at 10:30 AM")
- [ ] Style responsive: full-width on mobile, centered on desktop
- [ ] Test: Progress bar renders correctly for all 4 statuses, animation smooth, timestamps display

**Phase 3.3: Order Summary Display**
- [ ] Display order ID prominently: "Order #[order_id]"
- [ ] Show order items: product name, quantity, customizations (Size/Sugar/Ice), unit price, line subtotal
- [ ] Display order total prominently
- [ ] Show timestamps: created_at (Order Received), status_updated_at (Last Updated)
- [ ] Format timestamps: readable format ("10:30 AM", "April 5, 2026")
- [ ] Make order summary scrollable if >5 items
- [ ] Style with premium aesthetic (generous whitespace, clean typography)
- [ ] Test: All order data displays correctly, timestamps readable, responsive

**Phase 3.4: Driver Note Display & Confirmation**
- [ ] Display Driver Note in dedicated section with label: "Special Instructions for Driver"
- [ ] Show full driver note text exactly as user entered (no truncation)
- [ ] Preserve emojis: 🛵, 🏢, 🏪 render correctly
- [ ] If Driver Note >300 characters, implement expandable section (show preview + expand button)
- [ ] Do NOT truncate or sanitize user text (display as-is, already HTML-escaped on backend)
- [ ] Highlight Driver Note section to emphasize it (light background color, border accent)
- [ ] Add reassurance message: "Your delivery instructions were received and will be shared with the driver"
- [ ] Test: Driver note displays with emojis intact, long notes expandable, styling prominent

**Phase 3.5: Real-time Status Updates (Polling)**
- [ ] Implement polling logic: fetch `/api/orders/{order_id}` every 5 seconds
- [ ] Start polling immediately on page load
- [ ] Stop polling when order status = "Completed"
- [ ] Update progress bar when status changes
- [ ] Update timestamps on each poll
- [ ] Display "Last updated: [time]" and "Refresh" button (manual refresh)
- [ ] Handle polling errors gracefully (show "Offline" badge if network down)
- [ ] Auto-resume polling on reconnection
- [ ] Test: Polling works, status updates display, offline handling works, auto-resume on reconnect

**Phase 3.6: Call Shop Button**
- [ ] Add prominent "Call Shop" button at bottom of page (or sticky footer)
- [ ] Implement tel:// protocol: clicking button initiates phone call to shop
- [ ] Display shop phone number visibly (e.g., "Call: +84-2-XXXX-XXXX")
- [ ] Button styled consistently with premium aesthetic
- [ ] On mobile: tel:// triggers native phone app
- [ ] On desktop: show modal with shop phone number + option to copy
- [ ] Test: Button initiates phone call on mobile, shows number on desktop

**Phase 3.7: Order Not Found & Error States**
- [ ] Handle invalid order ID: show "Order not found" message
- [ ] Display "Return to Home" button
- [ ] Show "Order tracking expired" message if order >30 days old (optional for v1)
- [ ] Handle API errors (500, etc.): show "Error loading order. Please try again" + "Retry" button
- [ ] Test: Error states display correct messages, "Return to Home" navigates correctly

**Phase 3.8: Completed Order & Re-order Button (P3 - Optional)**
- [ ] Detect when order status = "Completed"
- [ ] Hide polling (order complete, no further updates)
- [ ] Show "Order Complete!" message with checkmark
- [ ] Display "Re-order" button (trigger same items in new order)
- [ ] Clicking "Re-order" navigates to Main Menu with items pre-populated
- [ ] Test: Completed state displays correctly, re-order functionality works

**Phase 3.9: Mobile Responsiveness & Accessibility**
- [ ] Test on mobile: progress bar full-width, order summary stacked, no horizontal scroll
- [ ] Test sticky header/footer: "Call Shop" button accessible on all screen sizes
- [ ] Test safe area: respects notch/home indicator on iOS
- [ ] Add keyboard navigation: Tab/Shift+Tab through order details, call button
- [ ] Add Escape key to not close page (no modal to close on this page)
- [ ] Add aria-label to "Call Shop" button
- [ ] Test with screen reader: all order details announced, call button labeled
- [ ] Test: Responsive, keyboard-accessible, screen reader compatible

**Phase 3.10: URL Sharing & Guest Access**
- [ ] Confirm order tracking URL works: `/order/[order_id]`
- [ ] Test sharing URL with others (no authentication required)
- [ ] Verify recipients can view same order (guest access enabled)
- [ ] Test that order ID is unguessable (UUID or secure random)
- [ ] Test rate limiting: can't spam order ID requests (prevent enumeration)
- [ ] Document guest access window: 30 days from order creation
- [ ] Test: URL sharing works, guest access enabled, rate limiting active

**Phase 3.11: Integration Testing**
- [ ] Test end-to-end: checkout success → redirect to order status → page loads → polling works → status updates
- [ ] Test with simulated backend status changes (mock API)
- [ ] Test polling resilience: network down → reconnect → resume
- [ ] Write Cypress tests for tracking flow
- [ ] Test: Complete flow end-to-end

**Phase 3.12: Performance & Optimization**
- [ ] Optimize polling: reduce unnecessary re-renders on state updates
- [ ] Lazy load images: use Next.js Image component with lazy loading
- [ ] Minimize bundle: tree-shake unused code
- [ ] Test page load time: <2 seconds on 4G
- [ ] Test Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Test: Performance targets met

**Deliverables**: 
- Fully functional Order Status page
- Real-time tracking with 4-stage progress bar
- Driver Note confirmation displayed with emojis preserved
- Polling updates working
- Call Shop button functional
- Guest URL tracking working
- Mobile-responsive & accessible

---

### Phase 4: Cross-Feature Integration & QA (Week 5)

**Phase 4.1: End-to-End Flow Testing**
- [ ] Test complete user flow: Main Menu → Customize → Checkout → Review Order → Order Status → Real-time Updates
- [ ] Test with multiple items, different customizations, full cart (30 items)
- [ ] Test minimum order (1 item)
- [ ] Test maximum order (30 items)
- [ ] Test edge cases: empty cart checkout (should fail), invalid phone format (rejected), long driver note (>500 chars)
- [ ] Test: Complete flows work, edge cases handled

**Phase 4.2: State Management Across Features**
- [ ] Verify cart state persists across page navigation
- [ ] Verify cart state cleared after successful order submission
- [ ] Verify Driver Note flows from checkout to order status page
- [ ] Verify order data passed correctly from checkout to status page URL
- [ ] Test: State management correct across all features

**Phase 4.3: Data Integrity Testing**
- [ ] Verify customizations saved correctly in cart
- [ ] Verify customizations preserved on checkout
- [ ] Verify customizations match on order status page
- [ ] Verify Driver Note preserved exactly (emojis, accents, special characters)
- [ ] Verify order total calculated correctly at each stage
- [ ] Verify order ID unique and unguessable
- [ ] Test: All data integrity checks pass

**Phase 4.4: Mobile Cross-Browser Testing**
- [ ] Test on iOS Safari (iPhone 12/13/14+)
- [ ] Test on Android Chrome (Samsung, Pixel, etc.)
- [ ] Test on desktop Chrome, Firefox, Safari, Edge
- [ ] Test responsive breakpoints: 320px, 480px, 768px, 1024px
- [ ] Test safe area (iOS notch): doesn't overlap content
- [ ] Test touch interactions: tapping buttons, scrolling, modal dismiss
- [ ] Test: All browsers and devices work

**Phase 4.5: Performance Testing**
- [ ] Measure page load times: Menu <2s, Checkout <1s, Order Status <2s
- [ ] Measure form validation response: <100ms
- [ ] Measure order submission: <3s
- [ ] Measure polling latency: <5s from API change to UI update
- [ ] Profile bundle size (goal: <100 KB gzipped for main bundle)
- [ ] Optimize images: all >1200px wide, served as WebP/AVIF
- [ ] Test Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Test: Performance targets met

**Phase 4.6: Accessibility Audit (WCAG 2.1 AA)**
- [ ] Run automated accessibility scanner (axe, Lighthouse)
- [ ] Manual testing: keyboard navigation (Tab/Escape), screen reader (VoiceOver iOS / NVDA Windows)
- [ ] Test color contrast: 4.5:1 for text on background
- [ ] Test focus indicators: visible on all interactive elements
- [ ] Test form labels: all inputs have <label> elements
- [ ] Test touch targets: minimum 44x44px
- [ ] Test: Accessibility audit passes
- [ ] Document accessibility compliance

**Phase 4.7: Security Testing**
- [ ] Test XSS prevention: driver note with script tags (e.g., "<script>alert('xss')</script>") should be escaped
- [ ] Test CSRF prevention: analyze API endpoints for CSRF tokens (if applicable)
- [ ] Test CORS: verify appropriate origins allowed
- [ ] Test Content Security Policy (CSP) headers
- [ ] Test phone number validation: can't inject SQL or special characters
- [ ] Test order access: user can only view orders by valid order_id (no enumeration)
- [ ] Test rate limiting: API endpoints rate-limited appropriately
- [ ] Test: Security audit passes, no vulnerabilities

**Phase 4.8: API Contract Verification**
- [ ] Verify GET /api/categories response format matches spec
- [ ] Verify GET /api/products response includes all required fields
- [ ] Verify POST /api/orders accepts all required fields
- [ ] Verify POST /api/orders response includes order_id and trackingUrl
- [ ] Verify GET /api/orders/{order_id} response includes Driver Note field
- [ ] Verify error responses (400, 404, 500) have consistent format
- [ ] Test: All API contracts verified

**Phase 4.9: Offline & Cache Testing**
- [ ] Test first-time offline load: shows "Unable to load menu"
- [ ] Test cached menu on offline: displays "Using cached menu" banner
- [ ] Test cache invalidation: old cache replaced with new on online
- [ ] Test offline checkout: disabled with "requires internet connection" message
- [ ] Test cache expiry: after 7 days, cache cleared
- [ ] Test: Offline/cache flows work correctly

**Phase 4.10: Load Testing (Scale)**
- [ ] Simulate 100 concurrent users ordering
- [ ] Simulate 500 concurrent users viewing order status (polling)
- [ ] Monitor backend response times: should remain <500ms
- [ ] Monitor database: connection pool not exhausted
- [ ] Monitor API rate limiting: requests properly throttled
- [ ] Test: Scale targets met

**Phase 4.11: Error Scenarios & Recovery**
- [ ] Test network timeout during submission: show error, allow retry
- [ ] Test backend rejection: order rejected (duplicate), show user message
- [ ] Test duplicate submission: user clicks "Place Order" twice quickly (should be prevented)
- [ ] Test image load failures: placeholder icon shows, retry mechanism available
- [ ] Test category with zero products: shows "No items in this category"
- [ ] Test missing customizations: form requires selections before add
- [ ] Test: All error scenarios handled gracefully

**Phase 4.12: Localization/Internationalization (Future)**
- [ ] Vietnamese (vi_VN): primary language
- [ ] English (en_US): secondary (for future)
- [ ] RTL support: not required for Vietnamese, but ensure CSS supports it
- [ ] Timestamp formatting: use locale-aware library
- [ ] Currency formatting: VND (₫) symbol
- [ ] Phone format: Vietnamese country code by default
- [ ] Test: Localization ready for expansion

**Phase 4.13: Documentation & Handoff**
- [ ] Write API documentation (OpenAPI/Swagger spec)
- [ ] Document component library (Storybook)
- [ ] Write developer README (setup, build, deploy)
- [ ] Document deployment process (CI/CD pipeline, Vercel setup)
- [ ] Document troubleshooting guide (common issues, debug tips)
- [ ] Write testing guides (unit, integration, E2E)
- [ ] Create user documentation (FAQ, delivery instructions)

**Phase 4.14: Launch & Monitoring**
- [ ] Deploy to production (Vercel or similar)
- [ ] Set up monitoring: error tracking (Sentry), analytics (Mixpanel)
- [ ] Set up logging: API calls, user actions, errors
- [ ] Set up alerts: error rate spike, API latency spike, downtime
- [ ] Prepare incident response plan
- [ ] Create rollback procedure (if needed)
- [ ] Soft launch: internal testing, beta users
- [ ] Public launch: full release
- [ ] Monitor for first week: ensure stability

**Deliverables**: 
- All features tested and verified
- Performance targets met
- Accessibility compliant
- Security audit passed
- Production-ready deployment
- Monitoring & alerting active

---

## Milestones & Timeline

| Phase | Duration | Deliverable | Status |
|-------|----------|-------------|--------|
| Phase 0: Foundation | Week 1 | Project setup, design system, state management | Ready to start |
| Phase 1: Main Menu | Week 2 | Browse categories, customize drinks, sticky order bar | Depends on Phase 0 |
| Phase 2: Checkout | Week 3 | 4-field form, validation, order submission | Depends on Phase 1 |
| Phase 3: Order Tracking | Week 4 | Progress bar, order display, real-time polling | Depends on Phase 2 |
| Phase 4: QA & Launch | Week 5 | Testing, optimization, deployment | Depends on Phases 1-3 |
| **Total** | **5 weeks** | **Production release** | On track |

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Phone validation library issues | Low | High | Use well-maintained libphonenumber-js; test extensively with edge cases |
| Real-time updates (polling) latency | Medium | Medium | Implement WebSocket as Phase 2 enhancement if polling insufficient; user expectations set <5s |
| Cart state persistence fails | Low | High | Use localStorage + IndexedDB dual backup; test persistence on all browsers |
| Order submission fails silently | Low | Critical | Implement comprehensive error handling, logging, monitoring; retry logic with user feedback |
| Driver Note emoji corruption | Low | Medium | Test with actual emoji characters; ensure UTF-8 encoding throughout stack |
| Performance targets not met | Medium | High | Profile early in Phase 1; optimize aggressively (image sizes, bundle splitting, lazy loading) |
| Mobile responsive issues | Medium | Medium | Test on actual devices early; use mobile-first approach from day 1 |
| Accessibility failures | Low | Medium | Automated testing (axe) + manual screen reader testing throughout; audit before launch |
| Scale issues (polling hammer) | Low | Medium | Implement rate limiting on backend; monitor polling frequency; consider WebSocket upgrade |

---

## Success Criteria (Constitution Compliance)

✅ **I. Zero Auth**: No authentication flow; guest-only with URL-based order tracking  
✅ **II. Premium Aesthetic**: Minimalist design, generous whitespace, professional typography (The Coffee House ref)  
✅ **III. Rapid Flow**: Menu <2s, Checkout <3s, Order Status <2s, polling <5s updates  
✅ **IV. Customization**: Size/Sugar/Ice modal on every product, selections preserved  
✅ **V. COD Simplicity**: No payment gateway, 4-field form only, immediate confirmation  
✅ **VI. Driver Note**: Mandatory at checkout, displayed on order tracking, emojis supported, 500 char max  

---

## Technology Stack Summary

- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand + localStorage persistence
- **API Client**: fetch API (built-in) or axios
- **Form Validation**: libphonenumber-js (Vietnamese), custom validation
- **Real-time**: Polling (5-10s intervals) — WebSocket optional for future
- **Storage**: localStorage (cart), IndexedDB (menu cache), PostgreSQL (backend)
- **Deployment**: Vercel (Next.js native)
- **Testing**: Vitest (unit), React Testing Library (integration), Cypress (E2E)
- **Monitoring**: Sentry (errors), Mixpanel (analytics)
- **Development**: ESLint, Prettier, git hooks (husky)

---

## Conclusion

The Barista implementation plan provides a clear, phased approach to building a premium coffee ordering web application. The architecture prioritizes the Constitution's six core principles (zero auth, premium aesthetic, rapid flow, customization, COD simplicity, driver clarity) while leveraging modern React/Next.js practices for maintainability and scalability.

The five-week timeline, decomposed into 48+ sequential tasks, ensures steady progress with independent testability at each phase. Cross-feature integration is achieved through a unified cart state model, ensuring seamless data flow from menu selection through order completion and real-time tracking.

The Driver Note pipeline—from user input through storage, checkout submission, backend persistence, and order status display—has been explicitly designed to preserve user intent (including emojis and accents) while maintaining security (HTML escaping) and accessibility.

Mobile-first responsive design, WCAG 2.1 AA accessibility compliance, and comprehensive error handling ensure a robust, user-friendly platform ready for production launch by week 5.
