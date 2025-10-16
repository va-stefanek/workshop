// step-3-signal-store/cart.store.ts
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState, withProps, signalMethod
} from '@ngrx/signals';
import { computed } from '@angular/core';
import {CartItem, Product} from '../shared/models';
import {withLocalStorage, withLogging} from './cart-features/cart-features';

// ============================================
// STATE INTERFACE
// ============================================
interface CartState {
  items: CartItem[];
  filteredItems: CartItem[];
  loading: boolean;
  query: string;
}

// ============================================
// SIGNAL STORE
// ============================================
export const CartStore = signalStore(
  { providedIn: 'root' },

  // ============================================
  // 1. STATE - Initial values
  // ============================================
  withState<CartState>({
    items: [],
    filteredItems: [],
    loading: false,
    query: ''
  }),

  // ============================================
  // 2. COMPUTED - Derived state (automatic & memoized)
  // ============================================
  withProps(({ items, query }) => ({
    // Total price
    total: computed(() =>
      items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
    ),

    filteredItems: computed(() => {
      if(!query().length) {
        return items()
      }

      return items().filter(item => item.name.toLowerCase().includes(query().toLowerCase()))
    }),

    // Total item count
    itemCount: computed(() =>
      items().reduce((sum, item) => sum + item.quantity, 0)
    ),

    // Is cart empty
    isEmpty: computed(() => items().length === 0),

    // Has items
    hasItems: computed(() => items().length > 0),

    // Tax (8%)
    tax: computed(() => {
      const subtotal = items().reduce((sum, item) =>
        sum + (item.price * item.quantity), 0
      );
      return subtotal * 0.08;
    }),

    // Final price (with tax)
    finalPrice: computed(() => {
      const subtotal = items().reduce((sum, item) =>
        sum + (item.price * item.quantity), 0
      );
      const tax = subtotal * 0.08;
      return subtotal + tax;
    })
  })),

  // ============================================
  // 3. METHODS - Actions (type-safe operations)
  // ============================================
  withMethods((store) => ({
    /**
     * Add item to cart
     * If item exists, increases quantity
     * If item doesn't exist, adds new item with quantity 1
     */
    addItem(product: Product): void {
      const currentItems = store.items();
      const existingItem = currentItems.find(item => item.productId === product.id);

      if (existingItem) {
        // Item exists - increase quantity
        patchState(store, {
          items: currentItems.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        });
      } else {
        // Item doesn't exist - add new
        const newItem: CartItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category,
          discount: product.discount || 0
        };

        patchState(store, {
          items: [...currentItems, newItem]
        });
      }
    },

    /**
     * Remove item from cart by productId
     */
    removeItem(productId: string): void {
      patchState(store, {
        items: store.items().filter(item => item.productId !== productId)
      });
    },

    /**
     * Update item quantity
     * If quantity <= 0, removes the item
     */
    updateQuantity(productId: string, quantity: number): void {
      if (quantity <= 0) {
        this.removeItem(productId);
        return;
      }

      patchState(store, {
        items: store.items().map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      });
    },

    /**
     * Increment item quantity by 1
     */
    incrementQuantity(productId: string): void {
      const item = store.items().find(i => i.productId === productId);
      if (item) {
        this.updateQuantity(productId, item.quantity + 1);
      }
    },

    /**
     * Decrement item quantity by 1
     */
    decrementQuantity(productId: string): void {
      const item = store.items().find(i => i.productId === productId);
      if (item) {
        this.updateQuantity(productId, item.quantity - 1);
      }
    },

    /**
     * Clear entire cart
     */
    clearCart(): void {
      patchState(store, { items: [] });
    },

    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
      patchState(store, { loading });
    },

    /**
     * Get item by productId
     */
    getItem(productId: string): CartItem | undefined {
      return store.items().find(item => item.productId === productId);
    },

    /**
     * Check if item exists in cart
     */
    hasItem(productId: string): boolean {
      return store.items().some(item => item.productId === productId);
    },

    syncQuery: signalMethod<string>((query) => {
      patchState(store, {
        query
      })
    }),
  })),

  // ============================================
  // 4. CUSTOM FEATURES - Reusable functionality
  // ============================================
  withLocalStorage('cart-items-signal-store'),
  withLogging()
);
