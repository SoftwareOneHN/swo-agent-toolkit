---
inclusion: manual
---

# Skills: nestjs

> 21 skills. Load when editing nestjs files.
> For code examples and implementation patterns, load `refs-nestjs.md`.

## Index

# nestjs Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| nestjs-api-standards | `**/*.controller.ts`, `**/*.dto.ts` | ApiResponse, Pagination, TransformInterceptor |
| **nestjs-architecture** | `**/*.module.ts`, `main.ts` | NestFactory, Module, Controller, Injectable |
| **nestjs-bullmq** | `**/*.processor.ts`, `**/*.module.ts`, `**/bull-queue.constants.ts`, `**/redis-throttler*.ts` | queue, background job, worker, processor, bullmq, drainDelay, stalledInterval, removeOnComplete, redis limit, upstash, fail-open, throttler |
| nestjs-caching | `**/*.service.ts`, `**/*.interceptor.ts` | CacheInterceptor, CacheTTL, Redis, stale-while-revalidate |
| nestjs-configuration | `.env`, `app.module.ts`, `**/config.ts` | ConfigModule, Joi, env |
| **nestjs-controllers-services** | `**/*.controller.ts`, `**/*.service.ts` | Controller, Injectable, ExecutionContext, createParamDecorator |
| **nestjs-database** | `**/*.entity.ts`, `prisma/schema.prisma` | TypeOrmModule, PrismaService, MongooseModule, Repository |
| nestjs-deployment | `k8s/**`, `helm/**` | Dockerfile, max-old-space-size, shutdown hooks |
| nestjs-documentation | `main.ts`, `**/*.dto.ts` | DocumentBuilder, SwaggerModule, ApiProperty, ApiResponse |
| nestjs-error-handling | `**/*.filter.ts`, `main.ts` | ExceptionFilter, Catch, HttpException |
| **nestjs-file-uploads** | `**/*.controller.ts` | FileInterceptor, Multer, S3, UploadedFile |
| **nestjs-notification** | `notification.service.ts`, `notification.entity.ts` | notification, push, fcm, alert, reminder |
| nestjs-observability | `main.ts`, `**/*.module.ts` | nestjs-pino, Prometheus, Logger, reqId |
| nestjs-performance | `main.ts` | FastifyAdapter, compression, SINGLETON, REQUEST scope |
| nestjs-real-time | `**/*.gateway.ts`, `**/*.controller.ts`, `Socket.io` | WebSocketGateway, SubscribeMessage, Sse |
| nestjs-scheduling | `**/*.service.ts` | @Cron, CronExpression, ScheduleModule |
| nestjs-search | `**/*.service.ts`, `**/search/**` | Elasticsearch, CQRS, Synchronization |
| **nestjs-security** | `**/*.guard.ts`, `**/*.strategy.ts`, `**/auth/**` | Passport, JWT, AuthGuard, CSRF, Helmet |
| **nestjs-security-isolation** | `src/modules/**`, `SECURITY.md`, `src/migrations/**` | RLS, Row Level Security, childId, isolation, access policy |
| nestjs-testing | `**/*.spec.ts`, `test/**/*.e2e-spec.ts`, `Test.createTestingModule` | supertest, jest, beforeEach |
| **nestjs-transport** | `main.ts`, `**/*.controller.ts`, `Transport.GRPC`, `Transport.RMQ` | MicroserviceOptions |

> Load matched skills: `<SKILLS>/nestjs/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### nestjs-api-standards

---
name: nestjs-api-standards
description: Create standardized API response envelopes, paginated endpoints, and error interceptors in NestJS. Use when implementing response wrappers, pagination DTOs, or global error formats.
metadata:
  triggers:
    files:
    - '**/*.controller.ts'
    - '**/*.dto.ts'
    keywords:
    - ApiResponse
    - Pagination
    - TransformInterceptor
---
# NestJS API Standards & Common Patterns

## **Priority: P1 (OPERATIONAL)**

## Workflow: Standardize API Endpoint

1. **Create Response DTO** — Define dedicated DTO for every endpoint return type.
2. **Map entity to DTO** — Use `plainToInstance(UserResponseDto, user)` in service or controller.
3. **Apply TransformInterceptor** — Bind globally to wrap all responses in `{ statusCode, data, meta }`.
4. **Add nested validation** — Decorate nested DTO properties with `@ValidateNested()` + `@Type()`.
5. **Document with Swagger** — Apply `@ApiResponse({ status, type })` with exact types per endpoint.

## Response Wrapper Example

See [implementation examples](references/implementation.md)

## Entity-to-DTO Mapping Example

See [implementation examples](references/implementation.md)

## Deep Validation (Critical)

- **[Rule] Nested Validation**: Object/array DTO properties require `@ValidateNested()` + `@Type(() => TargetDto)` from `class-transformer`.

## Pagination Standards

- **DTOs**: Use strict `PageOptionsDto` (page/take/order) and `PageDto<T>` (data/meta).
- **Swagger Logic**: Generics require `ApiExtraModels` and schema path resolution.
- **Reference**: See [Pagination Wrapper Implementation](references/pagination-wrapper.md) for complete `ApiPaginatedResponse` decorator code.

## Custom Error Response

- **Standard Error Object**: Define `ApiErrorResponse` with `statusCode`, `message`, `error`, `timestamp`, `path`. See [Error Response Class](references/error-response.md).
- **Docs**: Apply `@ApiBadRequestResponse({ type: ApiErrorResponse })` globally or per controller.

## Anti-Patterns

- **No raw entity returns**: Always map to Response DTO; raw entities leak internal fields.
- **No unvalidated nested DTOs**: Use `@ValidateNested()` + `@Type()` for all nested object properties.
- **No generic 200 docs**: Apply `@ApiResponse({ status, type })` with exact types per endpoint.

## References

- [Pagination Wrapper](references/pagination-wrapper.md)
- [Error Response Class](references/error-response.md)

---

### nestjs-architecture

---
name: nestjs-architecture
description: Design decoupled, testable NestJS module boundaries with feature, core, and shared modules. Use when structuring module imports, creating feature modules, or enforcing separation of concerns in NestJS.
metadata:
  triggers:
    files:
    - '**/*.module.ts'
    - 'main.ts'
    keywords:
    - NestFactory
    - Module
    - Controller
    - Injectable
---
# NestJS Architecture Expert

## **Priority: P0 (CRITICAL)**

Design decoupled, testable modules with clear boundaries.

## Workflow: Create New Feature Module

1. **Generate module** — `nest g module users` creates feature module.
2. **Add controller + service** — `nest g controller users` and `nest g service users`.
3. **Register dependencies** — Import `TypeOrmModule.forFeature([User])` in module.
4. **Validate inputs** — Apply `class-validator` decorators on all DTOs.
5. **Check circular deps** — Run `madge --circular src/` to verify no cycles.

## Module Structure Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Modules**: Feature Modules (Auth) vs Core (Config/DB) vs Shared (Utils).
- **Controllers**: Thin controllers, fat services. Verify DTOs here.
- **Services**: Business logic only. Use Repository pattern for DB.
- **Config**: Use `@nestjs/config`, never `process.env` directly.

## Architecture Checklist (Mandatory)

- [ ] **Circular Deps**: there any circular dependencies? (Use `madge`).
- [ ] **Env Validation**: Joi/Zod schema used for env vars?
- [ ] **Exception Filters**: global filters catching unhandled errors?
- [ ] **DTO Validation**: `class-validator` decorators on all inputs?
- [ ] **Dependency Integrity**: all `@InjectRepository()` or injected services properly registered in module's `imports` (via `TypeOrmModule.forFeature`) or `providers`?

## Anti-Patterns

- **No Global Scope**: Avoid global pipes/guards unless truly universal.
- **No Direct Entity**: Don't return ORM entities; return DTOs.
- **No Business in Controller**: Move logic to Service.
- **No Manual Instantiation**: Use DI, never `new Service()`.

## References

- [Advanced Patterns](references/advanced-patterns.md)
- [Dynamic Modules](references/dynamic-module.md)

---

### nestjs-bullmq

---
name: nestjs-bullmq
description: Implement BullMQ job workflows in NestJS. Use when building queue processors, redis-throttler, Upstash limits, idle polling, stalled jobs, and retention policies.
metadata:
  triggers:
    files:
    - '**/*.processor.ts'
    - '**/*.module.ts'
    - '**/bull-queue.constants.ts'
    - '**/redis-throttler*.ts'
    keywords:
    - queue
    - background job
    - worker
    - processor
    - bullmq
    - drainDelay
    - stalledInterval
    - removeOnComplete
    - redis limit
    - upstash
    - fail-open
    - throttler
---
# NestJS BullMQ Implementation

## **Priority: P0 (Critical)**

## Guidelines

- **Set idle polling**: Add `drainDelay` + `stalledInterval` + `maxStalledCount` to every `@Processor`. Default `drainDelay` (5 ms) burns 570M Redis commands/day at idle. See [patterns.md](references/patterns.md#3-processor-consumer-with-correct-worker-options).
- **Throttle worker error logs**: BullMQ workers emit raw unhandled ReplyErrors on Redis failure (e.g. Upstash rate limits). Always extend `BaseProcessor` instead of `WorkerHost` to rate-limit these logs. See [patterns.md](references/patterns.md#4-base-processor-for-error-rate-limiting).
- **Set job retention**: Add `removeOnComplete`, `removeOnFail`, `attempts`, `backoff` to every `BullModule.registerQueue`. See [patterns.md](references/patterns.md#2-module-registration-with-defaultjoboptions).
- **Use shared constants**: All numeric options live in `src/common/constants/bull-queue.constants.ts`. Key constants: `QUEUE_DRAIN_DELAY_MS` (10 000 ms), `QUEUE_STALLED_INTERVAL_MS` (60 000 ms). Use `getSharedBullQueueOptions` helper for `registerQueue`. Queue/job names go in `{feature}.constants.ts`. Never inline magic numbers.
- **Wrap every `queue.add()`**: Persist DB record first, then enqueue inside try-catch. Redis errors must not surface as 500s. See [patterns.md](references/patterns.md#5-producer-queue-service-with-isolated-queueadd).
- **Throttler fail-open**: `ThrottlerGuard` registered as global `APP_GUARD` — Redis blip propagates errors to ALL HTTP routes. `RedisThrottlerStorage.increment()` must catch all Redis errors and return fail-open pass-through record. Redis blip must not kill all HTTP routes. See [patterns.md](references/patterns.md#6-throttler-fail-open-pattern).
- **Guard new queues**: Follow `isRedisEnabled()` conditional + mock token pattern in every module. NestJS DI throws on startup without mock.
- **Keep processor and cron**: Cron schedules; processor executes. Both always required — they complementary. See [patterns.md](references/patterns.md#7-processor-vs-cron--when-both-exist).
- **Use local Redis in dev**: Never point dev machines at Upstash — idle workers exhaust free tier (500K/day) in minutes.

## Anti-Patterns

- **No bare `@Processor(NAME)`**: Always pass worker options object with `drainDelay` and `stalledInterval`.
- **No bare `WorkerHost` extension**: Always extend `BaseProcessor` instead to intercept and rate-limit worker errors.
- **No `registerQueue` without `defaultJobOptions`**: Omitting causes unbounded Redis memory growth.
- **No inline numbers**: Use `bull-queue.constants.ts` — never write `10_000`, `60_000`, `50`, `20`, `3`, or `5_000` directly.
- **No unguarded `queue.add()`**: Wrap in try-catch; persist DB state first.
- **No throws in throttler increment**: Catch Redis errors; return fail-open record.
- **No missing mock token**: Provide `getQueueToken` mock when `redisEnabled = false`.
- **No removing processor because cron exists**: They serve different roles.
- **No cloud Redis in dev**: Use local Docker Redis.

## References

- [All Code Patterns](references/patterns.md)
- [Evals](evals/evals.json)

---

### nestjs-caching

---
name: nestjs-caching
description: Implement multi-level caching, invalidation patterns, and stampede protection in NestJS. Use when adding Redis caching layers, configuring cache-manager interceptors, implementing stale-while-revalidate, or preventing cache stampedes in NestJS services.
metadata:
  triggers:
    files:
    - '**/*.service.ts'
    - '**/*.interceptor.ts'
    keywords:
    - CacheInterceptor
    - CacheTTL
    - Redis
    - stale-while-revalidate
---
# Caching & Redis Standards

## **Priority: P1 (OPERATIONAL)**


## Caching Strategy

- **Layering**: Use **Multi-Level Caching** for high-traffic read endpoints.
 - **L1 (Local)**: In-Memory (Node.js heap). Ultra-fast, no network. Use `lru-cache` for config/static data.
 - **L2 (Distributed)**: Redis. Shared across pods.
- **Pattern**: Implement **Stale-While-Revalidate** to avoid latency spikes during cache misses.

## NestJS Implementation

- **Library**: Use `cache-manager` with `cache-manager-redis-yet` (recommended over `cache-manager-redis-store` for V4 stability).
- **Interceptors**: Use `@UseInterceptors(CacheInterceptor)` for simple GET responses.
 - **Warning**: Default key URL. Ensure consistent query param ordering or use custom key generators.

See [implementation examples](references/example.md)

## Stampede Protection

- **Jitter**: Add random variance to TTLs to prevent simultaneous expiry across keys.
- **Locking**: One process recomputes while others wait or return stale data.

See [implementation examples](references/example.md)

## Redis Data Structures

- **Hash (`HSET`)**: Store objects (user profiles) with partial update support.
- **Set (`SADD`)**: Unique collections with O(1) membership checks.
- **Sorted Set (`ZADD`)**: Priority queues, leaderboards, rate-limiting windows.

## Invalidation Patterns

- **Tagging**: Use Sets to group cache keys (avoid `KEYS` which O(N) in production).
 - _Create_: `SADD post:1:tags cache:post:1`
 - _Invalidate_: Fetch tags from Set, then `DEL` grouped keys.
- **Event-Driven**: Listen to domain events (`UserUpdated`) to trigger invalidation asynchronously.

## Anti-Patterns

- **No KEYS in production**: Use SET-based tag grouping for cache invalidation; KEYS O(N).
- **No fixed TTLs on grouped caches**: Add jitter (±10s) to prevent simultaneous stampede.
- **No MemoryStorage for multi-pod**: Use Redis store; in-memory cache not shared across pods.

---

### nestjs-configuration

---
name: nestjs-configuration
description: Environment variables validation and ConfigModule setup. Use when validating environment variables with Joi/Zod or configuring ConfigModule in NestJS.
metadata:
  triggers:
    files:
    - '.env'
    - 'app.module.ts'
    - '**/config.ts'
    keywords:
    - ConfigModule
    - Joi
    - env
---
# NestJS Configuration Standards

## **Priority: P1 (OPERATIONAL)**


## Setup

1. **Library**: Use `@nestjs/config`.
2. **Initialization**: Import `ConfigModule.forRoot({ isGlobal: true })` in `AppModule`.

## Validation

- **Mandatory**: Validate environment variables at startup.
- **Tool**: Use `joi` or custom validation class.
- **Effect**: app **must crash** immediately if required env var (e.g., `DB_URL`) missing.

```typescript
// app.module.ts
ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
  }),
});
```

## Usage

- **Injection**: Inject `ConfigService` to access values.
- **Typing**: Avoid magic strings. Use type-safe getter helper or dedicated configuration object/interface.
- **Secrets**: Never commit `.env` files. Add `.env*` to `.gitignore`.

## ⚠️ Adding New Variables

When adding new environment variable to application, you **MUST** update all of following:

1. **`src/config/env.validation.ts`**: Add class property with appropriate `class-validator` decorators.
2. **`.env.example`**: Add placeholder value so other developers know about it.
3. **`.env.development` / `.env.test`**: Add actual development values.
4. **CI/CD Pipelines & Infrastructure**: You **MUST** map new variable in your deployment scripts (e.g., `.github/workflows/*.yml`, `gitlab-ci.yml`, Terraform, or Azure Pipelines). Most modern cloud platforms (Cloud Run, ECS, Kubernetes) require explicit mapping of secrets/env-vars into container runtime. Failure to this will cause production deployment to crash or silently fail.


## Anti-Patterns

- **No unchecked env vars**: Validate all required variables at startup; app must crash if missing.
- **No committed secrets**: Add `.env*` to `.gitignore`; load values via ConfigService only.
- **No new vars without CI/CD update**: Always update `env.validation.ts`, `.env.example`, and pipeline manifests.

---

### nestjs-controllers-services

---
name: nestjs-controllers-services
description: Separate Controllers from Services and build Custom Decorators in NestJS. Use when defining NestJS controllers, services, or custom parameter decorators.
metadata:
  triggers:
    files:
    - '**/*.controller.ts'
    - '**/*.service.ts'
    keywords:
    - Controller
    - Injectable
    - ExecutionContext
    - createParamDecorator
---
# NestJS Controllers & Services Standards

## **Priority: P0 (FOUNDATIONAL)**

## Controllers

- **Role**: Handler only. Delegate **all** logic to Services.
- **Context**: `ExecutionContext` helpers (`switchToHttp()`) for platform-agnostic code.
- **Custom Decorators**:
- **Avoid**: `@Request() req` -> `req.user` (Not type-safe).
- **Pattern**: Create typed decorators like `@CurrentUser()`, `@DeviceIp()`.

```typescript
import { RequestWithUser } from 'src/common/interfaces/request.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
```

## DTOs & Validation

- **Strictness**:
- `whitelist: true`: Strip properties without decorators.
- **Critical**: `forbidNonWhitelisted: true`: Throw error if unknown properties exist.
- **Transformation**:
- `transform: true`: Auto-convert primitives (String '1' -> Number 1) and instantiate DTO classes.
- **Documentation**:
- **Swagger Plugin**: `@nestjs/swagger` CLI plugin in `nest-cli.json` auto-detects DTO properties — no manual `@ApiProperty()`.

## Interceptors (Response Mapping)

- Map responses in **Interceptors**, not Controllers.
- `map()` wraps success responses (e.g. `{ data: T }`).
- See **[API Standards](../nestjs-api-standards/SKILL.md)** for `PageDto` and `ApiResponse`.
- `catchError()` maps low-level errors (DB constraints) to `HttpException` (e.g. `ConflictException`) _before_ global filter.

## Services & Business Logic

- **Singleton**: Default.
- **Stateless**: No request-specific state in class properties unless `Scope.REQUEST`.

## Pipes & Validation

- **Global**: Register `ValidationPipe` globally.
- **Route Params**: Fail fast. Always use `ParseIntPipe`, `ParseUUIDPipe` on all ID parameters.

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { ... }
```

## Lifecycle Events

- **Init**: Use `OnModuleInit` for connection setup.
- **Destroy**: Use `OnApplicationShutdown` for cleanup. (Requires `enableShutdownHooks()`).

## Anti-Patterns

- **No business logic in controllers**: Delegate everything to Services; controllers only parse and respond.
- **No req.user access**: Create typed `@CurrentUser()` decorator instead of accessing raw `req`.
- **No REQUEST scope by default**: Use SINGLETON; it makes entire injection chain request-scoped.

## References

- [Decorator, Pipe & Lifecycle Examples](references/REFERENCE.md)


---

### nestjs-database

---
name: nestjs-database
description: Implement data access patterns, Scaling, Migrations, and ORM selection in NestJS. Use when implementing TypeORM/Prisma repositories, migrations, or database patterns in NestJS.
metadata:
  triggers:
    files:
    - '**/*.entity.ts'
    - 'prisma/schema.prisma'
    keywords:
    - TypeOrmModule
    - PrismaService
    - MongooseModule
    - Repository
---
# NestJS Database Standards

## **Priority: P0 (FOUNDATIONAL)**


## Selection Strategy

See [references/persistence_strategy.md](references/persistence_strategy.md) for database selection matrix and scaling patterns (Connection Pooling, Sharding).

## Patterns

- **Repository Pattern**: Isolate database logic.
 - **TypeORM**: Inject `@InjectRepository(Entity)`.
 - **Prisma**: Create comprehensive `PrismaService`.
- **Abstraction**: Services should call Repositories, not raw SQL queries.

## Configuration (TypeORM)

- **Async Loading**: Always use `TypeOrmModule.forRootAsync` to load secrets from `ConfigService`.
- **Sync**: Set `synchronize: false` in production; use migrations instead.

## Migrations

- **Never** use `synchronize: true` in production.
- **Generation**: Whenever TypeORM entity (`.entity.ts`) modified, migration **MUST** generated using `pnpm migration:generate`.
- **Audit**: Always inspect generated migration file to ensure it matches entity changes before applying.
- **Production Strategies**:
 - **CI/CD Integration (Recommended)**: Run `pnpm migration:run` in pre-deploy or post-deploy job (e.g., GitHub Actions, GitLab CI). Ensure production environment variables correctly set.
 - **Manual SQL (For restricted DB access)**: Use `typeorm migration:show` to get SQL or simply copy `up` method's SQL into management tool (like Supabase SQL Editor). Always track manual runs in `migrations` metadata table.
- **Zero-Downtime**: Use Expand-Contract pattern (Add -> Backfill -> Drop) for destructive changes.
- **Seeding**: Use factories for dev data; only static dicts for prod.

## Best Practices

1. **Pagination**: Mandatory. Use limit/offset or cursor-based pagination.
2. **Indexing**: Define indexes in code (decorators/schema) for frequently filtered columns (`where`, `order by`).
3. **Transactions**: Use `QueryRunner` (TypeORM) or `$transaction` (Prisma) for all multi-step mutations to ensure atomicity.


## Anti-Patterns

- **No synchronize in production**: Use explicit migrations; `synchronize: true` drops and recreates columns.
- **No raw entity returns from services**: Map to DTOs before leaving service layer.
- **No unpaginated list queries**: All list endpoints must implement limit/offset or cursor pagination.

---

### nestjs-deployment

---
name: nestjs-deployment
description: Containerize NestJS apps with multi-stage Docker builds, tune Node.js memory, and implement graceful shutdown hooks. Use when writing Dockerfiles, configuring K8s deployments, or adding shutdown hooks for NestJS.
metadata:
  triggers:
    files:
    - 'k8s/**'
    - 'helm/**'
    keywords:
    - Dockerfile
    - max-old-space-size
    - shutdown hooks
---
# Deployment & Ops Standards

## **Priority: P1 (OPERATIONAL)**


## Workflow: Containerize NestJS App

1. **Write multi-stage Dockerfile** — Build stage installs devDeps and runs `nest build`; run stage copies only `dist` and pruned `node_modules`.
2. **Set non-root user** — Add `USER node` to Dockerfile.
3. **Tune memory** — Set `--max-old-space-size` to ~75% of container memory limit.
4. **Enable shutdown hooks** — Call `app.enableShutdownHooks()` in `main.ts`.
5. **Add K8s pre-stop** — Configure 5-10s sleep pre-stop hook for LB draining.

## Dockerfile Example

See [implementation examples](references/example.md)

## Runtime Tuning (Node.js)

- **Memory Config**: Container memory != Node memory.
 - **Rule**: Explicitly set Max Old Space.
 - **Command**: `node --max-old-space-size=XXX dist/main`
 - **Calculation**: Set to ~75-80% of Kubernetes Limit. (Limit: 1GB -> OldSpace: 800MB).
- **Graceful Shutdown**:
 - **Signal**: Listen to `SIGTERM`.
 - **NestJS**: `app.enableShutdownHooks()` mandatory.
 - **Sleep**: Add "Pre-Stop" sleep in K8s (5-10s) to allow Load Balancer to drain connections before Node process stops accepting traffic.

## Init Patterns

- **Database Migrations**:
 - **Anti-Pattern**: Running migration in `main.ts` on startup.
 - **Pro Pattern**: Use **Init Container** in Kubernetes that runs `npm run typeorm:migration:run` before app container starts.

## Environment Variables & CI/CD

- **CI/CD Pipelines (GitHub, GitLab, Azure, etc.)**:
 - If you modify `src/config/env.validation.ts` to add new environment variable, you **MUST** map it explicitly in your deployment pipeline/infrastructure-as-code.
 - **Platform Context**:
 - **Cloud Run/ECS**: Variables must explicitly passed in service definition.
 - **Kubernetes**: New variables must added to `Deployment` manifest or `ConfigMap`/`Secret`.
 - **Lambda/Serverless**: Must added to `serverless.yml` or provider console.
 - **Fundamental Rule**: Application code configuration changes "breaking changes" for infrastructure layer. Never assume environment inheritance.


## Anti-Patterns

- **No migrations in main.ts**: Use K8s Init Containers or pre-deploy CI steps for migration runs.
- **No root user in Docker**: Always add `USER node` to Dockerfile; running as root security risk.
- **No unbounded Node heap**: Set `--max-old-space-size` to ~75% of container memory limit.

---

### nestjs-documentation

---
name: nestjs-documentation
description: Automate Swagger/OpenAPI documentation and standardize API response schemas in NestJS. Use when generating OpenAPI specs, documenting paginated or generic responses, configuring the Nest CLI Swagger plugin, or publishing versioned API docs.
metadata:
  triggers:
    files:
    - 'main.ts'
    - '**/*.dto.ts'
    keywords:
    - DocumentBuilder
    - SwaggerModule
    - ApiProperty
    - ApiResponse
---
# OpenAPI & Documentation

## **Priority: P2 (MAINTENANCE)**


## Workflow

1. **Enable Swagger plugin** in `nest-cli.json` to auto-generate `@ApiProperty` from DTOs.
2. **Annotate controllers** with `@ApiTags`, `@ApiResponse`, and auth decorators.
3. **Create generic wrappers** for paginated and polymorphic responses.
4. **Generate separate docs** for public vs internal audiences.

## Setup

See [implementation examples](references/example.md) for `nest-cli.json` plugin config and Swagger bootstrap.

## Response Documentation

- **Strictness**: Every controller method must `@ApiResponse({ status: 200, type: UserDto })`.
- **Generic Wrappers**: Define `ApiPaginatedResponse<T>` decorators using `ApiExtraModels` + `getSchemaPath()` to handle generics properly.

## Advanced Patterns

- **Polymorphism**: Use `@ApiExtraModels` and `getSchemaPath` for `oneOf`/`anyOf` union types.
- **File Uploads**: Use `@ApiConsumes('multipart/form-data')` with explicit `@ApiBody` schema.
- **Authentication**: Use `@ApiBearerAuth()` or `@ApiSecurity('api-key')` matching `DocumentBuilder` config.
- **Enums**: Force named enums: `@ApiProperty({ enum: MyEnum, enumName: 'MyEnum' })`.

## Operation Grouping

- **Tags**: Mandatory `@ApiTags('domains')` on every Controller.
- **Multiple Docs**: Generate separate docs for different audiences (Public vs Internal).

See [implementation examples](references/example.md)

## Anti-Patterns

- **No missing @ApiResponse**: Every controller method must declare its response type and status code.
- **No /docs in production**: Disable Swagger in production to prevent API schema exposure.
- **No manual @ApiProperty everywhere**: Use Nest CLI Swagger plugin to auto-generate from DTOs.

---

### nestjs-error-handling

---
name: nestjs-error-handling
description: Implement Global Exception Filters and standard error formats in NestJS. Use when implementing global exception filters or standardizing error responses in NestJS.
metadata:
  triggers:
    files:
    - '**/*.filter.ts'
    - 'main.ts'
    keywords:
    - ExceptionFilter
    - Catch
    - HttpException
---
# NestJS Error Handling Standards

## **Priority: P1 (OPERATIONAL)**


- **Requirement**: Centralize error formatting.
- **Platform Agnostic**: **not** import `Request`/`Response` from Express/Fastify types directly.
 - **Use**: `HttpAdapterHost` to access underlying platform response methods.
 - `const { httpAdapter } = this.httpAdapterHost;`
- **Structure**:
 - Implement strictly typed error responses.
 - Refer to **[API Standards](../nestjs-api-standards/SKILL.md)** for `ApiErrorResponse`.

 ```json
  {
    "statusCode": 400,
    "message": "Validation failed",
    "error": "Bad Request",
    "timestamp": "ISO...",
    "path": "/users"
  }
  ```

## Error Flow

1. **Service**: Throws specific or generic errors (e.g., `EntityNotFoundError`).
2. **Interceptor**: Maps low-level errors to HTTP Exceptions (e.g., `catchError(err => throw new NotFoundException())`).
 - _Why_: Keeps Exception Filters focused on formatting, not business logic interpretation.
3. **Global Filter**: Formats final JSON response.

## Built-in Exceptions

- **Use**: Throw `NotFoundException`, `ForbiddenException`, `BadRequestException`.
- **Custom**: Extend `HttpException` only for domain-specific failures that need specific status codes.

## Logging

- **Context**: Always pass `MyClass.name` to `Logger` constructor.
- **Levels**:
 - `error`: 500s (Stack trace required).
 - `warn`: 400s (Client errors).

## Security (Information Leakage)

- **Production**: **NEVER** expose stack traces in HTTP responses (`process.env.NODE_ENV === 'production'`).
- **Sanitization**: Ensure `ApiException` payloads not leak internal file paths or raw variable dumps.


## Anti-Patterns

- **No stack traces in production**: Gate stack exposure behind `NODE_ENV === 'production'` check.
- **No Express types in filters**: Use `HttpAdapterHost` for platform-agnostic error handling.
- **No HttpException in services**: Throw domain errors in services; let Interceptors map to HTTP exceptions.

---

### nestjs-file-uploads

---
name: nestjs-file-uploads
description: Validate and stream file uploads securely with Validation and S3 streaming in NestJS. Use when implementing secure file uploads, validation, or S3 streaming in NestJS.
metadata:
  triggers:
    files:
    - '**/*.controller.ts'
    keywords:
    - FileInterceptor
    - Multer
    - S3
    - UploadedFile
---
# File Upload Patterns

## **Priority: P0 (FOUNDATIONAL)**

- **Magic Bytes**: NEVER trust `content-type` header or file extension.
 - **Tool**: Use `file-type` or `mmmagic` to verify actual buffer signature.
- **Limits**: Set strict `limits: { fileSize: 5000000 }` (5MB) in Multer config to prevent DoS.

## Streaming (Scalability)

- **Memory Warning**: Default Multer `MemoryStorage` crashes servers with large files.
- **Pattern**: Use **Streaming** for any file > 10MB.
 - **Library**: `multer-s3` (direct upload to bucket) or `busboy` (raw stream processing).
 - **Architecture**:
 1. Client requests Signed URL from API.
 2. Client uploads directly to S3/GCS (Bypassing API server completely).
 3. **Pro Tip**: Only approach to scale file uploads infinitely.

## Processing

- **Async**: Don't process images/videos in HTTP Request.
- **Flow**:
 1. Upload file.
 2. Push `FileUploadedEvent` to Queue (BullMQ).
 3. Worker downloads, resizes/converts, and re-uploads.

## Anti-Patterns

- **No content-type trust**: Always verify file magic bytes; MIME header can spoofed.
- **No MemoryStorage for large files**: Use streaming or signed URL pattern for files > 10MB.
- **No synchronous file processing**: Offload image/video work to BullMQ workers via FileUploadedEvent.

## References

---

### nestjs-notification

---
name: nestjs-notification
description: Build dual-write notification services with database persistence and FCM push delivery in NestJS. Use when creating notification entities, sending push via FCM, or implementing in-app notification feeds.
metadata:
  triggers:
    files:
    - 'notification.service.ts'
    - 'notification.entity.ts'
    keywords:
    - notification
    - push
    - fcm
    - alert
    - reminder
---
# NestJS Notification Architecture

## **Priority: P0 (Standard)**

Implement "Dual-Write" notification system: persist to Database (In-App) and send via FCM (Push).

## Workflow: Send Notification

1. **Save to database** — Persist notification entity with type enum and metadata.
2. **Check FCM token** — Verify recipient valid `fcmToken`; skip push if missing.
3. **Send push** — Call FCM inside `try/catch`; never let FCM failure block request.
4. **Serialize data** — Convert Dates to ISO strings; keep FCM `data` payload flat (IDs only).

## Dual-Write Service Example

See [implementation examples](references/implementation.md)

## Structure

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Use Dual-Write**: Save to DB _first_, then attempt FCM. Catch FCM errors so they don't block logic.
- **Define Granular Types**: Use `NotificationType` Enum (e.g., `APPOINTMENT_REMINDER`) for frontend icon/color logic.
- **Stringify Metadata**: Store routing data (IDs) as JSON string in DB, but Map to string-only Key-Values for FCM `data`.
- **Handle Tokens**: Check for `fcmToken` existence before sending. Fail gracefully if missing.
- **Serialize Dates**: Convert Dates to ISO strings before sending to FCM.

## Anti-Patterns

- **No Generic Types**: Avoid `type: string`. Always use Enum.
- **No Blocking FCM**: Never `await` FCM without `try/catch`. It shouldn't crash request.
- **No Complex Data in Push**: Keep FCM `data` payload flat and minimal (IDs only). Fetch details on open.

## References

- [Service Pattern (Dual-Write)](references/service.md)
- [Type Definitions](references/types.md)

---

### nestjs-observability

---
name: nestjs-observability
description: Configure structured logging with Pino, Prometheus metrics, and health checks for NestJS services. Use when adding JSON logging, request tracing with correlation IDs, Prometheus metric endpoints, or liveness/readiness health checks.
metadata:
  triggers:
    files:
    - 'main.ts'
    - '**/*.module.ts'
    keywords:
    - nestjs-pino
    - Prometheus
    - Logger
    - reqId
---
# Observability Standards

## **Priority: P1 (OPERATIONAL)**


## Structured Logging (Pino)

Use `nestjs-pino` for high-performance, async JSON logging. Node's `console.log` blocking and unstructured.

See [implementation examples](references/example.md)

## Tracing (Correlation)

- **Request ID**: Every log line **must** include `reqId`. `nestjs-pino` handles this via `AsyncLocalStorage`.
- **Propagation**: Pass `x-request-id` to downstream microservices and database queries for end-to-end tracing.

## Metrics

Expose `/metrics` for Prometheus scraping using `@willsoto/nestjs-prometheus`.

See [implementation examples](references/example.md)

## Health Checks

- **Terminus**: Implement "Liveness" (I'm alive) vs "Readiness" (I can take traffic).
 - **DB Check**: `TypeOrmHealthIndicator` / `PrismaHealthIndicator`.
 - **Memory Check**: Fail readiness if Heap > 300MB to prevent crash loops.

## Performance Headers (Dev Only)

- `X-Response-Duration-Ms`, `X-DB-Execution-Ms`, `X-API-Overhead-Ms`
- Gate behind `ENABLE_PERFORMANCE_BENCHMARK` feature flag; never expose in production.

## Anti-Patterns

- **No console.log**: Use nestjs-pino for async, structured, JSON-formatted logging.
- **No missing reqId**: Propagate `x-request-id` header to all downstream services and queries.
- **No perf data in production by default**: Gate benchmarking behind `ENABLE_PERFORMANCE_BENCHMARK` flag.

---

### nestjs-performance

---
name: nestjs-performance
description: Optimize NestJS throughput with Fastify adapter, singleton scope enforcement, compression, and query projections. Use when switching to Fastify, diagnosing request-scoped bottlenecks, or profiling API overhead.
metadata:
  triggers:
    files:
    - 'main.ts'
    keywords:
    - FastifyAdapter
    - compression
    - SINGLETON
    - REQUEST scope
---
# Performance Tuning

## **Priority: P1 (OPERATIONAL)**


## Workflow: Performance Audit

1. **Switch to Fastify** — Replace Express with `FastifyAdapter` for ~2x throughput.
2. **Enable compression** — Add Gzip/Brotli middleware.
3. **Audit provider scopes** — Ensure no unintended `REQUEST` scope chains.
4. **Add query projections** — Use `select: []` on all repository queries.
5. **Profile overhead** — Benchmark Total Duration, DB Execution, and API Overhead.

## Fastify + Compression Setup

See [implementation examples](references/example.md)

- **Keep-Alive**: Configure `http.Agent` keep-alive settings to reuse TCP connections for upstream services.

## Scope & Dependency Injection

- **Default Scope**: Adhere to `SINGLETON` scope (default).
- **Request Scope**: AVOID `REQUEST` scope unless absolutely necessary.
 - **Pro Tip**: single request-scoped service makes its entire injection chain request-scoped.
 - **Solution**: Use **Durable Providers** (`durable: true`) for multi-tenancy.
- **Lazy Loading**: Use `LazyModuleLoader` for heavyweight modules (e.g., Admin panels).

## Caching Strategy

- **Application Cache**: Use `@nestjs/cache-manager` for computation results.
 - **Deep Dive**: See **[Caching & Redis](../nestjs-caching/SKILL.md)** for L1/L2 strategies and Invalidation patterns.
- **HTTP Cache**: Set `Cache-Control` headers for client-side caching (CDN/Browser).
- **Distributed**: In microservices, use Redis store, not memory store.

## Queues & Async Processing

- **Offloading**: Never block HTTP request for long-running tasks (Emails, Reports, webhooks).
- **Tool**: Use `@nestjs/bull` (BullMQ) or RabbitMQ (`@nestjs/microservices`).
 - **Pattern**: Producer (Controller) -> Queue -> Consumer (Processor).

## Serialization

- **Warning**: `class-transformer` CPU expensive.
- **Optimization**: For high-throughput READ endpoints, consider manual mapping or using `fast-json-stringify` (built-in fastify serialization) instead of interceptors.

## Database Tuning

- **Projections**: Always use `select: []` to fetch only needed columns.
- **N+1**: Prevent N+1 queries by using `relations` carefully or `DataLoader` for Graph/Field resolvers.
- **Connection Pooling**: Configure pool size (e.g., `pool: { min: 2, max: 10 }`) in config to match DB limits.

## Profiling & Scaling

- **API Overhead vs DB Execution**: Use "Execution Bucket" strategy to continuously benchmark `Total Duration`, `DB Execution Time`, and `API Overhead`.
 - **Total Baseline**: Excellent (< 50ms), Acceptable (< 200ms), Poor (> 500ms). _Exception: Authentication routes (e.g. bcrypt/argon2) should take 300-500ms intentionally._
 - **DB Execution Baseline**: Excellent (< 5ms), Acceptable (< 30ms), Poor (> 100ms - implies missing index or N+1 problem).
 - **API Overhead Baseline**: Excellent (< 20ms), Poor (> 100ms - implies heavy synchronous processing or serialization blocking Node's event loop).
- **Offloading**: Move CPU-heavy tasks (Image processing, Crypto) to `worker_threads`.
- **Clustering**: For non-containerized environments, use `ClusterModule` to utilize all CPU cores. In K8s, prefer ReplicaSets.


## Anti-Patterns

- **No REQUEST scope without evaluation**: One REQUEST-scoped provider makes entire chain request-scoped.
- **No CPU tasks in HTTP handler**: Offload image/crypto work to `worker_threads` or BullMQ.
- **No unprojected queries**: Always `select: []` needed columns to avoid serializing unused data.

---

### nestjs-real-time

---
name: nestjs-real-time
description: Implement WebSocket gateways with Socket.io and Server-Sent Events endpoints in NestJS. Use when building chat features, live feeds, or choosing between WebSocket and SSE for real-time communication.
metadata:
  triggers:
    files:
    - '**/*.gateway.ts'
    - '**/*.controller.ts'
    - 'Socket.io'
    keywords:
    - WebSocketGateway
    - SubscribeMessage
    - Sse
---
# Real-Time & WebSockets

## **Priority: P1 (OPERATIONAL)**


## Workflow: Add Real-Time Feature

1. **Choose protocol** — WebSocket for bi-directional (chat, collab); SSE for uni-directional (feeds, notifications).
2. **Implement gateway or SSE** — Create `@WebSocketGateway()` or `@Sse()` controller.
3. **Add auth** — Validate JWT in `handleConnection()` for WebSocket; use standard guards for SSE.
4. **Scale** — Add `@socket.io/redis-adapter` for multi-pod WebSocket; use HTTP/2 for SSE.
5. **Test connections** — Verify WebSocket handshake auth rejects invalid tokens; confirm SSE streams data.

## SSE Endpoint Example

See [implementation examples](references/example.md)

## WebSocket Gateway with Auth Example

See [implementation examples](references/example.md)

## Protocol Selection

- **WebSockets (Bi-directional)**: Use for Chat, Multiplayer Games, Collaborative Editing.
 - _High Complexity_: Requires custom scaling (Redis Adapter) and sticky sessions (sometimes).
- **Server-Sent Events (SSE) (Uni-directional)**: Use for Notifications, Live Feeds, Tickers, CI Log streaming.
 - _Low Complexity_: Standard HTTP. Works with standard Load Balancers. Easy to secure.
 - _NestJS_: Use `@Sse('route')` returning `Observable<MessageEvent>`.
- **Long Polling**: Use **only** as fallback or for extremely low-frequency updates (e.g., job status check every 10m).
 - _Impact_: High header overhead. Blocks threads if not handled carefully.

## WebSockets Implementation

- **Socket.io**: Default choice. Features "Rooms", "Namespaces", and automatic reconnection. Heavy protocol.
- **Fastify/WS**: Use `ws` adapter if performance critical (e.g., high-frequency trading updates) and you don't need "Rooms" logic.

## Scaling (Critical)

- **WebSockets**: In K8s, client connects to Pod . If Pod B emits event, client won't receive it.
 - **Solution**: **Redis Adapter** (`@socket.io/redis-adapter`). Every pod publishes to Redis; Redis distributes to all other pods.
- **SSE**: Stateless. No special adapter needed, but aware of **Connection Limits** (6 concurrent connections per domain in HTTP/1.1; virtually unlimited in HTTP/2).
 - **Rule**: Must use **HTTP/2** for SSE at scale.

## Security

- **Handshake Auth**: Standard HTTP Guards don't trigger on Ws connection efficiently.
 - **Pattern**: Validate JWT during `handleConnection()` lifecycle method. Disconnect immediately if invalid.
- **Rate Limiting**: Sockets expensive. Apply strict throttling on "Message" events to prevent flooding.

## Architecture

- **Gateway != Service**: `WebSocketGateway` should **only** handle client comms (Join Room, Ack message).
 - **Rule**: Delegate business logic to Service or Command Bus.
- **Events**: Use `AsyncApi` or `SocketApi` decorators (from community packages) to document WS events similarly to OpenAPI.


## Anti-Patterns

- **No HTTP guards for WebSocket auth**: Validate JWT in `handleConnection()`; HTTP guards don't trigger on WS.
- **No WebSocket at scale without Redis adapter**: Without `@socket.io/redis-adapter`, cross-pod events lost.
- **No SSE over HTTP/1.1 at scale**: Use HTTP/2 to avoid 6-connection-per-domain browser limit.

---

### nestjs-scheduling

---
name: nestjs-scheduling
description: Implement distributed cron jobs with Redis-based locking and BullMQ offloading in NestJS. Use when adding @Cron scheduled tasks, preventing duplicate runs across pods, or delegating heavy work to queue workers.
metadata:
  triggers:
    files:
    - '**/*.service.ts'
    keywords:
    - "@Cron"
    - CronExpression
    - ScheduleModule
---
# Task Scheduling & Jobs

## **Priority: P1 (OPERATIONAL)**


## Workflow: Add Scheduled Task

1. **Register ScheduleModule** — Import `ScheduleModule.forRoot()` in AppModule.
2. **Create cron handler** — Decorate service method with `@Cron(CronExpression.*)`.
3. **Add distributed lock** — Apply Redis lock decorator to prevent multi-pod duplication.
4. **Offload heavy work** — Push job IDs to BullMQ; let workers process them.
5. **Wrap in try/catch** — Uncaught exceptions in cron handlers crash entire Node process.
6. **Verify** — Test with 2+ instances to confirm only one acquires lock.

## Problem & Solution

- **Problem**: `@Cron()` runs on **every** instance. In K8s with 3 pods, your "Daily Report" runs 3 times.
- **Solution**: **Distributed Locking** using Redis.
 - **Pattern**: Using decorator to wrap cron method.
 - **Logic**: `SET resource_name my_random_value NX PX 30000` (Redis Atomic Set).

## Cron Decorator Pattern

- **Implementation**:

 See [implementation examples](references/example.md)

- **Tools**: Use `nestjs-redlock` or custom Redis wrapper via `redlock` library.

## Cron-to-Queue Offload

See [implementation examples](references/example.md)

## Job Robustness

- **Isolation**: Never perform heavy processing inside Cron handler.
 - **Pattern**: Cron -> Push Job ID to Queue (BullMQ) -> Worker processes it.
 - **Why**: Cron schedulers can get blocked by Event Loop; Workers scalable.
- **Error Handling**: Wrap ALL cron logic in `try/catch`. Uncaught exceptions in Cron job can crash entire Node process.


## Anti-Patterns

- **No unguarded cron logic**: Always wrap in `try/catch`; uncaught exceptions crash entire Node process.
- **No direct cron processing**: Push to BullMQ queue; workers scalable, cron handlers not.
- **No bare @Cron in multi-pod**: Use distributed locking (redlock) to prevent duplicate concurrent runs.

---

### nestjs-search

---
name: nestjs-search
description: Integrate Elasticsearch and implement search index Sync patterns in NestJS. Use when integrating Elasticsearch or implementing search index sync in NestJS.
metadata:
  triggers:
    files:
    - '**/*.service.ts'
    - '**/search/**'
    keywords:
    - Elasticsearch
    - CQRS
    - Synchronization
---
# Search Engine & Full-Text

## **Priority: P1 (OPERATIONAL)**

- **Pattern**: **CQRS (Command Query Responsibility Segregation)**.
 - **Write**: To Primary Database (Postgres/MySQL). Source of Truth.
 - **Read (Complex)**: To Search Engine (Elasticsearch, OpenSearch, MeiliSearch). Optimized for filtering, fuzzy search, and aggregation.

## Synchronization ( Hard Part)

- **Dual Write (Anti-Pattern)**: `await db.save(); await es.index();`.
 - _Why_: Partial failures leave data inconsistent. Slows down HTTP response.
- **Event-Driven (Recommended)**:
 1. Service writes to DB.
 2. Service emits `EntityUpdated`.
 3. Event Handler (Async) pushes to Queue (BullMQ).
 4. Worker indexes document to Search Engine with retries.
- **CDC (Golden Standard)**: Change Data Capture (Debezium). Connects directly to DB transaction log. No app conceptual overhead, but higher ops complexity.

## Organization

- **Module**: Encapsulate client in `SearchModule`.
- **Abstraction**: Create generic `SearchService<T>` helpers.
 - `indexDocument(id, body)`
 - `search(query, filters)`
- **Mapping**: Use `class-transformer` to map Entities to "Search Documents". Keep docs flatter than relational entities.

## Testing

- **E2E**: not mock search engine in critical E2E flows.
- **Docker**: Spin up `elasticsearch:8` container in test harness to verify indexing works.

## Anti-Patterns

- **No dual writes to DB + ES**: Use event-driven or CDC pattern; dual writes risk partial failure inconsistency.
- **No Elasticsearch for structured queries**: Use DB indexes for filtering; ES for full-text and complex search.
- **No ES mocks in E2E search tests**: Spin up `elasticsearch:8` container to verify indexing behavior accurately.

---

### nestjs-security

---
name: nestjs-security
description: Implement JWT authentication, RBAC guards, Helmet hardening, and Argon2 hashing in NestJS. Use when adding auth strategies, role-based access control, CSRF protection, or security headers.
metadata:
  triggers:
    files:
    - '**/*.guard.ts'
    - '**/*.strategy.ts'
    - '**/auth/**'
    keywords:
    - Passport
    - JWT
    - AuthGuard
    - CSRF
    - Helmet
---
# NestJS Security Standards

## **Priority: P0 (CRITICAL)**

## Workflow: Secure NestJS Application

1. **Add Helmet** — `app.use(helmet())` in `main.ts` for HSTS, CSP headers.
2. **Configure JWT strategy** — Use `passport-jwt` with RS256; validate `iss` and `aud` claims.
3. **Bind global AuthGuard** — Register as `APP_GUARD`; use `@Public()` for open routes.
4. **Add throttling** — Enable `@nestjs/throttler` with Redis store for rate limiting.
5. **Hash with Argon2id** — Replace bcrypt with `argon2.hash(password, { type: argon2.argon2id })`.
6. **Verify** — Run `npm audit --prod` and test that unauthenticated requests return 401.

## Global Auth Guard Example

See [implementation examples](references/implementation.md)

## Argon2id Hashing Example

See [implementation examples](references/implementation.md)

## Authentication (JWT)

- **Strategy**: Use `@nestjs/passport` with `passport-jwt`.
- **Algorithm**: Enforce `RS256` (preferred) or `HS256`. **Reject `none`**.
- **Claims**: Validate `iss` and `aud`.
- **Tokens**: Short access (15m), Long httponly refresh (7d).
- **MFA**: Require 2FA for admin panels.

## Authorization (RBAC)

- **Deny by default**: Bind `AuthGuard` globally (APP_GUARD).
- **Bypass**: Create `@Public()` decorator for open routes.
- **Roles**: Use `Reflector.getAllAndOverride` for Method/Class merge.

## Cryptography

- **Hashing**: Use **Argon2id**, not Bcrypt. See [implementation](references/implementation.md).
- **Encryption**: Use **AES-256-GCM** with KMS rotation. See [implementation](references/implementation.md).

## Hardening

- **Helmet**: Mandatory. Enable HSTS, CSP.
- **CORS**: Explicit origins only. No `*`.
- **Throttling**: Use Redis-backed `@nestjs/throttler` in production.
- **CSRF**: Required for cookie-based auth. See [implementation](references/implementation.md).

## Data Protection

- **Sanitization**: Use `ClassSerializerInterceptor` + `@Exclude()`.
- **Validation**: `ValidationPipe({ whitelist: true })` to prevent mass assignment.
- **Audit**: Log mutations (Who, What, When). See [implementation](references/implementation.md).

## Secrets Management

- **CI/CD**: Run `npm audit --prod` in pipelines.
- **Runtime**: Inject via vault (AWS Secrets Manager / HashiCorp Vault), not `.env`.

## Anti-Patterns

- **No Shadow APIs**: Audit routes regularly; disable `/docs` in production.
- **No SSRF**: Allowlist domains for all outgoing HTTP requests.
- **No SQLi**: Use ORM; avoid raw `query()` with string concatenation.
- **No XSS**: Sanitize HTML input with `dompurify`.

## References

- [Implementation Examples](references/implementation.md)
- [common/security-standards](../../common/common-security-standards/SKILL.md)

---

### nestjs-security-isolation

---
name: nestjs-security-isolation
description: Enforce multi-tenant isolation and PostgreSQL Row Level Security in NestJS. Use when enforcing tenant isolation or PostgreSQL RLS in NestJS multi-tenant apps.
metadata:
  triggers:
    files:
    - 'src/modules/**'
    - 'SECURITY.md'
    - 'src/migrations/**'
    keywords:
    - RLS
    - Row Level Security
    - childId
    - isolation
    - access policy
---
## **Priority: P0 (CRITICAL)**

Strict multi-tenant isolation. All child-centric data must secured via PostgreSQL RLS and service-level validation.

## RLS Enforcement Workflow

1. **Migration**: Create tables with `ENABLE ROW LEVEL SECURITY`. Define policies using `current_setting('app.current_user_id')`.
2. **Entity Logic**: Add `@Security` JSDoc to entity class.
3. **Security Doc**: Update `SECURITY.md` with new table and its access logic.
4. **Service Validation**: Call `childrenService.validateChildAccess(childId, userId)` before any persistence operation.

## Core Guidelines

1. **Mandatory RLS**: Every new table linking to `child` or `family` MUST RLS enabled in its creation migration.
2. **Centralized Validation**: Never reimplement access logic. Use `ChildrenService` for child/family membership checks.
3. **Traceable Security**: `SECURITY.md` source of truth. Any change to RLS policies must reflected there immediately.
4. **Nested Route Constraint**: Data isolation enforced at controller level via nested routes: `/children/:childId/...`.
5. **No Direct Entity exposure**: Use Response DTOs to prevent leaking internal database IDs or metadata that could bypass security filters.

## Anti-Patterns

- **No Public Tables**: Don't create child-linked tables without RLS.
- **No Manual Policy Checks**: Don't write raw SQL access checks in services. Use centralized validator.
- **No Stale Docs**: Don't merge RLS changes without updating `SECURITY.md` and entity JSDoc.
- **No Root IDs**: Don't use `/domain/:id` for child data. Always scope by `:childId`.

## References

- [Implementation Patterns](references/implementation-patterns.md)
- [RLS Migration Patterns](references/rls-patterns.md)
- [Centralized Auth Logic](references/auth-logic.md)

---

### nestjs-testing

---
name: nestjs-testing
description: Write Unit and E2E tests with Jest, mocking strategies, and database isolation in NestJS. Use when writing NestJS unit tests, E2E tests with supertest, or mock providers.
metadata:
  triggers:
    files:
    - '**/*.spec.ts'
    - 'test/**/*.e2e-spec.ts'
    - 'Test.createTestingModule'
    keywords:
    - supertest
    - jest
    - beforeEach
---
# NestJS Testing

## **Priority: P2 (MAINTENANCE)**

## Structure

```
src/**/*.spec.ts      # Unit tests (isolated logic)
test/**/*.e2e-spec.ts # E2E tests (full app flows)
```

## Unit Testing

- **Setup**: Use `Test.createTestingModule()` with mocked providers
- **Mocks**: Mock all dependencies via `{ provide: X, useValue: mockX }`
- **Pattern**: AAA (Arrange-Act-Assert)
- **Cleanup**: Call `jest.clearAllMocks()` in `afterEach`

## E2E Testing

- **Database**: Use real test DB (Docker). Never mock DB in E2E.
- **Cleanup**: Mandatory. Use transaction rollback or `TRUNCATE` in `afterEach`.
- **App Init**: Create app in `beforeAll`, close in `afterAll`
- **Guards**: Override via `.overrideGuard(X).useValue({ canActivate: () => true })`

## Strict TypeScript (MANDATORY)

- **No `any`**: Use typed objects, `jest.Mocked<T>`, or `as unknown as T`. Never `as any`.
- **No `eslint-disable`**: Fix underlying type issue. No exceptions.
- **Verify DTO shapes**: Read actual DTO class before writing mock data.
- **Cast Jest matchers**: Nested `expect.anything()` → `expect.anything() as unknown`.
- **No unused vars**: Only declare variables if referenced in assertions or setup.

## Anti-Patterns

- **No Private Tests**: Test via public methods, not `service['privateMethod']`.
 When coverage requires it, use typed helper (see strict-typescript reference).
- **No DB Mocks in E2E**: Use real DB with cleanup. Mocks defeat E2E purpose.
- **No Shared State**: Call `jest.clearAllMocks()` in `afterEach`. Random failures otherwise.
- **No Resource Leaks**: Always close app and DB in `afterAll`.

## References

Setup examples, mocking patterns, E2E flows, test builders, coverage config:
[references/patterns.md](references/patterns.md)

Strict-TypeScript patterns (Jest matchers, mock typing, DTO verification):
[references/strict-typescript-testing.md](references/strict-typescript-testing.md)

---

### nestjs-transport

---
name: nestjs-transport
description: Configure gRPC, RabbitMQ, and monorepo contract patterns for NestJS microservices. Use when setting up gRPC service-to-service calls, RabbitMQ event-driven messaging, shared contract libraries, or microservice exception handling in NestJS.
metadata:
  triggers:
    files:
    - 'main.ts'
    - '**/*.controller.ts'
    - 'Transport.GRPC'
    - 'Transport.RMQ'
    keywords:
    - MicroserviceOptions
---
# Microservices & Transport Standards

## **Priority: P0 (FOUNDATIONAL)**


- **Synchronous (RPC)**: Use **gRPC** for low-latency, internal service-to-service calls (10x faster than REST/JSON).
- **Asynchronous (Events)**: Use **RabbitMQ** or **Kafka** for decoupling domains via fire-and-forget (`emit()`).

## gRPC Setup

See [implementation examples](references/example.md)

## RabbitMQ Setup

See [implementation examples](references/example.md)

## Monorepo Contracts

- Store all DTOs, `.proto` files, and Interfaces in `libs/contracts`.
- Services never import from sibling services — only from `contracts`.
- Semantic versioning of messages mandatory. Never change field type; add new field.

## Exception Handling

Standard `HttpException` lost over RPC/TCP. Use `RpcException` with global filters:

See [implementation examples](references/example.md)

## Serialization

- Apply `useGlobalPipes(new ValidationPipe({ transform: true }))` in `MicroserviceOptions` setup, not HTTP.

## Anti-Patterns

- **No cross-service imports**: Services must import only from `libs/contracts`, never from sibling services.
- **No HttpException in RPC**: Use `RpcException` with global `RpcExceptionFilter` for microservice errors.
- **No unversioned message schema**: Add new fields; never change existing field types — consumers will break.

---

