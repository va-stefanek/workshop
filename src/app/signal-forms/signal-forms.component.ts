import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './components/product-form.component';
import { CheckoutFormComponent } from './components/checkout-form.component';
import { UserProfileFormComponent } from './components/user-profile-form.component';
import { ReviewFormComponent } from './components/review-form.component';

@Component({
  selector: 'app-signal-forms',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    CheckoutFormComponent,
    UserProfileFormComponent,
    ReviewFormComponent
  ],
  template: `
    <div class="signal-forms-workshop">
      <header class="workshop-header">
        <h1>🔥 Signal Forms Workshop</h1>
        <p class="lead">Master Angular Signal Forms with practical shopping cart scenarios</p>
        <div class="badge-container">
          <span class="badge experimental">EXPERIMENTAL</span>
          <span class="badge angular">ANGULAR 21+</span>
        </div>
      </header>

      <nav class="forms-nav">
        <button 
          *ngFor="let tab of tabs" 
          [class.active]="activeTab() === tab.id"
          (click)="setActiveTab(tab.id)"
          class="nav-button">
          <span class="badge" [class]="tab.badgeClass">{{ tab.badge }}</span>
          {{ tab.label }}
        </button>
      </nav>

      <main class="workshop-content">
        @switch (activeTab()) {
          @case ('product') { 
            <app-product-form></app-product-form>
          }
          @case ('checkout') { 
            <app-checkout-form></app-checkout-form>
          }
          @case ('profile') { 
            <app-user-profile-form></app-user-profile-form>
          }
          @case ('custom') { 
            <app-review-form></app-review-form>
          }
        }
      </main>

      <footer class="workshop-footer">
        <p>
          📚 <strong>Learning Path:</strong> 
          Progress through each task to master Signal Forms concepts
        </p>
        <div class="progress-indicators">
          <div class="progress-item" [class.completed]="false">
            <span class="number">1</span>
            <span>Product Form</span>
          </div>
          <div class="progress-item" [class.completed]="false">
            <span class="number">2</span>
            <span>Checkout Flow</span>
          </div>
          <div class="progress-item" [class.completed]="false">
            <span class="number">3</span>
            <span>User Profile</span>
          </div>
          <div class="progress-item" [class.completed]="false">
            <span class="number">4</span>
            <span>Custom Controls</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './signal-forms.component.css',
})
export class SignalFormsComponent {
  activeTab = signal<string>('product');

  tabs = [
    {
      id: 'product',
      label: 'Product Form',
      badge: 'BASIC',
      badgeClass: 'basic'
    },
    {
      id: 'checkout',
      label: 'Checkout Flow',
      badge: 'INTER',
      badgeClass: 'intermediate'
    },
    {
      id: 'profile',
      label: 'User Profile',
      badge: 'INTER',
      badgeClass: 'intermediate'
    },
    {
      id: 'custom',
      label: 'Custom Controls',
      badge: 'ADV',
      badgeClass: 'advanced'
    }
  ];

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }
}