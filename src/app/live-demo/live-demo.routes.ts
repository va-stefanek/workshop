import { Routes } from '@angular/router';

export const LIVE_DEMO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./live-demo.component').then((m) => m.LiveDemoComponent),
    title: 'Live Demo — Signals, computed, linkedSignal & resource',
  },
];
