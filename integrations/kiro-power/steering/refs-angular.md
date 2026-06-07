---
inclusion: manual
---

# References: angular

> 16 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-angular.md`.

## angular-architecture

### folder-structure

# Folder Structure

```text
src/
├── app/
│   ├── app.config.ts         # Application Config (Providers)
│   ├── app.routes.ts         # Root Routes
│   ├── app.component.ts      # Root Component
│   ├── core/                 # Singleton services, interceptors, guards
│   │   ├── auth/
│   │   └── interceptors/
│   ├── shared/               # Reusable presentational components
│   │   ├── ui/
│   │   └── utils/
│   └── features/             # Business features
│       ├── dashboard/
│       │   ├── dashboard.component.ts
│       │   ├── dashboard.routes.ts
│       │   └── components/   # Feature-specific dumb components
│       └── profile/
└── assets/
```


---

## angular-components

### control-flow

# Control Flow

## Conditional (@if)

```html
@if (user(); as u) {
<app-profile [user]="u" />
} @else if (loading()) {
<app-spinner />
} @else {
<p>No user found</p>
}
```

## Loop (@for)

ALWAYS provide a tracking function.

```html
@for (item of items(); track item.id) {
<app-item [item]="item" />
} @empty {
<p>List is empty</p>
}
```

## Switch (@switch)

```html
@switch (status()) { @case ('active') { <span class="badge">Active</span> }
@case ('pending') { <span class="badge">Pending</span> } @default {
<span class="badge">Unknown</span> } }
```


---

### standalone-pattern

# Standalone Pattern

## Component

```typescript
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="card">
      <h2>{{ name() }}</h2>
      <button mat-button (click)="onSelect()">Select</button>
    </div>
  `,
})
export class UserCardComponent {
  // Signal Input
  name = input.required<string>();

  // Output Function
  select = output<void>();

  onSelect() {
    this.select.emit();
  }
}
```


---

## angular-dependency-injection

### di-patterns

# DI Patterns

## `inject()` Usage

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  // vs
  // constructor(private http: HttpClient) {}
}
```

## Injection Tokens (Configuration)

```typescript
export const API_URL = new InjectionToken<string>('API_URL');

// In app.config.ts
providers: [{ provide: API_URL, useValue: 'https://api.example.com' }];

// Usage
const apiUrl = inject(API_URL);
```

## Interface Abstraction

```typescript
export const LOGGER = new InjectionToken<Logger>('LOGGER');

// Provide different implementation for Dev/Prod or Test
{ provide: LOGGER, useClass: ProductionLogger }
```


---

## angular-directives-pipes

### composition

# Composition w/ HostDirectives

## Host Directives

Compose behaviors.

```typescript
@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective { ... }

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button><ng-content/></button>`,
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['tooltip'], // Alias input
      outputs: ['tooltipShow']
    }
  ]
})
export class ButtonComponent {
  // Now <app-button> automatically has tooltip capability
}
```


---

## angular-forms

### typed-forms

# Typed Forms

## Definition

```typescript
interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

@Component({...})
export class LoginComponent {
  fb = inject(FormBuilder).nonNullable;

  form: FormGroup<LoginForm> = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });

  submit() {
    if (this.form.valid) {
      // value is strictly typed: { email: string, ... }
      const value = this.form.getRawValue();
    }
  }
}
```

## Minimal Typed FormGroup

```typescript
interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({ /* ... */ })
export class LoginComponent {
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group<LoginForm>({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
}
```

## Standalone Validator

```typescript
// validators/password.validator.ts
export function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  return hasUpperCase && hasNumber ? null : { weakPassword: true };
}
```


---

## angular-http-client

### interceptors

# Interceptors

## Setup

In `app.config.ts`:

```typescript
provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor]));
```

## Auth Interceptor Example

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
```


---

## angular-performance

### defer-usage

# Defer Usage

## Basic Syntax

Lazy load `app-heavy-chart` when it enters the viewport.

```html
@defer (on viewport) {
<app-heavy-chart [data]="data()" />
} @loading (minimum 500ms) {
<app-spinner />
} @placeholder {
<div>Chart will appear here</div>
} @error {
<p>Failed to load chart</p>
}
```

## Triggers

- `on viewport`: When element enters screen.
- `on idle`: When browser is idle (default).
- `on interaction`: When user clicks/interacts with placeholder.
- `on hover`: When user hovers placeholder.
- `on immediate`: Immediately (non-blocking).
- `when condition`: When a boolean expression is true.


---

## angular-routing

### routing-patterns

# Routing Patterns

## Lazy Loading & Functional Guards

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [adminGuard],
  },
];
```

## Component Input Binding

Enable in `app.config.ts`:

```typescript
provideRouter(routes, withComponentInputBinding());
```

Usage in Component:

```typescript
@Component({...})
export class HeroComponent {
  // Automatically populated from route param :id
  id = input<string>();

  // From query param ?search=...
  search = input<string>();
}
```

## Functional Guard

```typescript
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAdmin() ? true : router.createUrlTree(['/login']);
};
```

## Lazy-Loaded Route with Guard and Title

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard'
  }
];
```

## Auth Guard (Functional)

```typescript
export const authGuard: CanActivateFn = () =>
  inject(AuthService).isAuthenticated()
    ? true
    : inject(Router).createUrlTree(['/login']);
```


---

## angular-rxjs-interop

### observables-vs-signals

# Signals vs Observables

## When to use what?

| Feature      | Use Signals (Sync)               | Use Observables (Async Stream)        |
| ------------ | -------------------------------- | ------------------------------------- |
| **State**    | ✅ Best for state holding values | ❌ Overkill                           |
| **Events**   | ❌ Cannot handle streams         | ✅ Best for clicks, typing (debounce) |
| **Derived**  | ✅ `computed()`                  | ⚠️ `combineLatest` (complex)          |
| **Template** | ✅ Fine-grained updates          | ⚠️ `async` pipe (Zone.js overhead)    |

## Conversion Patterns

### Observable to Signal (Read)

```typescript
// Component
private userService = inject(UserService);
private route = inject(ActivatedRoute);

// Stream of IDs from route
id$ = this.route.params.pipe(map(p => p['id']));

// Fetch user when ID changes
user$ = this.id$.pipe(
  switchMap(id => this.userService.getUser(id))
);

// Expose as Signal to template
user = toSignal(this.user$);
```

### Signal to Observable (Write/React)

```typescript
searchQuery = signal('');

// Debounce search input
results$ = toObservable(this.searchQuery).pipe(
  debounceTime(300),
  switchMap((q) => this.api.search(q)),
);
```


---

## angular-security

### security-best-practices

# Security Best Practices

## Sanitization

Angular automatically sanitizes binding values.

```html
<!-- Safe -->
<div>{{ maliciousContent }}</div>

<!-- Potentially Unsafe (Angular sanitizes known threats) -->
<div [innerHTML]="htmlContent"></div>
```

If you MUST bypass (e.g., embedding Youtube):

```typescript
// Create a pipe for this
@Pipe({ name: 'safeUrl', standalone: true })
export class SafeUrlPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer);
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
```

```html
<iframe [src]="videoUrl | safeUrl"></iframe>
```


---

## angular-ssr

### hydration

# Hydration

## Enable Hydration

In `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration()],
};
```

## Browser-Only Code

Do not use `isPlatformBrowser`. Use Lifecycle hooks.

```typescript
@Component({...})
export class ChartComponent {
  constructor() {
    afterNextRender(() => {
      // Safe to use window/document here
      // This only runs on the browser
      new Chart(document.getElementById('chart'));
    });
  }
}
```

## Full App Config with Hydration and Transfer Cache

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withHttpTransferCacheOptions({ includePostRequests: false }))
  ]
};
```


---

## angular-state-management

### signal-store

# Signal Store Pattern

Using `@ngrx/signals`.

```typescript
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

type TodoState = {
  items: Todo[];
  filter: 'all' | 'pending' | 'done';
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState<TodoState>({ items: [], filter: 'all' }),
  withComputed(({ items, filter }) => ({
    filteredItems: computed(() => {
      // filter logic derived from state
    }),
  })),
  withMethods((store) => ({
    addTodo(title: string) {
      patchState(store, (state) => ({
        items: [...state.items, { id: Date.now(), title, done: false }],
      }));
    },
    // Async method
    async loadTodos() {
      const todos = await inject(TodoService).getAll();
      patchState(store, { items: todos });
    },
  })),
);
```

## Signal-Based Service

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  readonly displayName = computed(() => this._user()?.name ?? 'Guest');

  async loadUser(id: string) {
    this._loading.set(true);
    this._user.set(await this.api.getUser(id));
    this._loading.set(false);
  }
}
```


---

## angular-style-guide

### naming-convention

# Naming Conventions

## Types

| construct       | file name                           | class name           | selector/name   |
| --------------- | ----------------------------------- | -------------------- | --------------- |
| **Component**   | `hero-list.component.ts`            | `HeroListComponent`  | `app-hero-list` |
| **Service**     | `user-profile.service.ts`           | `UserProfileService` | -               |
| **Directive**   | `validate.directive.ts`             | `ValidateDirective`  | `[appValidate]` |
| **Pipe**        | `truncate.pipe.ts`                  | `TruncatePipe`       | `truncate`      |
| **Guard**       | `auth.guard.ts`                     | `AuthGuard`          | -               |
| **Interceptor** | `auth.interceptor.ts`               | `authInterceptor`    | -               |
| **Model**       | `hero.model.ts` (or just `hero.ts`) | `Hero`               | -               |

## Member Names

- **Signals**: Suffix with `Sig` is optional but helpful if mixing with RxJS. Prefer just the noun if purely signal-based.
- **Observables**: Suffix with `$` (e.g., `heroes$`).
- **Outputs**: Action verbs (e.g., `delete`, `save`). Event handlers: `onDelete`, `onSave`.


---

## angular-testing

### harness-pattern

# Harness Pattern

## Using Harnesses

Instead of `fixture.nativeElement.querySelector('button')`, use a harness.

```typescript
// button.harness.ts
export class ButtonHarness extends ComponentHarness {
  static hostSelector = 'app-button';
  protected getButton = this.locatorFor('button');

  async click() {
    const btn = await this.getButton();
    await btn.click();
  }

  async getText() {
    const btn = await this.getButton();
    return btn.text();
  }
}

// component.spec.ts
it('should save on click', async () => {
  const btn = await loader.getHarness(ButtonHarness);
  await btn.click();
  expect(component.saved).toBeTrue();
});
```

## MatButtonHarness Example

```typescript
it('should submit form on button click', async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const button = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
  await button.click();
  expect(component.submitted).toBe(true);
});
```

## HttpTestingController Example

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [UserComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()]
  });
  httpTesting = TestBed.inject(HttpTestingController);
});

afterEach(() => httpTesting.verify());

it('should load users', () => {
  const req = httpTesting.expectOne('/api/users');
  req.flush([{ id: 1, name: 'Alice' }]);
  expect(component.users().length).toBe(1);
});
```


---

## angular-tooling

### REFERENCE

# Angular Tooling — Reference Examples

## Project Creation

```bash
# New project with SCSS, routing enabled
ng new my-app --style=scss --routing --strict

# Add SSR support
ng add @angular/ssr
```

## Code Generation

```bash
# Component with OnPush change detection
ng g component features/user-profile --change-detection=OnPush

# Standalone service, scoped to root
ng g service services/auth

# Functional guard (no class-based)
ng g guard guards/auth --functional

# Pipe as standalone
ng g pipe pipes/truncate --standalone

# Preview any generator first
ng g c features/dashboard --dry-run
```

## Build & Test

```bash
# Production build
ng build -c production

# Code coverage (single run)
ng test --code-coverage --watch=false

# Bundle analysis
ng build -c production --stats-json
npx esbuild-visualizer --metadata dist/my-app/browser/stats.json --open
```

## Angular Update (with migrations)

```bash
ng update                                  # list available updates
ng update @angular/core @angular/cli       # apply official codemods
```


---

