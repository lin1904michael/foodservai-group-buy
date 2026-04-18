# FoodservAI Group Buy — Technical Handoff Documentation

**Version:** 1.0.0
**Frontend Stack:** React 19 + Vite 8 + Tailwind CSS 4
**Last Updated:** 2026-04-10
**Purpose:** Backend integration reference for n8n webhook connection and PostgreSQL schema design.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [State Management](#2-state-management)
3. [The Checkout Flow](#3-the-checkout-flow)
4. [Webhook Payloads](#4-webhook-payloads)
5. [Bilingual Engine](#5-bilingual-engine)
6. [n8n Integration Guide](#6-n8n-integration-guide)
7. [Suggested PostgreSQL Schema](#7-suggested-postgresql-schema)
8. [Known TODOs & Open Items](#8-known-todos--open-items)

---

## 1. Architecture Overview

This is a **single-file React SPA** (`src/App.jsx`, 795 lines). There is no router, no external state library (no Redux, no Zustand), and no API calls — all data is in-memory. The entire application lifecycle lives within one browser tab session.

```
src/
├── App.jsx          ← entire application (components, data, state, logic)
├── index.css        ← Tailwind v4 import + antialiasing only
public/
index.html           ← Vite entrypoint
package.json         ← React 19, lucide-react, @tailwindcss/vite
```

**Component Tree:**
```
<App>                          ← global state: cart, lang, referralCode, UI toggles
  <ItemCard />                 ← stateless; receives item, quantity, onAdd, onRemove, lang
  <CheckoutView>               ← owns all checkout state: form, screen, orderId, Zelle fields
    <InvoiceModal />           ← stateless display component; conditionally rendered on success
  [Mini-Cart Sidebar]          ← inline JSX inside <App>, not a separate component
```

---

## 2. State Management

All state uses React's built-in `useState`. There is no persistence (no `localStorage`, no cookies). **Every state is reset on page reload.**

### 2.1 — Global App State (`App` component)

| State Variable | Type | Initial Value | Purpose |
|---|---|---|---|
| `activeCategory` | `string` | `'Hot Deli (熟食)'` | Which menu tab is selected |
| `quantities` | `object` | `{}` | Map of `{ [itemId]: qty }` for the entire cart |
| `isCheckoutOpen` | `boolean` | `false` | Mounts/unmounts `<CheckoutView>` |
| `isCartOpen` | `boolean` | `false` | Shows/hides the slide-out mini-cart sidebar |
| `referralCode` | `string \| null` | `null` | Populated from `?ref=` URL param on mount |
| `lang` | `'en' \| 'zh'` | `'en'` | Global language toggle |

**Cart mechanics — `quantities` object:**
```js
// Adding an item
setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))

// Removing an item — deletes the key entirely when qty reaches 0
setQuantities(prev => {
  const next = { ...prev }
  if (next[id] > 1) next[id] -= 1
  else delete next[id]   // ← key is removed; item disappears from cart
  return next
})
```

**Derived cart values** (computed inline, not stored in state):
```js
// Total item count for the badge
const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)

// Subtotal before tax
const totalPrice = Object.entries(quantities).reduce((sum, [id, qty]) => {
  const item = MENU_ITEMS.find(i => i.id === Number(id))
  return sum + (item ? item.price * qty : 0)
}, 0)

// Cart array passed to CheckoutView
const cartItems = Object.entries(quantities).map(([id, qty]) => ({
  item: MENU_ITEMS.find(i => i.id === Number(id)),
  qty,
}))
```

**Referral code detection (runs once on mount):**
```js
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const ref = params.get('ref')
  if (ref) setReferralCode(ref)
}, [])
```

### 2.2 — Checkout State (`CheckoutView` component)

The `CheckoutView` is a **self-contained checkout machine**. It mounts fresh every time `isCheckoutOpen` becomes `true`.

| State Variable | Type | Initial Value | Purpose |
|---|---|---|---|
| `form` | `object` | `{ name:'', phone:'', email:'', pickup:'', company:'' }` | Contact form fields |
| `screen` | `'form' \| 'zelle' \| 'success'` | `'form'` | Which screen is rendered inside CheckoutView |
| `processing` | `boolean` | `false` | Disables buttons & shows spinner during simulated async |
| `validationError` | `string` | `''` | Red error message shown above payment buttons |
| `showStripeForm` | `boolean` | `false` | Toggles the card input fields below the "Pay with Card" button |
| `cardForm` | `object` | `{ number:'', expiry:'', cvc:'' }` | Mock Stripe card inputs (not validated, not sent) |
| `paymentMethodUsed` | `'stripe' \| 'zelle' \| 'cash' \| null` | `null` | Determines success screen messaging and invoice status |
| `showInvoice` | `boolean` | `false` | Mounts `<InvoiceModal>` on the success screen |
| `zelleAccountName` | `string` | `''` | Zelle sender's full name — required for webhook |
| `zelleContactInfo` | `string` | `''` | Zelle sender's phone or email — required for webhook |
| `orderId` | `number` | `Math.floor(1000 + Math.random() * 9000)` | 4-digit ID, generated **once** per checkout session via lazy initializer |

**`orderId` generation:**
```js
// The lazy initializer function is called once on mount, never again.
// The ID is stable for the full session (stays on Zelle screen when navigating back).
const [orderId] = useState(() => Math.floor(1000 + Math.random() * 9000))
```
> ⚠️ **Backend Note:** This is a frontend-generated non-cryptographic ID used for Zelle memo matching only. It is **not** a globally unique order identifier. On the backend, generate a proper UUID or auto-increment PK and use that as the canonical `order_id` for the database.

### 2.3 — UI Toggle States

| Toggle | Trigger | Effect |
|---|---|---|
| Category tab | Click on "Hot Deli" / "Frozen Signatures" | Filters `MENU_ITEMS` array by `item.category` |
| Mini-cart sidebar | Click "Cart (N)" button in header | Sets `isCartOpen = true`; backdrop click sets `false` |
| Checkout modal | Click floating bar or "Proceed to Checkout" in sidebar | Sets `isCheckoutOpen = true`; mounts `<CheckoutView>` |
| Language toggle | Click "中文" / "EN" pill in header | Flips `lang` between `'en'` and `'zh'`; re-renders all translated strings immediately |
| Stripe card form | Click "Pay with Card" button | Toggles `showStripeForm` boolean |

---

## 3. The Checkout Flow

### 3.1 — Screen State Machine

`CheckoutView` renders three mutually exclusive screens based on the `screen` state variable:

```
[screen = 'form']   ←──── handleZelle() sets screen = 'zelle'
       │                    setScreen('form') (Back button)
       │
[screen = 'zelle']  ──→  handleZelleSent() sets screen = 'success'
       │
[screen = 'form']   ──→  handleApplePay() / handleStripePay() / handleCashPickup()
                          all set screen = 'success'
```

### 3.2 — Form Validation

All payment buttons (except the Zelle "I Have Sent" button) call `validateForm()` first:

```js
const isFormValid = () =>
  form.name.trim() && form.phone.trim() && form.email.trim() && form.pickup

const validateForm = () => {
  if (!isFormValid()) {
    setValidationError(t('validationError', lang))  // bilingual error
    return false
  }
  return true
}
```

**Required fields:** `name`, `phone`, `email`, `pickup`
**Optional fields:** `company` (included in payload as `null` if empty)

### 3.3 — Payment Paths

#### Path A: Apple Pay
1. `handleApplePay()` → `validateForm()` → sets `paymentMethodUsed = 'stripe'` → sets `processing = true`
2. `setTimeout(1500ms)` → `sendWebhook('stripe')` → `setScreen('success')`
3. Success screen shows no "Awaiting AI Verification" banner (isPaid is `true`)

#### Path B: Pay with Card (Stripe Mock)
1. Click "Pay with Card" → `handleStripe()` → `validateForm()` → toggles `showStripeForm`
2. Card fields appear (Card Number, MM/YY, CVC) — **these are UI-only, not validated or sent**
3. Click "Pay $X.XX" → `handleStripePay()` → sets `paymentMethodUsed = 'stripe'` → `processing = true`
4. `setTimeout(1500ms)` → `sendWebhook('stripe')` → `setScreen('success')`

#### Path C: Pay at Pickup (Cash)
1. `handleCashPickup()` → `validateForm()` → sets `paymentMethodUsed = 'cash'` → `processing = true`
2. `setTimeout(1200ms)` → `sendWebhook('cash')` → `setScreen('success')`
3. Success screen shows the cash pickup message AND "Awaiting AI Verification" banner

#### Path D: Zelle
1. `handleZelle()` → `validateForm()` → sets `screen = 'zelle'` (navigates to Zelle screen)
2. **Zelle screen renders:** QR placeholder, Zelle Account Name input, Zelle Contact Info input, highlighted instruction block showing exact total and Order ID memo requirement
3. **"I Have Sent the Payment" button is disabled** until both `zelleAccountName.trim()` and `zelleContactInfo.trim()` are non-empty:
   ```js
   const isZelleFieldsValid = zelleAccountName.trim() && zelleContactInfo.trim()
   // ...
   <button disabled={processing || !isZelleFieldsValid}>
   ```
4. Click → `handleZelleSent()` → sets `paymentMethodUsed = 'zelle'` → `processing = true`
5. `setTimeout(1200ms)` → `sendWebhook('zelle')` → `setScreen('success')`
6. Success screen shows "Awaiting AI Verification" banner

### 3.4 — Order Reset on Completion

When the user clicks "Back to Menu" on the success screen, `onComplete()` is called in the parent:
```js
const handleComplete = () => {
  setIsCheckoutOpen(false)  // unmounts CheckoutView (resets all checkout state)
  setQuantities({})          // clears the cart
}
```

---

## 4. Webhook Payloads

The `sendWebhook()` function builds and logs the payload. **Replace the `console.log` with a real `fetch` POST.**

```js
const sendWebhook = (paymentMethod) => {
  const payload = buildPayload(paymentMethod)
  // TODO: TECH TEAM - Replace this with an actual n8n Webhook POST.
  // n8n will catch this and trigger the Zelle/Stripe email invoice.
  console.log("SENDING TO N8N WEBHOOK:", payload)
}
```

**Replacement code for production:**
```js
const sendWebhook = async (paymentMethod) => {
  const payload = buildPayload(paymentMethod)
  await fetch('https://your-n8n-instance.com/webhook/foodservai-group-buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
```

### 4.1 — Stripe / Apple Pay / Cash Payload

Fired by: `handleApplePay()`, `handleStripePay()`, `handleCashPickup()`

```json
{
  "order_id": 8492,
  "customer": {
    "name": "Jane Chen",
    "phone": "(626) 555-9999",
    "email": "jane@example.com",
    "company": "Tofu Palace LLC"
  },
  "pickup_location": "Irvine - Saturday 12:00 PM",
  "items": [
    {
      "id": 1,
      "name_en": "Spicy Beef Tendon",
      "name_zh": "香辣牛筋",
      "price": 14.99,
      "quantity": 2,
      "line_total": 29.98
    },
    {
      "id": 6,
      "name_en": "Pork & Chive Dumplings (30pc)",
      "name_zh": "豬肉韭菜水餃 (30顆)",
      "price": 13.99,
      "quantity": 1,
      "line_total": 13.99
    }
  ],
  "total_amount": 47.78,
  "payment_method": "stripe",
  "referral_code": "mary123"
}
```

> **Notes:**
> - `payment_method` is `"stripe"` for both Apple Pay and card. There is currently no distinction between them in the payload.
> - `payment_method` is `"cash"` for Pay at Pickup.
> - `total_amount` = `(subtotal * 1.09)`, rounded to 2 decimal places via `parseFloat(total.toFixed(2))`.
> - `referral_code` is `null` if no `?ref=` param was in the URL.
> - `company` is `null` if the field was left empty.

### 4.2 — Zelle Payload

Fired by: `handleZelleSent()`. Identical to the Stripe payload **plus two additional fields:**

```json
{
  "order_id": 8492,
  "customer": {
    "name": "Jane Chen",
    "phone": "(626) 555-9999",
    "email": "jane@example.com",
    "company": null
  },
  "pickup_location": "Arcadia - Sunday 2:00 PM",
  "items": [
    {
      "id": 7,
      "name_en": "Xiao Long Bao (20pc)",
      "name_zh": "小籠包 (20顆)",
      "price": 15.99,
      "quantity": 3,
      "line_total": 47.97
    }
  ],
  "total_amount": 52.29,
  "payment_method": "zelle",
  "referral_code": null,
  "zelle_account_name": "Jennifer Wu",
  "zelle_contact_info": "jenniferwu@gmail.com"
}
```

> **Zelle reconciliation fields:**
> - `zelle_account_name` — the exact name the customer entered as registered to their bank's Zelle account.
> - `zelle_contact_info` — phone number or email attached to their Zelle account.
> - `order_id` — the 4-digit ID displayed on-screen that the customer is **instructed to include in the Zelle memo**. This is the primary matching key for your n8n reconciliation workflow.

### 4.3 — `marketing_opt_in` Field

> ⚠️ **This field does NOT currently exist in the codebase.** The frontend has no opt-in checkbox or consent capture UI. Before adding it to the n8n schema or database, it must first be added to the checkout form as an explicit checkbox with appropriate consent copy. Do not assume any default value.

### 4.4 — What Is NOT Sent

The following are **UI-only** and intentionally excluded from the webhook:
- Card number, MM/YY, CVC (Stripe card form fields)
- The customer's selected `lang` preference
- The `is_hot_seller` flag
- `image_placeholder_color` from menu items

---

## 5. Bilingual Engine

### 5.1 — Dictionary Structure

All UI strings live in a single `const T` object at the top of `App.jsx`. Each key maps to an object with `en` and `zh` values:

```js
const T = {
  cart:      { en: 'Cart',    zh: '購物車' },
  checkout:  { en: 'Checkout', zh: '結帳' },
  // ... 60+ keys
  perkDesc: {
    // Array format for strings with bold segments
    en: ['You earned a ', 'Free Chicken Cutlet (Dine-In)', ' & ', 'Side Kimchi (泡菜)', '...'],
    zh: ['您獲得了', '免費雞排（內用）', '和', '泡菜小菜', '...'],
  }
}
```

### 5.2 — The `t()` Helper Function

```js
const t = (key, lang) => T[key]?.[lang] || T[key]?.en || key
```

**Resolution order:**
1. Try `T[key][lang]` — the requested language
2. Fall back to `T[key]['en']` — English if the ZH string is missing
3. Fall back to the raw `key` string — prevents blank UI if key is missing entirely

Usage throughout the app:
```jsx
<h3>{t('contactInfo', lang)}</h3>           // → "Contact Info" or "聯絡資訊"
<button>{t('proceedToCheckout', lang)}</button>  // → "Proceed to Checkout" or "前往結帳"
```

### 5.3 — Item Name Fallback (Critical)

Menu item names use two dedicated helper functions with explicit fallback logic:

```js
// Primary display name — in ZH mode, falls back to EN if name_zh is null/empty
const itemName = (item, lang) =>
  lang === 'zh' ? (item.name_zh || item.name_en) : item.name_en

// Subtitle / secondary name — shows the opposite language as context
const itemSub = (item, lang) =>
  lang === 'zh' ? item.name_en : item.name_zh
```

**Example rendering:**

| Mode | Primary (H3) | Subtitle (P) |
|---|---|---|
| `lang = 'en'` | Spicy Beef Tendon | 香辣牛筋 |
| `lang = 'zh'` | 香辣牛筋 | Spicy Beef Tendon |
| `lang = 'zh'`, `name_zh = null` | Spicy Beef Tendon *(fallback)* | Spicy Beef Tendon |

This `itemName()` helper is called in: `ItemCard`, `CheckoutView` Order Summary, `InvoiceModal` item table, Cart Sidebar, and the AI Suggestion widget.

### 5.4 — Toggle Mechanism

The toggle lives in the `App` component and is passed down as a prop to every component that renders text:

```js
// State in App
const [lang, setLang] = useState('en')

// Toggle button
<button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}>
  <Globe size={13} />
  {lang === 'en' ? '中文' : 'EN'}
</button>
```

Because `lang` is a React state variable, **changing it triggers a full re-render of the component tree** — all `t()` calls and `itemName()` calls re-evaluate instantly with no page reload.

**Prop drilling chain:**
```
App (lang state)
  → <ItemCard lang={lang} />
  → <CheckoutView lang={lang} />
      → <InvoiceModal lang={lang} />
  → [Mini-Cart Sidebar] uses lang directly (inline JSX in App)
```

---

## 6. n8n Integration Guide

### 6.1 — Webhook Setup

1. In n8n, create a **Webhook** node set to `POST` method
2. Copy the webhook URL (e.g., `https://your-n8n.app.n8n.cloud/webhook/foodservai-group-buy`)
3. In `App.jsx`, replace the `console.log` in `sendWebhook()` with:

```js
const sendWebhook = async (paymentMethod) => {
  const payload = buildPayload(paymentMethod)
  try {
    await fetch('https://YOUR_N8N_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Webhook failed:', err)
  }
}
```

### 6.2 — Recommended n8n Workflow Branches

Use an **IF** or **Switch** node on `payment_method` to fork the workflow:

```
[Webhook Trigger]
       │
  [Switch: payment_method]
       ├── "stripe"  → [Send Invoice Email (Paid)]   → [INSERT to orders table, status='paid']
       ├── "zelle"   → [Send "Awaiting Verification" Email]
       │              → [INSERT to orders table, status='pending_zelle']
       │              → [Create Zelle Matching Task — check memo by order_id]
       └── "cash"    → [Send "Pay at Pickup" Email]
                      → [INSERT to orders table, status='pending_cash']
```

### 6.3 — Zelle Reconciliation Workflow

Build a second n8n workflow or sub-workflow triggered by a bank notification or manual webhook:

```
[Zelle Payment Received Trigger]
       │
  [Extract: sender_name, memo_field, amount]
       │
  [Lookup orders WHERE order_id = memo AND zelle_account_name = sender_name]
       │
  [IF match found]
       ├── YES → UPDATE orders SET status='paid', paid_at=NOW()
       │         → Send Confirmation Email to customer
       └── NO  → Flag for manual review
                 → Alert admin Slack/email
```

**Matching keys from the payload to use:**
- `order_id` ← must match the memo the customer typed
- `zelle_account_name` ← cross-reference with the sender name from the bank
- `zelle_contact_info` ← secondary verification
- `total_amount` ← verify the amount matches exactly

---

## 7. Suggested PostgreSQL Schema

```sql
-- Orders table
CREATE TABLE orders (
  id              SERIAL PRIMARY KEY,
  order_ref       INTEGER NOT NULL,          -- frontend-generated 4-digit orderId
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_company TEXT,                     -- nullable
  pickup_location TEXT NOT NULL,
  subtotal        NUMERIC(10, 2) NOT NULL,
  tax_amount      NUMERIC(10, 2) NOT NULL,
  total_amount    NUMERIC(10, 2) NOT NULL,
  payment_method  TEXT NOT NULL              -- 'stripe' | 'zelle' | 'cash'
                  CHECK (payment_method IN ('stripe', 'zelle', 'cash')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'pending_zelle', 'pending_cash', 'paid', 'cancelled')),
  referral_code   TEXT,                      -- nullable
  zelle_account_name TEXT,                   -- nullable; only for payment_method='zelle'
  zelle_contact_info TEXT,                   -- nullable; only for payment_method='zelle'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  paid_at         TIMESTAMPTZ                -- set when payment confirmed
);

-- Order line items
CREATE TABLE order_items (
  id              SERIAL PRIMARY KEY,
  order_id        INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id    INTEGER NOT NULL,
  name_en         TEXT NOT NULL,
  name_zh         TEXT,
  unit_price      NUMERIC(10, 2) NOT NULL,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  line_total      NUMERIC(10, 2) NOT NULL
);

-- Referral codes / group leaders
CREATE TABLE referral_codes (
  id              SERIAL PRIMARY KEY,
  code            TEXT UNIQUE NOT NULL,      -- matches ?ref= URL param
  leader_name     TEXT,
  leader_email    TEXT,
  total_orders    INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Zelle reconciliation lookups
CREATE INDEX idx_orders_order_ref ON orders(order_ref);
CREATE INDEX idx_orders_status    ON orders(status);
CREATE INDEX idx_orders_email     ON orders(customer_email);
```

> **Important:** `order_ref` is the 4-digit frontend ID. Do not rely on it for uniqueness — use the `id` serial PK as the canonical order identifier in all backend logic.

---

## 8. Known TODOs & Open Items

| # | Item | Priority | Notes |
|---|---|---|---|
| 1 | Replace `console.log` with real `fetch` POST in `sendWebhook()` | **CRITICAL** | See Section 6.1 |
| 2 | `marketing_opt_in` field | Medium | **Not yet implemented** — no checkbox in UI. Must be added to form before adding to schema |
| 3 | Stripe card form is UI-only | High | No actual Stripe SDK integrated. Replace with `@stripe/react-stripe-js` + `stripe.confirmPayment()` |
| 4 | Apple Pay button is simulated | High | Fires same `sendWebhook('stripe')` as card payment. No `PaymentRequest` API integration |
| 5 | `orderId` collisions possible | Low | 4-digit range (1000–9999) = 9,000 possible values. Fine for low volume; upgrade to UUID for scale |
| 6 | No loading/error state for webhook failure | Medium | If the POST fails, the user still sees the success screen. Add error handling |
| 7 | Cart state lost on browser refresh | Low | Consider `sessionStorage` persistence if users frequently refresh |
| 8 | Pickup locations are hardcoded | Medium | Move to a config object or API endpoint so ops team can update without a deploy |
| 9 | Tax rate (9%) is hardcoded as `const TAX_RATE = 0.09` | Low | Different pickup locations may require different tax rates |
| 10 | No CORS config documented | Medium | Ensure n8n webhook endpoint allows requests from the frontend domain |
