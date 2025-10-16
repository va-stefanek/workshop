// step-3-signal-store/cart-store.component.ts
import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from './cart.store';
import {Product} from '../shared/models';
import {Control, form} from '@angular/forms/signals';

@Component({
  selector: 'app-cart-store',
  standalone: true,
  imports: [CommonModule, Control],
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

        <input [control]="filterForm.query">

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
  styles: [`
    .cart-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .cart-header h1 {
      margin: 0;
      color: #333;
    }

    .badge {
      background: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: bold;
    }

    .products, .cart {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.5rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .product-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .price {
      font-size: 1.25rem;
      font-weight: bold;
      color: #007bff;
      margin: 0.5rem 0;
    }

    .cart-items {
      margin-bottom: 1.5rem;
    }

    .cart-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 1rem;
      background: #fafafa;
    }

    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details {
      flex: 1;
    }

    .item-details h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .item-category {
      color: #666;
      font-size: 0.85rem;
      margin: 0;
    }

    .item-price {
      color: #007bff;
      margin: 0.25rem 0 0 0;
    }

    .item-controls {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .quantity-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .quantity-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #007bff;
      background: white;
      color: #007bff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .quantity-btn:hover:not(:disabled) {
      background: #007bff;
      color: white;
    }

    .quantity-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .quantity {
      min-width: 30px;
      text-align: center;
      font-weight: bold;
    }

    .item-total {
      font-weight: bold;
      color: #007bff;
      font-size: 1.1rem;
    }

    .btn-remove {
      width: 32px;
      height: 32px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.2rem;
      transition: background 0.2s;
    }

    .btn-remove:hover {
      background: #c82333;
    }

    .empty-cart {
      text-align: center;
      padding: 3rem 1rem;
      color: #666;
    }

    .empty-cart p:first-child {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .hint {
      font-size: 0.9rem;
    }

    .cart-summary {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1.5rem;
    }

    .cart-summary h3 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }

    .summary-line.total {
      font-size: 1.5rem;
      font-weight: bold;
      padding-top: 1rem;
      margin-top: 1rem;
      border-top: 2px solid #dee2e6;
      color: #007bff;
    }

    .cart-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-outline {
      background: white;
      color: #007bff;
      border: 2px solid #007bff;
    }

    .btn-outline:hover {
      background: #007bff;
      color: white;
    }

    .debug-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 2rem;
      border: 1px solid #dee2e6;
    }

    .debug-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }

    .debug-info pre {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0;
      font-size: 0.85rem;
    }
  `]
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
