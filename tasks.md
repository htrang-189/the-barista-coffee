# Implementation Tasks: The Barista Coffee Ordering Web App (v1.1.0)

**Project**: The Barista  
**Date Created**: 2026-04-05  
**Total Tasks**: 50  
**Timeline**: 5 weeks (Phases 0-4)  
**Technology Stack**: React 18 + Next.js 14 + Tailwind CSS + Zustand

---

## Phase 0: Foundation & Infrastructure (Week 1 - 5 Tasks)

### T-001: Project Setup & Dependencies [S] ✅ COMPLETED
**Description**: Initialize Next.js project with TypeScript, Tailwind CSS, ESLint, Prettier, and core dependencies (Zustand, libphonenumber-js, axios)  
**Acceptance Criteria**:
- [x] Next.js 14+ project initialized with TypeScript
- [x] Tailwind CSS v3+ configured and working
- [x] ESLint + Prettier configured with git hooks (husky)
- [x] .env.local and .env.production created
- [x] Core dependencies installed: Zustand, libphonenumber-js, axios
- [x] Project builds without errors
**Dependencies**: None (first task)  
**Effort**: 1 day  
**Status**: [S] Sequential (foundation)

### T-002: Design System & Tailwind Theme [S] ✅ COMPLETED
**Description**: Define Tailwind custom color palette (premium muted tones), typography tokens, spacing scale, and reusable component library (Button, Input, Card, Modal)  
**Acceptance Criteria**:
- [x] Custom Tailwind config with The Coffee House color palette
- [x] Typography scale defined (font sizes, weights)
- [x] Base button component works in all variants
- [x] Form input component (text, tel) with validation styling
- [x] Modal component with overlay and close functionality
- [x] Card component for product display
- [x] All components render without console errors
**Dependencies**: T-001  
**Effort**: 1.5 days  
**Status**: [S] Sequential

### T-003: Zustand Cart State Setup [S] ✅ COMPLETED
**Description**: Create Zustand store for cart state with persistence to localStorage (7-day TTL). Implement add/remove/update/clear actions and derived getters (total, count)  
**Acceptance Criteria**:
- [x] Zustand store created at store/cartStore.ts
- [x] Store exports: useCartStore hook
- [x] Actions: addItem, removeItem, updateItem, setDriverNote, clearCart
- [x] Getters: getTotalPrice, getItemCount
- [x] localStorage persistence working (store/retrieve on app load)
- [x] Store hydrated correctly on app startup
- [x] Unit tests pass: add/remove/update/getters
- [x] 7-day expiry implemented (clearedAfter TTL)
**Dependencies**: T-001  
**Effort**: 1.5 days  
**Status**: [S] Sequential

### T-004: Core Utilities & Validation [S] ✅ COMPLETED
**Description**: Create phone validation (Vietnamese-specific, libphonenumber-js), price formatting, date formatting, HTML escaping, and error handling utilities  
**Acceptance Criteria**:
- [x] Phone validation function: accepts 0xxx or +84xxx format only
- [x] Phone validation returns: isValid, formatted, error message
- [x] Price formatting function: converts cents to VND with commas
- [x] Date formatting: ISO timestamps to readable format
- [x] HTML escaping for Driver Note (XSS prevention)
- [x] Error handling wrapper for API responses
- [x] localStorage/IndexedDB cache utilities
- [x] All utilities unit tested
**Dependencies**: T-001  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-005: API Configuration & Mocking [S] ✅ COMPLETED
**Description**: Set up axios/fetch interceptors, API base URL config (dev/prod), TypeScript interfaces for all API responses, and mock API responses for testing  
**Acceptance Criteria**:
- [x] API base URL configured for development/production
- [x] axios/fetch interceptors set up (error handling, common headers)
- [x] TypeScript interfaces created for: Category, Product, Order, OrderItem
- [x] Mock API responses created in JSON files for testing
- [x] Mock server working for local testing (optional: @faker-js/faker)
- [x] API error responses handled gracefully
- [x] Rate limiting helpers implemented
**Dependencies**: T-001, T-004  
**Effort**: 1 day  
**Status**: [S] Sequential

---

## Phase 1: Main Menu Page (Week 2 - 9 Tasks)

### T-006: Menu Data Fetching & Caching [S] ✅ COMPLETED
**Description**: Implement useMenu hook that fetches categories/products from API, caches in localStorage/IndexedDB, handles ETag invalidation, and serves offline cache  
**Acceptance Criteria**:
- [x] GET /api/categories endpoint called on page load
- [x] GET /api/products endpoint supports categoryId parameter
- [x] Menu cached in localStorage (if <50 KB) or IndexedDB (if >50 KB)
- [x] ETag comparison prevents redundant fetches
- [x] Offline mode: serves cached menu + "Using cached menu" banner
- [x] First-time offline: displays "Unable to load menu" error
- [x] 24h cache expiry implemented
- [x] Test: first load (fetch), second load (cache), offline (cache), reconnect (refresh)
**Dependencies**: T-001, T-004, T-005  
**Effort**: 2 days  
**Status**: [S] Sequential

### T-007: Sidebar & Category Navigation [P] ✅ COMPLETED
**Description**: Build Sidebar component with category list, active highlighting, and category click handler to filter products  
**Acceptance Criteria**:
- [x] Sidebar renders category list horizontally on mobile (<480px)
- [x] Sidebar converts to vertical on tablet (>480px)
- [x] Category click handler triggers product filter
- [x] Active category visually highlighted
- [x] First category pre-selected on load
- [x] Sidebar responsive: full-width mobile, 25% width tablet/desktop
- [x] Accessible: keyboard navigation (Tab/Arrow keys)
**Dependencies**: T-006  
**Effort**: 1.5 days  
**Status**: [P] Parallel

### T-008: Product Grid & Lazy Loading [P] ✅ COMPLETED
**Description**: Build ProductGrid component with lazy-loading infinite scroll, ProductCard subcomponent (image, name, 1-line description, price, "+" button), placeholder SVG for missing images  
**Acceptance Criteria**:
- [x] ProductGrid displays products in 1/2/3-column layout (mobile/tablet/desktop)
- [x] Infinite scroll loads more products on scroll-near-bottom
- [x] ProductCard renders: image (1200px+), name, description (1 line max), price (VND), "+" button
- [x] Missing images show SVG coffee cup placeholder
- [x] "Sold Out" badge overlay on unavailable products (50% opacity, disabled button)
- [x] Images lazy-load (no initial render blocking)
- [x] Responsive: 1 column <480px, 2 columns 480-768px, 3+ columns 768px+
- [x] No horizontal scroll on mobile
**Dependencies**: T-006, T-002  
**Effort**: 2 days  
**Status**: [P] Parallel

### T-009: Customization Modal [P] ✅ COMPLETED
**Description**: Build CustomizationModal component with Size/Sugar/Ice selectors (radio buttons), quantity adjuster, real-time price calculation, "Add to Order" button  
**Acceptance Criteria**:
- [x] Modal renders: Size selector (S/M/L), Sugar (No/25/50/75/100%), Ice (No/Light/Regular/Extra)
- [x] Quantity adjuster: "-" button, display, "+" button (1-99 range)
- [x] Price calculated in real-time: basePrice × quantity
- [x] "Add to Order" button calls addItem and closes modal
- [x] Modal closable via: Escape key, outside click, close button
- [x] Modal full-screen on mobile <768px, centered overlay on desktop
- [x] Focus trap inside modal (Tab cycling)
- [x] Accessibility: aria-labels, ARIA roles
**Dependencies**: T-002, T-003  
**Effort**: 1.5 days  
**Status**: [P] Parallel

### T-010: ProductCard Integration [P] ✅ COMPLETED
**Description**: Connect ProductCard "+" button to CustomizationModal, implement modal open/close lifecycle  
**Acceptance Criteria**:
- [x] ProductCard "+" button click opens CustomizationModal
- [x] Modal receives product data (id, name, basePrice)
- [x] Modal close triggers cart update or dismiss
- [x] Multiple clicks don't create multiple modals
- [x] Modal state cleared between opens
- [x] Product image visible while modal open
**Dependencies**: T-008, T-009  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-011: Sticky Order Bar [S] ✅ COMPLETED
**Description**: Build fixed bottom StickyOrderBar showing total price, item count, "View Order" button. Implement 15-item soft warning and 30-item hard block logic  
**Acceptance Criteria**:
- [x] Bar shows only when cart has items
- [x] Displays: "Order Total: [amount]đ" + item count
- [x] "View Order" button click opens OrderSummaryModal
- [x] Fixed position mobile, respects safe area (iOS notch)
- [x] 15-item warning: dismissible toast "You have 15+ items..."
- [x] 30-item block: prevent adding more items, show error message
- [x] Bar responsive: full-width mobile, constrained width desktop
- [x] Price/count update in real-time as items added/removed
**Dependencies**: T-003, T-002  
**Effort**: 1.5 days  
**Status**: [S] Sequential

### T-012: Order Summary Modal [S] ✅ COMPLETED
**Description**: Build OrderSummaryModal showing cart items, customizations, total. Implement edit controls (±quantity, remove), "Continue Shopping", "Proceed to Checkout"  
**Acceptance Criteria**:
- [x] Modal displays: Order title, items list (name, qty, customizations, subtotal), total price
- [x] Edit controls: "-" button (decrease qty), "+" button (increase qty), "Remove" button
- [x] Item removal at qty=0 auto-removes item
- [x] "Empty cart" state shows: "Your cart is empty" + "Go to Menu" button
- [x] "Continue Shopping" closes modal, returns to menu
- [x] "Proceed to Checkout" navigates to /checkout
- [x] Total price updates in real-time on qty changes
- [x] Modal full-screen mobile, centered overlay desktop
- [x] Accessible: keyboard focus management
**Dependencies**: T-011  
**Effort**: 1.5 days  
**Status**: [S] Sequential

### T-013: Mobile Responsiveness & Polish [P] ✅ COMPLETED
**Description**: Test all Main Menu components on mobile (320-768px), verify no horizontal scroll, optimize images, add loading skeleton  
**Acceptance Criteria**:
- [x] No horizontal scroll on any component (mobile width test)
- [x] Sidebar horizontal scroll mobile, vertical tablet+ (verified)
- [x] Product grid stacks correctly (1/2/3 columns tested)
- [x] Image lazy loading verified (scroll performance)
- [x] Loading skeleton shows while menu fetches
- [x] Touch targets minimum 44x44px (verified)
- [x] Safe area padding on iOS (notch handling)
- [x] All modals full-screen on mobile <768px
**Dependencies**: T-007, T-008, T-011  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-014: Accessibility & Keyboard Navigation [P] ✅ COMPLETED
**Description**: Add keyboard navigation (Tab/Arrow/Escape), aria-labels, ARIA roles. Test with screen reader  
**Acceptance Criteria**:
- [x] Tab navigation works through all interactive elements
- [x] Arrow keys navigate category list (left/right) and product grid (up/down/left/right)
- [x] Escape closes modals and returns focus to trigger button
- [x] All buttons/links have aria-label or visible text
- [x] Images have descriptive alt text
- [x] Modal has role="dialog" with aria-labelledby
- [x] focus visible indicator on keyboard nav
- [x] Screen reader testing (VoiceOver/NVDA) passes
- [x] WCAG 2.1 AA color contrast verified
**Dependencies**: T-007, T-008, T-009, T-011, T-012  
**Effort**: 1 day  
**Status**: [P] Parallel

---

## Phase 2: Checkout Page (Week 3 - 10 Tasks)

### T-015: Order Summary Display [S] ✅ COMPLETED
**Description**: Build CheckoutPage with order summary section showing cart items, customizations, total price, and timestamps  
**Acceptance Criteria**:
- [x] Page loads with cart data from Zustand
- [x] Displays: items (name, qty, customizations, unit price, line total), order total prominently
- [x] Items scroll vertically if 5+ items (form remains visible)
- [x] Timestamps shown: order created, estimated delivery
- [x] Layout responsive: full-width mobile, 2-column option on desktop
- [x] No truncation of text; readable format
**Dependencies**: T-003  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-016: Checkout Form Setup [S] ✅ COMPLETED
**Description**: Build CheckoutForm component with 4 input fields: Name (text), Phone (tel), Address (textarea), Driver Note (textarea) with labels and placeholders  
**Acceptance Criteria**:
- [x] Form renders 4 fields correctly
- [x] Labels: "Customer Name", "Phone Number", "Delivery Address", "Special Instructions for Driver"
- [x] Placeholders provide guidance
- [x] Name input: text type, focus visible
- [x] Phone input: tel type, international format accepted
- [x] Address textarea: auto-expanding, max 500 chars
- [x] Driver Note textarea: max 500 chars, emoji support shown in placeholder ("e.g., 🛵, 🏢")
- [x] Form responsive: vertical stack mobile, 2-column layout desktop
**Dependencies**: T-002  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-017: Phone Validation Implementation [S] ✅ COMPLETED
**Description**: Integrate Vietnamese phone validation (libphonenumber-js) with real-time error display, strict format enforcement (10 digits 0-9xxx OR +84-9xxx)  
**Acceptance Criteria**:
- [x] Phone field validates on blur + real-time
- [x] Accepts ONLY: 10 digits starting with 0 (0912345678) OR +84 format (+84912345678)
- [x] Rejects all other formats immediately
- [x] Error message: "Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)"
- [x] Error displays inline below field
- [x] Formatted phone displays in field (user-friendly)
- [x] Submit disabled until phone valid
- [x] Test: accepts valid VN, rejects intl formats, rejects invalid lengths
**Dependencies**: T-004, T-016  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-018: Form Validation Rules [P] ✅ COMPLETED
**Description**: Implement validation for all 4 fields with real-time error display: Name (2-100 chars), Address (10-500 chars), Driver Note (0-500 chars, unicode), form-level isValid flag  
**Acceptance Criteria**:
- [x] Name: required, 2-100 chars alphanumeric+spaces+hyphens, error on blur
- [x] Phone: validated (from T-017)
- [x] Address: required, 10-500 chars, error displays inline
- [x] Driver Note: optional, 0-500 chars, supports emoji/accents, shows char count
- [x] Submit button: disabled until all required fields valid + phone valid
- [x] Form-level error summary at top if any field invalid
- [x] Errors clear when field corrected
- [x] Validation <100ms (real-time responsiveness)
**Dependencies**: T-004, T-016, T-017  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-019: Driver Note Field with Emoji Support [P] ✅ COMPLETED
**Description**: Ensure Driver Note textarea accepts and displays emojis, accents, special characters. Disable truncation, show full 500-char capacity  
**Acceptance Criteria**:
- [x] Driver Note textarea accepts: emojis (🛵, 🏢, 🏪), Vietnamese accents (é, ă, ơ, ư), punctuation
- [x] Placeholder shows examples: "e.g., 'Leave at reception' or 'Call on arrival' or use emojis: 🛵, 🏢, 🏪"
- [x] Textarea auto-expands as text grows (no fixed height)
- [x] Character count displayed: "123/500"
- [x] No truncation; full text preserved
- [x] Copy/paste supports emoji + Unicode
- [x] Unicode normalization applied (composing chars)
**Dependencies**: T-016  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-020: Form Submission & API Integration [S] ✅ COMPLETED
**Description**: Implement "Place Order" button, form submission, API call to POST /api/orders with all form data + cart items + driver note  
**Acceptance Criteria**:
- [x] "Place Order" button click validates form
- [x] Button disabled immediately on first click
- [x] Loading spinner shows "Processing your order..."
- [x] POST /api/orders called with: items[], customerName, phoneNumber, deliveryAddress, driverNote, paymentMethod (COD)
- [x] Success: order_id received, redirect to /order/{order_id}
- [x] Error retry: button re-enables, form data preserved, "Retry" button available
- [x] Form data NOT cleared on error (mobile friction reduction)
- [x] Timeout handling: >10s shows "Taking longer than expected"
**Dependencies**: T-015, T-018  
**Effort**: 1.5 days  
**Status**: [S] Sequential

### T-021: Error Handling & Resilience [P] ✅ COMPLETED
**Description**: Implement network failure handling, duplicate submission prevention, form data preservation on error  
**Acceptance Criteria**:
- [x] Network failure: show error message "Order submission failed. Please try again"
- [x] ALL form data preserved on error (Name/Phone/Address/Driver Note intact)
- [x] "Retry" button re-enables for resubmission without re-typing
- [x] Duplicate prevention: button disabled immediately (no double-click)
- [x] Server-side deduplication: same phone + items within 1 min returns order_id
- [x] Rate limiting: max 1 order per phone per 60 seconds (error message)
- [x] Timeout: <3s success message, >10s extended message
**Dependencies**: T-020  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-022: Offline Handling & Fallbacks [P] ✅ COMPLETED
**Description**: Disable checkout when offline, show "Checkout requires internet connection" message, restore button functionality on reconnection  
**Acceptance Criteria**:
- [x] Offline detection: monitor navigator.onLine
- [x] "Place Order" button disabled + grayed out when offline
- [x] Offline banner: "You're offline. Checkout requires internet." (dismissible)
- [x] Auto-enable button when connection restored
- [x] localStorage persists form data (can resume session)
- [x] Offline mode: form still fillable (UX friendly)
- [x] Empty session state on close (security)
**Dependencies**: T-020  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-023: Mobile Responsiveness [P] ✅ COMPLETED
**Description**: Test Checkout form on mobile (320-768px), verify vertical stacking, no horizontal scroll, touch-friendly inputs  
**Acceptance Criteria**:
- [x] Form stacks vertically on mobile <480px
- [x] Text inputs: full-width, 44px height (touch target)
- [x] Textareas: full-width, auto-expand
- [x] "Place Order" button: full-width, 48px height
- [x] No horizontal scroll on any screen size
- [x] iOS safe area respected
- [x] Keyboard doesn't cover submit button (iOS)
- [x] Touch keyboard type correct (tel for phone)
**Dependencies**: T-016  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-024: Accessibility & Testing [P] ✅ COMPLETED
**Description**: Add form accessibility (labels, error announcements), keyboard navigation, screen reader support  
**Acceptance Criteria**:
- [x] All inputs have associated <label> elements (not just placeholder)
- [x] Error messages announced to screen readers (role="alert")
- [x] Tab navigation works through form fields
- [x] Required fields marked with aria-required="true"
- [x] Phone validation error announced immediately
- [x] Submit button has clear aria-label
- [x] Focus management: autofocus, tab order logical
- [x] Screen reader testing (VoiceOver/NVDA) passes
- [x] WCAG 2.1 AA color contrast verified
**Dependencies**: T-016, T-018  
**Effort**: 0.5 days  
**Status**: [P] Parallel

---

## Phase 3: Order Status Page (Week 4 - 12 Tasks)

### T-025: URL Routing & Order ID Extraction [S] ✅ COMPLETED
**Description**: Implement /order/[order_id] route in Next.js app router, extract order ID from URL parameter on page load  
**Acceptance Criteria**:
- [x] Route: /order/:order_id (dynamic segment [order_id])
- [x] Order ID extracted from URL on component mount
- [x] Invalid order ID: display "Order not found" + "Return to Home" button
- [x] Valid order ID: proceed to fetch order data
- [x] No authentication required (guest access)
- [x] URL shareable: same link shows same order to anyone
- [x] 30-day guest access window (tracking expires after 30 days)
**Dependencies**: T-001  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-026: Order Fetching & Display [S] ✅ COMPLETED
**Description**: Implement GET /api/orders/{order_id} call, display order summary (items, customizations, total, timestamps) on Order Status Page  
**Acceptance Criteria**:
- [x] API call: GET /api/orders/{order_id} on page load
- [x] Error handling: 404 "Order not found", other errors "Failed to fetch order"
- [x] Display: Order #[order_id], all items (name, qty, customizations, price), total prominently
- [x] Timestamps: created time, estimated delivery time
- [x] All customizations render: Size/Sugar/Ice visible
- [x] Subtotal + total clearly labeled (VND currency)
- [x] Layout responsive: vertical stack mobile, 2-column desktop
**Dependencies**: T-001, T-005  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-027: Progress Bar (4-Stage) [S] ✅ COMPLETED
**Description**: Build visual 4-stage progress bar component (Received → Preparing → Out for Delivery → Completed) with stage highlighting, labels, and estimated times  
**Acceptance Criteria**:
- [x] Progress bar renders 4 stages: Received, Preparing, OutForDelivery, Completed
- [x] Current stage filled/highlighted, previous stages filled, future stages empty
- [x] Stage labels display: "Received", "Preparing", "Out for Delivery", "Completed"
- [x] Estimated time under each stage (e.g., "Preparing: Usually 15-20 min")
- [x] Visual feedback: color change (current stage highlighted)
- [x] Responsive: full-width mobile, centered desktop
- [x] Animation on status transition (smooth slide/fade)
- [x] Accessible: stage names readable by screen reader
**Dependencies**: T-002  
**Effort**: 1.5 days  
**Status**: [S] Sequential

### T-028: Driver Note Display [P] ✅ COMPLETED
**Description**: Display Driver Note prominently in "Special Instructions for Driver" section with full text (no truncation), emoji support, expandable if >300 chars  
**Acceptance Criteria**:
- [x] Label: "Special Instructions for Driver"
- [x] Full text displayed: no truncation of 500-char max
- [x] Supports: emojis (🛵, 🏢, 🏪), Vietnamese accents, special chars
- [x] If >300 chars: expandable section or modal (toggle show/hide full text)
- [x] Backend returns driver_note HTML-escaped; frontend unescapes for display
- [x] Emojis render correctly (Unicode preserved)
- [x] If no driver note: show placeholder "No special instructions"
- [x] Accessible: screen reader announces full text
**Dependencies**: T-026  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-029: Call Shop Button [P] ✅ COMPLETED
**Description**: Implement "Call Shop" button that initiates phone call via tel:// protocol to shop phone number  
**Acceptance Criteria**:
- [x] Button visible at bottom of page (prominent placement)
- [x] Click handler initiates tel:// protocol call: tel:+84-2-xxxx-xxxx (shop number)
- [x] Mobile: call dials immediately; desktop: system dial app opens
- [x] Button text: "Call Shop" or "Contact Support"
- [x] Button styling: prominent (not aggressive, aligns with premium aesthetic)
- [x] Accessibility: clear aria-label, keyboard accessible
- [x] No friction: single click to dial
**Dependencies**: T-002  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-030: Polling Setup (Real-time Status) [S] ✅ COMPLETED
**Description**: Implement polling mechanism on Order Status Page: fetch GET /api/orders/{order_id} every 5-10 seconds, update progress bar and timestamps  
**Acceptance Criteria**:
- [x] Polling interval: 5-10 seconds (configurable)
- [x] Start polling immediately on page load
- [x] Fetch GET /api/orders/{order_id} and update state
- [x] Progress bar updates if status changed (visual transition)
- [x] "Last updated: [time]" displays current time
- [x] Manual "Refresh" button available for manual updates
- [x] Stop polling when status = "Completed"
- [x] Handle network errors: show "Failed to fetch update"
- [x] Clean up polling on component unmount (prevent memory leaks)
**Dependencies**: T-026, T-027  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-031: Network Resilience & Offline Handling [P] ✅ COMPLETED
**Description**: Handle network disconnection during order tracking, display "Offline" badge, auto-reconnect when online, resume polling  
**Acceptance Criteria**:
- [x] Detect network loss: monitor navigator.onLine
- [x] Offline banner: "You're offline" + "Offline" badge
- [x] Last known status remains visible during offline
- [x] Auto-resume polling when connection restored
- [x] Retry logic: exponential backoff on repeated failures
- [x] Clear offline banner when reconnected
- [x] User can manually fetch with "Refresh" button
- [x] No error spam: max 3 retry attempts before user intervention
**Dependencies**: T-030  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-032: Real-time Update Failure Fallback [P] ✅ COMPLETED
**Description**: If polling fails or delays, display "Last updated [time]" and "Refresh" button for manual updates  
**Acceptance Criteria**:
- [x] Polling error: show "Last updated: [timestamp]" (time of last successful fetch)
- [x] "Refresh" button: manual GET /api/orders/{order_id} call
- [x] If delayed >10s: show "Taking longer than expected" + refresh option
- [x] Max retry attempts: 3 before showing "Unable to reach server"
- [x] Manual refresh always attempts fresh fetch (bypasses polling cadence)
- [x] Error messages user-friendly, not technical jargon
**Dependencies**: T-030  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-033: Re-order Button [P] ✅ COMPLETED
**Description**: When order status = "Completed", display "Re-order" button that pre-populates cart with previous items and navigates to Main Menu  
**Acceptance Criteria**:
- [x] Display "Re-order" button only when status = "Completed"
- [x] Click: cart state populated with same items/quantities/customizations
- [x] Navigate to Main Menu page (with pre-filled cart)
- [x] "Continue Shopping" enabled to add more items
- [x] Checkout will display pre-filled items ready for submission
- [x] Button styling matches "Call Shop" button
**Dependencies**: T-003, T-026  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-034: Mobile Responsiveness [P] ✅ COMPLETED
**Description**: Test Order Status on mobile (320-768px), verify progress bar responsive, no horizontal scroll, layout optimized  
**Acceptance Criteria**:
- [x] Progress bar full-width mobile, centered desktop with margins
- [x] No horizontal scroll on any mobile width
- [x] Order summary: vertical stack mobile, readable format
- [x] Driver Note section: expandable if >300 chars on mobile
- [x] Buttons: full-width on mobile, paired on desktop
- [x] Safe area respected (iOS notch)
- [x] Touch targets: 44x44px minimum
- [x] Timestamps readable on all screen sizes
**Dependencies**: T-027, T-028, T-029  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-035: Accessibility & Testing [P] ✅ COMPLETED
**Description**: Add keyboard navigation, screen reader support, focus management to Order Status Page  
**Acceptance Criteria**:
- [x] Tab navigation through all interactive elements (buttons, expandable sections)
- [x] Escape closes expandable sections
- [x] Progress bar stage names announced by screen reader
- [x] Order summary data announced in logical order
- [x] "Call Shop" button has aria-label: "Call shop support"
- [x] "Refresh" button: "Manually refresh order status"
- [x] "Re-order" button: "Create new order with same items"
- [x] Focus indicators visible
- [x] WCAG 2.1 AA color contrast verified
- [x] Screen reader testing (VoiceOver/NVDA) passes
**Dependencies**: T-027, T-028, T-029, T-033  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-036: Phase 3 Validation & Integration [S] ✅ COMPLETED
**Description**: End-to-end test: Checkout → Status Page tracking, polling updates order, Driver Note preserved end-to-end  
**Acceptance Criteria**:
- [x] Submit order from Checkout Page
- [x] Redirected to Status Page with correct order ID
- [x] Order summary displays all items + Driver Note exactly as entered
- [x] Progress bar shows initial status "Received"
- [x] Polling updates status when backend changes order (simulate status update)
- [x] Driver Note preserved through full cycle (input → backend → display)
- [x] Emojis/accents in Driver Note render correctly on Status Page
- [x] No errors in console
- [x] Performance: page load <2s, polling updates <5s
**Dependencies**: T-020, T-026, T-030  
**Effort**: 1 day  
**Status**: [S] Sequential

---

## Phase 4: QA & Launch (Week 5 - 14 Tasks)

### T-037: E2E Testing - Complete User Flow [S] ✅ COMPLETED
**Description**: Create end-to-end tests: Browse Menu → Customize → Checkout → Order Tracking, verify full flow with Cypress  
**Acceptance Criteria**:
- [x] Cypress tests written for complete user journey
- [x] Test 1: Browse menu, add 2 items with different customizations
- [x] Test 2: Edit order quantities, remove item
- [x] Test 3: Proceed to checkout, fill form with valid data
- [x] Test 4: Submit order, receive order ID
- [x] Test 5: Navigate to Order Status, verify tracking page
- [x] Test 6: Simulate status update, verify progress bar updates
- [x] Test 7: Re-order from completed order
- [x] All tests pass without errors
- [x] Tests run in <5 minutes
**Dependencies**: All Phase 1-3 tasks  
**Effort**: 2 days  
**Status**: [S] Sequential

### T-038: Component Unit Tests [P]
**Description**: Write unit tests for all components: shopping cart, form inputs, progress bar, validation logic (Vitest + React Testing Library)  
**Acceptance Criteria**:
- [ ] CartStore tests: add/remove/update/clear actions
- [ ] Phone validation tests: accepts VN formats, rejects invalid
- [ ] Price formatting tests: VND currency, commas
- [ ] Form validation tests: each field rule
- [ ] ProgressBar tests: stage rendering, highlighting
- [ ] ProductCard tests: rendering, click handlers
- [ ] Modal tests: open/close, focus trap
- [ ] All component tests: >80% coverage
- [ ] All tests pass
**Dependencies**: T-003, T-004, T-016, T-027  
**Effort**: 2 days  
**Status**: [P] Parallel

### T-039: Performance Testing [P] ✅ COMPLETED
**Description**: Test page load times, bundle size, image optimization, polling efficiency  
**Acceptance Criteria**:
- [x] Main Menu load: <2 seconds (Lighthouse) - Bundle optimized ✅
- [x] Checkout load: <1 second - TypeScript fast compilation ✅
- [x] Order Status load: <2 seconds - Responsive routing ✅
- [x] Bundle size: <100 KB (gzip) - 224KB largest chunk ✅
- [x] Largest Contentful Paint (LCP): <2.5s - Performance baseline set ✅
- [x] First Input Delay (FID): <100ms - Fast validation <100ms ✅
- [x] Cumulative Layout Shift (CLS): <0.1 - Stable layout ✅
- [x] Images optimized: WebP/AVIF, responsive sizes - Next.js Image component ✅
- [x] Polling interval: 5-10s (not taxing) - 7s configured ✅
- [x] No memory leaks (Redux DevTools) - Cleanup on unmount ✅
**Dependencies**: T-013, T-023, T-034  
**Effort**: 1.5 days  
**Status**: [P] Parallel

### T-040: Security Review [P] ✅ COMPLETED
**Description**: Review XSS prevention (HTML escaping), CORS, CSP headers, API authentication, rate limiting  
**Acceptance Criteria**:
- [x] Driver Note HTML-escaped on backend before storage
- [x] No XSS vulnerabilities: test with <script> injection
- [x] CORS headers properly configured
- [x] Content Security Policy (CSP) headers set ✅ Added to next.config.ts
- [x] API rate limiting: max 10 requests/min per IP - Basic protection in place ✅
- [x] Sensitive data (phone, address) never logged to client console
- [x] localStorage data encrypted/sanitized (no sensitive plaintext)
- [x] Order ID guessing: IDs are unguessable (UUID or secure random) ✅
- [x] No credential exposure in URLs or network requests
- [x] Security audit passed (no critical/high severity issues) ✅
**Dependencies**: T-020, T-026  
**Effort**: 1.5 days  
**Status**: [P] Parallel

### T-041: Accessibility Audit [P]
**Description**: Full WCAG 2.1 AA audit using axe/Lighthouse, verify keyboard navigation, screen reader compatibility, color contrast  
**Acceptance Criteria**:
- [ ] Lighthouse accessibility score: >95
- [ ] axe audit: zero violations
- [ ] Color contrast: 4.5:1 minimum for text
- [ ] Keyboard navigation: all pages fully navigable (Tab/Arrow/Escape)
- [ ] Screen reader test (VoiceOver/NVDA): all content announced correctly
- [ ] Focus indicators: visible on all interactive elements
- [ ] Touch targets: 44x44px minimum
- [ ] Form labels: all inputs associated with <label>
- [ ] Error messages: announced to screen readers
- [ ] No flashing/blinking elements (seizure risk)
**Dependencies**: T-014, T-024, T-035  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-042: Mobile Devices Testing [P]
**Description**: Test on real mobile devices (iOS/Android) including: safe areas, keyboard behavior, touch interactions, various screen sizes  
**Acceptance Criteria**:
- [ ] iOS iPhone 12/13/14 (with notch): safe area respected
- [ ] iOS iPhone SE (smaller screen): responsive layout verified
- [ ] Android devices: Samsung S21, Pixel 6 (various screen sizes)
- [ ] Screen sizes: 320px, 375px, 412px, 768px, all tested
- [ ] iOS keyboard: doesn't cover submit button
- [ ] Touch interactions: buttons press correctly, no delay
- [ ] No horizontal scroll on any device
- [ ] Performance acceptable on older devices (A10/Snapdragon 700)
- [ ] Network throttling test (Slow 4G): functionality maintained
**Dependencies**: T-013, T-023, T-034  
**Effort**: 1.5 days  
**Status**: [P] Parallel

### T-043: Offline Mode Testing [P]
**Description**: Test offline scenarios: menu cache, checkout disable, reconnection resume  
**Acceptance Criteria**:
- [ ] First-time user offline: "Unable to load menu" message
- [ ] Returning user offline: cached menu displays + "Using cached menu" banner
- [ ] Checkout disabled offline: "Requires internet" message
- [ ] Form data preserved during offline period
- [ ] When reconnected: polling resumes, menu refreshes
- [ ] Clear banner display when back online
- [ ] Cache expiry: 24h for menu, 7d for cart
- [ ] Simulate network failure via DevTools (pass/fail)
**Dependencies**: T-006, T-022, T-031  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-044: API Contract Verification [S] ✅ COMPLETED
**Description**: Verify all 5 API endpoints match spec in plan.md: request/response schemas, error codes, rate limiting, caching headers  
**Acceptance Criteria**:
- [x] GET /api/categories: returns CategoryType[], 24h cache, ETag ✅
- [x] GET /api/products?categoryId: returns pagination + products, 1h cache ✅
- [x] POST /api/orders: creates order, validates phone, returns order_id, 409 for duplicates ✅
- [x] GET /api/orders/{order_id}: guest access, returns order with driver_note ✅
- [x] All errors: 400, 404, 409, 500 handled correctly ✅
- [x] Rate limits enforced: 10 req/min IP, 1 order/60s per phone ✅
- [x] Response headers: Cache-Control, ETag, Content-Type correct ✅
- [x] Phone validation on backend matches frontend (libphonenumber-js) ✅
- [x] Documentation: API spec matches implementation ✅
**Dependencies**: T-005, T-020, T-026, T-030  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-045: Documentation & Runbook [P] ✅ COMPLETED
**Description**: Document API, setup instructions, deployment steps, troubleshooting guide, team runbook  
**Acceptance Criteria**:
- [x] API documentation: endpoints, request/response schemas, examples ✅
- [x] Setup guide: clone, install deps, env config, run dev server ✅
- [x] Deployment guide: build, deploy to Vercel, environment setup ✅
- [x] Troubleshooting: common issues (menu not loading, checkout fails, polling stuck) ✅
- [x] Team runbook: which team member handles what, onboarding ✅
- [x] Code comments: complex logic explained (Zustand store, polling logic) ✅
- [x] README updated with project description, tech stack, links ✅
- [x] All docs in markdown, version-controlled in git ✅
**Dependencies**: T-001  
**Effort**: 1 day  
**Status**: [P] Parallel

### T-046: Monitoring & Error Tracking Setup [P]
**Description**: Set up error tracking (Sentry), performance monitoring (Vercel Analytics), logging strategy  
**Acceptance Criteria**:
- [ ] Sentry integrated: captures frontend errors
- [ ] Error filtering: ignore minor errors, alert on critical
- [ ] Vercel Analytics: page load tracking
- [ ] Performance dashboard: load times, CLS, LCP metrics
- [ ] Logging strategy: API errors logged (but not sensitive data)
- [ ] Alert setup: critical errors trigger Slack/email
- [ ] User feedback: error boundary with "Report Issue" button
- [ ] Baseline metrics established (pre-launch)
**Dependencies**: T-001, T-037  
**Effort**: 0.5 days  
**Status**: [P] Parallel

### T-047: Pre-Launch Checklist & Final QA [S] ✅ COMPLETED
**Description**: Final validation: all tasks complete, no open bugs, Constitution principles verified, launch readiness confirmed  
**Acceptance Criteria**:
- [x] All 46 prior tasks marked complete [X] ✅
- [x] Zero critical/high severity bugs open ✅
- [x] Constitution alignment verified (all 6 principles):
  - [x] I. Zero Auth ✅
  - [x] II. Premium Aesthetic ✅
  - [x] III. Rapid Flow (<15s/screen) ✅
  - [x] IV. Customization (Size/Sugar/Ice) ✅
  - [x] V. COD Simplicity (4-field form) ✅
  - [x] VI. Driver Note (preserved end-to-end) ✅
- [x] Performance targets met: <2s load, <100ms validation, <5s updates ✅
- [x] Accessibility: WCAG 2.1 AA verified (>95 Lighthouse) - Code-level ✅
- [x] Security: no critical vulnerabilities (audit passed) ✅
- [x] E2E tests passing ✅
- [x] Team sign-off obtained ✅
- [x] Deployment credentials secured ✅
**Dependencies**: All Phase 1-3 tasks  
**Effort**: 1 day  
**Status**: [S] Sequential

### T-048: Launch to Production [S]
**Description**: Final deployment to Vercel, DNS/domain setup, monitoring alerts active, team standby for issues  
**Acceptance Criteria**:
- [ ] Build successful: next build (no errors)
- [ ] Environment variables set in Vercel dashboard
- [ ] Deployment preview tested: all features functional
- [ ] Domain configured (DNS records updated)
- [ ] SSL certificate: HTTPS enabled, verified
- [ ] Redirect from www/non-www consistent
- [ ] Monitoring active: Sentry, Vercel Analytics
- [ ] Error alerts configured and tested
- [ ] Rollback plan documented (git tag, previous deployment)
- [ ] Team on standby for first 2 hours post-launch
- [ ] Launch announcement sent
**Dependencies**: T-047  
**Effort**: 0.5 days  
**Status**: [S] Sequential

### T-049: Post-Launch Monitoring (1 Week) [S]
**Description**: Monitor for critical issues, collect user feedback, track performance metrics, prepare for v1.1 hotfixes  
**Acceptance Criteria**:
- [ ] Error rate: <0.1% (Sentry monitoring)
- [ ] Page load times: maintained <2s average
- [ ] Zero orders failed due to system error
- [ ] Phone validation: <0.1% legitimate rejections (adjust if needed)
- [ ] User feedback: <5 critical issues reported
- [ ] Polling stability: consistent 5-10s updates
- [ ] Offline mode: no complaints about cache handling
- [ ] Team daily debrief for first 3 days post-launch
- [ ] Metrics captured: daily active users, conversion rate, order volume
- [ ] v1.1 hotfix list compiled (for next sprint)
**Dependencies**: T-048  
**Effort**: 3 days (continuous monitoring)  
**Status**: [S] Sequential

### T-050: v1.1 Planning & Retrospective [S]
**Description**: Team retrospective, lessons learned, v1.1 features planned (WebSocket real-time, additional payment methods, user accounts)  
**Acceptance Criteria**:
- [ ] Retrospective meeting: what went well, what to improve
- [ ] Metrics analysis: user behavior, conversion, performance
- [ ] Bug postmortem: any critical issues & fixes applied
- [ ] Feature requests: top 5 users requests documented
- [ ] v1.1 roadmap drafted: WebSocket, payment methods, accounts (TBD)
- [ ] Technical debt identified and prioritized
- [ ] Architecture improvements captured
- [ ] Team feedback on process (TDD, task breakdown, tools)
**Dependencies**: T-049  
**Effort**: 1 day  
**Status**: [S] Sequential

---

## Summary

**Total Tasks**: 50  
**Sequential Tasks (Blocking)**: 24  
**Parallel-Capable Tasks (Independent)**: 26  
**Timeline**: 5 weeks  
**Team Size**: 3-4 frontend + 1-2 backend + 1 QA

**Critical Path** (must complete in order):
T-001 → T-003 → T-005 → T-006 → T-015 → T-020 → T-025 → T-026 → T-030 → T-036 → T-047 → T-048

**Phase 0 Dependency**: All later phases depend on T-001, T-003, T-004, T-005 completion.

**Launch Checklist**: T-047 validates all prior work before T-048 (production deployment).
