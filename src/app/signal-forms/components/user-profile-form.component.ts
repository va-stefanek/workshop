import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, email, minLength, pattern, applyWhen, submit } from '@angular/forms/signals';

/**
 * 👤 TASK 3: USER PROFILE FORM (INTERMEDIATE LEVEL)
 * 
 * LEARNING OBJECTIVES:
 * - Create nested forms with signal-driven structure
 * - Implement dynamic form sections based on user preferences
 * - Handle complex validation rules across multiple sections
 * - Manage form state with conditional field visibility
 * - Create reusable form sections
 * 
 * WORKSHOP INSTRUCTIONS:
 * 1. Build nested form with personal info, preferences, and security sections
 * 2. Implement dynamic sections based on user type and preferences
 * 3. Add cross-section validation (password confirmation, email matching)
 * 4. Create conditional field visibility with smooth transitions
 * 5. Handle comprehensive form submission with section validation
 * 
 * SUCCESS CRITERIA:
 * ✅ Nested form structure with multiple sections
 * ✅ Dynamic sections based on user selections
 * ✅ Cross-section validation working correctly
 * ✅ Smooth UI transitions for conditional fields
 * ✅ Comprehensive error handling and display
 */

type UserType = 'customer' | 'merchant' | 'admin';
type NotificationPreference = 'email' | 'sms' | 'push' | 'none';

interface UserProfileFormData {
  // Personal Information
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    userType: UserType;
  };
  // Address Information (conditional)
  address: {
    includeAddress: boolean;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Merchant Information (conditional - only for merchants)
  merchant: {
    businessName: string;
    businessType: string;
    taxId: string;
    website: string;
  };
  // Preferences
  preferences: {
    newsletter: boolean;
    notifications: NotificationPreference;
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
  // Security
  security: {
    changePassword: boolean;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorAuth: boolean;
  };
}

@Component({
  selector: 'app-user-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-form-container">
      <h2>👤 User Profile Management</h2>
      <p class="task-description">
        Manage your profile with nested forms, dynamic sections, and conditional validation
      </p>

      <!-- Form Sections Navigation -->
      <div class="sections-nav">
        <button 
          *ngFor="let section of formSections" 
          [class.active]="activeSection() === section.id"
          [class.completed]="isSectionValid(section.id)"
          [class.has-errors]="hasSectionErrors(section.id)"
          (click)="setActiveSection(section.id)"
          class="section-button">
          <span class="section-icon">{{ section.icon }}</span>
          <span class="section-label">{{ section.label }}</span>
          <span class="validation-indicator" 
                [class.valid]="isSectionValid(section.id)"
                [class.invalid]="hasSectionErrors(section.id)">
            {{ getSectionValidationIcon(section.id) }}
          </span>
        </button>
      </div>

      <!-- TODO: Replace with signal-driven form -->
      <form class="profile-form" (ngSubmit)="onSubmit()">
        
        <!-- PERSONAL INFORMATION SECTION -->
        @if (activeSection() === 'personal') {
          <div class="form-section">
            <h3>🆔 Personal Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input 
                  id="firstName"
                  type="text"
                  class="form-control"
                  placeholder="John">
                <!-- TODO: Add signal-driven validation -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: First name validation</p>
                </div>
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input 
                  id="lastName"
                  type="text"
                  class="form-control"
                  placeholder="Doe">
                <!-- TODO: Add signal-driven validation -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: Last name validation</p>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input 
                  id="email"
                  type="email"
                  class="form-control"
                  placeholder="john.doe@example.com">
                <!-- TODO: Add email validation -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: Email validation</p>
                </div>
              </div>
              
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input 
                  id="phone"
                  type="tel"
                  class="form-control"
                  placeholder="(555) 123-4567">
                <!-- TODO: Add phone validation -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: Phone pattern validation</p>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth</label>
                <input 
                  id="dateOfBirth"
                  type="date"
                  class="form-control">
              </div>
              
              <div class="form-group">
                <label for="userType">User Type *</label>
                <select id="userType" class="form-control">
                  <option value="">Select user type</option>
                  <option value="customer">Customer</option>
                  <option value="merchant">Merchant</option>
                  <option value="admin">Administrator</option>
                </select>
                <!-- TODO: Add user type validation and dynamic sections -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: User type validation + dynamic sections</p>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ADDRESS INFORMATION SECTION -->
        @if (activeSection() === 'address') {
          <div class="form-section">
            <h3>📍 Address Information</h3>
            
            <div class="form-group">
              <div class="checkbox-wrapper">
                <input 
                  id="includeAddress"
                  type="checkbox"
                  class="checkbox">
                <label for="includeAddress">Include address information</label>
              </div>
            </div>

            <!-- TODO: Conditional address fields based on checkbox -->
            <div class="conditional-fields-placeholder">
              <p>⚠️ TODO: Show address fields only when checkbox is selected</p>
              
              <div class="form-group">
                <label for="street">Street Address *</label>
                <input 
                  id="street"
                  type="text"
                  class="form-control"
                  placeholder="123 Main Street">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">City *</label>
                  <input 
                    id="city"
                    type="text"
                    class="form-control"
                    placeholder="New York">
                </div>
                
                <div class="form-group">
                  <label for="state">State *</label>
                  <select id="state" class="form-control">
                    <option value="">Select State</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="zipCode">ZIP Code *</label>
                  <input 
                    id="zipCode"
                    type="text"
                    class="form-control"
                    placeholder="10001">
                </div>
              </div>

              <div class="form-group">
                <label for="country">Country *</label>
                <select id="country" class="form-control">
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        }

        <!-- MERCHANT INFORMATION SECTION (Conditional) -->
        @if (activeSection() === 'merchant') {
          <div class="form-section">
            <h3>🏪 Merchant Information</h3>
            <p class="section-note">This section is only available for merchant accounts</p>
            
            <!-- TODO: Show only when userType is 'merchant' -->
            <div class="conditional-merchant-placeholder">
              <p>⚠️ TODO: Show only when user type is 'merchant'</p>
              
              <div class="form-group">
                <label for="businessName">Business Name *</label>
                <input 
                  id="businessName"
                  type="text"
                  class="form-control"
                  placeholder="Acme Corporation">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="businessType">Business Type *</label>
                  <select id="businessType" class="form-control">
                    <option value="">Select business type</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="service">Service</option>
                    <option value="manufacturing">Manufacturing</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="taxId">Tax ID *</label>
                  <input 
                    id="taxId"
                    type="text"
                    class="form-control"
                    placeholder="XX-XXXXXXX">
                </div>
              </div>

              <div class="form-group">
                <label for="website">Website</label>
                <input 
                  id="website"
                  type="url"
                  class="form-control"
                  placeholder="https://www.example.com">
              </div>
            </div>
          </div>
        }

        <!-- PREFERENCES SECTION -->
        @if (activeSection() === 'preferences') {
          <div class="form-section">
            <h3>⚙️ Preferences</h3>
            
            <div class="form-group">
              <div class="checkbox-wrapper">
                <input 
                  id="newsletter"
                  type="checkbox"
                  class="checkbox">
                <label for="newsletter">Subscribe to newsletter</label>
              </div>
            </div>

            <div class="form-group">
              <label>Notification Preferences</label>
              <div class="radio-group">
                <div class="radio-option">
                  <input id="notif-email" type="radio" name="notifications" value="email">
                  <label for="notif-email">📧 Email notifications</label>
                </div>
                <div class="radio-option">
                  <input id="notif-sms" type="radio" name="notifications" value="sms">
                  <label for="notif-sms">📱 SMS notifications</label>
                </div>
                <div class="radio-option">
                  <input id="notif-push" type="radio" name="notifications" value="push">
                  <label for="notif-push">🔔 Push notifications</label>
                </div>
                <div class="radio-option">
                  <input id="notif-none" type="radio" name="notifications" value="none">
                  <label for="notif-none">🔇 No notifications</label>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="theme">Theme Preference</label>
                <select id="theme" class="form-control">
                  <option value="system">🖥️ System default</option>
                  <option value="light">☀️ Light theme</option>
                  <option value="dark">🌙 Dark theme</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="language">Language</label>
                <select id="language" class="form-control">
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="timezone">Timezone</label>
              <select id="timezone" class="form-control">
                <option value="America/New_York">Eastern Time (UTC-5)</option>
                <option value="America/Chicago">Central Time (UTC-6)</option>
                <option value="America/Denver">Mountain Time (UTC-7)</option>
                <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
              </select>
            </div>
          </div>
        }

        <!-- SECURITY SECTION -->
        @if (activeSection() === 'security') {
          <div class="form-section">
            <h3>🔒 Security Settings</h3>
            
            <div class="form-group">
              <div class="checkbox-wrapper">
                <input 
                  id="changePassword"
                  type="checkbox"
                  class="checkbox">
                <label for="changePassword">Change password</label>
              </div>
            </div>

            <!-- TODO: Conditional password fields -->
            <div class="conditional-password-placeholder">
              <p>⚠️ TODO: Show password fields only when checkbox is selected</p>
              
              <div class="form-group">
                <label for="currentPassword">Current Password *</label>
                <input 
                  id="currentPassword"
                  type="password"
                  class="form-control"
                  placeholder="Enter current password">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="newPassword">New Password *</label>
                  <input 
                    id="newPassword"
                    type="password"
                    class="form-control"
                    placeholder="Enter new password">
                  <!-- TODO: Add password strength indicator -->
                  <div class="password-strength-placeholder">
                    <p>⚠️ TODO: Password strength indicator</p>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="confirmPassword">Confirm Password *</label>
                  <input 
                    id="confirmPassword"
                    type="password"
                    class="form-control"
                    placeholder="Confirm new password">
                  <!-- TODO: Add password match validation -->
                  <div class="error-placeholder">
                    <p>⚠️ TODO: Password match validation</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="checkbox-wrapper">
                <input 
                  id="twoFactorAuth"
                  type="checkbox"
                  class="checkbox">
                <label for="twoFactorAuth">Enable two-factor authentication</label>
              </div>
              <small class="form-help">Add an extra layer of security to your account</small>
            </div>
          </div>
        }

        <!-- Form Navigation -->
        <div class="form-navigation">
          <button 
            type="button"
            class="btn btn-secondary"
            [disabled]="isFirstSection()"
            (click)="goToPreviousSection()">
            ← Previous Section
          </button>

          @if (!isLastSection()) {
            <button 
              type="button"
              class="btn btn-primary"
              [disabled]="!canProceedToNextSection()"
              (click)="goToNextSection()">
              Next Section →
            </button>
          } @else {
            <button 
              type="submit"
              class="btn btn-success"
              [disabled]="!isFormValid()">
              <!-- TODO: Add loading state -->
              Save Profile 💾
            </button>
          }
        </div>
      </form>

      <!-- Profile Summary -->
      <div class="profile-summary">
        <h4>📊 Profile Completion Status</h4>
        <div class="completion-grid">
          <!-- TODO: Add signal-driven completion status -->
          <div class="completion-placeholder">
            <p>⚠️ TODO: Show section completion status</p>
            <ul>
              <li>Personal Information: <code>unknown</code></li>
              <li>Address Information: <code>unknown</code></li>
              <li>Merchant Information: <code>unknown</code></li>
              <li>Preferences: <code>unknown</code></li>
              <li>Security Settings: <code>unknown</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './user-profile-form.component.css',
})
export class UserProfileFormComponent {
  
  // TODO: Replace with signal form implementation
  activeSection = signal<string>('personal');
  
  formSections = [
    { id: 'personal', label: 'Personal', icon: '🆔' },
    { id: 'address', label: 'Address', icon: '📍' },
    { id: 'merchant', label: 'Merchant', icon: '🏪' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  /**
   * 🎯 WORKSHOP TASK 3.1: CREATE NESTED SIGNAL FORM
   * 
   * Create a comprehensive nested form with conditional sections:
   * 
   * profileForm = form(
   *   signal<UserProfileFormData>({
   *     personal: { firstName: '', lastName: '', ... },
   *     address: { includeAddress: false, ... },
   *     merchant: { businessName: '', ... },
   *     preferences: { newsletter: false, ... },
   *     security: { changePassword: false, ... }
   *   }),
   *   (f) => {
   *     // Personal section validation
   *     required(f.personal.firstName);
   *     required(f.personal.lastName);
   *     required(f.personal.email);
   *     email(f.personal.email);
   *     
   *     // Conditional address validation
   *     applyWhen(
   *       f,
   *       ({ value }) => value().address.includeAddress,
   *       (form) => {
   *         required(form.address.street);
   *         required(form.address.city);
   *         // ... more address validations
   *       }
   *     );
   *     
   *     // Conditional merchant validation
   *     applyWhen(
   *       f,
   *       ({ value }) => value().personal.userType === 'merchant',
   *       (form) => {
   *         required(form.merchant.businessName);
   *         required(form.merchant.businessType);
   *       }
   *     );
   *     
   *     // Conditional password validation
   *     applyWhen(
   *       f,
   *       ({ value }) => value().security.changePassword,
   *       (form) => {
   *         required(form.security.currentPassword);
   *         required(form.security.newPassword);
   *         minLength(form.security.newPassword, 8);
   *         // Custom password match validation
   *       }
   *     );
   *   }
   * );
   */

  /**
   * 🎯 WORKSHOP TASK 3.2: IMPLEMENT SECTION NAVIGATION
   */
  setActiveSection(section: string) {
    this.activeSection.set(section);
  }

  goToNextSection() {
    const current = this.activeSection();
    const currentIndex = this.formSections.findIndex(s => s.id === current);
    if (currentIndex < this.formSections.length - 1) {
      this.activeSection.set(this.formSections[currentIndex + 1].id);
    }
  }

  goToPreviousSection() {
    const current = this.activeSection();
    const currentIndex = this.formSections.findIndex(s => s.id === current);
    if (currentIndex > 0) {
      this.activeSection.set(this.formSections[currentIndex - 1].id);
    }
  }

  isFirstSection(): boolean {
    return this.activeSection() === this.formSections[0].id;
  }

  isLastSection(): boolean {
    return this.activeSection() === this.formSections[this.formSections.length - 1].id;
  }

  /**
   * 🎯 WORKSHOP TASK 3.3: IMPLEMENT SECTION VALIDATION
   */
  isSectionValid(sectionId: string): boolean {
    // TODO: Check if specific section is valid
    return false;
  }

  hasSectionErrors(sectionId: string): boolean {
    // TODO: Check if specific section has errors
    return false;
  }

  getSectionValidationIcon(sectionId: string): string {
    if (this.isSectionValid(sectionId)) return '✓';
    if (this.hasSectionErrors(sectionId)) return '✗';
    return '?';
  }

  canProceedToNextSection(): boolean {
    // TODO: Check if current section is valid
    return this.isSectionValid(this.activeSection());
  }

  /**
   * 🎯 WORKSHOP TASK 3.4: IMPLEMENT FORM SUBMISSION
   */
  async onSubmit() {
    // TODO: Implement profile form submission using submit()
    console.log('🚧 TODO: Implement profile submission');
  }

  isFormValid(): boolean {
    // TODO: Check if all required sections are valid
    return this.formSections
      .filter(section => this.isSectionRequired(section.id))
      .every(section => this.isSectionValid(section.id));
  }

  private isSectionRequired(sectionId: string): boolean {
    // TODO: Determine which sections are required based on form data
    switch (sectionId) {
      case 'personal': return true;
      case 'address': return false; // Optional
      case 'merchant': return false; // Only if userType is 'merchant'
      case 'preferences': return false; // Optional
      case 'security': return false; // Optional
      default: return false;
    }
  }

  /**
   * 🎯 BONUS CHALLENGES:
   * 
   * 1. Add smooth section transitions with animations
   * 2. Implement auto-save functionality for each section
   * 3. Add progress persistence (save to localStorage)
   * 4. Create section completion percentage indicator
   * 5. Add field-level validation as user types
   * 6. Implement profile photo upload with preview
   * 7. Add address autocomplete with external API
   * 8. Create password strength indicator with real-time feedback
   */
}