import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface Line {
  name: string;
  price: number;
  qty: number;
}

export const COMPUTED_SOURCE = `items = signal<Line[]>([
  { name: 'Laptop', price: 1000, qty: 1 },
  { name: 'Mouse',  price: 25,   qty: 2 },
]);

// Derived + memoized: recomputes ONLY when items() changes, then caches.
total = computed(() =>
  this.items().reduce((sum, l) => sum + l.price * l.qty, 0)
);

// A computed can build on another computed.
tax = computed(() => this.total() * 0.23);`;

@Component({
  selector: 'demo-computed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo.css',
  template: `
    <div class="demo">
      @for (line of items(); track line.name) {
        <div class="row line">
          <span class="grow">{{ line.name }} — \${{ line.price }} × {{ line.qty }}</span>
          <button class="btn btn--sm" (click)="changeQty(line.name, 1)">+</button>
          <button class="btn btn--sm" (click)="changeQty(line.name, -1)">−</button>
        </div>
      }
      <hr />
      <p class="kv"><span>Subtotal</span><strong>\${{ total() }}</strong></p>
      <p class="kv"><span>Tax (23%)</span><strong>\${{ tax().toFixed(2) }}</strong></p>
      <p class="hint">
        <code>total()</code> body has run <strong>{{ recomputeCount }}</strong> time(s).
        It only re-runs when <code>items()</code> changes — otherwise the memoized value is reused.
      </p>
    </div>
  `,
})
export class ComputedDemoComponent {
  readonly items = signal<Line[]>([
    { name: 'Laptop', price: 1000, qty: 1 },
    { name: 'Mouse', price: 25, qty: 2 },
  ]);

  /** Plain counter bumped inside the computed to make memoization visible. */
  recomputeCount = 0;

  readonly total = computed(() => {
    this.recomputeCount++;
    return this.items().reduce((sum, l) => sum + l.price * l.qty, 0);
  });

  readonly tax = computed(() => this.total() * 0.23);

  changeQty(name: string, delta: number): void {
    this.items.update((lines) =>
      lines.map((l) => (l.name === name ? { ...l, qty: Math.max(0, l.qty + delta) } : l)),
    );
  }
}
