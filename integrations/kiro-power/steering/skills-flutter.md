---
inclusion: manual
---

# Skills: flutter

> 22 skills. Load when editing flutter files.
> For code examples and implementation patterns, load `refs-flutter.md`.

## Index

# flutter Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| flutter-auto-route-navigation | `**/router.dart`, `**/app_router.dart` | AutoRoute, AutoRouter, router, guards, navigate, push |
| **flutter-bloc-state-management** | `**_bloc.dart`, `**_cubit.dart`, `**_state.dart`, `**_event.dart` | BlocProvider, BlocBuilder, BlocListener, Cubit, Emitter |
| flutter-cicd | `.github/workflows/**.yml`, `fastlane/**`, `android/fastlane/**`, `ios/fastlane/**` | ci, cd, pipeline, build, deploy, release, action, workflow |
| flutter-concurrency | `**/*isolate*.dart`, `**/*worker*.dart` | Isolate, compute, Isolate.run, Isolate.spawn, ReceivePort, SendPort, background |
| flutter-dependency-injection | `**/injection.dart`, `**/locator.dart` | GetIt, injectable, singleton, module, lazySingleton, factory |
| **flutter-design-system** | `**/theme/**`, `**/*_theme.dart`, `**/*_colors.dart`, `**/*_dls/**`, `**/foundation/**`, `**/presentation/**`, `**/ui/**`, `**/widgets/**` | ThemeData, ColorScheme, AppColors, VColors, VSpacing, AppTheme, design token |
| flutter-error-handling | `lib/domain/**`, `lib/infrastructure/**` | Either, fold, Left, Right, Failure, dartz |
| **flutter-feature-based-clean-architecture** | `lib/features/**` | feature, domain, infrastructure, application, presentation |
| **flutter-getx-navigation** | `**/app_pages.dart`, `**/app_routes.dart` | GetPage, Get.to, Get.off, Get.offAll, Get.toNamed, GetMiddleware |
| **flutter-getx-state-management** | `**_controller.dart`, `**/bindings/*.dart` | GetxController, Obx, GetBuilder, .obs, Get.put, Get.find, Get.lazyPut |
| **flutter-go-router-navigation** | `**/router.dart`, `**/app_router.dart` | GoRouter, GoRoute, StatefulShellRoute, redirection, typed-routes |
| flutter-idiomatic-flutter | `lib/presentation/**/*.dart`, `context.mounted` | SizedBox, Gap, composition, shrink |
| **flutter-layer-based-clean-architecture** | `lib/domain/**`, `lib/infrastructure/**`, `lib/application/**` | dto, mapper, Either, Failure |
| flutter-localization | `**/assets/translations/*.json`, `**/assets/langs/*.csv`, `main.dart` | localization, multi-language, translation, tr(), easy_localization, sheet_loader |
| flutter-navigation | `**/*_route.dart`, `**/*_router.dart`, `**/main.dart` | Navigator, GoRouter, routes, deep link, go_router, AutoRoute |
| flutter-notifications | `**/*notification*.dart`, `**/main.dart` | FirebaseMessaging, FlutterLocalNotificationsPlugin, FCM, notification, push |
| flutter-performance | `lib/presentation/**`, `pubspec.yaml`, `ListView.builder` | const, buildWhen, Isolate, RepaintBoundary |
| **flutter-retrofit-networking** | `**/data_sources/**`, `**/api/**` | Retrofit, Dio, RestClient, GET, POST, Interceptor, refreshing |
| **flutter-riverpod-state-management** | `**_provider.dart`, `**_notifier.dart` | riverpod, ProviderScope, ConsumerWidget, Notifier, AsyncValue, ref.watch, @riverpod |
| **flutter-security** | `lib/infrastructure/**`, `pubspec.yaml` | secure_storage, obfuscate, jailbreak, pinning, PII, OWASP |
| **flutter-testing** | `**/test/**.dart`, `**/integration_test/**.dart`, `**/robots/**.dart`, `lib/core/keys/**.dart` | test, patrol, robot, WidgetKeys, patrolTest, blocTest, mocktail |
| flutter-widgets | `**_page.dart`, `**_screen.dart`, `**/widgets/**` | StatelessWidget, const, Theme, ListView |

> Load matched skills: `<SKILLS>/flutter/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### flutter-auto-route-navigation

---
name: flutter-auto-route-navigation
description: Implement typed routing, nested routes, and guards using auto_route in Flutter. Use when adding navigation flows, nested routes, or route guards with auto_route.
metadata:
  triggers:
    files:
    - '**/router.dart'
    - '**/app_router.dart'
    keywords:
    - AutoRoute
    - AutoRouter
    - router
    - guards
    - navigate
    - push
---

# AutoRoute Navigation

## **Priority: P1 (HIGH)**

## Structure

```text
core/router/
├── app_router.dart       # Router configuration
└── app_router.gr.dart    # Generated routes
```

## Implementation Workflow

1. **Annotate pages** — Mark all screen/page widgets with `@RoutePage()`.
2. **Configure router** — Extend `_$AppRouter` and annotate with `@AutoRouterConfig`.
3. **Navigate with types** — Use generated route classes (e.g., `HomeRoute()`). Never use strings.
4. **Add guards** — Implement `AutoRouteGuard` for authentication/authorization logic.
5. **Handle parameters** — Constructors of `@RoutePage` widgets automatically become route parameters.
6. **Prefer declarative calls** — Use `context.pushRoute()` or `context.replaceRoute()`.

### Nested Routes & Tabs

Use `children` in `AutoRoute` for tabs. Pass `children` parameter to define initial active sub-route.

See [implementation examples](references/implementation.md) for nested route navigation and router configuration patterns.

## Reference & Examples

For full Router configuration and Auth Guard implementation:
See [references/REFERENCE.md](references/REFERENCE.md).

## Anti-Patterns

- **No string-based navigation**: Use generated typed route classes (e.g., `OrderDetailRoute(id: 123)`).
- **No protected screen without AutoRouteGuard**: Every protected route must declare guard; don't rely on UI-level checks.
- **No navigation calls from BLoC**: Emit state and let Presentation layer navigate.

## References

- [go-router-navigation](../flutter-navigation/SKILL.md) | [layer-based-clean-architecture](../../common/common-clean-architecture/SKILL.md)


---

### flutter-bloc-state-management

---
name: flutter-bloc-state-management
description: Implement BLoC/Cubit state management correctly in Flutter. Use when writing, modifying, reviewing, or testing any BLoC, Cubit, state, or event file.
metadata:
  triggers:
    files:
    - '**_bloc.dart'
    - '**_cubit.dart'
    - '**_state.dart'
    - '**_event.dart'
    keywords:
    - BlocProvider
    - BlocBuilder
    - BlocListener
    - Cubit
    - Emitter
---
# BLoC State Management

## **Priority: P0 (CRITICAL)**

**Role**: Flutter State Management Expert. Design predictable, testable state flows.

## State Design Workflow

1. **Define Events**: What happens? (UserTap, ApiSuccess). Use `@freezed`.
2. **Define States**: What needs to show? (Initial, Loading, Data, Error).
3. **Implement BLoC**: Map Events to States using `on<Event>`.
4. **Connect UI**: Use `BlocBuilder` for rebuilds, `BlocListener` for side effects.

## Implementation Guidelines

- **States & Events**: Use **@freezed** for union types (e.g., `Initial`, `Loading`, `Success`, `Failure` states).
- **Error Handling**: Emit `Failure` states for UI-critical errors. For silent/background events, either let exceptions propagate naturally to global `onError` interceptor (e.g., in `AppBlocObserver`), or catch and call `addError(e, st)` without emitting error state.
- **Async Data**: Use **emit.forEach** for streams or **await** with `emit` call.
- **Concurrency**: Use **transformer: restartable()** from `bloc_concurrency` for search/typeahead to debounce and cancel previous requests.
- **UI Connectivity**: Use **BlocBuilder** for UI rebuilds (e.g., loading spinner, data list, error message) and **BlocListener** for side effects (navigation, snackbars).
- **Testing**: Use **blocTest** for ALL states and verify sequence of emitted states.

## Verification Checklist (Mandatory)

- [ ] **Initial State**: Defined and tested?
- [ ] **Test Coverage**: `blocTest` used for ALL states?
- [ ] **UI Logic**: No complex calculation in `BlocBuilder`?
- [ ] **Side Effects**: Navigation/Snackbars in `BlocListener` (NOT Builder)?

## Anti-Patterns

- **No .then()**: Use `await` or `emit.forEach()` to emit.
- **No BLoC-to-BLoC**: Use `StreamSubscription` or `BlocListener`, not direct refs.
- **No Logic in Builder**: Move valid logic to BLoC.
- **No BlocBuilder without buildWhen**: Heavy subtrees must declare `buildWhen` predicate to prevent unnecessary rebuilds.

## Verification

- [ ] Every BLoC has `blocTest` covering Initial → Loading → Success and Initial → Loading → Failure.
- [ ] Side effects (navigation, snackbars) use `BlocListener`, not `BlocBuilder`.
- [ ] Heavy `BlocBuilder` widgets declare `buildWhen`.
- [ ] `flutter test` passes.

## References

- [Templates](references/bloc_templates.md)

---

### flutter-cicd

---
name: flutter-cicd
description: Set up CI/CD pipelines for Flutter apps. Use when configuring automated testing, build, or deployment workflows with GitHub Actions or Fastlane.
metadata:
  triggers:
    files:
    - '.github/workflows/**.yml'
    - 'fastlane/**'
    - 'android/fastlane/**'
    - 'ios/fastlane/**'
    keywords:
    - ci
    - cd
    - pipeline
    - build
    - deploy
    - release
    - action
    - workflow
---
# CI/CD Standards

## **Priority: P1 (HIGH)**


## Core Pipeline Steps

1. **Environment Setup**: Use stable Flutter channel. Cache dependencies (pub, gradle, cocoapods).
2. **Static Analysis**: Enforce `flutter analyze` and `dart format`. Fail on any warning in strict mode.
3. **Testing**: Run unit, widget, and integration tests. Upload coverage reports (e.g., Codecov).
4. **Build**:
 - **Android**: Build App Bundle (`.aab`) for Play Store.
 - **iOS**: Sign and build `.ipa` (requires macOS runner).
5. **Deployment** (CD): Automated upload to TestFlight/Play Console using standard tools (Fastlane, Codemagic).

## Best Practices

- **Timeout Limits**: Always set `timeout-minutes` (e.g., 30m) to save costs on hung jobs.
- **Fail Fast**: Run Analyze/Format _before_ Tests/Builds.
- **Secrets**: Never commit keys. Use GitHub Secrets or secure vaults for `keystore.jks` and `.p8` certs.
- **Versioning**: Automate version bumping based on git tags or semantic version scripts.

## Reference

- [**GitHub Actions Template**](references/github-actions.md) - Standard workflow file.
- [**Advanced Large-Scale Workflow**](references/advanced-workflow.md) - Parallel jobs, Caching, Strict Mode.
- [**Fastlane Standards**](references/fastlane.md) - Automated Signing & Deployment.

## Anti-Patterns

- **No Secrets in Repo**: Store `keystore.jks`, `.p8`, and `.env` in GitHub Secrets
- **No Uncapped Jobs**: Always set `timeout-minutes` (e.g., 30m) to save runner minutes
- **No Manual Versioning**: Automate `pubspec.yaml` versioning via git tags or scripts
- **No Late Analysis**: Run `flutter analyze` before builds/tests for fast failure

## Related Topics

flutter/testing | dart/tooling

---

### flutter-concurrency

---
name: flutter-concurrency
description: Execute long-running tasks in background isolates to keep the UI responsive. Use when performing heavy computations, parsing large datasets, or choosing between async/await and isolates.
metadata:
  triggers:
    files:
    - '**/*isolate*.dart'
    - '**/*worker*.dart'
    keywords:
    - Isolate
    - compute
    - Isolate.run
    - Isolate.spawn
    - ReceivePort
    - SendPort
    - background
---
# Dart Concurrency and Isolates

## **Priority: P1**

## Core Concepts

Dart uses a single-threaded event loop. All Flutter code runs on the Main Isolate by default. Blocking it causes jank.

- **async/await**: For non-blocking I/O (network, file). The event loop continues while waiting.
- **Isolates**: Dart's lightweight threads with isolated memory. Communicate via message passing only.

## Decision Matrix

| Condition | Approach |
|-----------|----------|
| I/O bound (HTTP, database) | `async`/`await` on Main Isolate |
| CPU-bound, < 16ms | `async`/`await` on Main Isolate |
| CPU-bound, one-off heavy task | `Isolate.run()` |
| Continuous background processing | `Isolate.spawn()` with ports |

## Workflow: Offloading Heavy Computation

- [ ] 1. Identify the CPU-bound operation blocking the UI.
- [ ] 2. Extract computation into a standalone top-level or static function.
- [ ] 3. Ensure the function accepts exactly one argument (Isolate constraint).
- [ ] 4. Call `Isolate.run(() => myFunction(data))`.
- [ ] 5. `await` the result on the Main Isolate.

## Workflow: Long-Lived Worker Isolate

- [ ] 1. Create a `ReceivePort` on the Main Isolate.
- [ ] 2. Spawn worker with `Isolate.spawn(entryPoint, mainPort.sendPort)`.
- [ ] 3. In worker, create its own `ReceivePort` and send its `SendPort` back.
- [ ] 4. Store worker's `SendPort` for bidirectional communication.
- [ ] 5. Close ports and kill isolate on dispose.

See [examples](references/isolate-examples.md) for complete code.

## Anti-Patterns

- **No JSON parsing on Main Isolate**: Large JSON decoding (>1MB) blocks frames. Use `Isolate.run`.
- **No shared mutable state**: Isolates cannot share memory. Pass data via messages.
- **No FutureBuilder in build without caching**: `FutureBuilder` re-fires on every rebuild if the future is created inline.

## Verification

- [ ] No frame drops during heavy computation (check with DevTools).
- [ ] Worker isolates are disposed when no longer needed.
- [ ] `flutter test` passes.

## References

- [Isolate Examples](references/isolate-examples.md)


---

### flutter-dependency-injection

---
name: flutter-dependency-injection
description: Configure service locator setup using injectable and get_it in Flutter. Use when wiring dependency injection with get_it or injectable.
metadata:
  triggers:
    files:
    - '**/injection.dart'
    - '**/locator.dart'
    keywords:
    - GetIt
    - injectable
    - singleton
    - module
    - lazySingleton
    - factory
---
# Dependency Injection

## **Priority: P1 (HIGH)**


## Structure

```text
core/injection/
├── injection.dart  # Initialization & setup
└── modules/        # Third-party dependency modules (Dio, Storage)
```

## Implementation Workflow

1. **Annotate classes** — Use `@injectable` annotations; avoid manual registry calls.
2. **Choose scope** — Default to `@LazySingleton` for repositories, services, and data sources (init on demand).
3. **Register BLoCs as factories** — Use `@injectable` (Factory) for BLoCs to ensure state resets per instance. Never use `@Singleton()` for BLoCs.
4. **Inject abstractions** — Always register implementations as abstract interfaces (`as: IService`).
5. **Register third-party deps** — Use `@module` for external instances (Dio, Hive, SharedPreferences).
6. **Prefer constructor injection** — Use mandatory constructor parameters; `injectable` resolves them automatically.

### Registration & Test Mock Examples

See [implementation examples](references/implementation.md) for module registration and test mock swap patterns.

## Reference & Examples

For module configuration and initialization templates:
See [references/REFERENCE.md](references/REFERENCE.md).

## Anti-Patterns

- **No Inline `getIt` Calls**: Inject via constructor instead of calling GetIt in UI `build()`
- **No `@Singleton` BLoCs**: Always use `@injectable` (Factory) to ensure state resets
- **No Concrete Class Injection**: Always inject abstract interface (e.g., `IOrderRepository`)
- **No Manual Registration**: Use `@injectable` annotations instead of manual `getIt.register` calls in production code

## Related Topics

layer-based-clean-architecture | testing

---

### flutter-design-system

---
name: flutter-design-system
description: Enforce Design Language System adherence in Flutter. Use when implementing design tokens, preventing hardcoded colors/spacing, or building a DLS.
metadata:
  triggers:
    files:
    - '**/theme/**'
    - '**/*_theme.dart'
    - '**/*_colors.dart'
    - '**/*_dls/**'
    - '**/foundation/**'
    - '**/presentation/**'
    - '**/ui/**'
    - '**/widgets/**'
    keywords:
    - ThemeData
    - ColorScheme
    - AppColors
    - VColors
    - VSpacing
    - AppTheme
    - design token
---
# Flutter Design System Enforcement

## **Priority: P0 (CRITICAL)**

Zero tolerance for hardcoded design values.

## **Phase 0: Context Discovery (MANDATORY)**

Before UI refactoring, identify project's Theme Archetype:

1. **Check `main.dart`**: Look for `MaterialApp` theme configuration.
2. **Determine Pattern**:
 - **Theme-Driven (Adaptive)**: `VThemeData(...).toThemeData()` or extensive `ThemeData` overrides → use `Theme.of(context).textTheme` / `theme.textTheme`.
 - **Token-Driven (Static)**: Use static tokens (`VTypography.*`) only when no global theme bridge exists, or when defining theme itself.

## Guidelines

- **Colors**: Use tokens (`VColors.*`, `AppColors.*`), never `Color(0xFF...)` or `Colors.red`.
- **Spacing**: Use tokens (`VSpacing.*`), never magic numbers like `16` or `24`.
- **Typography**: Prioritize `theme.textTheme.*` for adaptive UI. Use `VTypography.*` tokens only for theme definitions or non-contextual logic. Never use inline `TextStyle`.
- **Borders**: Use tokens (`VBorders.*`), never raw `BorderRadius.`
- **Components**: Use DLS widgets (`VButton`) over raw Material widgets (`ElevatedButton`) if available.

[Detailed Examples](references/usage.md)

## Anti-Patterns

- **No Hex Colors**: `Color(0xFF...)` strictly forbidden.
- **No Color Enums**: `Colors.blue` forbidden in UI code.
- **No Magic Spacing**: `SizedBox(height: 10)` forbidden.
- **No Inline Styles**: `TextStyle(fontSize: 14)` forbidden.
- **No Raw Widgets**: Don't use `ElevatedButton` when `VButton` exists.

## Related Topics

mobile-ux-core | flutter/widgets | idiomatic-flutter

---

### flutter-error-handling

---
name: flutter-error-handling
description: Implement functional error recovery with Either/Failure patterns in Flutter. Use when writing repositories, handling exceptions, or using dartz Either types.
metadata:
  triggers:
    files:
    - 'lib/domain/**'
    - 'lib/infrastructure/**'
    keywords:
    - Either
    - fold
    - Left
    - Right
    - Failure
    - dartz
---
# Error Handling

## **Priority: P1 (HIGH)**


## Implementation Workflow

1. **Define failures** — Create domain-specific failures using `@freezed` unions (e.g., `UnauthorizedFailure`, `OutOfStockFailure`).
2. **Return Either** — Repositories return `Either<Failure, T>`. No exceptions in UI/BLoC.
3. **Catch in Infrastructure only** — Infrastructure catches exceptions (e.g., `DioException`) and returns `Left(Failure)`. Never rethrow to UI.
4. **Fold in BLoC** — Use `.fold(failure, success)` in BLoC to emit corresponding states. Remove try/catch from BLoC.
5. **Localize messages** — Use `failure.failureMessage` (returns `TRObject` or localized string) for UI-safe text.
6. **Log with stable templates** — Use low-cardinality message templates; pass variable data via metadata/context.
7. **No Silent Catch**: Never swallow errors without logging or documented retry.
8. **Crashlytics Routing**: All UI/BLoC `catch` blocks MUST route errors via `AppLogger.error(AppException.fromException(e).message, error: e, stackTrace: st)` for observability and type-safe UI messages.

### Repository & BLoC Examples

See [implementation examples](references/implementation.md) for repository error mapping and BLoC consumption patterns.

## Reference & Examples

For Failure definitions and API error mapping:
See [references/REFERENCE.md](references/REFERENCE.md).

## Anti-Patterns

- **No Try-Catch in BLoC**: BLoC receives `Either` and `folds`; try/catch belongs in Infrastructure
- **No Plain String Failures**: Define typed `@freezed` Failure subclasses instead of `Left('Something went wrong')`
- **No Empty Catch Blocks**: Always log and propagate; never swallow errors silently
- **No Repositories Throwing Status**: Return `Left(Failure)` instead of throwing `Exception`
- **No Missing Log Registration**: Use `AppLogger.error` in BLoC/UI `catch` to ensure Crashlytics tracking and type-safe UI messages

## Related Topics

layer-based-clean-architecture | bloc-state-management

---

### flutter-feature-based-clean-architecture

---
name: flutter-feature-based-clean-architecture
description: Organize Flutter apps with modular feature-based clean architecture. Use when creating features under lib/features/ with domain, data, and presentation layers.
metadata:
  triggers:
    files:
    - 'lib/features/**'
    keywords:
    - feature
    - domain
    - infrastructure
    - application
    - presentation
---
# Feature-Based Clean Architecture

## **Priority: P0 (CRITICAL)**


## Structure

Every feature lives in `lib/features/` with **3-layer separation** (domain/data/presentation):

- `domain/` — Entities, failures, and Repository interfaces.
- `data/` — DTOs, DataSource, and Repository implementations.
- `presentation/` — BLoC/Cubit, pages, and widgets.

See [references/folder-structure.md](references/folder-structure.md) for complete directory blueprint.

## Implementation Workflow

1. **Create feature directory** — Add new folder under `lib/features/` (e.g., `lib/features/promotions/`).
2. **Define domain layer** — Add entities, failures, and repository interfaces with zero external dependencies.
3. **Implement data layer** — Add DTOs, data sources, and repository implementations that depend only on Domain.
4. **Build presentation layer** — Add BLoC/Cubit, pages, and widgets that depend only on Domain.
5. **Enforce dependency rule** — `Presentation -> Domain <- Data`. Domain must zero external dependencies.
6. **Share cross-cutting logic** — Move reusable utilities to `lib/shared/` or `lib/core/`.

### Feature Directory Example

See [implementation examples](references/implementation.md) for full directory tree and cross-feature import patterns.

## Reference & Examples

For feature folder blueprints and cross-layer dependency templates:
See [references/REFERENCE.md](references/REFERENCE.md).

## Anti-Patterns

- **No Cross-Feature Data Imports**: Only import Domain types across features
- **No UI/Data in Domain Layer**: Never put UI or Data classes inside `domain/`
- **No Nested Features**: Keep `lib/features/` flat with no sub-feature directories
- **No Direct Repository Calls**: Use specific BLoCs or use-cases instead of calling other features' repositories directly from UI

## Related Topics

layer-based-clean-architecture | retrofit-networking | go-router-navigation | bloc-state-management | dependency-injection

---

### flutter-getx-navigation

---
name: flutter-getx-navigation
description: Implement context-less navigation, named routes, and middleware using GetX. Use when building navigation with GetX routing in Flutter.
metadata:
  triggers:
    files:
    - '**/app_pages.dart'
    - '**/app_routes.dart'
    keywords:
    - GetPage
    - Get.to
    - Get.off
    - Get.offAll
    - Get.toNamed
    - GetMiddleware
---
# GetX Navigation

## **Priority: P0 (CRITICAL)**


## Guidelines

- **Named Routes**: Use `Get.toNamed('/path')`. Define routes in `AppPages`.
- **Navigation APIs**:
 - `Get.to()`: Push new route.
 - `Get.off()`: Replace current route.
 - `Get.offAll()`: Clear stack and push.
 - `Get.back()`: Pop route/dialog/bottomSheet.
- **Bindings**: Link routes with `Bindings` for automated lifecycle.
- **Middleware**: Implement `GetMiddleware` for Auth/Permission guards.

## Code Example

See [AppPages Config](references/app-pages.md) for route definition and controller usage patterns.

## Anti-Patterns

- **Navigator Context**: not use `Navigator.of(context)` with GetX.
- **Hardcoded Routes**: Use `Routes` constant class.
- **Direct Dialogs**: Use `Get.dialog()` and `Get.snackbar()`.

## References

- [AppPages Config](references/app-pages.md)
- [Middleware Implementation](references/middleware-example.md)

## Related Topics

getx-state-management | feature-based-clean-architecture

---

### flutter-getx-state-management

---
name: flutter-getx-state-management
description: Implement reactive state with GetX controllers and observables in Flutter. Use when managing state with GetxController, Obx, or reactive observables.
metadata:
  triggers:
    files:
    - '**_controller.dart'
    - '**/bindings/*.dart'
    keywords:
    - GetxController
    - Obx
    - GetBuilder
    - .obs
    - Get.put
    - Get.find
    - Get.lazyPut
---
# GetX State Management

## **Priority: P0 (CRITICAL)**

## Structure

```text
lib/app/modules/home/
├── controllers/
│   └── home_controller.dart
├── bindings/
│   └── home_binding.dart
└── views/
    └── home_view.dart
```

## Implementation Guidelines

- **Controllers**: Extend `GetxController`. Store logic and state variables here.
- **Reactivity**:
 - Use `.obs` for observable variables (e.g., `final count = 0.obs;`).
 - Wrap UI in `Obx(() => ...)` to listen for changes.
 - For simple state, use `update()` in controller and `GetBuilder` in UI.
- **Dependency Injection**:
 - **Bindings**: Use `Bindings` class to decouple DI from UI.
 - **Lazy Load**: Prefer `Get.lazyPut(() => Controller())` in Bindings.
 - **Lifecycle**: Let GetX handle disposal. Avoid `permanent: true`.
- **Hooks**: Use `onInit()`, `onReady()`, `onClose()` instead of `initState`/`dispose`.
- **Architecture**: Use `get_cli` for modular MVVM (data, models, modules).

## Anti-Patterns

- **Ctx in Logic**: Pass no `BuildContext` to controllers.
- **Inline DI**: Avoid `Get.put()` in widgets; use Bindings + `Get.find`.
- **Fat Views**: Keep views pure UI; delegate all logic to controller.

## Code Example

See [references/controller-example.md](references/controller-example.md) for controller + view implementation pattern.

## Related Topics

getx-navigation | layer-based-clean-architecture | dependency-injection

---

### flutter-go-router-navigation

---
name: flutter-go-router-navigation
description: Implement typed routes, redirection, and guards using go_router in Flutter. Use when building declarative navigation with go_router.
metadata:
  triggers:
    files:
    - '**/router.dart'
    - '**/app_router.dart'
    keywords:
    - GoRouter
    - GoRoute
    - StatefulShellRoute
    - redirection
    - typed-routes
---
# GoRouter Navigation

## **Priority: P0 (CRITICAL)**


## Structure

```text
core/router/
├── app_router.dart # Router configuration
└── routes.dart # Typed route definitions (GoRouteData)
```

## Implementation Guidelines

- **Typed Routes**: Always use **GoRouteData** and **@TypedGoRoute** from `go_router_builder`. Never use raw path strings.
- **Parameters**: Define strongly-typed parameters in route class (e.g., `class OrderDetailRoute extends GoRouteData { final String id; }`) with paths like **'/orders/:id'**.
- **Root Router**: One global `GoRouter` instance registered in DI.
- **Sub-Routes**: Nest related routes using `TypedGoRoute` and children lists.
- **Redirection**: Handle Auth (Login check) in **redirect callback** of `GoRouter` config: `redirect: (context, state) => isLoggedIn ? null : '/login'`. ** NOT check auth inside page widget.**
- **Tabs**: Use **StatefulShellRoute** with branches for bottom tab bar (Home, Orders, Profile) so each tab maintains its own navigation stack.
- **Transitions**: Define standard transitions (Fade, Slide) in `buildPage`.
- **Navigation**: Use **MyRoute().go(context)** or `MyRoute().push(context)`. Using **OrderDetailRoute(id: id).go(context)** only allowed way to navigate.

## Code

See [references/typed-routes.md](references/typed-routes.md) for GoRouteData + redirect implementation.

## Anti-Patterns

- **No Raw String Paths**: Use typed `GoRouteData` classes (e.g., `OrderDetailRoute(id: 123).go(context)`) instead of `context.go('/orders/123')`
- **No Inline Auth Logic**: Redirect logic belongs in `GoRouter.redirect`, not UI's `build()` method
- **No Multiple Routers**: Register one global `GoRouter` instance in DI
- **No Unvalidated IDs**: Always verify parameters exist in `redirect` before building route

## Related Topics

layer-based-clean-architecture | auto-route-navigation | security

---

### flutter-idiomatic-flutter

---
name: flutter-idiomatic-flutter
description: Compose modern Flutter layouts and widgets idiomatically. Use when composing widget trees, managing layout constraints, or following idiomatic Flutter patterns.
metadata:
  triggers:
    files:
    - 'lib/presentation/**/*.dart'
    - 'context.mounted'
    keywords:
    - SizedBox
    - Gap
    - composition
    - shrink
---
# Idiomatic Flutter

## **Priority: P1 (OPERATIONAL)**

- **Async Gaps**: Check `if (context.mounted)` before using `BuildContext` after `await`.
- **Composition**: Extract complex UI into small widgets. Avoid deep nesting or large helper methods.
- **Layout**:
  - Spacing: Prefer `spacing` parameter on `Row`/`Column` (Flutter 3.10+) over inserting `SizedBox`/`Gap` between children.
  - Fallback: Use `Gap(n)` or `SizedBox` only when `spacing` cannot express the layout (e.g., conditional gaps).
  - Empty UI: Use `const SizedBox.shrink()`.
  - Intrinsic: Avoid `IntrinsicWidth/Height`; use `Stack` + `FractionallySizedBox` for overlays.
  - Spacing: Use `Gap(n)` or `SizedBox` over `Padding` for simple gaps.
  - Optimization: Use `ColoredBox`/`Padding`/`DecoratedBox` instead of `Container` when possible.
  - Themes: Use extensions for `Theme.of(context)` access.

## Anti-Patterns

- **No BuildContext after await without mounted check**: Check `context.mounted` to prevent crashes across async gaps.
- **No _buildXxx() helper methods**: Extract to `const StatelessWidget` for proper rebuild control.
- **No direct controller access in widget**: Use BLoC or Signals to decouple UI from state.
- **No Container for empty space**: Use `const SizedBox.shrink()`.

---

### flutter-layer-based-clean-architecture

---
name: flutter-layer-based-clean-architecture
description: Enforce inward dependency flow, pure domain layers, and DTO-to-entity mapping in Flutter DDD architecture. Use when structuring domain, infrastructure, application, or presentation layers.
metadata:
  triggers:
    files:
    - 'lib/domain/**'
    - 'lib/infrastructure/**'
    - 'lib/application/**'
    keywords:
    - dto
    - mapper
    - Either
    - Failure
---
# Layer-Based Clean Architecture

## **Priority: P0 (CRITICAL)**


## Workflow: Add New Feature Across Layers

1. Define domain entity with `@freezed` in `lib/domain/entities/`
2. Define repository interface in `lib/domain/repositories/`
3. Create DTO in `lib/infrastructure/dtos/` with `fromJson`/`toEntity` mapper
4. Implement repository in `lib/infrastructure/repositories/`
5. Wire BLoC/Cubit in `lib/application/` consuming repository interface
6. Register bindings in `get_it` injection container
7. Build screen in `lib/presentation/` using `BlocBuilder`

## Structure

```text
lib/
├── domain/ # Pure Dart: entities (@freezed), failures, repository interfaces
├── infrastructure/ # Implementation: DTOs, data sources, mappers, repo impls
├── application/ # Orchestration: BLoCs / Cubits
└── presentation/ # UI: Screens, reusable components
```

## Implementation Guidelines

- **Dependency Flow**: `Presentation -> Application -> Domain <- Infrastructure`. Dependencies point inward.
- **Pure Domain**: No Flutter (Material/Store) or Infrastructure (Dio/Hive) dependencies in `Domain`.
- **Functional Error Handling**: Repositories must return `Either<Failure, Success>`.
- **Always Map**: Infrastructure must map DTOs to Domain Entities; not leak DTOs to UI.

See [DTO-to-Entity mapping example](references/REFERENCE.md).

- **Immutability**: Use `@freezed` for all entities and failures.
- **Logic Placement**: No business logic in UI; widgets only display state and emit events.
- **Inversion of Control**: Use `get_it` to inject repository implementations into BLoCs.

## Anti-Patterns

- **No DTOs in UI**: Never import `.g.dart` or Data class directly in Widget.
- **No Material in Domain**: not import `package:flutter/material.dart` in `domain` layer.
- **No Shared Prefs in Repo**: not use `shared_preferences` directly in Repository; use Data Source.

## Reference & Examples

For full implementation templates and DTO-to-Domain mapping examples:
See [references/REFERENCE.md](references/REFERENCE.md).

## References

- feature-based-clean-architecture | bloc-state-management | dependency-injection | error-handling

---

### flutter-localization

---
name: flutter-localization
description: Add multi-language support using easy_localization with CSV or JSON assets. Use when implementing localization or translations in Flutter.
metadata:
  triggers:
    files:
    - '**/assets/translations/*.json'
    - '**/assets/langs/*.csv'
    - 'main.dart'
    keywords:
    - localization
    - multi-language
    - translation
    - tr()
    - easy_localization
    - sheet_loader
---
# Localization

## **Priority: P1 (STANDARD)**


## Format Selection

- **CSV** (Recommended for teams with translators): Google Sheets compatibility via `sheet_loader_localization`. Store in `assets/langs/`.
- **JSON** (Developer-friendly): Nested structure support with IDE validation. Store in `assets/translations/`.

## Structure

```text
# CSV Format (Google Sheets workflow)
assets/langs/langs.csv

# OR JSON Format (nested keys)
assets/translations/
├── en.json
└── vi.json
```

## Implementation Workflow

1. **Initialize** — Call `await EasyLocalization.ensureInitialized()` before `runApp`.
2. **Wrap root** — Wrap app with `EasyLocalization` widget specifying supported locales and path.
3. **Translate strings** — Use `.tr()` extension on keys (e.g., `'welcome'.tr()`).
4. **Switch locale** — Change via `context.setLocale(Locale('vi'))`.
5. **Handle plurals** — Use `plural()` for quantity-dependent strings.
6. **Sync translations** — Use `sheet_loader_localization` to auto-generate CSV/JSON from Google Sheets.

### Bootstrap & Usage Examples

See [implementation examples](references/implementation.md) for bootstrap setup and translation usage patterns.

## Anti-Patterns

- **No Hardcoded Strings**: Always use translation keys from assets
- **No Manual Localization Calls**: Use `easy_localization` `.tr()` extension
- **No Mismatched Keys**: Ensure keys identical across all locale-specific files

## Reference & Examples

For setup and Google Sheets automation:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

idiomatic-flutter | widgets

---

### flutter-navigation

---
name: flutter-navigation
description: Implement navigation patterns with go_router, deep linking, and named routes in Flutter. Use when building navigation, deep linking, or routing.
metadata:
  triggers:
    files:
    - '**/*_route.dart'
    - '**/*_router.dart'
    - '**/main.dart'
    keywords:
    - Navigator
    - GoRouter
    - routes
    - deep link
    - go_router
    - AutoRoute
---
# Flutter Navigation

## **Priority: P1 (OPERATIONAL)**


## Implementation Workflow

1. **Choose router** — Use `go_router` for modern, declarative routing.
2. **Define routes** — Use constants or code generation for route paths; never hardcode strings.
3. **Configure deep links** — Set up `AndroidManifest.xml` and `Info.plist` for URL schemes.
4. **Validate parameters** — Check parameters in `redirect` logic before navigation.
5. **Preserve tab state** — Use `StatefulShellRoute` or `IndexedStack` for bottom navigation.

### Route Configuration Example

See [implementation examples](references/implementation.md) for GoRouter configuration with parameter validation and redirects.

[Routing Patterns & Examples](references/routing-patterns.md)

## Anti-Patterns

- **No Manual URL Parsing**: Use `go_router` built-in parsing instead of `Uri.parse(url)`
- **No Manual Tab State Management**: Use `IndexedStack` or `StatefulShellRoute` to preserve state
- **No Unvalidated Deep Link IDs**: Always check existence in `redirect`
- **No Hardcoded Route Strings**: Use constants (e.g., `Routes.orders`) or code-gen instead of `'/orders'`

## Related Topics

flutter-design-system | flutter-notifications | mobile-ux-core

---

### flutter-notifications

---
name: flutter-notifications
description: Integrate push and local notifications using FCM and flutter_local_notifications. Use when adding push or local notification support to Flutter apps.
metadata:
  triggers:
    files:
    - '**/*notification*.dart'
    - '**/main.dart'
    keywords:
    - FirebaseMessaging
    - FlutterLocalNotificationsPlugin
    - FCM
    - notification
    - push
---
# Flutter Notifications

## **Priority: P1 (OPERATIONAL)**


## Implementation Workflow

1. **Set up packages** — Add `firebase_messaging` (Push) and `flutter_local_notifications` (Local/Foreground).
2. **Request permission** — Prime users with custom dialog explaining benefits _before_ system prompt.
3. **Handle all lifecycle states** — Implement handlers for Foreground, Background, and Terminated states.
4. **Validate payloads** — Strictly validate notification data before navigating to screens.
5. **Clear badges** — Manually clear iOS app badges when visiting relevant screens.

### Lifecycle Handlers Example

See [implementation examples](references/implementation.md) for foreground, background, and terminated state notification handling.

[Implementation Details](references/implementation.md)

## Anti-Patterns

- **No Early Permission Popups**: Show primer dialog explaining value first
- **No Missing `getInitialMessage()`**: Always handle "open from terminated" startup state
- **No Uncleared Badges**: Manually clear notification badges upon related screen visits
- **No Unvalidated Payloads**: Validate all JSON data before navigating on click

## Related Topics

flutter-navigation | mobile-ux-core | firebase/fcm

---

### flutter-performance

---
name: flutter-performance
description: Optimize Flutter widget rebuilds, memory usage, and rendering performance. Use when diagnosing jank, reducing rebuilds, or improving list performance.
metadata:
  triggers:
    files:
    - 'lib/presentation/**'
    - 'pubspec.yaml'
    - 'ListView.builder'
    keywords:
    - const
    - buildWhen
    - Isolate
    - RepaintBoundary
---
# Performance

## **Priority: P1 (OPERATIONAL)**


- **Rebuilds**: Use `const` widgets and `buildWhen` / `select` for granular updates.
- **Lists**: Always use `ListView.builder` for item recycling.
- **Heavy Tasks**: Use `compute()` or `Isolates` for parsing/logic.
- **Repaints**: Use `RepaintBoundary` for complex animations. Use `debugRepaintRainbowEnabled` to debug.
- **Images**: Use `CachedNetworkImage` + `memCacheWidth`. `precachePicture` for SVGs.
- **Keys**: Provide `ValueKey` for list items and stable IDs for reconciliation.
- **Resource Cleanup**: Dispose controllers/streams in `dispose()`.
- **Pagination**: Default to 20 items per page for network lists.
- **Build Purity**: Keep `build` methods free of heavy work; move logic to BLoC/Application.
- **Image Resizing**: Always set `maxWidth`/`maxHeight` when loading images.

## Anti-Patterns

- **No Root `setState()`**: Use `BlocBuilder` with `buildWhen` or `context.select()` for granular updates
- **No Heavy Business in `build()`**: Move sorting/filtering/heavy logic to BLoC or `compute()`
- **No Non-`const` Leaf Nodes**: Apply `const` to all static widgets to skip unnecessary reconciliation
- **No Large `Column` Lists**: Use `ListView.builder` for efficient item recycling in large lists

```dart
BlocBuilder<UserBloc, UserState>(
  buildWhen: (p, c) => p.id != c.id,
  builder: (context, state) => Text(state.name),
)
```

---

### flutter-retrofit-networking

---
name: flutter-retrofit-networking
description: Build type-safe HTTP networking with Dio and Retrofit including auth interceptors in Flutter. Use when integrating REST APIs with Dio or Retrofit.
metadata:
  triggers:
    files:
    - '**/data_sources/**'
    - '**/api/**'
    keywords:
    - Retrofit
    - Dio
    - RestClient
    - GET
    - POST
    - Interceptor
    - refreshing
---
# Retrofit & Dio Networking

## **Priority: P0 (CRITICAL)**


## Structure

```text
infrastructure/
├── data_sources/
│   ├── remote/       # Retrofit abstract classes
│   └── local/        # Cache/Storage
└── network/
    ├── dio_client.dart    # Custom Dio setup
    └── interceptors/      # Auth, Logging, Cache
```

## Implementation Workflow

1. **Define Retrofit clients** — Create abstract classes with `@RestApi()` and HTTP annotations (`@GET`, `@POST`). Methods return `Future<DTO>`.
2. **Create DTOs** — Use `@freezed` and `@JsonSerializable` for all request/response bodies.
3. **Map to domain** — Data sources must map DTOs to Domain Entities (e.g., `userDto.toDomain()`).
4. **Guard enums** — Always use `@JsonKey(unknownEnumValue: Status.unknown)` to prevent crashes from new backend values.
5. **Add auth interceptor** — Inject `Authorization: Bearer <token>` in `onRequest`.
6. **Handle token refresh** — On 401, lock Dio, call `refreshToken()`, update stored token, retry via `dio.fetch(err.requestOptions)`.
7. **Map failures** — Convert `DioException` to typed `Failure` objects (ServerFailure, NetworkFailure).

### Retrofit Client & Safe Enum DTO Examples

See [implementation examples](references/implementation.md) for RestClient definitions and safe enum DTO patterns.

## Anti-Patterns

- **No Manual JSON Parsing**: Use Retrofit's generated mappers instead of `jsonDecode`
- **No Global Dio Instances**: Inject `Dio` through DI
- **No Inline Try-Catch**: repository layer should handle all Retrofit exceptions
- **No Unguarded Enums**: Always include `unknownEnumValue` to prevent crashes on new backend values

## Reference & Examples

For RestClient definitions and Auth Interceptor implementation:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

feature-based-clean-architecture | error-handling

---

### flutter-riverpod-state-management

---
name: flutter-riverpod-state-management
description: Implement reactive state management using Riverpod 2.0 with code generation in Flutter. Use when defining providers, building AsyncNotifiers, or overriding providers in tests.
metadata:
  triggers:
    files:
    - '**_provider.dart'
    - '**_notifier.dart'
    keywords:
    - riverpod
    - ProviderScope
    - ConsumerWidget
    - Notifier
    - AsyncValue
    - ref.watch
    - "@riverpod"
---
# Riverpod State Management

## **Priority: P0 (CRITICAL)**


## Structure

```text
lib/
├── providers/ # Global providers and services
└── features/user/
    ├── providers/ # Feature-specific providers
    └── models/    # @freezed domain models
```

## Provider Definition (Generator-First)

Use `@riverpod` annotations for all provider definitions. See [implementation examples](references/implementation.md) for full provider and consumer patterns.

## Consuming Providers

Use `ConsumerWidget` with `ref.watch()` and `AsyncValue.when()` for reactive UI. See [implementation examples](references/implementation.md).

## Implementation Guidelines

- **Generator First**: Use `@riverpod` annotations. Avoid manual `Provider` definitions.
- **Immutability**: Use `Freezed` for all state models.
- **ref.watch()**: Inside `build()` to rebuild on changes.
- **ref.listen()**: Inside `build()` for side-effects (navigation, dialogs). Never in provider init.
- **ref.read()**: ONLY in callbacks (`onPressed`).
- **Testing**: Override providers with `ProviderScope(overrides: [provider.overrideWithValue(Mock())])`.
- **Linting**: Enable `riverpod_lint` and `custom_lint` for cycle detection.

## Anti-Patterns

- **No side-effects in provider init**: Use `ref.listen()` in widgets instead.
- **No BuildContext in Notifiers**: Never pass `BuildContext` into Notifier/Provider.
- **No local provider instantiation**: Keep providers global; avoid dynamic creation.

## Related Topics

- [flutter-layer-based-clean-architecture](../flutter-layer-based-clean-architecture/SKILL.md)
- [flutter-dependency-injection](../flutter-dependency-injection/SKILL.md)
- [flutter-testing](../flutter-testing/SKILL.md)

---

### flutter-security

---
name: flutter-security
description: Enforce OWASP Mobile security standards for Flutter apps. Use when storing sensitive data, making network calls, handling tokens/PII, or preparing release builds.
metadata:
  triggers:
    files:
    - 'lib/infrastructure/**'
    - 'pubspec.yaml'
    keywords:
    - secure_storage
    - obfuscate
    - jailbreak
    - pinning
    - PII
    - OWASP
---

# Mobile Security

## **Priority: P0 (CRITICAL)**

## Implementation Workflow

1. **Store secrets securely** — Use `flutter_secure_storage` for tokens/PII. Never use `shared_preferences` for sensitive data.
2. **Externalize secrets** — Never store API keys in Dart code. Use `--dart-define` or `.env` files.
3. **Obfuscate releases** — Build `--obfuscate --split-debug-info=./symbols`. Deterrent only — move sensitive logic to backend.
4. **Pin certificates** — `dio_certificate_pinning` for high-security apps to prevent MITM.
5. **Root detection** — `flutter_jailbreak_detection` for root/jailbreak checks in financial/sensitive apps.
6. **Mask PII** — Redact PII (email, phone) from all logs and analytics.

### Secure Storage & Release Build Examples

See [implementation examples](references/implementation.md) for secure storage usage and obfuscated release build commands.

## Reference & Examples

SSL Pinning & Secure Storage: [references/REFERENCE.md](references/REFERENCE.md).

## Anti-Patterns

- **No Secrets in SharedPreferences**: Use `flutter_secure_storage` for tokens and PII
- **No Hardcoded API Keys**: Use `--dart-define` or secure vaults for all secrets
- **No Unobfuscated Releases**: Always build with `--obfuscate --split-debug-info`
- **No PII in Logs**: Mask or omit sensitive data from all logs and analytics events

## Related Topics

common/security-standards | layer-based-clean-architecture | performance


---

### flutter-testing

---
name: flutter-testing
description: Write unit, widget, and integration tests with robot patterns, widget keys, and Patrol in Flutter. Use when writing tests or implementing test automation.
metadata:
  triggers:
    files:
    - '**/test/**.dart'
    - '**/integration_test/**.dart'
    - '**/robots/**.dart'
    - 'lib/core/keys/**.dart'
    keywords:
    - test
    - patrol
    - robot
    - WidgetKeys
    - patrolTest
    - blocTest
    - mocktail
---
# Flutter Testing Standards

## **Priority: P0 (CRITICAL)**

## Core Rules

1. **Test Pyramid**: Unit > Widget > Integration.
2. **Naming**: `should <behavior> when <condition>`.
3. **AAA**: Arrange, Act, Assert in all tests.
4. **Shared Mocks**: `test/shared/` only — no local mocks.
5. **File Placement**: `_integration_test.dart` ONLY in `integration_test/`.
6. **Robot-First**: ALL UI assertions/interactions via **Robot pattern** (e.g., `CheckoutRobot`) — never raw `find.*`/`expect()` in test body.

## Widget Testing & Mocking

- **Setup**: Use `TestWrapper.init()` in `setUpAll` and `tester.pumpLocalizedWidget(...)`.
- **Mocking**: Use **GetIt registration** of Mock BLoCs in `setUpAll` if created internally. Use **blocTest** for BLoC logic and **whenListen** for state transitions.
- **Stubbing**: Always stub **bloc.state** and **bloc.stream** in `setUp`. Prohibit `any()` / `anyNamed()`.
- **Async**: Use **settle: false** for loading or stream states to verify mid-process transitions.

## Robot Pattern

- All interactions and assertions belong in `*Robot` (e.g., `expectFirstOrderVisible()`).
- Symmetric: every `expectXxxVisible()` needs **expectXxxNotVisible()** pairs.
- **BaseRobot Centralization**: Extract standard scrolling (`scrollDown`, `scrollToEnd`) and screen visibility assertions (`expectScreenVisible`, `expectScreenNotVisible`) into common `BaseRobot` or parent class to avoid duplication.
- Widget tests: include `pumpScreen(bloc:, settle:)` helper.
- **Widget Keys**: Use **WidgetKeys** constants from `lib/core/keys/` — never inline `Key('string')`.

## Integration Testing

- Use **patrolTest** with **IntegrationAuthHelper.loginOrSkip($)** for authenticated flows.
- Use **$.native.tap()** or `$.native.*` for native interactions (e.g., system dialogs).
- Create robot: `final robot = OrdersRobot($.tester)` — share same class as widget tests.
- Only `$.native.*` and navigation helpers may remain inline in test body.

## Anti-Patterns

- **No inline Key**: Use `WidgetKeys` constant. **No `any()`**: Use typed matchers.
- **No local mocks**: Use `test/shared/`. **No missing bloc stub**: Stub `state` + `stream`.
- **No test-body logic**: Move `find.*`/`expect()` to robot. **No raw find in integration tests**.
- **No `_integration_test.dart` in `test/`**: Rename or merge.
- **No unused imports**: Remove `v_dls` when robots handle assertions. Check Material import needs.
- **No happy-path-only**: Add `Edge cases` group. **No one-sided assertions**: Add `expectNotVisible` pairs.
- **No unchecked text casing**: Verify `.toUpperCase()`, `.tr()` in source.

## Verification

- [ ] Fakes used over Mocks for Repositories (well-defined inputs/outputs).
- [ ] Every ViewModel has unit tests covering loading, success, and error states.
- [ ] Every View has widget tests with faked ViewModel.
- [ ] Critical user flows have at least one integration test.
- [ ] `flutter test` passes.

---

### flutter-widgets

---
name: flutter-widgets
description: Build maintainable Flutter UI components with composition and theming. Use when building, refactoring, or reviewing widget implementations.
metadata:
  triggers:
    files:
    - '**_page.dart'
    - '**_screen.dart'
    - '**/widgets/**'
    keywords:
    - StatelessWidget
    - const
    - Theme
    - ListView
---
# UI & Widgets

## **Priority: P1 (OPERATIONAL)**


- **State**: Use `StatelessWidget` by default. `StatefulWidget` only for local state/controllers.
- **Composition**: Extract UI into small, atomic `const` widgets.
- **Theming**: Use `Theme.of(context)`. No hardcoded colors.
- **Layout**: Use `Flex` + `Gap/SizedBox`.
- **Widget Keys**: All interactive elements must use keys from `widget_keys.dart`.
- **File Size**: If UI file exceeds ~80 lines, extract sub-widgets into private classes.
- **Specialized**:
 - `SelectionArea`: For multi-widget text selection.
 - `InteractiveViewer`: For zoom/pan.
 - `ListWheelScrollView`: For pickers.
 - `IntrinsicWidth/Height`: Avoid unless strictly required.
- **Large Lists**: Always use `ListView.builder`.

```dart
class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  const AppButton({super.key, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) => ElevatedButton(onPressed: onPressed, child: Text(label));
}
```

## Anti-Patterns

- **No setState for server state**: Server or shared state belongs in BLoC, not widget state.
- **No widget file over 80 lines without extraction**: Extract sub-widgets into private classes.
- **No inline Key strings**: All keys must constants defined in `widget_keys.dart`.
- **No \_buildXxx() helper methods**: Extract to `const StatelessWidget` private class.
- **No manual widget repetition**: When 3+ sibling widgets of the same type differ only in data (e.g., radio buttons, tabs), map over a list instead. Put display labels inside the value object or a companion map so adding an option requires no UI change.

## References

- performance | testing

---

