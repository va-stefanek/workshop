import { ChangeDetectionStrategy, Component, injectAsync, onIdle, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * ⏳ injectAsync() — ASYNCHRONOUS DEPENDENCY INJECTION (Angular 22)
 *
 * `inject()` resolves a dependency immediately — which means the service
 * (and everything it imports) must already be in the downloaded bundle.
 * `injectAsync()` flips that: you inject a FUNCTION that lazy-loads the
 * service's chunk on first call.
 *
 *   someSvc = injectAsync(() => import('...').then(m => m.SomeService));
 *   async onClick() { (await this.someSvc()).doWork(); }
 *
 * KEY FACTS:
 * - must be called in an injection context (field initializer, constructor)
 * - the target service must be auto-provided: @Injectable({providedIn:'root'})
 *   or @Service()
 * - repeated calls reuse the same promise/instance — the chunk loads once
 * - `{ prefetch: onIdle }` starts downloading the chunk when the browser
 *   is idle, so the first call doesn't pay the network cost
 */
@Component({
  selector: 'inject-async-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule],
  templateUrl: './inject-async-demo.component.html',
  styleUrl: './inject-async-demo.component.css',
})
export class InjectAsyncDemoComponent {
  // Variant 1: pure on-demand — the report chunk is NOT part of this page's
  // bundle; it downloads the first time generateReport() runs.
  // (Open the Network tab and click the button to watch it arrive.)
  private reportService = injectAsync(() =>
    import('../services/cart-report.service').then(m => m.CartReportService)
  );

  // Variant 2 (commented): same thing, but the chunk is prefetched when the
  // browser goes idle — first click resolves instantly:
  //
  // private reportService = injectAsync(
  //   () => import('../services/cart-report.service').then(m => m.CartReportService),
  //   { prefetch: onIdle }
  // );

  protected readonly status = signal<'idle' | 'loading' | 'done'>('idle');
  protected readonly report = signal<string | null>(null);
  protected readonly loadTimeMs = signal<number | null>(null);

  protected async generateReport(): Promise<void> {
    this.status.set('loading');
    const started = performance.now();

    // First call: downloads the lazy chunk, instantiates the service.
    // Every later call: resolves immediately with the same instance.
    const service = await this.reportService();

    this.report.set(await service.generateCatalogReport());
    this.loadTimeMs.set(Math.round(performance.now() - started));
    this.status.set('done');
  }
}
