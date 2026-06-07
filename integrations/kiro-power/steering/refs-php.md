---
inclusion: manual
---

# References: php

> 6 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-php.md`.

## php-best-practices

### implementation

# PHP Best Practices Reference

## PSR-12 and Clean Code Implementation

```php
declare(strict_types=1);

namespace App\Services;

use App\Interfaces\LoggerInterface;

class NotificationService
{
    private const NOTIFICATION_LIMIT = 5;

    public function __construct(
        private LoggerInterface $logger,
    ) {}

    public function sendBatch(array $users): void
    {
        // Guard clause for early return
        if (count($users) === 0) {
            return;
        }

        if (count($users) > self::NOTIFICATION_LIMIT) {
            $this->logger->warn('Batch size exceeded');
        }

        // ... implementation
    }
}
```


---

## php-concurrency

### implementation

# PHP Concurrency Reference

## Fiber-based Multitasking

```php
// Concurrent HTTP fetching simulation
$fiber = new Fiber(function (string $url): void {
    // Non-blocking call suspends current execution
    $data = CustomHttpClient::get($url);
    Fiber::suspend($data);
});

// Control flow
$fiber->start('https://api.example.com');
while ($fiber->isSuspended()) {
    // Perform other tasks...
    $result = $fiber->resume();
}
```

## Directory Structure

```text
src/
└── Async/
    ├── Schedulers/
    └── Clients/
```

## Fiber Example

```php
// Cooperative multitasking with Fibers
$fiber = new Fiber(function (): string {
    $value = Fiber::suspend('paused');
    return "Received: $value";
});

$fiber->start();           // Returns 'paused'
$fiber->resume('hello');   // Fiber continues
echo $fiber->getReturn();  // "Received: hello"
```

## Guzzle Pool Example

```php
// Concurrent HTTP requests with Guzzle Pool
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Request;

$requests = fn () => yield from [
    new Request('GET', 'https://api.example.com/users'),
    new Request('GET', 'https://api.example.com/orders'),
];

$pool = new Pool($client, $requests(), [
    'concurrency' => 5,
    'fulfilled' => fn ($response, $index) => $results[$index] = $response,
]);
$pool->promise()->wait();
```


---

## php-error-handling

### implementation

# PHP Error Handling Reference

## Exception Hierarchy & PSR-3 Logging

```php
declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DatabaseException;
use Throwable;

try {
    $result = $db->query("...");
} catch (DatabaseException $e) {
    // Log contextually using PSR-3
    $logger->error('Database failed: ' . $e->getMessage());
    throw new ServiceUnavailableException('Service is down', 0, $e);
} catch (Throwable $e) {
    // Catch-all for uncaught Errors and Exceptions
    $logger->critical('Unexpected error', ['exception' => $e]);
} finally {
    // Ensure cleanup
    $db->disconnect();
}
```

## Directory Structure

```text
src/
└── Exceptions/
    ├── {Domain}Exception.php
    └── Handler.php
```

## Exception Hierarchy Example

```php
// Domain exception hierarchy
class OrderException extends \RuntimeException {}
class OrderNotFoundException extends OrderException {}
class InsufficientStockException extends OrderException {}

// Usage with multi-catch and finally
try {
    $order = $repository->findOrFail($id);
    $order->fulfill();
} catch (OrderNotFoundException $e) {
    $logger->warning('Order not found', ['id' => $id]);
    throw $e;
} catch (InsufficientStockException | \DomainException $e) {
    $logger->error($e->getMessage(), ['exception' => $e]);
    return new ErrorResponse(422, $e->getMessage());
} finally {
    $connection->close();
}
```


---

## php-language

### implementation

# PHP Language Standards Refence

## Modern PHP 8.x Patterns

### Constructor Property Promotion & Readonly

```php
declare(strict_types=1);

namespace App\Core;

class UserProfile
{
    // Promotion combines declaration, typing, and assignment
    public function __construct(
        public readonly int $id,
        public string $username,
        private ?string $role = null,
    ) {}

    // Match expression for exhaustive value mapping
    public function getPermissions(): array
    {
        return match ($this->role) {
            'admin' => ['all'],
            'editor' => ['edit', 'publish'],
            default => ['read'],
        };
    }
}
```

### Type Safety & Union Types

```php
public function process(string|int $input): string&Countable
{
    // ... logic
}
```


---

## php-security

### implementation

# PHP Security Reference

## Secure Database & Password Handling

### Prepared Statements (PDO)

```php
// SQL Injection Prevention
public function findUser(int $id): ?array
{
    $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch() ?: null;
}
```

### Modern Password Hashing

```php
// Use Argon2id for maximum security
$hash = password_hash($password, PASSWORD_ARGON2ID);

// Verify securely
if (password_verify($inputPassword, $storedHash)) {
    // ... logic
}
```

### Output Escaping (XSS)

```php
// Escape for HTML context
echo 'Hello, ' . htmlentities($username, ENT_QUOTES, 'UTF-8');
```


---

## php-testing

### implementation

# PHP Testing Reference

## Framework Patterns (Pest & PHPUnit)

### Pest (Modern DX)

```php
test('user can be created', function () {
    $repo = mock(UserRepository::class);
    $repo->shouldReceive('save')->once()->andReturn(true);

    $service = new UserService($repo);
    expect($service->create(['name' => 'Hoang']))->toBeTrue();
});
```

### PHPUnit (Standard Persistence)

```php
public function test_math_logic(): void
{
    $this->assertSame(4, 2 + 2);
}
```

## Directory Structure

```text
tests/
├── Unit/
├── Integration/
└── Feature/
```

## PHPUnit Service Test

```php
// PHPUnit: service test with mock
class OrderServiceTest extends TestCase
{
    public function test_creates_order_and_charges_payment(): void
    {
        $payment = $this->createMock(PaymentService::class);
        $payment->expects($this->once())
            ->method('charge')
            ->with(100)
            ->willReturn(true);

        $service = new OrderService($payment);
        $order = $service->createOrder('Widget', 100);

        $this->assertSame('Widget', $order->title);
        $this->assertTrue($order->isPaid());
    }
}
```

## Pest Dataset Example

```php
// Pest: expressive syntax with datasets
it('validates order status transitions', function (string $from, string $to, bool $valid) {
    $order = new Order(status: $from);
    expect($order->canTransitionTo($to))->toBe($valid);
})->with([
    ['pending', 'confirmed', true],
    ['confirmed', 'pending', false],
    ['shipped', 'cancelled', false],
]);
```


---

