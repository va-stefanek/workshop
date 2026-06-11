import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, FormRoot, form, min, required, submit } from '@angular/forms/signals';

interface UserRegistration {
  firstName: string;
  lastName: string;
  age: number;
}

/**
 * 🤖 SIGNAL FORMS × WEBMCP — example 5 from the Angular docs
 *
 * One option on form() — `experimentalWebMcpTool` — turns the whole form
 * into an agent tool:
 * - Angular generates the input schema automatically from the model's
 *   initial values (strings/numbers/booleans; no null/undefined!)
 * - `required()` validators become required schema fields
 * - When the agent calls the tool, Angular sets the form value and runs
 *   the SAME submit pipeline a human goes through — validation included.
 *   Invalid agent input gets the validation errors back as text.
 *
 * Requires provideExperimentalWebMcpForms() (see app.config.ts);
 * without it this form() call throws in dev mode.
 */
@Component({
  selector: 'webmcp-user-registration-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormRoot, FormField],
  template: `
    <form [formRoot]="userForm" (submit)="$event.preventDefault()" class="registration-form">
      <div class="form-row">
        <label for="firstName">First name *</label>
        <input id="firstName" type="text" [formField]="userForm.firstName">
      </div>

      <div class="form-row">
        <label for="lastName">Last name *</label>
        <input id="lastName" type="text" [formField]="userForm.lastName">
      </div>

      <div class="form-row">
        <label for="age">Age</label>
        <input id="age" type="number" [formField]="userForm.age">
      </div>

      @if (userForm().errorSummary().length > 0 && userForm().touched()) {
        <ul class="form-errors">
          @for (error of userForm().errorSummary(); track $index) {
            <li>{{ error.message }}</li>
          }
        </ul>
      }

      <button type="button" [disabled]="userForm().submitting()" (click)="register()">
        Register
      </button>
    </form>

    @if (registrations().length > 0) {
      <div class="registrations">
        <h4>✅ Registered users</h4>
        <ul>
          @for (user of registrations(); track $index) {
            <li>{{ user.firstName }} {{ user.lastName }} ({{ user.age }})</li>
          }
        </ul>
      </div>
    }
  `,
  styles: [`
    .registration-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .form-row label {
      font-weight: 600;
      font-size: 0.875rem;
      color: #495057;
    }

    .form-row input {
      padding: 0.5rem;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .form-row input:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-errors {
      margin: 0;
      padding-left: 1.25rem;
      color: #dc3545;
      font-size: 0.875rem;
    }

    button {
      align-self: flex-start;
      padding: 0.5rem 1.5rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    button:hover:not(:disabled) {
      background: #0056b3;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .registrations {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: #d4edda;
      border-radius: 8px;
    }

    .registrations h4 {
      margin: 0 0 0.5rem;
    }

    .registrations ul {
      margin: 0;
      padding-left: 1.25rem;
    }
  `],
})
export class UserRegistrationFormComponent {
  private readonly model = signal<UserRegistration>({
    firstName: '',
    lastName: '',
    age: 18,
  });

  protected readonly registrations = signal<UserRegistration[]>([]);

  protected readonly userForm = form(
    this.model,
    (f) => {
      required(f.firstName, { message: 'First name is mandatory.' });
      required(f.lastName, { message: 'Last name is mandatory.' });
      min(f.age, 13, { message: 'You must be at least 13 years old.' });
    },
    {
      name: 'userRegistration',
      experimentalWebMcpTool: {
        name: 'registerUser',
        description:
          'Registers a new user with firstName, lastName and age. ' +
          'Both names are required; age must be at least 13.',
      },
      submission: {
        action: async (field) => {
          this.registrations.update(users => [...users, { ...field().value() }]);
          this.model.set({ firstName: '', lastName: '', age: 18 });
          return undefined;
        },
      },
    }
  );

  protected register(): void {
    void submit(this.userForm);
  }
}
