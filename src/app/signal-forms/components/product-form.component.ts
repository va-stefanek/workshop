import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, email, minLength, min, max } from '@angular/forms/signals';
import { Product } from '../../shared/models/product.model';
import { Category } from '../../shared/models/category.model';
import { ProductService } from '../../shared/services/product.service';

/**
 * 🛍️ TASK 1: PRODUCT MANAGEMENT FORM (BEGINNER LEVEL)
 * 
 * LEARNING OBJECTIVES:
 * - Create signal-driven forms with validation
 * - Display validation errors using signals
 * - Submit forms with the submit() function
 * - Integrate with existing services
 * 
 * WORKSHOP INSTRUCTIONS:
 * 1. Replace FormBuilder with signal forms API
 * 2. Implement signal-driven validation display
 * 3. Create computed properties for form state
 * 4. Add form submission with error handling
 * 
 * SUCCESS CRITERIA:
 * ✅ Form validates required fields (name, category, price)
 * ✅ Validation errors display in real-time
 * ✅ Form submission works with loading states
 * ✅ Success/error messages show appropriately
 */

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="product-form-container">
      <h2>🛍️ Product Management Form</h2>
      <p class="task-description">
        Create and edit products using Angular Signal Forms with real-time validation
      </p>

      <!-- TODO: Replace with signal-driven form -->
      <form class="product-form" (ngSubmit)="onSubmit()">
        
        <!-- Product Name Field -->
        <div class="form-group">
          <label for="name">Product Name *</label>
          <input 
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter product name">
          
          <!-- TODO: Add signal-driven error display -->
          <div class="error-placeholder">
            <p>⚠️ TODO: Implement signal-based error display</p>
            <small>Expected: Show "Product name is required" when empty</small>
          </div>
        </div>

        <!-- Category Selection -->
        <div class="form-group">
          <label for="category">Category *</label>
          <select id="category" class="form-control">
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>
          
          <!-- TODO: Add category validation -->
          <div class="error-placeholder">
            <p>⚠️ TODO: Implement category selection validation</p>
          </div>
        </div>

        <!-- Price Field -->
        <div class="form-group">
          <label for="price">Price *</label>
          <div class="input-group">
            <span class="input-prefix">$</span>
            <input 
              id="price"
              type="number"
              step="0.01"
              min="0"
              class="form-control"
              placeholder="0.00">
          </div>
          
          <!-- TODO: Add price validation (positive number) -->
          <div class="error-placeholder">
            <p>⚠️ TODO: Implement price validation</p>
            <small>Expected: Price must be positive number</small>
          </div>
        </div>

        <!-- Description Field -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            class="form-control"
            rows="4"
            placeholder="Describe the product..."
            maxlength="500"></textarea>
          
          <!-- Character count with signals -->
          <div class="form-help">
            <!-- TODO: Add signal-driven character counter -->
            <small>⚠️ TODO: Show character count (0/500)</small>
          </div>
        </div>

        <!-- In Stock Toggle -->
        <div class="form-group">
          <div class="checkbox-wrapper">
            <input 
              id="inStock"
              type="checkbox"
              class="checkbox">
            <label for="inStock">Product is in stock</label>
          </div>
        </div>

        <!-- Image URL Field -->
        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input 
            id="imageUrl"
            type="url"
            class="form-control"
            placeholder="https://example.com/product-image.jpg">
          
          <!-- Image Preview -->
          <!-- TODO: Add conditional image preview -->
          <div class="image-preview-placeholder">
            <p>⚠️ TODO: Add image preview when URL is valid</p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <!-- TODO: Implement proper form state management -->
          <button 
            type="submit"
            class="btn btn-primary"
            disabled>
            <!-- TODO: Add loading state with signals -->
            Save Product
          </button>
          
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="resetForm()">
            Reset Form
          </button>
        </div>
      </form>

      <!-- Form State Debug Panel (Development Only) -->
      <div class="debug-panel">
        <h4>🔍 Form State (Debug)</h4>
        <div class="debug-content">
          <!-- TODO: Add signal-driven form state display -->
          <div class="debug-placeholder">
            <p>⚠️ TODO: Implement form state debugging</p>
            <ul>
              <li>Form Valid: <code>unknown</code></li>
              <li>Form Touched: <code>unknown</code></li>
              <li>Form Dirty: <code>unknown</code></li>
              <li>Submitting: <code>unknown</code></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div class="message-area">
        <!-- TODO: Add signal-driven success/error messages -->
        <div class="message-placeholder">
          <p>⚠️ TODO: Implement success/error message display</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  private productService = inject(ProductService);
  
  // TODO: Replace these placeholder signals with actual form implementation
  
  /**
   * 🎯 WORKSHOP TASK 1.1: CREATE SIGNAL FORM
   * 
   * Replace the placeholder signals below with a proper signal form:
   * 
   * Example:
   * productForm = form(
   *   signal<ProductFormData>({
   *     name: '',
   *     category: '',
   *     price: 0,
   *     description: '',
   *     inStock: true,
   *     imageUrl: ''
   *   }),
   *   (f) => {
   *     // Add validation rules here
   *     required(f.name);
   *     required(f.category);
   *     // ... add more validations
   *   }
   * );
   */
  
  // Placeholder signals - TODO: Replace with signal form
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  
  /**
   * 🎯 WORKSHOP TASK 1.2: IMPLEMENT COMPUTED PROPERTIES
   *
   * Create computed properties derived from the form's FieldState:
   * - isFormValid: is the whole form valid? (which signal on the root field state tells you?)
   * - isFormTouched: has the user touched the form?
   * - characterCount: length of the description field's current value
   *
   * HINT: calling the form/field as a function gives you its FieldState,
   * e.g. this.productForm() or this.productForm.description()
   */
  
  // Placeholder computeds - TODO: Implement real computeds
  isFormValid = computed(() => false);
  isFormTouched = computed(() => false);
  characterCount = computed(() => 0);

  /**
   * 🎯 WORKSHOP TASK 1.3: IMPLEMENT FORM SUBMISSION
   *
   * Replace this method with proper signal form submission using the
   * submit() function from '@angular/forms/signals':
   *
   *   await submit(this.productForm, async (form) => { ... });
   *
   * Inside the action: read the value from the form's FieldState, send it
   * through productService.createProduct(), set successMessage, reset the
   * form — and return any server-side validation errors so signal forms
   * can display them.
   */
  async onSubmit() {
    // TODO: Implement signal form submission
    console.log('🚧 TODO: Implement form submission with signal forms');
    
    // Placeholder implementation
    this.isSubmitting.set(true);
    
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.errorMessage.set('TODO: Implement actual form submission');
    }, 1000);
  }

  /**
   * 🎯 WORKSHOP TASK 1.4: IMPLEMENT FORM RESET
   * 
   * Implement proper form reset functionality using signals
   */
  resetForm() {
    // TODO: Reset the signal form
    console.log('🚧 TODO: Reset signal form');
    
    // Clear messages
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  /**
   * 🎯 WORKSHOP TASK 1.5: ADD VALIDATION ERROR DISPLAY
   * 
   * Create methods to get validation errors for form fields:
   * 
   * getFieldError(fieldName: string): string | null {
   *   const field = this.productForm[fieldName as keyof ProductFormData];
   *   const errors = field().errors();
   *   
   *   if (errors.length === 0) return null;
   *   
   *   // Return appropriate error message based on error type
   *   const error = errors[0];
   *   switch (error.kind) {
   *     case 'required': return `${fieldName} is required`;
   *     case 'min': return `${fieldName} must be greater than ${error.min}`;
   *     // ... handle other error types
   *     default: return error.message || 'Invalid value';
   *   }
   * }
   */
  getFieldError(fieldName: string): string | null {
    // TODO: Implement field error retrieval
    return `TODO: Get ${fieldName} validation errors`;
  }

  /**
   * 🎯 BONUS CHALLENGES:
   * 
   * 1. Add image preview functionality when imageUrl is valid
   * 2. Implement auto-save functionality (save draft every 30 seconds)
   * 3. Add confirmation dialog when leaving page with unsaved changes
   * 4. Implement field-level async validation (e.g., check product name uniqueness)
   * 5. Add accessibility features (aria-labels, keyboard navigation)
   */
}