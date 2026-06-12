import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'injection-patterns',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="patterns-container">
      <h1>Injection Patterns Demo</h1>
      <p>TODO: Implement comprehensive inject() patterns demonstration</p>
      
      <nav>
        <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Optional injection with fallbacks</li>
          <li>Conditional injection based on environment</li>
          <li>Factory function patterns</li>
          <li>Configuration token injection</li>
          <li>Service composition patterns</li>
          <li>runInInjectionContext usage</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './injection-patterns.component.css',
})
export class InjectionPatternsComponent {
}