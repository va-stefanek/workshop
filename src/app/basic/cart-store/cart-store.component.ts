// step-3-signal-store/cart-store.component.ts
import {Component, inject, signal, ChangeDetectionStrategy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../cart.store';
import {Product} from '../../shared/models';
import {FormField, form} from '@angular/forms/signals';

@Component({
  selector: 'app-cart-store',
  standalone: true,
  imports: [CommonModule, FormField],
  template: `
    <div class="cart-container">
      <header class="cart-header">
        <h1>Shopping Cart - Signal Store 🚀</h1>
        <div class="badge">{{ cartStore.itemCount() }} items</div>
      </header>

      <!-- Products Section -->
      <section class="products">
        <h2>Available Products</h2>
        <div class="products-grid">
          @for (product of sampleProducts; track product.id) {
            <div class="product-card">
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="description">{{ product.description }}</p>
                <p class="price">\${{ product.price }}</p>
                <button
                  class="btn btn-primary"
                  [disabled]="!product.inStock"
                  (click)="cartStore.addItem(product)">
                  {{ cartStore.hasItem(product.id) ? 'Add More' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Cart Items Section -->
      <section class="cart">
        <h2>Your Cart</h2>

        @if (cartStore.isEmpty()) {
          <div class="empty-cart">
            <p>🛒 Your cart is empty</p>
            <p class="hint">Add some products to get started!</p>
          </div>
        }

        <input [formField]="filterForm.query">

        @if (cartStore.hasItems()) {
          <div class="cart-items">
            @for (item of cartStore.filteredItems(); track item.id) {
              <div class="cart-item">
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p class="item-category">{{ item.category }}</p>
                  <p class="item-price">\${{ item.price }} each</p>
                </div>

                <div class="item-controls">
                  <div class="quantity-controls">
                    <button
                      class="quantity-btn"
                      (click)="cartStore.decrementQuantity(item.productId)"
                      [disabled]="item.quantity <= 1">
                      −
                    </button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button
                      class="quantity-btn"
                      (click)="cartStore.incrementQuantity(item.productId)">
                      +
                    </button>
                  </div>

                  <div class="item-total">
                    \${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>

                <button
                  class="btn-remove"
                  (click)="cartStore.removeItem(item.productId)"
                  title="Remove item">
                  ✕
                </button>
              </div>
            }
          </div>

          <!-- Cart Summary -->
          <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-line">
              <span>Subtotal ({{ cartStore.itemCount() }} items):</span>
              <span>\${{ cartStore.total().toFixed(2) }}</span>
            </div>
            <div class="summary-line">
              <span>Tax (8%):</span>
              <span>\${{ cartStore.tax().toFixed(2) }}</span>
            </div>
            <div class="summary-line total">
              <span>Total:</span>
              <span>\${{ cartStore.finalPrice().toFixed(2) }}</span>
            </div>
            <div class="cart-actions">
              <button class="btn btn-outline" (click)="cartStore.clearCart()">
                Clear Cart
              </button>
              <button class="btn btn-primary">
                Checkout
              </button>
            </div>
          </div>
        }
      </section>
    </div>

    <!-- Debug Info (remove for production) -->
    <div class="debug-info">
      <h3>🔍 Debug Info</h3>
      <pre>{{ {
        itemCount: cartStore.itemCount(),
        total: cartStore.total(),
        isEmpty: cartStore.isEmpty(),
        hasItems: cartStore.hasItems()
      } | json }}</pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cart-store.component.css',
})
export class CartStoreComponent {
  // ✅ Inject Signal Store - that's it!
  cartStore = inject(CartStore);
  //
  filterForm = form(signal({
    query: ''
  }))

  constructor() {
    this.cartStore.syncQuery(this.filterForm.query().value)
  }

  // Sample products for demo
  sampleProducts: Product[] = [
    {
      id: '1',
      name: 'MacBook Pro',
      price: 1999,
      description: 'High-performance laptop for professionals',
      image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=MacBook+Pro',
      category: 'Electronics',
      inStock: true,
      rating: 5
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      price: 29,
      description: 'Ergonomic wireless mouse',
      image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Mouse',
      category: 'Electronics',
      inStock: true,
      rating: 5
    },
    {
      id: '3',
      name: 'Mechanical Keyboard',
      price: 129,
      description: 'RGB mechanical keyboard',
      image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Keyboard',
      category: 'Electronics',
      inStock: true,
      rating: 5
    },
    {
      id: '4',
      name: 'USB-C Hub',
      price: 49,
      description: '7-in-1 USB-C hub adapter',
      image: 'https://via.placeholder.com/300x200/ffc107/ffffff?text=USB-C+Hub',
      category: 'Accessories',
      inStock: true,
      rating: 5
    },
    {
      id: '5',
      name: 'Laptop Stand',
      price: 39,
      description: 'Aluminum laptop stand',
      image: 'https://via.placeholder.com/300x200/17a2b8/ffffff?text=Laptop+Stand',
      category: 'Accessories',
      inStock: true,
      rating: 5
    },
    {
      id: '6',
      name: 'Headphones',
      price: 199,
      description: 'Noise-cancelling headphones',
      image: 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Headphones',
      category: 'Electronics',
      inStock: true,
      rating: 5
    }
  ];
}
