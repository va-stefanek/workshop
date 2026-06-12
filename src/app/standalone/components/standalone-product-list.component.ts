import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'standalone-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-list-container">
      <h1>Standalone Product List</h1>
      <p>TODO: Implement standalone product list component</p>
      
      <nav>
        <a routerLink="/standalone" class="back-btn">← Back to Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Standalone product catalog</li>
          <li>Advanced filtering without NgModules</li>
          <li>Lazy loading of product details</li>
          <li>Modern inject() patterns</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './standalone-product-list.component.css',
})
export class StandaloneProductListComponent {
}