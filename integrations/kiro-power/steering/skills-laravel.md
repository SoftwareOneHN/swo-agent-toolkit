---
inclusion: manual
---

# Skills: laravel

> 10 skills. Load when editing laravel files.
> For code examples and implementation patterns, load `refs-laravel.md`.

## Index

# laravel Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| laravel-api | `routes/api.php`, `app/Http/Resources/**/*.php` | resource, collection, sanctum, passport, cors |
| **laravel-architecture** | `app/Http/Controllers/**/*.php`, `routes/*.php` | controller, service, action, request, container |
| laravel-background-processing | `app/Jobs/**/*.php`, `app/Events/**/*.php`, `app/Listeners/**/*.php` | ShouldQueue, dispatch, batch, chain, listener |
| laravel-clean-architecture | `app/Domains/**/*.php`, `app/Providers/*.php` | domain, dto, repository, contract, adapter |
| laravel-database-expert | `config/database.php`, `database/migrations/*.php` | join, aggregate, subquery, selectRaw, Cache |
| **laravel-eloquent** | `app/Models/**/*.php` | scope, with, eager, chunk, model |
| **laravel-security** | `app/Policies/**/*.php`, `config/*.php` | policy, gate, authorize, env, config |
| laravel-sessions-middleware | `app/Http/Middleware/**/*.php`, `config/session.php` | session, driver, handle, headers, csrf |
| laravel-testing | `tests/**/*.php`, `phpunit.xml` | feature, unit, mock, factory, sqlite |
| laravel-tooling | `package.json`, `composer.json`, `vite.config.js` | artisan, vite, horizon, pint, blade |

> Load matched skills: `<SKILLS>/laravel/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### laravel-api

---
name: laravel-api
description: Build REST endpoints with API Resources, Sanctum authentication, and versioned route groups in Laravel. Use when creating JsonResource classes, adding token-based auth, or defining rate-limited API routes.
metadata:
  triggers:
    files:
    - 'routes/api.php'
    - 'app/Http/Resources/**/*.php'
    keywords:
    - resource
    - collection
    - sanctum
    - passport
    - cors
---
# Laravel API

## **Priority: P1 (HIGH)**

## Workflow: Create New API Endpoint

1. **Generate resource** — `php artisan make:resource UserResource`.
2. **Define toArray()** — Specify exact output fields; never return raw models.
3. **Add route** — Register in `routes/api.php` with version prefix and throttle middleware.
4. **Secure with Sanctum** — Apply `auth:sanctum` middleware to protected routes.
5. **Return proper status codes** — 201 for Created, 422 for Validation, 204 for No Content.

## API Resource Example

See [implementation examples](references/implementation.md#api-resource-example) for complete API Resource with collection usage.

## Implementation Guidelines

### API Resources & Transformation

- **API Resources**: Always use **`ApiResource`** classes extending **`JsonResource`** for data transformation.
- **Collections**: Use **`UserResource::collection($users)`** for lists. Never use `response()->json($model)` or return raw models directly.
- **Data Definition**: Implement **`toArray($request)`** to define specific output fields and prevent sensitive data leakage.
- **Generation**: Use **`php artisan make:resource UserResource`** to scaffold new resources.

### Authentication & Security

- **Sanctum**: Use **`auth:sanctum`** middleware in `routes/api.php` for SPAs or mobile app authentication.
- **Traits**: Add **`HasApiTokens`** trait to your `User` model to enable token-based authentication.
- **Token Management**: Issue tokens using **`$user->createToken('token-name')->plainTextToken`**.
- **OAuth2**: Use **Passport** only if standard OAuth2 flows or client grants required.

### Routing & Performance

- **Versioning**: Group routes with **`Route::prefix('v1')->group(...)`** and use versioned namespaces (e.g., `App\Http\Controllers\Api\V1`).
- **Rate Limiting**: Define **`RateLimiter::for('api', ...)`** using **`Limit::perMinute(60)`** in **`AppServiceProvider`**.
- **Middleware**: Apply **`throttle:api`** middleware to route groups in `routes/api.php`.
- **Status Codes**: Return 201 for Created, 422 for Validation errors, and 204 for No Content.

## Anti-Patterns

- **No raw model returns**: Use API Resources; prevents data leakage.
- **No `response()->json()`**: Use API Resource classes instead.
- **No session auth for APIs**: Use Sanctum or Passport tokens.
- **No static URLs in JSON**: Use route names or HATEOAS links.

## References

- [API Resource Patterns](references/implementation.md)

---

### laravel-architecture

---
name: laravel-architecture
description: Enforce core architectural standards for scalable Laravel applications. Use when structuring controllers, service layers, action classes, Form Requests, or Service Container bindings in Laravel projects.
metadata:
  triggers:
    files:
    - 'app/Http/Controllers/**/*.php'
    - 'routes/*.php'
    keywords:
    - controller
    - service
    - action
    - request
    - container
---
# Laravel Architecture

## **Priority: P0 (CRITICAL)**

## Structure

See [project structure](references/implementation.md#project-structure) for recommended directory layout.

## Workflow

1. **Create Form Request** for validation (`php artisan make:request StoreUserRequest`).
2. **Create Action class** with single `handle()` method for use case.
3. **Inject Action** into controller via constructor DI.
4. **Bind interfaces** in `AppServiceProvider` for swappable implementations.

## Controller Pattern

See [implementation examples](references/implementation.md#controller-pattern) for slim controller, action class, and service container binding patterns.

## Validation

- Use Form Requests with `authorize()` and `rules()` methods.
- Call `$request->validated()` in controller for mass assignment.
- Never use inline `$request->validate()`.

## Anti-Patterns

- **No logic in Controllers**: Move to Services or Action classes.
- **No manual instantiation**: Use Service Container via DI.
- **No inline `$request->validate()`**: Favor Form Request classes.
- **No excessive global helpers**: Use class-based logic instead.

## References

- [Slim Controller Patterns](references/implementation.md)

---

### laravel-background-processing

---
name: laravel-background-processing
description: Build scalable asynchronous workflows using Queues, Jobs, and Events in Laravel. Use when implementing queued jobs, event-driven workflows, or async processing in Laravel.
metadata:
  triggers:
    files:
    - 'app/Jobs/**/*.php'
    - 'app/Events/**/*.php'
    - 'app/Listeners/**/*.php'
    keywords:
    - ShouldQueue
    - dispatch
    - batch
    - chain
    - listener
---
# Laravel Background Processing

## **Priority: P1 (HIGH)**

## Structure

```text
app/
├── Jobs/               # Asynchronous tasks
├── Events/             # Communication flags
└── Listeners/          # Task reactions
```

## Implementation Guidelines

### Queued Jobs

- **Job Creation**: Use **`php artisan make:job ProcessOrder`**. Classes must implement **`ShouldQueue`**.
- **Execution**: Implement logic inside **`handle()`** method. Pass only **model IDs** to constructor, not full Eloquent model.
- **Dispatching**: Trigger via **`ProcessOrder::dispatch($orderId)`**.

### Advanced Workflow Patterns

- **Job Chaining**: Use **`Bus::chain([new ProcessPayment($order), new SendReceipt($order)])->dispatch()`** for sequential dependencies. Handle failures with **`->catch(fn => ...)`**.
- **Job Batching**: Use **`Bus::batch([new ImportRow(1), ...])->then(...)->catch(...)->dispatch()`**. Use **`$this->batch()->cancel()`** to abort and track via **`$batch->progress()`**.

### Events & Listeners

- **Scaffolding**: Run **`php artisan make:event OrderPlaced`** and **`php artisan make:listener SendConfirmation --event=OrderPlaced`**.
- **Async Execution**: Add **`ShouldQueue`** to listeners to process them asynchronously.
- **Activation**: Trigger with **`Event::dispatch(new OrderPlaced($order))`**.

### Reliability & Monitoring

- **Error Handling**: Implement **`public function failed(Throwable $exception)`** in your job class. Use **`public int $tries = 3`** and **`public int $backoff = 60`** for retries.
- **Setup**: Run **`queue:failed-table`** migration to track dead jobs.
- **Monitoring**: Use **Laravel Horizon** (run **`php artisan horizon`**) for real-time observability; **never use `queue:work` in production**.

## Anti-Patterns

- **No heavy logic in request path**: Defer tasks >100ms to Queues.
- **No full model in job payload**: Pass IDs; Eloquent fetches on run.
- **No deep event listener chains**: Keep listener depth shallow.
- **No unmonitored queues**: Configure retries and Horizon alerts.

## References

- [Job Chaining & Event Patterns](references/implementation.md)

---

### laravel-clean-architecture

---
name: laravel-clean-architecture
description: Implement Domain-Driven Design with typed DTOs, repository interfaces, and single-responsibility Action classes in Laravel. Use when creating domain folders, binding repository contracts in providers, or passing DTOs between layers.
metadata:
  triggers:
    files:
    - 'app/Domains/**/*.php'
    - 'app/Providers/*.php'
    keywords:
    - domain
    - dto
    - repository
    - contract
    - adapter
---
# Laravel Clean Architecture

## **Priority: P1 (HIGH)**

## Workflow: Add Domain Feature

1. **Create domain folder** — `app/Domains/Order/{Actions,DTOs,Contracts}/`.
2. **Define DTO** — Create `readonly class` with typed constructor properties.
3. **Create contract** — Define repository interface in `Contracts/`.
4. **Implement repository** — Build Eloquent implementation; bind in `AppServiceProvider`.
5. **Write Action class** — Single-responsibility use-case logic consuming DTO.
6. **Verify bindings** — Run `php artisan tinker` and resolve interface to confirm DI works.

## Action + DTO Example

See [implementation examples](references/implementation.md#action--dto-example) for Action class with DTO and domain structure patterns.

## Implementation Guidelines

### Domain-Driven Design (DDD)

- **Grouping**: Organize code in **`app/Domains/Order/{Actions,DTOs,Contracts}/`**. Group by business domain (**`User, Order, Payment`**) — not by type (Controllers, Models).
- **Core Models**: Keep standard Eloquent models in **`app/Models/`**.
- **Separation**: **Never put Eloquent queries in controllers**; delegate to **Action classes** for use-case logic.

### Data Transfer Objects (DTOs)

- **Immutability**: Use `readonly class` (PHP 8.2+) or `readonly` properties (PHP 8.1+). DTOs cross boundaries — pass between layers instead of raw arrays or Eloquent models.

### Repository Pattern & Decoupling

- **Interfaces**: Create **`Contracts/OrderRepository interface`** and implement **`EloquentOrderRepository`**.
- **Binding**: Bind interfaces to implementations in **`AppServiceProvider`** via **`$this->app->bind(OrderRepository::class, EloquentOrderRepository::class)`**.
- **Usage**: **Inject interfaces** into your actions/services.
- **Layer Flow**: Controller → Action → Repository Interface → Eloquent. DTOs cross boundaries at every layer transition.

## Anti-Patterns

- **No Eloquent in Controllers**: Bridge layers with DTOs and Actions.
- **No raw arrays across layers**: Use typed `readonly` DTOs.
- **No God Services**: Break into single-responsibility Actions.
- **No concrete dependencies**: Depend on Interfaces, not implementations.

## References

- [DDD & Repository Patterns](references/implementation.md)

---

### laravel-database-expert

---
name: laravel-database-expert
description: 'Optimize Laravel queries with subqueries, joinSub, Redis cache-aside patterns, and read/write connection splitting. Use when writing complex joins, implementing Cache::remember with tags, or configuring database read replicas.'
metadata:
  triggers:
    files:
    - 'config/database.php'
    - 'database/migrations/*.php'
    keywords:
    - join
    - aggregate
    - subquery
    - selectRaw
    - Cache
---
# Laravel Database Expert

## **Priority: P1 (HIGH)**

## Workflow: Optimize Slow Query

1. **Profile query** — Use `DB::enableQueryLog()` or Laravel Debugbar.
2. **Add missing indexes** — Create migration for join/where columns.
3. **Replace N+1** — Use `withCount()`, `withSum()`, or `addSelect` subqueries.
4. **Cache results** — Apply `Cache::remember()` with tags for frequently accessed data.
5. **Split reads/writes** — Configure `read`/`write` keys in `config/database.php`.

## Cache-Aside with Tags Example

See [implementation examples](references/implementation.md#cache-aside-with-tags) for cache-aside pattern with tag-based invalidation.

## Implementation Guidelines

### Advanced Query Builder

- **Complex Joins**: Prefer **`joinSub($subquery, 'alias', ...)`** and **`whereExists(fn($q) => $q->select(DB::raw(1))...)`** over raw SQL or `whereIn` for correlated subqueries.
- **Subqueries**: Use **`addSelect`** with **`DB::raw`** subquery to avoid N+1 issues.
- **Aggregates**: Use **`withCount()`**, **`withSum()`**, and **`withAvg()`** directly via Eloquent for optimized column-based aggregation.
- **Raw Expressions**: Always use **`selectRaw`** or **`whereRaw`** with bindings; **never use string concatenation** in raw queries.

### Caching Strategy (Redis/Memcached)

- **Cache-Aside**: Utilize **`Cache::remember('key', $ttl, $closure)`** for frequently accessed data (e.g., `posts.all`).
- **Redis Tagging**: Group related keys using **`Cache::tags(['posts', 'user:1'])`** for **grouped invalidation**.
- **Invalidation**: Call **`Cache::tags(['posts'])->flush()`** to clear specific subsets; **never use `Cache::flush()` globally** in production.

### Scalability & Infrastructure

- **Read/Write Splitting**: Configure **'read'** and **'write'** keys in **`config/database.php`** mysql/pgsql connections. Laravel automatically routes **SELECT** to read and **INSERT/UPDATE/DELETE** to write; **no code changes needed**.
- **Indices**: Ensure correct **database indexes** present on all join and aggregate columns.

## Anti-Patterns

- **No string SQL concatenation**: Use bindings or Query Builder.
- **No queries in loops**: Use subqueries, joins, or aggregates.
- **No `Cache::flush()`**: Use tags to target specific cache groups.
- **No direct Redis calls**: Use Laravel Cache wrappers consistently.

## References

- [Advanced SQL & Cache Patterns](references/implementation.md)

---

### laravel-eloquent

---
name: laravel-eloquent
description: Write performant Eloquent queries with eager loading, reusable scopes, and strict lazy-loading prevention in Laravel. Use when defining model relationships, creating query scopes, or processing large datasets with chunk/cursor.
metadata:
  triggers:
    files:
    - 'app/Models/**/*.php'
    keywords:
    - scope
    - with
    - eager
    - chunk
    - model
---
# Laravel Eloquent

## **Priority: P0 (CRITICAL)**

## Workflow: Add Model with Safe Queries

1. **Define model** — Set `$fillable`, `$casts`, and relationships.
2. **Enable strict loading** — Call `preventLazyLoading(!app()->isProduction())` in AppServiceProvider.
3. **Add scopes** — Create `scopeActive()`, `scopeVerified()` for reusable filters.
4. **Eager-load in queries** — Use `with()` for all relationship access.
5. **Process large datasets** — Use `chunk()` or `cursor()` instead of `get()`.

## Scope + Eager Loading Example

See [implementation examples](references/implementation.md#scope--eager-loading-example) for model scopes, eager loading, and directory structure.

## Implementation Guidelines

### Query Efficiency & Performance

- **N+1 Prevention**: **Always use `with()`** or `$with` for relationships. Never access relationship properties in loop without eager loading (**N+1 Prevention**).
- **Strict Loading**: Call **`Eloquent::preventLazyLoading(!app()->isProduction())`** in **`AppServiceProvider::boot()`** to throw **`LazyLoadingViolationException`** in local/dev.
- **Large Datasets**: Use **`chunk()`**, **`lazy()`**, or **`cursor()`** for processing many records without memory issues (**Memory Efficiency**).

### Query Logic & Scopes

- **Reusable Scopes**: Define **`scopeName(Builder $query): Builder`** methods in models for **reusable query filters**.
- **Chaining**: Chain scopes (e.g., `User::active()->verified()->get()`) to keep controllers from duplicating query logic.

### Models & Security

- **Mass Assignment**: Always define **`protected $fillable`** array; use **`$request->validated()`** for **`Model::create()`**.
- **Casting**: Use **`protected $casts`** for dates, JSON, and custom types to ensure data consistency.

## Anti-Patterns

- **No lazy loading**: Eager-load with `with()` or `$with`; never in loops.
- **No business logic in Models**: Move to Services or Actions.
- **No raw SQL strings**: Use Query Builder or Eloquent methods.
- **No `select *`**: Specify required columns to limit data transfer.

## References

- [Eloquent Performance Guide](references/implementation.md)

---

### laravel-security

---
name: laravel-security
description: Harden Laravel apps with Policies for model authorization, Gate-based RBAC, validated mass assignment, and CSRF protection. Use when creating authorization policies, securing env config access, or preventing mass assignment vulnerabilities.
metadata:
  triggers:
    files:
    - 'app/Policies/**/*.php'
    - 'config/*.php'
    keywords:
    - policy
    - gate
    - authorize
    - env
    - config
---
# Laravel Security

## **Priority: P0 (CRITICAL)**

## Workflow: Secure Resource

1. **Generate policy** — `php artisan make:policy PostPolicy --model=Post`.
2. **Implement policy methods** — Return `bool` for `view`, `update`, `delete` actions.
3. **Authorize in controller** — Call `$this->authorize('update', $post)`.
4. **Add Gate bypass** — Define `Gate::before()` for admin users in `AuthServiceProvider`.
5. **Validate inputs** — Use Form Request with `$request->validated()` for `Model::create()`.

## Policy Example

See [implementation examples](references/implementation.md#policy-example) for Policy class with controller authorization.

## Implementation Guidelines

### Authorization & RBAC

- **Policies**: Always use **`php artisan make:policy PostPolicy --model=Post`** for model-level authorization.
- **Checkers**: Implement **`update(User $user, Post $post): bool`** and call **`$this->authorize('update', $post)`** in controllers.
- **Gates**: Use `Gate::define('admin', fn(User $user) => ...)` for global permissions. Check with `Gate::allows('admin')` or Blade `@can('admin')`. prefer Policies for model-bound checks; use Gates for global permissions.
- **Admin Bypass**: Define **`Gate::before(fn($u) => $u->isAdmin() ? true : null)`** in **`AuthServiceProvider`**.

### Configuration & Environment

- **Environment**: Only call env() inside config/\*.php files. Access via `config('app.key')` in your application code. never env() in controllers; use config() instead.
- **Caching**: Run **`php artisan config:cache`** to validate that `env()` isn't used where it shouldn't .

### Data & Input Security

- **Mass Assignment**: Use Form Request with rules() and call $request->validated() for Model::create(). Define $fillable on model; never pass $request->all() to create().
- **CSRF**: Ensure @csrf directive in all Blade `<form>` tags. active on web routes by default; use `->except(['/webhook'])` only for trusted third-party callbacks.
- **Role-Based Access**: Use Policies with role checks in policy methods; define `Gate::before` for admin bypass; or use `spatie/laravel-permission`; never inline $user->role === 'admin'.

## Anti-Patterns

- **No `env()` outside config files**: Access via `config()` helper.
- **No custom auth logic**: Use Laravel's built-in auth system.
- **No unvalidated mass assignment**: Always call `validated()`.
- **No auth logic in Blade**: Pass permissions as data from controller.

## References

- [Policy & Env Best Practices](references/implementation.md)

---

### laravel-sessions-middleware

---
name: laravel-sessions-middleware
description: Configure Redis session drivers, register security-header middleware, and prevent session fixation in Laravel. Use when switching session drivers, adding HSTS/CSP headers via middleware, or regenerating sessions after login.
metadata:
  triggers:
    files:
    - 'app/Http/Middleware/**/*.php'
    - 'config/session.php'
    keywords:
    - session
    - driver
    - handle
    - headers
    - csrf
---
# Laravel Sessions & Middleware

## **Priority: P1 (HIGH)**

## Workflow: Secure Sessions & Add Middleware

1. **Set Redis driver** — `SESSION_DRIVER=redis` in `.env`; install `predis/predis`.
2. **Regenerate on login** — Call `$request->session()->regenerate()` after authentication.
3. **Create security middleware** — Add HSTS, CSP, X-Frame-Options headers.
4. **Register globally** — Use `withMiddleware(fn($m) => $m->append(...))` in `bootstrap/app.php`.

## Security Headers Middleware Example

See [implementation examples](references/implementation.md#security-headers-middleware) for security headers middleware and directory structure.

## Implementation Guidelines

### Session Architecture

- **Drivers**: Set **`SESSION_DRIVER=redis`** in `.env` for production/scaled environments.
- **Dependencies**: Install **`predis/predis`** and **avoid file driver** due to I/O lock issues at scale.
- **Security**: Call **`$request->session()->regenerate()`** after successful authentication to prevent **session fixation**. Call **`$request->session()->invalidate()`** on logout.
- **Access**: **Never access `env('SESSION_DRIVER')`** directly in code; always use **`config('session.driver')`**. Clear caches via **`php artisan config:clear`**.

### Middleware Pipeline

- **Custom Middleware**: Use **`php artisan make:middleware EnsureTokenIsValid`**. Implement **`handle(Request $request, Closure $next): Response`**.
- **Registration**: Register new middleware in **`bootstrap/app.php`** using **`withMiddleware()`**.
- **Security Headers**: Standardize **HSTS, CSP, X-Frame-Options, and X-Content-Type-Options** in dedicated security middleware. Register as **global** middleware.
- **Priority**: Use **`withMiddleware(fn($m) => $m->append(MyMiddleware::class))`** or **`prepend()`** for highest priority.
- **Performance**: **Avoid heavy computation** in global middleware; delegate these to domain services.

## Anti-Patterns

- **No file session driver in production**: Use Redis or Memcached instead.
- **No `env()` for session config**: Use `config('session.*')` instead.
- **No heavy logic in Middleware**: Delegate complex logic to Services.
- **No sensitive data in cookies**: Store securely in server sessions only.

## References

- [Advanced Middleware Patterns](references/implementation.md)

---

### laravel-testing

---
name: laravel-testing
description: Write Pest feature tests with RefreshDatabase, mock external services, and create test data with Eloquent Factories in Laravel. Use when adding HTTP tests, configuring SQLite in-memory test database, or mocking payment services.
metadata:
  triggers:
    files:
    - 'tests/**/*.php'
    - 'phpunit.xml'
    keywords:
    - feature
    - unit
    - mock
    - factory
    - sqlite
---
# Laravel Testing

## **Priority: P1 (HIGH)**

## Workflow: Test New Feature

1. **Generate factory** — `php artisan make:factory PostFactory --model=Post`.
2. **Write feature test** — Use Pest with `RefreshDatabase` for isolation.
3. **Mock externals** — Use `$this->mock(Service::class)` for third-party calls.
4. **Assert response** — Chain `assertStatus()`, `assertJson()`, `assertJsonStructure()`.
5. **Run with SQLite** — Set `DB_CONNECTION=sqlite` and `DB_DATABASE=:memory:` in `phpunit.xml`.

## Pest Feature Test Example

See [implementation examples](references/implementation.md#pest-feature-test-example) for Pest feature tests and test directory structure.

## Implementation Guidelines

### Pest & Modern Testing

- **Feature Tests**: Use `uses(RefreshDatabase::class)` at top of Pest files. Example: `it('creates post', fn() => $this->postJson('/api/posts', [...])` verifies database rolled back after each test.
- **Transactions**: For faster but non-truncating isolation, use **`DatabaseTransactions`**.

### Mocking & External Services

- **Service Mocking**: Use **`$this->mock(PaymentService::class)`** with **`shouldReceive('charge')->once()->with(100)`** to assert interaction.
- **Loose Verification**: Use **`$this->spy()`** for behavior validation without strict ordering.
- **Network Safety**: **Never make real network calls** in automated tests.

### Test Data & Infrastructure

- **Factories**: Create test data via **`Post::factory()->count(3)->create(['user_id' => $id])`**.
- **Definition**: Implement **`definition(): array`** using **`fake()`** in factory classes.
- **Generation**: Run **`php artisan make:factory PostFactory --model=Post`**.
- **SQLite Support**: In **`phpunit.xml`**, set `DB_CONNECTION' value='sqlite'` and `DB_DATABASE' value=':memory:'` for in-memory, lightning-fast tests.

### HTTP Assertions

- **Fluent Assertions**: Chain **`assertStatus(201)`**, **`assertJson(['data' => ...])`**, and **`assertJsonStructure`**.
- **Header Verification**: Use **`assertHeader('Content-Type', 'application/json')`**.

## Anti-Patterns

- **No real network calls**: Always mock or stub external services.
- **No state leakage between tests**: Use `RefreshDatabase` trait.
- **No `DB::table()->insert()`**: Never DB::table()->insert() raw data in tests — use Eloquent Factories instead.
- **No heavy computations in unit tests**: Move to Feature layer.

## References

- [Testing & Mocking Guide](references/implementation.md)

---

### laravel-tooling

---
name: laravel-tooling
description: Configure Laravel ecosystem with custom Artisan commands, Vite asset bundling, Pint code styling, and Horizon queue monitoring. Use when creating Artisan commands, migrating from Mix to Vite, or configuring Pint code standards.
metadata:
  triggers:
    files:
    - 'package.json'
    - 'composer.json'
    - 'vite.config.js'
    keywords:
    - artisan
    - vite
    - horizon
    - pint
    - blade
---
# Laravel Tooling

## **Priority: P2 (MEDIUM)**

## Workflow: Set Up Development Tooling

1. **Install Pint** — `composer require laravel/pint --dev`; run `./vendor/bin/pint`.
2. **Configure Vite** — Set up `vite.config.js` with Laravel plugin; add `@vite()` in Blade layout.
3. **Create custom command** — `php artisan make:command SendNewsletters`.
4. **Add Horizon** — `composer require laravel/horizon`; configure supervisors.

## Custom Artisan Command Example

See [implementation examples](references/implementation.md#custom-artisan-command-example) for Artisan command pattern and project structure.

## Implementation Guidelines

### Artisan Commands

- **Customization**: Use **`php artisan make:command SendNewsletters`**.
- **Definitions**: Define **`protected $signature = 'newsletters:send {--queue}'`**.
- **Execution**: Implement **`handle(): int`**. Commands **auto-discovered** in **`app/Console/Commands/`**.
- **Scheduling**: Schedule in **`bootstrap/app.php`** (formerly Kernel).

### Asset Management (Vite)

- **Scaffolding**: Run **`npm install`** and configure **`vite.config.js`** with Laravel plugin.
- **Blade Integration**: Add @vite directive (`@vite(['resources/css/app.css', 'resources/js/app.js'])`) to your layout.
- **Migration**: Use Vite (not Mix) — replace mix() with vite() in Blade templates and remove laravel-mix.
- **Workflow**: Run `npm run dev` for local HMR and `npm run build for production`. No manual versioning needed.

### Code Quality & Monitoring

- **Pint Styling**: Enforce standards with **`composer require laravel/pint --dev`**.
- **Usage**: Run **`./vendor/bin/pint`** to apply `preset: 'laravel'` configuration from **`pint.json`**.
- **Queue Observability**: Use **`composer require laravel/horizon`**. Run **`php artisan horizon:install`** and configure supervisors in **`config/horizon.php`**.
- **Horizon Security**: Set authentication gates in **`HorizonServiceProvider`**. Access via **`/horizon`** in browser.

## Anti-Patterns

- **No Laravel Mix**: Migrate to Vite for faster HMR.
- **No JS in Blade templates**: Move scripts to `resources/js`.
- **No manual DB edits**: Use Artisan commands or migrations.
- **No unstyled commits**: Run `./vendor/bin/pint` before merging.

## References

- [Artisan & Vite Patterns](references/implementation.md)

---

