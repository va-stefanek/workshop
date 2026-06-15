# Intermediate — Migrate the cart to Signals

**Goal:** reimplement the cart in `src/app/intermediate/services/cart-computed.service.ts`
using signals — derived state with `computed`, persistence/logging with `effect`, and
signal-based mutations. The UI, the template, and `CartEffectsService` are already done; you
only fill in this one service.

**Run:** `ng serve` → http://localhost:4200 → Intermediate. Compiles from the start (computeds
return placeholders); mutations throw until written.

**Don't touch:** the state signals + readonly accessors, the helpers (`saveCartToStorage` /
`loadCartFromStorage` / `generateId`), `CartEffectsService`, the component, the template.

## 1. `cartSummary = computed<CartSummary>()`

**Now:** returns a hardcoded `{ totalItems: 0, totalPrice: 0, totalDiscount: 0, tax: 0, finalPrice: 0 }`.

**Change to:** read `items()` once and compute:
- `totalItems` = sum of `quantity` across all items
- `totalPrice` = sum of `price × quantity` across all items (gross, before discount)
- `totalDiscount` = sum of `price × quantity × (discount ?? 0) / 100` across all items (currency amount)
- `subtotal` = `totalPrice − totalDiscount` (local var, not returned)
- `tax` = `subtotal × rate`, rate taken from **subtotal, not `totalPrice`**, with closed boundaries:
  - `subtotal > 1000` → 12%
  - `subtotal >= 500` → 10% (so exactly 500 and exactly 1000 are both 10%)
  - else → 8%
- `finalPrice` = `subtotal + tax`

Empty cart → every field 0 (falls into the 8% branch, tax = 0). No guard needed.

## 2. `filteredItems = computed()`

**Now:** returns `this.items()` unchanged.

**Change to:** read `items()`, `selectedCategory()`, `searchQuery()`, `sortOrder()` and return a
new array (don't mutate `items()` — `.sort()` mutates, so spread first):
- keep only the selected category — skip this filter when it equals `'all'`
- keep rows whose `name` or `category` contains the search text, case-insensitive (trim + `toLowerCase` both sides)
- sort by line total (`price × quantity`): `'asc'` ascending, `'desc'` descending

Reads all four signals → recomputes on any filter/sort change.

## 3. `categoryStats = computed()`

**Now:** returns a hardcoded `[{ electronics, 0, 0 }, { clothing, 0, 0 }]`.

**Change to:** one row per category actually present in `items()` → `{ category, itemCount, totalValue }[]`,
where `itemCount` = sum of `quantity` per category and `totalValue` = sum of `price × quantity` per
category. Empty cart → empty array (no hardcoded categories). Group via `Map<string, …>`, then `Array.from(...)`.

## 4. `discountInfo = computed()`

**Now:** returns `{ hasDiscounts: false, discountedItemsCount: 0, totalSavings: 0, averageDiscount: 0 }`.

**Change to:** take the items where `discount > 0`, then:
- `discountedItemsCount` = their count
- `hasDiscounts` = count > 0
- `totalSavings` = `cartSummary().totalDiscount` (reuse it — don't re-sum)
- `averageDiscount` = mean of their `discount` %. **Guard the division:** when `discountedItemsCount === 0`
  return 0, otherwise the template's `.toFixed(1)` renders `NaN`.

## 5. `shippingInfo = computed()`

**Now:** returns hardcoded defaults (`isFreeShipping: false`, `shippingCost: 15`, …).

**Change to:** compute from `subtotal` (= `cartSummary().totalPrice − cartSummary().totalDiscount`). Free
when `subtotal >= 500`. Keep exactly the keys the template reads:
- `isFreeShipping` / `isEligibleForFreeShipping` = `subtotal >= 500`
- `shippingCost` = `0` if free else `15`
- `amountForFreeShipping` = `Math.max(0, 500 − subtotal)`
- `estimatedDelivery` = `'2-3 business days'` if free else `'5-7 business days'`

## 6. Constructor

**Now:** empty.

**Change to:**
- call `loadCartFromStorage()` once (hydrate before first render)
- `effect` reading `items()` → `saveCartToStorage()` (auto-persist)
- `effect` reading `cartSummary()` → `console.log` the analytics (items / finalPrice / category count),
  but return early when the cart is empty so an empty cart logs nothing

## 7. Mutations — replace the throw bodies

The component calls exactly these. Update signals with `.set()` / `.update()` and build new
arrays/objects (no in-place mutation):
- `addItem(product)` — if a line with `productId === product.id` exists, +1 its quantity; else append
  a new `CartItem` at `quantity: 1` (`generateId()` for `id`).
- `removeItem(productId)` — filter out the matching line.
- `updateQuantity(productId, quantity)` — `quantity <= 0` → delegate to `removeItem`; else map the line to the new quantity.
- `clearCart()` — `set([])`.
- `setCategory(c)` / `setSearchQuery(q)` / `setSortOrder(o)` — `.set()` the matching filter signal.

## Acceptance criteria

- [ ] Add / remove / update / clear work from the UI; setting quantity to 0 removes the line.
- [ ] Category, search, and sort each change the rendered list live and combine correctly.
- [ ] Tiered tax is correct at the boundaries — subtotal of exactly `499.99 / 500 / 1000 / 1000.01`
      yields `8 / 10 / 10 / 12 %`; tax is computed on subtotal, not `totalPrice`.
- [ ] `averageDiscount` shows 0, never `NaN`, when nothing is discounted.
- [ ] Shipping flips to FREE at `subtotal >= 500`; `amountForFreeShipping` never goes negative.
- [ ] Analytics log on change, silent on empty cart.
- [ ] Cart survives a refresh (localStorage); state hydrates on init.
- [ ] No leftover `throw`; `ng serve` compiles clean.

Reference solution: `workshop-complete` branch. Next: [Advanced](./ADVANCED.md).
