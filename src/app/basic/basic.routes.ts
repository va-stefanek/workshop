// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'rxjs',
    pathMatch: 'full'
  },
  {
    path: 'rxjs',
    loadComponent: () =>
      import('./cart-rxjs.component').then(m => m.CartRxjsComponent),
    title: 'Cart - RxJS'
  },
  {
    path: 'signals',
    loadComponent: () =>
      import('./cart-signals.component').then(m => m.CartSignalsComponent),
    title: 'Cart - Signals'
  },
];
