---
inclusion: manual
---

# References: java

> 5 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-java.md`.

## java-best-practices

### example

# Java Best Practices — Examples

## Static Factory Method

```java
public class User {
    private final String id;
    private final String name;

    private User(String id, String name) {
        this.id = Objects.requireNonNull(id);
        this.name = Objects.requireNonNull(name);
    }

    // Static factory over constructor
    public static User of(String id, String name) {
        return new User(id, name);
    }
}
```

## Composition over Inheritance

```java
public class OrderService {
    private final OrderRepository repo;   // Injected
    private final NotificationService notifier; // Injected

    public OrderService(OrderRepository repo, NotificationService notifier) {
        this.repo = Objects.requireNonNull(repo);
        this.notifier = Objects.requireNonNull(notifier);
    }

    public Order placeOrder(OrderRequest request) {
        Objects.requireNonNull(request, "request must not be null"); // Fail fast
        var order = Order.of(request);
        repo.save(order);
        notifier.send(order);
        return order;
    }
}
```

## Builder Pattern (4+ params)

```java
public class Pizza {
    private final int size;
    private final boolean cheese;
    private final boolean pepperoni;
    private final boolean mushrooms;

    private Pizza(Builder b) {
        this.size = b.size;
        this.cheese = b.cheese;
        this.pepperoni = b.pepperoni;
        this.mushrooms = b.mushrooms;
    }

    public static class Builder {
        private final int size;
        private boolean cheese;
        private boolean pepperoni;
        private boolean mushrooms;

        public Builder(int size) { this.size = size; }
        public Builder cheese() { this.cheese = true; return this; }
        public Builder pepperoni() { this.pepperoni = true; return this; }
        public Builder mushrooms() { this.mushrooms = true; return this; }
        public Pizza build() { return new Pizza(this); }
    }
}
// Usage: new Pizza.Builder(12).cheese().pepperoni().build()
```


---

## java-concurrency

### structured-concurrency

# Structured Concurrency Reference

## Virtual Threads (Loom)

Java 21 introduced Virtual Threads, which are lightweight threads managed by the JVM. You should use them for I/O-bound tasks.

### Basic Usage

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
} // Executor closes and waits for all tasks here
```

### StructuredTaskScope

For coordinating multiple related tasks (e.g., fetching data from multiple APIs), use `StructuredTaskScope`.

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.ExecutionException;

Response handle() throws ExecutionException, InterruptedException {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

        // Fork tasks
        // These run in virtual threads by default if scope is configured (default behavior varies by JDK preview status, checking docs recommended)
        // Generally usually wraps a virtual thread executor.

        Supplier<String> user  = scope.fork(() -> api.fetchUser());
        Supplier<Order> order = scope.fork(() -> db.fetchOrder());

        // Wait for all to finish or one to fail
        scope.join().throwIfFailed();

        // Both results are now available safely
        return new Response(user.get(), order.get());
    }
}
```


---

## java-language

### example

# Java Language — Examples

## Records + Pattern Matching (Java 21)

```java
// Record: immutable DTO, no boilerplate
public record User(String id, String name) {}
public record Order(String id, User owner, double total) {}

// Pattern Matching with Switch Expression
public String describe(Object obj) {
    return switch (obj) {
        case User(var id, var name) -> "User: " + name;        // Record pattern
        case Order o when o.total() > 1000 -> "Large order";   // Guard
        case String s when s.isBlank() -> "Empty string";
        case null -> "null value";
        default -> "Unknown: " + obj.getClass().getSimpleName();
    };
}
```

## Sealed Classes for Domain Modelling

```java
public sealed interface PaymentResult
    permits PaymentResult.Success, PaymentResult.Failure, PaymentResult.Pending {}

public record Success(String transactionId) implements PaymentResult {}
public record Failure(String reason) implements PaymentResult {}
public record Pending(String referenceId) implements PaymentResult {}

// Exhaustive switch (no default needed)
String message = switch (result) {
    case Success s -> "Paid: " + s.transactionId();
    case Failure f -> "Failed: " + f.reason();
    case Pending p -> "Pending: " + p.referenceId();
};
```

## Virtual Threads + Structured Concurrency (Java 21)

```java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var userTask = scope.fork(() -> userService.findById(userId));
    var ordersTask = scope.fork(() -> orderService.findByUser(userId));
    scope.join().throwIfFailed();

    return new DashboardData(userTask.get(), ordersTask.get());
}
```

## Streams + Optional

```java
// Prefer toList() over Collectors.toList() (Java 16+)
List<String> activeNames = users.stream()
    .filter(User::isActive)
    .map(User::name)
    .toList();

// Optional — map, filter, orElseThrow
String name = repo.findById(id)
    .filter(User::isActive)
    .map(User::name)
    .orElseThrow(() -> new UserNotFoundException(id));
```


---

## java-testing

### junit-template

# JUnit 5 Test Template

## Standard Test Class

```java
package com.example.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserService service;

    @Test
    @DisplayName("Should return active user when ID exists")
    void shouldReturnActiveUser() {
        // Arrange
        var userId = "123";
        var expectedUser = new User(userId, "Active");
        given(repository.findById(userId)).willReturn(Optional.of(expectedUser));

        // Act
        var result = service.getUser(userId);

        // Assert
        assertThat(result)
            .isPresent()
            .get()
            .extracting(User::status)
            .isEqualTo("Active");
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void shouldThrowWhenNotFound() {
        // Arrange
        var userId = "999";
        given(repository.findById(userId)).willReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> service.getUser(userId))
            .isInstanceOf(UserNotFoundException.class)
            .hasMessageContaining(userId);
    }
}
```


---

## java-tooling

### example

# Java Tooling — Examples

## Gradle Kotlin DSL with Java Toolchain

```kotlin
// build.gradle.kts
plugins {
    java
    id("com.diffplug.spotless") version "6.23.3"
    id("com.github.spotbugs") version "6.0.4"
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

spotless {
    java {
        googleJavaFormat()
        removeUnusedImports()
    }
}

spotbugs {
    effort.set(com.github.spotbugs.snom.Effort.MAX)
    reportLevel.set(com.github.spotbugs.snom.Confidence.LOW)
}
```

## Maven with Dependency Management

```xml
<!-- pom.xml -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## Multi-stage Docker (eclipse-temurin)

```dockerfile
# Build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts .
RUN ./gradlew dependencies --no-daemon
COPY src src
RUN ./gradlew bootJar --no-daemon

# Runtime stage (layered jar)
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## .sdkmanrc (JDK version lock)

```
java=21.0.2-tem
```


---

