---
inclusion: manual
---

# Skills: php

> 7 skills. Load when editing php files.
> For code examples and implementation patterns, load `refs-php.md`.

## Index

# php Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **php-language** | `**/*.php` | declare, readonly, match, constructor, promotion, types |
| php-testing | `tests/**/*.php`, `phpunit.xml` | phpunit, pest, mock, assert, tdd |
| php-tooling | `composer.json` | composer, lock, phpstan, xdebug |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| php-best-practices | psr-12, camelCase, PascalCase, dry, solid |
| php-concurrency | Fiber, suspend, resume, non-blocking, async |
| **php-error-handling** | try, catch, finally, Throwable, set_exception_handler |
| **php-security** | pdo, password_hash, htmlentities, filter_var, php security, sql injection, xss php, prepared statement, csrf, sanitize input, password storage |

> Load matched skills: `<SKILLS>/php/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### php-best-practices

---
name: php-best-practices
description: Write PHP following best practices, PSR standards, and code quality guidelines. Use when writing PHP following PSR standards, SOLID principles, or improving code quality.
metadata:
  triggers:
    files:
    - '**/*.php'
    keywords:
    - psr-12
    - camelCase
    - PascalCase
    - dry
    - solid
---
# PHP Best Practices

## **Priority: P1 (HIGH)**

## Structure

```text
src/
├── {Domain}/             # e.g., Services, Repositories
└── Helpers/              # Pure functions/Traits
```

## Implementation Guidelines

### Coding Style (PSR Standards)

- **PSR-12**: Enforce **4-space indentation** and **opening braces on same line** for functions/methods.
- **Organization**: One class per file; use statements follow namespace. Run **PHP CS Fixer** with **PSR-12** preset.
- **Naming Conventions**: Use **`PascalCase`** (UserService) for classes, **`camelCase`** (getUserById) for methods/variables, and **`SNAKE_CASE`** (MAX_RETRIES) for class constants.

### SOLID Principles in PHP

- **SRP**: Single Responsibility Principle — extract each into its own focused class; keep classes under ~200 lines.
- **Dependency Inversion**: inject via constructor with interface type-hints. Inject dependencies via constructor for testability. Favor composition over deep inheritance chains.
- **Separation of Concerns**: Use **Interfaces** for decoupling integrations and logic.

### Logic & Performance

- **Guard Clauses**: Return early for error conditions (e.g., if (!$user) return null); no else after return to reduce nesting depth.
- **Traits**: Define trait HasTimestamps (e.g., `use HasTimestamps`) for cross-cutting behavior. Keep traits focused and lightweight.
- **Helper Functions**: Avoid global-namespace logic; organize in classes.

## Anti-Patterns

- **No monolithic classes**: Each class one responsibility (SRP).
- **No hardcoded magic numbers**: Define as named class constants.
- **No deep nesting**: Use guard clauses to return early.
- **No `echo` in services**: Return data; let controller output.

## References

- [Clean Code Patterns](references/implementation.md)

---

### php-concurrency

---
name: php-concurrency
description: Implement concurrency and non-blocking I/O in modern PHP. Use when implementing concurrent requests, async processing, or non-blocking I/O in PHP.
metadata:
  triggers:
    files:
    - '**/*.php'
    keywords:
    - Fiber
    - suspend
    - resume
    - non-blocking
    - async
---
# PHP Concurrency

## **Priority: P2 (MEDIUM)**

## Structure

See [implementation examples](references/implementation.md#directory-structure) for directory layout.

## Implement PHP Fibers (8.1+)

- **Multitasking**: Use **`new Fiber()`** for low-level cooperative multitasking.
- **Yielding Control**: Use **`Fiber::suspend('paused')`** to yield execution back to caller.
- **Resuming**: Call **`$fiber->resume('hello')`** to continue execution. Catch exceptions via **`$fiber->getReturn()`**.
- **Isolation**: Use **separate PDO connections per Fiber** to avoid shared mutable state.

See [implementation examples](references/implementation.md#fiber-example) for Fiber cooperative multitasking code.

## Configure Non-blocking I/O & Event Loops

- **Loop Setup**: Use **ReactPHP** or **Amp**. Call **`Loop::get()`** to access event loop.
- **HTTP Clients**: Use **`react/http`** or **Guzzle `Pool($client, ...)`** for concurrent requests.
- **I/O Safety**: **Never use blocking `file_get_contents` or `sleep()`** inside Fiber or EventLoop.
- **Entry Point**: Run **`Loop::run()`** at your application entry point to start async loop.

See [implementation examples](references/implementation.md#guzzle-pool-example) for concurrent HTTP requests with Guzzle Pool.

## Choose Concurrency Strategies

- **Queued Jobs**: For heavy concurrency, prefer **Laravel Horizon** or **Symfony Messenger** over raw PHP Fibers.
- **Self-Contained Logic**: Ensure Fibers manage their own state and exceptions to prevent cross-contamination.

## Anti-Patterns

- **No deeply nested Fiber suspends**: Keep Fiber logic traceable.
- **No blocking I/O inside Fibers**: Use async-compatible libraries.
- **No custom scheduler code**: Use Amp or ReactPHP instead.

## References

- [Fiber Implementation Guide](references/implementation.md)

---

### php-error-handling

---
name: php-error-handling
description: Implement modern PHP error and exception handling patterns. Use when implementing exception hierarchies, error handlers, or custom exceptions in PHP.
metadata:
  triggers:
    files:
    - '**/*.php'
    keywords:
    - try
    - catch
    - finally
    - Throwable
    - set_exception_handler
---
# PHP Error Handling

## **Priority: P0 (CRITICAL)**

## Structure

See [implementation examples](references/implementation.md#directory-structure) for directory layout.

## Build Exception Hierarchies

- **Exception-Driven**: Favor **`throwing exceptions`** over returning `false` or `null` for error states.
- **Custom Exceptions**: Extend **`RuntimeException`** or **`LogicException`** for domain-specific errors.
- **Multi-Catch**: Use Union types in catch blocks: **`catch (DomainException | InvalidArgumentException $e)`**.

See [implementation examples](references/implementation.md#exception-hierarchy-example) for domain exception hierarchy with multi-catch and finally.

## Configure Global Error Handling

- **Throwable Interface**: Always catch **`Throwable`** for both PHP 7/8 Errors and Exceptions.
- **Global Handler**: Use **`set_exception_handler`** and **`set_error_handler`** for top-level logging and cleanup.
- **Finally**: Always use **`finally`** for resource cleanup (e.g., closing file handles, DB connections).
- **PSR-3 Logging**: Implement **`Psr\Log\LoggerInterface`** for structured error reporting.
- **Production Guard**: Ensure **`display_errors=Off`** and **`log_errors=On`** in production `php.ini`.

## Anti-Patterns

- **No `@` error suppression**: Handle or log errors explicitly.
- **No empty catch blocks**: Log or rethrow all caught exceptions.
- **No exceptions for control flow**: Reserve for unexpected errors only.
- **No `display_errors` in production**: Log to file; never show users.

## References

- [Exception & Logging Patterns](references/implementation.md)

---

### php-language

---
name: php-language
description: Apply core PHP language standards and modern 8.x features. Use when working with PHP 8.x features like enums, fibers, readonly properties, or named arguments.
metadata:
  triggers:
    files:
    - '**/*.php'
    keywords:
    - declare
    - readonly
    - match
    - constructor
    - promotion
    - types
---
# PHP Language Standards

## **Priority: P0 (CRITICAL)**

## Structure

```text
src/
└── {Namespace}/
    └── {Class}.php
```

## Implementation Guidelines

### Core Language Standards

- **Strict Typing**: Declare **`declare(strict_types=1);`** at very top of every file.
- **Type Hinting**: Apply scalar type hints (e.g., `string`, `int`) and return types to all functions.
- **Strict Comparison**: **Avoid loose `==` comparison**; always use `===` for strict equality.

### Modern PHP 8+ Patterns

- **Match Expressions**: Prefer **`match($status)`** over `switch` for value returns. It provides strict comparison and exhaustive by default.
- **Default Case**: Use **`default => throw new InvalidArgumentException($status)`** to handle unknown states.
- **Read-only**: Use **`public readonly string $name`** for properties set once at construction.
- **Property Promotion**: Use **`public function __construct(public string $name) {}`** to reduce boilerplate.
- **Named Arguments**: Call functions with **`name: 'John', age: 25`** to skip optional parameters.
- **Flexible Types**: Use **Union types (`int|string`)** and **Intersection types (`Countable&Traversable`)**.

## Anti-Patterns

- **No untyped functions**: Declare return and parameter types always.
- **No loose `==` comparison**: Use `===` for strict equality.
- **No `switch` for value mapping**: Use `match` expressions instead.
- **No global namespace logic**: Organize in classes and namespaces.

## References

- [Modern PHP Patterns](references/implementation.md)

---

### php-security

---
name: php-security
description: PHP security standards for database access, password handling, and input validation. Use when securing PHP apps against SQL injection, XSS, or weak password storage.
metadata:
  triggers:
    files:
    - '**/*.php'
    keywords:
    - pdo
    - password_hash
    - htmlentities
    - filter_var
    - php security
    - sql injection
    - xss php
    - prepared statement
    - csrf
    - sanitize input
    - password storage
---
# PHP Security

## **Priority: P0 (CRITICAL)**

## Structure

```text
src/
└── Security/
    ├── Validators/
    └── Auth/
```

## Implementation Guidelines

- **Prepared Statements**: Use PDO with Parameterized Queries: `$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id'); $stmt->execute([':id' => $id]);`. NEVER concatenate user input into SQL strings.
- **Password Hashing**: ALWAYS use **`password_hash()`** with **`PASSWORD_ARGON2ID`** (PHP 7.4+) or **`PASSWORD_BCRYPT`**.
- **Auth Verification**: Use `password_verify()`. Use `password_needs_rehash()` to upgrade legacy hashes. Implement Rate Limiting and MFA where appropriate.
- **XSS Escaping**: Use `htmlentities($userInput, ENT_QUOTES | ENT_HTML5, 'UTF-8')` or `htmlspecialchars()` on all user output. Prefer Twig or Blade for auto-escaping.
- **CSRF Protection**: Mandate **`CSRF tokens`** for all state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`).
- **Input Validation**: Use `filter_var($email, FILTER_VALIDATE_EMAIL)` or `filter_var($url, FILTER_VALIDATE_URL)`. Always Whitelist allowed values.
- **File Security**: RESTRICT file uploads by **MIME type** and **extension**. Store uploads **outside public root**.
- **Session Safety**: Configure **`session.cookie_httponly = 1`**, **`session.cookie_secure = 1`**, and **`session.samesite = "Lax"`**.
- **Header Security**: Enforce **`Content-Security-Policy (CSP)`**, **`X-Frame-Options: DENY`**, and **`X-Content-Type-Options: nosniff`**.

## Anti-Patterns

- **No SQL string concatenation**: Use PDO prepared statements only.
- **No MD5/SHA1 for passwords**: Use `password_hash($password, PASSWORD_ARGON2ID)`.
- **No raw `$_GET`/`$_POST`**: Validate all input with `filter_var()` first.
- **No production error display**: Log to file; never show to users.

## References

- [Secure Implementation Patterns](references/implementation.md)

---

### php-testing

---
name: php-testing
description: Write unit and integration tests for PHP applications with PHPUnit and Pest. Use when writing PHPUnit unit tests or integration tests for PHP applications.
metadata:
  triggers:
    files:
    - 'tests/**/*.php'
    - 'phpunit.xml'
    keywords:
    - phpunit
    - pest
    - mock
    - assert
    - tdd
---
# PHP Testing

## **Priority: P1 (HIGH)**

## Structure

See [implementation examples](references/implementation.md#directory-structure) for test directory layout.

## Write Tests with PHPUnit and Pest

- **Standards**: Use **`PHPUnit`** (9/10+) or **`Pest`**. Organize into **`Unit/`**, **`Integration/`**, and **`Feature/`**. Class names should extend **`TestCase`**.
- **TDD Workflow**: Follow **Red-Green-Refactor**. Write failing test first, implement minimal logic, then refactor.

See [implementation examples](references/implementation.md#phpunit-service-test) for PHPUnit service test with mock.

## Apply Assertions and Data Providers

- **Fluent Assertions**: Use **`assertSame`** (`===`) over `assertEquals` to avoid type coercion. Also use **`assertCount()`** and **`assertMatchesRegularExpression()`**.
- **Data Providers**: Use **`#[DataProvider('statusProvider')]`** (PHPUnit 10+) or **`dataset`** (Pest).

See [implementation examples](references/implementation.md#pest-dataset-example) for Pest expressive syntax with datasets.

## Isolate Test Dependencies

- **Mocking**: Use **`createMock()`** for dependencies. NOT mock simple Data Objects.
- **Isolation**: Ensure tests **Independent** and **Repeatable**. DB tests must use **`Transactions`** or **`SQLite :memory:`**.
- **Coverage**: Aim for **`80%+`** line coverage. Use **`phpunit.xml`** to whitelist specific directories.
- **Automation**: Run tests on every PR using **GitHub Actions** or **GitLab CI**.

## Anti-Patterns

- **No testing private methods**: Test through public interfaces only.
- **No over-mocking internals**: Mock only external boundaries.
- **No real network/DB in unit tests**: Use in-memory databases or mocks.
- **No coverage-metric chasing**: Prioritize meaningful assertions.

## References

- [Testing Patterns & Mocks](references/implementation.md)

---

### php-tooling

---
name: php-tooling
description: Configure PHP ecosystem tooling, dependency management, and static analysis. Use when managing Composer dependencies, running PHPStan, or configuring PHP build tools.
metadata:
  triggers:
    files:
    - 'composer.json'
    keywords:
    - composer
    - lock
    - phpstan
    - xdebug
---
# PHP Tooling

## **Priority: P2 (MEDIUM)**

## Structure

```text
project/
├── composer.json
├── phpstan.neon
└── .php-cs-fixer.php
```

## Implementation Guidelines

- **Composer**: Always **commit `composer.lock`** for applications. Use **`composer audit`** and **`composer install in CI`** (not `update`) for locked versions.
- **Autoloading**: Strictly enforce **PSR-4** autoloading in **`composer.json`** (e.g., **`"psr-4": {"App\\": "src/"}`** — ensure backslashes escaped). Run **`composer dump-autoload`** after changes.
- **Static Analysis**: Mandate **PHPStan** (Level 5+) or **Psalm** in CI. Install via **`composer require --dev phpstan/phpstan`**. Create **`phpstan.neon`** with **`parameters: { paths: [src], level: 6 }`**. Run via **`vendor/bin/phpstan analyse`**.
- **Linting**: Automate **PSR-12** standards via **`composer require --dev friendsofphp/php-cs-fixer`**. Configure in **`.php-cs-fixer.php`** with **`$config->setRules(['@PSR12' => true])`**. Use **`php-cs-fixer`** to enforce standards.
- **Execution**: Use **`PHP 8.1+`** to leverage performance improvements (JIT, OpCache).
- **Scripts**: Define standard task **`"scripts": {`** in **`composer.json`** (**`"analyze": "phpstan analyse", "test": "phpunit", "check": ["@fix", "@analyze", "@test"]}`**). Run with **`composer check`**.
- **Debugging**: Use **`Xdebug`** for local development only. **Remove xdebug.so** from prod config or **set XDEBUG_MODE=off** in production.
- **Docker**: Use **Multi-stage Dockerfiles** with **`php:8.x-fpm`** or **`php:8.x-cli`** base images.

## Anti-Patterns

- **No manual `require`**: Use Composer PSR-4 autoloading only.
- **No blind composer updates**: Review `composer.lock` diff first.
- **No Xdebug in production**: Disable extension in prod env.
- **No `vendor/` in git**: Exclude via `.gitignore`; use Composer.

## References

---

