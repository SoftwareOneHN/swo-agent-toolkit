---
inclusion: manual
---

# Skills: angular

> 15 skills. Load when editing angular files.
> For code examples and implementation patterns, load `refs-angular.md`.

## Index

# angular Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **angular-architecture** | `angular.json` | angular components, standalone, feature module, lazy loading, loadComponent, loadChildren |
| **angular-components** | `**/*.component.ts`, `**/*.component.html` | angular component, standalone, input signal, output, @if, @for, ChangeDetectionStrategy, OnPush, Input, Output |
| **angular-dependency-injection** | `**/*.service.ts` | angular inject, providedIn, injection token, provideAppInitializer |
| angular-directives-pipes | `**/*.directive.ts`, `**/*.pipe.ts` | hostDirectives, PipeTransform, pure |
| angular-http-client | `**/*.service.ts`, `**/*.interceptor.ts` | HttpClient, HttpInterceptorFn, withInterceptors, httpResource, resource |
| angular-performance | `ChangeDetectionStrategy.OnPush` | @defer, NgOptimizedImage, runOutsideAngular, OnPush |
| **angular-routing** | `*.routes.ts` | angular router, loadComponent, canActivate, resolver |
| angular-ssr | `**/*.server.ts`, `server.ts` | hydration, transferState, afterNextRender, isPlatformServer, RenderMode |
| angular-state-management | `**/*.store.ts`, `**/state/**` | angular signals, signal store, computed, effect, linkedSignal |
| angular-testing | `**/*.spec.ts` | TestBed, ComponentFixture, TestHarness, provideHttpClientTesting |
| angular-tooling | `angular.json` | ng generate, ng build, ng serve, ng test, ng add, angular cli, bundle analysis |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| angular-forms | FormBuilder, FormGroup, FormControl, Validators, reactive forms, typed forms |
| angular-rxjs-interop | toSignal, toObservable, takeUntilDestroyed, rxjs angular |
| **angular-security** | DomSanitizer, innerHTML, bypassSecurityTrust, CSP, angular security, route guard |
| **angular-style-guide** | angular style, naming convention, file structure, angular-style-guide |

> Load matched skills: `<SKILLS>/angular/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### angular-architecture

---
name: angular-architecture
description: Standards for Angular project structure, feature modules, and lazy loading. Use when structuring Angular apps, defining feature modules, or configuring lazy loading.
metadata:
  triggers:
    files:
    - 'angular.json'
    keywords:
    - angular components
    - standalone
    - feature module
    - lazy loading
    - loadComponent
    - loadChildren
---
# Angular Architecture

## **Priority: P0 (CRITICAL)**

## Principles

- **Feature-Based**: Organize by **feature folder** (e.g., `features/dashboard/`) containing components, services, and models. Apply **LIFT**: **Locate**, **Identify**, **Flat structure**, **Try DRY**.
- **Standalone First**: **Use standalone components**, Pipes, and Directives. **Eliminate NgModule** for new code; use **standalone: true** (or default in Angular 20+).
- **Core vs Shared**:
 - `core/`: **Global singletons** (AuthService, Interceptors). **Never put singletons in shared/**.
 - `shared/`: Reusable UI components, pipes, utils (Buttons, Formatters).
- **Smart vs Dumb**:
 - **Smart (Container)**: Talks to services, manages state.
 - **Dumb (Presentational)**: Inputs/Outputs only. No logic. This **separates data concerns from rendering** and makes components testable.

## Guidelines

- **Lazy Loading**: All feature routes MUST lazy loaded using **loadComponent** or **loadChildren**.
 - Example: `{ path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) }`
- **Flat Modules**: Avoid deep nesting of modules.
- **Barrel Files**: Use carefully. Prefer direct imports for better tree-shaking in some build tools (though modern bundlers handle barrels well).

## Verification Checklist (Mandatory)

- [ ] **Lazy Loading**: all feature routes using `loadComponent` or `loadChildren`?
- [ ] **Standalone**: components, pipes, and directives standalone?
- [ ] **Core/Shared**: global services in `core/` and reusable UI in `shared/`?
- [ ] **Smart/Dumb**: presentational components logic-free with only @Input/@Output?
- [ ] **Signals**: you using Signals for local state where applicable (Angular 16+)?

## Anti-Patterns

- **No NgModule**: Eliminate NgModule for new code; use standalone components.
- **No eager feature imports**: Lazy load all features with `loadComponent` or `loadChildren`.
- **No type-based folders**: Organize by feature, not by `/components`, `/services` top-level dirs.

## References

- [Folder Structure](references/folder-structure.md)

---

### angular-components

---
name: angular-components
description: Build standalone Angular components with Signals inputs, OnPush change detection, Control Flow, and Smart/Dumb patterns. Use when building standalone Angular components, implementing @if/@for control flow, applying OnPush change detection, or implementing Signals in Angular components.
metadata:
  triggers:
    files:
    - '**/*.component.ts'
    - '**/*.component.html'
    keywords:
    - angular component
    - standalone
    - input signal
    - output
    - "@if"
    - "@for"
    - ChangeDetectionStrategy
    - OnPush
    - Input
    - Output
---
# Angular Components

## **Priority: P0 (CRITICAL)**

## Standalone & Structure

- **Standalone**: `standalone: true`. Import all deps in `imports` array. No NgModule. (Angular 20+: standalone default.)
- **Smart/Dumb Split**: **Smart (Container)** → inject services, manage state. **Presentational (Dumb)** → accept inputs and emit events via outputs only; no service dependencies.
- **Host Bindings**: Define in `host: { }` on `@Component` (e.g., `'[class.active]': 'isActive()'`) — never use @HostBinding/@HostListener.
- **View Encapsulation**: Default `Emulated`. Use `None` carefully.

## Signals & Change Detection

- **OnPush**: ALWAYS use `ChangeDetectionStrategy.OnPush`. No exceptions.
- **Signal Inputs**: `input.required<T>()` or `input<T>()` not `@Input()`. Access as functions: `{{ userId() }}`. Use `booleanAttribute`/`numberAttribute` transforms.
- **Signal Outputs**: `output<T>()` (v17.3+) not `@Output() EventEmitter`. Two-way binding: `model()`.
- **State**: `signal()` local, `computed()` derived, `effect()` side effects only.
- **Cleanup**: `toSignal()` (auto-unsubscribes), `takeUntilDestroyed()`, or `DestroyRef`. Never `subscribe()` without cleanup.

## Control Flow

- Use `@if (condition)`, `@for (item of items; track item.id)`, `@switch`, `@empty { }` instead of `*ngIf`/`*ngFor` (new control flow syntax, Angular 17+).

## Anti-Patterns

- **No default CD**: OnPush only — default re-checks every component every event.
- **No functions in templates**: `{{ calculate() }}` re-evaluates every cycle → `computed()` instead.
- **No manual subscribe**: `async` pipe or `toSignal`. Never `subscribe()` without cleanup.
- **No ElementRef mutation**: Directives or Renderer2.
- **No class inheritance**: Compose with Directives and Services.

## References

- [Standalone Pattern](references/standalone-pattern.md)
- [Control Flow](references/control-flow.md)


---

### angular-dependency-injection

---
name: angular-dependency-injection
description: Configure DI, inject() usage, and providers in Angular. Use when configuring Angular dependency injection, using inject(), or defining providers.
metadata:
  triggers:
    files:
    - '**/*.service.ts'
    keywords:
    - angular inject
    - providedIn
    - injection token
    - provideAppInitializer
---
# Dependency Injection

## **Priority: P0 (CRITICAL)**

## Principles

- **`inject()` over Constructor**: Use **inject(MyService)** function in **class fields or constructor-equivalent** class positions for cleaner injection. It works in any **injection context** (class fields, factory functions, guards).
- **Tree Shaking**: Always use **@Injectable({ providedIn: 'root' })** for app-wide singletons unless specific scoping required.
- **Tokens**: Use **new InjectionToken<T>('description')** for configuration, primitives, or interface abstraction. Provide via: **{ provide: API_URL, useValue: 'https://api.example.com' }** in `app.config.ts`. Inject with: **inject(API_URL)**.

## Guidelines

- **Providers**: Prefer **provide\*()** functions (e.g., **provideHttpClient()**) in `app.config.ts` providers array over importing NgModules.
- **Factories**: Use `useFactory` strictly when dependencies need runtime configuration.
- **App Initializer**: Use **provideAppInitializer(() => inject(ConfigService).load())** (Angular 19+) to run async code **before app bootstrap** — replaces old `APP_INITIALIZER` token pattern.
- **Route Providers**: Scope services to route tree using **providers: [MyService]** in **route config** ( routes array) instead of `providedIn: 'root'`. This creates instance destroyed when leaving route.
- **Multi Providers**: Use **{ provide: TOKEN, useClass: Impl, multi: true }** to **collects all multi providers** into array (e.g., **HTTP_INTERCEPTORS**, validators).

## Anti-Patterns

- **No `providedIn: 'platform'`**: Use `'root'` scoping; reserve platform only for Micro Frontend sharing.
- **No `forwardRef`**: Refactor architecture to eliminate circular dependencies instead.

## References

- [DI Patterns](references/di-patterns.md)

---

### angular-directives-pipes

---
name: angular-directives-pipes
description: Compose HostDirectives and Pure Pipes in Angular. Use when creating attribute directives with HostDirectives or writing pure pipes in Angular.
metadata:
  triggers:
    files:
    - '**/*.directive.ts'
    - '**/*.pipe.ts'
    keywords:
    - hostDirectives
    - PipeTransform
    - pure
---
# Directives & Pipes

## **Priority: P2 (MEDIUM)**

## Principles

- **Composition**: Use **hostDirectives: [TooltipDirective]** on `@Component` or `@Directive` decorators to compose behaviors without inheritance. Expose inputs/outputs via **hostDirectives: [{ directive: TooltipDirective, inputs: ['text'] }]**.
- **Pure Pipes**: Decorate with `@Pipe({ name: 'truncate', standalone: true, pure: true })`. Implement **PipeTransform** with `transform(value: string, limit = 50)` method. Pipes must **pure: true** (default) to **cache results** by input reference — Angular only re-runs them when reference changes. ** not set pure: false** unless handling Observables/Arrays that mutate.
- **Directive Logic**: Encapsulate reusable DOM manipulation or behavioral logic in **standalone: true** Directives (e.g., **selector: '[appHighlight]'**). **Inject ElementRef/Renderer2 for DOM access**.

## Guidelines

- **Signal Inputs**: Directives and Pipes support signal inputs.
- **Standalone**: All Pipes and Directives must standalone. ** not declare in NgModule**; import directly in component **imports array**. Use **ng generate directive** to scaffold.

## Anti-Patterns

- **No @HostBinding/@HostListener**: Use **host: {} object** in `@Directive` decorator — not with @HostBinding or @HostListener (e.g., **'(mouseenter)': 'show()'**, **'[attr.aria-label]': 'text()'**) — these decorators deprecated patterns.
- **No impure pipes for static transforms**: Keep `pure: true` (default); use `async` pipe for Observables.
- **No structural directives for conditionals**: Use native `@if`/`@for`/`@switch` block syntax.

## References

- [Composition](references/composition.md)

---

### angular-forms

---
name: angular-forms
description: Build typed reactive forms with strict FormGroup typing, custom validators, and nonNullable controls in Angular. Use when implementing typed reactive forms, custom validators, or form control patterns.
metadata:
  triggers:
    keywords:
    - FormBuilder
    - FormGroup
    - FormControl
    - Validators
    - reactive forms
    - typed forms
---
# Forms

## **Priority: P2 (MEDIUM)**

## 1. Use Strictly Typed Reactive Forms

- Always use Reactive Forms over Template-Driven for complex inputs.
- Define typed `FormGroup<T>` with explicit control types — never use untyped FormGroup.

See [typed forms](references/typed-forms.md) for typed FormGroup examples.

## 2. Extract Validation Logic

- Create standalone validator functions in separate file.
- Sync `valueChanges` to stores using `takeUntilDestroyed()`.

See [typed forms](references/typed-forms.md) for standalone validator examples.

## 3. Ensure NonNullable Controls

- Use `fb.nonNullable.group(...)` or `nonNullable: true` on individual controls.
- This ensures form values always strings — avoids null in form values.

## Anti-Patterns

- **No Template-Driven Forms**: Use Reactive Forms for any non-trivial inputs.
- **No untyped FormGroup**: Always use strictly typed `FormGroup<T>`.
- **No validation in component**: Extract into standalone validator functions.

## References

- [Typed Forms](references/typed-forms.md)

---

### angular-http-client

---
name: angular-http-client
description: Integrate HttpClient, Interceptors, and API interactions in Angular. Use when integrating HttpClient, writing interceptors, or handling API calls in Angular.
metadata:
  triggers:
    files:
    - '**/*.service.ts'
    - '**/*.interceptor.ts'
    keywords:
    - HttpClient
    - HttpInterceptorFn
    - withInterceptors
    - httpResource
    - resource
---
# HTTP Client

## **Priority: P1 (HIGH)**

## Principles

- **Functional Interceptors**: Use **HttpInterceptorFn** (e.g., `(req, next) => next(req.clone({ setHeaders: { Authorization: token } }))`). Clone requests with `req.clone(` — **class-based interceptors deprecated**. Register via **withInterceptors([...])** in **provideHttpClient**.
- **Typed Responses**: Always type `http.post<T>()`, `http.get<T>()`. Use `inject(HttpClient)` in services (not constructor injection). Add **provideHttpClient(withInterceptors([...]), withFetch())** to `app.config.ts`.
- **Services**: **Encapsulate all HTTP calls in Services**. Never call `http` in Components.

## Signal-Based HTTP (Angular 17+)

Prefer **httpResource<T>()** over manual subscribe for reactive data loading — it auto-refetches when its signal inputs change:

```typescript
// Reactive: refetches automatically when userId() changes
userResource = httpResource<User>(() => `/api/users/${this.userId()}`);
// States: .isLoading() | .hasValue() | .error() | .value() | .reload()
```

Use **resource<T, P>({ request: () => params(), loader: ... })** for non-HTTP async operations with full **.isLoading()** lifecycle control.

## Guidelines

- **Caching**: Implement caching in interceptors or using `shareReplay(1)` in services.
- **Error Handling**: **Handle errors in service** using `catchError` or global interceptors, not components. Use **notification service** for display.
- **Context**: Use **HttpContext** to pass metadata to interceptors (e.g., **skip error handling** or specific caching rules).

## Anti-Patterns

- **No HTTP in Components**: **Encapsulate all HTTP calls in Services**.
- **No class-based interceptors**: Use `HttpInterceptorFn` functional interceptors.
- **No manual subscribe for GET**: Use **httpResource()** or `toSignal(http.get(...))` instead.

## References

- [Interceptors](references/interceptors.md)

---

### angular-performance

---
name: angular-performance
description: Optimization techniques including OnPush, @defer, and Image Optimization. Use when optimizing Angular rendering, deferring blocks, or improving Core Web Vitals.
metadata:
  triggers:
    files:
    - 'ChangeDetectionStrategy.OnPush'
    keywords:
    - "@defer"
    - NgOptimizedImage
    - runOutsideAngular
    - OnPush
---
# Performance

## **Priority: P1 (HIGH)**

## Principles

- **OnPush**: Always use **ChangeDetectionStrategy.OnPush** on all components. Components should only update when **Signals for state** change or Inputs change.
- **Deferrable Views**: Use **@defer (on viewport)** to lazy load heavy components/chunks below fold. Use triggers: **on interaction**, **on idle**, **when condition**. @defer creates separate **lazy-loaded chunk** automatically. Use **@placeholder** { <Spinner /> } for loading states.
- **Images**: Import **NgOptimizedImage** and replace <img src='...'> with **<img ngSrc='...'** width='800' height='600'>. Add **priority attribute** for LCP images. This enables lazy loading, responsive **srcset**, and preconnect hints automatically.

## Guidelines

- **Zoneless**: Prepare for Zoneless Angular by avoiding **Zone.runOutsideAngular** hacks. Use **Signals for all reactive state** instead. Opt into **provideExperimentalZonelessChangeDetection()**.
- **TrackBy**: Always provide **stable unique identifier** in loops using **@for (item of items; track item.id)** — track expression **replaces trackBy**. This prevents Angular from destroying and recreating DOM nodes.

## Anti-Patterns

- **No function calls in template**: **{{ calculate() }} re-evaluates on every change detection cycle**. Use **computed() signal** or pure pipes to avoid per-cycle re-evaluation as it **caches until dependencies change**.
- **No logic in constructor**: Initialize state in `ngOnInit` or signal effects instead.

## References

- [Defer Usage](references/defer-usage.md)

---

### angular-routing

---
name: angular-routing
description: Configure Angular Router with lazy-loaded routes, functional guards, and component input binding. Use when defining routes, lazy-loading features, creating route guards, or setting up resolvers.
metadata:
  triggers:
    files:
    - '*.routes.ts'
    keywords:
    - angular router
    - loadComponent
    - canActivate
    - resolver
---
# Routing

## **Priority: P0 (CRITICAL)**

## 1. Lazy Load All Feature Routes

- Use `loadComponent` (standalone) or `loadChildren` (route file) for every feature route.

See [routing patterns](references/routing-patterns.md) for lazy loading and guard examples.

## 2. Use Functional Guards

- Create function-based guards (`CanActivateFn`) instead of deprecated class-based guards.

See [routing patterns](references/routing-patterns.md) for functional guard implementation.

## 3. Enable Component Input Binding

- Configure `withComponentInputBinding()` in `provideRouter(routes, withComponentInputBinding())`.
- Define `input.required<string>()` in components — Angular auto-maps route params, query params, and resolve data.

## 4. Configure Resolvers and Titles

- Create `ResolveFn<T>` to pre-fetch critical data before navigation.
- Provide custom `TitleStrategy` or use `title: 'Dashboard'` in route data.

## Anti-Patterns

- **No logic in route config**: Move access control and data fetching to dedicated Guards and Resolvers.
- **No eager feature imports**: Use `loadComponent` or `loadChildren` for all feature routes.

## References

- [Routing Patterns](references/routing-patterns.md)

---

### angular-rxjs-interop

---
name: angular-rxjs-interop
description: Bridge Observables and Signals using toSignal and toObservable in Angular. Use when converting between RxJS Observables and Angular Signals.
metadata:
  triggers:
    keywords:
    - toSignal
    - toObservable
    - takeUntilDestroyed
    - rxjs angular
---
# RxJS Interop

## **Priority: P1 (HIGH)**

## Principles

- **Async to Sync**: Use **toSignal(observable$, { initialValue: defaultValue })** from **@angular/core/rxjs-interop** to convert Observables (HTTP, Events) to Signals for template rendering. Call in **injection context** (class field or constructor). **toSignal auto-unsubscribes** on component destroy. Provide **initialValue** to avoid `undefined`.
- **Sync to Async**: Use **toObservable(this.query)** when you need RxJS operators (**debounceTime**, **switchMap**, **distinctUntilChanged**) on Signal. Then wrap back with **toSignal()** if rendering.
- **Auto-Unsubscribe**: `toSignal` automatically unsubscribes.
- **Cleanup**: Use **takeUntilDestroyed()** for manual subscriptions in **injection contexts**. For use outside, **inject(DestroyRef)** and call `takeUntilDestroyed(destroyRef)`.

## Guidelines

- **HTTP Requests**:
 - GET: `http.get<User[]>(...).pipe(catchError(() => of([])))` -> `toSignal(..., { initialValue: [] })`. Use in templates as **{{ users() }}**.
 - Consider **httpResource()** for simpler reactive HTTP in newer versions.
 - POST/PUT: Trigger explicit subscribe() or lastValueFrom().
- **Race Conditions**: Handle async loading states. `toSignal` requires `initialValue` or handles `undefined`.

## Anti-Patterns

- **No manual subscribe in templates**: Use `toSignal()` for Observables rendered in templates.
- **No BehaviorSubject for state**: Replace with `signal()` + `toObservable()` for RxJS interop.
- **No global takeUntil**: Use `takeUntilDestroyed()` scoped to injection context. **Never use global Subject** with takeUntil — it leaks if Subject never completed.

## References

- [Signals vs Observables](references/observables-vs-signals.md)

---

### angular-security

---
name: angular-security
description: Harden Angular apps against XSS, CSP violations, and unauthorized access. Use when implementing XSS protection, Content Security Policy, or auth guards in Angular.
metadata:
  triggers:
    keywords:
    - DomSanitizer
    - innerHTML
    - bypassSecurityTrust
    - CSP
    - angular security
    - route guard
---
# Security

## **Priority: P0 (CRITICAL)**

## Principles

- **XSS Prevention**: Angular sanitizes interpolated values by default — **{{ userInput }} safe**. NOT use `innerHTML` unless absolutely necessary (e.g., trusted static CMS content). For user-generated content, display as text with **{{ content }} — never as HTML**.
- **Bypass Security**: **Only bypass security for content you control** (e.g., trusted CMS headers). **Never call bypassSecurityTrustHtml** on user-provided data. Use **DomSanitizer.sanitize(SecurityContext.HTML, content)** instead of bypass functions. **Audit every bypassSecurityTrust\*** call as potential XSS **vector**.
- **Route Guards**: Protect all sensitive routes with functional **CanActivateFn** (e.g., **inject(Router).createUrlTree(['/login'])**). Apply with **canActivate: [authGuard]**.

## Guidelines

- **CSP**: Configure **CSP headers on server** (not in Angular source). Use **nonce-based CSP** with **script-src 'nonce-{nonce}'** and avoid unsafe-inline/unsafe-eval.
- **HTTP**: Use Interceptors to attach secure tokens. Use **HttpOnly cookies** managed by server — **not localStorage** or sessionStorage because they accessible via XSS.
- **Secrets**: **Never store API keys** or secrets in Angular source code or bundle.

## Anti-Patterns

- **No bypassSecurityTrust**: Trust Angular's sanitization; bypass only for verified static content.
- **No localStorage for tokens**: Use HttpOnly cookies via interceptors for auth tokens.
- **No secrets in source**: Never embed API keys or secrets in Angular bundle code.

## References

- [Security Best Practices](references/security-best-practices.md)
- common/security-standards

---

### angular-ssr

---
name: angular-ssr
description: Implement Angular SSR with hydration, TransferState caching, and per-route render modes. Use when configuring Angular Universal SSR, client hydration, static prerendering, or preventing double-fetching.
metadata:
  triggers:
    files:
    - '**/*.server.ts'
    - 'server.ts'
    keywords:
    - hydration
    - transferState
    - afterNextRender
    - isPlatformServer
    - RenderMode
---
# SSR (Server-Side Rendering)

## **Priority: P2 (MEDIUM)**

## 1. Enable Hydration

- Run `ng add @angular/ssr`.
- Add `provideClientHydration(withEventReplay())` to `app.config.ts` providers.

See [hydration examples](references/hydration.md) for app config and hydration setup.

## 2. Guard Browser-Only Code

- Use `afterNextRender(() => { /* window access */ })` for one-time browser-only code.
- For recurring checks, inject `PLATFORM_ID` and use `isPlatformBrowser(platformId)`.

## 3. Prevent Double-Fetching

- Use `withHttpTransferCacheOptions()` or manual `TransferState` to cache server responses for client replay.

## 4. Configure Render Modes (Angular 17+)

Export `ServerRoute[]` in `app.routes.server.ts`:

- **RenderMode.Prerender** — Static HTML at build time (blogs, marketing).
- **RenderMode.Server** — Dynamic SSR per request (user-specific pages).
- **RenderMode.Client** — Client-only SPA (authenticated dashboards).

## 5. Incremental Hydration (Angular 19+)

- Defer hydration with `@defer (hydrate on viewport)`.
- Triggers: `viewport`, `interaction`, `idle`, `timer(ms)`, `immediate`, `never`.
- Add `withEventReplay()` to capture user events before hydration completes.

## Anti-Patterns

- **No direct window/document access**: Use `afterNextRender()` or `PLATFORM_ID` check.
- **No double-fetching**: Use `withHttpTransferCacheOptions()` or `TransferState`.
- **No SSR for auth-gated pages**: Set `RenderMode.Client` for authenticated dashboards.

## References

- [Hydration](references/hydration.md)

---

### angular-state-management

---
name: angular-state-management
description: Implement application state with Angular Signals, computed derivations, and NgRx Signal Store. Use when implementing reactive state with signal(), computed(), effect(), or @ngrx/signals in Angular.
metadata:
  triggers:
    files:
    - '**/*.store.ts'
    - '**/state/**'
    keywords:
    - angular signals
    - signal store
    - computed
    - effect
    - linkedSignal
---
# State Management

## **Priority: P1 (HIGH)**

## 1. Use Signals for All State

- Keep internal signals private; expose publicly via `asReadonly()`.

See [signal store pattern](references/signal-store.md) for signal-based service and store examples.

## 2. Derive State with computed()

- Use `computed()` for totals, filtered lists, derived values — pure and cached.
- Use `linkedSignal(() => source())` for dependent writable state that resets when source changes.
- Use `untracked()` to read signal inside `computed()`/`effect()` without creating dependency.

## 3. Scale with Signal Store

- For complex features, use `@ngrx/signals` (`signalStore`) with `withState`, `withComputed`, `withMethods`, and `withEntities()`.

## 4. Handle Side Effects

- Use `effect()` only for side effects (logging, localStorage sync, DOM manipulation).
- **Never update signals inside effect()** — causes circular dependencies.
- Treat signal values as immutable — update with `.set()` or `.update(v => ...)`.

## Anti-Patterns

- **No state logic in components**: Delegate to Signal Store or Service.
- **No `BehaviorSubject` for state**: Use Signals; keep RxJS only for complex event streams.

## References

- [Signal Store Pattern](references/signal-store.md)

---

### angular-style-guide

---
name: angular-style-guide
description: Naming conventions, file structure, and coding standards for Angular projects. Use when naming Angular files, organizing project structure, or following Angular style guide.
metadata:
  triggers:
    keywords:
    - angular style
    - naming convention
    - file structure
    - angular-style-guide
---
# Angular Style Guide

## **Priority: P0 (CRITICAL)**

## Principles

- **Single Responsibility**: 1 component/service per file. Functions < 75 lines.
- **Size Limits**: Files < **400 lines**. Refactor if larger.
- **Strict Naming**: **kebab-case** with **type suffix** (e.g., **hero-list.component.ts**, **auth.service.ts**, **user.pipe.ts**, **app.routes.ts**).
- **Barrels**: `index.ts` for public APIs only. No deep barrel imports within same feature — import directly. Wrong barrel placement breaks **tree-shaking**.
- **LIFT**: **Locate** code quickly, **Identify files** by name, keep **Flattest structure** possible, **Try** to be **DRY**.

## Naming Standards

- **Files**: `kebab-case.type.ts`
- **Classes**: **PascalCase** + **type suffix** (**HeroListComponent**, **AuthService**)
- **Directives**: **camelCase** selector with **app prefix** (e.g., `appHighlight`)
- **Pipes**: **camelCase** name (e.g., `truncate`)
- **Services**: **PascalCase** + **Service** suffix (`HeroService`)
- **Interfaces**: No — do not use `IUser`/`IHero`. Name as nouns: `User`, `Hero`. The I-prefix is not recommended by Angular style guide.

## Folder Structure

- **Core**: `src/app/core/` (**singletons** and global state).
- **Shared**: `src/app/shared/` (**reusable UI** and pipes).
- **Features**: `src/app/features/` (**lazy-loaded**). Folder **depth ≤ 3 levels** — no deeper nesting.

## Anti-Patterns

- **No logic in templates**: Move to component class or `computed()` signal.
- **No deep nesting**: Keep folder depth ≤3 levels.
- **No I-prefix on interfaces**: Name interfaces `User`, not `IUser`.

## References

- [Naming Conventions](references/naming-convention.md)


---

### angular-testing

---
name: angular-testing
description: Write Angular component tests using TestBed, ComponentHarness, and HttpTestingController with proper signal input handling. Use when writing component tests, mocking HTTP calls, or testing signal inputs.
metadata:
  triggers:
    files:
    - '**/*.spec.ts'
    keywords:
    - TestBed
    - ComponentFixture
    - TestHarness
    - provideHttpClientTesting
---
# Testing

## **Priority: P1 (HIGH)**

## 1. Query via Component Harnesses

- Use `ComponentHarness` (e.g., `MatButtonHarness`) not CSS selectors — stable across DOM changes.
- `loader.getHarness(MatButtonHarness)` + `await button.click()`. Never query by CSS class.

See [harness pattern](references/harness-pattern.md) for ComponentHarness examples.

## 2. Mock HTTP with HttpTestingController

- `provideHttpClientTesting()` not manual HttpClient mocks.
- Call `expectOne`, `.flush(mockData)`, `verify()` in `afterEach`.

See [harness pattern](references/harness-pattern.md) for HttpTestingController examples.

## 3. Test Signal Inputs Correctly

- `fixture.componentRef.setInput('name', value)` — not direct assignment.
- `fixture.detectChanges()` after `setInput()`.
- Signals sync — no `fakeAsync` needed for most signal-driven tests.

## 4. Choose Your Test Runner

- Angular v20+: **Vitest** via `@angular/build:unit-test` — faster, native ESM, no Karma. Configure in `angular.json`.
- Jasmine/Karma still supported for existing projects.
- Standalone: import directly in `TestBed.configureTestingModule({ imports: [StandaloneComponent] })`.

## Anti-Patterns

- **No DOM CSS selectors**: Query via `ComponentHarness`, not CSS class strings.
- **No manual HttpClient mock**: Use `provideHttpClientTesting()` + `HttpTestingController`.
- **No direct @Input() assignment**: Use `fixture.componentRef.setInput()` for signal inputs.

## References

- [Harness Pattern](references/harness-pattern.md)


---

### angular-tooling

---
name: angular-tooling
description: Angular CLI usage, code generation, build configuration, and bundle optimization. Use when creating Angular projects, generating components/services/guards, configuring builds, running tests, or analyzing bundles.
metadata:
  triggers:
    files:
    - 'angular.json'
    keywords:
    - ng generate
    - ng build
    - ng serve
    - ng test
    - ng add
    - angular cli
    - bundle analysis
---
# Angular Tooling

## **Priority: P2 (OPTIONAL)**

## CLI Essentials

- **Command**: `ng generate component` (or `ng g c`)
- **Flags**: `--dry-run` previews before write. `--change-detection=OnPush` sets CD at generation. `--skip-tests` skips spec.
- **Workflow**: Always `ng generate` — **never create files manually**.

```bash
ng new my-app --style=scss --routing  # Create project
ng g c features/user-profile          # Generate component
ng g s services/auth                  # Generate service (providedIn: root)
ng g guard guards/auth                # Generate functional guard
ng g interceptor interceptors/auth    # Generate functional interceptor
ng g pipe pipes/truncate              # Generate standalone pipe
```

## Code Generation Flags

- `--dry-run` — Preview output without writing files. Always use `--dry-run` first for unfamiliar generators.
- `--skip-tests` — Skips spec file generation.
- `--flat` — Skips subfolder creation.
- `--change-detection=OnPush` — Sets CD strategy on generation.
- `--style=scss` — Sets stylesheet format.

## Build Configuration

- **Dev**: `ng serve --open`
- **Prod**: `ng build -c production`. Output goes to `dist/my-app/browser/`.
- **SSR**: `ng add @angular/ssr` then `ng build` (adds `server/` output).
- **Coverage**: `ng test --code-coverage --watch=false`. Coverage output goes to `coverage/` directory.

## Bundle Analysis

```bash
ng build -c production --stats-json
npx esbuild-visualizer --metadata dist/my-app/browser/stats.json --open
```

- **Note**: Analyze bundle before editing `angular.json` budgets — don't lower without understanding what's large.

## Update Angular

- **Check**: `ng update` — lists available updates.
- **Apply**: `ng update @angular/core @angular/cli` — runs official **codemods**.
- **Rule**: **Never use --force**; fix peer dependency conflicts instead.

## Anti-Patterns

- **No manual file creation**: Use `ng generate` for consistency and proper registration.
- **No `ng update --force`**: Fix peer dependency conflicts instead of skipping.
- **No hand-editing angular.json budgets**: Analyze bundles first — lower budgets break CI.

## References

- [CLI Commands & Build Examples](references/REFERENCE.md)

- [Angular CLI Docs](https://angular.dev/tools/cli)


---

