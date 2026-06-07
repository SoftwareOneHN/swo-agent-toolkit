---
inclusion: manual
---

# Skills: spring-boot

> 10 skills. Load when editing spring-boot files.
> For code examples and implementation patterns, load `refs-spring-boot.md`.

## Index

# spring-boot Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **spring-boot-api-design** | `**/*Controller.java` | openapi, swagger, versioning, problemdetails |
| **spring-boot-architecture** | `pom.xml`, `build.gradle` | structure, layering, dto, controller, @RestController, @Service, @Repository, @Entity, @Bean, @Configuration |
| **spring-boot-best-practices** | `application.properties`, `**/*Service.java` | autowired, requiredargsconstructor, configuration-properties, slf4j |
| **spring-boot-data-access** | `**/*Repository.java`, `**/*Entity.java` | jpa-repository, entity-graph, transactional, n-plus-1 |
| **spring-boot-deployment** | `compose.yml` | Dockerfile, docker-layer, native-image, graceful-shutdown |
| **spring-boot-microservices** | `**/*Client.java`, `**/*Consumer.java` | feign-client, spring-cloud-stream, rabbitmq, resilience4j |
| **spring-boot-observability** | `logback-spring.xml`, `application.properties` | micrometer, tracing, correlation-id, mdc |
| **spring-boot-scheduling** | `**/*Scheduler.java`, `**/*Job.java` | scheduled, shedlock, cron |
| **spring-boot-security** | `**/*SecurityConfig.java`, `**/*Filter.java` | security-filter-chain, lambda-dsl, csrf, cors |
| **spring-boot-testing** | `**/*Test.java` | webmvctest, datajpatest, testcontainers, assertj |

> Load matched skills: `<SKILLS>/spring-boot/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### spring-boot-api-design

---
name: spring-boot-api-design
description: Design Spring Boot APIs with OpenAPI, Versioning, and Global Error Handling. Use when designing Spring Boot APIs with OpenAPI specs, versioning, or global error handling.
metadata:
  triggers:
    files:
    - '**/*Controller.java'
    keywords:
    - openapi
    - swagger
    - versioning
    - problemdetails
---
# Spring Boot API Design Standards

## **Priority: P0**

## Implementation Guidelines

### OpenAPI (Swagger)

- **SpringDoc**: Use `springdoc-openapi-starter-webmvc-ui`.
- **Annotations**: Use `@Operation` and `@ApiResponse`. Keep clean.
- **Schema**: Define examples in `@Schema` on DTOs.

### API Versioning

- **Strategy**: Prefer **URI Versioning** (`/api/v1/`) for caching simplicity.
- **Deprecation**: Use `@Deprecated` + OpenAPI flag.

### Error Handling (RFC 7807)

- **ProblemDetails**: Enable `spring.mvc.problem-details.enabled=true`.
- **Extension**: Extend `ProblemDetail` with custom fields if needed.
- **Security**: NEVER expose stack traces in API errors.

## Anti-Patterns

- **No Map<K,V> responses**: Return typed DTO records instead.
- **No Header Versioning**: Use URI versioning; headers hard to test/cache.
- **No hidden APIs**: Document all endpoints with Swagger/OpenAPI.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-architecture

---
name: spring-boot-architecture
description: Structure Spring Boot 3+ projects with feature packaging and clean layering. Use when structuring Spring Boot 3 projects, defining layers, or applying architecture patterns.
metadata:
  triggers:
    files:
    - 'pom.xml'
    - 'build.gradle'
    keywords:
    - structure
    - layering
    - dto
    - controller
    - "@RestController"
    - "@Service"
    - "@Repository"
    - "@Entity"
    - "@Bean"
    - "@Configuration"
---
# Spring Boot Architecture Standards

## **Priority: P0 (CRITICAL)**

## Organize by Feature

- **Package by Feature**: Prefer `com.app.feature` (e.g., `user`, `order`) over technical layers (`controllers`) for scalability.
- **Dependency Rule**: Outer layers (Web) depend on Inner (Service). Inner layers MUST NOT depend on Outer.
- **DTO Pattern**: ALWAYS use DTOs for API inputs/outputs. NEVER return `@Entity` directly.
- **Java Records**: Use `record` for DTOs to ensure immutability (Java 17+).

See [implementation examples](references/implementation.md) for Java Record DTOs, controller patterns, and global exception handling.

## Define Layer Responsibilities

1. **Controller (Web)**: Handle HTTP, Validation (`@Valid`), DTO mapping. Delegate logic to Service.
2. **Service (Business)**: Transaction boundaries, orchestration. Returns Domain/DTOs.
3. **Repository (Data)**: Database interactions only. Returns Entities/Projections.

## Design API Layer

- **Global Error Handling**: Use `@RestControllerAdvice` with `ProblemDetails` (RFC 7807).
- **Validation**: Use Jakarta Bean Validation (`@NotNull`, `@Size`) on DTOs.
- **Response**: Use `ResponseEntity` for explicit status or `ResponseStatusException`.

## Verification Checklist (Mandatory)

- [ ] **No Entities in API**: all API responses using DTOs/Records instead of JPA Entities?
- [ ] **Validation**: `@Valid` and Jakarta Bean Validation constraints present on all input DTOs?
- [ ] **Layer coupling**: Services depend on Controllers? (Prohibited)
- [ ] **Transactionality**: business transactions correctly bounded with `@Transactional` in Service layer?
- [ ] **Error Details**: `ProblemDetails` used for consistent error responses?

## Anti-Patterns

- **No Fat Controllers**: Move business logic to Services.
- **No Leaking Entities**: Use DTOs instead of JPA Entities in APIs.
- **No Circular Dependencies**: Use Events or refactor to decouple services.
- **No God Classes**: Split large services into single-responsibility components.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-best-practices

---
name: spring-boot-best-practices
description: Apply core coding standards, dependency injection, and configuration for Spring Boot 3. Use when applying Spring Boot 3 coding standards or configuring dependency injection.
metadata:
  triggers:
    files:
    - 'application.properties'
    - '**/*Service.java'
    keywords:
    - autowired
    - requiredargsconstructor
    - configuration-properties
    - slf4j
---
# Spring Boot Best Practices

## **Priority: P0**

## Implementation Guidelines

### Dependency Injection (DI)

- **Constructor Injection**: ALWAYS use **Constructor Injection** for immutability. Use **`@RequiredArgsConstructor`** (Lombok) to reduce boilerplate. Mark all dependencies as **`final`**.
- **Avoid @Autowired**: NEVER use field injection. It prevents unit testing without Spring context and hides dependencies.

### Configuration & Data

- **Type-Safe Config**: Use `@ConfigurationProperties` with Records (Java 17+) instead of `@Value`. Use Spring profile-specific files (e.g., `application-dev.yml`, `application-prod.yml`) and set active profile via `SPRING_PROFILES_ACTIVE`. Never hardcode secret values in properties files.
- **Validation**: Combine with **`@Validated`** and **Jakarta Bean Validation** (`@NotNull`, `@NotEmpty`) to fail fast at startup. Use **`application.yaml`** for structured configuration.
- **DTOs**: Use **`records`** as immutable **DTOs** to reduce boilerplate and ensure thread safety. Handle empty values with **`Optional`** to avoid `NullPointerException`.

### Observability & Quality

- **Error Handling**: Implement **`@ControllerAdvice`** and **`ProblemDetails` (RFC 7807)** for standardized error responses.
- **Logging**: Use **`SLF4J`** with **`@Slf4j`**. Implement **Structured Logging** by logging arguments (`log.info("id: {}", id)`).
- **Tooling**: Mandate **`Spotless`** or **`Checkstyle`** for code formatting. Use **`sdkman`** to manage JDK 21+ versions.

## Anti-Patterns

- **No @Autowired on fields**: Use constructor injection via @RequiredArgsConstructor.
- **No Setters on dependencies**: Declare all injected fields as final.
- **No context.getBean()**: Inject dependencies via constructor DI.
- **No log-and-swallow**: Rethrow or handle exceptions explicitly.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-data-access

---
name: spring-boot-data-access
description: Optimize JPA, Hibernate, and database interactions in Spring Boot. Use when implementing JPA entities, repositories, or database access in Spring Boot.
metadata:
  triggers:
    files:
    - '**/*Repository.java'
    - '**/*Entity.java'
    keywords:
    - jpa-repository
    - entity-graph
    - transactional
    - n-plus-1
---
# Spring Boot Data Access

## **Priority: P0**

## Configure JPA and Spring Data

- **Read-Only**: Default to **`@Transactional(readOnly = true)`** on Services to optimize DB resources.
- **Projections**: Use **`Java Records`** for **Read-Only** query results. Avoid fetching full **`@Entity`** objects when not necessary.
- **Pagination**: ALWAYS use **`Pageable`** and **`Slice`** (or `Page`) to prevent loading massive datasets.
- **Spring Data**: Prefer **`JpaRepository`** and **`Query methods`**. Use **`@Query`** with JPQL for complex logic. Use Flyway or Liquibase for migrations; never use `ddl-auto=create` in production.

See [implementation examples](references/implementation.md) for repository projections, EntityGraph, and transactional patterns.

## Optimize Queries and Transactions

- **N+1 Problem**: Fix **`N+1`** selects using **`JOIN FETCH`** (JPQL) or **`@EntityGraph`**.
- **Open-In-View**: Set `spring.jpa.open-in-view=false` in **`application.yaml`**.
- **Bulk Operations**: Use **`@Modifying`** with `@Query` for updates/deletes to bypass EntityManager overhead.
- **Connection Pool**: Configure **`HikariCP`** with explicit `maximum-pool-size`. Tune Hikari pool-size based on expected concurrent queries.

## Anti-Patterns

- **No N+1 Selects**: Use **`JOIN FETCH`** or **`@EntityGraph`** instead of lazy-loading in loops.
- **Entity Inflation**: Don't use `@Data` (Lombok) on Entities as it breaks Proxy and `hashCode`/`equals` performance.
- **Transactional Leak**: Don't put `@Transactional` on public `Repository` methods if `Service` already transactional.
- **Raw SQL**: Avoid native SQL unless JPQL/Criteria API insufficient.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-deployment

---
name: spring-boot-deployment
description: Deploy Spring Boot apps with Docker, GraalVM native images, and graceful shutdown. Use when deploying Spring Boot apps as GraalVM native images, containers, or configuring shutdown.
metadata:
  triggers:
    files:
    - 'compose.yml'
    keywords:
    - Dockerfile
    - docker-layer
    - native-image
    - graceful-shutdown
---
# Spring Boot Deployment Standards

## **Priority: P0**

## Containerize with Docker

- **Buildpacks**: Use **`bootBuildImage`** (Gradle) or **`spring-boot:build-image`** (Maven) for OCI-compliant images.
- **Layered JAR**: Use **`Layered JAR`** support to optimize **Build Cache**. Use multi-stage **`Dockerfile`**.
- **Security**: Run as **`non-root`** user. Use **`eclipse-temurin`** or Distroless as base image.
- **Secrets**: NEVER commit secrets to Git. Inject via environment variables, Kubernetes Secrets, or Vault (spring.config.import). Never bake secrets into image layers.

See [implementation examples](references/implementation.md) for multi-stage layered Dockerfile and graceful shutdown configuration.

## Build GraalVM Native Images (AOT)

- **Use Case**: **Serverless** or CLI tools requiring **instant startup** and low memory footprint.
- **Constraints**: Use **`AOT`** transformations. Register reflection with **`RuntimeHints`** if needed.
- **Health Checks**: Include **`Actuator`** endpoints specifically for **Liveness** and **Readiness** probes.

## Tune Resources and Shutdown

- **Graceful Shutdown**: Enable **`server.shutdown=graceful`** with 30s timeout.
- **Memory**: Use **`-XX:+UseContainerSupport`** and **`-XX:MaxRAMPercentage=75.0`**.
- **Log Management**: Log to **`stdout`** in **Structured JSON** for log aggregators.

## Anti-Patterns

- **No Fat JARs in Docker**: Use Layered JAR support for better caching.
- **No root container user**: Run as restricted user (appuser/nobody).
- **No baked-in secrets**: Use Env vars or ConfigMaps, never image layers.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-microservices

---
name: spring-boot-microservices
description: Standards for Feign clients and asynchronous messaging with Spring Cloud Stream. Use when implementing Feign HTTP clients or async event messaging in Spring Boot microservices.
metadata:
  triggers:
    files:
    - '**/*Client.java'
    - '**/*Consumer.java'
    keywords:
    - feign-client
    - spring-cloud-stream
    - rabbitmq
    - resilience4j
---
# Spring Boot Microservices Standards

## **Priority: P0**

## Implementation Guidelines

### Sync Communication (REST & API Interface)

- **Clients**: Use Spring Cloud OpenFeign or HTTP Interfaces (Spring 6/Java 21).
- **Resilience**: Implement Resilience4j with Circuit Breaker, Retry (Exponential Backoff), and RateLimiter.
- **Contracts**: Share DTO Records via Maven BOM or API Contract module.
- **Tracing**: Ensure Micrometer propagation for Distributed Tracing.

See [implementation examples](references/implementation.md) for Feign client with Circuit Breaker fallback.

### Async Communication (Spring Cloud Stream)

- **Architecture**: Use Message-Driven patterns with Spring Cloud Stream.
- **Functions**: Define message handlers as `java.util.function.Function`, `Consumer`, or `Supplier`.
- **Serialization**: Use JSON or Avro for events.
- **Reliability**: Implement Dead Letter Queues (DLQ) and idempotent consumers.

See [implementation examples](references/implementation.md) for Spring Cloud Stream event consumer with idempotency.

### Data & Isolation

- **DB per Service**: NEVER share databases between microservices.
- **Shared Libs**: Minimize shared logic to shared DTOs/Clients only.
- **Discovery**: Use Spring Cloud Gateway for routing and auth.

## Anti-Patterns

- **No Shared DB**: Services must communicate via APIs or Events only.
- **No Shared Entities**: Share DTOs via Maven BOM, never JPA entities.
- **No Sync Call Chains**: Use async messaging to prevent distributed monolith.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-observability

---
name: spring-boot-observability
description: Instrument Spring Boot with Micrometer metrics, distributed tracing, and structured logging. Use when adding Micrometer metrics, distributed tracing, or structured logging to Spring Boot.
metadata:
  triggers:
    files:
    - 'logback-spring.xml'
    - 'application.properties'
    keywords:
    - micrometer
    - tracing
    - correlation-id
    - mdc
---
# Spring Boot Observability

## **Priority: P0**

## Implementation Workflow

1. Add tracing and metrics dependencies to `pom.xml`
2. Configure `application.yaml` for tracing, actuator, and log correlation
3. Add structured logging with MDC context
4. Verify with `curl localhost:8080/actuator/prometheus` and check trace IDs in logs

## Enable Distributed Tracing

- **Correlation IDs**: Enable trace/span ID injection.
- **Propagation**: Propagate context across threads (`@Async`) and clients.
- **OpenTelemetry**: Use OTel bridge (`micrometer-tracing-bridge-otel`).

See [implementation examples](references/implementation.md) for application.yaml tracing configuration and actuator exposure.

## Configure Structured Logging

- **Format**: Use JSON logging (`logstash-logback-encoder`) in production.
- **MDC**: Use MDC for contextual info (userId, tenantId). Always clear MDC in finally block.
- **Output**: Log to stdout only. Let container handle shipping.

See [implementation examples](references/implementation.md) for structured logging with MDC context and Logstash encoder.

## Secure Actuator Endpoints

- **Security**: Secure `/actuator/**` with Admin role.
- **Probes**: Enable K8s Liveness/Readiness probes.
- **Verify**: Run `curl localhost:8080/actuator/prometheus` to confirm metrics exposed.

## Anti-Patterns

- **No System.out**: Use @Slf4j for all structured logging.
- **No open Actuator**: Secure /actuator/** with Admin role.
- **No DIY tracing**: Use Micrometer with OTel bridge.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-scheduling

---
name: spring-boot-scheduling
description: Configure scheduled tasks and distributed locking with ShedLock in Spring Boot. Use when implementing @Scheduled tasks or distributed locking with ShedLock in Spring Boot.
metadata:
  triggers:
    files:
    - '**/*Scheduler.java'
    - '**/*Job.java'
    keywords:
    - scheduled
    - shedlock
    - cron
---
# Spring Boot Scheduling Standards

## **Priority: P0**

## Configure Scheduled Tasks

- **ThreadPool**: ALWAYS configure dedicated `TaskScheduler` (default 1 thread). Enable with `@EnableScheduling` annotation.
- **Async**: Keep `@Scheduled` methods light; offload to `@Async`/Queues. Wrap logic in try/catch; log errors and use `@Retryable` for retry on transient failures.

## Lock Tasks with ShedLock

- **Problem**: `@Scheduled` runs on ALL pods in K8s.
- **Solution**: Use **ShedLock** to guarantee single execution.
- **Config**: Set `lockAtMostFor` (deadlock safety) and `lockAtLeastFor` (debounce).

See [implementation examples](references/implementation.md) for ShedLock distributed task configuration and scheduler pool setup.

## Anti-Patterns

- **No Default Pool**: Configure dedicated TaskScheduler (default 1 thread).
- **No duplicates**: Use ShedLock for distributed cron in multi-pod deployments.
- **No task state**: Design tasks to idempotent; assume pod can restart.

## References

- [Implementation Examples](references/implementation.md)

---

### spring-boot-security

---
name: spring-boot-security
description: Configure Spring Security 6+ with Lambda DSL, JWT, and hardening rules. Use when configuring Spring Security 6+, OAuth2, JWT, or security hardening in Spring Boot.
metadata:
  triggers:
    files:
    - '**/*SecurityConfig.java'
    - '**/*Filter.java'
    keywords:
    - security-filter-chain
    - lambda-dsl
    - csrf
    - cors
---
# Spring Boot Security Standards

## **Priority: P0 (CRITICAL)**

## Configure SecurityFilterChain

- **Lambda DSL**: ALWAYS use Lambda DSL.
- **SecurityFilterChain**: Expose as `@Bean`. not extend `WebSecurityConfigurerAdapter`.
- **Statelessness**: Enforce `SessionCreationPolicy.STATELESS` for REST APIs.

See [implementation examples](references/implementation.md) for SecurityFilterChain configuration with Lambda DSL and JWT.

## Implement Authentication and Authorization

- **Authentication**: Validation of credentials (Who you?). Use `AuthenticationManager` or `JwtDecoder`.
- **Authorization**: Verification of access rights (Can you this?). Use `@PreAuthorize`.

## Secure JWT Tokens

- **Algorithm**: Enforce `RS256` or `HS256`. **Reject `none` algorithm**.
- **Claims**: Validate `iss`, `aud`, and `exp`.
- **Tokens**: Short-lived access tokens (15m), secure refresh tokens (httpOnly cookie).

## Hardening Checklist

- [ ] **CSRF**: Disabled for pure APIs? Enabled + Cookie for Browser Apps?
- [ ] **CORS**: Specific origins permitted? No `*` with credentials?
- [ ] **Headers**: HSTS, Content-Type-Options, X-Frame-Options enabled?
- [ ] **Secrets**: No hardcoded keys? Loaded from Vault/Env?
- [ ] **Rate Limiting**: Applied on login/expensive endpoints?
- [ ] **Dependencies**: Scanned for CVEs?

## Anti-Patterns

- **No Adapter**: Use `SecurityFilterChain` bean instead of extending legacy classes.
- **No .and()**: Use Lambda DSL for configuration.
- **No Secrets**: Load from Vault or Environment variables (never git).
- **No antMatchers**: Use `requestMatchers` (Spring Security 6+).

## References

- [Implementation Examples](references/implementation.md)
- common/security-standards
- architecture

---

### spring-boot-testing

---
name: spring-boot-testing
description: Write unit, integration, and slice tests for Spring Boot 3 applications. Use when writing unit tests, integration tests, or slice tests for Spring Boot 3 applications.
metadata:
  triggers:
    files:
    - '**/*Test.java'
    keywords:
    - webmvctest
    - datajpatest
    - testcontainers
    - assertj
---
# Spring Boot Testing Standards

## **Priority: P0**

## Follow TDD Workflow

1. **Red**: Write failing test (e.g., `returns 404`).
2. **Green**: Implement minimal code to pass.
3. **Refactor**: Clean up while keeping tests green.
4. **Coverage**: Verify with JaCoCo.

## Write Slice and Integration Tests

- **Real Infrastructure**: Use **Testcontainers** for DB/Queues. Avoid H2/Embedded.
- **Assertions**: Use **AssertJ** (`assertThat`) over JUnit assertions.
- **Isolation**: Use `@MockBean` for downstream dependencies in Slice Tests.

See [implementation examples](references/implementation.md) for WebMvcTest slice tests and Testcontainers integration tests.

## Anti-Patterns

- **No Dirty Contexts**: Avoid @MockBean in base classes; it reloads context per test.
- **No network I/O in tests**: Mock external calls with WireMock.
- **No System.out in tests**: Use AssertJ assertions instead.

## References

- [Implementation Examples](references/implementation.md)

---

