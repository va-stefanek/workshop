# Basic — RxJS Cart

**Goal:** implement the cart in `src/app/basic/services/shopping-cart-rxjs.service.ts` with
`BehaviorSubject` + Observables — state held in the subject, derived totals via `map`. The UI is
already done; you only fill in this one service.

**Run:** `ng serve` → http://localhost:4200 → Basic. Compiles from the start (`getCartSummary` /
`getTotalItems` return placeholder streams); the mutating methods throw until written.

**Don't touch:** `itemsSubject` / `items$`, the helpers (`generateId` / `saveCartToStorage` /
`loadCartFromStorage`), the component (`src/app/basic/cart-rxjs/cart-rxjs.component.ts`).

## 1. Constructor

**Now:** empty.

**Change to:** call `loadCartFromStorage()` once so a saved cart hydrates before first render.

## 2. `addItem(product)`

**Now:** `throw`.

**Change to:** read `itemsSubject.value`; if a line with `productId === product.id` exists, +1 its
quantity (build a new array, don't mutate); else append a new `CartItem` at `quantity: 1`
(`generateId()` for `id`). Then `itemsSubject.next(newArray)` and `saveCartToStorage()`.

## 3. `removeItem(productId)`

**Now:** `throw`.

**Change to:** `next()` the array with the matching `productId` filtered out, then save.

## 4. `updateQuantity(productId, quantity)`

**Now:** `throw`.

**Change to:** `quantity <= 0` → delegate to `removeItem`; else `map` the matching line to the new
quantity (new objects, no mutation). Then `next()` + save.

## 5. `clearCart()`

**Now:** `throw`.

**Change to:** `next([])` and save (clears storage too).

## 6. `getCartSummary(): Observable<CartSummary>`

**Now:** `items$.pipe(map(() => ({ …all zeros })))`.

**Change to:** `items$.pipe(map(items => …))` returning a `CartSummary`:
- `totalItems` = sum of `quantity`
- `totalPrice` = sum of `price × quantity` (gross, before discount)
- `totalDiscount` = sum of `price × quantity × (discount ?? 0) / 100`
- `tax` = `(totalPrice − totalDiscount) × 0.08` — flat **8%** in this level (no tiers)
- `finalPrice` = `totalPrice − totalDiscount + tax`

`CartSummary` is already defined in `shared/models` — just import it. Empty cart → all zeros (no guard needed).

## 7. `getTotalItems(): Observable<number>`

**Now:** `items$.pipe(map(() => 0))`.

**Change to:** `items$.pipe(map(items => …))` returning the sum of `quantity`.

## Acceptance criteria

- [ ] Add / remove / update / clear work from the UI; setting quantity to 0 removes the line.
- [ ] Totals are correct: `tax` is 8% of the discounted subtotal, `finalPrice` = subtotal + tax.
- [ ] Cart count + summary update live as items change (the subscriptions react).
- [ ] Cart survives a refresh (localStorage); state hydrates on init.
- [ ] No leftover `throw`; `ng serve` compiles clean.

Reference solution: `workshop-complete` branch. Next: [Intermediate](./INTERMEDIATE.md).
