import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'standalone-product-detail',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="product-detail-container">
      <h1>Standalone Product Detail</h1>
      <p>TODO: Implement standalone product detail component</p>
      
      <nav>
        <a routerLink="/standalone" class="back-btn">← Back to Cart</a>
        <a routerLink="/standalone/products" class="back-btn">← Back to Products</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Route parameter handling without NgModules</li>
          <li>Product detail display</li>
          <li>Add to cart from detail view</li>
          <li>Related products recommendations</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './standalone-product-detail.component.css',
})
export class StandaloneProductDetailComponent {
}