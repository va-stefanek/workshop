// step-2-signals/cart-signals.component.ts
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartSignalsService} from './services/cart-signals.service';
import {Product} from '../shared/models';
import {CartStore} from './cart.store';

@Component({
  selector: 'app-cart-signals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart - Signals Version</h1>

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
        <h2>Cart ({{ cartService.itemCount() }} items)</h2>

        @if (cartService.cartItems().length === 0) {
          <p>Your cart is empty</p>
        }

        @for (item of cartService.cartItems(); track item.id) {
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

        @if (cartService.cartItems().length > 0) {
          <div class="cart-total">
            <h3>Total: \${{ cartService.total().toFixed(2) }}</h3>
            <button (click)="cartService.clearCart()">Clear Cart</button>
          </div>
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    .cart-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .products, .cart {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    .product-card, .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .quantity-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover {
      background: #0056b3;
    }

    .cart-total {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #e0e0e0;
    }
  `]
})
export class CartSignalsComponent {
  cartService = inject(CartSignalsService);
  cartStore = inject(CartStore);

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
