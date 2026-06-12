import { Injectable, inject } from '@angular/core';
import { filter, firstValueFrom, take } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';

/**
 * 📊 "HEAVY" REPORT SERVICE — the lazy-loading target for injectAsync
 *
 * Pretend this service pulls in a large charting/PDF library. Thanks to
 * `injectAsync(() => import('./cart-report.service')...)` in the demo
 * component, this file (and everything it imports) lands in its OWN lazy
 * chunk and is only downloaded when the report is actually requested.
 *
 * REQUIREMENT: a lazily injected service must be auto-provided —
 * `@Injectable({ providedIn: 'root' })` (or `@Service()`). A service listed
 * in a providers array could not be loaded this way.
 *
 * Watch the console: the constructor logs the moment the chunk arrives.
 */
@Injectable({ providedIn: 'root' })
export class CartReportService {
  private productService = inject(ProductService);

  constructor() {
    console.log('📦 CartReportService chunk loaded and instantiated!');
  }

  async generateCatalogReport(): Promise<string> {
    const products = await firstValueFrom(
      this.productService.getProducts().pipe(
        filter(list => list.length > 0),
        take(1)
      )
    );

    const byCategory = new Map<string, { count: number; value: number }>();
    for (const p of products) {
      const entry = byCategory.get(p.category) ?? { count: 0, value: 0 };
      entry.count++;
      entry.value += p.price;
      byCategory.set(p.category, entry);
    }

    const lines = [...byCategory.entries()]
      .sort((a, b) => b[1].value - a[1].value)
      .map(([category, { count, value }]) =>
        `${category.padEnd(12)} ${String(count).padStart(3)} products  $${value.toFixed(2)}`);

    const total = products.reduce((sum, p) => sum + p.price, 0);
    return [
      `CATALOG REPORT — ${new Date().toLocaleTimeString()}`,
      ''.padEnd(40, '─'),
      ...lines,
      ''.padEnd(40, '─'),
      `TOTAL        ${String(products.length).padStart(3)} products  $${total.toFixed(2)}`,
    ].join('\n');
  }
}
