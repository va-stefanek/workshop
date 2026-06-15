# Advanced — Resource API + Analytics

**Goal:** finish two services. In `product-resource.service.ts` make the resources reactive; in
`advanced-cart.service.ts` implement the derived signals, effects, and operations. The components
and templates are already done.

**Run:** `ng serve` → http://localhost:4200 → Advanced. Compiles from the start (resources/computeds
return placeholders); operations throw until written.

**Don't touch:** the filter signals + their setters, the versioned state (`cartState` /
`sessionStartTime` / `cartHistory`), `cartItems`, the storage helpers, the components/templates.

---

# product-resource.service.ts

The bug: signals read inside an async `loader` aren't tracked, so a resource loads once and ignores
every filter change. The fix is always the same — move the signal reads into a `params()` function and
read them from `params` in the loader (`async ({ params }) => …`). The filter/sort/paginate logic
already works; don't rewrite it.

## 1. `productsResource`

**Now:** `resource({ loader })` with `this.searchQuery()`, `this.categoryFilter()`, … read **inside** the loader, so it never reloads.

**Change to:** add `params: () => ({ search: this.searchQuery(), category: this.categoryFilter(), priceRange, sortBy, sortOrder, page, limit })`,
switch the loader to `async ({ params }) =>`, and replace every `this.xSignal()` read with `params.x`.
**Bonus:** also destructure `abortSignal` and pass it to the simulated delay so a rapid change cancels the stale load.

## 2. `selectedProductResource` & `recommendationsResource`

**Now:** same bug — the id / category are read inside the loader.

**Change to:**
- `selectedProductResource` → `params: () => ({ id: this.selectedProductId() })`
- `recommendationsResource` → `params: () => ({ id: this.selectedProductId(), category: this.categoryFilter() })`

Read the inputs from `params` in each loader.

---

# advanced-cart.service.ts

State, `cartItems`, and helpers are provided. Implement the rest.

## 3. `cartSummary = computed<CartSummary>()`

**Now:** hardcoded zeros.

**Change to:** from `cartState().items` compute `totalItems`, `totalPrice`, a `totalDiscount` with a
**bulk rule** (a line with `quantity > 3` gets at least 15% off — `Math.max(itemDiscount, 15)`), and a
**luxury tax** applied per item (items priced over $1000 → 15%, otherwise 8%), then `finalPrice`.
Return `{ totalItems, totalPrice, totalDiscount, tax, finalPrice }`.

## 4. `cartAnalytics = computed<CartAnalytics>()`

**Now:** hardcoded `{ totalSessions: 1, … }`.

**Change to:** from `cartHistory()`: `totalSessions` = history length; `averageSessionValue` = mean of
each session's value (Σ `price × quantity`); `topCategories` = categories ranked by quantity (top few);
`abandonmentRate` = `(sessions − 1) / sessions × 100`. Guard divisions so an empty history returns 0, not `NaN`.

## 5. `cartMetrics = computed()`

**Now:** hardcoded zeros.

**Change to:** `sessionDurationMinutes` (from `sessionStartTime()`), `cartValuePerMinute`,
`uniqueCategories` (`new Set(...).size`), `averageItemPrice`, plus `cartVersion` + `lastModified` from
`cartState()`. Guard the divisions (empty cart / zero duration → 0, never `NaN`).

## 6. `cartSyncResource`

**Now:** loader returns `{ success: false, message: 'Sync not implemented yet' }`.

**Change to:** simulate a server sync — a network delay, ~10% random failures, basic conflict
resolution, and a success/failure result that includes version + timestamp. Drive reloads from the
`syncTrigger` signal (bump it in `triggerSync`).

## 7. Effects (`setupEffects`)

**Now:** only a basic auto-save effect.

**Change to:** keep auto-save (`cartState()` → `saveCartToStorage`), add history tracking (push state
changes, cap the list at `maxHistorySize`), and analytics logging. Use effect cleanup (`return () => …`)
for any interval you start.

## 8. Operations — replace the throw bodies

Route every mutation through **`updateCartState(newItems)`** first (the single writer: set items, bump
`version`, stamp `lastUpdated`). Then implement:
- `addItem(product, qty = 1)`, `removeItem`, `updateQuantity` (`≤ 0` removes), `clearCart`
- `duplicateItem`, `applyBulkDiscount(categoryOrAll, percent)` (discount only ever increases — `Math.max`), `optimizeCart`
- `undoLastChange`, `restoreCartFromHistory(i)`, `triggerSync`, `moveToWishlist`
- `exportCart()` → JSON string; `importCart(json)` → parse + validate structure → `boolean`

## 9. Fix the Date bug in `loadCartFromStorage`

`JSON.parse` returns `lastUpdated` as a **string**, but `CartState.lastUpdated` is a `Date`, so a later
`.toISOString()` throws. Rehydrate it — `{ ...state, lastUpdated: new Date(state.lastUpdated) }` — and
fall back to a fresh default state if parsing fails.

## Acceptance criteria

- [ ] Typing in search / changing category, price, sort, or page each reload the product list
      (no signal reads left in any loader body).
- [ ] Selecting a product loads its details and relevant recommendations.
- [ ] `cartSummary` applies the bulk discount (`qty > 3` ≥ 15%) and the luxury tax (15% over $1000, else 8%).
- [ ] `cartAnalytics` / `cartMetrics` show real numbers and never `NaN`.
- [ ] Sync shows both success and failure states; undo + bulk ops work.
- [ ] `exportCart` produces valid JSON; `importCart` validates and restores (round-trips).
- [ ] Cart survives a refresh — and the Date-parsing bug is fixed (no `toISOString` crash on reload).
- [ ] No leftover `throw`; `ng serve` compiles clean.

Reference solution: `workshop-complete` branch.
