import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container" [ngClass]="['error-' + type, { 'error-dismissible': dismissible }]">
      <div class="error-content">
        <div class="error-icon">
          @switch (type) {
            @case ('warning') {
              <span class="icon">⚠️</span>
            }
            @case ('info') {
              <span class="icon">ℹ️</span>
            }
            @case ('success') {
              <span class="icon">✅</span>
            }
            @default {
              <span class="icon">❌</span>
            }
          }
        </div>
    
        <div class="error-message">
          @if (title) {
            <h4 class="error-title">{{ title }}</h4>
          }
          <p class="error-text">{{ message }}</p>
    
          @if (details && showDetails) {
            <div class="error-details">
              <p><strong>Details:</strong></p>
              <pre>{{ details }}</pre>
            </div>
          }
    
          @if (showActions) {
            <div class="error-actions">
              @if (retryable) {
                <button
                  class="btn btn-primary btn-small"
                  (click)="onRetry()"
                  [disabled]="retrying"
                  >
                  {{ retrying ? 'Retrying...' : 'Retry' }}
                </button>
              }
              @if (details && !showDetails) {
                <button
                  class="btn btn-outline btn-small"
                  (click)="toggleDetails()"
                  >
                  Show Details
                </button>
              }
              @if (details && showDetails) {
                <button
                  class="btn btn-outline btn-small"
                  (click)="toggleDetails()"
                  >
                  Hide Details
                </button>
              }
              @if (dismissible) {
                <button
                  class="btn btn-outline btn-small"
                  (click)="onDismiss()"
                  >
                  Dismiss
                </button>
              }
            </div>
          }
        </div>
    
        @if (dismissible && !showActions) {
          <button
            class="error-close"
            (click)="onDismiss()"
            title="Close"
            >
            ✕
          </button>
        }
      </div>
    </div>
    `,
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent {
  @Input() type: 'error' | 'warning' | 'info' | 'success' = 'error';
  @Input() title?: string;
  @Input() message!: string;
  @Input() details?: string;
  @Input() retryable = false;
  @Input() dismissible = true;
  @Input() showActions = true;
  @Input() retrying = false;
  
  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  showDetails = false;

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}