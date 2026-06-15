import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Product } from '../../shared/models';

export const RESOURCE_SOURCE = `category = signal<'all' | 'electronics' | 'books'>('all');

// httpResource: a reactive HTTP request living in the signal graph.
// The URL is a function of signals, so it RE-FETCHES when category() changes.
products = httpResource<Product[]>(() =>
  this.category() === 'all'
    ? 'api/products'
    : 'api/products?category=' + this.category()
);

// products.isLoading()   products.error()   products.value()`;

@Component({
  selector: 'demo-resource',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo.css',
  template: `
    <div class="demo">
      <div class="row">
        @for (c of categories; track c) {
          <button
            class="btn btn--sm"
            [class.btn--primary]="c === category()"
            (click)="category.set(c)"
          >
            {{ c }}
          </button>
        }
      </div>

      @if (products.isLoading()) {
        <p class="loading">Loading… <span class="spinner"></span></p>
      } @else if (products.error()) {
        <p class="error">⚠ Failed to load products.</p>
      } @else if (products.value(); as list) {
        <p class="kv"><span>Loaded</span><strong>{{ list.length }} product(s)</strong></p>
        <ul class="product-list">
          @for (p of list; track p.id) {
            <li>
              <span class="grow">{{ p.name }}</span>
              <span class="muted">{{ p.category }}</span>
              <span>\${{ p.price }}</span>
            </li>
          }
        </ul>
      }

      <p class="hint">
        Switch category → the URL changes → <code>httpResource</code> re-fetches automatically.
        No manual subscribe, no <code>loading</code> flag to manage by hand.
      </p>
    </div>
  `,
})
export class ResourceDemoComponent {
  readonly categories = ['all', 'electronics', 'books'] as const;
  readonly category = signal<'all' | 'electronics' | 'books'>('all');

  readonly products = httpResource<Product[]>(() =>
    this.category() === 'all' ? 'api/products' : 'api/products?category=' + this.category(),
  );
}
