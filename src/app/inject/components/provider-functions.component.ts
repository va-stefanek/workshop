import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'provider-functions',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="providers-container">
      <h1>Provider Functions</h1>
      <p>TODO: Implement advanced provider function patterns</p>
      
      <nav>
        <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Custom provider functions</li>
          <li>Multi-provider patterns</li>
          <li>Factory providers with inject()</li>
          <li>Provider hierarchies and scoping</li>
          <li>Configuration provider patterns</li>
          <li>Feature provider composition</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './provider-functions.component.css',
})
export class ProviderFunctionsComponent {
}