// step-1-rxjs/cart-rxjs.component.ts - PROSTSZA WERSJA
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShoppingCartRxjsService} from '../services/shopping-cart-rxjs.service';
import {Product} from '../../shared/models';
import {httpResource} from '@angular/common/http';

@Component({
  selector: 'app-cart-rxjs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart - RxJS Version</h1>

      <!-- Products -->
      <section class="products">
        <h2>Available Products</h2>
        @for (product of sampleProducts; track product.id) {
          <div class="product-card">
            <h3>{{ product.name }}</h3>
            <p>\${{ product.price }}</p>
            <button (click)="cartService.addItem(product)">
              Add to Cart
            </button>
          </div>
        }
      </section>

      <!-- Cart Items -->
      <section class="cart">
        <h2>Cart ({{ cartService.getTotalItems() | async }} items)</h2>

        @if ((cartService.items$ | async)?.length === 0) {
          <p>Your cart is empty</p>
        }

        @for (item of cartService.items$ | async; track item.id) {
          <div class="cart-item">
            <span>{{ item.name }} - \${{ item.price }}</span>
            <div class="quantity-controls">
              <button (click)="cartService.updateQuantity(item.productId, item.quantity - 1)">
                -
              </button>
              <span>{{ item.quantity }}</span>
              <button (click)="cartService.updateQuantity(item.productId, item.quantity + 1)">
                +
              </button>
            </div>
            <button (click)="cartService.removeItem(item.productId)">
              Remove
            </button>
          </div>
        }

        @if ((cartService.items$ | async)?.length! > 0) {
          <div class="cart-total">
            <h3>Total: \${{ (cartService.getCartSummary() | async)?.finalPrice?.toFixed(2) }}</h3>
            <button (click)="cartService.clearCart()">Clear Cart</button>
          </div>
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cart-rxjs.component.css',
})
export class CartRxjsComponent {
  cartService = inject(ShoppingCartRxjsService);
  items = httpResource(() => 'api/products')

  // Sample products for demo
  sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      price: 999,
      description: 'High-performance laptop',
      image: 'https://via.placeholder.com/150',
      category: 'Electronics',
      inStock: true,
      rating: 2
    },
    {
      id: '2',
      name: 'Mouse',
      price: 29,
      description: 'Wireless mouse',
      image: 'https://via.placeholder.com/150',
      category: 'Electronics',
      inStock: true,
      rating: 2
    },
    {
      id: '3',
      name: 'Keyboard',
      price: 79,
      description: 'Mechanical keyboard',
      image: 'https://via.placeholder.com/150',
      category: 'Electronics',
      inStock: true,
      rating: 2
    }
  ];
}
