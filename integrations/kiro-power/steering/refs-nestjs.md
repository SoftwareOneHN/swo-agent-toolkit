---
inclusion: manual
---

# References: nestjs

> 27 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-nestjs.md`.

## nestjs-api-standards

### error-response

# ApiErrorResponse Class

Standard error response DTO. Apply globally via `@ApiBadRequestResponse({ type: ApiErrorResponse })`.

```typescript
export class ApiErrorResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;
}
```


---

### implementation

# nestjs-api-standards Implementation Examples

## Inline Examples

```typescript
// transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
        meta: {},
      })),
    );
  }
}
```

```typescript
// users.controller.ts
@Get(':id')
async findOne(@Param('id') id: string): Promise<UserResponseDto> {
  const user = await this.usersService.findOne(id);
  return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
}
```


---

### pagination-wrapper

# NestJS API Standards Patterns

## Generic Response & Pagination

This reference implements the standard `PageDto`, `PageMetaDto`, and the `ApiPaginatedResponse` decorator for Swagger.

### Page Options DTO

Standard query parameters for list endpoints.

```typescript
// dtos/page-options.dto.ts
export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
```

### Page DTO

Generic wrapper for paginated data.

```typescript
// dtos/page.dto.ts
export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
```

### Swagger Decorator

Magical decorator to expose `PageDto<UserDto>` correctly in Swagger UI.

```typescript
// decorators/api-paginated-response.decorator.ts
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, model),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
```


---

## nestjs-architecture

### advanced-patterns

# NestJS Advanced Architecture Patterns

## Dynamic Modules

Use `ConfigurableModuleBuilder` to standardise `forRoot`, `register`, and `forFeature` methods.

- `forRoot`: Global (DB, Global Config).
- `register`: Local/Instance configuration.
- `forFeature`: Extending existing modules with entities/providers.

## Advanced Providers

- **Factory Providers**: `useFactory` for async initialization or configuration-dependent logic.
- **Aliasing**: `useExisting` to abstract implementations or provide compatibility.

## Scopes & Lifecycle (Performance)

- **Request Scope (`Scope.REQUEST`)**: Bubbles up to controllers. Use sparingly due to re-instantiation overhead.
- **Durable Providers**: Use `durable: true` in multi-tenant apps to keep performance high while isolating contexts.
- **Graceful Shutdown**: Always call `app.enableShutdownHooks()` in `main.ts` to handle `SIGTERM`.

## Reliability

- **Health Checks**: Use `@nestjs/terminus` for `/health` endpoints (DB, Redis, Disk).
- **Structured Logging**: Use `nestjs-pino` for JSON logs with Request ID correlation.


---

### dynamic-module

# Dynamic Module Builder Reference

## Overview

The `ConfigurableModuleBuilder` drastically reduces the boilerplate required to create typed `forRoot` / `register` methods for dynamic modules.

## Implementation

```typescript
// 1. definition.ts
import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface MyModuleOptions {
  apiKey: string;
  isGlobal?: boolean;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<MyModuleOptions>()
    .setClassMethodName('forRoot') // or 'register'
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();

// 2. my.module.ts
import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './definition';
import { MyService } from './my.service';

@Module({
  providers: [MyService],
  exports: [MyService],
})
export class MyModule extends ConfigurableModuleClass {}

// 3. usage (AppModule)
@Module({
  imports: [
    MyModule.forRoot({
      apiKey: 'secret',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```


---

### implementation

# nestjs-architecture Implementation Examples

## Inline Examples

```typescript
// users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // expose to other modules
})
export class UsersModule {}
```


---

## nestjs-bullmq

### patterns

# BullMQ Implementation Patterns

> All examples follow the conventions enforced by the SKILL.md rules.  
> Import numeric options from `src/common/constants/bull-queue.constants.ts` — never inline them.

---

## 0. Shared Constants (`bull-queue.constants.ts`)

This file is the **single source of truth** for all BullMQ numeric options. It lives in `src/common/constants/` and is imported by every processor and module.

```typescript
// src/common/constants/bull-queue.constants.ts
import { RegisterQueueOptions } from '@nestjs/bullmq';

/** Milliseconds between Redis polls when the queue is empty (BullMQ default: 5 ms).
 *  5 ms = ~200 polls/sec = ~570M Redis commands/day at idle. Use 10 000 ms. */
export const QUEUE_DRAIN_DELAY_MS = 10_000;

/** Milliseconds between stalled-job sweeps (BullMQ default: 5 000 ms). */
export const QUEUE_STALLED_INTERVAL_MS = 60_000;

/** Max times a job can stall before being permanently failed. */
export const QUEUE_MAX_STALLED_COUNT = 1;

/** Completed jobs retained in Redis per queue (prevents unbounded growth). */
export const QUEUE_REMOVE_ON_COMPLETE = 50;

/** Failed jobs retained in Redis per queue. */
export const QUEUE_REMOVE_ON_FAIL = 20;

/** Job attempts before permanent failure. */
export const QUEUE_JOB_ATTEMPTS = 3;

/** Initial delay (ms) for exponential-backoff retries. */
export const QUEUE_BACKOFF_DELAY_MS = 5_000;

export const SHARED_BULL_DEFAULT_JOB_OPTIONS = {
  removeOnComplete: QUEUE_REMOVE_ON_COMPLETE,
  removeOnFail: QUEUE_REMOVE_ON_FAIL,
  attempts: QUEUE_JOB_ATTEMPTS,
  backoff: { type: 'exponential', delay: QUEUE_BACKOFF_DELAY_MS },
};

export function getSharedBullQueueOptions(name: string): RegisterQueueOptions {
  return {
    name,
    defaultJobOptions: SHARED_BULL_DEFAULT_JOB_OPTIONS,
  };
}
```

---

## 1. Module Constants (`{feature}.constants.ts`)

Only queue/job identity goes here. Numbers stay in `bull-queue.constants.ts`.

```typescript
// src/modules/example/example.constants.ts
export const EXAMPLE_QUEUE = 'example';
export const EXAMPLE_PROCESS_JOB = 'process';
```

---

## 2. Module Registration with `defaultJobOptions`

```typescript
// src/modules/example/example.module.ts
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { isRedisEnabled } from 'src/config/redis.config';
import { getSharedBullQueueOptions } from 'src/common/constants/bull-queue.constants';
import { EXAMPLE_QUEUE } from './example.constants';
import { ExampleProcessor } from './example.processor';
import { ExampleQueueService } from './example-queue.service';

const redisEnabled = isRedisEnabled();

@Module({
  imports: [
    ...(redisEnabled
      ? [BullModule.registerQueue(getSharedBullQueueOptions(EXAMPLE_QUEUE))]
      : []),
  ],
  providers: [
    ExampleQueueService,
    ...(redisEnabled ? [ExampleProcessor] : []),
    // Mock token so DI doesn't throw when Redis is disabled
    ...(!redisEnabled
      ? [
          {
            provide: getQueueToken(EXAMPLE_QUEUE),
            useValue: { add: async () => {}, getJob: async () => {} },
          },
        ]
      : []),
  ],
  exports: [ExampleQueueService],
})
export class ExampleModule {}
```

---

## 3. Processor (Consumer) with Correct Worker Options

```typescript
// src/modules/example/example.processor.ts
import { Processor } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BaseProcessor } from 'src/common/queue/base-processor';
import {
  QUEUE_DRAIN_DELAY_MS,
  QUEUE_MAX_STALLED_COUNT,
  QUEUE_STALLED_INTERVAL_MS,
} from 'src/common/constants/bull-queue.constants';
import { EXAMPLE_QUEUE } from './example.constants';

export interface ExampleJobData {
  entityId: string;
}

@Processor(EXAMPLE_QUEUE, {
  drainDelay: QUEUE_DRAIN_DELAY_MS, // ← essential: prevents idle polling storm
  stalledInterval: QUEUE_STALLED_INTERVAL_MS, // ← essential: reduces stall-check frequency
  maxStalledCount: QUEUE_MAX_STALLED_COUNT,
})
export class ExampleProcessor extends BaseProcessor {
  protected readonly logger = new Logger(ExampleProcessor.name);

  async process(job: Job<ExampleJobData>): Promise<void> {
    const { entityId } = job.data;
    this.logger.log(`Processing job ${job.id} for entity ${entityId}`);

    try {
      // Heavy work here
    } catch (error) {
      this.logger.error(
        `Job failed: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error; // Rethrow → BullMQ handles retry with backoff
    }
  }
}
```

---

## 4. Base Processor for Error Rate Limiting

BullMQ workers emit unhandled exceptions on Redis failure (like Upstash rate limits). Extend `BaseProcessor` to throttle error logs and prevent log spam.

```typescript
// src/common/queue/base-processor.ts
import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

export abstract class BaseProcessor extends WorkerHost {
  protected abstract readonly logger: Logger;

  private _lastErrorLogTime = 0;
  private _errorCountSinceLastLog = 0;

  @OnWorkerEvent('error')
  protected onWorkerError(error: Error): void {
    const now = Date.now();
    const LOG_INTERVAL_MS = 60000; // Log at most once per minute

    // Only log once per minute to avoid spamming Cloud Run / Datadog
    if (now - this._lastErrorLogTime > LOG_INTERVAL_MS) {
      const message = error?.message || String(error);
      const stack = error?.stack;

      this.logger.error(
        `Worker error (rate-limited): ${message}${
          this._errorCountSinceLastLog > 0
            ? \` (suppressed ${this._errorCountSinceLastLog} similar errors in the last minute)\`
            : ''
        }`,
        stack,
      );
      this._lastErrorLogTime = now;
      this._errorCountSinceLastLog = 0;
    } else {
      this._errorCountSinceLastLog++;
    }
  }
}
```

---

## 5. Producer (Queue Service) with Isolated `queue.add()`

The golden rule: **persist to DB first, then enqueue**. Redis failures must not roll back DB state.

```typescript
// src/modules/example/example-queue.service.ts
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { ExampleEntity } from './entities/example.entity';
import { EXAMPLE_PROCESS_JOB, EXAMPLE_QUEUE } from './example.constants';

@Injectable()
export class ExampleQueueService {
  private readonly logger = new Logger(ExampleQueueService.name);

  constructor(
    @InjectQueue(EXAMPLE_QUEUE) private readonly queue: Queue,
    @InjectRepository(ExampleEntity)
    private readonly repo: Repository<ExampleEntity>,
  ) {}

  async triggerProcessing(entityId: string): Promise<ExampleEntity> {
    // 1. Persist DB state FIRST — survives a Redis outage
    const entity = await this.repo.save({ id: entityId, status: 'PENDING' });

    // 2. Enqueue — wrapped so Redis errors don't propagate to the caller
    try {
      await this.queue.add(EXAMPLE_PROCESS_JOB, { entityId });
    } catch (error) {
      // Redis unavailable. Entity is PENDING in DB; cron/retry will re-enqueue.
      this.logger.warn(
        `Queue unavailable for entity ${entityId}: ${(error as Error).message}`,
      );
    }

    return entity; // API responds normally regardless of Redis state
  }
}
```

---

## 6. Throttler Fail-Open Pattern

When Redis is unavailable the `ThrottlerGuard` (global `APP_GUARD`) must **not** kill all HTTP routes. The `RedisThrottlerStorage` must catch all Redis errors and return a pass-through record.

```typescript
// src/common/throttler/redis-throttler-storage.ts (key section)

const FAIL_OPEN_RECORD = (ttl: number): ThrottlerStorageRecord => ({
  totalHits: 0,
  timeToExpire: Math.ceil(ttl / 1000),
  isBlocked: false,
  timeToBlockExpire: 0,
});

async increment(key: string, ttl: number, limit: number): Promise<ThrottlerStorageRecord> {
  try {
    const result = await this._redis.throttlerIncrement(key, ttl, limit);
    // ... normal path
  } catch (error) {
    // Fail-open: temporarily disable rate-limiting rather than kill the API.
    this.logger.warn(`Redis throttler unavailable, failing open: ${(error as Error).message}`);
    return FAIL_OPEN_RECORD(ttl);
  }
}
```

---

## 7. Processor vs. Cron — When Both Exist

```text
Cron (runs at 02:00 daily)
  → finds entities needing work
  → calls QueueService.triggerProcessing()
      → saves entity as PENDING
      → queue.add() → BullMQ

Processor (always running, idle between jobs)
  → picks up job from BullMQ
  → does the heavy work
  → updates entity to READY / FAILED
  → sends notifications
```

**Never remove the processor because a cron exists.** The cron _schedules_; the processor _executes_. Both are always required.

---

## 8. Redis Command Cost: Before vs. After

| Setting             | Default      | Project Value | Idle commands saved/day |
| ------------------- | ------------ | ------------- | ----------------------- |
| `drainDelay`        | 5 ms         | 10 000 ms     | ~570M                   |
| `stalledInterval`   | 5 000 ms     | 60 000 ms     | ~1M                     |
| `removeOnComplete`  | keep forever | 50            | Growing scan cost       |
| `removeOnFail`      | keep forever | 20            | Growing scan cost       |
| Throttler fail-open | throws       | pass-through  | Server stays alive      |


---

## nestjs-caching

### example

# References

Move large code blocks here.

## Inline Examples

```typescript
// Controller-level caching with custom key and TTL
@UseInterceptors(CacheInterceptor)
@CacheKey('users_list')
@CacheTTL(300) // 5 minutes
@Get()
findAll() { return this.usersService.findAll(); }
```

```typescript
// TTL with jitter — prevents stampede on grouped caches
const baseTTL = 300;
const jitter = Math.floor(Math.random() * 20) - 10; // ±10s
await this.cacheManager.set(key, value, baseTTL + jitter);
```


---

## nestjs-controllers-services

### REFERENCE

# NestJS Controllers & Services — Reference Examples

## Custom Parameter Decorator

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request.interface';
import { User } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
```

## Controller with Typed Decorator

```typescript
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: User): Promise<ProfileDto> {
    return this.profileService.findById(user.id);
  }
}
```

## Global Validation Pipe (main.ts)

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

## Route Param with Pipe

```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
  return this.usersService.findOneOrFail(id);
}
```

## Lifecycle Hooks

```typescript
@Injectable()
export class AppService implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    await this.connectDatabase();
  }
  async onApplicationShutdown(signal?: string) {
    await this.disconnectDatabase();
  }
}
```


---

## nestjs-database

### persistence_strategy

# Persistence Strategy

## Database Selection Framework

### 1. Data Structure Analysis

- **Relational** (Users, Orders): **PostgreSQL** (Default). ACID, strict schema.
- **Unstructured** (Content, Catalog): **MongoDB**. Flexible schema.
- **Time-Series** (IoT, Metrics): **TimescaleDB**. High write throughput.

### 2. Access Pattern Analysis

- **OLTP** (Transactions): SQL (Postgres/MySQL).
- **OLAP** (Analytics): Columnar (ClickHouse) or Read Replicas.
- **High Throughput Write**: Cassandra or DynamoDB.

## Scaling & Production

### Connection Pooling

- **Problem**: K8s scaling exhausts connection limits.
- **Solution**: Use **PgBouncer** (Postgres) or **ProxySQL** (MySQL) in transaction mode.

### Migrations

- **Safe Execution**: Run via "init container" or CI/CD step.
- **Zero-Downtime**: Expand-Contract pattern.
  1. Expand: Add new column (nullable).
  2. Migrate: Backfill data.
  3. Strict: Deploy code using new column.
  4. Contract: Drop old column.

### Sharding & Partitioning

- **Partitioning**: Use native table partitioning for logs/events.
- **Sharding**: Avoid until >10TB data. Complexity is extreme.


---

## nestjs-deployment

### example

# References

Move large code blocks here.

## Inline Examples

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
CMD ["node", "--max-old-space-size=800", "dist/main"]
```


---

## nestjs-documentation

### example

# References

Move large code blocks here.

## Inline Examples

```json
// nest-cli.json — enable Swagger plugin
{
  "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
}
```

```typescript
// main.ts — Swagger bootstrap
const config = new DocumentBuilder()
  .setTitle('API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const doc = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, doc);
```

```typescript
SwaggerModule.createDocument(app, config, { include: [PublicModule] });  // /api/docs
SwaggerModule.createDocument(app, adminConfig, { include: [AdminModule] }); // /admin/docs
```


---

## nestjs-notification

### implementation

# nestjs-notification Implementation Examples

## Inline Examples

```typescript
// notification.service.ts
async send(userId: string, type: NotificationType, metadata: Record<string, string>) {
  const notification = await this.repo.save({ userId, type, metadata: JSON.stringify(metadata) });
  const user = await this.usersService.findOne(userId);
  if (user.fcmToken) {
    try {
      await this.fcm.send({ token: user.fcmToken, data: { type, ...metadata } });
    } catch (err) {
      this.logger.warn(`FCM failed for user ${userId}`, err);
    }
  }
  return notification;
}
```

```text
src/modules/notification/
├── notification.service.ts   # Logic: DB Save + FCM Send
├── entities/
│   └── notification.entity.ts # DB Schema + NotificationType Enum
└── types/
    └── notification.types.ts  # Interfaces for Payloads/Metadata
```


---

### service

# Notification Service Pattern (Dual-Write)

## 1. Service Implementation

Handle both persistent storage (In-App) and ephemeral delivery (Push) in one atomic flow.

```typescript
// src/modules/notification/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async send(
    userId: string,
    title: string,
    body: string,
    type: NotificationType,
    metadata?: Record<string, any>,
  ) {
    // 1. Persistent Storage (In-App Center)
    const notification = this.notificationRepo.create({
      user: { id: userId } as User,
      title,
      content: body,
      type,
      // Metadata allows frontend to route on click (e.g. { appointmentId: '...' })
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
    await this.notificationRepo.save(notification);

    // 2. Ephemeral Delivery (Push/FCM)
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['fcmToken'],
    });

    if (user?.fcmToken) {
      try {
        await admin.messaging().send({
          token: user.fcmToken,
          notification: { title, body },
          // FCM data must be strings
          data: this.serializeData({ type, ...metadata }),
        });
      } catch (error) {
        this.logger.error(`FCM failed for ${userId}`, error);
      }
    }
  }

  private serializeData(data: Record<string, any>): Record<string, string> {
    return Object.keys(data).reduce(
      (acc, key) => ({
        ...acc,
        [key]: String(data[key]),
      }),
      {},
    );
  }
}
```


---

### types

# Notification Type Standards

## 1. Business Logic Types

Define granular types in the Entity or a shared Enum. Use SCREAMING_SNAKE_CASE.

```typescript
// src/modules/notification/entities/notification.entity.ts or shared/enums/
export enum NotificationType {
  // Group by Feature
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',

  VACCINE_UPCOMING = 'VACCINE_UPCOMING',
  VACCINE_MISSED = 'VACCINE_MISSED', // Granularity helps frontend icons/colors

  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}
```

## 2. Job Payload Types

Define interfaces for the data passed to background workers.

```typescript
// src/modules/notification/types/notification.types.ts

// Base payload for all notification jobs
export interface BaseNotificationJob {
  userId: string;
  type: NotificationType;
}

// Specific payloads extend the base
export interface AppointmentReminderJob extends BaseNotificationJob {
  type: NotificationType.APPOINTMENT_REMINDER;
  payload: {
    appointmentId: string;
    time: Date;
    doctorName: string;
  };
}

export type NotificationJob = AppointmentReminderJob | VaccineJob;
```

## 3. Metadata Strategy

For flexible metadata columns (JSON), define TypeScript interfaces to enforce structure at the application level.

```typescript
export interface AppointmentMetadata {
  appointmentId: string;
  childId: string;
  location?: string;
}

// Usage in Service
await service.send(..., { appointmentId: '123' } as AppointmentMetadata);
```


---

## nestjs-observability

### example

# References

Move large code blocks here.

## Inline Examples

```typescript
// app.module.ts — Pino setup with redaction
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' } : undefined,
        redact: ['req.headers.authorization', 'body.password', 'body.token'],
      },
    }),
  ],
})
export class AppModule {}
```

```typescript
// metrics.module.ts — key metric definitions
import { makeHistogramProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';

const providers = [
  makeHistogramProvider({ name: 'http_request_duration_seconds', help: 'HTTP latency', labelNames: ['method', 'route', 'status'] }),
  makeHistogramProvider({ name: 'db_query_duration_seconds', help: 'DB query latency', labelNames: ['operation'] }),
  makeGaugeProvider({ name: 'memory_usage_bytes', help: 'Heap memory usage' }),
];
```


---

## nestjs-performance

### example

# References

Move large code blocks here.

## Inline Examples

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from '@fastify/compress';

const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
await app.register(compression, { encodings: ['gzip', 'deflate'] });
```


---

## nestjs-real-time

### example

# References

Move large code blocks here.

## Inline Examples

```typescript
// events.controller.ts
@Controller('events')
export class EventsController {
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return interval(1000).pipe(map((num) => ({ data: { count: num } }) as MessageEvent));
  }
}
```

```typescript
// chat.gateway.ts
@WebSocketGateway({ cors: { origin: 'https://app.example.com' } })
export class ChatGateway implements OnGatewayConnection {
  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    try {
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
    } catch {
      client.disconnect(true); // reject invalid tokens immediately
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { room: string; text: string }) {
    this.server.to(payload.room).emit('message', { userId: client.data.userId, text: payload.text });
  }
}
```


---

## nestjs-scheduling

### example

# References

Move large code blocks here.

## Inline Examples

### Cron Decorator Pattern

```typescript
@Cron(CronExpression.EVERY_MINUTE)
@DistributedLock({ key: 'send_emails', ttl: 5000 })
async handleCron() {
  // Only runs if lock acquired
}
```

### Cron-to-Queue Offload

```typescript
// reports.service.ts
@Injectable()
export class ReportsService {
  constructor(@InjectQueue('reports') private reportsQueue: Queue) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @DistributedLock({ key: 'daily_report', ttl: 60000 })
  async scheduleDailyReport() {
    try {
      await this.reportsQueue.add('generate', { date: new Date().toISOString() });
    } catch (err) {
      this.logger.error('Failed to schedule report', err);
    }
  }
}
```


---

## nestjs-security

### implementation

# NestJS Security Implementation Details

## Cryptography & Hashing

### Password Hashing (Argon2id)

Use **Argon2id** instead of Bcrypt (vulnerable to GPU/FPGA cracking).

```typescript
import * as argon2 from 'argon2';

// Hash
const hash = await argon2.hash(password);

// Verify
const isValid = await argon2.verify(hash, password);
```

### Encryption (AES-256-GCM)

Use **Authenticated Encryption** for data at rest.

```typescript
import { createCipheriv, randomBytes } from 'crypto';

const key = getKeyFromKMS(); // Never hardcode
const iv = randomBytes(16);
const cipher = createCipheriv('aes-256-gcm', key, iv);
```

**Key Management**:

- Never hardcode keys in source
- Rotate keys using KMS (AWS Secrets Manager, HashiCorp Vault)
- Use separate keys per environment

---

## CSRF Protection

**When Required**: Cookie-based sessions or Cookie-based JWTs.

```typescript
// main.ts
import * as csurf from 'csurf';
app.use(csurf({ cookie: true }));
```

**Token Requirements**:

- Cryptographically strong
- Verified on every state-changing request (POST/PUT/DELETE)

**Note**: If using `Authorization: Bearer` headers only, CSRF is less critical but `SameSite: Strict` cookies are still recommended.

---

## Hardening Configuration

### Helmet Setup

```typescript
// main.ts
import helmet from 'helmet';

app.use(
  helmet({
    hsts: { maxAge: 31536000, preload: true },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  }),
);
```

### Rate Limiting (Distributed)

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 10 }],
      storage: new ThrottlerStorageRedisService(redisClient),
    }),
  ],
})
```

---

## Audit Logging Pattern

```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      this.logger.log({
        user: req.user?.id,
        action: req.method,
        resource: req.url,
        timestamp: new Date(),
      });
    }
    return next.handle();
  }
}
```

---

## Data Sanitization

### Response Serialization

```typescript
// main.ts
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

// user.entity.ts
@Exclude()
password: string;
```

### Input Validation (Mass Assignment Prevention)

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strips unknown properties
    forbidNonWhitelisted: true, // Throws on unknown
  }),
);
```

## Inline Examples

```typescript
// auth.module.ts
@Module({
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AuthModule {}

// public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

```typescript
// auth.service.ts
import * as argon2 from 'argon2';

async hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 });
}

async verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
```


---

## nestjs-security-isolation

### auth-logic

# Child Access Authorization Logic

All child-specific services must call `childrenService.validateChildAccess()` to prevent ID-guessing attacks (Insecure Direct Object Reference). This method is centralized in `ChildrenService`.

## Centralized Method in `ChildrenService`

```typescript
public async validateChildAccess(childId: string, userId: string): Promise<void> {
  const membership = await this.familyMemberRepository.findOne({
    where: { child: { id: childId }, user: { id: userId } },
    relations: ['family'],
  });

  if (!membership) {
    // Fallback: check if they are in the family that owns the child
    const child = await this.childRepository.findOne({
      where: { id: childId },
      relations: ['family'],
    });

    if (!child) throw new NotFoundException('Child not found');

    const familyMembership = await this.familyMemberRepository.findOne({
      where: { family: { id: child.family.id }, user: { id: userId } },
    });

    if (!familyMembership) throw new ForbiddenException('Access denied');
  }
}
```


---

### implementation-patterns

# Data Isolation Implementation Patterns

## Nested Controller Pattern

All child-specific resources must be nested under the child ID to ensure explicit context.

```typescript
@Controller('children/:childId/my-feature')
export class MyFeatureController {
  @Get()
  async findAll(
    @Param('childId') childId: string,
    @CurrentUserDecorator() user: User,
  ) {
    return this.service.findAllForChild(childId, user);
  }
}
```

## Entity Documentation Standard

Entities with RLS enabled must use the `@Security` tag to warn future developers.

```typescript
/**
 * @Entity domain_table
 * @Security PostgreSQL Row Level Security (RLS) enabled.
 * Access restricted based on child ownership and family membership.
 * See SECURITY.md for details.
 */
@Entity('domain_table')
export class DomainEntity { ... }
```

## Centralized Access Validation

Always delegate access checks to `ChildrenService`.

```typescript
async myServiceMethod(childId: string, user: CurrentUser) {
    await this.childrenService.validateChildAccess(childId, user.id);
    // ... proceed with logic
}
```


---

### rls-patterns

# RLS Migration Patterns

All migrations creating child-centric tables should follow this pattern.

## Standard RLS template

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create Table
    await queryRunner.query(`
        CREATE TABLE "my_table" ( ... "childId" uuid, ... )
    `);

    // 2. Enable RLS
    await queryRunner.query(`ALTER TABLE "my_table" ENABLE ROW LEVEL SECURITY;`);

    // 3. Create Policy (Family-Based)
    await queryRunner.query(`
        CREATE POLICY "My table access policy" ON "my_table"
        FOR ALL
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM "family_members" fm
                JOIN "children" c ON c."id" = fm."childId"
                WHERE c."id" = "my_table"."childId"
                AND fm."userId" = NULLIF(current_setting('app.current_user_id', true), '')::uuid
            )
        );
    `);
}
```


---

## nestjs-testing

### improve-coverage

---
description: Systematic workflow for improving test coverage to a target threshold
---

# Improve Test Coverage Workflow

1. **Set Target**: Confirm coverage threshold (default: 90% all metrics).
   Check current threshold in `package.json` → `jest.coverageThreshold.global`.

2. **Baseline**: Run coverage and capture current metrics.

   ```bash
   pnpm test:cov 2>&1 | tail -20
   ```

   Record: Stmts, Branches, Funcs, Lines percentages.

3. **Identify Gaps**: Parse coverage report for files below target.

   ```bash
   # Find files with <90% coverage
   pnpm test:cov --coverageReporters=text 2>&1 | grep -E '\|\s+[0-7][0-9]\.'
   ```

   Prioritize by: (A) core business logic, (B) most-used services, (C) utilities.

4. **Enhance Tests** (per file):
   - **Read the source file** — understand all branches, edge cases
   - **Read existing spec** (if any) — identify untested paths
   - **Verify DTO/entity shapes** — read actual class before writing mocks
   - Write tests following **[Strict TypeScript Testing](./strict-typescript-testing.md)**
   - Focus on branches: `if/else`, `switch`, `try/catch`, `??`, `?.`, ternaries

5. **Lint Check**: After each batch of spec changes:

   ```bash
   npx eslint --no-warn-ignored <changed-spec-files>
   ```

   Fix immediately — **NO `eslint-disable`**, **NO `as any`**.

6. **Verify Tests Pass**:

   ```bash
   npx jest --testPathPattern="<pattern>" --no-coverage
   ```

7. **Re-measure Coverage**:

   ```bash
   pnpm test:cov
   ```

   Compare against baseline. If threshold not met, return to step 3.

8. **Final Validation**:
   - All tests pass (0 failures)
   - All lint checks pass (0 errors)
   - Coverage meets threshold for all 4 metrics
   - No `eslint-disable` or `as any` in any spec file

## Anti-Patterns

- **No Coverage Padding**: Don't add meaningless `toBeDefined()` tests for coverage
- **No Shape Guessing**: Always verify actual DTO/entity structure before mocking
- **No eslint-disable**: Fix type issues properly per [strict-typescript-testing](../skills/nestjs/testing/references/strict-typescript-testing.md)
- **No Batch-and-Pray**: Lint-check after EACH file, not at the end

## Key Skill Dependencies

- [nestjs/testing](../skills/nestjs/testing/SKILL.md) — Test patterns and structure
- [typescript/best-practices](../skills/typescript/best-practices/SKILL.md) — No `any`, no lint-disable
- [common/tdd](../skills/common/tdd/SKILL.md) — Red-Green-Refactor cycle


---

### patterns

# NestJS Testing Patterns Reference

Detailed examples and advanced patterns for NestJS testing.

## Unit Testing Patterns

### AAA Pattern Example

```typescript
describe('UserService', () => {
  it('should create user', async () => {
    // Arrange
    const dto = { email: 'test@test.com', password: 'Pass123!' };
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue({ id: 1, ...dto });

    // Act
    const result = await service.createUser(dto);

    // Assert
    expect(result.email).toBe(dto.email);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

### Mock Repository Factory

```typescript
function createMockRepository<T>() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn((dto) => dto),
  };
}
```

### Testing Services

```typescript
describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = { findByEmail: jest.fn(), update: jest.fn() };
  const mockJwtService = { sign: jest.fn(), verify: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'hashed' };
    mockUsersService.findByEmail.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

    const result = await service.validateUser('test@test.com', 'pass');

    expect(result).toEqual({ userId: 1, email: 'test@test.com' });
  });
});
```

### Testing Guards

```typescript
describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const mockReflector = { getAllAndOverride: jest.fn() };

  beforeEach(() => {
    guard = new JwtAuthGuard(mockReflector as unknown as Reflector);
  });

  it('should allow public routes', () => {
    mockReflector.getAllAndOverride.mockReturnValue(true);
    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });
});

function createMockContext() {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user: { id: 1 } }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}
```

### Test Data Builders

```typescript
class UserBuilder {
  private user = {
    email: 'test@test.com',
    password: 'hashed',
    role: 'USER',
  };

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withRole(role: string): this {
    this.user.role = role;
    return this;
  }

  build() {
    return this.user;
  }
}

// Usage
const admin = new UserBuilder().withRole('ADMIN').build();
```

## E2E Testing Patterns

### Complete User Flow

```typescript
describe('Auth Flow (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', password: 'Pass123!' })
      .expect(201)
      .expect((res) => {
        accessToken = res.body.access_token;
      });
  });

  it('should access protected route', () => {
    return request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
```

### Database Cleanup Strategies

#### Option 1: Transaction Rollback (Fast)

```typescript
let queryRunner: QueryRunner;

beforeEach(async () => {
  queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();
});

afterEach(async () => {
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
});
```

#### Option 2: Explicit Truncate

```typescript
afterEach(async () => {
  await dataSource.query('TRUNCATE TABLE "orders" CASCADE');
  await dataSource.query('TRUNCATE TABLE "users" CASCADE');
});
```

### Override Providers

```typescript
// Bypass authentication
beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

  app = module.createNestApplication();
  await app.init();
});
```

## Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/**/main.ts',
    '!src/**/*.dto.ts',
  ],
};
```

## Mock vs Spy

**Use `jest.fn()` when:**

- Creating mock from scratch
- Complete control over behavior

**Use `jest.spyOn()` when:**

- Spying on existing method
- Need original implementation sometimes

```typescript
// Mock
const mockService = { send: jest.fn().mockResolvedValue(true) };

// Spy
jest.spyOn(emailService, 'send').mockResolvedValue(true);
```

## Test Organization

```typescript
describe('UserService', () => {
  // Happy paths
  describe('Happy Path', () => {
    it('should create user', () => {});
  });

  // Error cases
  describe('Error Cases', () => {
    it('should throw on duplicate email', () => {});
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle concurrent requests', () => {});
  });
});
```

## Best Practices

1. **Coverage Target**: 80-90% (100% often impractical)
2. **Test Naming**: Describe behavior, not implementation
3. **Cleanup**: Always use `afterEach` to clear mocks
4. **Isolation**: Each test should run independently
5. **Fast Unit Tests**: Run in parallel with `--maxWorkers=4`
6. **Real E2E**: Use actual DB (Docker/in-memory SQLite)

## Common Mistakes

| Mistake                 | Fix                                  |
| ----------------------- | ------------------------------------ |
| Testing private methods | Test through public API              |
| Mocking DB in E2E       | Use real test database               |
| Shared test state       | Clear mocks in afterEach             |
| No resource cleanup     | Close app/DB in afterAll             |
| Over-mocking            | Balance mocks with integration tests |


---

### strict-typescript-testing

# Strict TypeScript Testing Patterns

Patterns for writing Jest tests that pass `recommendedTypeChecked` ESLint rules.
All examples are lint-clean: no `any`, no `eslint-disable`, no `ts-ignore`.

## 1. Mock Typing (Never `any`)

### Service Mocks

```typescript
// ❌ WRONG — triggers @typescript-eslint/no-unsafe-assignment
let mockUsersService: any;
mockUsersService = { findByEmail: jest.fn() };

// ✅ CORRECT — fully typed mock
const mockUsersService = {
  findByEmail: jest.fn(),
  update: jest.fn(),
};

// Or with jest.Mocked for full type coverage:
const mockUsersService: jest.Mocked<
  Pick<UsersService, 'findByEmail' | 'update'>
> = {
  findByEmail: jest.fn(),
  update: jest.fn(),
};
```

### Repository Mocks

```typescript
// ✅ Typed mock factory
function createMockRepository() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}
```

### ArgumentsHost / ExecutionContext

```typescript
// ❌ WRONG
const mockContext = { switchToHttp: () => ({ getRequest: () => ({}) }) } as any;

// ✅ CORRECT — cast through unknown
const mockContext = {
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn().mockReturnValue({}),
  getResponse: jest.fn().mockReturnValue(mockResponse),
} as unknown as ArgumentsHost;
```

## 2. Jest Asymmetric Matchers + Strict TypeScript

`expect.anything()`, `expect.any()`, `expect.objectContaining()`, `expect.arrayContaining()`
all return values typed as `any`. When nested inside `expect.objectContaining({})`,
they trigger `@typescript-eslint/no-unsafe-assignment`.

**Solution**: Cast each nested matcher to `unknown`.

```typescript
// ❌ WRONG — no-unsafe-assignment on expect.anything()
expect(mockFn).toHaveBeenCalledWith(
  expect.objectContaining({
    createdAt: expect.anything(),
    items: expect.arrayContaining([expect.objectContaining({ id: 1 })]),
  }),
);

// ✅ CORRECT — cast nested matchers to unknown
expect(mockFn).toHaveBeenCalledWith(
  expect.objectContaining({
    createdAt: expect.anything() as unknown,
    items: expect.arrayContaining([
      expect.objectContaining({ id: 1 }),
    ]) as unknown,
  }),
);
```

**Rule**: Only nested matchers need casting. Top-level matchers in `toHaveBeenCalledWith()`
or `toEqual()` are fine because the assertion function accepts `unknown`.

## 3. Null Entity Fields

```typescript
// ❌ WRONG
const member = { user: null as any, child: null as any };

// ✅ CORRECT — cast through unknown to target entity type
const member = {
  user: null as unknown as User,
  child: null as unknown as Child,
};
```

## 4. Private Method Testing (When Required for Coverage)

When a private method has complex logic requiring direct testing:

```typescript
// ❌ WRONG — triggers no-unsafe-member-access, no-unsafe-call
const result = (service as any)['isLimitReached']('photos', 5);

// ✅ CORRECT — typed helper function
type IsLimitReached = (feature: string, count: number) => boolean;
const callIsLimitReached = (
  svc: FeatureLimitService,
  feature: string,
  count: number,
): boolean =>
  (svc as unknown as { isLimitReached: IsLimitReached }).isLimitReached(
    feature,
    count,
  );

// Usage in tests
expect(callIsLimitReached(service, 'photos', 5)).toBe(true);
```

**Prefer public API testing when possible.** Use this pattern only for coverage-critical
private methods with branch logic that cannot be fully reached through public methods.

## 5. DTO Mock Verification (Prevent Shape Mismatches)

**Always verify actual DTO class before writing test mocks.**

```typescript
// ❌ WRONG — guessing DTO shape leads to test/lint fix rounds
const dto = { email: 'test@test.com', termsVersion: '2.0' } as UpdateTermsDto;

// ✅ CORRECT — read actual DTO first, match fields exactly
// If actual DTO has `latestTermsVersion` (not `termsVersion`):
const dto: UpdateTermsDto = { latestTermsVersion: '2.0' };
```

**Workflow**:

1. Open the actual DTO file → confirm field names and nesting
2. Write mock data matching the real shape
3. If DTO has wrappers (e.g., `{ settings: { ... } }`), include them

## 6. ConfigService Mocks

```typescript
// ❌ WRONG
const mockConfig = { get: jest.fn() } as any;

// ✅ CORRECT
const mockConfig = { get: jest.fn() } as unknown as ConfigService;
```

## 7. Unused Variables Prevention

```typescript
// ❌ WRONG — creates variable then never uses it
const configService = module.get<ConfigService>(ConfigService);
// ... configService never referenced

// ✅ CORRECT — only declare if used in assertions or setup
// Option A: Remove the variable entirely
module.get<ConfigService>(ConfigService); // Just verify it resolves

// Option B: Keep only if actually used
const configService = module.get<ConfigService>(ConfigService);
expect(configService).toBeDefined(); // Valid use
```

## 8. Import Style (No `require()`)

```typescript
// ❌ WRONG — triggers @typescript-eslint/no-require-imports
jest.mock('./redis.config', () => require('./redis.config'));

// ✅ CORRECT — use ES module import + jest.spyOn
import * as redisConfig from './redis.config';
jest
  .spyOn(redisConfig, 'getRedisOptions')
  .mockReturnValue({ host: 'localhost' });
```

## 9. Callback Return Types

```typescript
// ❌ WRONG — subscribe complete callback returns `any` from done()
observable$.subscribe({ complete: () => done() });

// ✅ CORRECT — wrap in void block
observable$.subscribe({
  complete: () => {
    done();
  },
});
```

## Quick Reference Cheat Sheet

| Problem                    | Pattern                                       |
| -------------------------- | --------------------------------------------- |
| `let x: any`               | Use typed object literal or `jest.Mocked<T>`  |
| `as any` on value          | `as unknown as TargetType`                    |
| `expect.anything()` nested | `expect.anything() as unknown`                |
| `null as any`              | `null as unknown as EntityType`               |
| `(svc as any)['method']`   | Typed helper with explicit function type      |
| `eslint-disable`           | **NEVER** — fix the underlying type issue     |
| `require()` in tests       | `import * as` + `jest.spyOn()`                |
| `catch (e: any)`           | `catch (e: unknown)` + `(e as Error).message` |


---

## nestjs-transport

### example

# References

Move large code blocks here.

## Inline Examples

```typescript
// main.ts — gRPC microservice bootstrap
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.GRPC,
  options: {
    package: 'users',
    protoPath: join(__dirname, '../libs/contracts/users.proto'),
    url: '0.0.0.0:5001',
  },
});
await app.listen();
```

```typescript
// main.ts — RabbitMQ microservice bootstrap
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL],
    queue: 'orders_queue',
    queueOptions: { durable: true },
  },
});
```

```typescript
@Catch()
export class RpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(() => exception.getError());
  }
}
```


---

