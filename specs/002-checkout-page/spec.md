# Feature Specification: Checkout Page

**Feature Branch**: `002-checkout-page`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: Create a detailed specification for the 'Checkout Page' with order summary, customer details form (Name, Phone, Address, Driver Note), and COD payment

---

## Clarifications & Specifications

### Session 2026-04-05 (Edge Cases & Security)

- **Empty Cart**: Display "Your cart is empty" message + "Go to Menu" button (user navigated to checkout with empty cart)
- **Phone Validation**: Strictly validate Vietnamese phone formats only (10 digits starting with 0 or +84 country code). Critical for COD delivery accuracy
- **Long Addresses & Emojis**: Support up to 500 characters in Delivery Address + Driver Note. Driver Note MUST support emoji characters (e.g., 🛵, 🏢, 🏪) for office workers describing locations creatively
- **Duplicate Submission**: CRITICAL - Disable "Place Order" button immediately on first click to prevent double orders (common mobile UX issue)
- **Network Loading**: Display premium loading spinner during submission. If submission fails, preserve ALL form data (Name/Phone/Address/Driver Note) so user doesn't re-type on mobile
- **Security & Data Integrity**: Use HTML escaping for Driver Note (prevent XSS/malicious code) while preserving exact user text (including emojis, special chars, accents)

### Integration Point

- **Dependency**: Checkout Page receives order data from Main Menu Page (Order Summary modal trigger). Order state includes: items[], customizations (size/sugar/ice per item), quantities, calculated total
- **Next**: After "Place Order" submitted, user redirects to Order Status Page (separate feature, will receive order_id + status tracking)
- **Payment**: COD only (no payment gateway integration). Order confirmation is immediate post-submission
- **Constitution**: Principle V (COD Simplicity), Principle II (Premium Aesthetic), Principle III (Rapid Flow <15 sec), Principle VI (Driver Note)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Order Summary with Customizations (Priority: P1)

User opens Checkout Page and sees a complete summary of their order: each drink listed with quantity, customization details (Size, Sugar Level, Ice Level), individual price, and line subtotal. They verify the order is correct before proceeding to payment.

**Why this priority**: Core checkout feature. Users MUST see what they're ordering before paying. Without clear order review, checkout lacks trust and increases abandonment.

**Independent Test**: Can be fully tested by displaying order summary, verifying all customizations render correctly, and confirming price calculations. Delivers P1 value independently.

**Acceptance Scenarios**:

1. **Given** the Checkout Page loads with order data from Main Menu, **When** page renders, **Then** all order items display in a scrollable list showing: product name, quantity (e.g., "x2"), customization details (e.g., "Medium, 50% Sugar, Regular Ice"), unit price, and line subtotal
2. **Given** order items are displayed, **When** user reviews the list, **Then** total order price is prominently shown at the bottom: "Order Total: [amount]đ"
3. **Given** an item has multiple customizations, **When** the item is displayed, **Then** customization details appear in a readable format (not truncated; multi-line acceptable for clarity)
4. **Given** order contains 0 items (edge case), **When** page loads, **Then** display: "Your cart is empty" + "Go to Menu" button

---

### User Story 2 - Fill Checkout Form with Customer Details (Priority: P1)

User enters their customer information in a 4-field form: Name, Phone Number, Delivery Address, and Driver Note. Form auto-validates as user types (shows error messages for invalid inputs). User can proceed to COD payment confirmation once form is valid.

**Why this priority**: Without customer details, order cannot be fulfilled. Form filling is the core checkout action blocking payment.

**Independent Test**: Can be tested by filling form fields, verifying validation (required fields, phone format, etc.), and confirming submit button state changes. Delivers P1 independently.

**Acceptance Scenarios**:

1. **Given** Checkout Page displays, **When** form section renders, **Then** the form shows 4 fields: (1) Customer Name (text input), (2) Phone Number (tel input), (3) Delivery Address (textarea), (4) Driver Note (textarea)
2. **Given** form fields are visible, **When** user focuses on each field, **Then** a label appears above field (e.g., "Customer Name", "Phone Number") and placeholder text is present (e.g., "Enter your full name")
3. **Given** user enters invalid phone number (e.g., "abc" or too few digits), **When** they blur field or attempt to submit, **Then** error message displays: "Please enter a valid phone number (10 digits minimum)"
4. **Given** user leaves a required field blank and attempts to submit, **When** they click "Place Order" button, **Then** error toast displays: "Please fill in all required fields" and form stays on page
5. **Given** all required fields are filled correctly, **When** user reviews form, **Then** "Place Order" button is enabled (not grayed out) and ready to click
6. **Given** form is completed, **When** user clicks "Place Order" button, **Then** order is submitted to backend for processing

---

### User Story 3 - Complete Order via Cash-on-Delivery (Priority: P1)

User clicks "Place Order" button after filling checkout form. System submits order (with order summary + customer details + Driver Note) for COD payment. User receives confirmation and is redirected to Order Status Page to track delivery.

**Why this priority**: Core payment flow. Without successful order submission, checkout is incomplete. This unblocks order fulfillment pipeline.

**Independent Test**: Can be tested by filling form, clicking "Place Order", and verifying redirect to Order Status Page with order confirmation. Delivers P1 independently.

**Acceptance Scenarios**:

1. **Given** Checkout form is complete and valid, **When** user clicks "Place Order" button, **Then** button is disabled immediately and remains disabled during submission; loading spinner displays with message "Processing your order..."
2. **Given** order is being submitted, **When** submission succeeds within 3 seconds, **Then** user sees success message: "Order Confirmed! Order ID: [order_id]" + order total
3. **Given** order submission is successful, **When** message displays, **Then** user is automatically redirected to Order Status Page (showing Received status) after 2 seconds OR clicking "View Order Status" button
4. **Given** order is submitted, **When** backend processes order, **Then** order includes: items summary, customizations, customer name/phone/address, driver note (with emojis/special characters preserved), total price, payment method (COD), timestamp
5. **Given** submission fails (network error), **When** error occurs, **Then** "Place Order" button is re-enabled and error message displays: "Order submission failed. Please try again" + "Retry" button; all form data preserved

---

### User Story 4 - Edit Order Before Checkout (Priority: P2)

User realizes they want to modify the order (reduce quantity of an item, remove an item entirely) before submitting. They can edit order from Checkout Page without returning to Main Menu. Changes update total price immediately.

**Why this priority**: UX enhancement. Core flow works without this (user returns to Main Menu to edit). This reduces friction for last-minute changes and improves conversion.

**Independent Test**: Can be tested by modifying item quantity, removing items, verifying total updates. Not blocking checkout but adds significant value.

**Acceptance Scenarios**:

1. **Given** an order item is displayed, **When** user hovers over item, **Then** edit controls appear: "-" button (reduce quantity), quantity display, "+" button (increase quantity), and "Remove" button (trash icon)
2. **Given** user clicks "-" button on an item with quantity 2, **When** it reduces to quantity 1, **Then** order total updates immediately to reflect new subtotal
3. **Given** user clicks "Remove" button on an item, **When** item is deleted, **Then** item disappears from order list and total price updates
4. **Given** all items are removed from order, **When** order becomes empty, **Then** display: "Your cart is empty" + "Go to Menu" button
5. **Given** user edits order, **When** any change is made, **Then** success toast displays: "Order updated" (brief, non-intrusive)

---

### User Story 5 - Driver Note Confirms Delivery Instructions (Priority: P1)

User fills in the Driver Note field with specific delivery instructions (e.g., "Leave at reception", "Call on arrival", "3rd floor east wing"). Driver Note is prominently displayed in checkout form and is included in the order submitted to driver/kitchen.

**Why this priority**: Constitution VI (Driver Note for Delivery Clarity) is mandatory. Driver Note directly impacts delivery success for office workers. Without clear submission confirmation, users worry instructions weren't saved.

**Independent Test**: Can be tested by entering driver note, verifying it displays in order summary before submission, and confirming it's in submitted order data. Delivers P1 independently.

**Acceptance Scenarios**:

1. **Given** Checkout form displays, **When** Driver Note field appears, **Then** field has label: "Delivery Instructions (Optional)" and placeholder: "e.g., 'Leave at reception' or 'Call on arrival' or use emojis: 🛵, 🏢, 🏪"
2. **Given** user enters Driver Note text with emoji characters, **When** they review the checkout form, **Then** the driver note text and emojis appear exactly as typed (no emoji corruption or display errors)
3. **Given** form is submitted with Driver Note (including emojis/special chars), **When** order is placed, **Then** driver note is included in order details visible on Order Status Page: "Driver Note: [user's note exactly as typed]" with emojis/accents preserved
4. **Given** driver note is not filled (optional), **When** user submits order, **Then** order is still accepted and submitted normally; backend handles empty driver note gracefully

---

### User Story 6 - Save Delivery Info for Next Order (Priority: P3)

User has option to save their delivery address (Name, Phone, Address) to browser local storage for pre-filling on next visit. Checkbox: "Save for next time". On next visit, if cached, auto-populate form fields with previous info (user can edit).

**Why this priority**: Enhancement. Improves repeat customer experience. Core checkout works without this. Not blocking for v1 but valuable for retention.

**Independent Test**: Can be tested by saving form data, clearing browser storage, returning to checkout, and verifying auto-fill. P3 feature, independently testable but deferred functionality.

**Acceptance Scenarios**:

1. **Given** Checkout form is completed, **When** user sees "Save for next time" checkbox below form, **Then** checkbox is unchecked by default
2. **Given** user checks "Save for next time" checkbox, **When** they click "Place Order", **Then** form data (Name, Phone, Address) is stored in browser localStorage with a 90-day expiry
3. **Given** user returns to Checkout Page within 90 days, **When** page loads, **Then** previously saved Name/Phone/Address fields are auto-populated (but can be edited/cleared)
4. **Given** saved data expires or user clears browser cache, **When** page loads, **Then** form fields are empty (no error; graceful fallback)

---

### Edge Cases

- **No items in order**: Display "Your cart is empty" message + "Go to Menu" button. User navigated to checkout with empty cart (edge navigation scenario)
- **Invalid phone number formats**: STRICT Vietnamese validation ONLY: accept 10 digits starting with 0 (e.g., 0912345678) OR +84 country code format (e.g., +84912345678). Reject any other formats immediately with error: "Phone must be a valid Vietnamese number (10 digits or +84 format)". Critical for COD delivery accuracy
- **Very long delivery address**: Support addresses up to 500 characters. Textarea auto-expands; no truncation. Display full address in order review
- **Driver Note with emojis**: Driver Note field MUST accept emoji characters (🛵 delivery bike, 🏢 office building, 🏪 shop, etc.) to allow office workers to describe locations creatively. Support Unicode characters, accents, special symbols. Preserve exact user text (no sanitization beyond HTML escaping)
- **Duplicate rapid "Place Order" clicks**: Button MUST be disabled immediately after first click; ignore all subsequent clicks during submission. No double orders. Button re-enables ONLY on error (user can retry)
- **Long network latency (>5 seconds)**: Display premium loading spinner (animated, minimalist design aligned with The Coffee House aesthetic) explaining "Processing your order..." If submission >10 seconds, show "Taking longer than expected. Please wait or try again"
- **Network failure on order submission**: Preserve ALL form data (Name, Phone, Address, Driver Note). Show error message: "Order submission failed. Please try again". User clicks "Retry" without re-entering data (mobile friction reduction critical)
- **Driver Note with special characters**: Accept all characters: emojis, accents (é, ă, ơ, ư, etc.), punctuation, symbols. HTML escape for storage/security but display exactly as user typed (preserve emojis, formatting)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a complete order summary section at the top of Checkout Page showing: all items with quantities, customization details (Size/Sugar/Ice per item), unit prices, line subtotals, and total order price (prominently)
- **FR-001a**: System MUST display order items in a scrollable list if order contains 5+ items (keeps form visible below)
- **FR-002**: System MUST display a 4-field customer details form: (1) Customer Name (text input), (2) Phone Number (tel input), (3) Delivery Address (textarea), (4) Driver Note (textarea)
- **FR-002a**: System MUST show labels and placeholder text for each form field to guide user input
- **FR-002b**: System MUST validate fields as user types or on blur with these specific rules: Name (required, min 2 characters), Phone (STRICTLY Vietnamese format ONLY: 10 digits starting with 0 OR +84 country code; reject all other formats), Address (required, min 10 characters, max 500 chars), Driver Note (optional, max 500 characters, MUST support emoji/Unicode/accents)
- **FR-002c**: System MUST display inline error messages for invalid fields: "Please enter a valid [field name]" or specific validation. For phone errors specifically: "Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)"
- **FR-002d**: System MUST support emoji characters in Driver Note field (e.g., 🛵, 🏢, 🏪) and preserve them exactly in submitted order data
- **FR-003**: System MUST show "Place Order" button below form; button is disabled until all required fields are valid
- **FR-003a**: System MUST disable "Place Order" button IMMEDIATELY on first click and keep it disabled during entire submission (prevents duplicate orders from rapid clicks). Button re-enables ONLY if submission fails (user can retry)
- **FR-003b**: System MUST display a premium minimalist loading spinner during order submission (animated, aligned with The Coffee House aesthetic). Spinner shows message: "Processing your order..."
- **FR-003c**: System MUST display extended loading message if submission takes >10 seconds: "Taking longer than expected. Please wait or try again" with "Retry" button available
- **FR-003d**: System MUST show success message after order submission: "Order Confirmed! Order ID: [order_id]. Total: [amount]đ"
- **FR-004**: System MUST redirect user to Order Status Page after successful order submission (after 2 seconds or on "View Order Status" link click)
- **FR-004a**: System MUST pass order_id and order_status="Received" to Order Status Page for initialization
- **FR-005**: System MUST include Driver Note in submitted order (visible on Order Status Page and passed to driver)
- **FR-006**: System MUST support order editing from Checkout Page: reduce/increase item quantity, remove items. All changes update total price in real-time
- **FR-007**: System MUST handle empty order state (0 items): display "Your cart is empty" message + "Go to Menu" button
- **FR-008**: System MUST implement STRICT Vietnamese phone number validation: accept ONLY 10 digits starting with 0 (e.g., 0912345678) OR +84 country code format (e.g., +84912345678). Reject all other formats. Error message: "Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)"
- **FR-009**: System MUST support "Save for next time" checkbox to cache Name/Phone/Address to browser localStorage (90-day expiry)
- **FR-010**: System MUST auto-populate cached form data on return visit (within 90 days); user can edit/clear fields
- **FR-011**: System MUST prevent duplicate order submissions (disable button during request; ignore rapid consecutive clicks)
- **FR-012**: System MUST handle network failures gracefully: show error message + "Retry" button; PRESERVE ALL form data (Name, Phone, Address, Driver Note). User should NOT re-type on mobile—critical friction reduction
- **FR-012a**: System MUST log network errors for debugging but display user-friendly message: "Order submission failed. Please try again"
- **FR-013**: System MUST implement security: HTML escape Driver Note field to prevent XSS/malicious code while preserving exact user text (emojis, accents, special characters remain intact). Escaped on storage, unescaped on display
- **FR-014**: System MUST support COD payment only (no credit card / payment gateway integration); payment method is fixed/immutable in order data
- **FR-015**: System MUST display premium minimalist form design aligned with The Coffee House aesthetic (clean whitespace, professional typography, muted color palette)

### Key Entities

- **Order**: Complete order object passed from Main Menu. Attributes: items[], total_price, created_at, status (draft→submitted)
- **OrderItem**: Individual drink in order. Attributes: product_id, product_name, quantity, price_per_unit, size, sugar_level, ice_level, line_total
- **CheckoutForm**: Customer details collected on Checkout Page. Attributes: customer_name, phone_number, delivery_address, driver_note, payment_method (COD)
- **SubmittedOrder**: Final order record created after checkout submission. Attributes: order_id, customer_name, phone, address, driver_note, items[], total_price, payment_method, timestamp, status (Received/Preparing/Delivering/Completed)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can review order summary and complete checkout form within 2 minutes (Constitution III: rapid checkout <15 sec per screen)
- **SC-002**: Form validation occurs instantly (<100ms) as user types; no noticeable lag
- **SC-003**: Order submission completes within 3 seconds on 4G/LTE connectivity (including redirect to Order Status Page)
- **SC-004**: 99% of valid orders submit successfully on first attempt (duplicate submission prevention effective)
- **SC-005**: 100% of submitted orders include Driver Note field with correct user-entered text (no data loss/truncation)
- **SC-006**: Phone number validation correctly accepts Vietnamese formats (95%+ of valid phone numbers pass; <5% false negatives)
- **SC-007**: Form field validation shows error messages for 100% of invalid inputs before submission (prevents bad data)
- **SC-008**: Checkout Page remains responsive on mobile (<320px - 768px widths); form fills vertically with no horizontal scroll
- **SC-009**: Order editing (quantity/remove) updates total price in real-time with zero calculation errors (100% accuracy)
- **SC-010**: Cached form data (90-day expiry) is correctly stored/retrieved for repeat customers; reduces form-fill time by 50%+
- **SC-011**: Network failure recovery works: user can retry order submission with form data intact (no data loss on error)
- **SC-012**: Vietnamese phone validation is STRICT: rejects non-Vietnamese formats (99.9% accuracy); accepts all valid VN formats starting with 0 or +84
- **SC-013**: Duplicate submission prevention effective: "Place Order" button disabled immediately on first click; no double orders recorded (100% prevention)
- **SC-014**: Driver Note field correctly renders emoji characters (🛵, 🏢, 🏪, etc.) and preserves them through submission/storage/display cycle
- **SC-015**: HTML escaping prevents XSS attacks (100% security) while preserving user text, emojis, accents exactly as typed

---

## Assumptions

- **Order data passed from Main Menu**: Checkout Page receives complete order object (items, customizations, total) from previous page/modal. No data refetch required
- **Backend order API available**: System assumes `/api/orders/submit` endpoint exists for order submission; handles response with order_id + confirmation
- **Vietnamese phone validation STRICT**: Phone validation accepts ONLY Vietnamese formats (10 digits starting with 0 or +84). NO international numbers. Critical for COD delivery accuracy. This is a hard constraint
- **Emoji & Unicode support**: Driver Note field must render emojis, accents, special characters correctly. Backend must preserve these in order data
- **Real-time validation acceptable**: Form validation as-you-type deemed better than submit-then-validate UX. No async API calls during validation (only local rules)
- **Order Status Page exists**: Checkout submits order_id; Order Status Page will be separate feature (referenced but not implemented in v1)
- **localStorage available**: Browser storage for "Save for next time" feature. Graceful fallback if localStorage unavailable (feature just doesn't save)
- **HTML escaping implemented**: Driver Note HTML escaped on storage (prevent XSS) but unescaped on display (preserve user text/emojis). Security library (e.g., DOMPurify) recommended
- **Premium loading spinner design**: Spinner asset/animation provided by design system (consistent with The Coffee House minimalist aesthetic). SVG-based recommended
- **Guest checkout only**: No user authentication at checkout (Constitution I: Zero Auth). Session-based order cart sufficient for v1
- **Constitution V (COD) immutable**: Payment method cannot be changed at checkout; users accept COD when ordering. Alternate payment methods out of v1 scope
- **Button disc logic**: Once "Place Order" clicked, button disabled immediately and stays disabled until submission completes (success or error). On error, button re-enables for retry

---

## Design References & Constitution Alignment

- **Constitution II (Premium Aesthetic)**: Checkout form maintains minimalist design with generous whitespace, clean typography, muted color palette (aligns with The Coffee House reference). No aggressive upselling or jargon
- **Constitution III (Rapid Flow)**: Checkout is final screen in order flow. <15 seconds to review + fill + submit. Order editing (Story 4) adds friction; placed as P2 enhancement to keep critical path minimal
- **Constitution V (COD Simplicity)**: Only payment method available. No payment form, card entry, or gateway. Immediate confirmation after submission
- **Constitution VI (Driver Note Clarity)**: Driver Note mandatory field ensures delivery success for office workers. Prominently captured and displayed in order confirmation

---

## Integration Points

- **Previous Feature**: Main Menu Page (Order Summary modal) passes order object to Checkout Page on modal close/submit
- **Next Feature**: Order Status Page receives order_id + initial status (Received) after successful checkout submission
- **Backend API**: `/api/orders/submit` endpoint expects request body with: items[], customer details, driver_note, payment_method. Returns: order_id, confirmation_message, redirect_url
- **Storage**: localStorage for optional form caching (90-day expiry); sessionStorage for current order data during checkout session

---

## Next Steps

1. **Specification Validation**: Run quality checklist to verify all sections complete and testable
2. **Design Phase**: Create Figma mockups aligned with premium aesthetic; component design for form, order summary, edit controls
3. **Planning**: Move to `/speckit.plan` to design data flow, API contract, form validation rules, state management
4. **Tasks**: Break down into implementation tasks (form component, submission handler, order edit logic, caching)
