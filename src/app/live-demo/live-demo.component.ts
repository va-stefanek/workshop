import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Type,
  computed,
  signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import { SignalDemoComponent, SIGNAL_SOURCE } from './concepts/signal-demo.component';
import { ComputedDemoComponent, COMPUTED_SOURCE } from './concepts/computed-demo.component';
import {
  LinkedSignalDemoComponent,
  LINKED_SIGNAL_SOURCE,
} from './concepts/linked-signal-demo.component';
import { ResourceDemoComponent, RESOURCE_SOURCE } from './concepts/resource-demo.component';
import {
  ResourceRetryDemoComponent,
  RESOURCE_RETRY_SOURCE,
} from './concepts/resource-retry-demo.component';

interface Concept {
  id: string;
  title: string;
  blurb: string;
  component: Type<unknown>;
  source: string;
}

@Component({
  selector: 'app-live-demo',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './live-demo.component.html',
  styleUrl: './live-demo.component.css',
})
export class LiveDemoComponent {
  readonly concepts: Concept[] = [
    {
      id: 'signal',
      title: 'signal()',
      blurb: 'Reactive state — a value that notifies its readers when it changes.',
      component: SignalDemoComponent,
      source: SIGNAL_SOURCE,
    },
    {
      id: 'computed',
      title: 'computed()',
      blurb: 'Derived, memoized state that tracks its sources automatically.',
      component: ComputedDemoComponent,
      source: COMPUTED_SOURCE,
    },
    {
      id: 'linkedSignal',
      title: 'linkedSignal()',
      blurb: 'Writable state that resets from a reactive source.',
      component: LinkedSignalDemoComponent,
      source: LINKED_SIGNAL_SOURCE,
    },
    {
      id: 'resource',
      title: 'httpResource()',
      blurb: 'Async data in the signal graph — reactive params re-fetch for free.',
      component: ResourceDemoComponent,
      source: RESOURCE_SOURCE,
    },
    {
      id: 'retry',
      title: 'resource() · retry',
      blurb: 'Built-in loading / error states, and reload() to retry a failed load.',
      component: ResourceRetryDemoComponent,
      source: RESOURCE_RETRY_SOURCE,
    },
  ];

  readonly index = signal(0);
  readonly current = computed(() => this.concepts[this.index()]);
  readonly total = this.concepts.length;

  next(): void {
    this.index.update((i) => Math.min(i + 1, this.concepts.length - 1));
  }

  prev(): void {
    this.index.update((i) => Math.max(i - 1, 0));
  }

  go(i: number): void {
    this.index.set(i);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      this.next();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      this.prev();
      event.preventDefault();
    }
  }
}
