# The Barista Constitution

A premium coffee ordering platform for busy office workers—fast, beautiful, and frictionless.

## Core Principles

### I. Zero Authentication Friction

Guest-first by design. No login, no account creation, no registration walls. Users browse, customize, and checkout as anonymous guests. Account features (order history, saved preferences) are never blockers to ordering.

**Rationale**: Office workers need speed. Authentication delays defeat the purpose.

### II. Premium Aesthetic (NON-NEGOTIABLE)

Every visual element reflects high-end craftsmanship: quality imagery, deliberate typography, generous whitespace, and minimalist UI. Aesthetic degradation is grounds for design review rejection. Color palette, image assets, and typography choices MUST align with The Coffee House brand reference.

**Rationale**: Premium coffee demands premium presentation. Visual excellence is a core brand pillar, not optional.

### III. Four-Screen Rapid Flow

1. **Browse**: Menu with categories (Espresso Bar, Vietnamese, Matcha, Desserts, etc.)
2. **Customize**: Modal popup (Size, Sugar Level, Ice Level) + quantity
3. **Checkout**: 4-field form (Name, Phone, Delivery Address, Driver Note) → COD Payment confirmation
4. **Order Status**: Real-time progress tracking (Received → Preparing → Delivering → Completed) with Driver Note confirmation

Target: Each screen <15 seconds interaction. Zero unnecessary fields. No progress indicators or multi-step wizards on checkout.

**Rationale**: Busy professionals have 2 minutes for lunch orders. Every screen must respect their time. Order Status tracking reassures office workers their delivery is en route.

### IV. Customization-Driven Ordering

All drinks support customization via modal popups:
- **Size**: Small, Medium, Large
- **Sugar**: No Sugar, 25%, 50%, 75%, 100%
- **Ice**: No Ice, Light, Regular, Extra

Selections are saved in the modal preview before checkout. Users see final customizations on the order summary.

**Rationale**: Personalization increases satisfaction without complex UI.

### V. Cash-on-Delivery Simplicity

Payment method: COD only. Checkout captures only essential data (Name, Phone, Address, Driver Note). No card processing, no payment gateway complexity. Order confirmation is immediate after checkout.

**Rationale**: Removes payment friction; aligns with target market preferences.

### VI. Driver Note for Delivery Clarity

Every order includes a mandatory Driver Note field at checkout. Examples: "Leave at reception", "Call on arrival", "3rd floor east side". This field:
- MUST accept free-form text (max 100 characters)
- MUST populate the Order Status page for both customer and driver reference
- MUST follow The Coffee House minimalist input field design (clean border, ample padding, professional font)
- Enables smooth delivery to office buildings where "ground floor" is ambiguous

**Rationale**: Office deliveries fail without clear location instructions. Driver Note eliminates miscommunications and reduces delivery delays.

## Development & Design Standards

**UI/UX Changes**: All interface updates must pass a premium aesthetic review. No pixel details are small—laziness is visible.

**Menu & Image Assets**: High-resolution product images required. Images must match The Coffee House visual quality standard. Image upload workflows should enforce minimum resolution (1200px width).

**Responsive Design**: Mobile-first (office workers on phones). Desktop experience mirrors mobile (sidebar + minimal landscape variations). No permission-trap flows or aggressive upselling.

## Governance

This constitution supersedes all conflicting design or engineering practices. Amendments require:
1. Documentation of the change rationale
2. Impact assessment on existing features
3. Approval from product + design leads

All feature proposals must verify compliance with these principles before specification. Design reviews MUST check aesthetic principle adherence.

**Version**: 1.1.0 | **Ratified**: 2026-04-04 | **Last Amended**: 2026-04-05
