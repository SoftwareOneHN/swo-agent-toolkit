---
inclusion: manual
---

# References: spring-boot

> 11 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-spring-boot.md`.

## spring-boot-api-design

### implementation

# API Design Implementation Examples

## Documented Controller

```java
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management")
public class UserController {

    @Operation(summary = "Create User", description = "Registers a new user.")
    @ApiResponse(responseCode = "201", description = "User created")
    @ApiResponse(responseCode = "400", description = "Invalid input",
        content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @PostMapping
    public UserResponse create(@Valid @RequestBody UserRequest body) {
        return service.create(body);
    }
}
```

## Global Error Mapping

```java
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    ProblemDetail handleNotFound(UserNotFoundException e) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        problem.setType(URI.create("https://api.example.com/errors/not-found"));
        return problem;
    }
}
```


---

## spring-boot-architecture

### implementation

# Architecture Implementation Examples

## Feature Package Structure

```text
com.myapp.order
├── OrderController.java    // REST API
├── OrderService.java       // Business Logic
├── OrderRepository.java    // Data Access
├── internal                // Package-private impl details
│   └── DefaultOrderService.java
└── dto
    ├── CreateOrderRequest.java
    └── OrderResponse.java
```

## Modern DTO with Records

```java
// Immutable DTO
public record CreateUserRequest(
    @NotBlank String username,
    @Email String email
) {}

@RestController
@RequestMapping("/api/v1/users")
class UserController {
    private final UserService service;

    // Constuctor Injection (Lombok @RequiredArgsConstructor implied or explicit)
    public UserController(UserService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateUserRequest req) {
        return service.register(req);
    }
}
```

## Global Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    ProblemDetail handleBusiness(BusinessException ex) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Business Rule Violation");
        return problem;
    }
}
```

## Immutable DTO with Java Record

```java
// Immutable DTO with Java Record
public record CreateOrderRequest(
    @NotBlank String productName,
    @Positive int quantity
) {}

public record OrderResponse(Long id, String productName, int quantity, String status) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(order.getId(), order.getProductName(), order.getQuantity(), order.getStatus().name());
    }
}
```


---

## spring-boot-best-practices

### implementation

# Best Practices Implementation Examples

## Constructor Injection (Standard)

```java
@Service
@RequiredArgsConstructor // Lombok generates constructor for final fields
public class OrderService {
    private final OrderRepository repository;
    private final PaymentGateway paymentGateway; // Immutable dependency

    public void process(Order order) {
        // ...
    }
}
```

## Type-Safe Configuration

```java
// Immutable configuration properties
@ConfigurationProperties(prefix = "app.security")
@Validated
public record SecurityProperties(
    @NotNull Duration tokenExpiration,
    @NotBlank String issuer
) {}

// Enabling it
@Configuration
@EnableConfigurationProperties(SecurityProperties.class)
class AppConfig {}
```

## Correct Logging

```java
@Slf4j
@Service
class PaymentService {
    void pay(String id) {
        // FAST: String concatenation only happens if debug is enabled
        log.debug("Processing payment for ID: {}", id);

        try {
            // ...
        } catch (Exception e) {
            // Log full stack trace
            log.error("Payment failed", e);
            throw e;
        }
    }
}
```


---

## spring-boot-data-access

### implementation

# Data Access Implementation Examples

## Transactional Strategy & Projections

```java
@Service
@Transactional(readOnly = true) // Default: Optimized for reads
public class UserService {
    private final UserRepository repo;

    // Returns a DTO (Record), not an Entity
    public List<UserSummary> listActive() {
        return repo.findAllActiveProjected();
    }

    @Transactional // Override: Read-Write transaction
    public void activate(UUID id) {
        repo.updateStatus(id, Status.ACTIVE);
    }
}
```

## Solving N+1 with EntityGraph

```java
public interface UserRepository extends JpaRepository<User, UUID> {

    // PROJECTION (Fastest for reads)
    // Spring Data automatically maps result to the Record
    @Query("SELECT new com.app.dto.UserSummary(u.username, u.email) FROM User u")
    List<UserSummary> findAllActiveProjected();

    // ENTITY GRAPH (Prevents N+1 for Entities)
    // Eagerly loads 'roles' attribute
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findWithRolesByUsername(String username);
}
```

## Repository with Projection and EntityGraph

```java
// Repository with projection and EntityGraph to avoid N+1
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "customer"})
    @Query("SELECT o FROM Order o WHERE o.status = :status")
    Slice<Order> findByStatus(@Param("status") OrderStatus status, Pageable pageable);

    // Record projection for read-only queries
    @Query("SELECT new com.app.order.OrderSummary(o.id, o.total, o.status) FROM Order o WHERE o.customerId = :cid")
    List<OrderSummary> findSummariesByCustomer(@Param("cid") Long customerId);
}
```


---

## spring-boot-deployment

### implementation

# Deployment Implementation Examples

## Dockerfile (Layered JAR)

```dockerfile
# Builder Stage
FROM eclipse-temurin:21-jre as builder
WORKDIR /app
COPY target/myapp.jar app.jar
# Extract layers
RUN java -Djarmode=layertools -jar app.jar extract

# Runtime Stage
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copy layers (Dependencies change rarely -> Cached)
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

# Fast startup
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

## Enabling Graceful Shutdown

```properties
# application.properties
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=20s
```

## Multi-Stage Layered Dockerfile (Non-Root)

```dockerfile
# Multi-stage layered Dockerfile
FROM eclipse-temurin:21-jre AS builder
WORKDIR /app
COPY target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
USER app
WORKDIR /app
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/application/ ./
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "org.springframework.boot.loader.launch.JarLauncher"]
```


---

## spring-boot-microservices

### implementation

# Microservices Implementation Examples

## Declarative HTTP Client (Spring 6+)

```java
// Definition (in Shared Library)
public interface InventoryClient {
    @GetExchange("/inventory/{sku}")
    InventoryCheck checkStock(@PathVariable String sku);
}

// Config & Usage
@Configuration
class ClientConfig {
    @Bean
    InventoryClient inventoryClient(WebClient.Builder builder) {
        WebClient client = builder.baseUrl("http://inventory-service").build();
        return HttpServiceProxyFactory.builder(WebClientAdapter.forClient(client))
            .build().createClient(InventoryClient.class);
    }
}
```

## Spring Cloud Stream (Kafka/RabbitMQ)

```java
@Configuration
public class EventHandlers {

    // Functional Bean definition
    // Binds to: orderProcessed-in-0 (defined in .yml)
    @Bean
    public Consumer<OrderPlacedEvent> orderProcessed() {
        return event -> {
            log.info("Received order: {}", event.orderId());
            // Idempotent Logic
        };
    }
}
```

## Feign Client with Circuit Breaker

```java
@FeignClient(name = "order-service", fallback = OrderClientFallback.class)
public interface OrderClient {
    @GetMapping("/api/orders/{id}")
    OrderDto getOrder(@PathVariable String id);
}

@Component
public class OrderClientFallback implements OrderClient {
    @Override
    public OrderDto getOrder(String id) {
        return OrderDto.empty(); // cached or default response
    }
}
```

## Event Consumer with Idempotency

```java
@Bean
public Consumer<OrderCreatedEvent> processOrder() {
    return event -> {
        log.info("Processing order: {}", event.orderId());
        // Idempotency: check if already processed
        if (orderStore.exists(event.orderId())) return;
        orderStore.save(event);
    };
}
```


---

## spring-boot-observability

### implementation

# Observability Implementation Examples

## Structured Logging (Logback XML)

```xml
<!-- logback-spring.xml -->
<!-- Requires dependency: net.logstash.logback:logstash-logback-encoder -->
<configuration>
    <appender name="JSON_CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <!-- Include TraceID/SpanID from MDC -->
            <includeMdcKeyName>traceId</includeMdcKeyName>
            <includeMdcKeyName>spanId</includeMdcKeyName>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="JSON_CONSOLE" />
    </root>
</configuration>
```

## Trace Propagation (Async)

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    // Wrap Executor to propagate Trace Context to new threads
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.initialize();
        return new ContextAwareTaskExecutor(executor); // or Micrometer wrapper
    }
}
```

## Application YAML Tracing Config

```yaml
# application.yaml
management:
  tracing:
    sampling:
      probability: 1.0
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      probes:
        enabled: true

logging:
  pattern:
    correlation: "[${spring.application.name:},%X{traceId:-},%X{spanId:-}]"
```

## Structured Logging with MDC

```java
import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Service
public class OrderService {
    public Order process(OrderRequest req) {
        MDC.put("userId", req.userId());
        try {
            log.info("Processing order", kv("productId", req.productId()), kv("quantity", req.quantity()));
            return orderRepository.save(new Order(req));
        } finally {
            MDC.clear();
        }
    }
}
```


---

## spring-boot-scheduling

### implementation

# Scheduling Implementation Examples

## Distributed Scheduled Task (Safe)

```java
@Service
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "10m")
public class ReportScheduler {

    @Scheduled(cron = "0 0 12 * * *") // Daily at noon
    @SchedulerLock(
        name = "dailyReport",
        lockAtLeastFor = "5m", // Don't run again for 5m even if task finishes instantly
        lockAtMostFor = "1h"   // Release lock after 1h even if task hangs
    )
    public void generateDailyReport() {
        // ...
    }
}
```

## Scheduler Pool Configuration

```java
@Configuration
public class SchedulerConfig {
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5); // Allow 5 concurrent schedules
        scheduler.setThreadNamePrefix("scheduled-task-");
        return scheduler;
    }
}
```

## ShedLock with Error Handling

```java
@Slf4j
@Component
@EnableScheduling
public class ReportScheduler {

    @Scheduled(cron = "0 0 2 * * *") // 2 AM daily
    @SchedulerLock(name = "dailyReport", lockAtMostFor = "PT30M", lockAtLeastFor = "PT5M")
    public void generateDailyReport() {
        try {
            log.info("Starting daily report generation");
            reportService.generate();
        } catch (Exception e) {
            log.error("Daily report failed", e);
        }
    }
}
```


---

## spring-boot-security

### implementation

# Security Implementation Examples

## Modern Security Configuration (Lambda DSL)

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Replaces @EnableGlobalMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF (Disable for Stateless JWT APIs, Enable for Session/Cookie)
            .csrf(csrf -> csrf.disable())

            // 2. Stateless Session
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 3. Authorization Rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())

            // 4. JWT Filter (Add before UsernamePasswordAuthenticationFilter)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

## Method Level Security

```java
@Service
public class OrderService {

    @PreAuthorize("hasAuthority('SCOPE_order:write')")
    public void createOrder(OrderRequest req) {
        // ...
    }
}
```

## SecurityFilterChain with OAuth2 JWT

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable()) // Stateless API
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .build();
}
```


---

## spring-boot-testing

### implementation

# Testing Implementation Examples

## Controller Slice Test (Fast)

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mvc;
    @MockBean UserService service; // Mocks the business layer

    @Test
    void shouldCreateUser() throws Exception {
        when(service.create(any())).thenReturn(new UserResponse("1", "alice"));

        mvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""
                    {"username": "alice"}
                ""))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.username").value("alice"));
    }
}
```

## Integration Test with Testcontainers (Modern Boot 3.1+)

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class FullStackTest {
    // @ServiceConnection automatically maps spring.datasource.* properties
    // No need for @DynamicPropertySource!
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Test
    void flow() {
        // DB is ready to use
    }
}
```

## Order Controller Slice Test

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired MockMvc mockMvc;
    @MockBean OrderService orderService;

    @Test
    void shouldReturn404WhenOrderNotFound() throws Exception {
        given(orderService.findById(99L)).willThrow(new OrderNotFoundException(99L));

        mockMvc.perform(get("/api/orders/99"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.detail").value("Order 99 not found"));
    }

    @Test
    void shouldCreateOrder() throws Exception {
        given(orderService.create(any())).willReturn(new OrderResponse(1L, "Widget", 5, "PENDING"));

        mockMvc.perform(post("/api/orders")
                .contentType(APPLICATION_JSON)
                .content(""
                    {"productName": "Widget", "quantity": 5}
                    ""))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1));
    }
}
```


---

### testing-template

# Modern Integration Testing Template

This reference demonstrates the "Base Class" pattern for Integration Tests using Spring Boot 3.1+ and Testcontainers.

> [!TIP]
> Use this pattern to avoid spinning up new containers for every test class. Reusing containers significantly speeds up test suites.

````java
package com.example.demo;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 1. Meta-Annotation to reduce boilerplate on Test classes
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public @interface IntegrationTest {}

// 2. Base Class (Alternative to Meta-Annotation if shared state is needed)
// Usage: class UserFlowTest extends BaseIntegrationTest { ... }
public abstract class BaseIntegrationTest {

    // 3. ServiceConnection (Spring Boot 3.1+): Automatically configures spring.datasource.url/username/password
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withReuse(true); // experimental feature to keep container alive across runs
}

## Slice Test Templates

### Web Layer (@WebMvcTest)

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mvc;
    @MockBean UserService service;

    @Test
    void shouldReturnUser() throws Exception {
        when(service.findById(1L)).thenReturn(new User(1L, "Alice"));

        mvc.perform(get("/users/1"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.name").value("Alice"));
    }
}
````

## Data Layer (@DataJpaTest)

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Import(TestcontainersConfig.class)
class UserRepositoryTest {
    @Autowired UserRepository repo;

    @Test
    void shouldPersistUser() {
        repo.save(new User("Bob"));
        assertThat(repo.findByName("Bob")).isPresent();
    }
}
```


---

