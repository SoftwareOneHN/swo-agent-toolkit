---
inclusion: manual
---

# Skills: golang

> 11 skills. Load when editing golang files.
> For code examples and implementation patterns, load `refs-golang.md`.

## Index

# golang Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **golang-api-server** | `cmd/server/*.go`, `internal/adapter/handler/**` | http server, rest api, gin, echo, middleware |
| **golang-architecture** | `go.mod`, `internal/**` | architecture, structure, folder layout, clean arch, dependency injection |
| golang-configuration | `configs/**`, `cmd/**` | configuration, env var, viper, koanf |
| **golang-database** | `internal/adapter/repository/**` | database, sql, postgres, gorm, sqlc, pgx |
| **golang-error-handling** | `fmt.Errorf`, `errors.Is`, `errors.As` | error wrapping, sentinel error, error handling |
| **golang-language** | `go.mod` | golang, go code, idiomatic, gofmt, goimports, iota, golang style |
| golang-logging | `go.mod`, `pkg/logger/**` | logging, slog, structured logging, zap |
| **golang-security** | `crypto/rand` | argon2, sanitize, jwt, bcrypt, validation, input validation, sql injection |
| **golang-testing** | `**/*_test.go` | testing, unit tests, go test, mocking, testify |
| golang-tooling | `golangci.yml` | gopls, golangci-lint, go vet, goimports, staticcheck, go tooling, go lint |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| **golang-concurrency** | goroutine, go keyword, channel, mutex, waitgroup, context, errgroup, race condition |

> Load matched skills: `<SKILLS>/golang/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### golang-api-server

---
name: golang-api-server
description: Build HTTP services, REST APIs, and middleware in Go. Use when building Go HTTP servers, REST APIs, or custom middleware.
metadata:
  triggers:
    files:
    - 'cmd/server/*.go'
    - 'internal/adapter/handler/**'
    keywords:
    - http server
    - rest api
    - gin
    - echo
    - middleware
---
# Golang API Server

## **Priority: P0 (CRITICAL)**

## Router Selection

- **Standard Lib (`net/http`)**: Use for simple services or zero-dependency requirements. `http.ServeMux` (Go 1.22+) method-based routing.
- **Echo (`labstack/echo`)**: Recommended for production REST APIs with middleware, binding, and error handling.
- **Gin (`gin-gonic/gin`)**: High performance alternative.

## Implementation Workflow

1. **Choose router** — Select based on complexity needs (stdlib for simple, Echo/Gin for production).
2. **Separate concerns** — Handlers parse requests, call services, and format responses. No business logic in handlers.
3. **Add middleware** — Use middleware for cross-cutting concerns (Logging, Recovery, CORS, Auth, Tracing).
4. **Include health endpoints** — Always expose `/health` and `/ready` endpoints.
5. **Enforce content types** — Require `application/json` for REST APIs.
6. **Implement graceful shutdown** — Handle SIGINT/SIGTERM to drain in-flight requests.

See [graceful shutdown example](references/graceful-shutdown.md) and [Echo handler patterns](references/middleware-patterns.md)

## Anti-Patterns

- **No business logic in handlers**: parse request, call service, and format response only.
- **No global router vars**: pass router instance via constructor or DI.
- **No missing shutdown**: handle SIGTERM to drain in-flight requests.

## References

- [Middleware Patterns](references/middleware-patterns.md)
- [Graceful Shutdown](references/graceful-shutdown.md)

---

### golang-architecture

---
name: golang-architecture
description: Structure Go projects with Clean Architecture and standard layout conventions. Use when structuring Go projects or applying Clean Architecture in Go.
metadata:
  triggers:
    files:
    - 'go.mod'
    - 'internal/**'
    keywords:
    - architecture
    - structure
    - folder layout
    - clean arch
    - dependency injection
---
# Golang Architecture

## **Priority: P0 (CRITICAL)**

## Principles

- **Clean Architecture**: Inner layers (Domain) rely on nothing. Outer layers (Adapters) rely on inner.
- **Project Layout**: Follow standard Go layout (`cmd`, `internal`, `pkg`).
- **Dependency Injection**: Pass dependencies via constructors. Avoid global singletons.
- **Package Oriented Design**: Organize by feature/domain, not by layer.
- **Interface Segregation**: Define interfaces where they _used_ (consumer side).

## Implementation Workflow

1. **Set up project layout** — Use `cmd/` for entry points, `internal/` for private packages, `pkg/` for shared libraries.
2. **Define domain layer** — Inner-most layer with zero external dependencies.
3. **Build use cases** — Depend only on Domain interfaces.
4. **Implement adapters** — Outer layer depends on UseCase/Domain. Contains HTTP handlers, DB repos, etc.
5. **Wire in main** — Compose full dependency graph in `main.go`.

See [constructor injection and wiring examples](references/clean-arch.md)

## Verification Checklist

- [ ] No global singletons or package-level mutable variables
- [ ] Dependencies explicitly passed via constructors
- [ ] Interfaces defined at consumer side
- [ ] `internal/domain` zero external dependencies
- [ ] Dependencies wired together in `main.go`

## Anti-Patterns

- **No global singletons**: use DI; avoid package-level mutable variables.
- **No layer violations**: keep Domain imports isolated from adapter/infrastructure layers.
- **No god services**: split services into single-responsibility components.

## References

- [Standard Project Layout](references/project-layout.md)
- [Clean Architecture Layers](references/clean-arch.md)

---

### golang-concurrency

---
name: golang-concurrency
description: Write safe concurrent Go code with goroutines, channels, and context. Use when implementing concurrency with goroutines, channels, or context in Go.
metadata:
  triggers:
    keywords:
    - goroutine
    - go keyword
    - channel
    - mutex
    - waitgroup
    - context
    - errgroup
    - race condition
---
# Golang Concurrency

## **Priority: P0 (CRITICAL)**

## Principles

- **Share Memory by Communicating**: Use channels instead of shared memory.
- **Context King**: Always pass `ctx` to manage cancellation/timeouts.
- **Prevent Leaks**: Never start goroutine without knowing how it will stop.
- **Race Detection**: Always run tests with `go test -race`.

## Implementation Workflow

1. **Choose primitive** — Channels for data passing, `sync.Mutex` for simple state protection, `errgroup` for parallel tasks with error handling.
2. **Pass context** — Every goroutine that I/O or long work must accept `context.Context`.
3. **Define exit paths** — Every goroutine must clear shutdown mechanism (context cancellation, channel close, or WaitGroup).
4. **Use select for multiplexing** — Handle multiple channels or timeouts with `select`.
5. **Test with race detector** — Run `go test -race` in CI.

See [ErrGroup and concurrency patterns](references/concurrency-patterns.md) and [context timeout examples](references/context-usage.md)

## Anti-Patterns

- **No goroutine leaks**: ensure every goroutine known exit path.
- **No shared global state**: use channels or sync primitives across goroutines.
- **No bare goroutines**: use `errgroup` or `WaitGroup` for lifecycle management.

## References

- [Concurrency Patterns](references/concurrency-patterns.md)
- [Context Usage](references/context-usage.md)

---

### golang-configuration

---
name: golang-configuration
description: Load and validate application configuration from environment variables and config files. Use when managing Go application config with environment variables or viper.
metadata:
  triggers:
    files:
    - 'configs/**'
    - 'cmd/**'
    keywords:
    - configuration
    - env var
    - viper
    - koanf
---
# Golang Configuration

## **Priority: P1 (STANDARD)**

## Principles

- **12-Factor App**: Store config in environment variables.
- **Typed Config**: Load config into struct, validate immediately.
- **Secrets**: Never commit secrets. Use env vars or secret managers.
- **No Globals**: Return Config struct and inject it.

## Implementation Workflow

1. **Define Config struct** — Create typed struct with all required fields.
2. **Load defaults** — Set sensible defaults for non-secret values.
3. **Override from file** — Optionally load from YAML/JSON config file.
4. **Override from env** — Environment variables take highest priority.
5. **Validate at startup** — Crash immediately on missing required config.
6. **Inject via constructor** — Pass Config to services; never use global config vars.

See [config struct and usage examples](references/config-patterns.md)

## Libraries

- **Standard Lib**: `os.Getenv` for simple apps.
- **Viper**: Industry standard for complex configs (env, files, remote).
- **Koanf**: Lighter, cleaner alternative to Viper.
- **Caarlos0/env**: Strict struct tagging approach.

## Anti-Patterns

- **No hardcoded secrets**: load all secrets from env vars or secret manager.
- **No global config vars**: return typed Config struct and inject via constructors.
- **No silent startup**: crash immediately on missing required env vars.

## References

- [Config Pattern](references/config-patterns.md)

---

### golang-database

---
name: golang-database
description: Implement database access with connection pooling and repository patterns in Go. Use when building database access, connection pools, or repositories in Go.
metadata:
  triggers:
    files:
    - 'internal/adapter/repository/**'
    keywords:
    - database
    - sql
    - postgres
    - gorm
    - sqlc
    - pgx
---
# Golang Database

## **Priority: P0 (CRITICAL)**

## Principles

- **Prefer Raw SQL/Builders over ORMs**: `sqlc` generates type-safe Go from SQL. ORMs (GORM) can obscure performance.
- **Repository Pattern**: Abstract DB access behind interfaces in `internal/port/`.
- **Connection Pooling**: Always configure pool settings.
- **Transactions**: ACID logic must use transactions. Pass `context.Context` everywhere.

## Implementation Workflow

1. **Choose driver** — PostgreSQL: `pgx/v5`; MySQL: `go-sql-driver/mysql`; SQLite: `modernc.org/sqlite`.
2. **Configure pool** — Set `MaxOpenConns`, `MaxIdleConns`, and `ConnMaxLifetime` on connection.
3. **Define repository interface** — Abstract DB access behind interface at consumer side.
4. **Use context-aware queries** — Always use `QueryContext`/`ExecContext`; bare queries ignore timeouts.
5. **Close rows** — Always `defer rows.Close()` and check `rows.Err()` after iteration.
6. **Wrap in transactions** — Use transactions for multi-step operations requiring atomicity.

See [repository pattern and connection pool examples](references/repository-pattern.md)

## Anti-Patterns

- **No global db var**: inject DB connection via constructor.
- **No context-less queries**: use `QueryContext`/`ExecContext`; bare queries ignore timeouts.
- **No leaked rows**: always `defer rows.Close()` and check `rows.Err()`.

## References

- [Repository Pattern Implementation](references/repository-pattern.md)
- [Connection Tuning](references/connection-tuning.md)

---

### golang-error-handling

---
name: golang-error-handling
description: Standards for error wrapping, checking, and definition in Golang. Use when wrapping errors, defining sentinel errors, or handling errors idiomatically in Go.
metadata:
  triggers:
    files:
    - 'fmt.Errorf'
    - 'errors.Is'
    - 'errors.As'
    keywords:
    - error wrapping
    - sentinel error
    - error handling
---
# Golang Error Handling Standards

## **Priority: P0 (CRITICAL)**

## Principles

- **Errors Values**: Handle them like any other value.
- **Handle Once**: Log OR Return. Never Log AND Return (creates duplicate logs).
- **Add Context**: Don't return `err` bubble up. Wrap it with context: `fmt.Errorf("failed to open file: %w", err)`.
- **Use Standard Lib**: Go 1.13+ `errors` package (`Is`, `As`, `Unwrap`) sufficient. Avoid `pkg/errors` (deprecated).

## Guidelines

- **Sentinel Errors**: Expoted, fixed errors (`io.EOF`, `sql.ErrNoRows`). Use `errors.Is(err, io.EOF)`.
- **Error Types**: Structs implementing `error`. Use `errors.As(err, &target)`.
- **Panic**: Only for unrecoverable startup errors.

## Anti-Patterns

- **No bare return err**: Wrap with `fmt.Errorf("context: %w", err)` to preserve call chain.
- **No string error checks**: Use `errors.Is`/`errors.As`; string comparison brittle.
- **No swallowed errors**: Never assign errors to `_`; always handle or propagate.

## References

- [Error Wrapping Patterns](references/error-wrapping.md)

---

### golang-language

---
name: golang-language
description: Core idioms, style guides, and best practices for writing idiomatic Go code. Use when writing Go code following official style guides and idiomatic patterns.
metadata:
  triggers:
    files:
    - 'go.mod'
    keywords:
    - golang
    - go code
    - idiomatic
    - gofmt
    - goimports
    - iota
    - golang style
---
# Golang Language Standards

## **Priority: P0 (CRITICAL)**

## Guidelines

- **Formatting**: Run **`gofmt`** or **`goimports`** on save. Use **`gopls`** for LSP features.
- **Naming**: Use **`camelCase`** for internal (unexported) and **`PascalCase`** for public (exported) symbols.
- **Packages**: Use short, lowercase, singular names (e.g., **`http`**, **`user`**). Avoid `_` or `camelCase` in package names.
- **Interfaces**: Small interfaces — 1-2 methods max. Define where used (consumer side), not where implemented.
- **Errors**: Return **`error`** as last return value. Handle errors **immediately** at call-site.
- **Slices**: Use **`make(slice, len, cap)`** to pre-allocate capacity and avoid redundant re-allocations.
- **Enums**: Use const block with iota for type-safe enumerations.
- **Zero Values**: Leverage **`zero-value`** initialization over explicit `nil` checks where possible.

## Anti-Patterns

- **No init**: Use constructors (NewService()), not init(). (not init() — it runs implicitly and makes testing harder)
- **No Globals**: Use DI, not global mutable state.
- **No `panic`**: Return errors, don't panic.
- **No `_` ignored errors**: Always check and handle errors.
- **No stutter**: `log.Error`, not `log.LogError`.

## Verification Workflow (Mandatory)

After writing or modifying Go code:

1. **`mcp__ide__getDiagnostics`** — catch compile errors and gopls type diagnostics immediately
2. **`go vet ./...`** — catch common mistakes (printf mismatches, unreachable code, shadowed vars)
3. **`goimports -w .`** — fix imports and formatting in one pass

## References

- [Idioms](references/idioms.md)
- [Effective Go Summary](references/effective-go-summary.md)

---

### golang-logging

---
name: golang-logging
description: Standards for structured logging and observability in Golang. Use when adding structured logging or tracing to Go services.
metadata:
  triggers:
    files:
    - 'go.mod'
    - 'pkg/logger/**'
    keywords:
    - logging
    - slog
    - structured logging
    - zap
---
# Golang Logging Standards

## **Priority: P1 (STANDARD)**

## Principles

- **Structured Logging**: Use JSON or structured text. Readable by machines and humans.
- **Leveled Logging**: Debug, Info, Warn, Error.
- **Contextual**: Include correlation IDs (TraceID, RequestID) in logs.
- **No `log.Fatal`**: Avoid terminating app inside libraries. Return error instead. Only `main` should exit.

## Libraries

- **`log/slog` (Recommended)**: Stdlib since Go 1.21. Fast, structured, zero-dep.
- **Zap (`uber-go/zap`)**: High performance, good if pre-1.21 or extreme throughput needed.
- **Zerolog**: Zero allocation, fast JSON logger.

## Workflow: Set Up Structured Logging with slog

1. Create JSON handler at startup in `main()`
2. Optionally wrap in middleware to inject request-scoped attributes
3. Use `slog.With()` to add correlation IDs per request
4. Pass logger via context or dependency injection

See [slog setup and usage examples](references/slog-patterns.md)

## References

- [Slog Patterns](references/slog-patterns.md)

## Anti-Patterns

- **No fmt.Println in production**: Use slog or zap for structured, leveled logging.
- **No log.Fatal in libraries**: Return errors; only main() should call os.Exit.
- **No unstructured log strings**: Include correlation IDs and structured fields via slog.Attr.

---

### golang-security

---
name: golang-security
description: Secure Go backend services against common vulnerabilities. Use when implementing input validation, crypto, or SQL injection prevention in Go.
metadata:
  triggers:
    files:
    - 'crypto/rand'
    keywords:
    - argon2
    - sanitize
    - jwt
    - bcrypt
    - validation
    - input validation
    - sql injection
---
# Golang Security Standards

## **Priority: P0 (CRITICAL)**

## Implementation Guidelines

### Input Validation

- **Validation**: Use `go-playground/validator` or `google/go-cmp` for struct validation.
- **Sanitization**: Sanitize user input before processing. Use `bluemonday` for HTML sanitization.

### Cryptography

- **Random**: ALWAYS use `crypto/rand`, NEVER `math/rand` for security-sensitive operations (tokens, keys, IVs).
- **Hashing**: Use **Argon2id** for password hashing (`golang.org/x/crypto/argon2`). NOT use bcrypt (weaker) or MD5/SHA1 (insecure). Recommended params: `time=1, memory=64MB, threads=4`.
- **Encryption**: Use `crypto/aes` with GCM mode for authenticated encryption.

### SQL Injection Prevention

- **Parameterized Queries**: ALWAYS use `$1, $2` placeholders with `database/sql` or ORM (GORM, sqlx).
- **No String Concatenation**: Never build queries with `fmt.Sprintf()`.

### Authentication

- **JWT**: Use `golang-jwt/jwt` v5+. Enforce `RS256` (preferred) or `HS256`. **Reject `none` and symmetric algorithms for multi-service auth**. Validate `alg`, `iss`, `aud`, `exp` claims.
- **Sessions**: Use secure, httpOnly cookies with `gorilla/sessions`.

### Secret Management

- **Environment Variables**: Load secrets via `godotenv` or Kubernetes secrets.
- **No Hardcoding**: Never commit API keys, passwords, or tokens to Git.

## Anti-Patterns

- **No `math/rand` for Security**: RNG predictable. Use `crypto/rand`.
- **No `fmt.Sprintf()` for SQL**: Causes SQL injection. Use placeholders.
- **No bcrypt or MD5 for Passwords**: Use `argon2id` exclusively.
- **No Exposed Error Details**: Don't leak stack traces to clients in production.

## References

- [Implementation Examples](references/implementation.md)

---

### golang-testing

---
name: golang-testing
description: Write unit tests with table-driven patterns and interface mocking in Go. Use when writing Go unit tests, table-driven tests, or using mock interfaces.
metadata:
  triggers:
    files:
    - '**/*_test.go'
    keywords:
    - testing
    - unit tests
    - go test
    - mocking
    - testify
---
# Golang Testing

## **Priority: P0 (CRITICAL)**

## Implementation Workflow

1. **Write failing test first** — Follow Red-Green-Refactor TDD workflow.
2. **Use table-driven tests** — Define test cases as slice of structs; iterate with `t.Run()`.
3. **Mock via interfaces** — Use DI and interfaces. Prefer `mockery` for auto-generated mocks or manual mocks for simple cases.
4. **Run parallel** — Use `t.Parallel()` for non-sequential tests to speed up CI.
5. **Clean up resources** — Use `t.Cleanup()` to reset state or release DB/file resources.
6. **Check coverage** — Aim for >80% line coverage. Run `go test -cover` to audit.

See [table-driven test examples](references/table-driven-tests.md)

## Tools

- **Stdlib**: `testing` package usually enough.
- **Testify**: Assertions (`assert`, `require`) and mocks.
- **Mockery**: Auto-generate mocks for interfaces.
- **GoMock**: Popular mocking framework alternative.

## Naming

- Test file: `*_test.go`
- Test function: `func TestName(t *testing.T)`
- Example function: `func ExampleName()`

## Anti-Patterns

- **No assert in loops**: use `t.Run` subtests to isolate failures.
- **No global mock state**: define mocks locally within test scope.
- **No skipping race detection**: always run `go test -race` in CI.

## References

- [Table-Driven Tests](references/table-driven-tests.md)
- [Mocking Strategies](references/mocking-strategies.md)

---

### golang-tooling

---
name: golang-tooling
description: Go developer toolchain — gopls LSP diagnostics, linting, formatting, and vet. Use when setting up Go tooling, running linters, or integrating gopls with Claude Code.
metadata:
  triggers:
    files:
    - 'golangci.yml'
    keywords:
    - gopls
    - golangci-lint
    - go vet
    - goimports
    - staticcheck
    - go tooling
    - go lint
---
# Golang Tooling Standards

## **Priority: P1 (Operational)**

## Verification Workflow (Mandatory)

After writing or modifying Go code, run in order:

1. **`mcp__ide__getDiagnostics`** — gopls real-time errors and type warnings (requires gopls-lsp plugin)
2. **`go vet ./...`** — catch printf mismatches, unreachable code, shadowed variables
3. **`goimports -w .`** — organize imports and format in one pass
4. **`golangci-lint run ./...`** — run full linter suite (if `.golangci.yml` present)

## Tool Overview

| Tool | Purpose | When to Use |
|------|---------|------------|
| `gopls` | LSP: diagnostics, completion, hover | Always (IDE integration) |
| `go vet` | Static analysis — correctness bugs | After every edit |
| `goimports` | Import sorting + `gofmt` | Before commit |
| `golangci-lint` | Aggregated linters (errcheck, staticcheck, etc.) | CI / pre-commit |
| `staticcheck` | Advanced static analysis | Large codebases |

## golangci-lint Setup

Configure via `.golangci.yml` at repo root. Recommended linters:

- `errcheck` — enforce error handling
- `staticcheck` — bug detection beyond go vet
- `govet` — shadow, composites
- `revive` — style enforcement
- `gosec` — security issues

See [golangci.yml example](references/golangci.md).

## gopls Integration

`gopls` powers `mcp__ide__getDiagnostics`. Install:

```bash
go install golang.org/x/tools/gopls@latest
```

## Anti-Patterns

- **No `gofmt` alone**: Use `goimports` — it formatting AND imports.
- **No manual import sorting**: Let `goimports` manage order.
- **No skipping go vet**: Run it — catches real bugs `gofmt` misses.
- **No broad lint disable**: Fix root cause instead of `//nolint` comments.

## References

- [golangci.yml example](references/golangci.md)

---

