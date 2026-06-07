---
inclusion: manual
---

# Skills: swift

> 8 skills. Load when editing swift files.
> For code examples and implementation patterns, load `refs-swift.md`.

## Index

# swift Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **swift-language** | `**/*.swift` | protocol, extension, optional, guard, enum |
| **swift-testing** | `**/*Tests.swift` | XCTestCase, XCTestExpectation, XCTAssert |
| **swift-tooling** | `Package.swift`, `.swiftlint.yml` | package, target, dependency |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| **swift-best-practices** | guard, let, struct, final, swift idiomatic, swift naming, swift best practice, swift conventions, value type, immutability swift, guard let |
| **swift-concurrency** | async, await, actor, Task, MainActor |
| **swift-error-handling** | throws, try, catch, Result, Error |
| **swift-memory-management** | weak, unowned, capture, deinit, retain |
| **swift-swiftui** | @State, @Binding, @ObservedObject, View, body |

> Load matched skills: `<SKILLS>/swift/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### swift-best-practices

---
name: swift-best-practices
description: Apply Guard, Value Types, Immutability, and Naming conventions in Swift. Use when writing idiomatic Swift using guard, value types, immutability, or naming conventions.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - guard
    - let
    - struct
    - final
    - swift idiomatic
    - swift naming
    - swift best practice
    - swift conventions
    - value type
    - immutability swift
    - guard let
---
# Swift Best Practices

## **Priority: P0**

## Implementation Guidelines

### Control Flow (Guard over If)

- **Guard for Early Exit**: Use **`guard let`** over **nested if** statements for better readability and to unwrap optionals early.
- **Nested Checks**: Use **`guard`** for **precondition** checks at top of function to reduce nested depth.
- **Switch Exhaustiveness**: Always handle all cases; use **`@unknown default`** for freezing enums (enums from frameworks).
- **if-case**: Use **`if case .success(let value) = result`** for simple enum pattern matching.

### Value Types & Immutability

- **Prefer Structs**: **Default to struct** for **value semantics** and thread safety. Use `class` only when reference identity or **inheritance** required.
- **Immutability**: Always **default to let** for all properties and constants. Use `var` only when change required.
- **Modifiers**: Use **`final`** for all classes that not intended to subclassed to improve performance (static dispatch).
- **Static Dispatch**: Favor methods in structs and `final` classes.

### Naming & Style

- **Clear Intent**: Prefix booleans with **`is, has, or can`**. Example: **`isValid`**, `hasErrors`, **`canEdit`**. Makes boolean state clear.
- **API Guidelines**: Follow official **Swift API Design Guidelines**. Use **`camelCase`** for **clear names** and `PascalCase` for types.
- **Protocols**: Name protocols with **`-able`**, `-ible`, or `-ing` suffixes (e.g., `Codable`, `Identifiable`).
- **Opaque Types**: Use **`some View`** or `some Collection` for return types where underlying type internal.

### Collection Performance

- **Sequence API**: Use **`compactMap`**, **`filter`**, and **`reduce`** instead of explicit **for-where** loops for data transformations.
- **Lazy Collections**: Use **`.lazy`** for large sequences when result consumed partially.
- **Dictionaries**: Use **`default`** values in dictionary access to avoid double optional unwrapping.

## Anti-Patterns

- **No Pyramid of Doom**: Use **`guard`** for early exits.
- **No force unwrap**: Never use **`!`** on optionals. Use **`??`** (nil-coalescing) or **`if let`**.
- **No global var**: Avoid mutable global state. Use **Singletons** (accessed via `static let shared`) or DI.

## References

- [Guard Patterns & Immutability](references/implementation.md)

---

### swift-concurrency

---
name: swift-concurrency
description: Implement async/await, Actors, and structured concurrency in Swift. Use when implementing Swift async/await, Actors, or structured concurrency in iOS/macOS.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - async
    - await
    - actor
    - Task
    - MainActor
---
# Swift Concurrency

## **Priority: P0**

## Write Structured Async Code

- **Async Functions**: Mark with **`async`** and call with **`await`**.
- **`async let`**: Use **`async let`** for parallel execution when multiple tasks independent.
- **Task Groups**: Use **`withTaskGroup`** or `withThrowingTaskGroup` for spawning dynamic number of tasks.
- **Error Handling**: Combine with **`throws`**. Always handle `CancellationError`.

See [implementation examples](references/implementation.md) for parallel fetch with `async let` and Task Groups.

## Isolate State with Actors

- **Data Isolation**: Use **`actor`** for shared mutable state to avoid data races.
- **`@MainActor`**: Annotate UI classes (Views, ViewModels) with **`@MainActor`** for main thread execution. Use **`MainActor.run { ... }`** for inline UI updates in async blocks.
- **Global Actors**: Use **`@GlobalActor`** for specific thread-bound resources.
- **nonisolated**: Use **`nonisolated`** for methods that don't access actor state to avoid unnecessary hops.

See [implementation examples](references/implementation.md) for Actor-based state isolation and `nonisolated` methods.

## Manage Task Lifecycle

- **Task Hierarchy**: Inherit isolation by using **`Task { ... }`**.
- **Cancellation**: Explicitly check **`Task.isCancelled`** in long loops. Use **`try Task.checkCancellation()`** for throwing functions.
- **Detached Tasks**: Avoid **`Task.detached`** unless you explicitly want to break context inheritance.

## Anti-Patterns

- **No synchronous work in @MainActor**: not block main thread.
- **No UI updates off @MainActor**: Always dispatch back to main via **`MainActor`**.
- **No ignored cancellation**: Always check and propagate cancellation.

## References

- [async/await & Actors](references/implementation.md)

---

### swift-error-handling

---
name: swift-error-handling
description: Standards for throwing functions, Result type, and Never. Use when implementing Swift error throwing, designing error hierarchies, using Result types, or adding do-catch blocks.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - throws
    - try
    - catch
    - Result
    - Error
---
# Swift Error Handling

## **Priority: P0**

## Workflow: Add Error Handling to Swift Function

1. Define custom error enum conforming to `Error`
2. Mark function `throws` (or `async throws`)
3. Use `do-catch` at call site with specific catch clauses
4. Map domain errors to user-facing messages at presentation layer

## Implementation Guidelines

### Throwing Functions

- **Propagate Errors**: Use `throws` for recoverable errors and `async throws` for modern concurrency.
- **Do-Catch**: Handle close to source; specific catch clauses per error type. Catch-all `catch`: last resort.
- **Error Types**: Define custom errors as enums conforming to `Error`:

See [implementation examples](references/implementation.md) for custom error enums, do-catch patterns, and Result type usage.

- **Optional Try**: Use `try?` only for non-critical errors where nil acceptable.

### Result Type

- **Async Alternatives**: Use `throws` for synchronous code. Use `Result` for callbacks and non-async deferred error states.
- **Transformations**: Use `.map()`, `.flatMap()` for functional composition.
- **Conversion**: Use `.get()` to convert `Result` to throwing for use in `try-catch`.

### Never Type & Preconditions

- **Fatalisms**: Use `Never` return type only for unrecoverable crash scenarios or to indicate unreachable code. Never for expected errors.
- **Preconditions**: Use `precondition()`, `assert()`, and `fatalError()` for programmer errors. Use `assertionFailure()` for debug-only checks.

## Anti-Patterns

- **No try!**: Use `try?` or `do-catch`.
- **No try? without nil check**: Handle or log.
- **No Error(message)**: Use typed errors.

## References

- [Error Types & Result](references/implementation.md)


---

### swift-language

---
name: swift-language
description: Apply Optionals, Protocols, Extensions, and Type Safety patterns in Swift. Use when working with Swift Optionals, Protocols, Extensions, or type-safe APIs.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - protocol
    - extension
    - optional
    - guard
    - enum
---
# Swift Language Standards

## **Priority: P0**

## Implementation Guidelines

### Optionals & Safety

- **Never Force Unwrap**: Use **guard let**, **if let**, or **nil coalescing (??)** to safely unwrap.
- **Nil Comparison**: Use `value != nil` instead of `if let _ = value`.
- **Implicitly Unwrapped**: Avoid `Type!`. Use proper `Type?`.

### Protocols & Extensions

- **Protocols as Blueprints**: Protocols define **blueprint**; classes inherit implementation.
- **Composition over Inheritance**: **Prefer protocol composition** with structs for better decoupling and performance.
- **Extensions**: Implement **conformance** in extension: **`extension MyType: MyProtocol { ... }`**. Use extensions for clean code organization, not storage ( **not** use extensions for **stored properties**).
- **Protocol Witnesses**: Explicitly implement all required members to satisfy witness table.

### Type Safety

- **Avoid `Any`**: Use generics or associated types instead for compile-time safety.
- **Enums**: Prefer enums with **associated values** over multiple Optionals. Extract values via **switch** statement (e.g., `case .success(let value):`).
- **Value Types**: **Default to struct** for **value semantics** and thread safety. Use `class` only when **reference identity** necessary or for inheritance. Structs copied; classes shared.

## Anti-Patterns

- **No ! operator**: Use safe unwrapping.
- **No -1 for failure**: Use Optional.
- **No force cast (as!)**: Use conditional cast (as?).

## References

- [Optionals & Protocols](references/implementation.md)

---

### swift-memory-management

---
name: swift-memory-management
description: Prevent retain cycles via ARC, weak/unowned references, and Capture Lists in Swift. Use when managing Swift ARC, avoiding retain cycles, or configuring capture lists in closures.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - weak
    - unowned
    - capture
    - deinit
    - retain
---
# Swift Memory Management

## **Priority: P0**

## Implementation Guidelines

### ARC Fundamentals

- **Default**: Strong references. ARC handles retain/release automatically.
- **Weak**: Use weak if the reference can become nil during its lifetime (delegates, optional parent refs).
- **Unowned**: Use unowned if the reference is guaranteed to outlive referring object (rare; prefer `weak`).

### Capture Lists

- **Closures**: `[weak self]` at beginning of the closure's capture list. Pattern: `{ [weak self] in guard let self = self else { return } }`.
- **Self in Structs**: No list needed — `self` copied by value.
- **Multiple Captures**: `[weak self, weak delegate]`.

### Retain Cycles

- **Delegates**: `weak var delegate` always. Protocol inherits from AnyObject (e.g., `protocol MyDelegate: AnyObject {}`)..
- **Closures as Properties**: Use `weak` or `unowned` in capture list.
- **Two-way References**: One side must `weak`.

## Anti-Patterns

- **No strong var delegate**: Use weak.
- **No self in escaping closures**: Use [weak self].
- **No unowned unless certain**: Default to weak to prevent crashes.

## References

- [Capture Lists & Retain Cycles](references/implementation.md)


---

### swift-swiftui

---
name: swift-swiftui
description: Configure SwiftUI state, view lifecycle, and Property Wrappers correctly. Use when managing SwiftUI state, view lifecycle, or property wrappers like @State and @Binding.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - "@State"
    - "@Binding"
    - "@ObservedObject"
    - View
    - body
---
# SwiftUI Standards

## **Priority: P0**

## Implementation Guidelines

### State Management

- **@State**: @State for data owned by view (e.g., toggle, text input). Private.
- **@Binding**: @Binding for data passed down from parent to child. Two-way.
- **@ObservedObject**: @ObservedObject when receiving instance from external source.
- **@StateObject**: `@StateObject` when the view is creating the object instance — view owns lifecycle.
- **@EnvironmentObject**: `@EnvironmentObject` to inject data into the view's hierarchy via `.environmentObject()`. Shared across view hierarchy.

### View Composition

- **Extract Subviews**: Views < 200 lines. Extract reusable components.
- **View Modifiers**: Chain modifiers for styling (`.font()`, `.padding()`).
- **Custom Modifiers**: Create `ViewModifier` for reusable styles.

### Performance

- **Avoid Heavy Computation**: Use `@State` + `.task()` for async work.
- **Equatable**: Conform views to `Equatable` to prevent unnecessary re-renders.
- **LazyStacks**: `LazyVStack`/`LazyHStack` when displaying large number of views in scrolling container to load them only as they appear.

## Anti-Patterns

- **No @ObservedObject for owned objects**: Use @StateObject.
- **No logic in body**: Move to computed properties or methods.
- **No ! in View**: Use if-let or nil coalescing.

## References

- [State & Binding](references/implementation.md)


---

### swift-testing

---
name: swift-testing
description: Write XCTest cases, async tests, and organized test suites in Swift. Use when writing XCTest cases, async tests, or organizing test suites in Swift.
metadata:
  triggers:
    files:
    - '**/*Tests.swift'
    keywords:
    - XCTestCase
    - XCTestExpectation
    - XCTAssert
---
# Swift Testing Standards

## **Priority: P0**

## Write XCTest Cases

- **Standard Naming**: Test functions must prefixed by 'test' (e.g., `func testUserLoginSuccessful()`).
- **Setup/Teardown**: Use `setUpWithError()` and `tearDownWithError()` for environment management.
- **Assertions**: Use specific assertions: `XCTAssertEqual`, `XCTAssertNil`, `XCTAssertTrue`, etc.

See [implementation examples](references/implementation.md) for XCTest setup/teardown, async tests, and UI test patterns.

## Test Async Code

- **Async/Await**: Mark test methods as `async throws` and use `try await` directly inside them.
- **Expectations**: Use `XCTestExpectation` for callback-based async logic. Call `expectation` then `fulfill()` when done; then `wait(for: [exp], timeout: 2.0)` to block.
- **Timeout**: Always set reasonable timeouts for expectations to avoid hanging CI.

## Organize Test Suites

- **Unit Tests**: Use protocols for dependencies and inject them via constructor (e.g., `init(service: ServiceProtocol)`). Focus on logic isolation using mocks/stubs.
- **UI Tests**: Test user flows using `XCUIApplication` and accessibility identifiers.
- **Coverage**: Aim for high coverage on critical business logic and state transitions.

## Anti-Patterns

- **No Thread.sleep**: Use expectations or await.
- **No force unwrap in tests**: Use XCTUnwrap() for better failure messages.
- **No assertion-free tests**: test that only runs code not test.

## References

- [XCTest Patterns & Async Tests](references/implementation.md)

---

### swift-tooling

---
name: swift-tooling
description: Configure SPM packages, SwiftLint, and build settings for Swift projects. Use when managing Swift packages with SPM, configuring build settings, or enforcing Swift code quality.
metadata:
  triggers:
    files:
    - 'Package.swift'
    - '.swiftlint.yml'
    keywords:
    - package
    - target
    - dependency
---
# Swift Tooling Standards

## **Priority: P0**

## Define SPM Packages

- **Package.swift**: Define clear targets, products, and dependencies.
- **Modularization**: Break large projects into local packages for faster builds.
- **Versioning**: Use semantic versioning (Major.Minor.Patch) for shared packages.

See [implementation examples](references/implementation.md) for Package.swift structure, SwiftLint config, and environment-specific code.

## Enforce Code Quality

- **SwiftLint**: Use for consistent style enforcement. Create `.swiftlint.yml` in project root with `disabled_rules` and `opt_in_rules` sections.
- **Compiler Warnings**: Treat warnings as errors in CI to maintain code health.
- **Documentation**: Use triple slashes `///` for documentation comments on public APIs (DocC-compatible).

## Manage Build Configurations

- **Xcconfig**: Use external configuration files to manage build settings.
- **Environment Flags**: Use `#if DEBUG` for development-only code, closed with `#endif`.
- **Schemes**: Maintain separate schemes for Development, Staging, and Production.

## Anti-Patterns

- **No API keys in code**: Use environment variables or build configs.
- **No // swiftlint:disable**: Fix underlying issue.
- **No manually added frameworks**: Use SPM.

## References

- [SPM Setup & Build Configs](references/implementation.md)

---

