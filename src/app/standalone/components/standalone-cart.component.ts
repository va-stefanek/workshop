import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StandaloneCartService } from '../services/standalone-cart.service';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';

// TODO: Import shared standalone components
// These will be created as part of the exercise
// import { StandaloneProductCardComponent } from '../shared/standalone-product-card.component';
// import { StandaloneCartSummaryComponent } from '../shared/standalone-cart-summary.component';

@Component({
  selector: 'standalone-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // TODO: Add standalone component imports here
    // StandaloneProductCardComponent,
    // StandaloneCartSummaryComponent
  ],
  template: `
    <div class="standalone-cart-container">
      <header class="page-header">
        <h1>Standalone Shopping Cart</h1>
        <p>Built without NgModules - Pure standalone component architecture</p>
    
        <nav class="feature-nav">
          <a routerLink="/standalone" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Cart</a>
          <a routerLink="/standalone/products" routerLinkActive="active">Products</a>
          <a routerLink="/standalone/checkout" routerLinkActive="active">Checkout</a>
          <a routerLink="/standalone/migration" routerLinkActive="active">Migration Demo</a>
        </nav>
      </header>
    
      <!-- Cart Status using new control flow -->
      <section class="cart-section">
        @if (cartService.items().length > 0) {
          <div>
            <div class="cart-header">
              <h2>Your Cart ({{ cartService.summary().totalItems }} items)</h2>
              <div class="cart-actions">
                <button (click)="clearCart()" class="clear-btn">Clear Cart</button>
                <button routerLink="/standalone/checkout" class="checkout-btn">
                  Checkout - {{ cartService.summary().finalPrice | currency }}
                </button>
              </div>
            </div>
            <!-- Cart Items List -->
            <div class="cart-items">
              @for (item of cartService.items(); track trackByItemId($index, item)) {
                <div
                  class="cart-item">
                  <div class="item-info">
                    <img [src]="item.image || 'assets/placeholder.jpg'" [alt]="item.name" class="item-image">
                    <div class="item-details">
                      <h4>{{ item.name }}</h4>
                      <p class="item-category">{{ item.category }}</p>
                      <p class="item-price">{{ item.price | currency }}</p>
                      @if (item.discount && item.discount > 0) {
                        <div class="discount-info">
                          <span class="discount-badge">{{ item.discount }}% OFF</span>
                          <span class="original-price">{{ item.price / (1 - (item.discount || 0)/100) | currency }}</span>
                        </div>
                      }
                    </div>
                  </div>
                  <div class="item-controls">
                    <div class="quantity-controls">
                      @if (item.quantity > 1) {
                        <button
                          (click)="decreaseQuantity(item.id)"
                        class="quantity-btn">-</button>
                      } @else {
                        <button (click)="removeItem(item.id)" class="remove-btn">Remove</button>
                      }
                      <span class="quantity">{{ item.quantity }}</span>
                      <button (click)="increaseQuantity(item.id)" class="quantity-btn">+</button>
                    </div>
                    <div class="item-total">
                      {{ (item.price * item.quantity) | currency }}
                    </div>
                  </div>
                </div>
              }
            </div>
            <!-- Cart Summary -->
            <div class="cart-summary">
              <!-- TODO: Replace with standalone-cart-summary component -->
              <div class="summary-details">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>{{ cartService.summary().totalPrice | currency }}</span>
                </div>
                @if (cartService.summary().totalDiscount > 0) {
                  <div class="summary-row discount">
                    <span>Discount:</span>
                    <span>-{{ cartService.summary().totalDiscount | currency }}</span>
                  </div>
                }
                <div class="summary-row">
                  <span>Tax:</span>
                  <span>{{ cartService.summary().tax | currency }}</span>
                </div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>{{ cartService.summary().finalPrice | currency }}</span>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Browse our standalone products to get started!</p>
            <a routerLink="/standalone/products" class="browse-btn">Browse Products</a>
          </div>
        }
    
      </section>
    
      <!-- Quick Add Products -->
      <section class="quick-add-section">
        <h2>Quick Add Products</h2>
        <p>Sample products to test the standalone cart functionality</p>
    
        <div class="quick-products">
          @for (product of sampleProducts(); track trackByProductId($index, product)) {
            <div
              class="quick-product">
              <!-- TODO: Replace with standalone-product-card component -->
              <div class="product-card">
                <img [src]="product.image || 'assets/placeholder.jpg'" [alt]="product.name">
                <div class="product-info">
                  <h4>{{ product.name }}</h4>
                  <p class="product-category">{{ product.category }}</p>
                  <p class="product-price">{{ product.price | currency }}</p>
                  @if (!isProductInCart(product.id)) {
                    <button
                      (click)="addToCart(product)"
                      class="add-to-cart-btn">
                      Add to Cart
                    </button>
                  } @else {
                    <button class="in-cart-btn" disabled>
                      ✓ In Cart
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    
      <!-- Standalone Features Demo -->
      <section class="standalone-features">
        <h2>Standalone Component Features</h2>
    
        <div class="features-grid">
          <div class="feature-card">
            <h3>🚀 No NgModules</h3>
            <p>This entire cart works without any NgModule declarations</p>
            <ul>
              <li>Direct component imports</li>
              <li>Lazy loading without modules</li>
              <li>Simplified dependency management</li>
            </ul>
          </div>
    
          <div class="feature-card">
            <h3>⚡ Modern inject()</h3>
            <p>Services are injected using the modern inject() function</p>
            <ul>
              <li>Field-based injection</li>
              <li>Optional dependencies</li>
              <li>Functional composition</li>
            </ul>
          </div>
    
          <div class="feature-card">
            <h3>🔄 New Control Flow</h3>
            <p>Templates use &#64;if, &#64;for, &#64;switch syntax</p>
            <ul>
              <li>Better performance</li>
              <li>Cleaner syntax</li>
              <li>Type safety improvements</li>
            </ul>
          </div>
    
          <div class="feature-card">
            <h3>📦 Tree Shaking</h3>
            <p>Better bundle optimization through precise imports</p>
            <ul>
              <li>Smaller bundle sizes</li>
              <li>Unused code elimination</li>
              <li>Better loading performance</li>
            </ul>
          </div>
        </div>
      </section>
    
      <!-- Development Tools -->
      <section class="dev-tools">
        <h2>Development Tools</h2>
    
        <div class="tools-grid">
          <div class="tool">
            <h4>Cart State</h4>
            <pre>{{ cartService.items() | json }}</pre>
          </div>
    
          <div class="tool">
            <h4>Service Metadata</h4>
            <pre>{{ cartService.metadata() | json }}</pre>
          </div>
    
          <div class="tool">
            <h4>Standalone Architecture</h4>
            <p>Module-free components</p>
            <p>Direct service injection</p>
            <p>Optimized tree-shaking</p>
          </div>
        </div>
      </section>
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./standalone-cart.component.css']
})
export class StandaloneCartComponent {
  // Modern dependency injection using inject()
  // TODO: Students will learn about this pattern
  constructor(
    public cartService: StandaloneCartService,
    private productService: ProductService
  ) {
    this.loadSampleProducts();
  }

  // Component state
  sampleProducts = signal<Product[]>([]);

  // Computed values
  isEmpty = computed(() => this.cartService.items().length === 0);
  hasDiscount = computed(() => this.cartService.summary().totalDiscount > 0);

  // Event handlers
  addToCart(product: Product) {
    this.cartService.addItem(product);
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  increaseQuantity(itemId: string) {
    const item = this.cartService.items().find(i => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: string) {
    const item = this.cartService.items().find(i => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }

  isProductInCart(productId: string): boolean {
    return this.cartService.items().some(item => item.productId === productId);
  }

  // Track by functions (will be simplified with @for)
  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  // Private methods
  private loadSampleProducts() {
    // Load sample products for demonstration
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Take first 6 products as samples
        this.sampleProducts.set(products.slice(0, 6));
      },
      error: (error) => {
        console.error('Failed to load sample products:', error);
        // Fallback sample products
        this.sampleProducts.set([
          {
            id: 'sample-1',
            name: 'Laptop Pro',
            price: 999,
            category: 'electronics',
            image: 'assets/laptop.jpg',
            inStock: true,
            description: 'High-performance laptop',
            rating: 4.5,
            tags: ['laptop', 'computer']
          },
          {
            id: 'sample-2',
            name: 'Wireless Mouse',
            price: 29,
            category: 'electronics',
            image: 'assets/mouse.jpg',
            inStock: true,
            description: 'Ergonomic wireless mouse',
            rating: 4.0,
            tags: ['mouse', 'wireless']
          }
        ]);
      }
    });
  }

}