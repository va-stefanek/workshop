import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, minLength, min, max, submit } from '@angular/forms/signals';

/**
 * ⭐ TASK 4: PRODUCT REVIEW FORM WITH CUSTOM CONTROLS (ADVANCED LEVEL)
 * 
 * LEARNING OBJECTIVES:
 * - Build custom form controls that integrate with signal forms
 * - Implement FormValueControl and FormCheckboxControl interfaces
 * - Create reusable controls with proper validation
 * - Handle complex user interactions within custom controls
 * - Integrate custom controls with form validation system
 * 
 * WORKSHOP INSTRUCTIONS:
 * 1. Create custom rating control with star interaction
 * 2. Build photo upload control with preview and validation
 * 3. Implement tag selector with dynamic addition/removal
 * 4. Create recommendation toggle with conditional fields
 * 5. Handle form submission with custom control data
 * 
 * SUCCESS CRITERIA:
 * ✅ Custom rating control with proper validation
 * ✅ Photo upload with preview and file validation
 * ✅ Dynamic tag selector working correctly
 * ✅ Custom controls integrate with signal form validation
 * ✅ Comprehensive error handling for custom controls
 */

interface ReviewFormData {
  // Basic Review Information
  rating: number;
  title: string;
  content: string;
  
  // Custom Controls
  photos: File[];
  tags: string[];
  
  // Recommendation
  wouldRecommend: boolean;
  recommendationReason: string;
  
  // Additional Info
  purchaseVerified: boolean;
  anonymous: boolean;
  
  // Product Usage
  usageDuration: 'less-week' | 'week-month' | 'month-year' | 'over-year';
  usageFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
}

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="review-form-container">
      <h2>⭐ Product Review Form</h2>
      <p class="task-description">
        Submit your product review using custom signal form controls
      </p>

      <!-- Product Information Display -->
      <div class="product-info">
        <div class="product-card">
          <img src="https://via.placeholder.com/120x120" alt="Product" class="product-image">
          <div class="product-details">
            <h4>Sample Product Name</h4>
            <p class="product-price">$29.99</p>
            <p class="product-category">Electronics</p>
          </div>
        </div>
      </div>

      <!-- TODO: Replace with signal-driven form -->
      <form class="review-form" (ngSubmit)="onSubmit()">
        
        <!-- RATING SECTION -->
        <div class="form-section">
          <h3>📊 Overall Rating</h3>
          
          <div class="form-group">
            <label>Your Rating *</label>
            
            <!-- TODO: Custom Rating Control -->
            <div class="custom-rating-placeholder">
              <p>⚠️ TODO: Implement custom star rating control</p>
              <div class="rating-preview">
                <span class="star-placeholder">⭐ ⭐ ⭐ ⭐ ⭐</span>
                <span class="rating-text">(Click stars to rate)</span>
              </div>
              <div class="rating-labels">
                <span>1 = Poor</span>
                <span>2 = Fair</span>
                <span>3 = Good</span>
                <span>4 = Very Good</span>
                <span>5 = Excellent</span>
              </div>
            </div>
            
            <!-- Validation placeholder -->
            <div class="error-placeholder">
              <p>⚠️ TODO: Rating validation (required, 1-5)</p>
            </div>
          </div>
        </div>

        <!-- REVIEW CONTENT SECTION -->
        <div class="form-section">
          <h3>✍️ Your Review</h3>
          
          <div class="form-group">
            <label for="title">Review Title *</label>
            <input 
              id="title"
              type="text"
              class="form-control"
              placeholder="Summarize your experience"
              maxlength="100">
            
            <!-- TODO: Add character counter -->
            <div class="char-counter-placeholder">
              <small>⚠️ TODO: Character counter (0/100)</small>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Title validation (required, min 5 chars)</p>
            </div>
          </div>

          <div class="form-group">
            <label for="content">Detailed Review *</label>
            <textarea 
              id="content"
              class="form-control"
              rows="6"
              placeholder="Share your detailed experience with this product..."
              maxlength="1000"></textarea>
            
            <!-- TODO: Add character counter and writing tips -->
            <div class="textarea-helper-placeholder">
              <div class="writing-tips">
                <p>⚠️ TODO: Writing tips and character counter</p>
                <ul>
                  <li>Describe what you liked and disliked</li>
                  <li>Mention how you used the product</li>
                  <li>Include pros and cons</li>
                </ul>
                <small>Characters: 0/1000</small>
              </div>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Content validation (required, min 20 chars)</p>
            </div>
          </div>
        </div>

        <!-- PHOTO UPLOAD SECTION -->
        <div class="form-section">
          <h3>📸 Photos (Optional)</h3>
          
          <div class="form-group">
            <label>Upload Photos</label>
            <p class="form-help">Add up to 5 photos to showcase your experience</p>
            
            <!-- TODO: Custom Photo Upload Control -->
            <div class="photo-upload-placeholder">
              <p>⚠️ TODO: Implement custom photo upload control</p>
              <div class="upload-area">
                <div class="upload-icon">📷</div>
                <p>Click to upload or drag and drop</p>
                <small>PNG, JPG up to 5MB each (max 5 photos)</small>
              </div>
              
              <!-- Photo previews placeholder -->
              <div class="photo-previews-placeholder">
                <p>⚠️ TODO: Photo previews with remove buttons</p>
                <div class="preview-grid">
                  <!-- Photo preview items would appear here -->
                </div>
              </div>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Photo validation (file size, type, count)</p>
            </div>
          </div>
        </div>

        <!-- TAGS SECTION -->
        <div class="form-section">
          <h3>🏷️ Tags</h3>
          
          <div class="form-group">
            <label>Add Tags</label>
            <p class="form-help">Add tags that describe your experience</p>
            
            <!-- TODO: Custom Tag Selector Control -->
            <div class="tag-selector-placeholder">
              <p>⚠️ TODO: Implement custom tag selector control</p>
              
              <!-- Suggested tags -->
              <div class="suggested-tags">
                <h5>Suggested Tags:</h5>
                <div class="tag-options">
                  <button type="button" class="tag-option">Quality</button>
                  <button type="button" class="tag-option">Value</button>
                  <button type="button" class="tag-option">Fast Shipping</button>
                  <button type="button" class="tag-option">Easy to Use</button>
                  <button type="button" class="tag-option">Durable</button>
                  <button type="button" class="tag-option">Great Design</button>
                </div>
              </div>
              
              <!-- Custom tag input -->
              <div class="custom-tag-input">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Add custom tag..."
                  maxlength="20">
                <button type="button" class="btn btn-sm btn-primary">Add</button>
              </div>
              
              <!-- Selected tags -->
              <div class="selected-tags-placeholder">
                <p>⚠️ TODO: Display selected tags with remove buttons</p>
                <div class="selected-tags">
                  <!-- Selected tag items would appear here -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RECOMMENDATION SECTION -->
        <div class="form-section">
          <h3>👍 Recommendation</h3>
          
          <div class="form-group">
            <label>Would you recommend this product? *</label>
            
            <div class="recommendation-toggle">
              <div class="toggle-options">
                <button 
                  type="button"
                  class="toggle-option"
                  [class.active]="false">
                  👍 Yes, I recommend it
                </button>
                <button 
                  type="button"
                  class="toggle-option"
                  [class.active]="false">
                  👎 No, I don't recommend it
                </button>
              </div>
            </div>
            
            <!-- TODO: Conditional recommendation reason -->
            <div class="conditional-reason-placeholder">
              <p>⚠️ TODO: Show reason field based on recommendation</p>
              <div class="form-group" style="margin-top: 1rem;">
                <label for="recommendationReason">Why? (Optional)</label>
                <textarea 
                  id="recommendationReason"
                  class="form-control"
                  rows="3"
                  placeholder="Explain your recommendation..."
                  maxlength="300"></textarea>
                <small class="form-help">Characters: 0/300</small>
              </div>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Recommendation validation (required)</p>
            </div>
          </div>
        </div>

        <!-- USAGE INFORMATION SECTION -->
        <div class="form-section">
          <h3>⏱️ Usage Information</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="usageDuration">How long have you owned this product?</label>
              <select id="usageDuration" class="form-control">
                <option value="">Select duration</option>
                <option value="less-week">Less than a week</option>
                <option value="week-month">1 week to 1 month</option>
                <option value="month-year">1 month to 1 year</option>
                <option value="over-year">Over 1 year</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="usageFrequency">How often do you use it?</label>
              <select id="usageFrequency" class="form-control">
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="rarely">Rarely</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ADDITIONAL OPTIONS SECTION -->
        <div class="form-section">
          <h3>⚙️ Additional Options</h3>
          
          <div class="form-group">
            <div class="checkbox-wrapper">
              <input 
                id="purchaseVerified"
                type="checkbox"
                class="checkbox">
              <label for="purchaseVerified">This is a verified purchase</label>
            </div>
            <small class="form-help">Check this if you purchased the product from our store</small>
          </div>

          <div class="form-group">
            <div class="checkbox-wrapper">
              <input 
                id="anonymous"
                type="checkbox"
                class="checkbox">
              <label for="anonymous">Submit review anonymously</label>
            </div>
            <small class="form-help">Your name will not be displayed with the review</small>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="resetForm()">
            Reset Form
          </button>
          
          <button 
            type="button"
            class="btn btn-outline-primary"
            (click)="saveDraft()">
            Save Draft
          </button>
          
          <button 
            type="submit"
            class="btn btn-primary"
            [disabled]="!isFormValid()">
            <!-- TODO: Add loading state -->
            Submit Review ⭐
          </button>
        </div>
      </form>

      <!-- Form State Debug Panel -->
      <div class="debug-panel">
        <h4>🔍 Form State & Custom Controls</h4>
        <div class="debug-content">
          <!-- TODO: Add signal-driven form state display -->
          <div class="debug-placeholder">
            <p>⚠️ TODO: Implement form state debugging for custom controls</p>
            <ul>
              <li>Form Valid: <code>unknown</code></li>
              <li>Rating Value: <code>unknown</code></li>
              <li>Photos Count: <code>unknown</code></li>
              <li>Tags Count: <code>unknown</code></li>
              <li>Recommendation: <code>unknown</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent {
  
  // TODO: Replace with signal form implementation
  isSubmitting = signal(false);
  
  /**
   * 🎯 WORKSHOP TASK 4.1: CREATE FORM WITH CUSTOM CONTROLS
   * 
   * Create a review form that uses custom form controls:
   * 
   * reviewForm = form(
   *   signal<ReviewFormData>({
   *     rating: 0,
   *     title: '',
   *     content: '',
   *     photos: [],
   *     tags: [],
   *     wouldRecommend: true,
   *     recommendationReason: '',
   *     purchaseVerified: false,
   *     anonymous: false,
   *     usageDuration: '',
   *     usageFrequency: ''
   *   }),
   *   (f) => {
   *     // Basic validation
   *     required(f.rating);
   *     min(f.rating, 1);
   *     max(f.rating, 5);
   *     required(f.title);
   *     minLength(f.title, 5);
   *     required(f.content);
   *     minLength(f.content, 20);
   *     required(f.wouldRecommend);
   *     
   *     // Custom validation for photos (max 5, valid file types)
   *     // Custom validation for tags (max 10 tags, valid tag format)
   *   }
   * );
   */

  /**
   * 🎯 WORKSHOP TASK 4.2: IMPLEMENT FORM VALIDATION
   */
  isFormValid(): boolean {
    // TODO: Check if form is valid including custom controls
    return false;
  }

  /**
   * 🎯 WORKSHOP TASK 4.3: IMPLEMENT FORM SUBMISSION
   */
  async onSubmit() {
    // TODO: Implement review form submission using submit()
    console.log('🚧 TODO: Implement review submission with custom controls');
  }

  resetForm() {
    // TODO: Reset the signal form and custom controls
    console.log('🚧 TODO: Reset review form');
  }

  saveDraft() {
    // TODO: Save form as draft to localStorage
    console.log('🚧 TODO: Save review draft');
  }

  /**
   * 🎯 BONUS CHALLENGES:
   * 
   * 1. Create RatingControl component that implements FormValueControl<number>
   * 2. Build PhotoUploadControl with drag-and-drop functionality
   * 3. Implement TagSelectorControl with autocomplete suggestions
   * 4. Add RecommendationToggleControl with animated transitions
   * 5. Create CharacterCounterControl for text fields
   * 6. Add real-time form validation feedback
   * 7. Implement review preview before submission
   * 8. Add review sentiment analysis integration
   */
}