// step-2-signals/cart-signals.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class CartSignalsService {
  // ✅ Much simpler!
  private items = signal<CartItem[]>([]);
  public readonly cartItems = this.items.asReadonly();

  // ✅ Computed - automatic & memoized
  public readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  public readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  addItem(product: Product): void {
    const currentItems = this.items();
    const existingItem = currentItems.find(item => item.productId === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        discount: product.discount || 0
      };
      this.items.update(items => [...items, newItem]);
    }
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(item => item.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.items.update(items =>
      items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }

  clearCart(): void {
    this.items.set([]);
  }
}
