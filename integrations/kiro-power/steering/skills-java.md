---
inclusion: manual
---

# Skills: java

> 5 skills. Load when editing java files.
> For code examples and implementation patterns, load `refs-java.md`.

## Index

# java Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **java-language** | `**/*.java`, `pom.xml`, `build.gradle` | record, sealed, switch, var, Optional, stream, VirtualThread, instanceof, text block |
| **java-testing** | `**/*Test.java`, `**/*IT.java` | @Test, @ParameterizedTest, Mockito, AssertJ, assertThat, JUnit, Testcontainers |
| java-tooling | `pom.xml`, `build.gradle`, `build.gradle.kts`, `.sdkmanrc` | mvnw, gradlew, spotbugs, checkstyle, spotless, eclipse-temurin |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| java-best-practices | refactor, SOLID, builder, factory, composition, immutable, Optional, checked exception, clean code |
| java-concurrency | Thread, Executor, synchronized, lock, CompletableFuture, StructuredTaskScope, VirtualThread, AtomicInteger, async, race condition |

> Load matched skills: `<SKILLS>/java/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### java-best-practices

---
name: java-best-practices
description: Apply core Effective Java patterns for robust, maintainable code. Use when applying SOLID principles, choosing between inheritance and composition, refactoring Java code smells, or reviewing class design.
metadata:
  triggers:
    files:
    - '**/*.java'
    keywords:
    - refactor
    - SOLID
    - builder
    - factory
    - composition
    - immutable
    - Optional
    - checked exception
    - clean code
---
# Java Best Practices

## **Priority: P1 (HIGH)**


## Implementation Guidelines

- **Immutability**: Prefer immutable objects (`final` fields, unmodifiable collections).
- **Access Modifiers**: Minimize visibility. Default to **package-private** (no modifier). Use `private` for all fields. Only `public` for API contracts.
- **Composition > Inheritance**: Favor `Has-A` over `Is-A`. Avoid deep hierarchies.
- **Constructors**: Use Static Factory Methods (`User.of()`) over complex constructors.
- **Builder Pattern**: Use for objects with 4+ parameters.
- **Exceptions**: Recoverable → Checked; Programming error → Unchecked.
- **Fail Fast**: Validate parameters (`Objects.requireNonNull`) at method start.
- **Interfaces**: Code to interfaces (`List`, `Map`), not implementations (`ArrayList`).
- **Dependency Injection**: Inject dependencies via constructor; don't create them internally.
- **Method References**: Use `String::toUpperCase` over `s -> s.toUpperCase()` where readable.

## Anti-Patterns

- **No Null Returns**: Return Optional<T> or empty collection instead.
- **No Empty Catch**: Log or rethrow; never swallow exceptions silently.
- **No God Class**: Split into focused classes following Single Responsibility Principle.
- **No Magic Numbers**: Extract named constants with clear meaning.
- **No Mutable Statics**: Avoid public static mutable fields (global state).

## References

- [Static Factory & Composition Examples](references/example.md)

---

### java-concurrency

---
name: java-concurrency
description: Implement modern concurrency with Virtual Threads and Structured Concurrency in Java. Use when implementing Java Virtual Threads (Java 21), Structured Concurrency with StructuredTaskScope, CompletableFuture pipelines, or debugging race conditions.
metadata:
  triggers:
    files:
    - '**/*.java'
    keywords:
    - Thread
    - Executor
    - synchronized
    - lock
    - CompletableFuture
    - StructuredTaskScope
    - VirtualThread
    - AtomicInteger
    - async
    - race condition
---
# Java Concurrency

## **Priority: P1 (HIGH)**


## Implementation Guidelines

- **Virtual Threads (Java 21)**: Use for high-throughput I/O. `Executors.newVirtualThreadPerTaskExecutor()`.
- **Structured Concurrency**: Use `StructuredTaskScope` to treat related tasks as single unit (Scope, Fork, Join).
- **Immutability**: Share immutable data between threads to avoid race conditions.
- **CompletableFuture**: Use for composing async pipelines (if not using Virtual Threads).
- **Atomic Variables**: Use `AtomicInteger`, `LongAdder` for simple counters.
- **Locks**: Prefer `ReentrantLock` / `ReadWriteLock` over `synchronized` for fine-grained control.
- **Thread Safety**: Document `@ThreadSafe` or `@NotThreadSafe`.

## Anti-Patterns

- **No new Thread()**: Use Executors or virtual threads; never create threads manually.
- **No Pooling Virtual Threads**: Virtual threads cheap; never pool them.
- **No Blocking in synchronized**: Pins carrier thread (Loom pitfall); use ReentrantLock instead.
- **No Shared Mutable State**: Share only immutable data between threads.
- **No Thread.stop/suspend**: Deprecated; use interruption or cancellation instead.

## References

- [StructuredTaskScope & VirtualThread Examples](references/structured-concurrency.md)

---

### java-language

---
name: java-language
description: Modern Java 21+ standards including Records, Pattern Matching, and Virtual Threads. Use when working with Java records, sealed classes, switch expressions, text blocks, Optional, or upgrading from older Java versions.
metadata:
  triggers:
    files:
    - '**/*.java'
    - 'pom.xml'
    - 'build.gradle'
    keywords:
    - record
    - sealed
    - switch
    - var
    - Optional
    - stream
    - VirtualThread
    - instanceof
    - text block
---
# Java Language Patterns

## **Priority: P0 (CRITICAL)**


## Implementation Guidelines

- **Records**: Use record for immutable DTOs/Value Objects. Records auto-generate equals, hashCode, toString. Avoid Lombok @Data on Pojos.
- **Local Variables**: Use **`var`** for inferred types. Explicitly type interface variables.
- **Switch**: Use Switch Expressions (->) and Pattern Matching over complex if/else chains.
- **Text Blocks**: Use **`"" (Text Blocks)`** for JSON, SQL, or multi-line strings.
- **Pattern Matching**: Use **`instanceof`** with pattern binding: `if (obj instanceof String s)`.
- **Sealed Classes**: Use sealed interface/class with permits clause for domain-driven restricted hierarchies. Switch expressions then exhaustive switch (compiler-verified).
- **Collections**: Use **`List.of()`**, **`Map.of()`**, and **`Set.of()`** for immutable collections.
- **Streams**: Use **`stream()`** pipelines for functional transformations. Use **`.toList()`** (Java 16+).
- **Optional**: Utilize **`Optional<T>`** for return types. Use **`.ifPresentOrElse()`** or **`.orElseThrow()`**.
- **Virtual Threads**: Favor **`Executors.newVirtualThreadPerTaskExecutor()`** for I/O-heavy workloads.

## Anti-Patterns

- **No Nulls**: Return Optional or empty collections; avoid null parameters.
- **No Raw Types**: Always use generics; never use raw List or Map.
- **No Old Switch**: Use switch expressions (->); avoid fall-through.
- **No Manual get/set**: Use Records or value objects instead.
- **No synchronized blocks**: Use java.util.concurrent or Virtual Threads instead.

## References

- [Records, Pattern Matching & Virtual Threads](references/example.md)

---

### java-testing

---
name: java-testing
description: Testing standards using JUnit 5, AssertJ, and Mockito for Java. Use when writing or reviewing Java unit tests, setting up parameterized tests, writing integration tests with Testcontainers, or working with Mockito mocks.
metadata:
  triggers:
    files:
    - '**/*Test.java'
    - '**/*IT.java'
    keywords:
    - "@Test"
    - "@ParameterizedTest"
    - Mockito
    - AssertJ
    - assertThat
    - JUnit
    - Testcontainers
---
# Java Testing Standards

## **Priority: P0 (CRITICAL)**


## Implementation Guidelines

- **JUnit 5 (Jupiter)**: Use **`@Test`**, **`@BeforeEach`**, and **`@AfterEach`**. Avoid JUnit 4 classes.
- **Fluent Assertions**: Use **`AssertJ (assertThat)`** over JUnit `assertEquals` — enhanced readability.
- **Naming**: Use **`MethodName_State_Result`** or **`@DisplayName("Check if X when Y")`**.
- **Parameterized Tests**: Use **`@ParameterizedTest`** with **`@ValueSource`**, **`@CsvSource`**, or **`@MethodSource`**.
- **Mocking Strategy**: Use **`Mockito`** with `@ExtendWith(MockitoExtension.class)` (JUnit 5). Use **`@Mock`**, **`@Spy`**, and **`@InjectMocks`**. NEVER mock data-only Records.
- **Integration Testing**: Use **`Testcontainers`** with `@Container` annotation for real databases (PostgreSQL/Redis) in integration tests (`*IT.java`).
- **Isolation**: Each test method MUST isolated and independent; use **`@DirtiesContext`** sparingly.
- **AssertJ Chaining**: Chain assertions for clarity: **`assertThat(result).isNotNull().hasSize(2).contains("X")`**.
- **Mocking verification**: Use **`verify(mock, times(1)).method()`** to audit side-effects.
- **Exceptions**: Use **`assertThatThrownBy(() -> ...)`** to verify specific Exception types and messages.

## Anti-Patterns

- **No Logic in Tests**: Keep tests declarative; no loops or if/else branching.
- **No System.out in Tests**: Use assertions; never print to stdout.
- **No Legacy Assertions**: Use `assertThat(a).isEqualTo(b)`, not `assertTrue(a == b)`.
- **No Shared State**: Tests must isolated and order-independent.

## References

- [Full JUnit 5 + Mockito + AssertJ Template](references/junit-template.md)

---

### java-tooling

---
name: java-tooling
description: Configure Maven, Gradle, and static analysis for Java projects. Use when setting up Java build tooling, configuring Spotless or Checkstyle, managing JDK versions with sdkman, writing Dockerfiles for Java services, or adding SpotBugs/SonarLint.
metadata:
  triggers:
    files:
    - 'pom.xml'
    - 'build.gradle'
    - 'build.gradle.kts'
    - '.sdkmanrc'
    keywords:
    - mvnw
    - gradlew
    - spotbugs
    - checkstyle
    - spotless
    - eclipse-temurin
---
# Java Tooling Standards

## **Priority: P2 (RECOMMENDED)**


## Implementation Guidelines

- **JDK Setup**: Use **`.sdkmanrc`** or **`.java-version`** to lock project to **LTS Support (17 or 21)**. Configure Gradle toolchain via `java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }` for reproducible builds.
- **Maven & Wrapper**: Use **`pom.xml`** with **`<dependencyManagement>`**. ALWAYS use **`mvnw`** wrapper.
- **Gradle & Catalog**: Prefer **`build.gradle.kts`** (Kotlin DSL) with **`libs.versions.toml`** (Version Catalog). Use **`gradlew`** wrapper.
- **Formatting**: Enforce **Google Style Guide** using **`Spotless`** (`googleJavaFormat()` plugin) or **`Checkstyle`**.
- **Static Analysis**: Integrate **`SpotBugs`** or **`SonarLint`** for deep analysis. Use **`Detekt`** if using Kotlin.
- **Docker**: Use **Multi-stage Dockerfiles**. Use **`eclipse-temurin`** as base image.
- **CI/CD**: Configure **GitHub Actions** or **GitLab CI** to run `mvnw test` or `gradlew build` on every PR.

## Anti-Patterns

- **No Global Installs**: Always use mvnw/gradlew wrappers; never rely on system Maven/Gradle.
- **No Fat Jars**: Prefer layered Docker images over uber-jars for better layer caching.
- **No Snapshots in Prod**: Never use -SNAPSHOT dependency versions in production builds.

## References

- [Gradle Kotlin DSL & Spotless Setup](references/example.md)

---

