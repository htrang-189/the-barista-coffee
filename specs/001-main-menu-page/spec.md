# Feature Specification: Main Menu Page

**Feature Branch**: `001-main-menu-page`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: Create a detailed specification for the 'Main Menu Page' with left sidebar categories, product cards with images, customization modal, and sticky order summary bar

## Clarifications

### Session 2026-04-05 (Main Questions)

- Q: When user clicks "View Order" button, what is the checkout page integration pattern? → A: Modal Overlay (Option A) - Opens overlay modal on Main Menu showing order summary + checkout form; user can adjust order without navigating away
- Q: What additional product information should be shown on product cards? → A: Base + Description (Option B) - Image, name, price, + 1-line description; description/details only appear in customization modal
- Q: Should there be limits on items per order? → A: Order Total Cap (Option C) - Max 30 items total per order; soft warning at 15 items
- Q: How should products appear within categories? → A: Fixed Server Order (Option A) - Products appear in backend-defined order; no client-side sorting
- Q: How should system handle connection failures? → A: Offline Mode (Option C) - Cache menu data on first load; serve cached data if offline; show banner indicating cached data

### Session 2026-04-05 (Edge Cases & Mobile Pattern)

- **Empty Category**: Display "No items in this category" message + "Back to Menu" button to return to category list
- **Large Menu**: Implement lazy loading (infinite scroll) to maintain premium aesthetic; NO pagination controls
- **Product Out of Stock**: Show "Sold Out" badge on card, gray out product image, disable '+' button; DO NOT hide item (maintain brand/menu visibility)
- **Order Limit Message (30 items)**: Display friendly toast: "Our barista can only handle 30 items per order for best quality"
- **Image Fallback**: Use minimalist coffee cup icon as placeholder when image fails to load
- **Mobile Modal**: Order Summary modal must be full-screen on mobile (like The Coffee House) for easy interaction; desktop version can be centered overlay
- **Accessibility**: Confirm keyboard support (Tab/Enter/Escape) + screen reader compatibility across all interactive elements

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Drinks by Category (Priority: P1)

A busy office worker opens the app and needs to quickly find a drink category (Espresso, Vietnamese, Matcha, Desserts, etc.). They scan the left sidebar, click a category, and see filtered products.

**Why this priority**: Core hiring feature - users cannot order without seeing products. This is the entry point to the entire ordering flow.

**Independent Test**: Can be fully tested by loading the app, verifying sidebar categories display, and clicking category → products filter works. Delivers core UI structure + navigation.

**Acceptance Scenarios**:

1. **Given** the user loads Main Menu Page, **When** the page renders, **Then** the left sidebar displays all drink categories (Espresso Bar, Vietnamese Coffee, Matcha, Cold Brew, Desserts, etc.) with clear visual hierarchy
2. **Given** categories are visible, **When** user clicks a category, **Then** product cards update immediately and only show drinks from that category
3. **Given** the menu is browsed, **When** a category contains no products (edge case), **Then** an empty state message displays: "No items available"
4. **Given** the page loads, **When** page renders, **Then** the first category (Espresso Bar) is pre-selected by default

---

### User Story 2 - View Product with Image and Add to Order (Priority: P1)

User sees a product card with large, high-quality image, drink name, price, and '+' button. They can quickly add products to their order without complexity.

**Why this priority**: Core ordering interaction. Without this, order creation is blocked. This story tests the fundamental product display + add-to-cart pattern.

**Independent Test**: Can be fully tested by displaying a product card, verifying image renders at correct size, and clicking '+' triggers customization flow. Delivers P1 value independently.

**Acceptance Scenarios**:

1. **Given** a category is selected, **When** the page displays product cards, **Then** each card shows: product image (minimum 400px width), drink name, 1-line description, price, and '+' button *(aligned with Constitution II: premium aesthetic)*
2. **Given** product images are displayed, **When** page renders, **Then** images load from high-resolution source (minimum 1200px width internally, displayed responsive)
3. **Given** user sees a product card, **When** they click the '+' button, **Then** the customization modal opens immediately (no loading state)
4. **Given** product cards are shown, **When** price is displayed, **Then** format shows currency (e.g., "50.000đ") consistent with Vietnamese market

---

### User Story 3 - Customize Drink in Modal (Priority: P1)

User clicks '+' on a product → customization modal opens with Size (S/M/L), Sugar (No Sugar/25%/50%/75%/100%), and Ice (No Ice/Light/Regular/Extra) options. They select preferences, adjust quantity, and confirm.

**Why this priority**: Drinks without customization don't match user expectations. This is non-negotiable per Constitution IV.

**Independent Test**: Can be fully tested by opening modal, selecting all option combinations, and verifying selections persist in modal preview. Delivers P1 independently.

**Acceptance Scenarios**:

1. **Given** customization modal opens, **When** page renders, **Then** the modal displays: product name, large product image, Size picker (S/M/L), Sugar selector (No Sugar, 25%, 50%, 75%, 100%), Ice selector (No Ice, Light, Regular, Extra), and quantity adjuster (-, quantity display, +)
2. **Given** the modal is open, **When** user selects Size/Sugar/Ice options, **Then** selections are immediately reflected in the modal's preview text (e.g., "Medium, 50% Sugar, Regular Ice")
3. **Given** user adjusts quantity, **When** they change the number, **Then** total price updates in real-time within the modal
4. **Given** options are selected, **When** user clicks "Add to Order" button, **Then** the customization is saved and modal closes, returning to product list
5. **Given** the modal is open, **When** user clicks outside the modal or presses Escape, **Then** modal closes WITHOUT saving changes (discard flow)

---

### User Story 4 - Track Order Total and Proceed to Checkout (Priority: P1)

As user adds drinks to their order, a sticky bottom bar shows the running total price and "View Order" button. They click "View Order" to see order summary and proceed to checkout.

**Why this priority**: Users need visibility of order total before checkout. This drives conversion and prevents abandonment.

**Independent Test**: Can be fully tested by adding multiple items with different customizations, verifying total calculates correctly, and clicking "View Order" navigates to checkout. Delivers P1 independently.

**Acceptance Scenarios**:

1. **Given** user is on Main Menu, **When** they add first item to order, **Then** sticky bottom bar appears with total price and "View Order" button
2. **Given** items are in the order, **When** user adds more items, **Then** the total price updates to reflect new order value
3. **Given** a sticky bottom bar is shown, **When** user scrolls up/down on product list, **Then** the bar remains fixed at bottom of screen
4. **Given** the bottom bar is visible, **When** user clicks "View Order" button, **Then** navigation occurs to the Order Summary/Checkout page
5. **Given** sticky bar is visible, **When** order contains multiple customized items, **Then** bar shows final total (all sizes, prices, quantity multiplied correctly)
6. **Given** no items are added yet, **When** page loads, **Then** sticky bottom bar is NOT visible (only appears after first add)
7. **Given** user has added 15 items to order, **When** they add another item, **Then** a dismissible warning appears: "You have 15+ items in your order. Large orders may take longer to prepare"
8. **Given** user has 30 items in order, **When** they attempt to add another item, **Then** system prevents addition and displays message: "Maximum order size (30 items) reached. Please proceed to checkout or remove items"

---

### User Story 5 - Multi-Select Category Sidebar (Priority: P2)

User can see all categories in a scrollable sidebar and understands the menu structure at a glance. Active category is highlighted visually.

**Why this priority**: UX polish. P1 stories are blocked without this context, but sidebar can function with simple text. This improves usability and brand alignment (Constitution II).

**Independent Test**: Can be tested by verifying all categories are listed, scrollability works on mobile, and active category styling applies. Delivers P2 independently.

**Acceptance Scenarios**:

1. **Given** the sidebar is rendered, **When** categories exceed viewport height, **Then** sidebar becomes scrollable vertically
2. **Given** user is browsing categories, **When** they click a category, **Then** that category displays active/highlighted state (e.g., background color change, bold text)
3. **Given** a category is active, **When** user scrolls product cards, **Then** the active category remains visually highlighted in sidebar
4. **Given** the page loads on mobile, **When** sidebar width is constrained, **Then** category names remain readable (no text truncation)

---

### User Story 6 - Search/Filter by Drink Name (Priority: P3)

User can search for drinks by name (e.g., "Matcha Latte") without category selection. Search box appears in sidebar or top bar.

**Why this priority**: Enhancement. Core flow works without search. Relevant for power users and large menus but not P1.

**Independent Test**: Can be tested by typing partial drink name and verifying filtered results appear. Delivers P3 independently.

**Acceptance Scenarios**:

1. **Given** search input is available, **When** user types a drink name, **Then** product list filters to show only matching drinks (partial match acceptable)
2. **Given** search results are shown, **When** user clears search, **Then** product list returns to current category view
3. **Given** search text is entered, **When** no results exist, **Then** empty state displays "No drinks found"

---

### Edge Cases

- **Empty category**: What happens when a category exists but has no products? → Display "No items in this category" message + "Back to Menu" button to return to category list. Users never feel stuck in an empty state
- **Large menu**: What if the menu has 100+ products? → Implement lazy loading (infinite scroll) as products scroll into viewport; NO pagination controls to maintain premium aesthetic. Products load efficiently; lazy load handled server-side
- **Product out of stock**: How does system indicate stock status? → Show "Sold Out" badge on product card; gray out product image at 50% opacity; disable '+' button. DO NOT hide out-of-stock items—maintain menu visibility and brand completeness. Users see full menu structure
- **Order item limit**: What happens when user reaches 30-item cap? → Display friendly toast message: "Our barista can only handle 30 items per order for best quality." Soft warning at 15 items; hard block at 30 items with message; '+' button disabled
- **Product sort order**: How are products arranged in categories? → Fixed server order from backend API; no client-side sorting
- **Network failure**: What happens if menu API call fails on load? → Serve cached menu data; show banner indicating cache usage. Checkout disabled if offline
- **First-time user offline**: Can user browse menu without ever connecting? → No; cache created only after successful first API fetch. No data available on first load if offline
- **Stale cache**: How old can cached data be? → No time limit enforced in v1; user sees "last updated [timestamp]" banner. Refresh happens on next online connection
- **High-res image loading**: What's the fallback if an image fails to load? → Display minimalist coffee cup icon (SVG placeholder) consistent with premium aesthetic + retry mechanism
- **Mobile modal UI**: How does Order Summary modal behave on mobile? → Full-screen modal on mobile/tablet (portrait). Desktop: centered overlay (300-600px width). Like The Coffee House app pattern for easy tapping
- **Accessibility**: Are keyboard users supported? → All interactive elements support keyboard: Tab/Shift+Tab navigation, Enter/Space activation, Escape to close modals. Screen reader labels (aria-label) on buttons/images/forms. Form fields use <label> elements

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a left sidebar with all drink categories listed vertically and scrollable
- **FR-002**: System MUST load product cards filtered by selected category, showing image (high-res), name, price, 1-line description, and '+' button *(description helps users make quick decisions while maintaining minimalist aesthetic)*
- **FR-002a**: System MUST truncate product descriptions to 1 line maximum (using ellipsis if text exceeds display width) to keep cards compact on mobile
- **FR-003**: System MUST open customization modal when '+' button is clicked, displaying Size/Sugar/Ice options and quantity adjuster
- **FR-004**: System MUST calculate and display total price in real-time as user adjusts customization options in modal
- **FR-005**: System MUST display a sticky bottom bar showing running order total and "View Order" button (only when order is non-empty)
- **FR-006**: System MUST save drink customizations (Size, Sugar, Ice, Quantity) to order when "Add to Order" is clicked in modal
- **FR-007**: System MUST highlight active category in sidebar to indicate current selection
- **FR-008**: System MUST close customization modal without saving when user clicks outside modal, presses Escape, or clicks cancel
- **FR-009**: System MUST open an Order Summary modal overlay when "View Order" button is clicked, displaying current order items with customizations, total price, and checkout form fields (Name, Phone, Delivery Address, Driver Note) without navigating away from Main Menu
- **FR-009a**: System MUST allow user to modify order quantities or remove items directly from Order Summary modal before proceeding to payment
- **FR-009b**: System MUST close Order Summary modal without submitting when user clicks outside modal, presses Escape, or clicks "Continue Shopping" button, returning to Main Menu with order preserved
- **FR-013**: System MUST enforce a maximum order item limit of 30 items total (sum of all quantities across all products in order)
- **FR-013a**: System MUST display a soft warning when order reaches 15 items: "You have 15+ items in your order. Large orders may take longer to prepare" (warning is dismissible; user can continue adding)
- **FR-013b**: System MUST prevent adding new items when order reaches 30 items; display message: "Maximum order size (30 items) reached. Please proceed to checkout or remove items"
- **FR-013c**: System MUST disable the '+' button on product cards when adding would exceed the 30-item limit
- **FR-014**: System MUST display products within each category in the order defined by backend API data; no client-side sorting or reordering performed
- **FR-015**: System MUST cache menu data (categories + products) locally on first successful API fetch using browser storage (localStorage or IndexedDB)
- **FR-015a**: System MUST serve cached menu data when network request fails or device is offline; user can browse and customize drinks without connectivity
- **FR-015b**: System MUST display an informational banner when serving cached data: "Using cached menu (last updated [timestamp]). Some features may be unavailable" (dismissible)
- **FR-015c**: System MUST disable checkout flow (disable "View Order" button if possible) when offline; display message: "Checkout requires internet connection. Please connect and try again"
- **FR-016**: System MUST refresh cached menu data on next successful online connection; user is notified if menu has changed (new products, price updates)
- **FR-017**: System MUST display "Back to Menu" button in empty category state; clicking returns user to category list view
- **FR-018**: System MUST mark out-of-stock products with a "Sold Out" badge overlaid on product card; gray out product image at 50% opacity; disable '+' button for that product
- **FR-018a**: System MUST NOT hide out-of-stock products from the menu (must remain visible to maintain brand/menu completeness)
- **FR-019**: System MUST implement lazy loading (infinite scroll) for large product lists; load next batch of products as user scrolls towards bottom of list; NO pagination controls visible to maintain premium aesthetic
- **FR-020**: System MUST update the 30-item limit message to: "Our barista can only handle 30 items per order for best quality" (friendly, brand-aligned tone); display as a toast notification
- **FR-021**: System MUST use a minimalist coffee cup SVG icon as image placeholder when product image fails to load; icon follows premium aesthetic (simple clean line art); icon is clickable to retry image load
- **FR-022**: System MUST display Order Summary modal as full-screen overlay on mobile/tablet (portrait mode); center modal on desktop (300-600px width). Follows The Coffee House app pattern for easy interaction
- **FR-023**: System MUST provide full accessibility support: all interactive elements keyboard-navigable (Tab/Shift+Tab), Enter/Space to activate buttons, Escape to close modals; all images/buttons have aria-label attributes; form fields use <label> elements for screen readers
- **FR-010**: System MUST pre-select the first category (Espresso Bar) on initial page load
- **FR-011**: System MUST persist images at 1200px minimum width and serve them responsively (400px display width on mobile, scaled accordingly)
- **FR-012**: System MUST handle category with zero products gracefully with empty state message

### Key Entities

- **Category**: Represents a drink type grouping (e.g., "Espresso Bar", "Vietnamese Coffee"). Attributes: name, display_order, product_count
- **Product**: Individual drink item (e.g., "Americano"). Attributes: name, price, category_id, image_url, description
- **OrderItem**: Represents a product added to user's order with customizations. Attributes: product_id, quantity, size, sugar_level, ice_level, item_total_price
- **Order**: Collection of OrderItems for current user session. Attributes: items[], total_price, status (draft/sent/confirmed)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can browse categories and view products within 5 seconds of page load
- **SC-002**: Customization modal opens and closes instantly (<300ms) without perceptible lag
- **SC-003**: Users can add 3 different customized drinks to their order within 2 minutes (aligns with Constitution III target: <15 sec/screen)
- **SC-004**: Product images render at full quality (1200px source) on all device sizes without pixelation or distortion
- **SC-005**: Sticky bottom bar accurately reflects order total (100% price calculation accuracy across all combinations)
- **SC-006**: 95% of users complete main menu browsing and add at least 1 item to order on first visit (successful engagement metric)
- **SC-007**: Page remains responsive (sticky bar, modal, scrolling) on mobile devices with minimal jank (60 FPS target)
- **SC-008**: Category sidebar is fully visible and accessible on all mobile breakpoints (320px - 768px widths)
- **SC-009**: Order item limit validation works correctly: soft warning triggers at 15 items; hard block at 30 items; no off-by-one errors
- **SC-010**: Cached menu data is successfully stored and retrieved; first offline load after successful online fetch displays cached data
- **SC-011**: Cache refresh on reconnect works without page reload; user is notified if menu data has changed
- **SC-012**: Out-of-stock products display correctly: badge visible, image grayed (50% opacity), '+' button disabled; users can view full menu structure
- **SC-013**: Lazy loading works smoothly: products load as user scrolls; no jank or jumping content; infinite scroll provides seamless browsing experience (no artificial pagination)
- **SC-014**: Order Summary modal displays full-screen on mobile devices (<600px width); centered overlay on desktop (300-600px); both responsive and easy to interact with
- **SC-015**: Accessibility: keyboard users can navigate sidebar, product cards, modals, and checkout form using Tab/Enter/Escape; screen readers correctly announce all buttons, images, and form labels (WCAG 2.1 AA compliance)

## Assumptions

- **Target users browse on mobile devices** (Constitution I: office workers use phones). Desktop version mirrors mobile layout.
- **Users have stable internet connectivity** to load large product images. Slow connections defer to lower-res fallback (400px served initially, higher res loaded progressively).
- **Menu categories and products are pre-populated** from a backend API and don't require content management UI in v1.
- **VND (Vietnamese Dong) currency formatting** is default. Multi-currency support is out of scope for v1.
- **Product stock status** IS visible in v1 via "Sold Out" badge; out-of-stock products remain visible on menu (maintain brand visibility). Backend provides `stock_status` field (in_stock / sold_out)
- **Search functionality** (Story 6) is P3 and deferred to v1.1 if needed. v1 focuses on category-based discovery only.
- **Customization options** (Size/Sugar/Ice) are fixed per Constitution IV. Modifier system is not extensible in v1.
- **Guest checkout only** - no user accounts. Order data stored client-side (session storage) until checkout.
- **Offline caching strategy** - Menu data (including stock status) cached after first successful fetch. Browser storage (localStorage/IndexedDB) used for persistence. Stock status may be stale offline; user is informed via "Using cached menu" banner
- **Network resilience** - Expected use case: office workers transitioning between unstable WiFi zones (building entrances, ground floor). Cache enables browsing; checkout explicitly blocked offline to prevent order confusion
- **Image lazy loading** - Products load initially with low-res placeholder (400px); high-res (1200px) loads as user scrolls near card. CDN serves images with caching headers
- **Mobile modal pattern** - Full-screen Order Summary modal on mobile mirrors The Coffee House app UX. Desktop version centers modal for accessibility and visual hierarchy
- **Accessibility standards** - WCAG 2.1 AA compliance target. Keyboard navigation (Tab/Escape), screen reader support (aria-labels), form labels required on all interactive elements

---

## Design References

- **Premium Aesthetic**: Align sidebar and product cards with The Coffee House design (minimalist, high-quality imagery, professional typography)
- **Constitution II**: Every pixel reflects craftsmanship. No lazy UI elements.
- **Constitution III**: Main Menu is the "Browse" screen. Target: <15 seconds to view products and add first item
- **Constitution IV**: Customization modal design unchanged from core principle (Size/Sugar/Ice pickers with modular design)
