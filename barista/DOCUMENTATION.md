# The Barista Coffee Ordering App - Documentation

## Table of Contents
1. [API Documentation](#api-documentation)
2. [Setup Guide](#setup-guide)
3. [Deployment Guide](#deployment-guide)
4. [Architecture & Tech Stack](#architecture--tech-stack)
5. [Troubleshooting](#troubleshooting)
6. [Team Runbook](#team-runbook)

---

## API Documentation

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://barista.example.com/api`

### Authentication
Guest access (no authentication required). All endpoints use HTTP.

### Endpoints

#### 1. GET `/api/categories`
Retrieve all product categories.

**Response (200 OK):**
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
  }
]
```

**Headers:**
- Cache-Control: `public, max-age=86400` (24h cache)
- ETag: `"hash"` (for conditional requests)

---

#### 2. GET `/api/products`
Retrieve products, optionally filtered by category.

**Query Parameters:**
- `categoryId` (optional): Filter by category ID

**Response (200 OK):**
```json
[
  {
    "id": "prod-espresso",
    "name": "Espresso Single Shot",
    "description": "Strong and bold",
    "price": 35000,
    "imageUrl": "https://images.unsplash.com/...",
    "isAvailable": true,
    "categoryId": "cat-espresso",
    "customizations": {
      "size": { "M": 0, "L": 15000 },
      "sugar": { "0%": 0, "50%": 0, "75%": 0, "100%": 0 },
      "ice": { "Regular": 0, "Extra": 5000 }
    }
  }
]
```

---

#### 3. GET `/api/orders/{orderId}`
Retrieve order status and details (guest access).

**Response (200 OK):**
```json
{
  "id": "ORD-SAMPLE-001",
  "status": "Preparing",
  "customerName": "John Doe",
  "items": [
    {
      "productId": "prod-espresso",
      "name": "Espresso Single Shot",
      "quantity": 1,
      "customizations": {
        "size": "M",
        "sugar": "50%",
        "ice": "Regular"
      },
      "subtotal": 35000
    }
  ],
  "driverNote": "Leave at reception 🏢",
  "createdAt": "2026-04-05T01:30:00Z",
  "estimatedDelivery": "2026-04-05T01:45:00Z",
  "total": 35000
}
```

**Error Response (404 Not Found):**
```json
{ "error": "Order not found" }
```

---

#### 4. POST `/api/orders`
Create a new order.

**Request Body:**
```json
{
  "customerName": "Jane Doe",
  "phoneNumber": "0912345678",
  "deliveryAddress": "123 Main St, District 1, HCMC",
  "items": [
    {
      "productId": "prod-espresso",
      "quantity": 1,
      "customizations": {
        "size": "M",
        "sugar": "50%",
        "ice": "Regular"
      },
      "subtotal": 35000
    }
  ],
  "driverNote": "No sugar, extra ice ❄️",
  "paymentMethod": "COD",
  "total": 35000
}
```

**Response (201 Created):**
```json
{
  "id": "ORD-1775351243516-5C3E1032",
  "status": "Received",
  "message": "Order confirmed! Your order ID is ORD-1775351243516-5C3E1032",
  "estimatedDelivery": "2026-04-05T01:37:23Z"
}
```

**Validation Rules:**
- `customerName`: Required, 2-100 characters
- `phoneNumber`: Required, Vietnamese format (10 digits starting with 0 or +84)
- `deliveryAddress`: Required, 10-500 characters
- `paymentMethod`: Must be "COD"
- `items`: Array of at least 1 item

---

## Setup Guide

### Prerequisites
- Node.js v20+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd barista
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_SHOP_PHONE=+84 2 xxxx xxxx
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

---

## Deployment Guide

### Vercel Deployment

1. **Connect repository to Vercel**
   ```bash
   vercel link
   ```

2. **Configure environment variables**
   In Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: `https://barista.example.com`
   - `NEXT_PUBLIC_SHOP_PHONE`: Shop phone number

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

4. **Verify deployment**
   - Check all 5 API endpoints
   - Test complete user flow
   - Verify mobile responsiveness

### Domain Setup
- Configure DNS records to point to Vercel
- Enable SSL/HTTPS (automatic via Vercel)
- Set up redirect from www → non-www

---

## Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 16.2.2 with React 19
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (cart persistence)
- **HTTP Client**: Axios with interceptors
- **Validation**: libphonenumber-js (phone validation)
- **Testing**: Cypress (E2E), Vitest (unit)

### Backend (Next.js API Routes)
- **Runtime**: Node.js
- **Database**: In-memory order storage (sample data)
- **Security**: CORS, CSP headers, XSS prevention via HTML escaping
- **Rate Limiting**: Basic per IP (configurable)

### Key Features
- **Guest Access**: No authentication required
- **Vietnamese Localization**: Phone validation, emoji support
- **Real-time Updates**: 7-second polling for order status
- **Offline Support**: LocalStorage caching (24h menu, 7d cart)
- **Premium UX**: Customization modal, responsive design

---

## Troubleshooting

### "Order Not Found" on Status Page
**Cause**: Order ID invalid or API unreachable.
**Solution**:
1. Verify order ID in URL (starts with `ORD-`)
2. Check if dev server is running (`http://localhost:3000`)
3. Check browser console for errors
4. Try refreshing the page

### Menu Not Loading
**Cause**: API not responding or network issue.
**Solution**:
1. Verify dev server running: `npm run dev`
2. Check `/api/categories` endpoint directly
3. Check browser DevTools Network tab
4. Try clearing browser cache

### Phone Validation Failing
**Cause**: Invalid Vietnamese phone format.
**Solution**:
- Accepted formats:
  - `0912345678` (10 digits starting with 0)
  - `+84912345678` (country code format)
- Rejected: `+1234567890`, `09xxx`, `(012) 3456789`

### Checkout Form Not Submitting
**Cause**: Validation failed or network issue.
**Solution**:
1. Check all fields are filled:
   - Name: 2-100 characters
   - Phone: Valid Vietnamese format
   - Address: 10-500 characters
2. Check browser console for specific error
3. Verify offline status (should show offline banner)
4. Try submitting different phone number format

### Polling Not Updating
**Cause**: Order status not changing on backend.
**Solution**:
1. Manual refresh: Click "Refresh" button
2. Check server logs for errors
3. Verify order exists: `GET /api/orders/ORD-xxx`
4. Wait for estimated delivery time

---

## Team Runbook

### Roles & Responsibilities

**Frontend Developer**:
- Maintain React components
- Fix UI/UX bugs
- Run Cypress E2E tests
- Performance optimization

**Backend Developer**:
- Manage API endpoints
- Database/order storage
- Authentication (future)
- Monitoring & logging

**QA Engineer**:
- Write Cypress tests
- Manual testing on devices
- Performance testing (Lighthouse)
- Security audit

### Deployment Checklist

Before marking as ready for production:

- [ ] Zero TypeScript errors (`npm run build`)
- [ ] All E2E tests passing (`npm run cypress:run`)
- [ ] Unit tests >80% coverage (Vitest)
- [ ] Lighthouse score >95
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Mobile tested on real devices
- [ ] Security audit passed (CSP, CORS, XSS)
- [ ] API contracts verified (all 5 endpoints)
- [ ] Error monitoring configured (Sentry)
- [ ] Performance baselines set

### Monitoring Post-Launch

**Key Metrics**:
- Error rate: <0.1% (via Sentry)
- Page load time: <2s (Vercel Analytics)
- Order success rate: >99%
- Polling success rate: >95%

### Escalation Path

1. **User reports issue** → Check Sentry + logs
2. **Code bug found** → Fix + test + deploy
3. **Infrastructure issue** → Contact Vercel support
4. **Security issue** → Immediate remediation + audit

---

## Code Comments & Documentation

**Cart Store** (`lib/cartStore.ts`):
- Zustand store for cart state
- Persists to localStorage with 7-day TTL
- API: `useCartStore()` hook

**Phone Validation** (`lib/checkout-validation.ts`):
- Vietnamese phone format: `0xxx...xxxxxx` or `+84xxx...xxxxxxx`
- Uses regex + libphonenumber-js
- Returns: `{ isValid, formatted, error }`

**Order Polling** (`components/order-status/ProgressBar.tsx`):
- 7-second polling interval
- Stops at "Completed" status
- Exponential backoff on errors

---

**Last Updated**: 2026-04-05  
**Version**: 1.0  
**Status**: Production Ready
