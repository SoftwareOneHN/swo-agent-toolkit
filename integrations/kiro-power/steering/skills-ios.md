---
inclusion: manual
---

# Skills: ios

> 15 skills. Load when editing ios files.
> For code examples and implementation patterns, load `refs-ios.md`.

## Index

# ios Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **ios-app-lifecycle** | `AppDelegate.swift`, `SceneDelegate.swift` | didFinishLaunchingWithOptions, willConnectTo, backgroundTask, Shortcut, UserActivity |
| **ios-architecture** | `**/*ViewModel.swift`, `**/*Coordinator.swift`, `**/*ViewController.swift` | MVVM, Coordinator, ViewState, Output, Input |
| ios-design-system | `**/*View.swift`, `**/Theme/**`, `**/DesignSystem/**` | Color, Font, SwiftUI, ViewModifier, Theme |
| ios-localization | `**/*.stringcatalog`, `**/*.xcassets`, `**/*.strings` | LocalizedStringResource, NSLocalizedString, String(localized:) |
| ios-navigation | `**/*View.swift`, `**/*App.swift` | NavigationStack, NavigationLink, onOpenURL, universalLink, NSUserActivity |
| **ios-networking** | `**/*Service.swift`, `**/*API.swift`, `**/*Client.swift` | URLSession, Alamofire, Moya, URLRequest, URLComponents, Codable |
| ios-notifications | `**/*Notification*.swift`, `**/*AppDelegate.swift` | UNUserNotificationCenter, APNS, UNNotificationRequest, deviceToken |
| **ios-persistence** | `**/*.xcdatamodeld`, `**/*Model.swift` | PersistentContainer, FetchRequest, ManagedObject, Query, ModelContainer, Repository |
| **ios-swiftui** | `**/*View.swift` | View, State, Binding, EnvironmentObject |
| **ios-ui-navigation** | `**/*View.swift`, `**/*.xib`, `**/*.storyboard` | NSLayoutConstraint, UIStackView, SnapKit, layoutSubviews |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| **ios-dependency-injection** | @Injected, Resolver, Container, Swinject, register, resolve |
| ios-deployment | Fastfile, Appfile, Matchfile, ios_bundle_id, provisioning_profile, testflight |
| **ios-performance** | Instruments, Allocations, Leaks, dequeueReusableCell, ios performance, swift performance, optimize ios, time profiler, frame drops, main thread, slow scroll |
| **ios-security** | SecItemAdd, kSecClassGenericPassword, LAContext, LocalAuthentication, ios security, swift security, keychain, biometric, face id, touch id, certificate pinning, app transport security |
| **ios-state-management** | Observable, @Published, PassthroughSubject, @Observable, @Namespace |

> Load matched skills: `<SKILLS>/ios/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### ios-app-lifecycle

---
name: ios-app-lifecycle
description: Configure AppDelegate, SceneDelegate, deep linking, and background tasks. Use when configuring iOS app lifecycle, deep linking, or background task scheduling.
metadata:
  triggers:
    files:
    - 'AppDelegate.swift'
    - 'SceneDelegate.swift'
    keywords:
    - didFinishLaunchingWithOptions
    - willConnectTo
    - backgroundTask
    - Shortcut
    - UserActivity
---
# iOS App Lifecycle

## **Priority: P0**

## Implementation Workflow

1. **Configure SceneDelegate** — Use for UI windows and scene-specific state in iOS 13+.
2. **Keep AppDelegate slim** — Focus on app-wide setup (DI, Analytics, Push registration). Move initialization logic to dedicated `Bootstrapper` or `AppCoordinator`.
3. **Handle deep links** — Prefer Universal Links over custom URL schemes. Handle via `scene(_:continue:userActivity:)`. Route through Root Coordinator.
4. **Schedule background tasks** — Use `BGTaskScheduler` for periodic data refresh. Always handle `expirationHandler` to avoid system kill.

See [bootstrapper pattern and background task examples](references/implementation.md)

## Anti-Patterns

- **No Complex AppDelegate Logic**: Delegate to Bootstrapper service
- **No Manual AppDelegate UIWindow**: Use SceneDelegate for iOS 13+
- **No Sync Launch Network**: Move all launch calls to background threads

## References

- [Lifecycle & Background Tasks](references/implementation.md)

---

### ios-architecture

---
name: ios-architecture
description: Apply MVVM, Coordinators, and Clean Architecture (VIP/VIPER) in iOS apps. Use when applying MVVM, Coordinators, or VIP/VIPER architecture in iOS apps.
metadata:
  triggers:
    files:
    - '**/*ViewModel.swift'
    - '**/*Coordinator.swift'
    - '**/*ViewController.swift'
    keywords:
    - MVVM
    - Coordinator
    - ViewState
    - Output
    - Input
---
# iOS Architecture Standards

## **Priority: P0 (CRITICAL)**

## Implementation Guidelines

### MVVM (Model-View-ViewModel)

- **ViewModel Responsibility**: Handle business logic, formatting, and state. No UIKit imports (except for platform types like `UIImage` if strictly necessary).
- **ViewState**: Use single state object or discrete `@Published` properties for UI updates. **Expose state as `private(set)` or using publishers**.
- **Inputs/Outputs**: Define explicit protocols or nested types for inputs (events from View) and outputs (state for View).

### Coordinator Pattern

- **Navigation Logic**: Decouple ViewControllers from navigation logic. **Coordinator handles instantiation and push/present**. ** NOT use `navigationController` directly in ViewController for screen transitions.**
- **Dependency Injection**: **Pass dependencies** (Services, Repositories) through **Coordinator into ViewModels**.
- **Child Coordinators**: Maintain hierarchy; **correctly remove child coordinators** from parent's collection when their flow finished.

### Clean Architecture (VIP/VIPER)

- **VIP (Clean Swift)**: Use Interactor for logic, Presenter for UI formatting, and ViewController for display.
- **Unidirectional Flow**: Data flows: **View -> Interactor -> Presenter -> View**.
- **VIPER**: (View, Interactor, Presenter, Entity, Router) — another common architectural pattern for iOS apps.

## Anti-Patterns

- **No Logic in VC**: Move business logic to ViewModel/Interactor.
- **No Public ViewModel State**: Keep state **private(set)** or using publishers.
- **No Direct Navigation**: Use Coordinator for screen transitions. Never use `navigationController` directly.

## Verification Checklist (Mandatory)

- [ ] **Pure ViewModel**: ViewModel any `UIKit` imports? (Prohibited)
- [ ] **Navigation**: `navigationController` used directly in VC for transitions? (Use Coordinator)
- [ ] **State Access**: ViewModel state exposed as `public var`? (Use `private(set)` or publishers)
- [ ] **Deallocation**: child coordinators correctly removed from parent's collection on finish?
- [ ] **VIP Unidirection**: data flow unidirectional (View -> Interactor -> Presenter -> View)?

## References

- [MVVM-C & VIP Implementation](references/implementation.md)

---

### ios-dependency-injection

---
name: ios-dependency-injection
description: Configure protocol-based DI with property wrappers and Factory/Swinject. Use when setting up dependency injection or factory patterns in iOS.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - "@Injected"
    - Resolver
    - Container
    - Swinject
    - register
    - resolve
---
# iOS Dependency Injection

## **Priority: P0**

## Implementation Workflow

1. **Prefer initializer injection** — Pass dependencies through `init` as primary approach.
2. **Inject protocols** — Always depend on protocols instead of concrete classes for testability.
3. **Choose DI library** — Use `Factory` for lightweight DI, `Swinject` for enterprise-grade container-based projects.
4. **Apply correct scoping** — Singleton for app-wide services (Auth, Network); Unique/Transient for ViewModels; Graph/Cached for feature flows.

See [protocol-based DI and Factory registration examples](references/implementation.md)

## Anti-Patterns

- **No Global Singletons**: Inject services via initializer
- **No Inline Service Resolution**: Pass dependencies via constructor; avoid `Resolver.resolve()` in business logic
- **No Concrete Class Dependencies**: Depend on protocols for testability

## References

- [Manual & Library DI Setup](references/implementation.md)

---

### ios-deployment

---
name: ios-deployment
description: Automate provisioning, signing, and deployment with Fastlane. Use when provisioning iOS apps, managing code signing, or automating deployments with Fastlane.
metadata:
  triggers:
    keywords:
    - Fastfile
    - Appfile
    - Matchfile
    - ios_bundle_id
    - provisioning_profile
    - testflight
---
# iOS Deployment

## **Priority: P1**

## Implementation Workflow

1. **Set up Match** — Use `fastlane match` for centralized certificate and profile management. Avoid manual signing.
2. **Configure build settings** — Set `PROVISIONING_PROFILE_SPECIFIER` explicitly if using manual/CI signing.
3. **Script Fastlane lanes** — Create `beta` (TestFlight) and `release` (App Store) lanes in your Fastfile.
4. **Automate versioning** — Use `increment_build_number` to auto-bump build numbers.
5. **Automate TestFlight uploads** — Trigger on every successful merge to staging.
6. **Set export compliance** — Automate in `Info.plist` or Fastlane to avoid metadata pauses.

See [Fastlane and Match setup examples](references/implementation.md)

## Anti-Patterns

- **No Manual CI Signing**: Use Match for automated certificate management
- **No Certificates in Repo**: Use private git repo for Match certificates
- **No Manual Versioning**: Use Fastlane `increment_build_number` for build numbers

## References

- [Fastlane & Signing Setup](references/implementation.md)

---

### ios-design-system

---
name: ios-design-system
description: Enforce design token usage in SwiftUI apps using iOS Human Interface Guidelines. Use when implementing design tokens, colors, or typography in SwiftUI.
metadata:
  triggers:
    files:
    - '**/*View.swift'
    - '**/Theme/**'
    - '**/DesignSystem/**'
    keywords:
    - Color
    - Font
    - SwiftUI
    - ViewModifier
    - Theme
---
# iOS Design System (SwiftUI)

## **Priority: P2 (OPTIONAL)**

Enforce design token usage in SwiftUI. Follow Apple HIG for iOS-native feel.

## Token Structure

Define tokens in `Theme/` folder: Colors via Asset Catalog (`Color("Name")`), `Spacing` enum for all margins, `Font` extensions for typography. See [Token Structure & Examples](references/example.md).

## Anti-Patterns

- **No Hex Colors**: Define in asset catalog, use `Color("Name")`.
- **No Magic Spacing**: Use `Spacing.md` not `spacing: 16`.
- **No System Colors for Brand**: Use `.appPrimary` not `Color.blue`.

## References

- [Token Structure & Usage Examples](references/example.md)

---

### ios-localization

---
name: ios-localization
description: Implement String Catalogs, L10n workflows, and asset management for iOS. Use when adding multi-language support using iOS String Catalogs or L10n workflows.
metadata:
  triggers:
    files:
    - '**/*.stringcatalog'
    - '**/*.xcassets'
    - '**/*.strings'
    keywords:
    - LocalizedStringResource
    - NSLocalizedString
    - String(localized:)
---
# iOS Localization & Assets

## **Priority: P1**

## Implementation Workflow

1. **Use String Catalogs** — Adopt `.stringcatalog` files in Xcode 15+ for visual editing and compile-time missing translation checks.
2. **Prefer modern APIs** — Use `String(localized: "key")` or `LocalizedStringResource` instead of `NSLocalizedString`.
3. **Handle pluralization** — Use String Catalogs' built-in pluralization instead of custom code logic.
4. **Format with locale** — Use `Formatted` API for dates, numbers, and currencies to respect user locale.
5. **Organize assets** — Use `.xcassets` with "Provides Namespace" enabled. Prefer SF Symbols for standard icons.
6. **Complete Base localization** — Ensure `Base` complete before adding other languages.

See [localization and asset catalog examples](references/implementation.md)

## Anti-Patterns

- **No Manual Currency Formatting**: Use `NumberFormatter` or `.formatted(.currency)`
- **No Loose Asset Files**: Always use Asset Catalogs (`.xcassets`)
- **No Placeholder Strings**: Ensure 100% translation coverage before commit

## References

- [L10n & Asset Organization](references/implementation.md)

---

### ios-navigation

---
name: ios-navigation
description: SwiftUI navigation and deep linking using NavigationStack and Universal Links. Use when implementing NavigationStack or Universal Links deep linking in iOS.
metadata:
  triggers:
    files:
    - '**/*View.swift'
    - '**/*App.swift'
    keywords:
    - NavigationStack
    - NavigationLink
    - onOpenURL
    - universalLink
    - NSUserActivity
---
# iOS Navigation (SwiftUI)

## **Priority: P2 (OPTIONAL)**


## Guidelines

- **Stack**: Use `NavigationStack` (iOS 16+) with `NavigationPath` for programmatic control.
- **Deep Links**: Handle `onOpenURL` at Root View (`WindowGroup`).
- **Universal Links**: Configure Associated Domains (`applinks`) in Entitlements.
- **Tabs**: Maintain separate `NavigationStack` instances per `TabItem`.

See [NavigationStack and deep linking examples](references/swiftui-navigation.md)

## Anti-Patterns

- **No Force Unwrapping**: Use `guard let` when parsing URL components.
- **No Broken Back Stack**: Ensure valid path state before appending destinations.
- **No Missing Validation**: Check content availability before deep-link navigation.

## References

- [Navigation Patterns](references/swiftui-navigation.md)

---

### ios-networking

---
name: ios-networking
description: Build API clients with URLSession, Alamofire, and Codable. Use when implementing URLSession networking, Alamofire, or API clients in iOS.
metadata:
  triggers:
    files:
    - '**/*Service.swift'
    - '**/*API.swift'
    - '**/*Client.swift'
    keywords:
    - URLSession
    - Alamofire
    - Moya
    - URLRequest
    - URLComponents
    - Codable
---
# iOS Networking

## **Priority: P0**

## Implementation Workflow

1. **Choose networking layer** — Use native `URLSession` with async/await for simple apps; `Alamofire` for production APIs with interceptors.
2. **Build URLs safely** — Use `URLComponents` and `URLQueryItem`; never use string interpolation for URL parameters.
3. **Decode with Codable** — Use `Codable` for all JSON mapping. Prefer `snake_case` key decoding strategies.
4. **Add auth interceptor** — Use `RequestInterceptor` to inject `Authorization: Bearer <token>` on all requests.
5. **Handle token refresh** — On 401, use `RequestInterceptor.onRetry` to call `refreshToken()` and retry.
6. **Pin certificates** — Use `ServerTrustManager` or `TrustKit` for production-grade security.

See [URLSession and Alamofire implementation examples](references/implementation.md)

## Anti-Patterns

- **No Background UI Updates**: Always dispatch to `@MainActor` or main queue
- **No Manual `JSONSerialization`**: Use `Codable` and `JSONDecoder`
- **No Missing Timeouts**: Set reasonable `timeoutInterval` (30s default)

## References

- [Native & Alamofire Implementation](references/implementation.md)

---

### ios-notifications

---
name: ios-notifications
description: Push notifications for iOS using UserNotifications framework and APNS. Use when integrating APNS push notifications in iOS applications.
metadata:
  triggers:
    files:
    - '**/*Notification*.swift'
    - '**/*AppDelegate.swift'
    keywords:
    - UNUserNotificationCenter
    - APNS
    - UNNotificationRequest
    - deviceToken
---
# iOS Notifications

## **Priority: P2 (OPTIONAL)**


## Guidelines

- **Framework**: Use `UserNotifications` for all notification handling.
- **Delegate**: Implement `UNUserNotificationCenterDelegate` for foreground & tap handling.
- **Permissions**: Request `.alert`, `.badge`, `.sound` after priming user.
- **APNs**: Register for remote notifications in `AppDelegate`.
- **Badges**: Manage app icon badges manually (set to 0 to clear).

See [APNs registration and permission examples](references/implementation.md)

## Anti-Patterns

- **No Unconditional Requests**: Explain value proposition before system dialog.
- **No Missing Delegate**: Notifications won't trigger foreground callbacks without it.
- **No Forgotten Badge Clear**: User frustration increases if badges persist.

## References

- [Implementation Details](references/implementation.md)

---

### ios-performance

---
name: ios-performance
description: Profile and optimize iOS apps with Instruments, memory management, and rendering techniques. Use when profiling iOS apps with Instruments or optimizing memory and rendering.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - Instruments
    - Allocations
    - Leaks
    - dequeueReusableCell
    - ios performance
    - swift performance
    - optimize ios
    - time profiler
    - frame drops
    - main thread
    - slow scroll
---
# iOS Performance

## **Priority: P0**

## Implementation Workflow

1. **Profile with Instruments** — Regularly use Allocations and Leaks to detect memory issues. Use Time Profiler for CPU stalls.
2. **Reuse cells** — Always use `dequeueReusableCell` and keep `cellForRowAt` lightweight.
3. **Cache images** — Use `SDWebImage` or `Kingfisher` for remote assets. `AsyncImage` lacks caching for lists.
4. **Offload to background** — Move parsing, encryption, and heavy computation off Main thread using GCD or Tasks.
5. **Enable strict warnings** — Set `SWIFT_TREAT_WARNINGS_AS_ERRORS` in Release builds.
6. **Run static analysis** — Use Xcode's "Analyze" (Product > Analyze) to catch logic errors.

See [background processing and cell reuse examples](references/implementation.md)

## Anti-Patterns

- **No Main-thread Processing**: Offload parsing/processing to background using `Task.detached` or GCD
- **No Manual Cache Clears**: Let system handle low-memory via `applicationDidReceiveMemoryWarning`
- **No Retain Cycles**: Use Leaks instrument frequently during development

## References

- [Profiling & Optimization](references/implementation.md)

---

### ios-persistence

---
name: ios-persistence
description: Implement local persistence with SwiftData, Core Data, and Keychain. Use when setting up SwiftData models, Core Data stacks, or local persistence in iOS.
metadata:
  triggers:
    files:
    - '**/*.xcdatamodeld'
    - '**/*Model.swift'
    keywords:
    - PersistentContainer
    - FetchRequest
    - ManagedObject
    - Query
    - ModelContainer
    - Repository
---
# iOS Persistence

## **Priority: P0**

## Implementation Workflow

1. **Choose storage tier** — SwiftData for iOS 17+, Core Data for legacy, Keychain for secrets, UserDefaults for flags only.
2. **Define models** — Use `@Model` macro (SwiftData) or `.xcdatamodeld` (Core Data).
3. **Configure container** — Use `@MainActor` for `ModelContainer` (SwiftData) or `NSPersistentContainer` (Core Data).
4. **Perform background writes** — Use `newBackgroundContext()` (Core Data) to avoid UI lag; never heavy I/O on `viewContext`.
5. **Secure sensitive data** — Use Keychain for tokens and PII; never store in `UserDefaults`.

See [SwiftData and Core Data implementation examples](references/implementation.md)

## Anti-Patterns

- **No Heavy I/O on `viewContext`**: Use private background contexts
- **No String-based Predicates**: Use KeyPaths or generated helpers
- **No Missing Merge Strategy**: Set `mergePolicy` explicitly (e.g., `mergeByPropertyObjectTrump`)

## References

- [SwiftData & Core Data Implementation](references/implementation.md)

---

### ios-security

---
name: ios-security
description: Secure iOS apps with Keychain, biometrics, and data protection. Use when implementing Keychain storage, Face ID/Touch ID, or data protection in iOS.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - SecItemAdd
    - kSecClassGenericPassword
    - LAContext
    - LocalAuthentication
    - ios security
    - swift security
    - keychain
    - biometric
    - face id
    - touch id
    - certificate pinning
    - app transport security
---
# iOS Security

## **Priority: P0 (CRITICAL)**

## Implementation Workflow

1. **Store secrets in Keychain** — Use `SecItemAdd`, `SecItemUpdate`, and `SecItemDelete` with `kSecClassGenericPassword` for tokens/PII. Never use `UserDefaults`.
2. **Add biometric auth** — Use `LocalAuthentication` with `LAContext`. Verify availability with `canEvaluatePolicy` before prompting.
3. **Encrypt files** — Use `Data.WritingOptions.completeFileProtection` when saving to disk.
4. **Keep ATS enabled** — Never disable App Transport Security globally in `Info.plist`.
5. **Pin certificates** — Use `ServerTrustManager` or `TrustKit` for production apps to prevent MITM attacks.
6. **Strip sensitive logs** — Ensure PII and tokens removed from logs in Release builds.

See [Keychain and biometrics implementation examples](references/implementation.md)

## Anti-Patterns

- **No Secrets in `UserDefaults`**: Always use Keychain for tokens and PII
- **No Unhandled `LAError`**: Check for `userCancel` and `authenticationFailed` in biometric flows
- **No PII/Token Logging**: Strip sensitive data from all logs in Release builds

## References

- [Keychain & Biometrics Implementation](references/implementation.md)

## Related Topics

- common/security-standards
- architecture

---

### ios-state-management

---
name: ios-state-management
description: Implement reactive state with Combine, Observation framework, and UDF patterns. Use when implementing state management with Combine, @Observable, or reactive patterns in iOS.
metadata:
  triggers:
    files:
    - '**/*.swift'
    keywords:
    - Observable
    - "@Published"
    - PassthroughSubject
    - "@Observable"
    - "@Namespace"
---
# iOS State Management

## **Priority: P0**

## Implementation Workflow

1. **Choose observation approach** — Use `@Observable` (iOS 17+) for modern SwiftUI; `Combine` with `@Published` for UIKit or broader compatibility.
2. **Expose state clearly** — Use UDF pattern: ViewModel exposes `Input` enum (events) and `Output` struct (state).
3. **Manage subscriptions** — Store Combine subscriptions in `Set<AnyCancellable>` with `.store(in: &cancellables)`.
4. **Dispatch to main thread** — Use `@MainActor` or `.receive(on: DispatchQueue.main)` for UI updates.
5. **Use exhaustive ViewState** — Prefer single `ViewState` enum (`.loading`, `.success(data)`, `.error(failure)`).

See [Combine and Observation framework examples](references/implementation.md)

## Anti-Patterns

- **No Uncleared Subscriptions**: Always use `.store(in: &cancellables)`
- **No Background UI Updates**: Use `.receive(on: .main)` or `@MainActor`
- **No Manual `objectWillChange.send()`**: Use `@Published` or `@Observable` instead

## References

- [Combine & Observation Setup](references/implementation.md)

---

### ios-swiftui

---
name: ios-swiftui
description: Build declarative UI and manage data flow with SwiftUI in iOS. Use when building declarative SwiftUI views or managing data flow with property wrappers.
metadata:
  triggers:
    files:
    - '**/*View.swift'
    keywords:
    - View
    - State
    - Binding
    - EnvironmentObject
---
# SwiftUI Expert

## **Priority: P0 (CRITICAL)**

**Role**: iOS UI Expert. Prioritize smooth 60fps, clean data flow.

## Implementation Guidelines

- **Views**: Small, composable structs. Extract subviews often to keep `body` clean.
- **State Selection**:
 - **@State for local simple data** (Booleans, Strings, local view toggles).
 - **@StateObject for VMs** (initialized only once in parent view).
 - **@ObservedObject for passed-in VMs** (initialized by parent).
- **Modifiers**: Order matters sequentially. Apply layout modifiers before visual ones (e.g., `.padding().background()`).
- **Preview**: Always provide `PreviewProvider` or `#Preview` for every view.

## Verification Checklist (Mandatory)

- [ ] **Body Property**: **body property computationally cheap**? (No complex logic or calculations).
- [ ] **State Flow**: `@StateObject` initialized only once (in parent)?
- [ ] **Identity**: Lists/ForEach stable `id`?
- [ ] **Main Actor**: UI updates strictly on **Main Actor**?

## Anti-Patterns

- **No Logic in Body**: Move calculations to **ViewModel or computed vars**. Keep `body` for UI composition only.
- **No ObservedObject Init**: **NOT** init `@ObservedObject` inside View settings — this causes leaks and performance issues.
- **No Hardcoded Sizes**: Use flexible frames and spacers for responsive UI.

## References

---

### ios-ui-navigation

---
name: ios-ui-navigation
description: Implement UIKit navigation, Auto Layout, and Apple Human Interface Guidelines in iOS. Use when implementing UIKit navigation, Auto Layout constraints, or HIG compliance.
metadata:
  triggers:
    files:
    - '**/*View.swift'
    - '**/*.xib'
    - '**/*.storyboard'
    keywords:
    - NSLayoutConstraint
    - UIStackView
    - SnapKit
    - layoutSubviews
---
# iOS UI & Layout Standards

## **Priority: P0**

## Implementation Guidelines

### Auto Layout

- **Code-Based Layout**: Prefer programmatic layout using `NSLayoutAnchor` or SnapKit over Storyboards for better source control.
- **Safe Area**: Always respect `view.safeAreaLayoutGuide`.
- **UIStackView**: Use for linear layouts to reduce constraint complexity.

### UIKit Best Practices

- **View Lifecycle**: Perform layout adjustments in `viewWillLayoutSubviews` or `updateConstraints`.
- **Reusable Views**: Extract complex UI into custom `UIView` subclasses.
- **Image Optimization**: Use SF Symbols for icons. Preferred vector (PDF/SVG) for custom assets.
- **SwiftUI Bridge**: Use `UIViewRepresentable` or `UIViewControllerRepresentable` to host UIKit in SwiftUI.

### Human Interface Guidelines (HIG)

- **Accessibility**: Support Dynamic Type and provide meaningful `accessibilityLabel`.
- **Feedback**: Use `UINotificationFeedbackGenerator` for haptic feedback on actions.
- **Margins**: Follow standard system margins (typically 16-20pt).

## Anti-Patterns

- **No CGRect(x:y:w:h)**: Use Auto Layout.
- **No complex constraint logic in VC**: Use UIStackView or custom views.
- **No Blank Screens**: Use skeleton views or UIActivityIndicatorView.

## References

- [Auto Layout & HIG Compliance](references/implementation.md)

---

