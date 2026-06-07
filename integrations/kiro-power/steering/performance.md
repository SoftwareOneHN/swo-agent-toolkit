---
inclusion: manual
---

# Performance Optimization Workflow

## Khi nào dùng
- User nói "optimize", "performance", "slow", "latency", "memory"
- Profiling results cần phân tích
- Database queries chậm
- API response time cao

## Skills to Load

```
load_skills {
  keywords: ["performance", "optimize", "scalability", "latency"]
}
```

## Process

### Step 1: Measure First

**KHÔNG optimize mà không có metrics.**

- Identify bottleneck (profiler, logs, APM)
- Establish baseline (current latency/throughput/memory)
- Set target (acceptable threshold)

### Step 2: Categorize Issue

| Category | Symptoms | Common Fixes |
|----------|----------|--------------|
| **CPU-bound** | High CPU, slow computation | Algorithm optimization, caching, parallelism |
| **I/O-bound** | Waiting on network/disk | Async, batching, connection pooling |
| **Memory** | High RSS, GC pressure | Reduce allocations, streaming, pagination |
| **Database** | Slow queries, N+1 | Indexing, query optimization, eager loading |
| **Network** | High latency, many requests | Batching, caching, CDN, compression |

### Step 3: Apply Fixes (Priority Order)

1. **Algorithm** — O(n²) → O(n log n) gives biggest wins
2. **Caching** — Avoid repeated computation/fetches
3. **Batching** — Reduce round-trips (N+1 → 1 query)
4. **Async** — Don't block on I/O
5. **Indexing** — Database query optimization
6. **Pooling** — Reuse connections/resources

### Step 4: Verify Improvement

- Re-measure with same methodology
- Compare against baseline
- Ensure no regression in correctness

## Common Anti-Patterns

| Anti-Pattern | Impact | Fix |
|---|---|---|
| Premature optimization | Wasted effort, complex code | Measure first, optimize bottlenecks |
| N+1 queries | O(n) DB calls | Eager loading, batch queries |
| Unbounded queries | Memory explosion | Pagination, LIMIT |
| Sync I/O in hot path | Thread blocking | Async/await, non-blocking I/O |
| No connection pooling | Connection overhead | Pool with max connections |
| String concatenation in loop | O(n²) memory | StringBuilder/join |
| Loading full objects | Unnecessary data transfer | Select only needed fields |
| Missing indexes | Full table scans | Add composite indexes |

## Database Performance Checklist

- [ ] Queries use indexes (EXPLAIN ANALYZE)
- [ ] No N+1 (eager load or batch)
- [ ] Pagination on list endpoints
- [ ] Connection pooling configured
- [ ] Slow query logging enabled
- [ ] No SELECT * (only needed columns)

## API Performance Checklist

- [ ] Response time < 200ms (p95)
- [ ] Pagination on collections
- [ ] Caching headers (ETag, Cache-Control)
- [ ] Compression (gzip/brotli)
- [ ] No blocking operations in request handler
- [ ] Rate limiting to prevent abuse
