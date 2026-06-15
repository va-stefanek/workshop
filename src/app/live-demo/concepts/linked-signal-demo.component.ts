import { ChangeDetectionStrategy, Component, linkedSignal, signal } from '@angular/core';

export const LINKED_SIGNAL_SOURCE = `options = signal(['Standard', 'Express', 'Pickup']);

// linkedSignal is WRITABLE, but RESETS when its source changes.
shipping = linkedSignal({
  source: this.options,
  // Advanced form gets the previous value: keep the choice if it
  // still exists in the new options, otherwise fall back to the first.
  computation: (opts, prev) =>
    prev && opts.includes(prev.value) ? prev.value : opts[0],
});

// shipping.set(opt)   -> manual override
// options.set([...])  -> source change re-runs the computation`;

@Component({
  selector: 'demo-linked-signal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo.css',
  template: `
    <div class="demo">
      <p class="kv"><span>Options</span><strong>{{ options().join(' · ') }}</strong></p>
      <p class="kv"><span>Selected</span><strong class="hl">{{ shipping() }}</strong></p>

      <div class="row">
        @for (opt of options(); track opt) {
          <button
            class="btn btn--sm"
            [class.btn--primary]="opt === shipping()"
            (click)="shipping.set(opt)"
          >
            {{ opt }}
          </button>
        }
      </div>

      <div class="row">
        <button class="btn btn--sm btn--ghost" (click)="loadSetA()">load option set A</button>
        <button class="btn btn--sm btn--ghost" (click)="loadSetB()">load option set B</button>
      </div>

      <p class="hint">
        Pick an option (manual <code>.set()</code>), then swap the list. If your pick still
        exists it's kept; otherwise it resets — the <code>computation</code> re-runs whenever
        <code>options()</code> changes.
      </p>
    </div>
  `,
})
export class LinkedSignalDemoComponent {
  readonly options = signal<string[]>(['Standard', 'Express', 'Pickup']);

  readonly shipping = linkedSignal<string[], string>({
    source: this.options,
    computation: (opts, prev) => (prev && opts.includes(prev.value) ? prev.value : opts[0]),
  });

  loadSetA(): void {
    this.options.set(['Standard', 'Express', 'Pickup']);
  }

  loadSetB(): void {
    this.options.set(['Express', 'Same-day', 'Drone']);
  }
}
