import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'standalone-checkout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="checkout-container">
      <h1>Standalone Checkout</h1>
      <p>TODO: Implement standalone checkout component</p>
      
      <nav>
        <a routerLink="/standalone" class="back-btn">← Back to Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Multi-step checkout without NgModules</li>
          <li>Form handling with standalone components</li>
          <li>Payment processing integration</li>
          <li>Order confirmation flow</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './standalone-checkout.component.css',
})
export class StandaloneCheckoutComponent {
}