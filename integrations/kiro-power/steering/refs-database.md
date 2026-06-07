---
inclusion: manual
---

# References: database

> 12 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-database.md`.

## database-mongodb

### anti-patterns

# MongoDB Anti-Patterns ("Don't Do This")

## 1. Schema Anti-Patterns

- **Unbounded Arrays**:
  - **Don't**: `$push` comments into a Post document without limit.
  - **Why?**: Document grows >16MB. Updates confuse the storage engine (moves document on disk).
  - **Do**: Use "Bucketing" or Reference for high-cardinality arrays.
- **Massive Documents**:
  - **Don't**: Store binary images/videos in MongoDB BSON.
  - **Why?**: Bloats working set (RAM).
  - **Do**: Store S3 URL in Mongo. Use GridFS only if essential.

## 2. Query Anti-Patterns

- **Regex without Anchor**:
  - **Don't**: `find({ name: /john/ })` (Contains).
  - **Why?**: Cannot use Index effectively (Full Scan).
  - **Do**: `find({ name: /^john/ })` (Starts With) uses Index. Or use `$text` search / Atlas Search.
- **Redundant Indexes**:
  - **Don't**: Create index `{ a: 1 }` if `{ a: 1, b: 1 }` exists.
  - **Why?**: The compound index `{ a: 1, b: 1 }` can already support queries on `a`. Extra index wastes RAM and slows writes.
- **Negation Operators**:
  - **Don't**: `$ne` (Not Equal) or `$nin`.
  - **Why?**: Usually require scanning all index keys (inefficient).
- **Deep Pagination**:
  - **Don't**: `skip(50000).limit(10)`.
  - **Why?**: Engine must iterate 50,000 docs.
  - **Do**: `find({ _id: { $gt: last_seen_id } }).limit(10)`.

## 3. Sharding Anti-Patterns

- **Monotonic Shard Keys**:
  - **Don't**: Shard by `created_at` or `_id` (ObjectId) for write-heavy collections.
  - **Why?**: All new writes go to the "last" chunk (Chunk Migration cannot keep up).
  - **Do**: Use Hashed Sharding.
- **Jumbo Chunks**:
  - **Don't**: Choose a shard key with low cardinality (e.g., `country` if 90% users are in 'US').
  - **Why?**: 'US' chunk will grow beyond limit (64MB) and cannot be split.

## 3. Code/Driver Anti-Patterns

- **Opening connections per request**:
  - **Don't**: `MongoClient.connect()` inside the API handler.
  - **Why?**: Handshake is slow.
  - **Do**: Singleton connection / Connection Pool.


---

### best-practices

# MongoDB Detailed Best Practices

## 1. Schema Design

### Embedding vs Referencing

- **Embed** (Denormalization):
  - **Use Case**: 1-to-Few relations, data accessed together (e.g., `User` + `Address`).
  - **Pros**: Single read/write operation. Atomicity (single document update).
  - **Cons**: Duplication updates, 16MB limit.
- **Reference** (Normalization):
  - **Use Case**: 1-to-Many/Infinity, data accessed separately (e.g., `User` + `Posts`).
  - **Pros**: Smaller documents, no duplication.
  - **Cons**: Requires application-level joins or `$lookup`.

### Patterns

- **Bucket Pattern**:
  - Instead of `Sensor` document with 1 array of 1M readings, execute one write per hour to create a `SensorHour` bucket with 60 readings.
- **Computed Pattern**:
  - Store computed values (e.g., `total_spent`) on the `User` document. Update it atomically with `$inc` on every purchase. Avoids expensive aggregations.

## 2. Indexing Strategy

- **ESR Rule (Equality, Sort, Range)**:
  - Create composite indexes in this order:
    1.  **Equality**: Fields you query exactly (`status: "active"`).
    2.  **Sort**: Fields you sort by (`date: -1`).
    3.  **Range**: Fields you filter by range (`price: { $gt: 10 }`).
- **Covered Queries**:
  - `db.users.find({ status: "A" }, { _id: 0, status: 1 }).explain()` -> `IXSCAN` (Index only, no `FETCH`).
  - Fastest possible query.

### Specialized Indexes

- **Text Index**: For search functionality. `db.coll.createIndex({ content: "text" })`.
- **TTL Index**: Auto-expire documents (Logs, Sessions) after `expireAfterSeconds`.
- **Partial Index**: Index only subset of documents. `createIndex({ email: 1 }, { partialFilterExpression: { email: { $exists: true } } })`. Saves storage.
- **Sparse Index**: Only indexes documents that _have_ the field. (Partial indexes are generally preferred in modern Mongo).

## 3. Operations & Performance

- **Explain Plans**:
  - Check `executionStats`.
  - **Ideal**: `totalKeysExamined` ≈ `nReturned`.
  - **Bad**: `totalDocsExamined` >> `nReturned` (means fetching docs just to filter them implies missing/bad index).
  - **Hint**: Use `.hint({ status: 1 })` to force a specific index if the optimizer gets it wrong.
- **Write Concerns**:
  - `w: 1` (Default): Acknowledged by Primary. Fast.
  - `w: "majority"`: Acknowledged by majority of Replicas. Safe against rollback.
- **Read Preferences**:
  - `primary` (Default): Strong consistency.
  - `secondaryPreferred`: Good for analytics/reporting to offload primary, but _eventual consistency_.
- **Aggregation Pipeline**:
  - **Filter Early**: Put `$match` and `$project` at the _very start_ of the pipeline.
  - **Constants**: Define stages as constants in code for maintainability.

## 4. Sharding Strategy

- **Shard Key Selection**:
  - **Cardinality**: Must be high (e.g., `user_id` is good, `status` is bad).
  - **Write Distribution**: Avoid Monotonic keys (Timestamp). Use **Hashed Sharding** (`{ _id: "hashed" }`) for even distribution.
  - **Query Isolation**: Ideal shard key allows `mongos` to target a single shard (Scatter-Gather is slow).

## 5. Mongoose Specifics (ODM)

- **Use `.lean()`**:
  - **Why?**: Mongoose hydrates raw JSON into heavy Mongoose Documents (with change tracking, getters/setters).
  - **Do**: `await Model.find().lean()`. Returns plain JS objects. ~5-10x faster for read-only.
- **Index Management**:
  - **Production**: Disable `autoIndex: false`. Build indexes in CI/CD or manually.
  - **Reason**: Index build can block deployment or cause downtime.
- **Population**:
  - **Avoid**: Deep/Nested `populate()`. It executes N+1 queries under the hood.
  - **Do**: Use `.aggregate()` with `$lookup` for complex joins.


---

### checklist

# MongoDB Review Checklist

## Schema Design

- [ ] **Embedding Check**: Are 1:1 and 1:Few relations embedded?
- [ ] **Array Check**: Do all arrays have a logical or hard limit? (e.g., `< 100` items).
- [ ] **Data Types**: Are Dates stored as `Date` objects (not strings)? Numbers as proper Number types?
- [ ] **Indexes**: Do all queries utilize an index? (Check `.explain("executionStats")`).
  - [ ] **Redundancy**: Are suffix indexes removed? (e.g., remove `{a:1}` if `{a:1, b:1}` exists).
  - [ ] **TTL**: Are ephemeral data (logs/sessions) using TTL indexes?

## Performance

- [ ] **Explain Plan**: Is `totalDocsExamined` close to `nReturned`? (Constraint: Ratio < 1.1).
- [ ] **ESR Rule**: Do compound indexes follow Equality -> Sort -> Range?
- [ ] **Projections**: do queries return only needed fields (`{ field: 1 }`)?
- [ ] **Aggregation**: Is logic performed in DB (`$group`) rather than app code?
- [ ] **Pagination**: Using `_id` range instead of `skip()` for large lists?

## Sharding (If Applicable)

- [ ] **Shard Key**: Validated high-cardinality and non-monotonic distribution?
- [ ] **Targeting**: Do most queries include the Shard Key? (Avoid Scatter-Gather).

## Security & Reliability

- [ ] **Injection**: Are inputs validated/sanitized? (Avoid constructing query objects from raw user JSON).
- [ ] **timeouts**: Are connection and socket timeouts configured?
- [ ] **Error Handling**: Are duplicate key errors (`E11000`) handled gracefully?


---

### implementation

# Implementation Examples

## Compound Index Following ESR Rule

```javascript
// Create compound index following ESR rule
db.orders.createIndex({ status: 1, date: 1, price: 1 });

// Query leveraging the index
db.orders.find({ status: "active" }).sort({ date: 1 }).hint({ status: 1, date: 1, price: 1 });
```

## Cursor-Based Pagination

```javascript
// Cursor-based pagination (efficient)
const lastId = ObjectId("64a7...");
db.products.find({ _id: { $gt: lastId } }).sort({ _id: 1 }).limit(20);
```


---

### postgres-comparison

# PostgreSQL vs MongoDB: A Best Practices Comparison

## Core Philosophy

| Feature          | PostgreSQL (SQL)                                                                 | MongoDB (NoSQL)                                                                                      |
| :--------------- | :------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Data Model**   | **Relational (Rows/Tables)**. Rigid schema. Normalize data to reduce redundancy. | **Document (JSON/BSON)**. Flexible schema. Denormalize (Embed) for read locality.                    |
| **Scaling**      | **Vertical** (Bigger machine). Read replicas for scaling reads.                  | **Horizontal** (Sharding). Built-in distribution of data across clusters.                            |
| **Transactions** | **ACID** (Atomic, Consistent, Isolated, Durable). Multi-row defaults.            | **BASE** (Basically Available, Soft state, Eventual consistency). ACID available but costly (v4.0+). |
| **Joins**        | **Powerful**. `JOIN` is efficient and expected.                                  | **Avoid**. `$lookup` exists but is slow. Design schema to _avoid_ joins.                             |

## Feature Mapping

| PostgreSQL Concept | MongoDB Equivalent              | Best Practice Shift                                                                                      |
| :----------------- | :------------------------------ | :------------------------------------------------------------------------------------------------------- |
| **Table**          | **Collection**                  | -                                                                                                        |
| **Row**            | **Document**                    | Documents can have different fields (Polymorphism).                                                      |
| **Column**         | **Field**                       | Fields can be arrays or objects (Embedded).                                                              |
| **Join**           | **Embedding** / `$lookup`       | **Postgres**: Join tables. **Mongo**: Embed if 1:Few; Reference if 1:Many.                               |
| **Foreign Key**    | **ObjectId** / Reference        | **Postgres**: DB enforces constraint. **Mongo**: App application logic usually enforces it.              |
| **Transaction**    | **Transaction / Atomic Update** | **Postgres**: Use for everything. **Mongo**: Use atomic operators (`$inc`, `$set`) on single docs first. |

## When to use which?

### Choose PostgreSQL when:\*\*

- Requirements are strict (Financial, Billing).
- Data structure is highly relational and stable.
- Complex queries / Reporting is the primary use case.

### Choose MongoDB when:\*\*

- Data structure is evolving or unstructured (Content Management, Catalogs).
- High write throughput is needed (IoT, Logs).
- You need deep nesting/objects as first-class citizens.


---

## database-postgresql

### anti-patterns

# PostgreSQL Anti-Patterns ("Don't Do This")

Synthesized from the official Postgres Wiki.

## 1. Data Types

- **Don't use `money`**:
  - **Why?** Locale-dependent output, confusing rounding, hard to migrate.
  - **Do:** Use `numeric(precision, scale)` or integer (store cents).
- **Don't use `char(n)`**:
  - **Why?** Pads with spaces. 'a' becomes 'a '. Slower usually due to padding overhead.
  - **Do:** Use `text` or `varchar` (without length). `text` is the native optimized string type.
- **Don't use `serial`**:
  - **Why?** Old, non-standard, permissions hassle (sequence ownership).
  - **Do:** Use `GENERATED ALWAYS AS IDENTITY` (SQL Standard).
- **Don't use `timestamp` (without time zone)**:
  - **Why?** Assumes local server time. Breaks when server moves or users are global.
  - **Do:** Use `timestamptz`. Stores as UTC, displays in client timezone.

## 2. SQL Constructs

- **Don't use `NOT IN` with NULLs**:
  - **Why?** `val NOT IN (1, NULL)` evaluates to `NULL` (unknown), not `FALSE`.
  - **Do:** Use `NOT EXISTS` or `LEFT JOIN ... WHERE id IS NULL`.
- **Don't use `BETWEEN` for timestamps**:
  - **Why?** `BETWEEN` is inclusive. `2023-01-01` to `2023-02-01` includes midnight Feb 1st.
  - **Do:** `created_at >= '2023-01-01' AND created_at < '2023-02-01'`.
- **Don't use `UPPER CASE` identifiers**:
  - **Why?** Postgres folds unquoted identifiers to lowercase. `"UserTable"` != `UserTable`.
  - **Do:** Use `snake_case` for everything (`user_table`).

## 3. Operations

- **Don't use `psql -W`**:
  - **Why?** Prompts for password, preventing automation.
  - **Do:** Use `.pgpass` file or environment variables.
- **Don't use Rules (`CREATE RULE`)**:
  - **Why?** Complex, often rewritten unexpectedly. Can double-execute functions.
  - **Do:** Use Triggers (`CREATE TRIGGER`).
  - **Why?** Table bloat will kill performance and eventually database availability (transaction ID wraparound).
  - **Do:** Tune `autovacuum_vacuum_scale_factor` for large tables.

## 4. Concurrency Anti-Patterns

- **Don't hold transactions open**:
  - **Why?** Holds locks, prevents vacuuming of old row versions (bloat), increases deadlock risk.
  - **Do:** Commit as soon as the logical unit of work is done.
- **Don't use `LOCK TABLE`**:
  - **Why?** serializes all access to the table, killing performance.
  - **Do:** rely on Row-Level locks or advisory locks (`pg_advisory_lock`) if needed.


---

### best-practices

# PostgreSQL Detailed Best Practices

## 1. Indexing Strategy

- **B-Tree (Default)**: Use for `<`, `<=`, `=`, `>=`, `>`. Covers 95% of cases.
- **GIN (Generalized Inverted Index)**:
  - **JSONB**: `CREATE INDEX idx ON table USING GIN (data);` for `@>` containment operators.
  - **Full Text Search**: `tsvector` columns.
- **BRIN (Block Range Index)**: For very large tables with naturally ordered data (dates, IDs). Tiny index size.
- **Partial Indexes**:
  - `CREATE INDEX idx_users_active ON users (email) WHERE deleted_at IS NULL;`
  - Reduces index size and maintenance cost.
- **Covering Indexes**:
  - `CREATE INDEX idx_users_email ON users (email) INCLUDE (id, name);`
  - Allows Index-Only Scans (avoids heap lookup).

## 2. Performance Tuning

- **VACUUM & ANALYZE**:
  - **Autovacuum**: Must run frequently. Prevents table bloat and transaction ID wraparound.
  - **ANALYZE**: Updates statistics for query planner. Run manually after bulk inserts.
- **Connection Pooling**:
  - **PgBouncer**: Critical for high-concurrency apps (like Supabase/NestJS).
  - Postgres handles ~100 direct connections well; beyond that, performance degrades sharply.
- **Explain Analyze**:
  - `EXPLAIN (ANALYZE, BUFFERS) SELECT ...`
  - **Sequential Scan**: Bad on large tables (missing index?).
  - **Index Scan**: Good.
  - **Bitmap Heap Scan**: Okay for multiple index combinations.

## 3. RLS (Row Level Security)

- **Always Enable**: `ALTER TABLE secure_table ENABLE ROW LEVEL SECURITY;`
- **Performance Hazard**:
  - Functions in policies run **per row**.
  - Avoid complex joins in policies.
  - **Wrap Session Variables**:

    ```sql
    -- Bad (Function call per row)
    CREATE POLICY "User owns" ON items USING (auth.uid() = user_id);

    -- Better (Postgres caches stable functions, but be careful)
    -- Best: Ensure `auth.uid()` is stable or wrapped in `(SELECT auth.uid())`
    ```

- **Bypass RLS**: Create a `service_role` user with `BYPASS RLS` attribute for admin tasks only.

## 4. Partitioning

- **Declarative Partitioning**: Use for tables >100GB or with high delete rates (time-series).
- **By Range**: Dates (e.g., monthly partitions).
- **By List**: Status/Category.
- **Drop vs Delete**: `DROP TABLE partition_2023` is instantaneous; `DELETE FROM table WHERE year=2023` is slow and generates bloat.

## 5. Concurrency & Locking

- **Transaction Isolation**:
  - **Read Committed (Default)**: Sees data committed before the _query_ began.
  - **Repeatable Read**: Sees data committed before the _transaction_ began. Use for complex reports to ensure consistency.
  - **Serializable**: Strict but prone to serialization failures. Retry logic required.
- **Deadlock Avoidance**:
  - **Consistent Ordering**: Always update multiple rows in the same order (e.g., `ORDER BY id`).
  - **Short Transactions**: The longer a transaction holds locks, the higher the deadlock risk.
- **Explicit Locking**:
  - `SELECT ... FOR UPDATE`: Locks rows for update. Use with care.
  - `FOR UPDATE SKIP LOCKED`: Great for implementing work queues.

## 6. Monitoring & Diagnostics

- **`pg_stat_statements`**:
  - **Must-Have Extension**: Tracks execution stats of all SQL statements.
  - **Key Metrics**: `calls`, `total_exec_time`, `rows`, `shared_blks_hit` (cache hit rate).
- **Log Settings**:
  - `log_min_duration_statement`: Set to `1000` (1s) or `200` (200ms) to catch slow queries.
  - `log_checkpoints`: `on`. Helpful to diagnose I/O spikes.
  - `log_lock_waits`: `on` (if > `deadlock_timeout`). Useful for debugging blocking issues.

## 7. Extensions & Advanced Features

- **Common Extensions**:
  - `uuid-ossp` or `pgcrypto`: For UUID generation.
  - `pg_trgm`: For fuzzy search / trigram matching (better than `LIKE '%...%'`).
  - `postgis`: Industry standard for geospatial data.
- **JSONB Indexing**:
  - Use `gin` index for efficient JSON queries (`@>`, `?`, `?&`).
  - Avoid over-using JSONB for stable, relational data.


---

### checklist

# PostgreSQL Review Checklist

Use this checklist before finalizing any schema migration or complex query.

## Schema Design

- [ ] **PKs Usage**: Every table has a Primary Key? (BigInt or UUID).
- [ ] **Data Types**:
  - [ ] No `char(n)`, `varchar(n)`, `money`, `float` (for money).
  - [ ] Timestamps are `timestamptz`.
- [ ] **Foreign Keys**: Index all Foreign Keys manually? (Check joins/cascades).
- [ ] **constraints**: Use `NOT NULL`, `CHECK`, and `UNIQUE` to enforce integrity at DB level.
- [ ] **Normalization**: roughly 3NF? (Avoid JSONB for relational data unless schema is truly dynamic).

## Performance (Query/Index)

- [ ] **Index Usage**: `EXPLAIN ANALYZE` shows Index Scan, not Seq Scan (for large tables)?
- [ ] **SARGable**: Queries use Index-friendly operators (`=`, `>`, `<`)? No `LIKE '%term'`.
- [ ] **No `SELECT *`**: Explicit column selection.
- [ ] **Pagination**: Using Key-set/Cursor pagination for infinite scrolls?

## Security

- [ ] **RLS Enabled**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` run?
- [ ] **Policies**: Policies created for SELECT, INSERT, UPDATE, DELETE?
- [ ] **Least Privilege**: Application user cannot `DROP TABLE` or `TRUNCATE`?

## Migrations

- [ ] **Locking**: Does the migration take heavy locks (`ACCESS EXCLUSIVE`)?
  - Alert: `ALTER TABLE ... ADD COLUMN ... DEFAULT ...` (Postgres 11+ is safe-ish, older is not).
  - Alert: `CREATE INDEX CONCURRENTLY` used for live tables?
- [ ] **Revertible**: Is there a down-migration?

## Concurrency & Monitoring

- [ ] **Transaction Size**: Are transactions kept short to avoid locking issues?
- [ ] **Deadlock Safety**: Do multi-row updates follow a consistent order (e.g., by ID)?
- [ ] **Logging**: Is `log_min_duration_statement` enabled in prod?
- [ ] **Analysis**: usage of `pg_stat_statements` checked for query tuning?


---

### implementation

# Implementation Examples

## Expand-Contract Migration

```sql
-- Step 1: Add new column (non-breaking)
ALTER TABLE orders ADD COLUMN status_v2 VARCHAR(50);

-- Step 2: Backfill
UPDATE orders SET status_v2 = status;

-- Step 3: Drop old column (after code deploys)
ALTER TABLE orders DROP COLUMN status;
ALTER TABLE orders RENAME COLUMN status_v2 TO status;
```


---

### sql-gotchas

# PostgreSQL Production Gotchas

## 🛡️ `UPDATE ... FROM` Query

The target table **cannot** be referenced inside a `JOIN` within the `FROM` clause. Use a comma-separated `FROM` list to avoid unexpected `INNER JOIN` behavior or syntax errors.

```sql
-- BAD
UPDATE users SET active = true FROM profiles JOIN users ON ...

-- GOOD
UPDATE users SET active = true FROM profiles WHERE users.id = profiles.user_id;
```

## 🌍 Timezone Confusion (`TIMESTAMP` vs `TIMESTAMPTZ`)

Always use `TIMESTAMPTZ`. Standard `TIMESTAMP` ignores the session timezone and can lead to silent data corruption when moving between servers or handling DST.

- `TIMESTAMPTZ`: Stores UTC internally, converts to session TZ on display.
- `TIMESTAMP`: Perspective-less wall clock time.

## ❓ The `NULL` Trait

In SQL, `NULL` is "unknown," not "empty."

- `val = NULL` → Returns `NULL` (falsy in `WHERE`).
- **Fix**: Use `val IS NULL` or `val IS NOT NULL`.
- **Note**: `NOT (val = 'x')` will skip rows where `val` is `NULL`. Use `IS DISTINCT FROM` for null-safe inequality.

## ⚡ Case-Insensitive Search (`ILIKE`)

`ILIKE` is convenient but ignores standard B-tree indexes.

- **Fix**: Use a functional index `CREATE INDEX ... ON table (LOWER(column))` or use the `pg_trgm` extension for GIN/GIST index support on pattern matching.

## 📦 `JSONB` Containment

Use the containment operator `@>` instead of `->>` for better performance on large JSONB columns.

```sql
-- FAST (Uses GIN index)
SELECT * FROM logs WHERE data @> '{"level": "error"}';

-- SLOW (Linear scan)
SELECT * FROM logs WHERE data->>'level' = 'error';
```


---

## database-redis

### best-practices

# Redis Detailed Best Practices

## 1. Caching & Memory Strategies

- **Cache-Aside (Lazy Loading)**:
  - App checks cache -> Miss -> Load from DB -> Set Cache -> Return.
- **TTL Jitter**:
  - `TTL = Base_TTL + Random(0, 10% of Base_TTL)`. Prevents "Cache Stampede".
- **Eviction Policies**:
  - `allkeys-lru`: Best for general caching where any key can be evicted.
  - `volatile-lru`: Best for mixed workloads (some keys persistent, some expiring).
- **Ziplist Optimization**: Redis uses `ziplist` for small hashes/lists/sets. Keep these structures small to leverage O(1) memory efficiency (check `hash-max-ziplist-entries` config).

## 2. Command Efficiency

- **O(N) Avoidance**:
  - NEVER use `KEYS` in production. Use `SCAN` (cursor-based iteration).
  - Use `UNLINK` instead of `DEL` for large keys to delete in a background thread.
  - Use `MGET`/`MSET` for batching, but be careful with extremely large batches as they still account for atomic operation time.
- **Lua Scripting**:
  - Use `EVALSHA` to run pre-loaded scripts. This ensures atomicity for complex operations (e.g., "Check if exists, increment, update TTL").
- **Limit Ranges**:
  - Unbounded `ZRANGE` or `LRANGE` on massive collections can choke the network. Always use `LIMIT` or small ranges.

## 3. Resilience & Cloud Patterns

- **Connection Pooling**: Mandatory. Use a pool (e.g., `ioredis` built-in or `generic-pool`) to avoid the high cost of TCP handshakes.
- **Regional Affinity**: Ensure the application and Redis cluster are in the same cloud region to minimize latency.
- **Hostname vs IP**: Always connect via hostname. Cloud providers may change IPs during failover or scaling.
- **Retry Logic**: Implement exponential backoff for connection retries.

## 4. Monitoring & Health

- **Key Metrics to Watch**:
  - **Cache Hit Ratio**: `keyspace_hits / (keyspace_hits + keyspace_misses)`. Low ratio indicates poor caching strategy.
  - **Memory RSS**: Total memory used by the process. If `RSS >> Dataset`, fragmentation is high.
  - **CPU Usage**: Watch for the "Main Thread" saturation. High CPU usually indicates an O(N) command spike.
  - **Connected Clients**: Monitor for sudden spikes (connection leaks).
- **In-Built Tools**:
  - `INFO MEMORY`: Detailed breakdown of memory usage.
  - `bigkeys`: Use `redis-cli --bigkeys` to find memory hogs.
  - `slowlog`: Regularly check `SLOWLOG GET` to identify poorly performing queries.

## 5. Security Architecture

- **ACLs (Redis 6+)**:
  - Move away from `requirepass`. Use `ACL SETUSER` to create least-privilege users (e.g., `read-only-user`).
- **Dangerous Commands**:
  - Rename or disable commands in `redis.conf`:
    - `rename-command FLUSHALL ""`
    - `rename-command CONFIG ""`
- **TLS**: Use TLS 1.2+ for all production traffic.


---

### checklist

# Redis Review Checklist

## Setup & Configuration

- [ ] **Connection Resilience**: Is a connection pool used with non-zero min/max settings?
- [ ] **Error Handling**: Are `ioredis` (or similar) error listeners attached to avoid unhandled rejections?
- [ ] **Security (ACL)**: Are specific users used instead of a global `requirepass`?
- [ ] **Security (TLS)**: Is TLS enabled for transit between app and Redis cluster?
- [ ] **Dangerous Commands**: Are `FLUSHALL`, `CONFIG`, and `KEYS` disabled or renamed?

## Performance & Commands

- [ ] **O(N) Avoidance**: strictly no `KEYS`? Are list/set scans using `SCAN`/`SSCAN`?
- [ ] **Background Deletion**: Are large keys being deleted with `UNLINK`?
- [ ] **Range Limits**: Do `ZRANGE`, `LRANGE`, and `HGETALL` have explicit limits or small expected sizes?
- [ ] **Lua/Atomicity**: Are multi-step updates using `EVALSHA` for atomicity?
- [ ] **Pipelining**: If performing bulk operations, is a pipeline used?

## Memory & Data Design

- [ ] **TTL**: strictly enforced on all ephemeral keys?
- [ ] **Jitter**: Is random jitter applied to TTLs for high-velocity cache keys?
- [ ] **Data Types**: Are Hashes used for object storage instead of full JSON strings?
- [ ] **Eviction Policy**: Is the `maxmemory-policy` aligned with the workload (e.g., `allkeys-lru`)?

## Monitoring & Ops

- [ ] **Instrumentation**: Are metrics like `Cache Hit Ratio` and `RSS Memory` being logged or exported?
- [ ] **Bigkeys Review**: Has the keyspace been scanned for unexpectedly large values?
- [ ] **Latency**: Have the most frequent scripts been benchmarked or checked via `SLOWLOG`?


---

