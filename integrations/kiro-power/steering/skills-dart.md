---
inclusion: manual
---

# Skills: dart

> 3 skills. Load when editing dart files.
> For code examples and implementation patterns, load `refs-dart.md`.

## Index

# dart Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **dart-language** | `**/*.dart` | sealed, record, switch, pattern, !, late, async, extension |
| dart-tooling | `analysis_options.yaml`, `build.yaml`, `lefthook.yml` | build_runner, dart format, dart_code_metrics |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| dart-best-practices | naming, convention, trailing comma, import, tear-off |

> Load matched skills: `<SKILLS>/dart/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### dart-best-practices

---
name: dart-best-practices
description: 'Dart code quality conventions: naming, const/final/var hierarchy, single quotes, trailing commas, collection idioms, tear-offs, and import organization. Use when writing new Dart code or reviewing for style violations — wrong import style, global variables, var misuse, anonymous lambdas where tear-offs fit, or missing trailing commas.'
metadata:
  triggers:
    files:
    - '**/*.dart'
    keywords:
    - naming
    - convention
    - trailing comma
    - import
    - tear-off
---
# Dart Best Practices

## **Priority: P1 (OPERATIONAL)**


- **Scoping**:
 - No global variables.
 - Private globals (if required) must start with `_`.
- **Immutability**: Use `const` > `final` > `var`.
- **Config**: Use `--dart-define` for secrets. Never hardcode API keys.
- **Naming**: Follow [effective-dart](https://dart.dev/guides/language/effective-dart) (PascalCase classes, camelCase members).
- **Strings**: Prefer single quotes; use double quotes only for interpolation needs.
- **Trailing Commas**: Always use trailing commas for multi-line literals/params.
- **Expression Bodies**: Prefer `=>` for single-expression functions/getters.
- **Collections**:
 - Use `.map`, `.where`, `.fold`, `.any` over manual loops when clarity improves.
 - Type empty collections (`<String>[]`, `<String, User>{}`) to avoid `dynamic`.
 - Use collection `if`/`for` and spread operators for composable lists/maps.
- **Async**: Always `await` futures unless intentionally fire-and-forget.

```dart
import 'models/user.dart'; // Good
import 'package:app/models/user.dart'; // Avoid local absolute
```

### Anti-Patterns

- **No var for non-obvious types**: Use `final` or explicit type; `var` only for locally-obvious short scopes.
- **No package imports within same package**: Use relative imports for intra-package files.
- **No top-level mutable state**: Encapsulate in class or inject via DI.
- **No anonymous lambdas for tear-offs**: Prefer `list.forEach(doSomething)` over anonymous form.

---

### dart-language

---
name: dart-language
description: 'Dart 3.x language feature standards: null safety, records, sealed classes, switch pattern matching, extensions, and async/await. Use when using !, ?., ??, late, sealed classes, record types, switch expressions, or async patterns — and before introducing any new Dart 3.x construct to confirm the modern idiomatic approach.'
metadata:
  triggers:
    files:
      - '**/*.dart'
    keywords:
      - sealed
      - record
      - switch
      - pattern
      - '!'
      - late
      - async
      - extension
---

# Dart Language Patterns

## **Priority: P0 (CRITICAL)**

## Implementation Guidelines

- **Null Safety**: Avoid `!`. Use `?.`, `??`, or short-circuiting. Use `late` only if necessary.
- **Immutability**: Use `final` for all variables. Use `@freezed` for data classes.
- **Pattern Matching (3.x)**: Use `switch (value)` with patterns and destructuring.
- **Records**: Use Records (e.g., `(String, int)`) for returning multiple values.
- **Sealed Classes**: Use `sealed class` for exhaustive state handling in domain logic.
- **Extensions**: Use `extension` to add utility methods to third-party types.
- **Wildcards (3.7+)**: Use `_` for unused variables in declarations and patterns.
- **Tear-offs**: Prefer using tear-offs (e.g., `list.forEach(print)`) over anonymous lambdas (e.g., `list.forEach((e) => print(e))`).
- **Asynchrony**: Prefer `async/await` over raw `Future.then`. Use `unawaited` for fire-and-forget logic if necessary.
- **Encapsulation**: Use `_` prefix for library-private members. Prefer `final` properties.
- **Collections**: Use `collection-if`, `collection-for`, and spread operators `...`.
- **Safe List Access**: Prefer `.firstOrNull`, `.lastOrNull`, or `.elementAtOrNull(i)`.
- **No dynamic**: Use `Object` or generics instead of `dynamic`.
- **Type Aliases**: Use `typedef` for complex IDs or callbacks.

## Anti-Patterns

- **No ! Operator**: not use bang operator `!` unless you can prove value non-null via `if` or `assert`.
- **No var for members**: not use `var` for class members; use `final` or explicit types.
- **No logic in constructors**: not perform complex calculations or async work inside constructors.
- **No zero-arg methods for pure computations**: Use a getter. `int get invoiceType =>` not `int toInvoiceType()`.
- **No generic conversion names**: Name value-object converters for their target context: `get apiFilterType` not `get invoiceType`.

## Code

```dart
// Sealed class and Switch expression
sealed class Result {}
class Success extends Result { final String data; Success(this.data); }
class Failure extends Result {}

String message(Result r) => switch (r) {
  Success(data: var d) => "Got $d",
  Failure() => "Error",
};
```

## References

- feature-based-clean-architecture | tooling


---

### dart-tooling

---
name: dart-tooling
description: Dart static analysis, linting, formatting, and code-generation standards. Use when touching analysis_options.yaml, running build_runner, configuring dart format line length, setting up DCM metrics, or adding pre-commit hooks via lefthook — and whenever a CI job fails on analyze or format steps.
metadata:
  triggers:
    files:
    - 'analysis_options.yaml'
    - 'build.yaml'
    - 'lefthook.yml'
    keywords:
    - build_runner
    - dart format
    - dart_code_metrics
---
# Tooling & CI

## **Priority: P1 (HIGH)**


## Implementation Guidelines

- **Linter**: Use `analysis_options.yaml`. Enforce `always_use_package_imports` and `require_trailing_commas`.
- **Formatting**: Use `dart format . --line-length 80`. Run on every commit.
- **DCM**: Use `dart_code_metrics` for complexity checks (Max cyclomatic complexity: 15).
- **Build Runner**: Always use `--delete-conflicting-outputs` with code generation.
- **CI Pipeline**: All PRs MUST pass `analyze`, `format`, and `test` steps.
- **Imports**: Group imports: `dart:`, `package:`, then relative.
- **Documentation**: Use `///` for public APIs. Link symbols using `[Class]`.
- **Linting Commands**:
 - `flutter analyze --fatal-infos --fatal-warnings`
 - `dart run dart_code_metrics:metrics analyze lib`
- **Pre-commit**: Keep `lefthook.yml` in sync with analyze/format/metrics commands.

## Code

```yaml
# analysis_options.yaml
analyzer:
  errors:
    todo: ignore
    missing_required_param: error
linter:
  rules:
    - prefer_single_quotes
    - unawaited_futures
```

## Anti-Patterns

- **No build_runner without --delete-conflicting-outputs**: Causes stale generated file conflicts that break compilation.
- **No flutter build before flutter analyze**: Analyze fast; always fail fast before building.
- **No ignore comment without explanation**: Always annotate why lint ignore justified.
- **No skipping dart format in pre-commit**: Unformatted code breaks CI; enforce via `lefthook.yml`.

## References

- language | testing

---

