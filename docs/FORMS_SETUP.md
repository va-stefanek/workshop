# 🛠️ Signal Forms Setup Guide

This guide walks you through setting up Angular Signal Forms in your project and configuring the workshop environment.

## 📋 Prerequisites

### System Requirements
- Node.js 22.22+ or 24+
- Angular CLI 22 (project uses Angular 22 + TypeScript 6)
- pnpm 10+
- Modern browser with JavaScript enabled
- Code editor (VS Code recommended)

### Angular Version
Signal Forms ship as an **experimental** part of `@angular/forms` (the `@angular/forms/signals` entry point). This project is on Angular 22 — no extra package is needed.

## 🚀 Project Setup

### 1. Install Dependencies

```bash
# Navigate to project root
cd shopping-cart-workshop

# Install all dependencies (Signal Forms are part of @angular/forms 22)
pnpm install
```

### 2. No Configuration Needed

Signal Forms require **no angular.json flags and no providers** — just import
from the signals entry point where you use them:

```typescript
import { form, required, minLength, submit, FormField, FormRoot } from '@angular/forms/signals';
```

One exception: if a form opts into the WebMCP agent integration via the
`experimentalWebMcpTool` option on `form()`, the app must provide
`provideExperimentalWebMcpForms()` (this project already does — see
`src/app/app.config.ts` and `docs/WEBMCP.md`).

### 3. Add Signal Forms Route

Update your application routes:

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // ... existing routes
  {
    path: 'signal-forms',
    loadChildren: () => import('./signal-forms/signal-forms.routes').then(m => m.signalFormsRoutes)
  }
];
```

### 5. Update Navigation

Add Signal Forms to your main navigation:

```typescript
// src/app/components/navigation/navigation.component.ts
export class NavigationComponent {
  navItems = [
    // ... existing items
    {
      path: '/signal-forms',
      label: 'Signal Forms Workshop',
      icon: '🔥'
    }
  ];
}
```

## 🔧 Development Environment

### VS Code Extensions

Recommended extensions for the best development experience:

```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "angular.experimental-ivy": true,
  "angular.enable-strict-mode-prompt": false,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## 📦 Project Structure

The Signal Forms workshop follows this structure:

```
src/app/signal-forms/
├── components/              # Workshop task components
│   ├── product-form.component.ts
│   ├── checkout-form.component.ts
│   ├── user-profile-form.component.ts
│   └── review-form.component.ts
├── custom-controls/         # Reusable custom controls
│   ├── rating-control.component.ts
│   ├── quantity-selector.component.ts
│   └── price-input.component.ts
├── services/               # Form-related services
│   ├── signal-form.service.ts
│   ├── form-validation.service.ts
│   └── form-submission.service.ts
├── validators/             # Custom validators
│   ├── async-validators.ts
│   └── custom-validators.ts
├── signal-forms.component.ts    # Main workshop component
├── signal-forms.routes.ts       # Workshop routes
└── README.md              # Workshop-specific docs
```

## 🧪 Verification Steps

### 1. Start Development Server

```bash
pnpm start
```

The application should start on `http://localhost:4200`

### 2. Navigate to Signal Forms

Visit `http://localhost:4200/signal-forms` - you should see the workshop interface.

### 3. Check Browser Console

Look for these confirmation messages:
```
✅ Signal Forms enabled
📝 Workshop components loaded
🔧 Services initialized
```

### 4. Test Basic Functionality

1. Click through each workshop tab
2. Verify components load without errors
3. Check that form fields are interactive
4. Confirm validation messages appear

## ⚠️ Common Setup Issues

### Issue: "Cannot find module '@angular/forms/signals'"

**Solution**: reinstall dependencies — the signals entry point ships with `@angular/forms` 22:
```bash
pnpm install
```

### Issue: error mentioning `provideExperimentalWebMcpForms`

**Solution**: a form uses the `experimentalWebMcpTool` option, which requires that provider in `app.config.ts` (already configured in this project — see `docs/WEBMCP.md`).

### Issue: Components not loading

**Solution**: Check import paths in `signal-forms.component.ts`:
```typescript
import { ProductFormComponent } from './components/product-form.component';
```

### Issue: Routing not working

**Solution**: Verify route configuration in `app.routes.ts` and ensure lazy loading is set up correctly.

## 🎯 Development Workflow

### 1. Before Starting Workshop

```bash
# Switch to the forms branch and install
git switch workshop-compelete-form
pnpm install

# Start development server
pnpm start

# Open workshop in browser
open http://localhost:4200/signal-forms
```

### 2. During Development

```bash
# Run tests in watch mode (Karma)
pnpm run test

# Type-check via a production build
pnpm run build
```

### 3. Completing Tasks

1. Navigate to the specific component file
2. Look for `TODO:` comments for guidance
3. Implement the required functionality
4. Test in browser
5. Run tests to verify implementation

## 📊 Performance Configuration

### Enable Ivy Renderer

Ensure Ivy is enabled in `angular.json`:

```json
{
  "projects": {
    "shopping-cart-workshop": {
      "architect": {
        "build": {
          "options": {
            "aot": true,
            "buildOptimizer": true
          }
        }
      }
    }
  }
}
```

### Optimize for Development

Add development optimizations in `angular.json`:

```json
{
  "serve": {
    "options": {
      "hmr": true,
      "liveReload": true,
      "poll": 1000
    }
  }
}
```

## 🔐 Security Considerations

### Content Security Policy

If using CSP, allow inline styles for workshop components:

```html
<meta http-equiv="Content-Security-Policy" 
      content="style-src 'self' 'unsafe-inline';">
```

### Local Storage

The workshop uses localStorage for form persistence. Ensure it's enabled in your browser.

## 📱 Mobile Development

### Responsive Testing

Test the workshop on different screen sizes:

Use the responsive mode in your browser DevTools (Cmd+Shift+M in Chrome)
to test phone/tablet breakpoints.

### Touch Support

Ensure touch events work correctly on custom controls by testing on actual mobile devices or browser dev tools.

## 🚀 Production Deployment

### Build for Production

```bash
# Production build (the default configuration)
pnpm run build

# Verify build output
ls -la dist/shopping-cart-workshop/
```

### Environment Configuration

Configure different environments in `src/environments/`:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  signalFormsEnabled: true,
  apiUrl: 'https://api.yourapp.com'
};
```

## 📋 Troubleshooting Checklist

Before starting the workshop, verify:

- [ ] Angular CLI is version 18+
- [ ] Project dependencies are installed
- [ ] Development server starts without errors
- [ ] Signal Forms route is accessible
- [ ] Browser console shows no critical errors
- [ ] All workshop components load correctly
- [ ] Form interactions work as expected
- [ ] Custom controls render properly

## 🆘 Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify your Angular and Node.js versions
3. Review the troubleshooting section
4. Check the [Angular Signal Forms documentation](https://angular.dev/guide/forms)
5. Post questions in the workshop discussion forum

## 📚 Additional Resources

- [Angular CLI Documentation](https://angular.io/cli)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [VS Code Angular Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)
- [Signal Forms GitHub Repository](https://github.com/angular/angular/tree/main/packages/forms/signals)

---

You're now ready to start the Signal Forms workshop! 🎉