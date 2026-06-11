import { Routes } from '@angular/router';

export const WEBMCP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/webmcp-demo.component').then(m => m.WebMcpDemoComponent),
    title: 'WebMCP - AI Agent Tools (Experimental)',
  },
];
