import { Component, input, signal, computed, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValueControl } from '@angular/forms/signals';

/**
 * 🌟 CUSTOM RATING CONTROL
 * 
 * This component demonstrates how to create a custom form control
 * that integrates seamlessly with Angular Signal Forms.
 * 
 * KEY CONCEPTS:
 * - Implements FormValueControl<number> interface
 * - Uses model() for two-way data binding
 * - Provides visual star rating interface
 * - Handles validation states and accessibility
 * 
 * LEARNING OBJECTIVES:
 * - Understand FormValueControl interface implementation
 * - Learn how to create reusable form controls
 * - Handle user interactions and state management
 * - Integrate custom controls with form validation
 */

@Component({
  selector: 'app-rating-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating-control" [class.disabled]="disabled()">
      <div class="rating-stars" role="radiogroup" [attr.aria-label]="'Rating out of ' + maxRating()">
        @for (star of stars(); track star) {
          <button
            type="button"
            class="star-button"
            [class.filled]="star <= currentRating()"
            [class.hovered]="star <= hoveredRating() && hoveredRating() > 0"
            [attr.aria-label]="getStarLabel(star)"
            [disabled]="disabled()"
            (click)="selectRating(star)"
            (mouseenter)="setHoveredRating(star)"
            (mouseleave)="clearHoveredRating()"
            (focus)="setHoveredRating(star)"
            (blur)="clearHoveredRating()">
            
            <!-- Star Icon -->
            @if (star <= displayRating()) {
              <span class="star-icon filled">⭐</span>
            } @else {
              <span class="star-icon empty">☆</span>
            }
          </button>
        }
      </div>

      @if (showLabels()) {
        <div class="rating-labels">
          @for (label of ratingLabels(); track $index) {
            <span 
              class="rating-label"
              [class.active]="$index + 1 === currentRating()">
              {{ $index + 1 }} = {{ label }}
            </span>
          }
        </div>
      }

      @if (showValue() && currentRating() > 0) {
        <div class="rating-value">
          <span class="current-rating">{{ currentRating() }}</span>
          <span class="max-rating">/ {{ maxRating() }}</span>
          @if (ratingText()) {
            <span class="rating-text">({{ ratingText() }})</span>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './rating-control.component.css',
})
export class RatingControlComponent implements FormValueControl<number> {
  // Form Control Interface Implementation
  value = model<number>(0);

  // Configuration Inputs
  maxRating = input<number>(5);
  disabled = input<boolean>(false);
  showLabels = input<boolean>(true);
  showValue = input<boolean>(true);
  size = input<'small' | 'medium' | 'large'>('medium');
  
  // Optional custom labels for each rating
  ratingLabels = input<string[]>(['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']);

  // Internal state
  protected hoveredRating = signal<number>(0);

  // Computed properties
  stars = computed(() => Array.from({ length: this.maxRating() }, (_, i) => i + 1));
  currentRating = computed(() => this.value());
  displayRating = computed(() => 
    this.hoveredRating() > 0 ? this.hoveredRating() : this.currentRating()
  );
  
  ratingText = computed(() => {
    const rating = this.currentRating();
    const labels = this.ratingLabels();
    return rating > 0 && rating <= labels.length ? labels[rating - 1] : '';
  });

  /**
   * Handle star selection
   */
  selectRating(rating: number): void {
    if (!this.disabled()) {
      // Allow deselection by clicking the same star
      const newRating = this.currentRating() === rating ? 0 : rating;
      this.value.set(newRating);
      this.clearHoveredRating();
    }
  }

  /**
   * Handle mouse hover for preview
   */
  setHoveredRating(rating: number): void {
    if (!this.disabled()) {
      this.hoveredRating.set(rating);
    }
  }

  /**
   * Clear hover state
   */
  clearHoveredRating(): void {
    this.hoveredRating.set(0);
  }

  /**
   * Get accessible label for each star
   */
  getStarLabel(star: number): string {
    const labels = this.ratingLabels();
    const label = star <= labels.length ? labels[star - 1] : `${star} stars`;
    return `Rate ${star} out of ${this.maxRating()}: ${label}`;
  }

  /**
   * 🎯 WORKSHOP EXTENSIONS:
   * 
   * Students can extend this control with:
   * 1. Half-star ratings (0.5 increments)
   * 2. Custom star icons or colors
   * 3. Animation effects on selection
   * 4. Keyboard navigation (arrow keys)
   * 5. Touch/swipe gestures for mobile
   * 6. Sound effects on interaction
   * 7. Validation integration (min/max rating)
   * 8. Different rating scales (1-10, 1-100, etc.)
   */
}