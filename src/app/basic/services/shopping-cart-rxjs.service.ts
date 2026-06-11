import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartRxjsService {
  // The reactive foundation is provided for you:
  // - BehaviorSubject holds the current state (last emitted value)
  // - New subscribers immediately get the current state
  // - asObservable() hides .next() from consumers
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    // TODO: Load items from localStorage if available
    // HINT: Call loadCartFromStorage() method
    // LEARNING: Initialize cart state when service is created
  }

  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item already exists in cart (by productId)
  // 2. If exists: increase quantity by 1 using updateQuantity()
  // 3. If not exists: create new CartItem and add to cart
  // 4. Save to localStorage after changes
  //
  // BUSINESS LOGIC:
  // - Each product can only appear once in cart (different quantities)
  // - New items start with quantity = 1
  // - Use immutable patterns (don't mutate existing arrays)
  //
  // HINTS:
  // - Get current items: this.itemsSubject.value
  // - Find existing: currentItems.find(item => item.productId === product.id)
  // - Create new CartItem with: id, productId, name, price, quantity, image, category, discount
  // - Update BehaviorSubject: this.itemsSubject.next(newArray)
  // - Generate ID: this.generateId()
  addItem(product: Product): void {
    throw new Error('addItem method not implemented yet');
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Remove item by productId from cart
  // 2. Update the BehaviorSubject with filtered array
  // 3. Save to localStorage
  //
  // HINTS:
  // - Get current items: this.itemsSubject.value
  // - Filter out target: currentItems.filter(item => item.productId !== productId)
  // - Update subject: this.itemsSubject.next(filteredItems)
  // - Save: this.saveCartToStorage()
  removeItem(productId: string): void {
    throw new Error('removeItem method not implemented yet');
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. If quantity <= 0, remove the item entirely
  // 2. Otherwise, update the item's quantity
  // 3. Save to localStorage
  //
  // EDGE CASES:
  // - Handle quantity 0 or negative (remove item)
  // - Update only the matching item, keep others unchanged
  //
  // HINTS:
  // - Check if quantity <= 0, then call this.removeItem(productId)
  // - Use map() to transform array: items.map(item => condition ? updatedItem : item)
  // - Use spread operator for immutable updates: { ...item, quantity }
  updateQuantity(productId: string, quantity: number): void {
    throw new Error('updateQuantity method not implemented yet');
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Set items to empty array
  // 2. Save to localStorage
  //
  // HINTS:
  // - Use this.itemsSubject.next([])
  // - Call this.saveCartToStorage()
  clearCart(): void {
    throw new Error('clearCart method not implemented yet');
  }

  // TODO: Implement getCartSummary method that returns Observable<CartSummary>
  // REQUIREMENTS:
  // 1. Calculate totalItems (sum of all quantities)
  // 2. Calculate totalPrice (sum of price * quantity for each item)
  // 3. Calculate totalDiscount (sum of discount amounts)
  // 4. Calculate tax (8% of subtotal after discounts)
  // 5. Calculate finalPrice (totalPrice - totalDiscount + tax)
  //
  // RXJS PATTERNS:
  // - Use this.items$.pipe(map(items => { ... }))
  // - Transform the items array into a CartSummary object
  // - This creates a reactive stream that updates when cart changes
  //
  // BUSINESS LOGIC:
  // - totalItems: sum of all item quantities
  // - totalPrice: sum of (price × quantity) for each item
  // - totalDiscount: sum of (price × quantity × discount%) for each item
  // - tax: 8% of (totalPrice - totalDiscount)
  // - finalPrice: totalPrice - totalDiscount + tax
  //
  // HINTS:
  // - Use reduce() for calculations: items.reduce((sum, item) => sum + value, 0)
  // - Discount calculation: (item.price * item.quantity * (item.discount || 0) / 100)
  // - Return CartSummary object with all calculated properties
  getCartSummary(): Observable<CartSummary> {
    // TEMPORARY: Placeholder stream so the page renders before you implement it
    return this.items$.pipe(
      map(() => ({
        totalItems: 0,
        totalPrice: 0,
        totalDiscount: 0,
        tax: 0,
        finalPrice: 0
      }))
    );
  }

  // TODO: Implement getTotalItems method
  // REQUIREMENTS:
  // 1. Return Observable<number> of total items count
  // 2. Use items$ observable and map to total quantity
  //
  // HINTS:
  // - Use this.items$.pipe(map(items => ...))
  // - Sum quantities: items.reduce((sum, item) => sum + item.quantity, 0)
  getTotalItems(): Observable<number> {
    // TEMPORARY: Placeholder stream so the page renders before you implement it
    return this.items$.pipe(map(() => 0));
  }

  // Helper methods (already implemented for you)
  // These handle utility functions like ID generation and localStorage
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart-items', JSON.stringify(this.itemsSubject.value));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems) as CartItem[];
          this.itemsSubject.next(items);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }
}
