import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'testing-patterns',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="testing-container">
      <h1>Testing with inject()</h1>
      <p>TODO: Implement comprehensive testing patterns for inject() services</p>
      
      <nav>
        <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Testing services with inject()</li>
          <li>Mocking injected dependencies</li>
          <li>TestBed configuration for inject() services</li>
          <li>Integration testing patterns</li>
          <li>Provider override strategies</li>
          <li>Spy setup for inject() dependencies</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './testing-patterns.component.css',
})
export class TestingPatternsComponent {
}