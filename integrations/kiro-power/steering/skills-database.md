---
inclusion: manual
---

# Skills: database

> 3 skills. Load when editing database files.
> For code examples and implementation patterns, load `refs-database.md`.

## Index

# database Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **database-mongodb** | `**/*.json` | mongo, mongoose, objectid, schema, model |
| **database-postgresql** | `**/*.entity.ts`, `prisma/schema.prisma`, `**/migrations/*.sql` | TypeOrmModule, PrismaService, PostgresModule |
| **database-redis** | `**/redis.config.ts` | redis, cache, ttl, eviction |

> Load matched skills: `<SKILLS>/database/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### database-mongodb

---
name: database-mongodb
description: Apply expert schema design, indexing, and performance rules for MongoDB. Use when designing MongoDB schemas, creating indexes, or optimizing NoSQL query performance.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.js'
    - '**/*.json'
    keywords:
    - mongo
    - mongoose
    - objectid
    - schema
    - model
---
# MongoDB Best Practices

## **Priority: P0 (CRITICAL)**

## Schema Design

- **Embed vs Reference**:
 - **Embed** (1:Few): Addresses, Phone Numbers. Optimization: Read locality.
 - **Reference** (1:Many/Infinity): Logs, Activity History. Optimization: Document size limits (16MB).
- **Bucket Pattern**: For time-series or high-cardinality "One-to-Many", bucket items into documents (e.g., `DailyLog`).

## Optimize Indexes

- **ESR Rule**: Equality, Sort, Range. Order your index keys `(status, date, price)` if you query `status='A'`, sort by `date`, filter `price > 10`.

See [implementation examples](references/implementation.md) for compound index and pagination patterns.

- **Text Search**: Use `$text` search instead of `$regex` for keywords. `$regex` slow (linear scan) unless anchored (`^prefix`).
- **Covered Queries**: Project only indexed fields to avoid fetching document (`PROJECTION` key).
- **Explain Plan**: Target `nReturned` / `keysExamined` ratio of ~1. If `docsExamined` >> `nReturned`, index inefficient.

## Scale with Sharding

- **Shard Key**: Avoid monotonically increasing keys (e.g., `Timestamp`, `ObjectId`) for high-write workloads (creates "Hot Shards"). Use Hashed Sharding or high-cardinality natural keys.

## Improve Query Performance

- **Cursor-Based Pagination**: Use `_id` or sort-key based pagination instead of `skip()`. `skip(10000)` scans 10000 docs.

- **Aggregation**: Prefer Aggregation Framework (`$match`, `$group`) over bringing data to client (JS).

## Configure Operations

- **Write Concern**: Understand `w:1` (Ack) vs `w:majority` (Safe).
- **Transactions**: Use only when ACID across multiple documents stricter than performance needs.

## Anti-Patterns

- **No unbounded arrays**: Use `$push` with `$slice` or redesign using Bucket Pattern.
- **No client-side filtering**: Project only needed fields; never fetch full docs to filter in memory.
- **No deep nesting**: Keep nesting ≤4 levels; flatten paths that frequently queried.

## References

- [Best Practices Guide](references/best-practices.md)
- [Anti-Patterns](references/anti-patterns.md)
- [Postgres vs Mongo Comparison](references/postgres-comparison.md)

---

### database-postgresql

---
name: database-postgresql
description: Enforce repository patterns, zero-downtime migrations, and indexing standards for PostgreSQL with TypeORM or Prisma. Use when defining entities, writing migrations, adding RLS policies, or optimizing query performance.
metadata:
  triggers:
    files:
    - '**/*.entity.ts'
    - 'prisma/schema.prisma'
    - '**/migrations/*.sql'
    keywords:
    - TypeOrmModule
    - PrismaService
    - PostgresModule
---
# PostgreSQL Database Standards

## **Priority: P0 (FOUNDATIONAL)**


## Patterns & Architecture

- **Repository Pattern**: Isolate database logic. Use `@InjectRepository()` or `PrismaService`.
- **Relationship Integrity**: Avoid redundant raw ID columns. Favor relation properties.

## Migrations (Strict Rules)

- **NEVER** use `synchronize: true` in production.
- **Generation**: Modify `.entity.ts` -> run `pnpm migration:generate`.
- **Zero-Downtime**: Use Expand-Contract pattern (Add -> Backfill -> Drop) for destructive changes.
- **RLS**: `typeorm migration:generate` cannot detect Row-Level Security. Use raw `queryRunner.query()` SQL for RLS.

See [implementation examples](references/implementation.md) for Expand-Contract migration patterns.

## Performance & Gotchas

- **Pagination**: Mandatory. Use limit/offset or cursor-based pagination.
- **Indexing**: Define indexes in code for frequently filtered columns. RLS columns MUST indexed.
- **Transactions**: Use `QueryRunner` or `$transaction` for multi-step mutations.

## Anti-Patterns

- **No N+1 queries**: Use query builders or eager-load relations instead of lazy-loading in loops.
- **No heavy RLS joins**: Keep RLS predicates simple; move complex logic to query/view layer.
- **No synchronize in production**: Always run explicit migrations; `synchronize: true` destructive.

## References
- [SQL Gotchas (UPDATE FROM)](references/sql-gotchas.md)

---

### database-redis

---
name: database-redis
description: Optimize Redis caching, key management, and performance. Use when implementing Redis caching strategies, managing key namespaces, or optimizing Redis performance.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.js'
    - '**/redis.config.ts'
    keywords:
    - redis
    - cache
    - ttl
    - eviction
---
# Redis Best Practices

## **Priority: P0 (CRITICAL)**

- **Security**:
 - **Access Control**: Use Redis 6.0+ ACLs (`ACL SETUSER`) to restrict commands by user/role.
 - **Encryption**: Always enable TLS for data-in-transit (standard in managed Redis like Azure/AWS).
 - **Dangerous Commands**: Disable or rename `FLUSHALL`, `KEYS`, `CONFIG`, and `SHUTDOWN` in production.
- **Connection Resilience**:
 - **Pooling**: Use connection pooling with tuned high/low watermarks to avoid connection churn.
 - **Timeouts**: Set strict `read_timeout` and `connect_retries` to handle transient network saturation.

## Guidelines

- **Key Design**:
 - **Namespacing**: Use colons to namespace keys (e.g., `app:user:123`, `rate:limit:ip:1.1.1.1`).
 - **Readability vs Size**: Keep keys descriptive but compact; avoid keys > 512 bytes.
- **Commands & Performance**:
 - **O(N) Avoidance**: Use `SCAN` instead of `KEYS`. Use `UNLINK` instead of `DEL` for background reclamation of large keys.
 - **Lua Scripting**: Prioritize `EVALSHA` for atomic logic; ensure scripts pre-loaded to save bandwidth.
 - **Massive Range**: Limit `ZRANGE`, `HGETALL`, and `LRANGE` results with offsets/limits.
- **Memory Management**:
 - **Eviction Strategy**: Use `allkeys-lru` for general caches and `volatile-lru` for mixed persistent/ephemeral data.
 - **Lazy Freeing**: Enable `lazyfree-lazy-eviction` and `lazyfree-lazy-expire` (Redis 4.0+) to offload cleanup from main thread.
 - **Monitoring**: Watch `Used Memory RSS` vs `Used Memory Dataset`. Large fragmentation suggests need for `MEMORY PURGE` or scaling.

## Anti-Patterns

- **No sole truth in Redis**: Always persist critical data to durable primary database.
- **No large blobs**: Split values > 100KB into smaller keys or use Hashes for field access.
- **No JSON for objects**: Use `HSET` for object fields to enable O(1) access without full decode.
- **No TTL-less keys**: Set TTL or eviction policy on all non-permanent keys to prevent unbounded growth.

## References

- [Best Practices Guide](references/best-practices.md)
- [Checklist](references/checklist.md)

---

