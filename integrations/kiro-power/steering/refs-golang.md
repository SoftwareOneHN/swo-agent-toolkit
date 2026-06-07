---
inclusion: manual
---

# References: golang

> 17 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-golang.md`.

## golang-api-server

### graceful-shutdown

# Graceful Shutdown

Ensure no requests are dropped during deployment.

```go
func main() {
    srv := &http.Server{Addr: ":8080"}

    // Start in goroutine
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()

    // Wait for interrupt signal using channel
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    // Context with timeout for shutdown
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }
}
```

## Graceful Shutdown with Custom Router

```go
srv := &http.Server{Addr: ":8080", Handler: router}

go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
        log.Fatalf("listen: %s\n", err)
    }
}()

quit := make(chan os.Signal, 1)
signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
<-quit

ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("Server forced to shutdown:", err)
}
```


---

### middleware-patterns

# Middleware Patterns

## Standard Library Pattern

```go
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        // Serve request
        next.ServeHTTP(w, r)
        // Log after completion
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}
```

## Chaining

Use libraries like `alice` or just simple composition.

```go
handler = LoggingMiddleware(AuthMiddleware(finalHandler))
```

## Echo Middleware

```go
func Track(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		req := c.Request()
		res := c.Response()
        // Logic before
		if err := next(c); err != nil {
			c.Error(err)
		}
        // Logic after
		return nil
	}
}
```

## Echo Handler Pattern

```go
func (h *OrderHandler) GetOrder(c echo.Context) error {
    id := c.Param("id")
    order, err := h.orderService.GetByID(c.Request().Context(), id)
    if err != nil {
        return echo.NewHTTPError(http.StatusNotFound, "order not found")
    }
    return c.JSON(http.StatusOK, toOrderResponse(order))
}
```


---

## golang-architecture

### clean-arch

# Clean Architecture in Go

## The Dependency Rule

Dependencies can only point **inward**. Inner circles know nothing about outer circles.

## Layers

### 1. Domain (Entities)

- **Location**: `internal/domain/`
- **Content**: Pure Go structs. Core business logic.
- **Dependencies**: None. Stdlib only.

```go
// internal/domain/user.go
type User struct {
    ID    string
    Email string
}

func (u *User) ChangeEmail(email string) error {
    // validation logic...
}
```

### 2. Usecase (Application Logic)

- **Location**: `internal/service/`
- **Content**: Application specific business rules. Orchestrates domain objects.
- **Dependencies**: Domain, Port Interfaces.

```go
// internal/service/user_service.go
type UserService struct {
    repo port.UserRepository
}

func (s *UserService) Register(ctx context.Context, email string) error {
    // orchestrate registration
}
```

### 3. Interface Adapters (Ports Impl)

- **Location**: `internal/adapter/`
- **Content**: Converts data from format most convenient for use cases and entities, to format most convenient for external agency (DB, Web).
- **Sub-layers**:
  - **Handlers**: Controllers, Presenters (`adapter/handler/http`)
  - **Repositories**: Gateways (`adapter/repository/postgres`)

### 4. Frameworks & Drivers

- **Location**: `cmd/`, `configs/`, External libs.
- **Content**: Glue code, DB drivers, HTTP Frameworks.

## Constructor Injection

```go
// Domain interface (defined at consumer side)
type OrderRepository interface {
    GetByID(ctx context.Context, id string) (*Order, error)
}

// Service depends on interface, not concrete struct
type OrderService struct {
    repo OrderRepository
}

func NewOrderService(repo OrderRepository) *OrderService {
    return &OrderService{repo: repo}
}
```

## Wiring in main.go

```go
func main() {
    db := postgres.NewConnection(cfg.DatabaseURL)
    orderRepo := postgres.NewOrderRepository(db)
    orderService := domain.NewOrderService(orderRepo)
    orderHandler := handler.NewOrderHandler(orderService)
    // ... set up router
}
```


---

### project-layout

# Standard Go Project Layout

Based on `golang-standards/project-layout`.

```text
/
├── cmd/
│   └── app/
│       └── main.go           # Entry point. Wires dependencies. Start.
├── internal/
│   ├── domain/               # Enterprise business rules (Structs, Methods)
│   │   ├── user.go
│   │   └── errors.go
│   ├── port/                 # Interfaces (Inputs and Outputs)
│   │   ├── repository.go     # Writer/Reader interfaces
│   │   └── service.go        # Use case interfaces
│   ├── service/              # Application business rules
│   │   └── user_service.go   # Implements logic, uses domain + port
│   └── adapter/              # Interface Adapters
│       ├── handler/          # HTTP/GRPC handlers
│       │   └── http/
│       └── repository/       # Database implementations
│           └── postgres/
├── pkg/                      # Public libraries (e.g., universal utils)
│   └── logger/
├── configs/                  # Config files
├── api/                      # OpenAPI/Proto definitions
├── go.mod
└── Makefile
```


---

## golang-concurrency

### concurrency-patterns

# Concurrency Patterns

## Worker Pool

Process jobs concurrently with a limited number of workers.

```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // Collect results...
}
```

## Pipeline

Chain of processing stages.

```go
func gen(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func sq(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}
```

## ErrGroup Pattern

```go
g, ctx := errgroup.WithContext(ctx)

g.Go(func() error {
    return fetchOrders(ctx, orderCh)
})

g.Go(func() error {
    return fetchProducts(ctx, productCh)
})

if err := g.Wait(); err != nil {
    return fmt.Errorf("parallel fetch failed: %w", err)
}
```


---

### context-usage

# Context Usage

**Golden Rule**: `func Foo(ctx context.Context, args ...)` - First parameter.

## Timeout/Deadline

Stop work if it takes too long.

```go
func slowOperation() {
    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
    defer cancel()

    select {
    case <-time.After(1 * time.Second):
        fmt.Println("overslept")
    case <-ctx.Done():
        fmt.Println(ctx.Err()) // prints "context deadline exceeded"
    }
}
```

## Cancellation

Propagate cancel signal down the call graph.

```go
func main() {
    ctx, cancel := context.WithCancel(context.Background())

    go func() {
        // Do work, check ctx.Done() frequently
        if err := doWork(ctx); err != nil {
            cancel() // Cancel everyone else
        }
    }()
}
```

## Context Timeout with Select

```go
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()

select {
case result := <-doWork(ctx):
    return result, nil
case <-ctx.Done():
    return nil, ctx.Err()
}
```


---

## golang-configuration

### config-patterns

# Config Pattern

Using `viper` or simple env loading.

```go
type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
}

type ServerConfig struct {
    Port int    `mapstructure:"PORT"`
    Mode string `mapstructure:"MODE"` // debug, release
}

func LoadConfig() (*Config, error) {
    viper.SetDefault("PORT", 8080)
    viper.AutomaticEnv()

    var cfg Config
    if err := viper.Unmarshal(&cfg); err != nil {
        return nil, err
    }

    // Validation
    if cfg.Server.Port == 0 {
        return nil, fmt.Errorf("PORT is required")
    }

    return &cfg, nil
}
```

## Config Struct with env Tags

```go
type Config struct {
    Port        int    `env:"PORT" envDefault:"8080"`
    DatabaseURL string `env:"DATABASE_URL,required"`
    LogLevel    string `env:"LOG_LEVEL" envDefault:"info"`
    JWTSecret   string `env:"JWT_SECRET,required"`
}

func LoadConfig() (*Config, error) {
    cfg := &Config{}
    if err := env.Parse(cfg); err != nil {
        return nil, fmt.Errorf("config parse failed: %w", err)
    }
    return cfg, nil
}
```

## Usage in main.go

```go
func main() {
    cfg, err := LoadConfig()
    if err != nil {
        log.Fatalf("failed to load config: %v", err)
    }
    db := postgres.NewConnection(cfg.DatabaseURL)
    srv := server.New(cfg.Port, db)
    srv.Start()
}
```


---

## golang-database

### connection-tuning

# Connection Pool Tuning

## Recommended Settings

```go
db, err := sql.Open("pgx", dsn)
if err != nil {
    log.Fatal(err)
}

db.SetMaxOpenConns(25)          // max concurrent connections
db.SetMaxIdleConns(10)          // keep-alive pool size (≤ MaxOpenConns)
db.SetConnMaxLifetime(5 * time.Minute)  // recycle before server timeout
db.SetConnMaxIdleTime(2 * time.Minute)  // evict long-idle connections
```

## Guidelines

| Setting           | Typical Value       | Rule                                                       |
| ----------------- | ------------------- | ---------------------------------------------------------- |
| `MaxOpenConns`    | 10–50               | Match DB server's `max_connections / num_app_instances`    |
| `MaxIdleConns`    | 50% of MaxOpenConns | Too high wastes memory; too low causes churn               |
| `ConnMaxLifetime` | 5–10 min            | Less than PostgreSQL `idle_in_transaction_session_timeout` |
| `ConnMaxIdleTime` | 1–3 min             | Reclaim idle connections under low traffic                 |

## Ping on Startup

Always verify connectivity before accepting traffic:

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
if err := db.PingContext(ctx); err != nil {
    log.Fatalf("database unreachable: %v", err)
}
```

## Anti-Patterns

- **No unlimited pool**: Default `MaxOpenConns` is unlimited — always cap it.
- **No MaxIdleConns > MaxOpenConns**: Idle pool can't exceed open pool; Go silently ignores excess.
- **No zero lifetime**: Without `ConnMaxLifetime`, stale connections to restarted DBs cause errors.


---

### repository-pattern

# Repository Pattern

Example using `sql.DB` or `pgx`.

## Interface

Defined in `internal/domain/repository.go` or `internal/port/repository.go`.

```go
type UserRepository interface {
    GetByID(ctx context.Context, id string) (*domain.User, error)
    Create(ctx context.Context, user *domain.User) error
}
```

## Implementation

Defined in `internal/adapter/repository/postgres/user_repo.go`.

```go
type PostgresUserRepository struct {
    db *sql.DB
}

func NewPostgresUserRepository(db *sql.DB) *PostgresUserRepository {
    return &PostgresUserRepository{db: db}
}

func (r *PostgresUserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
    query := `SELECT id, email FROM users WHERE id = $1`
    row := r.db.QueryRowContext(ctx, query, id)

    var u domain.User
    if err := row.Scan(&u.ID, &u.Email); err != nil {
        if err == sql.ErrNoRows {
            return nil, domain.ErrUserNotFound
        }
        return nil, err
    }
    return &u, nil
}
```

## pgx Repository with Pool

```go
type OrderRepository interface {
    GetByID(ctx context.Context, id string) (*Order, error)
    Create(ctx context.Context, order *Order) error
}

type pgOrderRepository struct {
    db *pgxpool.Pool
}

func (r *pgOrderRepository) GetByID(ctx context.Context, id string) (*Order, error) {
    row := r.db.QueryRow(ctx,
        "SELECT id, status, created_at FROM orders WHERE id = $1", id)
    var o Order
    if err := row.Scan(&o.ID, &o.Status, &o.CreatedAt); err != nil {
        return nil, fmt.Errorf("get order %s: %w", id, err)
    }
    return &o, nil
}
```

## Connection Pool Setup

```go
config, _ := pgxpool.ParseConfig(databaseURL)
config.MaxConns = 25
config.MinConns = 5
config.MaxConnLifetime = 30 * time.Minute

pool, err := pgxpool.NewWithConfig(ctx, config)
```


---

## golang-error-handling

### error-wrapping

# Error Wrapping Patterns

## Adding Context

```go
func ReadConfig() error {
    file, err := os.Open("config.json")
    if err != nil {
        return fmt.Errorf("failed to open config: %w", err)
    }
    // ...
}
```

## Checking Errors (Is)

```go
if errors.Is(err, os.ErrNotExist) {
    // Handle file missing
}
```

## Extracting Errors (As)

```go
var pathErr *fs.PathError
if errors.As(err, &pathErr) {
    fmt.Println("failed at path:", pathErr.Path)
}
```

## Custom Error Type

```go
type ValidationError struct {
    Field string
    Msg   string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Msg)
}

// Usage
return &ValidationError{Field: "email", Msg: "invalid format"}
```


---

## golang-language

### effective-go-summary

# Effective Go Summary

## Formatting

- `gofmt` is the authority. No arguments.

## Commentary

- Comments immediately precede the declaration.
- `// Package foo implements...` for package docs.
- Exported names **must** have comments.

## Names

- Getters: `Owner()`, not `GetOwner()`.
- Setters: `SetOwner()`.
- Interfaces: One method -> `Listener`, `Reader`.

## Control Structures

- No parentheses `if x > 0 {`.
- Initialization in if: `if err := file.Chmod(0664); err != nil {`.
- `switch` handles multiple cases: `case ' ', '?', '&':`.

## Allocation

- `new(T)`: Allocates zeroed storage for `T`, returns `*T`.
- `make(T, args)`: Creates slices, maps, channels. Returns initialized `T` (not `*T`).


---

### idioms

# Golang Idioms

## Constructing

Use `New` or `New<Type>` pattern for constructors.

```go
func NewClient(cfg Config) (*Client, error) {
    return &Client{cfg: cfg}, nil
}
```

## Options Pattern

For complex configuration, use Functional Options.

```go
type Option func(*Server)

func WithPort(port int) Option {
    return func(s *Server) { s.port = port }
}

func NewServer(opts ...Option) *Server {
    s := &Server{port: 8080}
    for _, opt := range opts {
        opt(s)
    }
    return s
}
```

## Interface Checks

Verify interface implementation at compile time.

```go
var _ Handler = (*MyHandler)(nil)
```

## Embedding

Use embedding for composition, not inheritance.

```go
type ReaderWriter interface {
    Reader
    Writer
}
```


---

## golang-logging

### slog-patterns

# Slog Patterns

## Basic Usage

```go
import "log/slog"

func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    slog.SetDefault(logger)

    slog.Info("Starting server",
        "port", 8080,
        "env", "production",
    )
}
```

## Contextual Logging

Extract TraceID from context and add to logs.

```go
func (h *Handler) Handle(ctx context.Context) {
    // Assuming context has values
    logger := slog.With("trace_id", ctx.Value("trace_id"))

    logger.Info("Processing request", "user_id", 123)
}
```

## Custom Handler

To automatically add attributes from Context to every log: implement `slog.Handler`.

## slog Setup and Per-Request Logging

```go
package main

import (
    "log/slog"
    "net/http"
    "os"
)

func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
        Level: slog.LevelInfo,
    }))
    slog.SetDefault(logger)

    slog.Info("server starting", slog.String("port", "8080"))
}

// Per-request logging with correlation ID
func handler(w http.ResponseWriter, r *http.Request) {
    reqLog := slog.With(
        slog.String("traceId", r.Header.Get("X-Request-Id")),
        slog.String("method", r.Method),
        slog.String("path", r.URL.Path),
    )
    reqLog.Info("handling request")
}
```


---

## golang-security

### implementation

# Golang Security Implementation Examples

## Crypto/Rand vs Math/Rand

```go
// ❌ BAD: math/rand is predictable
import "math/rand"
token := rand.Intn(1000000) // NEVER for security

// ✅ GOOD: crypto/rand is cryptographically secure
import "crypto/rand"
import "encoding/base64"

func GenerateToken() (string, error) {
    b := make([]byte, 32)
    _, err := rand.Read(b)
    if err != nil {
        return "", err
    }
    return base64.URLEncoding.EncodeToString(b), nil
}
```

## SQL Injection Prevention

```go
// ❌ BAD: String concatenation
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)
db.Query(query)

// ✅ GOOD: Parameterized query
db.Query("SELECT * FROM users WHERE email = $1", email)
```

## Password Hashing with bcrypt

```go
import "golang.org/x/crypto/bcrypt"

// Hash password
func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}

// Verify password
func CheckPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

## JWT Validation

```go
import (
    "github.com/golang-jwt/jwt/v5"
)

func ValidateJWT(tokenString string) (*jwt.Token, error) {
    return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // Validate algorithm
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }

        // Validate claims
        if claims, ok := token.Claims.(jwt.MapClaims); ok {
            if !claims.VerifyIssuer("your-issuer", true) {
                return nil, fmt.Errorf("invalid issuer")
            }
            if !claims.VerifyExpiresAt(time.Now().Unix(), true) {
                return nil, fmt.Errorf("token expired")
            }
        }

        return []byte(os.Getenv("JWT_SECRET")), nil
    })
}
```


---

## golang-testing

### mocking-strategies

# Mocking Strategies

## Hand-Written Mocks

Simple and no external tools required.

```go
type MockUserRepo struct {
    GetByIDFunc func(id string) (*User, error)
}

func (m *MockUserRepo) GetByID(ctx context.Context, id string) (*User, error) {
    return m.GetByIDFunc(id)
}
```

## Testify Mocks

```go
type MockUserRepo struct {
    mock.Mock
}

func (m *MockUserRepo) GetByID(ctx context.Context, id string) (*User, error) {
    args := m.Called(ctx, id)
    return args.Get(0).(*User), args.Error(1)
}

// Usage
mockRepo := new(MockUserRepo)
mockRepo.On("GetByID", mock.Anything, "123").Return(&User{ID: "123"}, nil)
```

## Interface definition

**Always** define the interface at the consumer package (dependency inversion). This makes mocking easier.

```go
// service/user_service.go
type UserRepository interface { ... } // Define here!
```


---

### table-driven-tests

# Table-Driven Tests

```go
func TestAdd(t *testing.T) {
    type args struct {
        a int
        b int
    }
    tests := []struct {
        name string
        args args
        want int
    }{
        {"positive", args{1, 2}, 3},
        {"negative", args{-1, -1}, -2},
        {"mixed", args{1, -1}, 0},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.args.a, tt.args.b); got != tt.want {
                t.Errorf("Add() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

## Parallel Execution

```go
func TestSomething(t *testing.T) {
    t.Parallel() // 1. Parent parallel
    // ... logic
    for _, tt := range tests {
        tt := tt // Capture range var
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel() // 2. Subtest parallel
            // ... logic
        })
    }
}
```

## Table-Driven Test with Testify

```go
func TestGetOrder(t *testing.T) {
    tests := []struct {
        name    string
        id      string
        want    *Order
        wantErr bool
    }{
        {
            name: "valid order",
            id:   "order-123",
            want: &Order{ID: "order-123", Status: "confirmed"},
        },
        {
            name:    "missing ID returns error",
            id:      "",
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()
            got, err := svc.GetOrder(context.Background(), tt.id)
            if tt.wantErr {
                require.Error(t, err)
                return
            }
            require.NoError(t, err)
            assert.Equal(t, tt.want.ID, got.ID)
        })
    }
}
```


---

## golang-tooling

### golangci

# golangci-lint Configuration Example

```yaml
# .golangci.yml
run:
  timeout: 5m
  modules-download-mode: readonly

linters:
  enable:
    - errcheck
    - staticcheck
    - govet
    - revive
    - gosec
    - goimports
    - unused

linters-settings:
  govet:
    check-shadowing: true
  errcheck:
    check-type-assertions: true
  gosec:
    excludes:
      - G104  # unhandled errors in defer (handled by errcheck)

issues:
  exclude-rules:
    - path: _test\.go
      linters:
        - errcheck
```


---

