import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../shared/models';

export const RESOURCE_RETRY_SOURCE = `private http = inject(HttpClient);
shouldFail = signal(false); // a checkbox in the UI

products = resource({
  loader: async () => {
    await new Promise((r) => setTimeout(r, 600)); // visible loading state
    if (this.shouldFail()) {
      throw new Error('Simulated 503 — server unavailable');
    }
    return firstValueFrom(this.http.get<Product[]>('api/products'));
  },
});

// THE point: re-run the loader on demand — that's how you retry a resource.
retry() { this.products.reload(); }`;

@Component({
  selector: 'demo-resource-retry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo.css',
  template: `
    <div class="demo">
      <label class="check">
        <input
          type="checkbox"
          [checked]="shouldFail()"
          (change)="shouldFail.set($any($event.target).checked)"
        />
        Simulate a failing request on the next load
      </label>

      @if (products.isLoading()) {
        <p class="loading">Loading… <span class="spinner"></span></p>
      } @else if (products.error(); as err) {
        <div class="error-box">
          <p class="error">⚠ {{ err.message }}</p>
          <button class="btn btn--primary" (click)="retry()">↻ Retry</button>
        </div>
      } @else if (products.value(); as list) {
        <p class="kv"><span>✓ Loaded</span><strong>{{ list.length }} product(s)</strong></p>
        <button class="btn btn--ghost btn--sm" (click)="retry()">↻ Reload</button>
      }

      <p class="hint">
        Tick the box → <strong>Retry</strong> → error state. Untick → <strong>Retry</strong> → success.
        <code>reload()</code> re-runs the loader on demand.
      </p>
    </div>
  `,
})
export class ResourceRetryDemoComponent {
  private readonly http = inject(HttpClient);
  readonly shouldFail = signal(false);

  readonly products = resource({
    loader: async () => {
      await new Promise((r) => setTimeout(r, 600));
      if (this.shouldFail()) {
        throw new Error('Simulated 503 — server unavailable');
      }
      return firstValueFrom(this.http.get<Product[]>('api/products'));
    },
  });

  retry(): void {
    this.products.reload();
  }
}
