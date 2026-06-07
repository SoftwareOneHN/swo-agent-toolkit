---
inclusion: manual
---

# Skills: android

> 26 skills. Load when editing android files.
> For code examples and implementation patterns, load `refs-android.md`.

## Index

# android Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| android-agp-upgrade | `build.gradle.kts`, `build.gradle`, `settings.gradle.kts`, `gradle.properties` | AGP 9, AGP upgrade, Gradle plugin, built-in Kotlin, new DSL, migrate AGP |
| **android-architecture** | `build.gradle.kts`, `settings.gradle.kts` | clean-architecture, module, layers, domain, UDF, unidirectional, feature module, core module, presentation layer, data layer |
| android-background-work | `**/*Worker.kt` | CoroutineWorker, WorkManager, doWork, PeriodicWorkRequest, OneTimeWorkRequest, @HiltWorker |
| **android-compose** | `**/*Screen.kt`, `**/*Composable*.kt`, `**/*Content.kt` | @Composable, Modifier, Column, Row, LazyColumn, setContent, recompose, remember, derivedStateOf, LaunchedEffect |
| android-compose-migration | `layout/*.xml`, `**/*Fragment.kt`, `**/*Activity.kt` | migrate to compose, xml to compose, compose migration, ComposeView, AndroidView, interoperability |
| **android-concurrency** | `**/*ViewModel.kt`, `**/*UseCase.kt`, `**/*Repository.kt` | suspend, viewModelScope, lifecycleScope, Flow, coroutine, Dispatcher, DispatcherProvider, GlobalScope |
| **android-deployment** | `build.gradle.kts`, `proguard-rules.pro` | signingConfigs, proguard, minifyEnabled, isMinifyEnabled, isShrinkResources, .aab, releaseKeystore |
| android-design-system | `**/*Screen.kt`, `**/ui/theme/**`, `**/compose/**` | MaterialTheme, Color, Typography, Modifier, Composable |
| **android-di** | `**/*Module.kt`, `**/*Component.kt` | @HiltAndroidApp, @Inject, @Provides, @Binds |
| android-edge-to-edge | `**/*Activity.kt`, `**/*Screen.kt`, `AndroidManifest.xml` | edge-to-edge, enableEdgeToEdge, system bars, WindowInsets, safeDrawingPadding, imePadding, status bar, navigation bar |
| android-legacy-navigation | `navigation/*.xml` | findNavController, NavDirections, navArgs |
| **android-legacy-security** | `**/*Activity.kt`, `**/*WebView*.kt`, `AndroidManifest.xml` | Intent, WebView, FileProvider, javaScriptEnabled |
| android-legacy-state | `**/*Fragment.kt`, `**/*Activity.kt` | repeatOnLifecycle, launchWhenStarted |
| android-navigation | `**/*Screen.kt`, `**/*Activity.kt`, `**/NavGraph.kt` | NavController, NavHost, composable, navArgument, deepLinks |
| android-navigation-3 | `**/*NavHost.kt`, `**/*Navigation*.kt`, `**/*Screen.kt` | Navigation 3, NavDisplay, NavKey, NavEntry, migrate navigation, multiple backstacks, nav3 |
| **android-navigation-type-safe** | `**/*NavHost.kt`, `**/*Graph.kt` | NavHost, navController, @Serializable |
| **android-networking** | `**/*Api.kt`, `**/*Service.kt`, `**/*Client.kt` | Retrofit, OkHttpClient, @GET, @POST |
| android-notifications | `**/*Notification*.kt`, `**/MainActivity.kt` | FirebaseMessaging, NotificationCompat, NotificationChannel, FCM |
| android-performance | `**/*Benchmark.kt`, `**/*Initializer.kt` | BaselineProfile, JankStats, recomposition |
| **android-persistence** | `**/*Dao.kt`, `**/*Database.kt`, `**/*Entity.kt` | @Dao, @Entity, RoomDatabase |
| android-resources | `strings.xml`, `**/*Screen.kt` | stringResource, plurals, R.string |
| **android-security** | `network_security_config.xml`, `AndroidManifest.xml` | EncryptedSharedPreferences, cleartextTrafficPermitted, intent-filter, api key, token storage, certificate pinning, root detection, secure storage |
| **android-state** | `**/*ViewModel.kt`, `**/*UiState.kt` | viewmodel, stateflow, livedata, uistate, MutableStateFlow, collectAsState, viewModelScope, UiState |
| **android-testing** | `**/*Test.kt`, `**/*Rule.kt` | @Test, runTest, composeTestRule, HiltAndroidTest, MockK, createAndroidComposeRule, MainDispatcherRule, @TestInstallIn |
| android-tooling | `build.gradle.kts`, `detekt.yml`, `.detekt/config.yml` | detekt, ktlint, lint, @Suppress, abortOnError, jlleitschuh |
| android-xml-views | `layout/*.xml`, `**/*Binding.java`, `**/*Binding.kt` | ViewBinding, ConstraintLayout, RecyclerView |

> Load matched skills: `<SKILLS>/android/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### android-agp-upgrade

---
name: android-agp-upgrade
description: Upgrade an Android project to Android Gradle Plugin (AGP) 9. Use when migrating to AGP 9, updating Gradle build files, migrating to built-in Kotlin, or adopting the new AGP DSL.
metadata:
  triggers:
    files:
    - 'build.gradle.kts'
    - 'build.gradle'
    - 'settings.gradle.kts'
    - 'gradle.properties'
    keywords:
    - AGP 9
    - AGP upgrade
    - Gradle plugin
    - built-in Kotlin
    - new DSL
    - migrate AGP
---
# AGP 9 Upgrade Workflow

## **Priority: P1**

Step-by-step workflow for upgrading an Android project to AGP 9.

## Prerequisites

- Check current AGP version. If below 8.x, recommend running the AGP Upgrade Assistant in Android Studio first.
- Do NOT use this skill for Kotlin Multiplatform (KMP) projects.
- Verify Gradle, JDK, and Kotlin version compatibility with AGP 9 release notes.

## Step 1: Update dependencies

- If KSP (`com.google.devtools.ksp`) is used, ensure version 2.3.6+.
- If Hilt is used, ensure version 2.59.2+.
- Update AGP to the latest stable 9.x version in the project's build files.

## Step 2: Migrate to built-in Kotlin

AGP 9 includes built-in Kotlin support — the `org.jetbrains.kotlin.android` plugin is no longer needed.

See [migration guide](references/built-in-kotlin.md) for detailed steps.

## Step 3: Migrate to the new AGP DSL

AGP 9 introduces a new DSL for `android {}` blocks. Key changes include namespace handling, build type configuration, and source set declarations.

See [DSL migration](references/dsl-migration.md) for before/after examples.

## Step 4: Migrate kapt to KSP or legacy-kapt

If the project uses `kapt`:
- Prefer migrating to KSP where annotation processors support it (Room, Hilt, Moshi).
- For processors without KSP support, use `legacy-kapt` as a bridge.

## Step 5: Update BuildConfig

If any module uses custom `BuildConfig` fields, update to the new AGP 9 syntax.

## Step 6: Clean up gradle.properties

Remove these flags after migration:
1. `android.builtInKotlin`
2. `android.newDsl`
3. `android.uniquePackageNames`
4. `android.enableAppCompileTimeRClass`

## Guidelines

- Never write or run Python scripts for build migration.
- Never add `android.disallowKotlinSourceSets=false` to `gradle.properties`.
- Do not run `clean` task when verifying — it wastes time.

## Verification

1. `./gradlew help` succeeds.
2. `./gradlew build --dry-run` succeeds.
3. Gradle IDE sync succeeds.

## References

- [Built-in Kotlin Migration](references/built-in-kotlin.md)
- [DSL Migration Guide](references/dsl-migration.md)


---

### android-architecture

---
name: android-architecture
description: Apply Clean Architecture layering, modularization, and Unidirectional Data Flow in Android projects. Use when setting up project structure, placing code in layers, configuring feature/core modules, or implementing UDF patterns.
metadata:
  triggers:
    files:
    - 'build.gradle.kts'
    - 'settings.gradle.kts'
    keywords:
    - clean-architecture
    - module
    - layers
    - domain
    - UDF
    - unidirectional
    - feature module
    - core module
    - presentation layer
    - data layer
---
# Android Architecture Standards

## **Priority: P0 (CRITICAL)**

## 1. Layer Your Project (Clean Architecture)

- **Domain**: Pure Kotlin (No Android deps). Contains UseCases and Models.
- **Data**: Repository impl, DataSources (API/DB). Maps DTO -> Domain.
- **UI**: ViewModel + Composable. Maps Domain -> UiState.

See [structure & examples](references/implementation.md) for Clean Architecture layer examples.

## 2. Modularize by Feature and Core

- **Feature Modules**: `:feature:home`, `:feature:profile`.
- **Core Modules**: `:core:ui` (Design System), `:core:network`, `:core:database`.
- **App Module**: DI Root and Navigation Guard.

See [structure & examples](references/implementation.md) for module configuration.

## 3. Enforce Unidirectional Data Flow (UDF)

- **Events**: UI -> ViewModel (user actions flow UP).
- **State**: ViewModel -> UI (`StateFlow<UiState>` flows DOWN).

## 4. Verify Jetpack Compose Integration

- **Hosting**: Use `setContent` in Activity (No XML Layouts).
- **State**: Hoist state to ViewModel using `collectAsStateWithLifecycle`.
- **Recomposition**: Ensure Composable parameters `@Stable` or `@Immutable`.
- **Navigation**: Use Compose Navigation with Type-Safe destinations.

## Anti-Patterns

- **No Logic in Activity**: Host Navigation only.
- **No Repo in UI**: Access data exclusively via ViewModel.
- **No Context in Domain**: Keep Logic Pure.

## Verification

- [ ] Domain layer has zero Android framework imports.
- [ ] Each feature module compiles independently.
- [ ] State flows one-way: Events UP, State DOWN.
- [ ] `./gradlew build` succeeds.

## References

- [Structure & Examples](references/implementation.md)
- [Jetpack Compose Best Practices](references/compose-standards.md)

---

### android-background-work

---
name: android-background-work
description: Implement WorkManager and background processing correctly on Android. Use when creating Worker classes, scheduling tasks, choosing between WorkManager and Foreground Services, or setting up Hilt in workers.
metadata:
  triggers:
    files:
      - '**/*Worker.kt'
    keywords:
      - CoroutineWorker
      - WorkManager
      - doWork
      - PeriodicWorkRequest
      - OneTimeWorkRequest
      - '@HiltWorker'
---

# Android Background Work Standards

## **Priority: P1**

## Implementation Guidelines

### WorkManager

- **CoroutineWorker**: Use for all background tasks.
- **Constraints**: explicit (Require Network, Charging).
- **Hilt**: Use `@HiltWorker` for DI integration. Inject dependencies via `@AssistedInject` constructor; bind with `HiltWorkerFactory` in `WorkManager` configuration.

### Foreground Services

- **Only When Necessary**: Use generating visible notifications only for tasks user actively aware of (Playback, Calls, Active Navigation). Otherwise use WorkManager.

## Anti-Patterns

- **No IntentService**: Deprecated. Use WorkManager for all background tasks.
- **No Short Background Jobs**: Use Coroutines in ViewModel scope instead.

## References

- [Worker Template](references/implementation.md)


---

### android-compose

---
name: android-compose
description: Build high-performance declarative UI with Jetpack Compose. Use when writing Composable functions, optimizing recomposition, hoisting state, or working with LazyColumn and side effects.
metadata:
  triggers:
    files:
    - '**/*Screen.kt'
    - '**/*Composable*.kt'
    - '**/*Content.kt'
    keywords:
    - "@Composable"
    - Modifier
    - Column
    - Row
    - LazyColumn
    - setContent
    - recompose
    - remember
    - derivedStateOf
    - LaunchedEffect
---
# Jetpack Compose Expert

## **Priority: P0 (CRITICAL)**

**Role**: Android UI Performance Expert. Prioritize frame stability and state management.

## 1. Hoist State Correctly

- **Screen** (Stateful) -> **Content** (Stateless).
- Pass lambdas down (`onItemClick: (Id) -> Unit`).
- NEVER pass ViewModel to stateless composables.
- Use `MaterialTheme.colorScheme`, no hardcoded hex.

See [implementation examples](references/implementation.md) for state hoisting patterns.

## 2. Optimize Recomposition

- Annotate params with `@Stable` or `@Immutable`.
- Use `key` in `LazyColumn` items for stable identity.
- Reuse or make Modifiers static where possible.
- Use `derivedStateOf` for frequently updating derived values.

See [implementation examples](references/implementation.md) for `derivedStateOf` usage.

## 3. Handle Side Effects Properly

- Use `LaunchedEffect` for one-shot or keyed side effects — never run side effects in composition body.
- Move complex calculations to ViewModel or `remember`.

## Anti-Patterns

- **No Side Effects in Composition Body**: Use `LaunchedEffect`, not raw coroutines.
- **No VM Deep Pass**: Hoist state; pass only data/callbacks.
- **No Heavy Computation in Composables**: Offload to ViewModel or `remember`.

## Verification

- [ ] All stateless Composables have `@Preview`.
- [ ] `LazyColumn` items use `key` parameter.
- [ ] No ViewModel passed below Screen-level Composables.
- [ ] `./gradlew build` succeeds.

## References

- [Optimization Patterns](references/implementation.md)

---

### android-compose-migration

---
name: android-compose-migration
description: Migrate an Android XML View to Jetpack Compose following a structured 10-step workflow. Use when converting XML layouts to Compose, setting up Compose in an existing View-based project, or incrementally adopting Compose.
metadata:
  triggers:
    files:
    - 'layout/*.xml'
    - '**/*Fragment.kt'
    - '**/*Activity.kt'
    keywords:
    - migrate to compose
    - xml to compose
    - compose migration
    - ComposeView
    - AndroidView
    - interoperability
---
# XML to Jetpack Compose Migration

## **Priority: P1**

Structured 10-step workflow for migrating XML layouts to Compose.

## Step 1: Identify the migration candidate

If the user specified a target XML layout, proceed to Step 2. Otherwise, pick the best candidate:
- Prefer leaf layouts (not deeply nested in other XMLs).
- Prefer layouts with few custom Views.
- Avoid layouts with complex RecyclerView adapters as a first migration.

## Step 2: Analyze the layout

Examine the XML structure: list all Views, data bindings, click listeners, style references, and custom Views needing `AndroidView` wrappers.

## Step 3: Create a plan

Generate a checklist of every View → Composable mapping. Present to user for approval.

## Step 4: Capture baseline UI

Ask the user for a screenshot, or take one via emulator for visual comparison.

## Step 5: Set up Compose dependencies

Check `build.gradle.kts` or `libs.versions.toml` for Compose BOM and compiler. If missing, add them. See [dependency setup](references/dependency-setup.md).

## Step 6: Set up Compose theming

If missing, initialize minimum required theme — map XML colors/styles to Compose. Do NOT migrate the entire theme.

## Step 7: Migrate the XML layout

Convert each View to its Compose equivalent. See [interop patterns](references/interop-patterns.md) for the View→Composable mapping table, ComposeView, and AndroidView usage. Include a `@Preview` for every new Composable.

## Step 8: Replace usages

Use `ComposeView` to host Compose in Views, or `AndroidView` for Views in Compose. See [interop patterns](references/interop-patterns.md).

## Step 9: Validate

Compare baseline screenshot with Compose Preview. Focus on layout and styling. Iterate until visual parity.

## Step 10: Clean up

Delete the migrated XML file and legacy tests. Only remove code not referenced elsewhere.

## Verification

- [ ] Compose Preview renders correctly.
- [ ] Visual parity with original XML layout.
- [ ] `./gradlew build` succeeds.
- [ ] No broken references to deleted XML files.

## Anti-Patterns

- **No full theme migration**: Only migrate what the target layout needs.
- **No new View instances in AndroidView update**: Mutate existing, don't recreate.
- **No missing ViewCompositionStrategy**: Always set it on ComposeView to avoid leaks.

## References

- [Dependency Setup](references/dependency-setup.md)
- [Interop Patterns](references/interop-patterns.md)


---

### android-concurrency

---
name: android-concurrency
description: Write correct coroutine scopes, Flow collection, and dispatcher injection in Android. Use when writing suspend functions, choosing between StateFlow and SharedFlow, or injecting Dispatchers for testability.
metadata:
  triggers:
    files:
    - '**/*ViewModel.kt'
    - '**/*UseCase.kt'
    - '**/*Repository.kt'
    keywords:
    - suspend
    - viewModelScope
    - lifecycleScope
    - Flow
    - coroutine
    - Dispatcher
    - DispatcherProvider
    - GlobalScope
---
# Android Concurrency Standards

## **Priority: P0**

## Implementation Guidelines

### Structured Concurrency

- **Scopes**: Always use `viewModelScope` (VM) or `lifecycleScope` (Activity/Fragment).
- **Dispatchers**: INJECT Dispatchers (`DispatcherProvider`) for testability. not hardcode `Dispatchers.IO`.

### Flow usage

- **Cold Streams**: Use `Flow` for data streams.
- **Hot Streams**: Use `StateFlow` (State) or `SharedFlow` (Events).
- **Collection**: Use `collectAsStateWithLifecycle()` (Compose) or `repeatOnLifecycle` (Views).

## Anti-Patterns

- **No GlobalScope**: Use viewModelScope or lifecycleScope — never GlobalScope.
- **No async/await by default**: Prefer simple suspend functions; async only for parallel calls.

## References

- [Dispatcher Pattern](references/implementation.md)

---

### android-deployment

---
name: android-deployment
description: Configure release signing, R8 obfuscation, and App Bundle publishing for Android. Use when setting up signing configs, enabling minification, adding ProGuard keep rules, or preparing for Play Store submission.
metadata:
  triggers:
    files:
    - 'build.gradle.kts'
    - 'proguard-rules.pro'
    keywords:
    - signingConfigs
    - proguard
    - minifyEnabled
    - isMinifyEnabled
    - isShrinkResources
    - .aab
    - releaseKeystore
---
# Android Deployment Standards

## **Priority: P0**

## Implementation Guidelines

### Build Configuration

- **Minification**: Always enable `isMinifyEnabled = true` and `isShrinkResources = true` for Release builds (R8).
- **Format**: Publish using **App Bundles (.aab)** for Play Store optimization.
- **Signing**: NEVER commit keystores or passwords. Use Environment Variables / Secrets.

### Proguard / R8

- **Rules**: Keep rules minimal. Use annotations (`@Keep`) for reflection-heavy classes instead of broad wildcard rules.
- **Mapping**: Upload `mapping.txt` to Play Console for crash de-obfuscation.

## Anti-Patterns

- **No debuggable=true in Release**: Breaks obfuscation and exposes internal logic.
- **No Secrets in Repo**: Use local.properties or CI environment variables.

## References

- [Signing & R8](references/implementation.md)

---

### android-design-system

---
name: android-design-system
description: Enforce Material Design 3 theming and design token usage in Jetpack Compose. Use when implementing M3 components, color schemes, typography, or design tokens.
metadata:
  triggers:
    files:
    - '**/*Screen.kt'
    - '**/ui/theme/**'
    - '**/compose/**'
    keywords:
    - MaterialTheme
    - Color
    - Typography
    - Modifier
    - Composable
---
# Android Design System (Jetpack Compose)

## **Priority: P2 (OPTIONAL)**


## Guidelines

Define `Color.kt`, `Theme.kt`, and `Type.kt` in `ui/theme/`. Map every raw color/type value to `lightColorScheme`/`darkColorScheme` slots. Access all tokens through `MaterialTheme`:
- Colors → `MaterialTheme.colorScheme.*`
- Text styles → `MaterialTheme.typography.*`
- Spacing → `.dp` units consistently

## Anti-Patterns

- **No Hardcoded Colors**: Use `MaterialTheme.colorScheme.*`, not `Color(0xFF...)`.
- **No Inline Typography**: Use `MaterialTheme.typography.*`, not raw `fontSize = 32.sp`.
- **No Magic Spacing**: Prefer named `.dp` tokens; avoid unexplained magic numbers.

## References

---

### android-di

---
name: android-di
description: Configure Hilt dependency injection with proper scoping, modules, and constructor injection in Android. Use when setting up Hilt DI, defining modules, or configuring component scoping.
metadata:
  triggers:
    files:
    - '**/*Module.kt'
    - '**/*Component.kt'
    keywords:
    - "@HiltAndroidApp"
    - "@Inject"
    - "@Provides"
    - "@Binds"
---
# Android Dependency Injection (Hilt)

## **Priority: P0**

## 1. Bootstrap Hilt

- Annotate `Application` class with `@HiltAndroidApp`.
- Annotate Activities/Fragments with `@AndroidEntryPoint`.

See [module templates](references/files.md) for bootstrap and module examples.

## 2. Define Modules

- Use `@Binds` (abstract class) over `@Provides` when possible — generates smaller code.
- explicit with `@InstallIn` (`SingletonComponent`, `ViewModelComponent`).

See [module templates](references/files.md) for `@Binds` examples.

## 3. Prefer Constructor Injection

- Use `@Inject constructor(...)` over field injection.
- Use `@AssistedInject` for runtime parameters.

## Anti-Patterns

- **No Manual Dagger Components**: Use Hilt — it generates all wiring.
- **No Field Injection in Logic**: Use constructor injection; field injection only in Android framework classes.

## References

- [Module Templates](references/files.md)

---

### android-edge-to-edge

---
name: android-edge-to-edge
description: Migrate a Jetpack Compose app to edge-to-edge display and fix system bar inset issues. Use when UI components are obscured by navigation/status bars, fixing IME insets, or enabling edge-to-edge for SDK 35+.
metadata:
  triggers:
    files:
    - '**/*Activity.kt'
    - '**/*Screen.kt'
    - 'AndroidManifest.xml'
    keywords:
    - edge-to-edge
    - enableEdgeToEdge
    - system bars
    - WindowInsets
    - safeDrawingPadding
    - imePadding
    - status bar
    - navigation bar
---
# Edge-to-Edge Migration

## **Priority: P1**

Structured workflow for migrating a Compose app to edge-to-edge display.

## Prerequisites

- Project **MUST** use Jetpack Compose.
- Project **MUST** target SDK 35+. If lower, increase `compileSdk` to 35.

## Step 1: Plan

1. Locate all Activity classes. For each without `enableEdgeToEdge()`, plan to add it.
2. In each Activity, find all lists, FABs, and text fields that need inset handling.
3. If `TextField`/`OutlinedTextField` is present, plan IME inset handling.

## Step 2: Enable edge-to-edge

1. Add `enableEdgeToEdge()` before `setContent` in every `Activity.onCreate`.
2. Add `android:windowSoftInputMode="adjustResize"` in AndroidManifest for Activities with soft keyboard.

## Step 3: Apply insets

Choose ONE method per component to avoid double padding:

1. **PREFERRED — Scaffold**: Pass `PaddingValues` to content lambda.
2. **Material 3 components**: Use built-in inset handling (`TopAppBar`, `NavigationBar`, etc.).
3. **Outside Scaffold**: Use `Modifier.safeDrawingPadding()` or `windowInsetsPadding`.

See [inset patterns](references/inset-patterns.md) for RIGHT/WRONG code examples.

## Step 4: Handle IME

For Activities with soft keyboard:
- Set `adjustResize` in manifest (NOT deprecated `SOFT_INPUT_ADJUST_RESIZE`).
- Add `imePadding()` or `fitInside(WindowInsetsRulers.Ime.current)` to content container.
- Place `imePadding` BEFORE `verticalScroll()`.

See [inset patterns](references/inset-patterns.md) for IME-specific RIGHT/WRONG patterns.

## Step 5: Lists and FABs

- Apply inset padding to `contentPadding` of `LazyColumn`/`LazyRow`, NOT as `Modifier.padding()` on parent.
- FABs inside Scaffold are handled automatically. Outside Scaffold, use `safeDrawingPadding()`.

## Verification

- [ ] Every `Activity` calls `enableEdgeToEdge()`.
- [ ] `adjustResize` set in AndroidManifest for keyboard Activities.
- [ ] Text fields have IME inset handling.
- [ ] List items scroll behind system bars via `contentPadding`.
- [ ] `./gradlew build` succeeds.

## Anti-Patterns

- **No double inset padding**: Never combine `contentWindowInsets = WindowInsets.safeDrawing` with `imePadding()` on the same content — causes double padding when IME opens.
- **No parent padding on lists**: Apply insets to `contentPadding`, not parent `Modifier.padding()` — parent padding clips scrolling content.
- **No `SOFT_INPUT_ADJUST_RESIZE`**: Deprecated. Use manifest `adjustResize` attribute.

## References

- [Inset Patterns (RIGHT/WRONG)](references/inset-patterns.md)


---

### android-legacy-navigation

---
name: android-legacy-navigation
description: Implement Jetpack Navigation Component with XML graphs and SafeArgs for type-safe fragment navigation. Use when working with XML-based navigation or SafeArgs in legacy Android projects.
metadata:
  triggers:
    files:
    - 'navigation/*.xml'
    keywords:
    - findNavController
    - NavDirections
    - navArgs
---
# Android Legacy Navigation Standards

## **Priority: P1**

## 1. Set Up Single-Activity Architecture

- Use one Host Activity with `NavHostFragment`.
- Enable SafeArgs plugin — MANDATORY for passing data between fragments.

See [XML graph & SafeArgs examples](references/implementation.md) for NavHostFragment setup.

## 2. Manage Navigation Graphs

- **Nested Graphs**: Modularize `navigation/` resources (e.g., `nav_auth.xml`, `nav_main.xml`) to keep graphs readable.
- **Deep Links**: Define explicit `<deepLink>` in graph, not AndroidManifest intent filters.

## 3. Navigate with SafeArgs

See [XML graph & SafeArgs examples](references/implementation.md) for type-safe navigation usage.

## Anti-Patterns

- **No Raw String Bundle Keys**: Use SafeArgs generated type-safe classes.
- **No Manual Fragment commit()**: Use NavController for all navigation.

## References

- [XML Graph & SafeArgs](references/implementation.md)

---

### android-legacy-security

---
name: android-legacy-security
description: Harden Intent handling, WebView configuration, and FileProvider access in Android apps. Use when securing Intent extras, configuring WebViews, or exposing files via FileProvider.
metadata:
  triggers:
    files:
    - '**/*Activity.kt'
    - '**/*WebView*.kt'
    - 'AndroidManifest.xml'
    keywords:
    - Intent
    - WebView
    - FileProvider
    - javaScriptEnabled
---
# Android Legacy Security Standards

## **Priority: P0**

## 1. Secure Intents and Components

- Set `android:exported="false"` for all internal Activities/Services unless needed for deep links.
- Verify `resolveActivity` before starting implicit intents.
- Treat all incoming Intent extras as untrusted — validate all schema/data types.

See [hardening examples](references/implementation.md) for manifest and component restrictions.

## 2. Lock Down WebViews

- Default to `javaScriptEnabled = false`. Use `WebViewClient` and `WebChromeClient` to restrict navigation.
- Disable `allowFileAccess` and `allowFileAccessFromFileURLs` to prevent local file theft via XSS.
- If using `@JavascriptInterface` (API 17+), strictly limit exposed API surface.

See [hardening examples](references/implementation.md) for WebView lockdown patterns.

## 3. Protect Storage and Files

- **NEVER expose `file://` URIs**. Use `FileProvider` to generate `content://` URIs with temporary permissions.
- Use `EncryptedSharedPreferences` for auth tokens and PII. Never use `MODE_WORLD_READABLE`.
- Use `NetworkSecurityConfig` to disable `cleartextTrafficPermitted` and implement certificate pinning.

## Anti-Patterns

- **No Implicit Intents Internally**: Use explicit intents with component class name.
- **No MODE_WORLD_READABLE**: Never use for SharedPreferences or files.

## References

- [Hardening Examples](references/implementation.md)

---

### android-legacy-state

---
name: android-legacy-state
description: Integrate ViewModel state with Views using Coroutines and Lifecycle on Android. Use when managing state with repeatOnLifecycle or lifecycle-aware coroutines in Fragment/Activity.
metadata:
  triggers:
    files:
    - '**/*Fragment.kt'
    - '**/*Activity.kt'
    keywords:
    - repeatOnLifecycle
    - launchWhenStarted
---
# Android Legacy State Standards

## **Priority: P1**

## Implementation Guidelines

### Flow Consumption

- **Rule**: ALWAYS use `repeatOnLifecycle(Lifecycle.State.STARTED)` to collect flows in Views.
- **Why**: Prevents crashes (collecting while view destroyed) and saves resources (stops collecting in background).

### LiveData vs Flow

- **New Code**: Use `StateFlow` exclusively.
- **Legacy**: If using LiveData, observe with `viewLifecycleOwner` (Fragment), NOT `this`.

## Anti-Patterns

- **No launchWhenStarted/Resumed**: Deprecated. Use repeatOnLifecycle instead.
- **No observe(this) in Fragments**: Use viewLifecycleOwner to prevent lifecycle leaks.

## References

- [Flow Consumption Template](references/implementation.md)

---

### android-navigation

---
name: android-navigation
description: Implement navigation with Jetpack Compose Navigation and App Links on Android. Use when implementing navigation flows, deep links, or backstack handling.
metadata:
  triggers:
    files:
    - '**/*Screen.kt'
    - '**/*Activity.kt'
    - '**/NavGraph.kt'
    keywords:
    - NavController
    - NavHost
    - composable
    - navArgument
    - deepLinks
---
# Android Navigation (Jetpack Compose)

## **Priority: P2 (OPTIONAL)**


## Guidelines

- **Library**: Use `androidx.navigation:navigation-compose`.
- **Type Safety**: Use sealed classes for routes, never raw strings.
- **Deep Links**: Configure `intent-filter` in Manifest and `deepLinks` in NavHost.
- **Validation**: Validate arguments (e.g., proper IDs) before loading content.

## Anti-Patterns

- **No String Routes**: Use `Screen.Product.route` instead of `"product/$id"`.
- **No Unvalidated Deep Links**: Check resource existence before rendering.
- **No Missing Manifest**: Deep links require `autoVerify=true` intent filters.

## References

- [Navigation Patterns](references/navigation-patterns.md)

---

### android-navigation-3

---
name: android-navigation-3
description: Install and migrate to Jetpack Navigation 3. Use when implementing Navigation 3 patterns including NavDisplay, NavKey routes, deep links, multiple backstacks, scenes (dialogs, bottom sheets), or migrating from Navigation 2.
metadata:
  triggers:
    files:
    - '**/*NavHost.kt'
    - '**/*Navigation*.kt'
    - '**/*Screen.kt'
    keywords:
    - Navigation 3
    - NavDisplay
    - NavKey
    - NavEntry
    - migrate navigation
    - multiple backstacks
    - nav3
---
# Jetpack Navigation 3

## **Priority: P1**

Guide for implementing and migrating to Navigation 3 in Jetpack Compose.

## Core concepts

Navigation 3 replaces the previous `NavHost`/`NavController` pattern with a simpler, state-driven approach:
- **Routes** are Kotlin data objects/classes (not strings).
- **Back stack** is a plain `mutableStateListOf<Any>`.
- **`NavDisplay`** renders the current route based on a lambda.

## Basic usage

```kotlin
val backStack = remember { mutableStateListOf<Any>(RouteHome) }

NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = { key ->
        when (key) {
            is RouteHome -> NavEntry(key) { HomeScreen(onNavigate = { backStack.add(it) }) }
            is RouteDetail -> NavEntry(key) { DetailScreen(key.id) }
            else -> error("Unknown route: $key")
        }
    }
)
```

## Migration from Navigation 2

See [migration guide](references/migration-guide.md) for step-by-step conversion from `NavHost`/`NavController` to `NavDisplay`.

Key changes:
1. Replace string routes with data objects/classes.
2. Replace `NavHost` with `NavDisplay`.
3. Replace `NavController.navigate()` with direct list manipulation.
4. Replace `navArgument` with data class properties.

## Common patterns

See [recipes](references/recipes.md) for code examples:
- Basic navigation with arguments
- Bottom navigation with multiple backstacks
- Deep links (basic and with synthetic backstack)
- Dialogs and bottom sheets
- Conditional navigation (auth flows)
- Returning results between screens
- Modularized navigation with Hilt or Koin

## Verification

- [ ] Routes are data objects/classes, no string-based routing.
- [ ] Back stack is a `mutableStateListOf<Any>`.
- [ ] `NavDisplay` handles all routes in `entryProvider`.
- [ ] `./gradlew build` succeeds.

## Anti-Patterns

- **No string-based routes**: Use Kotlin data objects/classes for type safety.
- **No NavController for new projects**: Use `NavDisplay` with a state list.
- **No `remember { navController() }`**: Navigation 3 doesn't use NavController.

## References

- [Migration Guide (Nav2 → Nav3)](references/migration-guide.md)
- [Recipes](references/recipes.md)


---

### android-navigation-type-safe

---
name: android-navigation-type-safe
description: Implement type-safe Jetpack Navigation Compose routes using Kotlin serialization. Use when defining navigation graphs with type-safe destinations in Jetpack Compose.
metadata:
  triggers:
    files:
    - '**/*NavHost.kt'
    - '**/*Graph.kt'
    keywords:
    - NavHost
    - navController
    - "@Serializable"
---
# Android Navigation Standards

## **Priority: P0**

## Implementation Guidelines

### Type-Safe Navigation

- **Library**: Navigation Compose 2.8.0+.
- **Routes**: Use `@Serializable` objects/classes instead of String routes.
- **Arguments**: No manual bundle parsing. Use `.toRoute<T>()`.

### Structure

- **Graphs**: Split large apps into nested navigation graphs (`navigation` extension functions).
- **Hoisting**: Hoist navigation events out of Screens. Composable screens should accept callbacks (`onNavigateToX`).

## Anti-Patterns

- **No String Routes**: Use @Serializable typed objects/classes for destinations.
- **No NavController in Composables**: Hoist navigation events to screen-level callbacks.

## References

- [Route Definitions](references/implementation.md)

---

### android-networking

---
name: android-networking
description: Integrate Retrofit, OkHttp, and Kotlinx Serialization for type-safe API communication in Android. Use when building API clients, adding interceptors, or configuring network security.
metadata:
  triggers:
    files:
    - '**/*Api.kt'
    - '**/*Service.kt'
    - '**/*Client.kt'
    keywords:
    - Retrofit
    - OkHttpClient
    - "@GET"
    - "@POST"
---
# Android Networking Standards

## **Priority: P0**

## 1. Configure HTTP Stack

- Use **Retrofit 2** with **OkHttp 4** for all backend communication.
- Use **Kotlinx Serialization** with `@SerialName` for JSON field mapping.
- Implement **Certificate Pinning** for sensitive production domains.

See [setup & wrappers](references/implementation.md) for DTO and API examples.

## 2. Define API Endpoints

- All API calls must `suspend` functions.
- Declare endpoints only in API interface — handle errors in Repository.

See [setup & wrappers](references/implementation.md) for API endpoint definitions.

## 3. Add Cross-Cutting Concerns

- Use OkHttp Interceptors for `Bearer token` injection and `HttpLoggingInterceptor` (debug only).
- Wrap responses with `Result` wrapper or `Either` in Repository layer.
- Define R8/ProGuard rules for Retrofit/OkHttp when `isMinifyEnabled = true`.
- Use **MockWebServer** for unit/integration tests — cover 500, 401, 403 error cases.

## Anti-Patterns

- **No Blocking Network Calls**: All API functions must suspend.
- **No Logic in API Interface**: Only declare endpoints — handle errors in Repository.
- **No Raw Converter Factory**: Explicitly set "application/json" MediaType with kotlinx.serialization.

## References

- [Setup & Wrappers](references/implementation.md)

---

### android-notifications

---
name: android-notifications
description: Integrate push notifications using Firebase Cloud Messaging and NotificationCompat on Android. Use when setting up FCM, creating notification channels, or handling local notifications.
metadata:
  triggers:
    files:
    - '**/*Notification*.kt'
    - '**/MainActivity.kt'
    keywords:
    - FirebaseMessaging
    - NotificationCompat
    - NotificationChannel
    - FCM
---
# Android Notifications

## **Priority: P2 (OPTIONAL)**


## Implementation Guidelines

- **Channels**: Create **`NotificationChannel`** with unique ID (required for **API 26+**). Notifications without valid channel **silently dropped**. Use **`NotificationCompat`** for backwards compatibility.
- **Permissions**: **Explicitly request `POST_NOTIFICATIONS`** on **Android 13+ (API 33)**. Avoid requesting system permission on **app launch**; show **priming dialog** first to explain benefit.
- **Service**: Implement **`FirebaseMessagingService`** with **`onMessageReceived`** and **`onNewToken`** for background push handling. Declare service in **`AndroidManifest`** with `MESSAGING_EVENT` intent action.
- **Flow**: Handle **notification taps in both `onCreate` and `onNewIntent`** using **`PendingIntent`**. Pass data between activities via `Intent` extras.
- **Payload**: Limit notification payload to essential IDs. Perform **background data fetching** via WorkManager if more data needed.

## Anti-Patterns

- **No Missing Channel**: Notifications fail silently without channels on API 26+.
- **No Unconditional Requests**: Don't spam permission dialog on first launch.
- **No Missing Manifest**: Service must declared with `MESSAGING_EVENT` action.

## References

- [Implementation Details](references/implementation.md)

---

### android-performance

---
name: android-performance
description: Optimize Android app startup, UI rendering, and frame stability with Baseline Profiles and lazy initialization. Use when reducing startup time, diagnosing jank, or improving rendering performance.
metadata:
  triggers:
    files:
    - '**/*Benchmark.kt'
    - '**/*Initializer.kt'
    keywords:
    - BaselineProfile
    - JankStats
    - recomposition
---
# Android Performance Standards

## **Priority: P1**

## 1. Accelerate Startup

- Generate **Baseline Profiles** for all production apps — pre-compiles critical paths (30-40% startup improvement).
- Defer heavy SDK init using `App Startup` or lazy Singletons. Never block `Application.onCreate`.

See [baseline & startup](references/implementation.md) for lazy initialization patterns.

## 2. Eliminate UI Jank

- Use Layout Inspector to find unnecessary recompositions.
- Load images with Coil/Glide using proper caching and resizing (`.crossfade()`).
- `LazyColumn` must use `key` and stable item classes.

See [baseline & startup](references/implementation.md) for LazyColumn optimization.

## 3. Avoid Layout Bottlenecks

- Replace nested weights with `ConstraintLayout` (Views) or `Row`/`Column` with `Modifier.weight` (Compose).
- Never hold Activity context in Singletons — use Application context to prevent memory leaks.

## Anti-Patterns

- **No Nested Weights**: Use ConstraintLayout (Views) or Row/Column (Compose) instead.
- **No Activity Context in Singletons**: Use Application context to prevent memory leaks.

## References

- [Baseline & Startup](references/implementation.md)

---

### android-persistence

---
name: android-persistence
description: Implement Room database schemas and DataStore preferences with proper async patterns in Android. Use when defining Room entities, DAOs, migrations, or replacing SharedPreferences with DataStore.
metadata:
  triggers:
    files:
    - '**/*Dao.kt'
    - '**/*Database.kt'
    - '**/*Entity.kt'
    keywords:
    - "@Dao"
    - "@Entity"
    - RoomDatabase
---
# Android Persistence Standards

## **Priority: P0**

## 1. Configure Room Database

- Return `Flow<List<T>>` for queries, use `suspend` for Write/Insert.
- Keep `@Entity` data classes simple. Map to Domain models in Repository.
- Use `@Transaction` for multi-table queries (Relations).

See [DAO templates](references/implementation.md) for Room DAO patterns.

## 2. Migrate to DataStore

- Replace `SharedPreferences` with `ProtoDataStore` (type-safe) or `PreferencesDataStore`.
- Inject singleton DataStore instance via Hilt.

See [DAO templates](references/implementation.md) for DataStore migration patterns.

## Anti-Patterns

- **No IO on Main Thread**: Room handles dispatchers, but verify Flow collected off-main.
- **No @Entity in UI Layer**: Map to Domain or UI models in Repository.

## References

- [DAO Templates](references/implementation.md)

---

### android-resources

---
name: android-resources
description: Organize strings, drawables, and localization resources in Android projects. Use when managing Android resources, plurals, or adding multi-language support.
metadata:
  triggers:
    files:
    - 'strings.xml'
    - '**/*Screen.kt'
    keywords:
    - stringResource
    - plurals
    - R.string
---
# Android Resources Standards

## **Priority: P2**

## Implementation Guidelines

### Strings & Localization

- **Define in XML**: All UI text must in **`strings.xml`**. Use **`stringResource(R.string.*)`** in Compose.
- **Formatting**: Use **format args (`%s`, `%d`)** instead of concatenation. Use **`plurals`** (e.g., `<item quantity="one">`) for quantity-sensitive strings.
- **Parity**: Maintain **Localizable.strings (iOS)** parity where possible for shared features.
- **Dynamic Access**: Use **`context.getString(R.string.id, args)`** for dynamic lookups.

### Assets / Drawables

- **Formats**: Prefer **VectorDrawables (`.xml`)** over RASTER images. Scale cleanly across density buckets (mdpi, hdpi, xhdpi, xxhdpi).
- **Plurals**: Use `resources.getQuantityString(R.plurals.items, count, count)` for quantity-sensitive strings.
- **Dark Mode**: Support **`Configuration.UI_MODE_NIGHT`** via **`values-night/`** qualifier or **`MaterialTheme`** tokens. Never use hardcoded hex colors in Layouts/Composables.
- **Themes**: Map all colors to **Design Tokens** (primary, surface, error) for consistent skinning.

## Anti-Patterns

- **No String Concatenation in UI**: Use format args (`%s`, `%d`) in strings.xml instead.
- **No Hardcoded UI Text**: All visible strings must defined in strings.xml.

## References

- [XML Structure](references/implementation.md)

---

### android-security

---
name: android-security
description: Secure data encryption, network configuration, and permissions in Android apps. Use when handling API keys, auth tokens, certificate pinning, EncryptedSharedPreferences, or securing exported components.
metadata:
  triggers:
    files:
    - 'network_security_config.xml'
    - 'AndroidManifest.xml'
    keywords:
    - EncryptedSharedPreferences
    - cleartextTrafficPermitted
    - intent-filter
    - api key
    - token storage
    - certificate pinning
    - root detection
    - secure storage
---
# Android Security Standards

## **Priority: P0 (CRITICAL)**

## Implementation Guidelines

### Data Storage

- **Secrets**: NEVER store API keys in code. Use `EncryptedSharedPreferences` for sensitive local data (Tokens).
- **Keystore**: Use Android Keystore System for cryptographic keys.

### Network

- **HTTPS**: Enforce HTTPS via `network_security_config.xml` (`cleartextTrafficPermitted="false"`).
- **Pinning**: Consider Certificate Pinning for high-security apps.

### Component Export

- **Exported**: Explicitly set `android:exported="false"` for Activities/Receivers unless intended for external use.

## Anti-Patterns

- **No Sensitive Logs**: Strip logs in Release builds.
- **No Homebrew Root Detection**: Use Play Integrity API instead.
- **No Raw URL String Concatenation**: Use `Uri.Builder` or `HttpUrl` (OkHttp) to prevent parameter injection.

## References

- [Setup Examples](references/implementation.md)
- [common/common-security-standards] — shared OWASP baselines
- [android/android-legacy-security] — Intent, WebView, and FileProvider hardening

---

### android-state

---
name: android-state
description: Configure ViewModel state emission with StateFlow, sealed UiState classes, and lifecycle-safe collection in Android. Use when working with ViewModels, UiState patterns, or exposing state to Compose UI.
metadata:
  triggers:
    files:
    - '**/*ViewModel.kt'
    - '**/*UiState.kt'
    keywords:
    - viewmodel
    - stateflow
    - livedata
    - uistate
    - MutableStateFlow
    - collectAsState
    - viewModelScope
    - UiState
---
# Android State Management

## **Priority: P0**

## 1. Structure ViewModel

- Expose ONE `StateFlow<UiState>` via `.asStateFlow()`.
- Use `viewModelScope` for all coroutines.
- Trigger initial load in `init` block.

See [templates](references/implementation.md) for ViewModel and UiState examples.

## 2. Define UI State (LCE Pattern)

- Use sealed interface with Loading, Content, Error variants.
- Mark data classes `@Immutable`.

See [templates](references/implementation.md) for sealed UiState pattern.

## 3. Collect State Lifecycle-Safely

- Use `collectAsStateWithLifecycle()` in Compose.
- Use `SharingStarted.WhileSubscribed(5000)` for shared resources.

## Anti-Patterns

- **No LiveData for New Code**: Use StateFlow — lifecycle-safe and Compose-compatible.
- **No Public MutableStateFlow**: Expose only `.asStateFlow()` to consumers.
- **No Context in ViewModel**: Leaks Activity. Use Application context if truly needed.

## Verification

- [ ] Each ViewModel exposes exactly one `StateFlow<UiState>`.
- [ ] UiState is a sealed interface with Loading, Content, Error variants.
- [ ] UI collects with `collectAsStateWithLifecycle()`.
- [ ] `./gradlew test` passes for ViewModel tests.

## References

- [Templates](references/implementation.md)

---

### android-testing

---
name: android-testing
description: Write unit tests, Compose UI tests, and Hilt-integrated tests for Android. Use when writing test files or testing ViewModels, Composables, or Repositories with MockK and coroutine test utilities.
metadata:
  triggers:
    files:
    - '**/*Test.kt'
    - '**/*Rule.kt'
    keywords:
    - "@Test"
    - runTest
    - composeTestRule
    - HiltAndroidTest
    - MockK
    - createAndroidComposeRule
    - MainDispatcherRule
    - "@TestInstallIn"
---
# Android Testing Standards

## **Priority: P0**

## Implementation Guidelines

### Unit Tests

- **Scope**: ViewModels, Usecases, Repositories, Utils.
- **Coroutines**: Use `runTest` (kotlinx-coroutines-test). Use `MainDispatcherRule` to mock Main dispatcher.
- **Mocking**: Use MockK.

### UI Integration Tests (Instrumentation)

- **Scope**: Composable Screens, Navigation flows.
- **Rules**: Use `createAndroidComposeRule` + Hilt (`HiltAndroidRule`).
- **Isolation**: Fake repositories in DI modules (`@TestInstallIn`).

## Anti-Patterns

- **No Real Network in Tests**: Always mock with MockK or fake repositories via @TestInstallIn.
- **No Thread.sleep**: Use IdlingResource or composeTestRule.waitUntil for async timing.

## References

- [Test Rules](references/implementation.md)

---

### android-tooling

---
name: android-tooling
description: Configure static analysis with Detekt, Ktlint, and Android Lint for CI/CD quality gates. Use when adding lint rules, configuring code quality checks, or setting up analysis as a CI gate.
metadata:
  triggers:
    files:
    - 'build.gradle.kts'
    - 'detekt.yml'
    - '.detekt/config.yml'
    keywords:
    - detekt
    - ktlint
    - lint
    - "@Suppress"
    - abortOnError
    - jlleitschuh
---
# Android Tooling Standards

## **Priority: P1**

## Implementation Guidelines

### Static Analysis

- **Detekt**: Enforce code complexity rules (LongMethod, LargeClass). Fail build on high complexity.
- **Ktlint**: Enforce formatting style (Indent, Spacing). Use `jlleitschuh` plugin.
- **Android Lint**: Treat warnings as errors in CI (`abortOnError = true`).

### CI Gates

- **Pre-commit**: Run lightweight checks (formatting) locally.
- **Pipeline**: Run full checks (Detekt + Lint + Unit Tests) on Pull Request.

## Anti-Patterns

- **No @Suppress in Production**: Fix Detekt/lint violation at source.
- **No Manual Formatting**: Let Ktlint handle it — configure auto-format on save in IDE.

## References

- [Configuration](references/implementation.md)

---

### android-xml-views

---
name: android-xml-views
description: Implement ViewBinding, RecyclerView, and XML layouts correctly on Android. Use when working with XML layouts, ViewBinding, or RecyclerView adapters in legacy Android projects.
metadata:
  triggers:
    files:
    - 'layout/*.xml'
    - '**/*Binding.java'
    - '**/*Binding.kt'
    keywords:
    - ViewBinding
    - ConstraintLayout
    - RecyclerView
---
# Android XML Views Standards

## **Priority: P1**

## Implementation Guidelines

### ViewBinding

- **Standard**: Use ViewBinding for all XML layouts.
- **Synthetics**: `kotlin-android-extensions` Dead. Remove it.
- **KAPT**: Avoid DataBinding unless strictly necessary (impacts build speed).

### RecyclerView

- **Adapter**: Always inherit `ListAdapter` (wraps AsyncListDiffer).
- **Updates**: Provide proper `DiffUtil.ItemCallback`. NEVER call `notifyDataSetChanged()`.

### Layouts

- **ConstraintLayout**: Use for complex flat hierarchies.
- **Performance**: Avoid deep nesting (LinearLayout inside LinearLayout).

## Anti-Patterns

- **No findViewById**: Deprecated. Use ViewBinding for all XML layouts.
- **No kotlin-android-extensions**: Deprecated. Remove all `import kotlinx.android.synthetic.*`.

## References

- [ViewBinding & Adapter](references/implementation.md)

---

