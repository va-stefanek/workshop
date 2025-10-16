// step-3-signal-store/cart-features.ts - FULLY TYPED VERSION
import {
  signalStoreFeature,
  withHooks,
  withMethods,
  patchState,
  type,
  getState
} from '@ngrx/signals';
import { effect, Signal } from '@angular/core';
import { CartItem } from '../../shared/models';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Required state shape for localStorage feature
 */
type CartItemsState = {
  items: CartItem[];
};

/**
 * Required state shape for logging feature
 */
type LoggableState = {
  items: CartItem[];
  total?: Signal<number>;
  itemCount?: Signal<number>;
};

// ============================================
// FEATURE 1: localStorage Persistence (FULLY TYPED)
// ============================================

/**
 * Adds localStorage persistence to any store with `items` state.
 * Automatically loads on init and saves on every change.
 *
 * @param key - localStorage key to use
 *
 * @example
 * ```ts
 * export const MyStore = signalStore(
 *   withState({ items: [] }),
 *   withLocalStorage('my-store-key')
 * );
 * ```
 */
export function withLocalStorage<_>(key: string) {
  return signalStoreFeature(
    // ✅ Define required input type
    { state: type<CartItemsState>() },

    withHooks({
      onInit(store) {
        // ✅ Load from localStorage on init
        if (typeof localStorage !== 'undefined') {
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              const items = JSON.parse(saved) as CartItem[];
              // ✅ Properly typed patchState
              patchState(store, { items });
              console.log(`✅ [${key}] Loaded ${items.length} items from localStorage`);
            } catch (error) {
              console.error(`❌ [${key}] Error loading from localStorage:`, error);
            }
          }
        }

        // ✅ Auto-save on every change
        effect(() => {
          if (typeof localStorage !== 'undefined') {
            // ✅ Use getState to access current state
            localStorage.setItem(key, JSON.stringify(store.items()));
            console.log(`💾 [${key}] Saved ${store.items().length} items to localStorage`);
          }
        });
      },

      onDestroy() {
        console.log(`🔴 [${key}] Store destroyed`);
      }
    })
  );
}

// ============================================
// FEATURE 2: Action Logging (FULLY TYPED)
// ============================================

/**
 * Adds console logging for all state changes.
 * Logs items count, total, and full state.
 *
 * @example
 * ```ts
 * export const MyStore = signalStore(
 *   withState({ items: [] }),
 *   withLogging()
 * );
 * ```
 */
export function withLogging<_>() {
  return signalStoreFeature(
    // ✅ Define required input type
    { state: type<CartItemsState>() },

    withHooks({
      onInit(store) {
        console.log('📊 [Logging] Feature initialized');

        // ✅ Log on every state change
        effect(() => {
          // ✅ Use getState for properly typed access
          const state = getState(store);

          console.log('📝 [Cart Store] State updated:', {
            itemCount: state.items.length,
            items: state.items,
            timestamp: new Date().toISOString()
          });
        });
      }
    })
  );
}

// ============================================
// FEATURE 3: Analytics Tracking (FULLY TYPED)
// ============================================

/**
 * Tracks cart changes to analytics service.
 * Requires store to have `items` state and `total`/`itemCount` computed.
 *
 * @example
 * ```ts
 * export const MyStore = signalStore(
 *   withState({ items: [] }),
 *   withComputed(({ items }) => ({
 *     total: computed(() => ...),
 *     itemCount: computed(() => ...)
 *   })),
 *   withAnalytics()
 * );
 * ```
 */
// step-3-signal-store/cart-features.ts - FIXED

export function withAnalytics<_>() {
  return signalStoreFeature(
    { state: type<CartItemsState>() },

    withHooks({
      onInit(store) {
        console.log('📈 [Analytics] Feature initialized');

        effect(() => {
          // ✅ Use getState for typed access
          const state = getState(store);

          // ✅ FIX: state.items is already a plain array, not a signal
          const itemCount = state.items.length;

          // Track to analytics (if available)
          if (typeof window !== 'undefined' && (window as any).analytics) {
            (window as any).analytics.track('cart_updated', {
              itemCount,
              timestamp: new Date().toISOString()
            });
          }

          console.log('📈 [Analytics] Cart updated:', {
            itemCount,
            items: state.items
          });
        });
      }
    })
  );
}

// ============================================
// FEATURE 4: Clear Cart with Confirmation (FULLY TYPED + METHODS)
// ============================================

/**
 * Adds a method to clear cart with browser confirmation.
 * Requires store to have `items` state.
 *
 * @example
 * ```ts
 * export const MyStore = signalStore(
 *   withState({ items: [] }),
 *   withClearConfirmation()
 * );
 * // Usage: store.clearWithConfirmation()
 * ```
 */
export function withClearConfirmation<_>() {
  return signalStoreFeature(
    // ✅ Define required input type
    { state: type<CartItemsState>() },

    withMethods((store) => ({
      /**
       * Clears cart after user confirmation
       * @returns true if cleared, false if cancelled
       */
      clearWithConfirmation(): boolean {
        const state = getState(store);

        if (state.items.length === 0) {
          alert('Cart is already empty!');
          return false;
        }

        const confirmed = confirm(
          `Are you sure you want to clear ${state.items.length} items from cart?`
        );

        if (confirmed) {
          patchState(store, { items: [] });
          console.log('✅ Cart cleared by user');
          return true;
        }

        console.log('❌ Clear cancelled by user');
        return false;
      }
    }))
  );
}

// ============================================
// FEATURE 5: Item Count Badge (COMPUTED ONLY)
// ============================================

/**
 * Adds helper computed signals for UI badges.
 * Requires store to have `items` state.
 */
export function withItemBadge<_>() {
  return signalStoreFeature(
    { state: type<CartItemsState>() },

    withMethods((store) => ({
      /**
       * Gets badge text for UI
       * Returns "99+" for counts over 99
       */
      getBadgeText(): string {
        const state = getState(store);
        const count = state.items.length;
        return count > 99 ? '99+' : count.toString();
      },

      /**
       * Gets CSS class for badge based on item count
       */
      getBadgeClass(): string {
        const state = getState(store);
        const count = state.items.length;

        if (count === 0) return 'badge-empty';
        if (count < 5) return 'badge-low';
        if (count < 10) return 'badge-medium';
        return 'badge-high';
      }
    }))
  );
}

// ============================================
// WORKSHOP EXCLUSIVE FEATURES (TEASER)
// ============================================

/**
 * Undo/Redo functionality
 * 🎓 WORKSHOP EXCLUSIVE - Full implementation in 8-hour workshop
 */
export function withUndoRedo<_>() {
  return signalStoreFeature(
    { state: type<CartItemsState>() },

    withMethods((store) => ({
      undo() {
        console.log('⏪ Undo - Full implementation in workshop!');
        console.log('🎓 Learn: State history management, time-travel debugging');
      },

      redo() {
        console.log('⏩ Redo - Full implementation in workshop!');
        console.log('🎓 Learn: Complex state transitions, immutability patterns');
      },

      canUndo(): boolean {
        console.log('🎓 Workshop: Implement history stack');
        return false;
      },

      canRedo(): boolean {
        console.log('🎓 Workshop: Implement future state management');
        return false;
      }
    }))
  );
}

/**
 * Optimistic updates for better UX
 * 🎓 WORKSHOP EXCLUSIVE
 */
export function withOptimisticUpdates<_>() {
  return signalStoreFeature(
    { state: type<CartItemsState>() },

    withMethods((store) => ({
      addItemOptimistically(item: CartItem) {
        console.log('⚡ Optimistic update - Full implementation in workshop!');
        console.log('🎓 Learn: Immediate UI updates, server reconciliation');

        // Teaser: Immediate update
        const state = getState(store);
        patchState(store, {
          items: [...state.items, item]
        });

        // Workshop: Add server sync + rollback on error
        console.log('🎓 Workshop: Error handling, rollback strategies');
      }
    }))
  );
}

/**
 * DevTools integration
 * 🎓 WORKSHOP EXCLUSIVE
 */
export function withDevtools<_>(name: string) {
  return signalStoreFeature(
    withHooks({
      onInit(store) {
        console.log(`🛠️ [DevTools] ${name} - Full integration in workshop!`);
        console.log('🎓 Learn: Redux DevTools, time-travel debugging, action replay');

        effect(() => {
          const state = getState(store);
          console.log(`🛠️ [${name}] State:`, state);
          // Workshop: Connect to Redux DevTools Extension
        });
      }
    })
  );
}

// ============================================
// FEATURE COMPOSITION EXAMPLE
// ============================================

/**
 * Combines multiple features into one
 * Example of feature composition pattern
 */
export function withCartPersistence<_>(key: string) {
  return signalStoreFeature(
    { state: type<CartItemsState>() },

    // ✅ Compose multiple features
    withLocalStorage(key),
    withLogging(),
    withAnalytics()
  );
}
