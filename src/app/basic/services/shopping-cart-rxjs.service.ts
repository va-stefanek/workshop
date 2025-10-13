// step-1-rxjs/cart-rxjs.service.ts - UPROSZCZONA WERSJA
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, Product } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class CartRxjsService {
  // ❌ The old way - verbose
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  addItem(product: Product): void {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.productId === product.id);

    if (existingItem) {
      const updatedItems = currentItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      this.itemsSubject.next(updatedItems);
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
      this.itemsSubject.next([...currentItems, newItem]);
    }
  }

  removeItem(productId: string): void {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(currentItems.filter(item => item.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(
      currentItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  // ❌ Complex computed values with pipe/map
  getTotal(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.price * item.quantity, 0))
    );
  }

  getItemCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
}
