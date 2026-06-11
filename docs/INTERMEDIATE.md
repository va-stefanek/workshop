# Intermediate Level - Signals + Computed Values

Welcome to the **Intermediate Level** of the Angular Shopping Cart Workshop! In this level, you'll migrate from RxJS patterns to Angular Signals while exploring computed values, effects, and advanced state management patterns.

## 🎯 Learning Objectives

By completing this level, you will:

- Understand Angular Signals fundamentals and reactive primitives
- Implement computed signals for derived state calculations
- Use effects for side effects and persistence
- Compare RxJS vs Signals approaches to reactive programming
- Master fine-grained reactivity and performance optimization
- Build complex UIs with filtering, sorting, and analytics

## 📁 Files You'll Work With

**Primary Files:**
- `src/app/intermediate/services/cart-computed.service.ts` - **STARTER FILE** (advanced signals)
- `src/app/intermediate/services/cart-effects.service.ts` - Effects and side effect management
- `src/app/intermediate/components/cart-intermediate.component.ts` - UI component

**Reference Files:**
- `src/app/basic/services/shopping-cart-signals.service.ts` - basic signals primer (simpler patterns)
- Full solution: branch `workshop-complete` (`git switch workshop-complete`)

## 🏗 Architecture Overview

The Signals implementation introduces a more declarative approach:

```
┌─────────────────────────────────────────────┐
│              Component Layer                │
│  ┌─────────────────────────────────────┐   │
│  │   CartIntermediateComponent         │   │
│  │  - Reads signal values directly    │   │
│  │  - No manual subscriptions         │   │
│  │  - Automatic change detection      │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ reads signals
                  ▼
┌─────────────────────────────────────────────┐
│              Service Layer                  │
│  ┌─────────────────────────────────────┐   │
│  │     CartComputedService (Primary)   │   │
│  │  - signal<CartItem[]>               │   │
│  │  - computed<CartSummary>            │   │
│  │  - computed<FilteredItems>          │   │
│  │  - effect(() => persistCart())     │   │
│  └─────────────────────────────────────┘   │
│                    ▲                       │
│                    │ injects               │
│  ┌─────────────────────────────────────┐   │
│  │     CartEffectsService              │   │
│  │  - Consumes CartComputedService     │   │
│  │  - Wishlist management             │   │
│  │  - History tracking                │   │
│  │  - Recently viewed items           │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Step 1: Examine the Signals Approach

Open the basic signals solution first to understand the fundamental migration:

```typescript
// RxJS approach
private itemsSubject = new BehaviorSubject<CartItem[]>([]);
items$ = this.itemsSubject.asObservable();

// Signals approach  
private items = signal<CartItem[]>([]);
public readonly cartItems = this.items.asReadonly();
```

### Step 2: Navigate to Intermediate Level

1. Start the development server: `npm start`
2. Open your browser to `http://localhost:4200`
3. Click on "Intermediate Level" in the navigation
4. Explore the enhanced interface with filtering and analytics

## 📝 Implementation Tasks

### Task 1: Review the Provided State Structure

**Goal**: Understand the scaffolding that is already in the starter file — the private signals and readonly accessors below are provided; your work starts with the computed signals (Task 2+).

**Provided structure**:
```typescript
export class CartComputedService {
  // Core state
  private items = signal<CartItem[]>([]);
  private selectedCategory = signal<string>('all');
  private searchQuery = signal<string>('');
  private sortOrder = signal<'asc' | 'desc'>('asc');

  // Readonly accessors
  public readonly cartItems = this.items.asReadonly();
  public readonly currentCategory = this.selectedCategory.asReadonly();

  // YOUR WORK: the computed signals (Tasks 2-4), effects (Task 5)
  // and cart methods (Task 7) are stubbed with TODOs
}
```

### Task 2: Implement Advanced Cart Summary

**Goal**: Create a computed signal that calculates cart totals with item discounts and progressive tax rates.

**Requirements**:
```typescript
public readonly cartSummary = computed<CartSummary>(() => {
  const items = this.items();

  // TODO: Calculate totals with advanced logic
  // - totalItems: sum of quantities
  // - totalPrice: sum of price * quantity
  // - totalDiscount: per-item discount % applied to price * quantity
  // - Progressive tax on subtotal: 8% under $500, 10% $500-$1000, 12% over $1000
  // - finalPrice: subtotal + tax
});
```

**Calculation rules**:
- `subtotal = totalPrice - totalDiscount`
- Tax tiers apply to the whole subtotal (8% / 10% / 12%)

### Task 3: Implement Filtering and Sorting

**Goal**: Create computed signals for real-time filtering and sorting of cart items.

**Requirements**:
```typescript
public readonly filteredItems = computed(() => {
  const items = this.items();
  const category = this.selectedCategory();
  const search = this.searchQuery().toLowerCase();
  const sort = this.sortOrder();

  let filtered = items;

  // TODO: Filter by category
  if (category !== 'all') {
    // Filter logic
  }

  // TODO: Filter by search query
  if (search) {
    // Search in name and category
  }

  // TODO: Sort by total value (price * quantity)
  return filtered.sort((a, b) => {
    // Sorting logic
  });
});
```

### Task 4: Implement Category Analytics

**Goal**: Create computed signals for cart analytics and insights.

**Requirements**:
```typescript
public readonly categoryStats = computed(() => {
  const items = this.items();
  
  // TODO: Group items by category
  // Return: { category, itemCount, totalValue }[]
});

public readonly discountInfo = computed(() => {
  const items = this.items();
  
  // TODO: Calculate discount statistics
  // Return: { hasDiscounts, discountedItemsCount, totalSavings, averageDiscount }
});

public readonly shippingInfo = computed(() => {
  const summary = this.cartSummary();
  
  // TODO: Calculate shipping costs and delivery estimates
  // Free shipping over $500, otherwise standard $15
});
```

### Task 5: Implement Cart Effects

**Goal**: Use effects for side effects like persistence and analytics logging.

**Requirements** (implement inside the constructor — skeleton only, the bodies are your work):
```typescript
constructor() {
  // 1. Load persisted cart on startup (which helper does that?)

  // 2. Auto-save effect: persist whenever items() changes
  effect(() => { /* read the signal that should trigger saving, then save */ });

  // 3. Analytics effect: log totals, but only when the cart has items
  effect(() => { /* read cartSummary(), guard against empty cart, log */ });
}
```

**Hint**: an effect re-runs when any signal READ inside it changes — so the
first line of each effect decides what it reacts to.

### Reference: Advanced Effects Service (no implementation needed)

**Goal**: Study how `CartEffectsService` (fully implemented, provided for you) composes effects on top of the main cart service. There is nothing to implement here — read it to see real-world effect patterns.

**Architecture Note**: The CartEffectsService consumes data from CartComputedService and adds wishlist, recently viewed, and history functionality on top.

**Features Available**:
- Wishlist management (separate from cart)
- Recently viewed products tracking
- Cart history and restore functionality  
- Advanced analytics effects

**Usage**: The effects service automatically syncs with the main cart service and provides additional UI features.

### Task 7: Advanced UI Integration

**Goal**: Connect the computed signals to the component template.

**Component Integration**:
```typescript
export class CartIntermediateComponent {
  public cartService = inject(CartComputedService);
  public effectsService = inject(CartEffectsService);

  // Cart operations use main service
  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
    this.effectsService.addToRecentlyViewed(product);
  }

  // Filter methods (students implement)
  onCategoryChange(category: string): void {
    this.cartService.setCategory(category);
  }

  onSearchChange(query: string): void {
    this.cartService.setSearchQuery(query);
  }

  // Wishlist operations use effects service
  onAddToWishlist(productId: string): void {
    this.effectsService.addToWishlist(productId);
  }
}
```

## ✅ Testing Your Implementation

### Manual Testing Checklist

**Basic Functionality**:
- ✅ Add/remove items from cart
- ✅ Update quantities
- ✅ Cart persistence across page reloads

**Advanced Features**:
- ✅ Filter by category (all, electronics, clothing, books, home, sports)
- ✅ Search by product name
- ✅ Sort by price (ascending/descending)
- ✅ View category statistics
- ✅ See shipping calculations
- ✅ Track discount information

**Effects & Analytics**:
- ✅ Wishlist operations
- ✅ Recently viewed tracking
- ✅ Cart history and restore
- ✅ Analytics logging in console

## 🧪 Code Examples

### Computed Cart Summary (Advanced)

```typescript
public readonly cartSummary = computed<CartSummary>(() => {
  const items = this.items();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Advanced discount calculation with bulk discounts
  const totalDiscount = items.reduce((sum, item) => {
    let itemDiscount = item.discount || 0;
    
    // Apply bulk discount for quantities > 3
    if (item.quantity > 3) {
      itemDiscount = Math.max(itemDiscount, 15); // At least 15% for bulk
    }
    
    return sum + (item.price * item.quantity * itemDiscount / 100);
  }, 0);
  
  // Progressive tax calculation
  const subtotal = totalPrice - totalDiscount;
  let tax = 0;
  if (subtotal > 1000) {
    tax = subtotal * 0.12; // 12% for orders over $1000
  } else if (subtotal > 500) {
    tax = subtotal * 0.10; // 10% for orders over $500
  } else {
    tax = subtotal * 0.08; // 8% for orders under $500
  }
  
  const finalPrice = subtotal + tax;

  return {
    totalItems,
    totalPrice,
    totalDiscount,
    tax,
    finalPrice
  };
});
```

### Advanced Filtering Logic

```typescript
public readonly filteredItems = computed(() => {
  const items = this.items();
  const category = this.selectedCategory();
  const search = this.searchQuery().toLowerCase();
  const sort = this.sortOrder();

  let filtered = items;

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }

  // Filter by search query
  if (search) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  }

  // Sort by total value (price * quantity)
  return filtered.sort((a, b) => {
    const aValue = a.price * a.quantity;
    const bValue = b.price * b.quantity;
    return sort === 'asc' ? aValue - bValue : bValue - aValue;
  });
});
```

### Effects for Side Effects

```typescript
private setupEffects(): void {
  // Auto-save cart to localStorage
  effect(() => {
    const items = this.items();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart-computed', JSON.stringify(items));
    }
  });

  // Analytics logging
  effect(() => {
    const analytics = this.cartAnalytics();
    const metrics = this.cartMetrics();
    
    console.log('Cart Analytics Update:', {
      analytics,
      metrics,
      timestamp: new Date().toISOString()
    });
  });

  // Cart history tracking
  effect(() => {
    const items = this.items();
    if (items.length > 0) {
      this.cartHistory.update(history => {
        const newHistory = [...history, [...items]];
        return newHistory.slice(-10); // Keep last 10 states
      });
    }
  });
}
```

## 🔧 Debugging with Signals

### Angular DevTools

1. Open Angular DevTools
2. Navigate to the "Components" tab
3. Select `CartIntermediateComponent`
4. Observe signal values in real-time
5. Use the "Profiler" tab to see signal updates

### Signal Debugging Tips

```typescript
// Add debugging to computed signals
public readonly cartSummary = computed(() => {
  const items = this.items();
  console.log('Computing cart summary for:', items.length, 'items');
  
  const result = {
    // ... calculation logic
  };
  
  console.log('Cart summary result:', result);
  return result;
});

// Debug effects
effect(() => {
  const items = this.items();
  console.log('Effect triggered - cart items changed:', items);
}, { allowSignalWrites: true });
```

## 📊 Performance Benefits

### Signals vs RxJS Performance

**Memory Usage**:
- ✅ No subscription management overhead
- ✅ Automatic cleanup when components destroy
- ✅ Fine-grained change detection

**Change Detection**:
- ✅ Only affected components re-render
- ✅ Computed signals only recalculate when dependencies change
- ✅ Effects only run when their dependencies change

**Developer Experience**:
- ✅ Simpler mental model
- ✅ Less boilerplate code
- ✅ Better TypeScript integration
- ✅ Easier testing

## 🎯 Success Criteria

You've successfully completed the Intermediate Level when:

- ✅ All tests pass (`npm run test:intermediate`)
- ✅ Filtering by category works correctly
- ✅ Search functionality filters items in real-time
- ✅ Sorting toggles between ascending/descending
- ✅ Category statistics update automatically
- ✅ Shipping calculations are accurate
- ✅ Wishlist operations work correctly
- ✅ Recently viewed items are tracked
- ✅ Cart history and restore functions work
- ✅ Console shows analytics logging
- ✅ All data persists across page refreshes

## 🚀 Ready for Advanced Level?

### Key Concepts Mastered

Before moving to the Advanced Level, ensure you understand:

1. **Signal Basics**: Creating, updating, and reading signals
2. **Computed Signals**: Deriving state from other signals
3. **Effects**: Managing side effects and persistence
4. **Fine-grained Reactivity**: How signals optimize performance
5. **Migration Patterns**: Moving from RxJS to Signals

### What's Next

The Advanced Level will introduce:
- **Resource API** for data fetching and caching
- **Advanced signal patterns** and compositions
- **Performance monitoring** and optimization
- **Production-ready patterns** and error handling
- **Complex state synchronization** scenarios

## 💡 Key Takeaways

### Signals Advantages

**Simplicity**:
- No manual subscription management
- Declarative computed values
- Automatic cleanup

**Performance**:
- Fine-grained change detection
- Efficient memory usage
- Optimal re-render cycles

**Developer Experience**:
- Better debugging with DevTools
- Improved TypeScript inference
- Easier testing patterns

### When to Use Signals vs RxJS

**Use Signals for**:
- ✅ Local component state
- ✅ Computed derived values
- ✅ Simple reactive patterns
- ✅ New applications

**Use RxJS for**:
- ✅ Complex async operations
- ✅ Event streams and transformations
- ✅ Advanced operators (debounce, retry, etc.)
- ✅ Existing RxJS-heavy codebases

### Migration Strategy

1. **Start with new features** using Signals
2. **Gradually migrate simple state** from RxJS
3. **Keep complex async operations** in RxJS initially
4. **Use interop patterns** for mixed approaches
5. **Migrate incrementally** without breaking changes

---

**Next:** [Advanced Level - Resource API + Performance](./ADVANCED.md)
