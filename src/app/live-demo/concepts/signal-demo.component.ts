import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * Teaching snippet shown on the slide. It mirrors the live code below — edit
 * BOTH when you live-code so the panel keeps matching the running widget.
 */
export const SIGNAL_SOURCE = `// A signal holds a value and notifies its readers when it changes.
count = signal(0);

// Reading / writing:
count();                 // read  -> subscribes the caller (e.g. the template)
count.set(0);            // write -> replace the value
count.update(n => n + 1) // write -> derive from the current value

// In the template:
//   <p>{{ count() }}</p>
//   <button (click)="count.update(n => n + 1)">+1</button>`;

@Component({
  selector: 'demo-signal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo.css',
  template: `
    <div class="demo demo--center">
      <p class="big-value">{{ count() }}</p>
      <div class="row">
        <button class="btn btn--sm" (click)="count.update(n => n - 1)">−1</button>
        <button class="btn btn--sm btn--primary" (click)="count.update(n => n + 1)">+1</button>
        <button class="btn btn--sm btn--ghost" (click)="count.set(0)">reset</button>
      </div>
      <p class="hint">
        Reading <code>count()</code> in the template re-renders it automatically —
        even though this component is <code>OnPush</code>.
      </p>
    </div>
  `,
})
export class SignalDemoComponent {
  readonly count = signal(0);
}
