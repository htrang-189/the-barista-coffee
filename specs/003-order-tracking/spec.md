# Feature Specification: Order Status Page

**Feature Branch**: `003-order-tracking`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: Create a detailed specification for the 'Order Status Page' with real-time tracking (4-stage progress bar), order summary review (items/total/Driver Note), Call Shop button for support, premium aesthetic (The Coffee House style), Order ID URL tracking for guest users

---

## Clarifications & Specifications

### Integration Point

- **Dependency**: Order Status Page receives order_id and order_status from Checkout Page upon successful order submission. Also accepts status from Order Supply backend (status polling or real-time updates)
- **Status Stages**: 4 distinct stages mapped to business operations: (1) Received (order confirmed, in queue), (2) Preparing (kitchen preparing items), (3) Out for Delivery (driver assigned, on way), (4) Completed (delivered to customer)
- **Guest Tracking**: Users access Order Status Page via URL (e.g., `/order/[order_id]`) without authentication. Order ID from Checkout is the sole identifier for guest tracking
- **Driver Note Display**: Driver Note provided at checkout is displayed on this page to reassure users their special instructions were received (e.g., "Leave at 🏢 reception", "Call when arriving 🛵")
- **Constitution**: Principle II (Premium Aesthetic - minimalist The Coffee House style), Principle III (Rapid Flow - instant page load, real-time updates), Principle VI (Driver Note Clarity - visible confirmation)

### Edge Cases

- **Invalid Order ID**: User enters non-existent order ID in URL → display "Order not found" message + "Return to Home" button
- **Order Completion**: User views already completed order → show "Completed" stage filled, display "Order Complete" message, show re-order button
- **Network loss during tracking**: User loses connection while viewing status → display last known status with "Offline" badge; auto-refresh when connection restored
- **Long driver notes**: Driver Note with 500 characters or emojis → display in modal or expandable section (avoid text truncation)
- **Real-time update missing**: Server doesn't send status update → display current status with "Last updated: [time]" + manual refresh button
- **Status timing**: User refreshes page immediately after submission → might still show "Received" before other stages available; expected behavior

---

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View Real-time Order Progress (Priority: P1)

User navigates to Order Status Page and sees a visual progress bar with 4 stages. The progress bar shows current order status (Received, Preparing, Out for Delivery, or Completed). As the order progresses through each stage, the progress bar updates visually to reflect the current status. User can see which stage is currently active and which stages are completed.

**Why this priority**: Core feature of order tracking. Users MUST see order progress to understand when their delivery will arrive. Without this, users feel disconnected from their order and cannot plan for delivery

**Independent Test**: Can be fully tested by loading page with different order statuses (Received/Preparing/Delivering/Completed) and verifying progress bar renders correctly for each stage. Delivers core tracking value independently.

**Acceptance Scenarios**:

1. **Given** user accesses Order Status Page for a new order, **When** page loads, **Then** a progress bar displays with 4 stages: (1) Received (filled/active), (2) Preparing (empty), (3) Out for Delivery (empty), (4) Completed (empty)
2. **Given** order status is "Received" (just submitted), **When** user views page, **Then** first stage is highlighted/filled and label shows "Order Received" with timestamp
3. **Given** order status changes to "Preparing", **When** user refreshes or page auto-updates, **Then** progress bar updates: Received (filled), Preparing (filled/active), Out for Delivery (empty), Completed (empty)
4. **Given** order progresses through all 4 stages, **When** order is "Completed", **Then** all stages are filled and "Order Completed" message displays with checkmark
5. **Given** user views page, **When** current stage renders, **Then** stage label shows estimated time or activity (e.g., "Preparing: Usually 15-20 min")

---

### User Story 2 - Review Order Summary with Driver Note (Priority: P1)

User views their original order on the Order Status Page: all items ordered (with quantities and customizations), total price, and the Driver Note they provided at checkout. Driver Note displays prominently to reassure user that special instructions (e.g., "Leave at reception") were received and will be communicated to the driver.

**Why this priority**: Users need reassurance that their order details and delivery instructions are correct. Displaying Driver Note fulfills Constitution VI (Driver Note Clarity) and reduces call volume. Core feature without which order tracking is incomplete.

**Independent Test**: Can be fully tested by displaying an order with 2-3 items, customizations, and Driver Note; verifying all details render correctly and Driver Note is visible. Delivers reassurance value independently.

**Acceptance Scenarios**:

1. **Given** Order Status Page loads with order data, **When** page renders, **Then** order summary section displays: "Order #[order_id]" header, list of items (product name, quantity, customizations), total price prominently shown
2. **Given** order contains customizations, **When** user views order summary, **Then** customization details display clearly (e.g., "Medium, 50% Sugar, Regular Ice")
3. **Given** user provided a Driver Note at checkout, **When** Order Status Page displays, **Then** Driver Note appears in dedicated section with label "Special Instructions for Driver" and full user text (including emojis: 🛵, 🏢, 🏪)
4. **Given** Driver Note is very long (300+ chars) or multi-line, **When** displayed, **Then** text is readable without truncation; use expandable section or modal if needed
5. **Given** user views order, **When** all details render, **Then** layout is clean, minimalist (The Coffee House aesthetic) with generous whitespace

---

### User Story 3 - Call Shop for Support (Priority: P1)

User encounters a question or issue with their order. They click a prominent "Call Shop" button on the Order Status Page, which triggers a phone call to the shop. In-app or browser phone integration initiates the call with a single tap, providing instant customer support without interrupting order tracking.

**Why this priority**: Constitution specifies no live chat; phone is the fallback support method. Users must be able to reach shop immediately if order has issues. This is critical for customer satisfaction and unblocks order fulfillment concerns.

**Independent Test**: Can be fully tested by rendering the "Call Shop" button, verifying it initiates a phone call/system dial, and confirming no friction in reaching support. Delivers support access independently.

**Acceptance Scenarios**:

1. **Given** user is viewing Order Status Page, **When** page renders, **Then** a prominent "Call Shop" button is visible at the bottom of the page (or sticky footer)
2. **Given** "Call Shop" button is displayed, **When** user clicks it, **Then** system initiates phone call using tel:// protocol (e.g., tel:+84-2-xxxx-xxxx) to shop phone number
3. **Given** phone call is initiated, **When** user's phone app opens, **Then** call is ready to dial with one more tap; shop phone number is visible
4. **Given** user is on mobile, **When** "Call Shop" button is clicked, **Then** call dials immediately (native phone integration)
5. **Given** user has questions during order tracking, **When** they click "Call Shop", **Then** they can talk to shop staff about order status or special requests

---

### User Story 4 - Access Order via URL Order ID (Priority: P2)

User receives an order confirmation SMS/email with a link to track their order (e.g., `app.domain.com/order/abc-123-def`). They click the link and are taken directly to the Order Status Page for that order. No login required (guest access). User ID is extracted from URL parameter and used to fetch order details from backend.

**Why this priority**: Enables guest tracking without authentication (Constitution I). Users can share tracking link with others or revisit from email/SMS. Reduces friction for first-time users. Important but not blocking if page loads correctly with injected order_id (P2).

**Independent Test**: Can be fully tested by clicking links with different order IDs, verifying correct order loads, and confirming no authentication barrier exists. Delivers guest access value independently.

**Acceptance Scenarios**:

1. **Given** user receives SMS/email with order tracking link, **When** they click link (e.g., `/order/abc-123`), **Then** Order Status Page loads with that specific order's data
2. **Given** user accesses order page via URL, **When** page loads, **Then** order ID is extracted from URL and used to fetch order data from backend API
3. **Given** order ID is valid, **When** user's page loads, **Then** order summary + status display correctly; no authentication required
4. **Given** user visits order page URL, **When** page renders, **Then** Order ID displays subtly in header/footer (e.g., "Order #abc-123") for reference
5. **Given** user shares order tracking URL with friend, **When** friend clicks link, **Then** they can also view order status (guest sharing enabled)

---

### User Story 5 - Real-time Status Updates (Priority: P2)

User views Order Status Page and status automatically updates without user refresh. As kitchen/driver updates order status in backend, page receives and reflects changes in real-time (or near real-time). Progress bar and timestamps update to show latest order state. User feels connected to order progress.

**Why this priority**: Enhances order tracking experience; prevents user from manually refreshing. Real-time updates satisfy Constitution III (Rapid Flow) by eliminating manual checks. Important but not blocking if manual refresh available (P2).

**Independent Test**: Can be fully tested by simulating backend status changes and verifying page updates automatically; users see progress without refresh. Delivers enhanced UX independently.

**Acceptance Scenarios**:

1. **Given** user is viewing Order Status Page, **When** backend updates order status, **Then** page receives update and progress bar refreshes automatically (via polling, WebSocket, or Server-Sent Events)
2. **Given** order transitions from "Preparing" to "Out for Delivery", **When** status change occurs, **Then** page updates within 5 seconds to show new stage highlighted
3. **Given** page is displaying outdated status, **When** real-time update arrives, **Then** progress bar animates transition, user sees new status, timestamps update
4. **Given** user views page for 5+ minutes, **When** order progresses, **Then** automatic updates keep page in sync without manual refresh
5. **Given** page updates, **When** user sees new status, **Then** visual feedback (animation, sound notification optional) indicates change occurred

---

### User Story 6 - Re-order from Completed Order (Priority: P3)

User has received their order and views completed Order Status Page. A "Re-order" button is visible. Clicking it pre-populates a new order with the same items from previous order (same customizations, quantities). User can quickly order again without re-selecting everything. Checkout form is pre-filled with saved customer details (if 90-day cache available).

**Why this priority**: Improves repeat order experience; reduces friction for regular customers. Important for retention but not blocking initial MVP (P3).

**Independent Test**: Can be fully tested by rendering "Re-order" button on completed orders, clicking it, and verifying new order form pre-populates with correct items. Delivers repeat order UX independently.

**Acceptance Scenarios**:

1. **Given** order status is "Completed", **When** User views Order Status Page, **Then** a "Re-order" button appears (in addition to "Call Shop")
2. **Given** user clicks "Re-order" button, **When** action triggers, **Then** new order is created with same items/quantities/customizations from previous order
3. **Given** new order is created, **When** user is taken to Checkout Page, **Then** order items are pre-populated and Checkout form has saved customer details (Name/Phone/Address)
4. **Given** user reviews pre-filled order, **When** they can edit items/form before submitting, **Then** they can modify quantities or customizations as needed
5. **Given** re-order is submitted, **When** new order confirmation displays, **Then** new order ID shows and tracking begins

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST extract Order ID from URL parameter (e.g., `/order/:order_id`) and load order details from backend without user authentication
- **FR-002**: System MUST display a visual 4-stage progress bar showing order status: (1) Received, (2) Preparing, (3) Out for Delivery, (4) Completed
- **FR-003**: System MUST show current active stage highlighted/filled, with previous stages filled and future stages empty
- **FR-003a**: System MUST display stage label with estimated time or activity description (e.g., "Preparing: Usually 15-20 min")
- **FR-004**: System MUST display complete order summary showing: Order ID, all items (name, quantity, customizations), total price, and timestamps
- **FR-005**: System MUST display Driver Note prominently with label "Special Instructions for Driver" showing exact user text (including emojis: 🛵, 🏢, 🏪)
- **FR-005a**: System MUST not truncate Driver Note; use expandable section or modal if text exceeds 300 characters
- **FR-006**: System MUST show a prominent "Call Shop" button enabling phone call initiation (tel:// protocol) to shop support number
- **FR-007**: System MUST support real-time or near real-time status updates (polling/WebSocket/Server-Sent Events) reflecting backend order status changes
- **FR-008**: System MUST display "Order not found" message + "Return to Home" button if invalid Order ID provided in URL
- **FR-009**: System MUST show "Order Complete" message when status is "Completed"; display "Re-order" button alongside "Call Shop"
- **FR-010**: System MUST auto-refresh page on network reconnection if user lost connection during order tracking (display "Offline" badge while disconnected)
- **FR-011**: System MUST display "Last updated: [time]" and "Refresh" button if real-time update is delayed or failed
- **FR-012**: System MUST implement premium minimalist design aligned with The Coffee House aesthetic (clean whitespace, professional typography, muted color palette)
- **FR-013**: System MUST be fully responsive on mobile (<320px - 768px) with no horizontal scroll; progress bar and order summary stack vertically
- **FR-014**: System MUST support sharing Order Status URL with others (guest access enabled; no authentication barrier)
- **FR-015**: System MUST implement security: order data accessed only if Order ID matches request; prevent unauthorized order viewing (basic access control)

### Key Entities

- **Order**: Represents a submitted order. Attributes: order_id (unique identifier in URL), items[], customizations per item, total_price, payment_method (COD), customer_name, phone, delivery_address, driver_note, order_status (Received/Preparing/OutForDelivery/Completed), timestamps (created_at, status_updated_at, estimated_delivery_time)
- **OrderItem**: Individual item in order. Attributes: product_id, product_name, quantity, price_per_unit, size, sugar_level, ice_level
- **OrderStatus**: Enum of 4 stages. Values: Received (order confirmed), Preparing (kitchen working), OutForDelivery (driver assigned, in transit), Completed (delivered)
- **TrackingSession**: Guest session for URL-based tracking. Attributes: order_id, session_id, created_at, expires_at (30 days for tracking window)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Order Status Page loads within 2 seconds on 4G/LTE connection (Constitution III: rapid load)
- **SC-002**: Progress bar accurately reflects all 4 stages (Received/Preparing/Out for Delivery/Completed); 100% stage accuracy
- **SC-003**: Status updates display within 5 seconds of backend change (real-time responsiveness target)
- **SC-004**: Order summary displays all items, customizations, and Driver Note correctly with 100% data accuracy
- **SC-005**: Driver Note with emojis (🛵, 🏢, 🏪) renders correctly and preserves formatting (100% emoji preservation)
- **SC-006**: Invalid Order ID handled gracefully: "Order not found" displays + "Return to Home" button available immediately
- **SC-007**: "Call Shop" button initiates phone call on first click; no friction or delays in reaching support
- **SC-008**: Page remains responsive on mobile (320px-768px) with no horizontal scroll; all elements stack vertically
- **SC-009**: Guest URL sharing works: 100% of shared links load correct order for recipients (no authentication barrier)
- **SC-010**: Network disconnection detected; "Offline" badge displays; page auto-refreshes on reconnection (mobile resilience)
- **SC-011**: Order tracking window supports 30-day access to order via URL (guest access security window)
- **SC-012**: Page supports keyboard navigation (Tab/Arrow/Enter) and screen reader access (WCAG 2.1 AA compliance)
- **SC-013**: Real-time update failure falls back to manual refresh option ("Last updated" + "Refresh" button works)
- **SC-014**: Re-order button and "Order Complete" message appear only when status is "Completed" (state accuracy)
- **SC-015**: Premium minimalist design implemented: clean whitespace, professional typography, muted color palette (Constitution II aesthetic)

---

## Assumptions *(fill out based on reasonable defaults)*

- **Order data available in backend**: Assumes backend order service provides complete order details (items, customizations, status) for given order_id
- **Order ID globally unique**: Assumes order_id is unique identifier sufficient for guest lookup (no additional user context required)
- **4-stage status model final**: Assumes 4-stage model (Received/Preparing/OutForDelivery/Completed) is definitive; additional status stages not expected pre-v2
- **Guest 30-day tracking**: Assumes 30-day tracking window is acceptable security window for guest URL access; longer retention not required
- **Call Shop phone number static**: Assumes Call Shop phone number is fixed per shop/business; does not require dynamic phone routing
- **Real-time update optional**: Assumes real-time updates via polling/WebSocket are enhancement (P2); manual refresh suffices for MVP if real-time unavailable
- **No additional authentication**: Assumes guest-only access model is correct; user authentication not req'd (Constitution I: Zero Auth)
- **Driver Note Unicode already supported**: Assumes backend can store/return full Unicode including emojis; no sanitization beyond HTML escaping needed
- **Mobile-first responsive**: Assumes 320px-768px is primary device range; desktop >768px scaling handled by CSS (not primary focus)
- **Order Status Page on separate URL**: Assumes page is at `/order/:order_id` path; Checkout redirect to this URL on successful submission
- **Constitution principles locked**: Assumes all 6 Constitution principles (from v1.1.0) apply to this feature; further principle changes not expected pre-v2
- **COD payment only**: Assumes Order Status Page shows COD payment method only; no payment status/receipt updates expected pre-v2

---

## Design References & Constitution Alignment

- **Constitution II (Premium Aesthetic)**: Order Status Page maintains minimalist design aligned with The Coffee House reference. Clean whitespace, professional typography, generous margins on mobile. Progress bar is visual anchor (no busy or cluttered layouts).
- **Constitution III (Rapid Flow)**: Page load <2 seconds, status updates <5 seconds. Real-time updates prevent repeated manual refreshes. No friction in reaching support (Call Shop button single tap).
- **Constitution I (Zero Auth)**: Guest URL access without sign-up. Users access via order_id link from SMS/email. No account creation barrier to tracking.
- **Constitution VI (Driver Note Clarity)**: Driver Note displays prominently with label "Special Instructions for Driver". Full emoji/text preservation confirms user's instructions were received, reducing support calls.
- **The Coffee House Reference**: Minimalist aesthetic applied to progress bar (subtle animations, clean visual hierarchy), order summary (spacious layout), call button (prominent but not aggressive). Typography professional, colors muted (grays/beiges/soft accent colors).

---

## Integration Points

- **Previous Feature**: Checkout Page submits order_id + status="Received" after successful payment. Redirects to Order Status Page at `/order/[order_id]`
- **Backend Dependency**: Order Status Page fetches order details via `/api/orders/:order_id` GET endpoint. Requires order object with all item details, customizations, driver_note, current status
- **Real-time Updates**: Optional connection to order status feed (polling `/api/orders/:order_id` every 3-5 sec, OR WebSocket subscription to status channel). Priority: status updates within 5 seconds of kitchen/backend change
- **Support Integration**: "Call Shop" button uses tel:// protocol to system phone dialer. Requires shop phone number configuration in app environment
- **Re-order Integration**: "Re-order" button triggers navigation to Main Menu Page with pre-filled cart (same items/customizations from previous order). Requires cart state management from Order Status context
