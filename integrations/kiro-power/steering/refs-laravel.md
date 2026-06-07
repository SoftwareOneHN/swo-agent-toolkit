---
inclusion: manual
---

# References: laravel

> 10 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-laravel.md`.

## laravel-api

### implementation

# Laravel API Reference

## API Resources (JSON Transformation)

```php
// app/Http/Resources/UserResource.php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->full_name,
        'email' => $this->email,
        'created_at' => $this->created_at->toIso8601String(),
    ];
}
```

## API Auth (Sanctum)

```php
// routes/api.php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

## API Resource Example

```php
// app/Http/Resources/UserResource.php
class UserResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}

// In controller
return UserResource::collection(User::paginate(15));
```


---

## laravel-architecture

### implementation

# Laravel Architecture Reference

## Slim Controllers & Service Classes

```php
// app/Http/Controllers/UserController.php
public function store(UserRequest $request, UserService $service)
{
    $service->registerUser($request->validated());
    return redirect()->route('dashboard')->with('status', __('User created'));
}

// app/Services/UserService.php
public function registerUser(array $data): User
{
    return DB::transaction(fn() => User::create($data));
}
```

## Form Requests (Validation)

```php
// app/Http/Requests/UserRequest.php
public function rules(): array
{
    return [
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
    ];
}
```

## Project Structure

```text
app/
├── Http/
│   ├── Controllers/    # Slim (Request/Response only)
│   └── Requests/       # Validation logic
├── Services/           # Business logic (Optional)
└── Actions/            # Single-purpose classes (Preferred)
```

## Controller Pattern

```php
// app/Http/Controllers/PostController.php — slim controller
class PostController extends Controller
{
    public function __construct(private CreatePostAction $createPost) {}

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->createPost->handle($request->validated());
        return response()->json($post, 201);
    }
}
```

## Action Class

```php
// app/Actions/CreatePostAction.php — single-purpose business logic
class CreatePostAction
{
    public function __construct(private PostRepository $posts) {}

    public function handle(array $data): Post
    {
        return $this->posts->create($data);
    }
}
```

## Service Container Binding

```php
// app/Providers/AppServiceProvider.php
$this->app->bind(PostRepository::class, EloquentPostRepository::class);
```


---

## laravel-background-processing

### implementation

# Laravel Background Processing Reference

## Queued Jobs & Chaining

```php
// app/Jobs/ProcessPdfReport.php
public function handle(): void {
    // Heavy report logic
}

// Chaining dependent tasks
Bus::chain([
    new ProcessPdfReport($data),
    new NotifyUserOfReport($user),
])->dispatch();
```

## Events & Listeners

```php
// app/Events/UserRegistered.php
class UserRegistered { use Dispatchable, SerializesModels; }

// app/Listeners/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue {
    public function handle(UserRegistered $event): void {
        // Queue handles this transparently
    }
}
```

## Batch Processing

```php
$batch = Bus::batch([
    new ImportPodcast(1),
    new ImportPodcast(2),
])->then(function (Batch $batch) {
    // All success
})->dispatch();
```


---

## laravel-clean-architecture

### implementation

# Laravel Clean Architecture Reference

## Domain-Driven Design (DDD) Structure

```text
app/
└── Domains/
    └── User/
        ├── Actions/        # Business logic
        ├── DTOs/           # Data Transfer Objects
        ├── Events/
        ├── Listeners/
        ├── Models/
        └── Repositories/   # Data access abstraction
```

## Data Transfer Objects (DTOs)

```php
// app/Domains/User/DTOs/UserRegistrationData.php
readonly class UserRegistrationData {
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(Request $request): self {
        return new self(...$request->validated());
    }
}
```

## Dependency Inversion (Repository Pattern)

```php
// app/Providers/RepositoryServiceProvider.php
public function register(): void {
    $this->app->bind(
        \App\Domains\User\Contracts\UserRepositoryInterface::class,
        \App\Domains\User\Repositories\EloquentUserRepository::class
    );
}
```

## Action + DTO Example

```php
// app/Domains/Order/DTOs/CreateOrderData.php
readonly class CreateOrderData {
    public function __construct(
        public string $customerId,
        public int $amount,
    ) {}
}

// app/Domains/Order/Actions/CreateOrderAction.php
class CreateOrderAction {
    public function __construct(private OrderRepository $repo) {}

    public function execute(CreateOrderData $data): Order {
        return $this->repo->create(['customer_id' => $data->customerId, 'amount' => $data->amount]);
    }
}
```

## Domain Structure

```text
app/
├── Domains/            # Logic grouped by business domain
│   └── {Domain}/
│       ├── Actions/    # Single use-case logic
│       ├── DTOs/       # Immutable data structures
│       └── Contracts/  # Interfaces for decoupling
└── Providers/          # Dependency bindings
```


---

## laravel-database-expert

### implementation

# Laravel Database Expert Reference

## Advanced Query Builder

```php
// Complex subqueries and aggregates
$users = DB::table('users')
    ->select(['name', 'email'])
    ->selectSub(function ($query) {
        $query->from('posts')
            ->selectRaw('count(*)')
            ->whereColumn('user_id', 'users.id');
    }, 'posts_count')
    ->having('posts_count', '>', 10)
    ->get();
```

## Redis Caching Patterns

```php
// Cache aside pattern
$user = Cache::remember("user:{$id}", 3600, function () use ($id) {
    return User::findOrFail($id);
});

// Redis tagging for bulk invalidation
Cache::tags(['people', 'artists'])->put('John', $john, $seconds);
```

## Vertical Partitioning (Read/Write Connections)

```php
// config/database.php
'mysql' => [
    'read' => ['host' => '192.168.1.1'],
    'write' => ['host' => '192.168.1.2'],
],
```

## Cache-Aside with Tags

```php
// Retrieve with cache; invalidate on mutation
$posts = Cache::tags(['posts', "user:{$userId}"])->remember(
    "posts.user.{$userId}",
    now()->addMinutes(30),
    fn () => Post::where('user_id', $userId)->with('comments')->get()
);

// Invalidate after update
Cache::tags(['posts'])->flush();
```


---

## laravel-eloquent

### implementation

# Laravel Eloquent Reference

## Eager Loading (N+1 Prevention)

```php
// Good: Fetch all users and their profile in 2 queries
$users = User::with('profile')->get();

// Global Eager Loading (In Model)
protected $with = ['profile'];
```

## Reusable Scopes

```php
// app/Models/Order.php
public function scopeRecent(Builder $query)
{
    return $query->where('created_at', '>', now()->subDays(7));
}

// Usage
Order::recent()->get();
```

## Performance Processing

```php
// Use chunk for large datasets
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // ... logic
    }
});
```

## Scope + Eager Loading Example

```php
// app/Models/User.php
class User extends Model {
    protected $fillable = ['name', 'email', 'status'];
    protected $casts = ['email_verified_at' => 'datetime'];

    public function scopeActive(Builder $query): Builder {
        return $query->where('status', 'active');
    }

    public function posts(): HasMany {
        return $this->hasMany(Post::class);
    }
}

// Usage: eager-load + scope chain
$users = User::active()->with('posts')->paginate(20);
```

## Model Directory Structure

```text
app/
└── Models/
    ├── {Model}.php
    └── Scopes/         # Advanced global scopes
```


---

## laravel-security

### implementation

# Laravel Security Reference

## Authorization (Policies)

```php
// app/Policies/PostPolicy.php
public function update(User $user, Post $post): bool
{
    return $user->id === $post->user_id;
}

// In Controller
$this->authorize('update', $post);
```

## Safe Environments

```php
// config/services.php
'stripe' => [
    'key' => env('STRIPE_KEY'),
],

// In Code (GOOD)
$key = config('services.stripe.key');

// In Code (BAD)
$key = env('STRIPE_KEY'); // Will fail if config is cached
```

## Policy Example

```php
// app/Policies/PostPolicy.php
class PostPolicy {
    public function update(User $user, Post $post): bool {
        return $user->id === $post->user_id;
    }
}

// In controller
public function update(UpdatePostRequest $request, Post $post) {
    $this->authorize('update', $post);
    $post->update($request->validated());
    return new PostResource($post);
}
```


---

## laravel-sessions-middleware

### implementation

# Laravel Sessions & Middleware Reference

## Custom Middleware for High-Density Security

```php
// app/Http/Middleware/EnsureSecureHeaders.php
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    return $response;
}
```

## Advanced Session Management

```php
// Manual session regeneration
$request->session()->regenerate();

// Context-aware session driver (config/session.php)
'driver' => env('SESSION_DRIVER', 'redis'),
```

## PSR-15 Middleware Adapter

```php
// Wrapping PSR-15 middleware if needed
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;
```

## Security Headers Middleware

```php
// app/Http/Middleware/SecurityHeaders.php
class SecurityHeaders {
    public function handle(Request $request, Closure $next): Response {
        $response = $next($request);
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        return $response;
    }
}
```

## Middleware Directory Structure

```text
app/Http/
├── Middleware/         # Custom logic layers
└── Kernel.php          # Global/Group registration
```


---

## laravel-testing

### implementation

# Laravel Testing Reference

## Pest (Standard)

```php
// tests/Feature/RegistrationTest.php
test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Hoang',
        'email' => 'hoang@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard'));
});
```

## In-Memory Database

```php
// phpunit.xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

## Pest Feature Test Example

```php
// tests/Feature/PostTest.php
uses(RefreshDatabase::class);

it('creates a post and returns 201', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/posts', ['title' => 'Hello', 'body' => 'World'])
        ->assertStatus(201)
        ->assertJson(['data' => ['title' => 'Hello']]);

    $this->assertDatabaseHas('posts', ['title' => 'Hello']);
});
```

## Test Directory Structure

```text
tests/
├── Feature/            # Integration/HTTP tests
├── Unit/               # Isolated logic tests
└── TestCase.php
```


---

## laravel-tooling

### implementation

# Laravel Tooling Reference

## Custom Artisan Commands

```php
// app/Console/Commands/CleanTempFiles.php
protected $signature = 'app:clean-temp';

public function handle()
{
    Storage::deleteDirectory('temp');
    $this->info('Temp files cleared!');
}
```

## Vite Assets

```html
<!-- resources/views/layouts/app.blade.php -->
@vite(['resources/css/app.css', 'resources/js/app.js'])
```

## Custom Artisan Command Example

```php
// app/Console/Commands/SendNewsletters.php
class SendNewsletters extends Command {
    protected $signature = 'newsletters:send {--queue : Queue the emails}';
    protected $description = 'Send newsletters to all subscribers';

    public function handle(): int {
        $subscribers = User::whereNotNull('subscribed_at')->get();
        $this->info("Sending to {$subscribers->count()} subscribers...");
        // dispatch jobs or send directly
        return self::SUCCESS;
    }
}
```

## Tooling Directory Structure

```text
project/
├── app/Console/        # Custom Artisan commands
├── resources/js/       # Frontend assets (Vite)
└── pint.json           # Code styling
```


---

