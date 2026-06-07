---
inclusion: manual
---

# Skills: kotlin

> 4 skills. Load when editing kotlin files.
> For code examples and implementation patterns, load `refs-kotlin.md`.

## Index

# kotlin Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **kotlin-language** | `**/*.kt`, `**/*.kts` | val, var, ?., ?:, !!, data class, sealed, when, extension, lazy, lateinit, object |
| kotlin-tooling | `build.gradle.kts`, `libs.versions.toml`, `detekt.yml` | mockk, kts, version catalog, kotest |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| kotlin-best-practices | apply, let, run, also, with, runCatching, backing property, MutableList, internal, private set |
| **kotlin-coroutines** | suspend, CoroutineScope, launch, async, Flow, StateFlow, SharedFlow, viewModelScope, GlobalScope, Dispatchers, isActive, yield, runBlocking |

> Load matched skills: `<SKILLS>/kotlin/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### kotlin-best-practices

---
name: kotlin-best-practices
description: Core patterns for robust Kotlin code including scope functions and backing properties. Use when writing idiomatic Kotlin, choosing between scope functions (let/apply/run/also/with), encapsulating mutable state with backing properties, or exposing read-only collection interfaces.
metadata:
  triggers:
    files:
    - '**/*.kt'
    keywords:
    - apply
    - let
    - run
    - also
    - with
    - runCatching
    - backing property
    - MutableList
    - internal
    - private set
---
# Kotlin Best Practices

## **Priority: P1 (HIGH)**


## Implementation Guidelines

- **Scope Functions**:
 - `apply`: Object configuration (returns object).
 - `also`: Side effects / validation / logging (returns object).
 - `let`: Null checks (`?.let`) or mapping (returns result).
 - `run`: Object configuration and mapping (returns result).
 - `with`: Grouping multiple method calls on object (returns result).
- **Backing Properties**: Use `_state` (private mutable, e.g., `private val _state = MutableStateFlow(initial)`) exposed as `val state = _state.asStateFlow()` (public read-only). Pattern: `_prop` private, `prop` public.
- **Collections**: Expose `List`/`Map` (read-only) publicly; keep `MutableList` internal.
- **Error Handling**: Use `runCatching` for simple error handling over try/catch blocks.
- **Visibility**: Default to `private` or `internal`. Minimize `public` surface area.
- **Top-Level**: Prefer top-level functions/constants over implementation-less `object` singletons.

## Anti-Patterns

- **No Deep Scope Nesting**: Limit let/apply nesting to 2 levels; deeper destroys readability.
- **No Public var**: Use private set or backing properties for encapsulation.
- **No Global Mutable State**: Avoid mutable top-level variables.

## References

- [Backing Property & Scope Function Examples](references/example.md)

---

### kotlin-coroutines

---
name: kotlin-coroutines
description: Write safe, structured concurrent code with Kotlin Coroutines. Use when writing suspend functions, choosing coroutine scopes, handling cancellation in loops, selecting between StateFlow and SharedFlow, debugging coroutine leaks, or asked why GlobalScope is dangerous.
metadata:
  triggers:
    files:
    - '**/*.kt'
    keywords:
    - suspend
    - CoroutineScope
    - launch
    - async
    - Flow
    - StateFlow
    - SharedFlow
    - viewModelScope
    - GlobalScope
    - Dispatchers
    - isActive
    - yield
    - runBlocking
---
# Kotlin Coroutines Expert

## **Priority: P0 (CRITICAL)**

**Role**: Concurrency Expert. Prioritize safety and cancellation support.

## Implementation Guidelines

- **Scope**: Use `viewModelScope` (Android) or structured `coroutineScope`.
- **Dispatchers**: Inject dispatchers; never hardcode `Dispatchers.IO`.
- **Flow**: Use `StateFlow` for state, `SharedFlow` for events.
- **Exceptions**: Use `runCatching` or `CoroutineExceptionHandler`.

## Concurrency Checklist (Mandatory)

- [ ] **Cancellation**: loops check `isActive` or call `yield()`?
- [ ] **Structured**: No `GlobalScope`? All children joined/awaited?
- [ ] **Context**: `Dispatchers.Main` used for UI updates?
- [ ] **Leaks**: scopes cancelled in `onCleared` / `onDestroy`?

## Anti-Patterns

- **No GlobalScope**: It leaks. Use structured concurrency.
- **No Async without Await**: Don't `async { ... }` without `await()`.
- **No Blocking**: Never `runBlocking` in prod code (only tests).

## References

- [Advanced Patterns & Flow Examples](references/advanced-patterns.md)

---

### kotlin-language

---
name: kotlin-language
description: Write idiomatic Kotlin 1.9+ with null safety, sealed classes, and expression syntax. Use when working with Kotlin null safety, data classes, sealed interfaces, extension functions, or migrating Java code to Kotlin.
metadata:
  triggers:
    files:
    - '**/*.kt'
    - '**/*.kts'
    keywords:
    - val
    - var
    - "?."
    - "?:"
    - "!!"
    - data class
    - sealed
    - when
    - extension
    - lazy
    - lateinit
    - object
---
# Kotlin Language Patterns

## **Priority: P0 (CRITICAL)**


## Implementation Guidelines

- **Immutability**: Use `val` by default. Only use `var` if mutation required locally.
- **Null Safety**: Use `?` for nullable types. Use safe call `?.` and Elvis `?:` over `!!`.
- **Expressions**: Prefer expression bodies `fun foo() = ...` for one-liners. Use `if`/`try` as expressions.
- **Classes**: Use `data class` for DTOs. Use `sealed interface/class` for state hierarchies (e.g., `Success`, `Error`, `Loading`). Access members as computed property rather than function.
- **Extension Functions**: Prefer over utility classes (`StringUtil`). Keep private/internal if module-specific.
- **Named Arguments**: Use for clarity, especially with booleans or multiple same-type params.
- **String Templates**: Use `"$var"` over concatenation. Use `""` for multiline strings (SQL/JSON).

## Anti-Patterns

- **No !! Operator**: Never use in production; prefer safe calls or requireNotNull.
- **No Java-isms**: Use properties not get/set; prefer top-level functions over companion object statics.
- **No Lateinit Abuse**: Prefer nullable types or lazy delegates instead.
- **No Silenced Errors**: Never swallow exceptions without logging or handling.

## References

- [Sealed Class, When Expression & Extension Examples](references/example.md)

---

### kotlin-tooling

---
name: kotlin-tooling
description: Configure Gradle Kotlin DSL, Version Catalogs, and MockK for Kotlin projects. Use when configuring build.gradle.kts, setting up libs.versions.toml, adding MockK for tests, or choosing between Kotlin-compatible test assertion libraries.
metadata:
  triggers:
    files:
    - 'build.gradle.kts'
    - 'libs.versions.toml'
    - 'detekt.yml'
    keywords:
    - mockk
    - kts
    - version catalog
    - kotest
---
# Kotlin Tooling Standards

## **Priority: P2 (RECOMMENDED)**


## Implementation Guidelines

- **Gradle DSL**: Use Kotlin DSL (`build.gradle.kts`) exclusively — type safety and better IDE support.
- **Version Management**: Use Version Catalogs (`libs.versions.toml`).
- **Linter**: Use **Ktlint** for formatting and **Detekt** for complexity/code-smell analysis.
- **Testing**: Use **MockK** for mocking (first-class Kotlin support). Use **JUnit 5**.
- **Assertions**: Use **Truth** or **Kotest Assertions** for fluent, readable test output.

## Anti-Patterns

- **No Groovy Gradle**: Use Kotlin DSL (build.gradle.kts) exclusively; avoid legacy build.gradle.
- **No Mockito in Kotlin**: `when/then` conflicts with Kotlin `when`; use MockK (`every/verify`).
- **No Hardcoded Versions**: Manage all versions in libs.versions.toml; never inline in build files.

## References

- [MockK Templates & libs.versions.toml Setup](references/testing-tooling.md)

---

