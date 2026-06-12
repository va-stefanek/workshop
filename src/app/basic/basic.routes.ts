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
      import('./cart-rxjs/cart-rxjs.component').then(m => m.CartRxjsComponent),
    title: 'Cart - RxJS'
  },
  {
    path: 'signals',
    loadComponent: () =>
      import('./cart-signals/cart-signals.component').then(m => m.CartSignalsComponent),
    title: 'Cart - Signals'
  },
  {
    path: 'signal-store',
    loadComponent: () =>
      import('./cart-store/cart-store.component').then(m => m.CartStoreComponent),
    title: 'Cart - Signal Store'
  }
];
