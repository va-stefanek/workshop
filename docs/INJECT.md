# Modern Dependency Injection - inject() Patterns & Advanced DI

Welcome to the **Modern Dependency Injection** module of the Angular Shopping Cart Workshop! This module focuses on mastering the inject() function, advanced provider patterns, and modern service composition techniques.

> ⚠️ **Branch**: the exercise scaffolding for this module (the `config/`, `providers/` and `utils/` folders) lives on the **`workshop-starter-inject`** branch:
> ```bash
> git switch workshop-starter-inject && pnpm install
> ```
> On plain `workshop-starter` only the components and the service exist — Tasks 2, 4 and 5 reference files from that branch.

## 🎯 Learning Objectives

By completing this module, you will:

- Master the inject() function vs constructor injection patterns
- Create advanced provider functions and custom injection tokens
- Understand injection context and runInInjectionContext usage
- Implement modern service composition patterns
- Build functional approaches to dependency injection
- Design provider hierarchies and scoping strategies

## 📁 Files You'll Work With

**Primary Files:**
- `src/app/inject/components/inject-cart.component.ts` - **STARTER FILE** (main workspace)
- `src/app/inject/services/inject-cart.service.ts` - Service using inject() patterns
- `src/app/inject/providers/cart-providers.ts` - Advanced provider functions

**Working Example (provided, no TODOs):**
- `src/app/inject/components/inject-async-demo.component.ts` - injectAsync() lazy service injection demo (route: `/inject/async`)
- `src/app/inject/services/cart-report.service.ts` - the lazily-loaded service

**Supporting Files:**
- `src/app/inject/utils/injection-utils.ts` - Utility functions with inject()
- `src/app/inject/config/cart-config.ts` - Configuration and tokens

## 🏗 Architecture Overview

The inject() implementation uses modern functional DI patterns:

```
┌─────────────────────────────────────────────┐
│              Application Layer              │
│  ┌─────────────────────────────────────┐   │
│  │         main.ts                     │   │
│  │  bootstrapApplication()             │   │
│  │  - Custom provider functions        │   │
│  │  - Injection token setup           │   │
│  │  - Hierarchical providers          │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ provides
                  ▼
┌─────────────────────────────────────────────┐
│              Component Layer                │
│  ┌─────────────────────────────────────┐   │
│  │      Components using inject()      │   │
│  │  - Field-based injection           │   │
│  │  - Functional composition           │   │
│  │  - Conditional injection            │   │
│  │  - No constructor dependencies      │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ uses
                  ▼
┌─────────────────────────────────────────────┐
│              Service Layer                  │
│  ┌─────────────────────────────────────┐   │
│  │       Services with inject()        │   │
│  │  - Field-based service injection   │   │
│  │  - Factory function patterns       │   │
│  │  - Provider composition             │   │
│  │  - Advanced injection patterns     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Step 1: Understand inject() vs Constructor Injection

The inject() function provides a more functional approach to dependency injection:

```typescript
// Traditional constructor injection
@Component({})
export class TraditionalComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}
}

// Modern inject() approach
@Component({})
export class ModernComponent {
  private http = inject(HttpClient);
  private router = inject(Router);  
  private cartService = inject(CartService);
  
  // Conditional injection
  private analytics = inject(AnalyticsService, { optional: true });
}
```

### New in Angular 22: injectAsync()

`inject()` resolves a service that must already be in the bundle. `injectAsync()` injects a *loader* instead — the service's chunk is downloaded on first use (or prefetched when the browser is idle):

```typescript
// field initializer = injection context
private reportService = injectAsync(() =>
  import('../services/cart-report.service').then(m => m.CartReportService)
);

async generateReport() {
  const service = await this.reportService(); // lazy chunk loads HERE, once
  this.report.set(await service.generateCatalogReport());
}

// optional prefetch while the browser is idle:
injectAsync(loader, { prefetch: onIdle });
```

Requirements: the target service must be auto-provided (`providedIn: 'root'` or `@Service()`), and `injectAsync` itself must run in an injection context. Try it live at `/inject/async` — watch the Network tab on the first click.

### Step 2: Navigate to Inject Module

1. Start the development server: `npm start`
2. Open your browser to `http://localhost:4200`
3. Click on "Inject" in the navigation
4. Explore the modern DI patterns

## 📝 Implementation Tasks

### Task 1: Convert Component to inject() Pattern

**Goal**: Refactor a component from constructor injection to inject() pattern.

**Requirements**:
```typescript
// TODO: Convert from constructor injection to inject()
@Component({
  selector: 'inject-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inject-cart">
      <h2>Modern inject() Cart</h2>
      
      <!-- TODO: Implement cart with inject() services -->
      <div class="cart-content">
        <!-- Cart implementation -->
      </div>
    </div>
  `
})
export class InjectCartComponent {
  // TODO: Replace constructor injection with inject()
  
  // OLD: Constructor injection approach
  // constructor(
  //   private cartService: CartService,
  //   private router: Router,
  //   private analytics: AnalyticsService
  // ) {}
  
  // NEW: inject() approach
  private cartService = inject(InjectCartService);
  private router = inject(Router);
  private analytics = inject(AnalyticsService, { optional: true });
  
  // TODO: Optional injection with default values
  private config = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CART_CONFIG;
  
  // TODO: Conditional injection based on environment
  private logger = inject(Logger, { 
    optional: isPlatformBrowser(inject(PLATFORM_ID)) 
  });
  
  // TODO: Implement component methods using injected services
  addToCart(product: Product): void {
    this.cartService.addItem(product);
    this.analytics?.trackEvent('add_to_cart', { productId: product.id });
  }
  
  navigateToCheckout(): void {
    this.router.navigate(['/inject/checkout']);
  }
}
```

### Task 2: Create Advanced Provider Functions

**Goal**: Build sophisticated provider functions for complex DI scenarios.

**Provider Functions**:
```typescript
// TODO: Create cart-providers.ts
export function provideInjectCart(config?: Partial<CartConfig>) {
  return [
    // Core cart service
    InjectCartService,
    
    // Configuration
    { 
      provide: CART_CONFIG, 
      useValue: { ...DEFAULT_CART_CONFIG, ...config } 
    },
    
    // TODO: Analytics provider with factory
    // - inject CART_CONFIG and HttpClient inside useFactory
    // - construct CartAnalyticsService from them
    {
      provide: CartAnalyticsService,
      useFactory: () => { /* your factory */ }
    },

    // TODO: Storage provider chosen by environment
    // - inject PLATFORM_ID, use isPlatformBrowser()
    // - return BrowserStorageService or ServerStorageService
    {
      provide: STORAGE_SERVICE,
      useFactory: () => { /* your factory */ }
    }
  ];
}

// TODO: Specialized provider functions
// provideCartPersistence(): provide CartPersistenceService via a factory
//   that injects STORAGE_SERVICE + CART_CONFIG
// provideCartAnalytics(analyticsConfig?): provide ANALYTICS_CONFIG by value,
//   then a factory that falls back to NoOpAnalyticsService when the config
//   is absent (inject with { optional: true })
```

### Task 3: Implement Service with inject() Patterns

**Goal**: Create a service that exclusively uses inject() for all dependencies.

**Service Implementation**:
```typescript
@Injectable({
  providedIn: 'root'
})
export class InjectCartService {
  // TODO: Use inject() for ALL dependencies (no constructor parameters!)
  // - HttpClient, STORAGE_SERVICE, CART_CONFIG
  // - CartAnalyticsService and Logger as OPTIONAL injections

  // TODO: State management with signals
  // - cartItems: signal<CartItem[]>
  // - cartMeta: signal<CartMetadata> (sessionId, created, lastUpdated)

  // TODO: Readonly accessors (asReadonly) and a `summary` computed
  // (totalPrice, totalItems, tax from config.taxRate, finalPrice)

  constructor() {
    // TODO: load persisted cart, then set up an auto-save effect that
    // writes items + metadata to the injected storage on every change
  }

  // TODO: addItem(product) — reuse the quantity-increment pattern from
  // earlier levels; report 'item_added' through the OPTIONAL analytics
  // service (what operator does optional chaining give you here?)
}
```

### Task 4: Advanced Injection Patterns

**Goal**: Implement sophisticated injection patterns for complex scenarios.

**Injection Utilities**:
```typescript
// TODO: Create injection-utils.ts
export function createCartFactory(customConfig?: Partial<CartConfig>) {
  return () => {
    // This function runs in injection context
    const baseConfig = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CART_CONFIG;
    const http = inject(HttpClient);
    const storage = inject(STORAGE_SERVICE);
    
    const config = { ...baseConfig, ...customConfig };
    return new InjectCartService(config, http, storage);
  };
}

export function injectOptionalService<T>(token: Type<T> | InjectionToken<T>): T | null {
  try {
    return inject(token, { optional: true });
  } catch {
    return null;
  }
}

export function injectWithFallback<T>(
  token: Type<T> | InjectionToken<T>,
  fallback: T
): T {
  return inject(token, { optional: true }) ?? fallback;
}

// TODO: Conditional injection based on feature flags
export function injectIfFeatureEnabled<T>(
  token: Type<T> | InjectionToken<T>,
  feature: string
): T | null {
  const featureFlags = inject(FEATURE_FLAGS, { optional: true });
  
  if (featureFlags?.isEnabled(feature)) {
    return inject(token, { optional: true });
  }
  
  return null;
}

// TODO: Runtime injection context creation
export function createInjectionContext(providers: Provider[]) {
  const injector = Injector.create({ providers });
  
  return <T>(fn: () => T): T => {
    return runInInjectionContext(injector, fn);
  };
}
```

### Task 5: Functional Service Composition

**Goal**: Create services using functional composition patterns with inject().

**Functional Services**:
```typescript
// TODO: Functional service creation patterns
// TODO: createCartAnalytics()
// - inject HttpClient and ANALYTICS_CONFIG ({ optional: true }) AT THE TOP
//   (inject() only works in the synchronous part of the call!)
// - return an object with trackEvent(event, data) and trackPageView(page)
//   that no-op when config is absent/disabled

// TODO: createCartValidator()
// - inject CART_CONFIG
// - return { validateItem(item): ValidationResult, validateCart(items) }
//   enforcing quantity > 0, price > 0 and config.maxItems
```

### Task 6: Advanced Provider Hierarchies

**Goal**: Create sophisticated provider hierarchies and scoping strategies.

**Provider Hierarchies**:
```typescript
// TODO: Multi-level provider configuration
export function provideCartFeature() {
  return makeEnvironmentProviders([
    // Core services
    InjectCartService,
    
    // Feature-specific providers
    { provide: CART_FEATURE_CONFIG, useValue: CART_FEATURE_DEFAULTS },
    
    // Scoped providers
    {
      provide: CartSessionService,
      useFactory: () => {
        const storage = inject(STORAGE_SERVICE);
        const config = inject(CART_FEATURE_CONFIG);
        return new CartSessionService(storage, config.session);
      }
    }
  ]);
}

// TODO: Route-level providers
export const CART_ROUTES: Routes = [
  {
    path: 'cart',
    component: InjectCartComponent,
    providers: [
      // Route-specific cart configuration
      { provide: CART_CONFIG, useValue: ROUTE_SPECIFIC_CONFIG },
      
      // Route-scoped services
      CartSessionService
    ]
  },
  {
    path: 'admin',
    component: AdminCartComponent,
    providers: [
      // Admin-specific cart configuration
      { provide: CART_CONFIG, useValue: ADMIN_CART_CONFIG },
      
      // Admin-only services
      AdminCartService
    ]
  }
];
```

## ✅ Verifying Your Implementation

### Manual Checklist

**inject() Conversion**:
- ✅ All components work with inject() instead of constructor injection
- ✅ Optional injections handle missing services gracefully
- ✅ Conditional injection works based on environment/features

**Provider Functions**:
- ✅ Custom provider functions create correct service instances
- ✅ Configuration is properly injected and used
- ✅ Factory functions have access to all required dependencies

**Service Composition**:
- ✅ Functional services work correctly
- ✅ Service factories create properly configured instances
- ✅ Injection utilities handle edge cases correctly

## 🧪 Code Examples

### Complete inject() Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class CompleteInjectService {
  // Basic service injection
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Optional service injection
  private analytics = inject(AnalyticsService, { optional: true });
  private logger = inject(Logger, { optional: true });
  
  // Configuration injection with fallback
  private config = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CONFIG;
  
  // Platform-specific injection
  private storage = inject(PLATFORM_ID).pipe(
    map(platformId => isPlatformBrowser(platformId) 
      ? inject(BrowserStorageService)
      : inject(ServerStorageService)
    )
  );
  
  // Conditional injection based on feature flags
  private advancedFeatures = (() => {
    const features = inject(FEATURE_FLAGS, { optional: true });
    return features?.isEnabled('advanced-cart') 
      ? inject(AdvancedCartService, { optional: true })
      : null;
  })();
  
  // Signal-based state
  private items = signal<CartItem[]>([]);
  
  // Public API
  public readonly cartItems = this.items.asReadonly();
  
  constructor() {
    this.initializeService();
  }
  
  private initializeService() {
    // Use injected services for initialization
    this.loadPersistedData();
    this.setupAnalytics();
    this.configureAdvancedFeatures();
  }
  
  addItem(product: Product) {
    // Implementation using injected services
    this.items.update(items => [...items, this.createCartItem(product)]);
    this.analytics?.trackEvent('item_added', { productId: product.id });
    this.logger?.debug('Item added to cart', product);
  }
  
  private createCartItem(product: Product): CartItem {
    return {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      addedAt: new Date()
    };
  }
}
```

### Advanced Provider Factory

```typescript
export function createAdvancedCartProvider(options: CartProviderOptions = {}) {
  return {
    provide: InjectCartService,
    useFactory: () => {
      // All these inject() calls happen in the injection context
      const http = inject(HttpClient);
      const storage = inject(STORAGE_SERVICE);
      const config = inject(CART_CONFIG);
      
      // Optional services
      const analytics = inject(AnalyticsService, { optional: true });
      const logger = inject(Logger, { optional: true });
      
      // Environment-specific services
      const platformId = inject(PLATFORM_ID);
      const syncService = isPlatformBrowser(platformId)
        ? inject(BrowserSyncService, { optional: true })
        : inject(ServerSyncService, { optional: true });
      
      // Create service with all dependencies
      const service = new InjectCartService(
        http,
        storage,
        { ...config, ...options.config }
      );
      
      // Configure optional features
      if (analytics) {
        service.enableAnalytics(analytics);
      }
      
      if (logger) {
        service.enableLogging(logger);
      }
      
      if (syncService && options.enableSync) {
        service.enableSync(syncService);
      }
      
      return service;
    }
  };
}
```

## 🔧 Debugging and Best Practices

### Common Issues

**Issue**: inject() called outside injection context
**Solution**: Ensure inject() is called in constructor, field initializer, or factory function

**Issue**: Circular dependency with inject()
**Solution**: Use forwardRef or restructure dependencies

**Issue**: Optional injection not working as expected
**Solution**: Check injection token and provider configuration

### Debugging Tips

```typescript
// Add debugging to injection
export class DebugInjectService {
  private http = (() => {
    console.log('Injecting HttpClient');
    return inject(HttpClient);
  })();
  
  private config = (() => {
    const config = inject(CART_CONFIG, { optional: true });
    console.log('Injected config:', config);
    return config ?? DEFAULT_CONFIG;
  })();
  
  constructor() {
    console.log('Service created with dependencies:', {
      hasHttp: !!this.http,
      configSource: this.config === DEFAULT_CONFIG ? 'default' : 'injected'
    });
  }
}
```

## 📊 Performance and Benefits

### inject() Advantages

**Code Organization**:
- ✅ Cleaner service constructors
- ✅ Better field-based organization
- ✅ More explicit dependency declarations

**Functionality**:
- ✅ Conditional injection capabilities
- ✅ Optional injection with fallbacks
- ✅ Better integration with functional patterns

### Performance Considerations

```typescript
// Performance monitoring for inject() services
@Injectable()
export class PerformanceMonitoredService {
  private startTime = performance.now();
  
  private http = inject(HttpClient);
  private config = inject(CART_CONFIG);
  
  constructor() {
    const injectionTime = performance.now() - this.startTime;
    console.log(`Service injection took ${injectionTime}ms`);
  }
}
```

## 🎯 Success Criteria

You've successfully completed the Inject module when:

- ✅ All components and services use inject() instead of constructor injection
- ✅ Advanced provider functions work correctly
- ✅ Optional and conditional injection patterns work as expected
- ✅ Functional service composition patterns are implemented
- ✅ Provider hierarchies and scoping work correctly
- ✅ Injection utilities handle edge cases properly
- ✅ Performance is equivalent or better than constructor injection

## 💡 Key Takeaways

### inject() Advantages

**Modern Patterns**:
- More functional approach to DI
- Better alignment with modern JavaScript
- Improved tree-shaking potential

**Flexibility**:
- Conditional and optional injection
- Runtime dependency resolution
- Better factory function support

**Maintainability**:
- Clearer dependency declarations
- Easier refactoring
- Better IDE support

### When to Use inject()

**Use inject() when**:
- ✅ Building new components/services
- ✅ Need conditional or optional injection
- ✅ Working with functional patterns
- ✅ Want cleaner field-based organization

**Use constructor injection when**:
- ✅ Working with legacy code
- ✅ Team prefers traditional patterns
- ✅ Need complex constructor logic
- ✅ Using class inheritance patterns

## 🚀 Next Steps

After mastering Modern DI with inject():

1. **Refactor existing services**: Gradually migrate to inject() patterns
2. **Create provider libraries**: Build reusable provider functions
3. **Explore advanced patterns**: Complex injection hierarchies
4. **Optimize for tree-shaking**: Functional service composition

---

**Workshop Complete!** You've now mastered all modern Angular patterns: Control Flow, Standalone Components, and Modern Dependency Injection.