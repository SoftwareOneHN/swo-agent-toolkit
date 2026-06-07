---
inclusion: manual
---

# References: flutter

> 48 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-flutter.md`.

## flutter-auto-route-navigation

### REFERENCE

# AutoRoute Routing Reference

Detailed examples for implementing a scalable, type-safe routing system in Flutter.

## References

- [**AppRouter Configuration**](router-config.md) - Standard setup with `@AutoRouterConfig`.
- [**Auth Guards**](guards.md) - Protecting routes based on authentication state.
- [**Nested Routes & Tabs**](nested-routes.md) - Implementation for bottom navigation bars or sub-flows.

## **Quick Navigation Command**

```dart
// Navigating to a page with parameters
context.pushRoute(ProfileRoute(userId: '123'));

// Popping and returning a value
context.maybePop(true);
```


---

### implementation

# AutoRoute Implementation Examples

## Nested Routes & Tabs

```dart
// Navigate to a tab with a specific child route active
context.navigateTo(
  OrdersTabRoute(children: [ViewByOrdersPageRoute()]),
);
```

## Router Configuration

```dart
@AutoRouterConfig()
class AppRouter extends _$AppRouter {
  @override
  List<AutoRoute> get routes => [
    AutoRoute(page: HomeRoute.page, initial: true),
    AutoRoute(page: OrderDetailRoute.page, guards: [AuthGuard()]),
  ];
}
```


---

### router-config

# AppRouter Configuration

Standard setup for `auto_route` to ensure code generation and type-safety.

## **Router File (`app_router.dart`)**

```dart
import 'package:auto_route/auto_route.dart';
import 'app_router.gr.dart'; // Inherited generated classes

@AutoRouterConfig(replaceInRouteName: 'Page|Screen,Route')
class AppRouter extends _$AppRouter {
  @override
  List<AutoRoute> get routes => [
    // 1. Initial Route
    AutoRoute(page: SplashRoute.page, initial: true),
    
    // 2. Protected Routes (with Guards)
    AutoRoute(
      page: DashboardRoute.page, 
      guards: [AuthGuard()],
    ),
    
    // 3. Nested Routes (Tabs)
    AutoRoute(
      page: HomeTabsRoute.page,
      children: [
        AutoRoute(page: PostsRoute.page),
        AutoRoute(page: SettingsRoute.page),
      ],
    ),
  ];
}
```

## **Dynamic Tab Initialization**

If you need to navigate to a tabbed route and set a specific initial tab based on logic:

```dart
context.navigateTo(
  OrdersTabRoute(
    children: params.tab == OrderTab.orders()
        ? [const ViewByOrdersPageRoute()]
        : [const ViewByItemsPageRoute()],
  ),
);
```

## **Typed Parameters**

When you define a Screen with a constructor, `auto_route` generates matching parameters:

```dart
@RoutePage()
class UserProfilePage extends StatelessWidget {
  final String userId;
  const UserProfilePage({required this.userId});
  
  // Navigation: context.pushRoute(UserProfileRoute(userId: '123'));
}
```


---

## flutter-bloc-state-management

### bloc_templates

# BLoC Templates

## Freezed Implementation (Recommended)

### State with Union (`feature_state.dart`)

```dart
part of 'feature_bloc.dart';

@freezed
abstract class FeatureState with _$FeatureState {
  const factory FeatureState.initial() = _Initial;
  const factory FeatureState.loading() = _Loading;
  const factory FeatureState.success(List<Data> data) = _Success;
  const factory FeatureState.failure(Failure failure) = _Failure;
}
```

### State with Flat State (`feature_state.dart`)

```dart
part of 'feature_bloc.dart';

@freezed
abstract class FeatureState with _$FeatureState {
  const factory FeatureState({
    required List<Data> data,
    required Failure failure,
    required bool isLoading,
  }) = _FeatureState_;

}
```

### Event (`feature_event.dart`)

```dart
part of 'feature_bloc.dart';

@freezed
abstract class FeatureEvent with _$FeatureEvent {
  const factory FeatureEvent.started() = _Started;
  const factory FeatureEvent.refreshRequested() = _RefreshRequested;
}
```

### BLoC (`feature_bloc.dart`)

```dart
@injectable
class FeatureBloc extends Bloc<FeatureEvent, FeatureState> {
  final FeatureRepository _repository;

  FeatureBloc(this._repository) : super(const FeatureState.initial()) {
    on<_Started>(_onStarted);
  }

  Future<void> _onStarted(_Started event, Emitter<FeatureState> emit) async {
    emit(const FeatureState.loading());
    final result = await _repository.getData();
    result.fold(
      (failure) => emit(FeatureState.failure(failure)),
      (data) => emit(FeatureState.success(data)),
    );
  }
}
```

## Equatable Implementation (Alternative)

### State

```dart
sealed class FeatureState extends Equatable {
  const FeatureState();
  @override
  List<Object?> get props => [];
}

final class FeatureInitial extends FeatureState {}
final class FeatureLoading extends FeatureState {}

final class FeatureSuccess extends FeatureState {
  final List<Data> data;
  const FeatureSuccess(this.data);
  @override
  List<Object?> get props => [data];
}
```


---

## flutter-cicd

### advanced-workflow

# Advanced Large-Scale CI/CD

For large projects, a linear workflow is too slow. Use parallel jobs and aggressive caching.

## Optimized Workflow (`main.yml`)

Split your pipeline into parallel stages to fail fast.

```yaml
name: Production CI

on: [push, pull_request]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # 1. SETUP: Install & Cache Dependencies
  # This job prepares the environment so others can just reuse the cache.
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true
      - name: Install Dependencies
        run: flutter pub get

  # 2. QUALITY: Static Analysis & Formatting (Runs parallel to Test)
  quality:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - name: Verify Formatting
        run: dart format --output=none --set-exit-if-changed .
      - name: Static Analysis
        run: flutter analyze --fatal-infos

  # 3. TEST: Unit & Widget Tests
  test:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - name: Run Tests
        # Usage of concurrency to speed up execution
        run: flutter test --coverage --concurrency=4
      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

## Key Optimizations

1. **Concurrency Group**: `cancel-in-progress: true` stops old runs when new code is pushed to the same PR, saving minutes.
2. **Parallel Jobs**: `quality` and `test` trigger at the same time. If formatting fails, you don't wait for tests to finish.
3. **Fatal Infos**: Enforce higher quality by treating info-level logic hints as failures.


---

### fastlane

# Advanced Fastlane Standards

Automates signing, build versioning, flavors, and multi-channel distribution (Firebase vs. Stores).

## Prerequisites

1. **Versioning**: Use `flutter_version` or `cider` to sync Fastlane with `pubspec.yaml`.
2. **Firebase**: Install plugin: `bundle exec fastlane add_plugin firebase_app_distribution`.
3. **Flavors**: Ensure your Flutter app is set up with Flavors (e.g., `dev`, `prod` schemes).

## Android Configuration (`android/fastlane/Fastfile`)

Supported lanes:

- `staging`: Builds `dev` flavor -> Firebase App Distribution.
- `prod`: Builds `prod` flavor -> Play Store (Internal Track).

```ruby
default_platform(:android)

platform :android do
  # Helper: Read version from pubspec
  def load_version
    # Requires: gem install yaml
    require 'yaml'
    pubspec = YAML.load_file("../../pubspec.yaml")
    return pubspec['version'].split('+') # Returns [version, build]
  end

  desc "Deploy Staging to Firebase"
  lane :staging do
    version_name, version_code = load_version

    # 1. Build APK (Flavor: Dev, Type: Release)
    gradle(
      task: "assemble",
      flavor: "Dev",
      build_type: "Release",
      properties: {
        "android.injected.version.code" => version_code,
        "android.injected.version.name" => version_name
      }
    )

    # 2. Upload to Firebase
    firebase_app_distribution(
      app: ENV["FIREBASE_APP_ID_ANDROID_DEV"],
      groups: "qa-team",
      release_notes: "Staging Build v#{version_name} (#{version_code})"
    )
  end

  desc "Deploy Production to Play Store"
  lane :prod do
    version_name, version_code = load_version

    # 1. Build Bundle (Flavor: Prod)
    gradle(
      task: "bundle",
      flavor: "Prod",
      build_type: "Release",
      properties: {
        "android.injected.version.code" => version_code,
        "android.injected.version.name" => version_name
      }
    )

    # 2. Upload to Play Store
    upload_to_play_store(
      track: "internal",
      json_key: ENV["PLAY_STORE_JSON_KEY_FILE"],
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end
end
```

## iOS Configuration (`ios/fastlane/Fastfile`)

Supported lanes:

- `staging`: Builds `Dev` Scheme -> Firebase (AdHoc).
- `prod`: Builds `Prod` Scheme -> TestFlight (AppStore).

**Note**: Creates separate `Matchfile` logic for AdHoc vs AppStore.

```ruby
default_platform(:ios)

platform :ios do
  before_all do
    setup_ci if ENV['CI']
  end

  desc "Deploy Staging to Firebase (AdHoc)"
  lane :staging do
    # 1. Sync Signing (AdHoc for restricted devices)
    match(type: "adhoc", app_identifier: "com.example.app.dev", readonly: is_ci)

    # 2. Build IPA (Scheme: Dev)
    build_app(
      scheme: "Dev",
      export_method: "ad-hoc",
      include_bitcode: false
    )

    # 3. Upload to Firebase
    firebase_app_distribution(
      app: ENV["FIREBASE_APP_ID_IOS_DEV"],
      groups: "qa-team"
    )
  end

  desc "Deploy Production to TestFlight"
  lane :prod do
    # 1. Sync Signing (AppStore)
    match(type: "appstore", app_identifier: "com.example.app", readonly: is_ci)

    # 2. Build IPA (Scheme: Prod)
    build_app(
      scheme: "Prod",
      export_method: "app-store"
    )

    # 3. Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end
end
```

## Setup Checklist

1. **Google Play Key**: Define `PLAY_STORE_JSON_KEY_FILE`.
2. **Match Repo**: Ensure `git_url` in `Matchfile` points to your private cert repo.
3. **Firebase CLI**: Ensure firebase-tools is installed or the plugin authenticated via `FIREBASE_TOKEN`.


---

### github-actions

# GitHub Actions Workflow

This workflow builds the application, runs tests, and analyzes code.

## `flutter-ci.yml`

```yaml
name: Flutter CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build & Test
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true

      - name: Install dependencies
        run: flutter pub get

      - name: Format check
        run: dart format --output=none --set-exit-if-changed .

      - name: Analyze
        run: flutter analyze

      - name: Run tests
        run: flutter test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: coverage/lcov.info
          token: ${{ secrets.CODECOV_TOKEN }}
```

## Fastlane (Optional)

For automated store deployment, consider integrating `fastlane` into a separate `deploy` job that runs only on `push` to `main`.


---

## flutter-concurrency

### isolate-examples

# Isolate Examples

## One-off heavy computation (Isolate.run)

```dart
import 'dart:convert';
import 'dart:isolate';

// Top-level function — required for Isolate.run
List<dynamic> _decodeJson(String jsonString) {
  return jsonDecode(jsonString) as List<dynamic>;
}

// Usage in ViewModel/Repository
Future<List<dynamic>> processLargeJson(String rawJson) async {
  // Spawns isolate, runs computation, returns result, exits automatically
  return await Isolate.run(() => _decodeJson(rawJson));
}
```

## Long-lived worker isolate

```dart
import 'dart:isolate';

class ImageProcessor {
  late SendPort _workerSendPort;
  final ReceivePort _mainPort = ReceivePort();
  Isolate? _isolate;

  Future<void> initialize() async {
    _isolate = await Isolate.spawn(_workerEntry, _mainPort.sendPort);

    _mainPort.listen((message) {
      if (message is SendPort) {
        _workerSendPort = message;
      } else {
        // Handle processed results
        print('Processed: $message');
      }
    });
  }

  void processImage(String path) {
    _workerSendPort.send(path);
  }

  static void _workerEntry(SendPort mainSendPort) {
    final workerPort = ReceivePort();
    mainSendPort.send(workerPort.sendPort);

    workerPort.listen((message) {
      // Simulate heavy image processing
      final result = 'Processed image: $message';
      mainSendPort.send(result);
    });
  }

  void dispose() {
    _mainPort.close();
    _isolate?.kill();
  }
}
```

## RIGHT / WRONG: FutureBuilder caching

```dart
// RIGHT — cache the future to prevent re-firing on rebuild
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late final Future<String> _dataFuture;

  @override
  void initState() {
    super.initState();
    _dataFuture = fetchData(); // Created once
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: _dataFuture, // Same instance every rebuild
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator();
        }
        return Text(snapshot.data ?? 'No data');
      },
    );
  }
}
```

```dart
// WRONG — future re-created on every build
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: fetchData(), // <-- New future every rebuild!
      builder: (context, snapshot) {
        return Text(snapshot.data ?? 'Loading...');
      },
    );
  }
}
```


---

## flutter-dependency-injection

### REFERENCE

# Dependency Injection Reference

Implementation patterns for `injectable` and `get_it` in massive Flutter projects.

## References

- [**Injection Modules**](modules.md) - Registering third-party libraries (Dio, Hive).
- [**Production Initialization**](initialization.md) - Wiring everything in `main.dart`.
- [**Testing Mocks**](testing-mocks.md) - How to swap services during unit tests.

## **Quick Registration Guide**

- **@injectable**: Use for BLoCs (New instance every time).
- **@LazySingleton**: Use for Repositories and DataSources (Global, lazy-init).
- **@singleton**: Use only for truly shared resources (init on startup).


---

### implementation

# Dependency Injection Implementation Examples

## Registration Example

```dart
@module
abstract class NetworkModule {
  @lazySingleton
  Dio get dio => Dio(BaseOptions(baseUrl: 'https://api.example.com'));
}

@LazySingleton(as: IOrderRepository)
class OrderRepositoryImpl implements IOrderRepository {
  final Dio _dio;
  OrderRepositoryImpl(this._dio);
}
```

## Test Mock Swap

```dart
setUp(() {
  getIt.unregister<IOrderRepository>();
  getIt.registerLazySingleton<IOrderRepository>(() => MockOrderRepository());
});
```


---

### modules

# Third-party Dependency Modules

Since you cannot annotate third-party classes (like `Dio` or `SharedPreferences`) directly, use a `@module`.

## **Example: Network & Storage Module**

```dart
import 'package:injectable/injectable.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

@module
abstract class NetworkingModule {
  @lazySingleton
  Dio get dio => Dio(BaseOptions(baseUrl: 'https://api.example.com'));

  @preResolve // Waits for this before finishing injection setup
  Future<SharedPreferences> get prefs => SharedPreferences.getInstance();
}
```

## **Named Injection**

Use for multiple instances of the same type:

```dart
@module
abstract class ServiceModule {
  @Named("AuthDio")
  Dio get authDio => Dio();

  @Named("PublicDio")
  Dio get publicDio => Dio();
}

// Consumption: Repo(@Named("AuthDio") Dio dio)
```


---

## flutter-design-system

### dls-modular-pattern

# V DLS Modular Pattern (IDEAL Architecture)

**Based on:** `/Users/nguyenhuyhoang/FlutterProject/C3/flutter-temp/packages/v_dls`

This represents the **gold standard** for Flutter DLS architecture.

## Package Structure

```
packages/v_dls/
├── lib/
│   ├── v_dls.dart (main export)
│   └── src/
│       ├── foundation/
│       │   ├── colors.dart (148 tokens)
│       │   ├── spacing.dart (13 tokens)
│       │   ├── typography.dart (191 lines, 20+ styles)
│       │   ├── borders.dart (127 lines)
│       │   ├── shadows.dart
│       │   ├── animations.dart
│       │   └── breakpoints.dart
│       ├── components/
│       │   ├── buttons/v_button.dart (416 lines, ZERO hardcoded!)
│       │   ├── inputs/v_text_field.dart
│       │   ├── layout/v_card.dart
│       │   └── ... (34 components)
│       ├── theme/
│       │   └── v_theme_data.dart (400 lines)
│       └── utils/
│           └── accessibility.dart
└── test/ (unit tests for each foundation file)
```

## Foundation Tokens

### Colors (148 tokens) - `VColors`

```dart
// Material Design scale (50-900)
VColors.primary50 through primary900
VColors.secondary50 through secondary900

// Semantic colors
VColors.success, VColors.error, VColors.warning, VColors.info

// Neutrals
VColors.gray50 through gray900

// Surface & Background
VColors.background, VColors.surface, VColors.surfaceVariant

// Dark mode
VColors.darkBackground, VColors.darkSurface
```

### Spacing (13 levels) - `VSpacing`

```dart
VSpacing.none     // 0px
VSpacing.xxs      // 2px
VSpacing.xs       // 4px
VSpacing.sm       // 8px
VSpacing.smMd     // 12px
VSpacing.md       // 16px ← Base unit
VSpacing.mdLg     // 20px
VSpacing.lg       // 24px
VSpacing.xl       // 32px
VSpacing.xxl      // 40px
VSpacing.xxxl     // 48px
VSpacing.huge     // 64px
VSpacing.massive  // 128px
```

### Typography - `VTypography`

```dart
// Font families
VTypography.fontFamilyPrimary   // SF Pro Display
VTypography.fontFamilySecondary // SF Pro Text
VTypography.fontFamilyMono      // SF Mono

// Headings (6 levels)
VTypography.heading1 to heading6

// Body text (3 sizes)
VTypography.bodyLarge, bodyMedium, bodySmall

// Buttons (3 sizes)
VTypography.buttonLarge, buttonMedium, buttonSmall

// Labels (3 sizes)
VTypography.labelLarge, labelMedium, labelSmall

// Specialized
VTypography.caption, overline, code
```

### Borders - `VBorders`

```dart
// Radius
VBorders.radiusMd, radiusLg, radiusXl, radiusFull

// Widths
VBorders.widthThin, widthMedium, widthThick

// Shaped borders
VBorders.rectangleMd, rectangleLg, rectangleXl

// Input borders
VBorders.inputDefault, inputFocused, inputError, inputDisabled
```

## Perfect Component Example

From `components/buttons/v_button.dart` (416 lines, **ZERO hardcoded values**):

```dart
import 'package:v_dls/src/foundation/borders.dart';
import 'package:v_dls/src/foundation/spacing.dart';
import 'package:v_dls/src/foundation/typography.dart';

class VButton extends StatelessWidget {
  final VButtonVariant variant;
  final VButtonSize size;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        // ✅ Color from theme
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: theme.colorScheme.onPrimary,

        // ✅ Spacing from tokens
        padding: EdgeInsets.symmetric(
          horizontal: VSpacing.lg,    // 24px
          vertical: VSpacing.smMd,    // 12px
        ),

        // ✅ Border from tokens
        shape: VBorders.rectangleMd,  // 8px radius

        // ✅ Typography (In DLS Package: use tokens)
        textStyle: VTypography.buttonMedium,
      ),
      child: content,
    );
  }
}

// ⚠️ APP USAGE (Feature Code)
// Always prefer Theme.of(context) over VTypography constants for Dark/Light mode
final theme = Theme.of(context);
Text('Hello', style: theme.textTheme.bodyMedium)

// Usage
VButton.primary(
  onPressed: () {},
  child: Text('Click Me'),
)
```

## Key Principles

1. **Modular Separation**: Each foundation aspect in its own file
2. **Semantic Naming**: `primary500`, not `blue600`
3. **Scale Coverage**: Complete 50-900 scales for colors
4. **Component Encapsulation**: All DLS logic in components, not in app code
5. **Zero Hardcoding**: 416-line component with ZERO magic numbers

## When to Use This Pattern

- ✅ **Large teams**: Multiple developers need consistent design
- ✅ **Design system exists**: Have Figma/design tokens to implement
- ✅ **Scalability**: Planning for 50+ screens
- ✅ **Multi-app**: Sharing DLS across multiple apps

## Migration from Monolithic

If you have `app_theme.dart` + `app_colors.dart`:

1. Create `packages/your_dls/` structure
2. Move colors to `foundation/colors.dart`
3. Expand spacing from 3 → 13 tokens (follow VSpacing scale)
4. Extract typography to `foundation/typography.dart`
5. Create component wrappers (`YourButton` extends `ElevatedButton`)

This is the **ideal end-state** for Flutter DLS architecture.


---

### monolithic-pattern

# Monolithic Pattern (Growing DLS)

A pragmatic, monolithic approach suitable for growing projects.

## Structure

```
lib/presentation/theme/
├── app_theme.dart (482 lines)
└── app_colors.dart (218 lines)
```

## Characteristics

**Pros:**

- Simple to understand and navigate
- All tokens in 2 files
- Easy to get started

**Cons:**

- Limited spacing tokens (only 3)
- File size growing (700+ lines total)
- Typography mixed with theme config

## Token Examples

### Colors - `AppColors` (218 definitions)

```dart
// Primary palette
AppColors.primary       // #234455
AppColors.primary2      // #204D4C
AppColors.secondary     // #E5EBB1

// Functional colors
AppColors.error
AppColors.warning
AppColors.success

// Grays
AppColors.darkGray
AppColors.lightGray
AppColors.neutralsGrey

// Feature-specific (ad-hoc)
AppColors.comboOffersBg
AppColors.returnStatusBackgroudRed
```

### Spacing - `AppTheme` (only 3!)

```dart
AppTheme.kPadding6   // 6px
AppTheme.kPadding12  // 12px
AppTheme.kPadding24  // 24px
```

**Problem:** Only 3 spacing values forces developers to:

- Use multiples (e.g., `kPadding12 * 2` for 24px)
- Add hardcoded values when needed (defeating the purpose)

**Solution:** Expand to match VSpacing scale (xs, sm, md, lg, xl, etc.)

### Typography - Inline

```dart
// Mixed in AppTheme
AppTheme.kTextH1 = 20.0
AppTheme.kTextH2 = 18.0
AppTheme.kTextH3 = 16.0

// Used with Google Fonts
GoogleFonts.notoSans(fontSize: AppTheme.kTextH1, fontWeight: FontWeight.bold)
```

**Problem:** Typography not fully tokenized, requires manual style composition

## Usage Pattern

```dart
Container(
  color: AppColors.primary,
  padding: EdgeInsets.all(AppTheme.kPadding12),
  child: Text(
    'Title',
    // ✅ PREFERRED: Use theme context for adaptive support
    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
      fontWeight: FontWeight.bold,
    ),
  ),
)

// ❌ AVOID (Raw token compositing in UI):
// style: GoogleFonts.notoSans(fontSize: AppTheme.kTextH1, ...)
```

## When to Use This Pattern

- ✅ **Small/Medium teams**: 1-5 developers
- ✅ **MVP/Prototype**: Quick iteration needed
- ✅ **Simple apps**: <30 screens
- ✅ **Starting DLS**: Growing into full design system

## Evolution Path

1. **Expand spacing tokens** to 8-10 levels
2. **Extract typography** to dedicated class
3. **Add borders/shadows** as dedicated tokens
4. **Migrate to package** (V DLS style) when team grows

This pattern is **valid and pragmatic** for many projects, but should evolve as complexity grows.


---

### usage

# Flutter Design System Usage Patterns

## 0. Context Discovery

Before choosing a token, investigate the root configuration:

```dart
// Check main.dart
MaterialApp(
  theme: VThemeData.light().toThemeData(), // ← This tells you to use theme.textTheme
  ...
)
```

## 1. Mandatory Token Usage

### Colors

❌ **Forbidden**:

```dart
Color(0xFF2196F3)
Colors.blue
```

✅ **Enforced**:

```dart
VColors.primary      // Modular DLS
AppColors.primary    // Monolithic DLS
context.theme.primaryColor
```

### Spacing

❌ **Forbidden**:

```dart
SizedBox(height: 16)
EdgeInsets.all(24)
```

✅ **Enforced**:

```dart
SizedBox(height: VSpacing.md)
EdgeInsets.all(VSpacing.lg)
```

### Typography

❌ **Forbidden**:

```dart
TextStyle(fontSize: 20, fontWeight: FontWeight.bold)
```

✅ **Enforced (Preferred for UI)**:

```dart
// Always prefer theme from context for dynamic Dark/Light mode support
final theme = Theme.of(context);
Text('Title', style: theme.textTheme.headlineSmall)
Text('Body', style: theme.textTheme.bodyMedium)
```

⚠️ **Static Tokens (Internal/Theme Definition only)**:

```dart
// Use only if context is unavailable or defining the theme itself
import 'package:v_dls/v_dls.dart';
VTypography.heading6
```

### Borders

❌ **Forbidden**: `BorderRadius.circular(8)`
✅ **Enforced**: `VBorders.radiusMd`, `AppTheme.borderRadius`

## 2. Component Preference

❌ **Avoid**: `ElevatedButton(...)`
✅ **Preferred**: `VButton.primary(...)`

## 3. Detection Examples

**Modular DLS**:

```dart
import 'package:v_dls/v_dls.dart';
VColors.primary500
VSpacing.md
```

**Monolithic DLS**:

```dart
import 'package:myapp/theme/app_colors.dart';
AppColors.primary
```


---

## flutter-error-handling

### REFERENCE

# Error Handling Reference

Detailed patterns for functional error management in Flutter.

## References

- [**Error Mapping**](error-mapping.md) - Mapping Dio/Network exceptions to Failures.
- [**Consumption Patterns**](consumption.md) - Using `.fold()` in Clean Architecture.

## **Quick Syntax**

```dart
// Result handling in BLoC
final failureOrData = await repository.getData();
emit(failureOrData.fold(
  (failure) => State.error(failure),
  (data) => State.success(data),
));
```


---

### error-mapping

# Functional Failure Patterns

## **Global Failures (@freezed)**

```dart
@freezed
class ApiFailure with _$ApiFailure {
  const factory ApiFailure.serverError() = _ServerError;
  const factory ApiFailure.networkError() = _NetworkError;
  const factory ApiFailure.unauthenticated() = _Unauthenticated;
  const factory ApiFailure.badRequest(String message) = _BadRequest;
}
```

## **Infrastructure Mapper**

```dart
extension DioErrorX on DioException {
  ApiFailure toFailure() {
    switch (type) {
      case DioExceptionType.connectionTimeout:
        return const ApiFailure.networkError();
      case DioExceptionType.badResponse:
        if (response?.statusCode == 401) return const ApiFailure.unauthenticated();
        return const ApiFailure.serverError();
      default:
        return const ApiFailure.serverError();
    }
  }
}
```


---

### implementation

# Error Handling Implementation Examples

## Repository Error Mapping

```dart
@override
Future<Either<Failure, Order>> getOrder(String id) async {
  try {
    final dto = await _remoteDataSource.fetchOrder(id);
    return right(dto.toDomain());
  } on DioException catch (e) {
    return left(ServerFailure(message: e.message ?? 'Unknown error'));
  }
}
```

## BLoC Consumption

```dart
final result = await _getOrderUseCase(orderId);
result.fold(
  (failure) => emit(OrderError(failure.failureMessage)),
  (order) => emit(OrderLoaded(order)),
);
```


---

## flutter-feature-based-clean-architecture

### REFERENCE

# Feature-Based Architecture Reference

Detailed examples for organizing large-scale Flutter apps by business domain.

## References

- [**Standard Folder Structure**](folder-structure.md) - Deep dive into feature-level directory nesting.
- [**Shared vs Core**](shared-core.md) - When to put code in `lib/core` versus `lib/shared`.
- [**Modular Injection**](modular-injection.md) - How to register dependencies per feature.

## **Quick Implementation Rule**

- Never import from `lib/features/x/data/` or `lib/features/x/presentation/` from outside `feature/x`.
- Only `lib/features/x/domain/` is "public" to other features.


---

### folder-structure

# Feature Folder Structure

A complete blueprint for a single feature directory (e.g., `lib/features/authentication/`).

```text
lib/features/authentication/
├── domain/
│   ├── entities/
│   │   └── auth_user.dart
│   ├── repositories/
│   │   └── i_auth_repository.dart
│   └── use_cases/
│       └── login_use_case.dart
├── data/
│   ├── data_sources/
│   │   ├── auth_remote_data_source.dart
│   │   └── auth_local_data_source.dart
│   ├── dtos/
│   │   └── user_dto.dart
│   └── repositories/
│       └── auth_repository_impl.dart
└── presentation/
    ├── blocs/
    │   └── auth/
    ├── pages/
    │   ├── login_page.dart
    │   └── profile_page.dart
    └── widgets/
        └── auth_form.dart
```

## **Key Constraints**

1. **Barrel Files**: Use `authentication.dart` at the feature root to export ONLY the domain layer.
2. **Sub-directories**: Do not create more levels than shown above unless the feature has 20+ files.
3. **Mappers**: Should be kept in the `data/` layer, typically as extensions on DTOs.


---

### implementation

# Feature-Based Clean Architecture Implementation Examples

## Feature Directory Example

```text
lib/features/orders/
├── domain/
│   ├── entities/order.dart
│   ├── failures/order_failure.dart
│   └── repositories/i_order_repository.dart
├── data/
│   ├── models/order_dto.dart
│   ├── data_sources/order_remote_data_source.dart
│   └── repositories/order_repository_impl.dart
└── presentation/
    ├── bloc/order_bloc.dart
    └── pages/order_list_page.dart
```

## Cross-Feature Import Rule

```dart
// CORRECT: Import only domain types from another feature
import 'package:app/features/auth/domain/entities/user.dart';

// WRONG: Never import data or presentation from another feature
// import 'package:app/features/auth/data/models/user_dto.dart';
```


---

## flutter-getx-navigation

### app-pages

# Centralized Route Management

## Quick Example

```dart
static final routes = [
  GetPage(
    name: _Paths.HOME,
    page: () => HomeView(),
    binding: HomeBinding(),
    middlewares: [AuthMiddleware()],
  ),
];

// Usage in Controller
void logout() => Get.offAllNamed(Routes.LOGIN);
```

## Full Pattern

Organizing routes in a single location for scalability.

```dart
// app_routes.dart
abstract class Routes {
  static const HOME = _Paths.HOME;
  static const LOGIN = _Paths.LOGIN;
}

abstract class _Paths {
  static const HOME = '/home';
  static const LOGIN = '/login';
}

// app_pages.dart
class AppPages {
  static const INITIAL = Routes.LOGIN;

  static final routes = [
    GetPage(
      name: _Paths.HOME,
      page: () => HomeView(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: _Paths.LOGIN,
      page: () => LoginView(),
      binding: LoginBinding(),
    ),
  ];
}

// main.dart
GetMaterialApp(
  initialRoute: AppPages.INITIAL,
  getPages: AppPages.routes,
)
```


---

### middleware-example

# Route Middleware (Guards)

Use middleware to protect routes from unauthorized access or handle redirections.

```dart
class AuthMiddleware extends GetMiddleware {
  @override
  int? get priority => 1;

  @override
  RouteSettings? redirect(String? route) {
    bool isAuthenticated = AuthService.to.isLoggedInValue;

    if (isAuthenticated) {
      return null; // Continue to target route
    } else {
      // Redirect to login if user is not authenticated
      return const RouteSettings(name: Routes.LOGIN);
    }
  }
}

// Usage in AppPages
GetPage(
  name: Routes.PROFILE,
  page: () => ProfileView(),
  middlewares: [AuthMiddleware()],
)
```


---

## flutter-getx-state-management

### controller-example

# GetX Controller + View Pattern

```dart
class UserController extends GetxController {
  final name = "User".obs;
  void updateName(String val) => name.value = val;
}

class UserView extends GetView<UserController> {
  @override
  Widget build(ctx) => Scaffold(
    body: Obx(() => Text(controller.name.value)),
    floatingActionButton: FloatingActionButton(
      onPressed: () => controller.updateName("New"),
    ),
  );
}
```


---

## flutter-go-router-navigation

### typed-routes

# GoRouter Typed Routes + Redirect

```dart
// Route Definition
@TypedGoRoute<HomeRoute>(path: '/')
class HomeRoute extends GoRouteData {
  @override
  Widget build(context, state) => const HomePage();
}

// Router Config
final router = GoRouter(
  routes: $appRoutes,
  redirect: (context, state) {
    if (notAuthenticated) return '/login';
    return null;
  },
);
```


---

## flutter-layer-based-clean-architecture

### REFERENCE

# Reference: Layer-based Clean Architecture Examples

## **Full Layer Implementation**

### 1. Domain Layer (Entity)

```dart
@freezed
class Bank with _$Bank {
  const factory Bank({
    required String id,
    required String name,
    required String branchCode,
  }) = _Bank;

  factory Bank.fromJson(Map<String, dynamic> json) => _$BankFromJson(json);
}
```

### DTO-to-Entity Inline Example

```dart
// lib/infrastructure/dtos/user_dto.dart
class UserDto {
  final String id;
  final String name;

  factory UserDto.fromJson(Map<String, dynamic> json) =>
      UserDto(id: json['id'], name: json['name']);

  UserEntity toEntity() => UserEntity(id: id, name: name);
}
```

### 2. Infrastructure Layer (DTO & Mapper)

```dart
@freezed
class BankDto with _$BankDto {
  const factory BankDto({
    @JsonKey(name: 'bank_id') required String id,
    @JsonKey(name: 'bank_name') required String name,
    @JsonKey(name: 'code') required String branchCode,
  }) = _BankDto;

  factory BankDto.fromJson(Map<String, dynamic> json) => _$BankDtoFromJson(json);

  Bank toDomain() => Bank(
    id: id,
    name: name,
    branchCode: branchCode,
  );
}
```

### 3. Application Layer (BLoC)

```dart
class BankBloc extends Bloc<BankEvent, BankState> {
  final IBankRepository repository;

  BankBloc(this.repository) : super(const BankState.initial()) {
    on<_Fetch>(_onFetch);
  }

  Future<void> _onFetch(_Fetch event, Emitter<BankState> emit) async {
    emit(const BankState.loading());
    final failureOrBanks = await repository.fetchBanks();
    emit(failureOrBanks.fold(
      (f) => BankState.error(f.message),
      (banks) => BankState.loaded(banks),
    ));
  }
}
```


---

### repository-mapping

# Repositories & DTO Mapping Reference

## **Data Transfer Object (DTO)**

DTOs live in the **Infrastructure** layer and represent the raw JSON response.

```dart
@freezed
class BankDto with _$BankDto {
  const BankDto._();
  
  const factory BankDto({
    @JsonKey(name: 'bank_id') required String id,
    @JsonKey(name: 'bank_name') required String name,
    @JsonKey(name: 'code') required String branchCode,
  }) = _BankDto;

  factory BankDto.fromJson(Map<String, dynamic> json) => _$BankDtoFromJson(json);

  // Mapping to Domain Entity
  Bank toDomain() => Bank(
    id: id,
    name: name,
    branchCode: branchCode,
  );
}
```

## **Repository Implementation**

The implementation handles the actual data fetching (Remote/Local) and mapping.

```dart
class BankRepository implements IBankRepository {
  final BankRemoteDataSource remoteDataSource;

  BankRepository(this.remoteDataSource);

  @override
  Future<Either<ApiFailure, List<Bank>>> fetchBanks() async {
    try {
      final dtoList = await remoteDataSource.getBanks();
      // Perform the mapping here
      return right(dtoList.map((dto) => dto.toDomain()).toList());
    } catch (e) {
      return left(ApiFailure.fromException(e));
    }
  }
}
```


---

## flutter-localization

### REFERENCE

# Localization Reference

## Easy Localization Setup

Basic implementation in `main.dart`.

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('en'), Locale('vi')],
      path: 'assets/translations', // <-- Path to translations
      fallbackLocale: const Locale('en'),
      child: const MyApp(),
    ),
  );
}
```

## CSV Translation Format

Preferred for Google Sheets workflows and translator collaboration.

```csv
key,en,vi
welcome,Welcome!,Chào mừng!
login.button,Login,Đăng nhập
items_count.zero,No items,Không có mục nào
items_count.one,{} item,{} mục
items_count.other,{} items,{} mục
```

## JSON Translation Format

Preferred for nested structures and IDE validation.

```json
// en.json
{
  "app_title": "My App",
  "welcome": "Welcome, {}!",
  "items_count": {
    "zero": "No items",
    "one": "{} item",
    "other": "{} items"
  }
}
```

## Google Sheets Integration

Use `sheet_loader_localization` to fetch and generate localizations from Google Sheets.

1. Add to `pubspec.yaml` under `dev_dependencies`.
2. Configure sheets URL/ID in `pubspec.yaml` or separate config.
3. Run `flutter pub run sheet_loader_localization:main`.

See [Sheet Loader Example](sheet-loader.md).


---

### implementation

# Localization Implementation Examples

## Bootstrap Example

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();
  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('en'), Locale('vi')],
      path: 'assets/translations',
      child: const MyApp(),
    ),
  );
}
```

## Usage Example

```dart
Text('welcome'.tr()); // Simple lookup
Text('greeting'.tr(args: [userName])); // With parameters
Text(plural('items_count', itemCount)); // Pluralization
```


---

### sheet-loader

# Google Sheets Localization Loader

Automating translation updates from Google Sheets using `sheet_loader_localization`.

## Configuration (`pubspec.yaml`)

```yaml
dev_dependencies:
  sheet_loader_localization: ^0.1.0

sheet_loader_localization:
  # Google Sheet ID (find in the URL of your sheet)
  doc_id: 'your_google_sheet_id_here'
  sheet_id: '0' # Usually 0 for first sheet
  output_path: 'assets/langs' # For CSV format
  output_format: 'csv' # Use 'json' for JSON format
```

**Alternative for JSON:**

```yaml
output_path: 'assets/translations'
output_format: 'json'
```

## Typical Sheet Format ([example sheet](https://docs.google.com/spreadsheets/d/1v2Y3e0Uvn0JTwHvsduNT70u7Fy9TG43DIcZYJxPu1ZA/edit?gid=1013756643#gid=1013756643))

| key            | en            | vi         |
| :------------- | :------------ | :--------- |
| welcome        | Welcome!      | Chào mừng! |
| login.button   | Login         | Đăng nhập  |
| errors.network | Network Error | Lỗi mạng   |

## CLI Command

Run this command to synchronize your local asset files with the Google Sheet:

```bash
flutter pub run sheet_loader_localization:main
```


---

## flutter-navigation

### implementation

# Navigation Implementation Examples

## Route Configuration

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/orders/:id',
      redirect: (context, state) {
        final id = state.pathParameters['id'];
        if (id == null || id.isEmpty) return '/';
        return null;
      },
      builder: (context, state) => OrderDetailScreen(
        id: state.pathParameters['id']!,
      ),
    ),
  ],
);
```


---

### routing-patterns

# Flutter Navigation Patterns

## 1. GoRouter Setup (Recommended)

```dart
// pubspec.yaml
dependencies:
  go_router: ^13.0.0

// router.dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomePage(),
      routes: [
        GoRoute(
          path: 'product/:id',
          builder: (context, state) => ProductPage(
            productId: state.pathParameters['id']!,
          ),
        ),
      ],
    ),
  ],
  redirect: (context, state) {
    // Auth logic here
    return null;
  },
);

// main.dart
MaterialApp.router(
  routerConfig: router,
)
```

## 2. Deep Linking Configuration

### AndroidManifest.xml

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myapp" />
  <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

### Info.plist

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

## 3. Handling Deep Links

```dart
GoRoute(
  path: '/product/:id',
  redirect: (context, state) async {
    final id = state.pathParameters['id'];
    final exists = await productService.exists(id);
    if (!exists) return '/';
    return null;
  },
  builder: (context, state) => ProductPage(
    productId: state.pathParameters['id']!,
  ),
)
```

## 4. Tab Navigation (State Preservation)

Use `IndexedStack` to keep `Navigator` states alive:

```dart
Scaffold(
  body: IndexedStack(
    index: _selectedIndex,
    children: [
      Navigator(onGenerateRoute: ...),
      Navigator(onGenerateRoute: ...),
    ],
  ),
  bottomNavigationBar: BottomNavigationBar(...),
);
```

## 5. Named Routes (Legacy)

```dart
MaterialApp(
  routes: {
    '/': (context) => HomePage(),
  },
  onGenerateRoute: (settings) {
    if (settings.name == '/product') {
      final args = settings.arguments as ProductArgs;
      return MaterialPageRoute(builder: (_) => ProductPage(productId: args.id));
    }
    return null;
  },
)
```


---

## flutter-notifications

### implementation

# Flutter Notification Implementation

## Lifecycle Handlers (Quick Reference)

```dart
// Foreground
FirebaseMessaging.onMessage.listen((message) {
  _showLocalNotification(message);
});

// Background (app open but not in foreground)
FirebaseMessaging.onMessageOpenedApp.listen((message) {
  _handleNavigation(message.data);
});

// Terminated (cold start from notification tap)
final initialMessage = await FirebaseMessaging.instance.getInitialMessage();
if (initialMessage != null) _handleNavigation(initialMessage.data);
```

## 1. Setup Dependencies

```yaml
dependencies:
  firebase_messaging: ^14.7.0
  flutter_local_notifications: ^16.3.0
```

## 2. Initialization & Permission

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  final messaging = FirebaseMessaging.instance;
  // Request permission
  await messaging.requestPermission(
    alert: true, badge: true, sound: true,
  );

  final token = await messaging.getToken();
  runApp(MyApp());
}
```

## 3. Notification Handling Service

```dart
class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _local = FlutterLocalNotificationsPlugin();

  Future<void> initialize() async {
    // 1. Init Local Notifications
    await _local.initialize(
      InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: DarwinInitializationSettings(),
      ),
      onDidReceiveNotificationResponse: _onTap, // Foreground tap
    );

    // 2. Foreground Stream
    FirebaseMessaging.onMessage.listen(_showLocal);

    // 3. Background/Terminated -> Opened
    FirebaseMessaging.onMessageOpenedApp.listen(_handleTap);

    // 4. Terminated -> Launched
    final initialMsg = await _messaging.getInitialMessage();
    if (initialMsg != null) _handleTap(initialMsg);
  }

  void _showLocal(RemoteMessage msg) {
    _local.show(
      msg.hashCode,
      msg.notification?.title,
      msg.notification?.body,
      NotificationDetails(
        android: AndroidNotificationDetails('default', 'Default',
            importance: Importance.max, priority: Priority.high),
        iOS: DarwinNotificationDetails(),
      ),
      payload: jsonEncode(msg.data),
    );
  }

  void _handleTap(RemoteMessage msg) {
    // Navigate based on payload
  }
}
```

## 4. Permission Priming (Recommended)

Explain benefits before system dialog:

```dart
Future<void> requestPermission(BuildContext context) async {
  final userAgreed = await showDialog<bool>(...); // Show explanation dialog
  if (userAgreed == true) {
    await FirebaseMessaging.instance.requestPermission();
  }
}
```

## 5. iOS Badge Management

```dart
_local.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()
    ?.setApplicationIconBadgeNumber(0); // Clear badge
```


---

## flutter-retrofit-networking

### REFERENCE

# Retrofit & Dio Reference

Standards for API communication and networking logic.

## References

- [**Token Refresh Logic**](token-refresh.md) - The 401 Lock-Refresh-Retry pattern.

## **Quick Definition**

```dart
@RestApi()
abstract class ApiClient {
  @GET("/items")
  Future<List<ItemDto>> getItems(@Query("limit") int limit);
}
```

## **Safe Enum Handling**

Always define a fallback value for enums in DTOs to ensure robustness against backend changes.

```dart
@freezed
class UserDto with _$UserDto {
  const factory UserDto({
    required String id,
    // Safely handles new/unknown values from API
    @JsonKey(unknownEnumValue: Gender.unknown)
    required Gender gender,
  }) = _UserDto;

  factory UserDto.fromJson(Map<String, dynamic> json) => _$UserDtoFromJson(json);
}

enum Gender { male, female, unknown }
```


---

### implementation

# Retrofit & Dio Implementation Examples

## Retrofit Client

```dart
@RestApi()
abstract class OrderRemoteDataSource {
  factory OrderRemoteDataSource(Dio dio) = _OrderRemoteDataSource;

  @GET('/orders/{id}')
  Future<OrderDto> getOrder(@Path('id') String id);

  @POST('/orders/{id}/cancel')
  Future<void> cancelOrder(@Path('id') String id);
}
```

## Safe Enum DTO

```dart
@freezed
class OrderDto with _$OrderDto {
  const factory OrderDto({
    required String id,
    @JsonKey(unknownEnumValue: OrderStatus.unknown)
    required OrderStatus status,
  }) = _OrderDto;

  factory OrderDto.fromJson(Map<String, dynamic> json) =>
      _$OrderDtoFromJson(json);
}
```


---

### token-refresh

# Token Refresh Pattern

When a `401 Unauthorized` error occurs, the networking layer should handle the refresh cycle transparently.

## **Implementation Flow (Dio Interceptor)**

```dart
class AuthInterceptor extends QueuedInterceptorsWrapper {
  final Dio dio;
  final SecureStorage storage;

  AuthInterceptor(this.dio, this.storage);

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      // 1. Refresh the token
      final newToken = await _performRefresh();
      
      if (newToken != null) {
        // 2. Retry the original request with new token
        final options = err.requestOptions;
        options.headers['Authorization'] = 'Bearer $newToken';
        
        final response = await dio.fetch(options);
        return handler.resolve(response);
      }
    }
    return handler.next(err);
  }

  Future<String?> _performRefresh() async {
    // Logic to call refresh endpoint and update storage
  }
}
```

## **Why QueuedInterceptorsWrapper?**

Using `QueuedInterceptorsWrapper` ensures that if multiple requests trigger a 401 at the same time, they are queued while the first one performs the token refresh, preventing multiple redundant refresh calls.


---

## flutter-riverpod-state-management

### implementation

# Riverpod Implementation Examples

## Provider Definition (Generator-First)

```dart
// products_provider.dart — use @riverpod annotation
@riverpod
class ProductsNotifier extends _$ProductsNotifier {
  @override
  Future<List<Product>> build() async {
    return ref.watch(productRepositoryProvider).getProducts();
  }

  Future<void> addProduct(Product product) async {
    await ref.read(productRepositoryProvider).create(product);
    ref.invalidateSelf(); // Refetch after mutation
  }
}
```

## Consuming Providers

```dart
// products_screen.dart — ConsumerWidget usage
class ProductsScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsNotifierProvider);

    return productsAsync.when(
      data: (products) => ListView.builder(
        itemCount: products.length,
        itemBuilder: (_, i) => ProductTile(products[i]),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (err, stack) => Text('Error: $err'),
    );
  }
}
```


---

## flutter-security

### REFERENCE

# Mobile Security Reference

Detailed implementation patterns for OWASP Mobile compliance.

## References

- [**Network Security**](network-security.md) - SSL Pinning and Security Headers.
- [**Secure Storage**](secure-storage-impl.md) - PII and Token management.

## **CI/CD Security Flag**

```bash
# Obfuscation during build
flutter build apk --obfuscate --split-debug-info=./debug-info
```


---

### implementation

# Mobile Security Implementation Examples

## Secure Storage

```dart
final secureStorage = const FlutterSecureStorage();

// Store token securely
await secureStorage.write(key: 'auth_token', value: token);

// Read token
final token = await secureStorage.read(key: 'auth_token');
```

## Release Build Command

```bash
flutter build appbundle \
  --obfuscate \
  --split-debug-info=build/debug-info \
  --dart-define=API_URL=$API_URL
```


---

### network-security

# Network Security & Certificate Pinning

## **SSL Pinning with Dio**

```dart
import 'package:dio/dio.dart';
import 'package:dio_certificate_pinning/dio_certificate_pinning.dart';

final dio = Dio();
dio.interceptors.add(CertificatePinningInterceptor(
  allowedSHAFingerprints: [
    "70:99:27:8B:54:4A:40:F5:30:DB:73:E3:64:36:0F:70:3D:09:A6:49",
  ],
));
```

## **Security Headers Interceptor**

```dart
class SecurityInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.headers['X-Content-Type-Options'] = 'nosniff';
    options.headers['X-Frame-Options'] = 'DENY';
    super.onRequest(options, handler);
  }
}
```


---

## flutter-testing

### REFERENCE

# Testing Standards Reference

Practical patterns for Unit, Widget, and Golden tests.

## References

- [**Test Organization**](test-organization.md) - File naming, placement rules, test classification.
- [**Unit Testing**](unit-testing.md) - Mocking, AAA pattern, Repository testing.
- [**Widget Testing**](widget-testing.md) - TestWrapper setup, GetIt registration, common pitfalls.
- [**BLoC Testing**](bloc-testing.md) - Using `blocTest` for state transitions.
- [**Mocking Standards**](mocking_standards.md) - Shared mocks, bloc state stubbing, external service mocking.
- [**Robot Pattern**](robot-pattern.md) - UI abstraction, symmetric assertions.
- [**Integration Testing**](integration-testing.md) - Patrol, Robot Pattern enforcement, auth helpers, navigation patterns.

## **Quick Assertions**

```dart
// Mocktail Stub
when(() => repository.fetchData()).thenAnswer((_) async => right(data));

// Expect Matchers
expect(state.isLoading, isTrue);
expect(find.text('Hello'), findsOne);
verify(() => repository.fetchData()).called(1);
```


---

### bloc-testing

# BLoC Testing with `bloc_test`

`blocTest` ensures your events trigger the correct sequence of states.

## **Success Scenario**

```dart
blocTest<AuthBloc, AuthState>(
  'emits [loading, authenticated] when login is successful',
  build: () {
    // Stub the repository
    when(() => mockAuthRepo.login('test@email.com', 'pass123'))
        .thenAnswer((_) async => Right(mockUser));
    return AuthBloc(mockAuthRepo);
  },
  act: (bloc) => bloc.add(const AuthEvent.loginPressed('test@email.com', 'pass123')),
  expect: () => [
    const AuthState.loading(),
    AuthState.authenticated(mockUser),
  ],
  verify: (_) {
    verify(() => mockAuthRepo.login('test@email.com', 'pass123')).called(1);
  },
);
```

## **Best Practices & Pitfalls**

- **Do not mock based on State**: Do not use values in the BLoC state to mock data or verify calls. This is unreliable because it tracks the number of times a state is emitted (which can happen multiple times) rather than verifying the actual event trigger. Always verify the downstream Dependency/Service call in the `verify` block.
- **Initial State verification**

Always ensure your BLoC doesn't emit anything just by being created unless specified.

```dart
test('initial state is AuthState.initial', () {
  expect(AuthBloc(mockRepo).state, const AuthState.initial());
});
```


---

### integration-testing

# Advanced Integration Testing

Expert strategies for running Patrol integration tests with Robot Pattern enforcement.

## 🚨 File Placement

Integration tests (`*_integration_test.dart`) belong **ONLY** in `integration_test/`.

- **NEVER** place `_integration_test.dart` in `test/features/`.
- Widget tests using `testWidgets`, `MockBloc`, `flutter_test` are **widget tests** — use `_test.dart`.
- Only `patrolTest`, `$.native.*`, or real device tests belong here.
- See [Test Organization](test-organization.md) for full classification.

## 🚨 Robot Pattern is MANDATORY

Integration tests MUST use robot classes for ALL assertions and interactions.

**Allowed in test body:**

- `$.native.*` — native OS interactions (never in robot)
- Navigation helper calls returning `bool`
- Robot instantiation: `final robot = FeatureRobot($.tester)`
- Robot method calls: `robot.expectXxxVisible()`, `await robot.tapXxx()`

**NOT allowed in test body:**

**NOT allowed in test body:**

- `find.byType(...)` — move to robot method
- `expect(find.*, ...)` — move to robot method
- `$.tester.tap(find.*)` — move to robot method
- Direct `v_dls` widget references — robot handles DLS awareness

## Integration Test File Structure

```dart
import 'package:flutter/material.dart';         // Only if BackButton/Icons needed
import 'package:flutter_test/flutter_test.dart'; // Only if test body uses find/Finder
import 'package:our_children/main.dart' as app;
import 'package:patrol/patrol.dart';

import '../../test/robots/<feature>/<robot>.dart';
import '../helpers/auth_helper.dart';

void main() {
  // ── Navigation Helper (infrastructure — raw find OK) ──────────
  Future<bool> navigateToFeature(PatrolIntegrationTester $) async {
    app.main();
    await $.pumpAndSettle(timeout: const Duration(seconds: 10));
    final loggedIn = await IntegrationAuthHelper.loginOrSkip($);
    if (!loggedIn) return false;
    await IntegrationAuthHelper.waitForDashboard($);
    // ... scroll + find entry point ...
    return true;
  }

  // ── Tests (robot-only assertions) ─────────────────────────────
  patrolTest('screen renders with app bar', ($) async {
    final ok = await navigateToFeature($);
    if (!ok) return;
    final robot = FeatureRobot($.tester);
    robot.expectVAppBarVisible();
    robot.expectContentVisible();
  });

  patrolTest('back returns to previous screen', ($) async {
    final ok = await navigateToFeature($);
    if (!ok) return;
    final robot = FeatureRobot($.tester);
    await robot.tapBackButton();
    final navRobot = NavigationBarScreenRobot($.tester);
    navRobot.expectBottomNavBarVisible();
  });
}
```

## Auth Helper Pattern (REQUIRED)

Shared `IntegrationAuthHelper` in `integration_test/helpers/auth_helper.dart`:

```dart
class IntegrationAuthHelper {
  IntegrationAuthHelper._();
  static const _testEmail = String.fromEnvironment('TEST_EMAIL', defaultValue: '');
  static const _testPassword = String.fromEnvironment('TEST_PASSWORD', defaultValue: '');
  static bool get hasCredentials => _testEmail.isNotEmpty && _testPassword.isNotEmpty;

  /// Returns true on success, false if no credentials.
  static Future<bool> loginOrSkip(PatrolIntegrationTester $) async {
    if (!hasCredentials) return false;
    final robot = LoginRobot($.tester);  // ← Uses robot, not raw find
    try { robot.verifyLoginScreenVisible(); } catch (_) { return true; }
    await robot.loginWith(email: _testEmail, password: _testPassword);
    return true;
  }

  static Future<void> waitForDashboard(PatrolIntegrationTester $) async {
    await $.pumpAndSettle(timeout: const Duration(seconds: 15));
  }
}
```

### Credential Passing

```bash
patrol test \
  --target integration_test/app_test.dart \
  --dart-define=TEST_EMAIL=user@staging.com \
  --dart-define=TEST_PASSWORD=StrongPass1!
```

## Navigation Helper Patterns

### Tab Navigation (Bottom Nav)

```dart
Future<bool> navigateToTab(PatrolIntegrationTester $, int tabIndex) async {
  app.main();
  await $.pumpAndSettle(timeout: const Duration(seconds: 10));
  final loggedIn = await IntegrationAuthHelper.loginOrSkip($);
  if (!loggedIn) return false;
  await IntegrationAuthHelper.waitForDashboard($);
  final navBar = find.byType(VBottomNavBar);
  if (navBar.evaluate().isEmpty) return false;
  await $.tester.tap(find.byIcon(tabIcons[tabIndex]));
  await $.pumpAndSettle();
  return true;
}
```

### Deep Screen (via dashboard scroll)

```dart
Future<bool> navigateToDeepScreen(PatrolIntegrationTester $) async {
  // ... login + wait for dashboard ...
  final refreshIndicator = find.byType(RefreshIndicator);
  if (refreshIndicator.evaluate().isNotEmpty) {
    await $.tester.drag(refreshIndicator, const Offset(0, -300));
    await $.pumpAndSettle();
  }
  final target = find.textContaining('Feature');
  if (target.evaluate().isEmpty) return false;
  await $.tester.ensureVisible(target.first);
  await $.tester.tap(target.first);
  await $.pumpAndSettle();
  return true;
}
```

### Navigation Helper Rules

- Return `bool` — `false` means skip test gracefully.
- Place at top of test file, NOT inside `patrolTest`.
- Navigation infrastructure may use raw `find.*` — test body must NOT.
- One helper per deep screen; reuse across all tests in the file.

## Patrol Tips

- `$.native.tap()` for OS-level dialogs — never in robot class.
- `waitUntilVisible()` instead of `pumpAndSettle()` for screens with spinners.
- `nativeAutomation: true` to enable native interactions (permissions, notifications).
- Run: `patrol test -t integration_test/app_test.dart --dart-define=ENV=staging`

## Import Hygiene

```dart
// ✅ Minimal — robot handles DLS widget references
import 'package:patrol/patrol.dart';
import '../../test/robots/feature/feature_robot.dart';
import '../helpers/auth_helper.dart';

// ❌ Avoid — robot handles VTextField/VAppBar assertions
import 'package:v_dls/v_dls.dart';

// Only import material.dart when test body uses BackButton/Icons
// Only import flutter_test when test body uses find/Finder/expect
```

## Integration Test Coverage Checklist

Each feature integration test should cover:

- [ ] Screen renders (app bar, content, or empty state)
- [ ] Primary action works (FAB, submit button, etc.)
- [ ] Secondary navigation (tabs, history, filters)
- [ ] Back navigation returns to previous screen
- [ ] Auth-protected: uses `IntegrationAuthHelper.loginOrSkip($)`
- [ ] All assertions via robot — zero raw `find.*` in test body

## Related Topics

[Robot Pattern](./robot-pattern.md) | [Widget Testing](./widget-testing.md) | [Test Organization](./test-organization.md)


---

### mocking_standards

# Mocking Standards

Strict guidelines for mock classes. Use shared mocks for all cross-feature components — no duplication.

## Rules

### 1. No Local Mocks for Shared Components (CRITICAL)

Do NOT define `MockMyBloc`, `MockMyRepository` in individual test files. Shared components (Blocs, Repositories, Services) use shared mocks only.

### 2. Shared Mock Files

Define all mocks in `test/shared/`:

| Component Type   | Shared Mock File                          |
| :--------------- | :---------------------------------------- |
| **Blocs**        | `test/shared/mock_blocs.dart`             |
| **Data Sources** | `test/shared/mock_datasources.dart`       |
| **Repositories** | `test/shared/mock_repositories.dart`      |
| **Services**     | `test/shared/mock_services.dart`          |
| **External**     | `test/shared/mock_external_services.dart` |

### 3. Check Before Creating

Check `test/shared/` before adding a new mock. Add to the appropriate shared file if missing.

## Bloc State Stubbing (CRITICAL)

Mock blocs return `null` for `.state` by default → widget crashes. **Always** stub in `setUp`:

```dart
setUp(() {
  mockBloc = MockFeatureBloc();
  // ⚠️ CRITICAL: Without these, widget tests crash with null errors
  when(() => mockBloc.state).thenReturn(const FeatureState.initial());
  when(() => mockBloc.stream).thenAnswer((_) => Stream.empty());
});
```

### Stub All Dependent Blocs

```dart
setUp(() {
  mockAuthBloc = MockAuthBloc();
  mockSubscriptionBloc = MockSubscriptionBloc();

  when(() => mockAuthBloc.state).thenReturn(const AuthState(...));
  when(() => mockSubscriptionBloc.state).thenReturn(const SubscriptionState.initial());
});
```

### Override Per Test

```dart
testWidgets('premium user sees premium UI', (tester) async {
  // Override the default state set in setUp
  when(() => mockBloc.state).thenReturn(
    const FeatureState(isPremium: true),
  );
  // ... rest of test
});
```

## GetIt Registration

Use when widget creates bloc via `getIt<MyBloc>()` internally:

```dart
setUpAll(() async {
  await TestWrapper.init();
  // Register mock so widget's BlocProvider(create: ...) finds it
  getIt.registerFactory<AdBloc>(() => mockAdBloc);
});

tearDownAll(() {
  getIt.reset();
});
```

**Rule:** Constructor param → `BlocProvider.value`. Internal `getIt<>()` → register in GetIt.

## External Service Mocking

Create Fake implementations for non-bloc services:

```dart
// test/shared/mock_external_services.dart
class FakeImagePickerService implements ImagePickerService {
  int pickImageCallCount = 0;

  @override
  Future<String?> pickImage() async {
    pickImageCallCount++;
    return 'test.jpg';
  }
}
```

Register in `setUpAll`:

```dart
fakeImagePickerService = FakeImagePickerService();
getIt.registerLazySingleton<ImagePickerService>(() => fakeImagePickerService);
```

## Examples

### ❌ BAD: Local Mock Definition

```dart
// test/features/my_feature/my_test.dart
import 'package:bloc_test/bloc_test.dart';

class MockMyBloc extends MockBloc<MyEvent, MyState> implements MyBloc {} // <--- AVOID THIS

void main() {
  late MockMyBloc mockBloc;
  ...
}
```

### ✅ GOOD: Shared Mock Usage

**1. Define in Shared File:**

```dart
// test/shared/mock_blocs.dart
import 'package:bloc_test/bloc_test.dart';
import 'package:my_app/features/my_feature/bloc/my_bloc.dart';

class MockMyBloc extends MockBloc<MyEvent, MyState> implements MyBloc {}
```

**2. Import in Test:**

```dart
// test/features/my_feature/my_test.dart
import '../../../../shared/mock_blocs.dart';

void main() {
  late MockMyBloc mockBloc;
  ...
}
```

## Safe Argument Matching

Prohibit `any()` / `anyNamed()` — bypass type safety, cause silent failures. Use specific values or typed matchers.

```dart
// ❌ BAD: Unsafe Matchers
when(() => repository.fetchData(any())).thenAnswer(...);
verify(() => service.logAction(any())).called(1);
verify(() => service.performTask(id: anyNamed('id'))).called(1);
```

### ✅ GOOD: Explicit Matchers

```dart
// Use specific values when possible
when(() => repository.fetchData(const MyParams(id: '123'))).thenAnswer(...);

// For named parameters, use specific values or type matchers
verify(() => service.performTask(
  id: 'task_1',
  priority: 1,
)).called(1);

// Use isA<Type>() for broad but type-safe matching
verify(() => service.performTask(
  id: isA<String>(),
  priority: isA<int>(),
)).called(1);

// Use type-specific matchers or equality
verify(() => logger.log(
  message: argThat(startsWith('Error')),
  level: LogLevel.error,
)).called(1);
```

### Flexible Verification

Use `greaterThan` when bloc events fire multiple times (e.g., rebuilds):

```dart
// ✅ Handles multiple calls from widget rebuilds
verify(
  () => mockBloc.add(const FeatureEvent.init(isPremium: false)),
).called(greaterThan(0));
```


---

### robot-pattern

# Robot Pattern

Decouple UI interactions from test assertions. One robot shared by widget + Patrol tests.

## Why

- Tests read like user stories.
- One robot → widget + patrol test, zero duplication.
- Key/widget changes update only robot, not every test.

## Directory

```text
test/
  robots/<feature>/<screen>_robot.dart   ← shared robot
  features/<feature>/                    ← widget tests (*_test.dart ONLY)
integration_test/<feature>/              ← patrol tests
```

## Robot Class Pattern

```dart
// test/robots/authenticate/login_robot.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:our_children/core/keys/app_widget_keys.dart';

class LoginRobot {
  final WidgetTester tester;
  const LoginRobot(this.tester);

  // ─── Actions ───────────────────────────────────────────────────
  Future<void> enterEmail(String email) async {
    await tester.enterText(find.byKey(LoginWidgetKeys.emailField), email);
    await tester.pump();
  }

  Future<void> enterPassword(String password) async {
    await tester.enterText(find.byKey(LoginWidgetKeys.passwordField), password);
    await tester.pump();
  }

  Future<void> tapLoginButton() async {
    await tester.ensureVisible(find.byKey(LoginWidgetKeys.submitButton));
    await tester.tap(find.byKey(LoginWidgetKeys.submitButton));
    await tester.pump();
  }

  Future<void> loginWith({required String email, required String password}) async {
    await enterEmail(email);
    await enterPassword(password);
    await tapLoginButton();
  }

  /// Pumps the login screen with required bloc providers.
  /// Set [settle] to false for tests using whenListen or loading states.
  Future<void> pumpScreen({
    required MockAuthBloc authBloc,
    bool settle = true,
  }) async {
    await tester.pumpWidget(
      BlocProvider<AuthBloc>.value(
        value: authBloc,
        child: const LoginScreen(),
      ),
    );
    if (settle) await tester.pumpAndSettle();
  }

  // ─── Assertions ────────────────────────────────────────────────
  void verifyLoginScreenVisible() =>
      expect(find.byKey(LoginWidgetKeys.submitButton), findsOne);

  void verifyLoginButtonDisabled() =>
      expect(find.byKey(LoginWidgetKeys.submitButton), findsOne);
}
```

## Symmetric Assertions (REQUIRED)

Provide both positive and negative variants. Prevents inline `expect` in tests.

```dart
// ─── Assertions ────────────────────────────────────────────────

// ✅ GOOD: Symmetric pair
void expectContentVisible(String text) {
  expect(find.text(text), findsOne);
}

void expectContentNotVisible(String text) {
  expect(find.text(text), findsNothing);
}

// ✅ GOOD: Parameterized for dynamic content
void expectTextVisible(String text) {
  expect(find.text(text), findsOne);
}

void expectTextNotVisible(String text) {
  expect(find.text(text), findsNothing);
}

// ❌ BAD: Only positive assertion — forces inline expect in tests
void expectTitleVisible() {
  expect(find.text('My Title'), findsOne);
}
// Missing: expectTitleNotVisible()
```

### When to Add Negative Assertions

- Content disappears after navigation/state change.
- Mutual exclusivity (tab A visible → tab B hidden).
- Conditional UI (premium features hidden for free users).

## Pump Helpers

Encapsulate widget tree setup. Use `settle` param for `whenListen`/loading tests:

```dart
class FeatureRobot {
  final WidgetTester tester;
  const FeatureRobot(this.tester);

  /// Pumps the screen with required bloc providers.
  /// Set [settle] to false for tests using whenListen or loading states.
  Future<void> pumpScreen({
    required MockFeatureBloc featureBloc,
    bool settle = true,
  }) async {
    await tester.pumpLocalizedWidget(
      BlocProvider<FeatureBloc>.value(
        value: featureBloc,
        child: const FeatureScreen(),
      ),
    );
    if (settle) await tester.pumpAndSettle();
  }
}
```

## Widget Test Usage

```dart
testWidgets('login button enables after input', (tester) async {
  final robot = LoginRobot(tester);
  await robot.pumpScreen(authBloc: mockAuthBloc);
  robot.verifyLoginButtonDisabled();
  await robot.loginWith(email: 'a@b.com', password: 'pass');
});
```

## Patrol Integration Test Usage

```dart
// integration_test/authenticate/login_integration_test.dart
import '../../test/robots/authenticate/login_robot.dart';

patrolTest('full login flow', ($) async {
  app.main();
  await $.pumpAndSettle();
  final robot = LoginRobot($.tester);        // ← same robot, $.tester unwraps it
  robot.verifyLoginScreenVisible();
  await robot.loginWith(email: 'a@b.com', password: 'pass');
  // Native dialogs (OS-level only — NOT in robot):
  if (await $.native.isPermissionDialogVisible()) await $.native.allowPermission();
});
```

## Integration Test Robot Methods (REQUIRED)

Robots shared with integration tests MUST include methods that work **without** `pumpScreen`.
Integration tests run the real app — robots only assert/interact with what's on screen.

### Required Method Categories

```dart
class FeatureRobot {
  final WidgetTester tester;
  const FeatureRobot(this.tester);

  // ─── Widget test only ────────────────────────────────────────
  Future<void> pumpScreen({required MockBloc bloc, bool settle = true}) async {
    // ... widget test setup (NOT called in integration tests)
  }

  // ─── Shared: Actions (widget + integration) ─────────────────
  Future<void> tapFab() async {
    await tester.tap(find.byType(FloatingActionButton));
    await tester.pumpAndSettle();
  }

  Future<void> tapBackButton() async {
    final backButton = find.byType(BackButton);
    if (backButton.evaluate().isNotEmpty) {
      await tester.tap(backButton.first);
      await tester.pumpAndSettle();
    }
  }

  // ─── Shared: Assertions (widget + integration) ──────────────
  void expectVAppBarVisible() =>
      expect(find.byType(VAppBar), findsOne);

  void expectContentVisible() {
    final hasContent =
        find.byType(ListView).evaluate().isNotEmpty ||
        find.byType(CustomScrollView).evaluate().isNotEmpty;
    expect(hasContent, isTrue, reason: 'Screen should show scrollable content');
  }

  void expectFabVisible() =>
      expect(find.byType(FloatingActionButton), findsOne);

  void expectLoadingIndicator() =>
      expect(find.byType(VCircularProgress), findsOne);

  void expectTabBarVisible() =>
      expect(find.byType(TabBar), findsOne);

  void expectTextFieldsVisible() =>
      expect(find.byType(VTextField), findsWidgets);
}
```

### Common Integration Robot Methods Checklist

Every robot used in integration tests should provide:

| Method                     | Purpose                                       |
| :------------------------- | :-------------------------------------------- |
| `expectVAppBarVisible()`   | Screen has app bar (confirms navigation)      |
| `expectContentVisible()`   | Screen shows list/content (not blank)         |
| `tapBackButton()`          | Navigate back from screen                     |
| `expectLoadingIndicator()` | Loading state verification                    |
| Feature-specific actions   | `tapFab()`, `tapHistoryTab()`, etc.           |
| Feature-specific asserts   | `expectFabVisible()`, `expectTabBarVisible()` |

## Integration Test Navigation Helpers

Deep screens require navigation helper functions. These are the ONLY place
where raw `find.textContaining()` is acceptable — they are infrastructure.

```dart
/// Navigate from dashboard to a deep screen.
/// Returns false if navigation target not found.
Future<bool> navigateToFeature(PatrolIntegrationTester $) async {
  app.main();
  await $.pumpAndSettle(timeout: const Duration(seconds: 10));
  final loggedIn = await IntegrationAuthHelper.loginOrSkip($);
  if (!loggedIn) return false;
  await IntegrationAuthHelper.waitForDashboard($);

  // Scroll dashboard to find entry point (infrastructure — raw find OK here)
  final refreshIndicator = find.byType(RefreshIndicator);
  if (refreshIndicator.evaluate().isNotEmpty) {
    await $.tester.drag(refreshIndicator, const Offset(0, -300));
    await $.pumpAndSettle();
  }

  final target = find.textContaining('Feature');
  if (target.evaluate().isEmpty) return false;
  await $.tester.ensureVisible(target.first);
  await $.tester.tap(target.first);
  await $.pumpAndSettle();
  return true;
}
```

### Navigation Helper Rules

- Return `bool` — `false` means skip test gracefully.
- Place at top of test file, NOT inside `patrolTest`.
- Navigation infrastructure may use raw `find.*` — test body must NOT.
- One helper per deep screen; reuse across all tests in the file.

## Integration Test Anti-Patterns

```dart
// ❌ BAD: Raw find.byType in test body
patrolTest('shows tab bar', ($) async {
  await navigateToScreen($);
  expect(find.byType(TabBar), findsOne);  // ← WRONG
});

// ✅ GOOD: Robot method in test body
patrolTest('shows tab bar', ($) async {
  final ok = await navigateToScreen($);
  if (!ok) return;
  final robot = FeatureRobot($.tester);
  robot.expectTabBarVisible();                   // ← CORRECT
});
```

```dart
// ❌ BAD: import v_dls in integration test when robot handles it
import 'package:v_dls/v_dls.dart';  // ← unused, robot already handles VTextField/VAppBar

// ✅ GOOD: only import what's needed
import '../../test/robots/feature/feature_robot.dart';
```

## Multiple Robots in One Test

Use multiple robots when test crosses screen boundaries:

```dart
patrolTest('back from feature returns to dashboard', ($) async {
  final ok = await navigateToFeature($);
  if (!ok) return;

  final featureRobot = FeatureRobot($.tester);
  await featureRobot.tapBackButton();

  final navRobot = NavigationBarScreenRobot($.tester);
  navRobot.expectBottomNavBarVisible();  // ← different robot for different screen
});
```


---

### test-organization

# Test Organization

File naming, placement, and structure rules.

## File Placement Rules

| Test Type             | Location                      | Suffix                   | Runner         | Framework                         |
| :-------------------- | :---------------------------- | :----------------------- | :------------- | :-------------------------------- |
| Unit tests            | `test/features/<feature>/`    | `_test.dart`             | `flutter test` | flutter_test, mocktail            |
| Widget tests          | `test/features/<feature>/`    | `_test.dart`             | `flutter test` | flutter_test, mocktail, bloc_test |
| **Integration tests** | `integration_test/<feature>/` | `_integration_test.dart` | `patrol test`  | patrol                            |

## 🚨 CRITICAL: File Naming & Placement

### `_integration_test.dart` belongs ONLY in `integration_test/`

The `_integration_test.dart` suffix has a **specific technical meaning**: the file uses Patrol, runs on a real device/emulator, and may interact with native OS dialogs.

**NEVER** create `_integration_test.dart` files in the `test/` directory tree.

### Classification Guide

Ask in order:

1. **Does it use `patrolTest`, `$.native.*`, or require a real device?**
   → **Integration test** → `integration_test/<feature>/<screen>_integration_test.dart`

2. **Does it render widgets with `pumpWidget` / `pumpLocalizedWidget` and assert on UI?**
   → **Widget test** → `test/features/<feature>/<screen>_test.dart`

3. **Does it test a class/function without rendering widgets?**
   → **Unit test** → `test/features/<feature>/<class>_test.dart`

### Misclassification Signs

A test is a **widget test** (NOT integration) if it:

- Uses `testWidgets(...)` instead of `patrolTest(...)`
- Imports `package:flutter_test/flutter_test.dart`
- Uses `MockBloc`, `when()`, `verify()` from mocktail
- Wraps widgets with `BlocProvider.value(value: mockBloc, ...)`
- Never touches native OS features

## Directory Structure

```text
test/
├── features/
│   ├── auth/
│   │   ├── login_screen_test.dart          ← widget tests
│   │   └── reset_password_screen_test.dart ← widget tests
│   ├── child/
│   │   └── child_profile_screen_test.dart
│   └── subscription/
│       ├── subscription_screen_test.dart
│       └── widgets/
│           └── subscription_plan_card_test.dart
├── robots/
│   ├── auth/
│   │   ├── login_robot.dart
│   │   └── reset_password_robot.dart
│   └── child/
│       └── child_profile_robot.dart
├── shared/
│   ├── mock_blocs.dart
│   ├── mock_repositories.dart
│   ├── mock_services.dart
│   └── widgets/
│       └── test_wrapper.dart
└── core/
    └── utils/
        └── input_validator_test.dart       ← unit tests

integration_test/
├── app_test.dart                           ← entry point
├── auth/
│   └── login_integration_test.dart         ← Patrol tests
└── helpers/
    └── test_helpers.dart
```

## Widget Test File Structure

Each widget test file should follow this template:

```dart
import 'package:bloc_test/bloc_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

// Project imports
import 'package:our_children/features/.../screen.dart';
import '../../../shared/mock_blocs.dart';
import '../../../shared/widgets/test_wrapper.dart';
import '../../../robots/.../screen_robot.dart';

void main() {
  late MockFeatureBloc mockBloc;
  late ScreenRobot robot;

  setUpAll(() async => await TestWrapper.init());

  setUp(() {
    mockBloc = MockFeatureBloc();
    when(() => mockBloc.state).thenReturn(const FeatureState.initial());
    when(() => mockBloc.stream).thenAnswer((_) => Stream.empty());
  });

  // Core functionality
  group('FeatureScreen', () {
    testWidgets('should render initial state', (tester) async {
      robot = ScreenRobot(tester);
      await robot.pumpScreen(mockBloc: mockBloc);
      robot.expectScreenVisible();
    });

    // ... more core tests
  });

  // Boundary conditions, error handling, edge cases
  group('Edge cases', () {
    testWidgets('should handle empty list', (tester) async {
      when(() => mockBloc.state).thenReturn(
        const FeatureState(items: []),
      );
      robot = ScreenRobot(tester);
      await robot.pumpScreen(mockBloc: mockBloc);
      robot.expectEmptyStateVisible();
    });

    // ... more edge case tests
  });
}
```

## Audit & Migration

When misnamed/misplaced test files found:

1. **Identify**: Search for `_integration_test.dart` in `test/` directory.
2. **Classify**: Apply the classification rules above.
3. **Check for duplicates**: Compare test names with existing `_test.dart` file for the same screen.
4. **Merge unique tests**: Port any tests NOT already covered into the widget test file.
5. **Delete the misnamed file**: Remove the `_integration_test.dart` from `test/`.
6. **Verify**: Run `flutter test` on the modified widget test file.

## Related

- [Widget Testing](widget-testing.md) — TestWrapper setup, common pitfalls
- [Integration Testing](integration-testing.md) — Patrol patterns, native interactions
- [Robot Pattern](robot-pattern.md) — UI abstraction for test assertions


---

### unit-testing

# Unit Testing Strategies

Unit tests verify the smallest parts of your application (functions, methods, classes) in isolation.

## Core Rules

1. **Isolation**: External dependencies (API, Database, SharedPreferences) **must** be mocked.
2. **Scope**: One test file per source file (e.g., `user_repository.dart` -> `user_repository_test.dart`).
3. **Arrange-Act-Assert (AAA)**: Follow this structure strictly.
4. **Explicit Matching**: **FORBIDDEN**: `any()` and `registerFallbackValue()`. Always use explicit values or specific instances in `when` and `verify` calls.

## Advanced Techniques

### 1. Test Data Builders

Avoid hardcoding large objects in every test. Use a Builder pattern to generate valid default data with overrides.

```dart
class UserBuilder {
  String _id = '1';
  String _name = 'Default User';

  UserBuilder withId(String id) {
    _id = id;
    return this;
  }

  User build() => User(id: _id, name: _name);
}

// Usage in test
final user = UserBuilder().withId('99').build();
```

### 2. Mocking with Mocktail

We prefer `mocktail` over `mockito` for its null-safety and simplicity.

```dart
import 'package:mocktail/mocktail.dart';
import 'package:test/test.dart';

// 1. Create Mock
class MockUserRepository extends Mock implements UserRepository {}

void main() {
  late MockUserRepository mockRepo;
  late GetUserProfileUseCase useCase;

  setUp(() {
    mockRepo = MockUserRepository();
    useCase = GetUserProfileUseCase(mockRepo);
  });

  // 2. Test Group
  group('GetUserProfileUseCase', () {
    test('should return User when repository succeeds', () async {
      // ARRANGE
      final user = UserBuilder().build();
      // ✅ Explicit matching of '1'
      when(() => mockRepo.getUser('1')).thenAnswer((_) async => Right(user));

      // ACT
      final result = await useCase('1');

      // ASSERT
      expect(result, Right(user));
      verify(() => mockRepo.getUser('1')).called(1);
    });

    test('should return Failure when repository fails', () async {
      // ARRANGE
      when(() => mockRepo.getUser('1')).thenThrow(ServerException());

      // ACT
      final call = useCase('1');

      // ASSERT
      expect(call, throwsA(isA<ServerException>()));
    });
  });
}
```

## Best Practices & Anti-Patterns (DCM)

Avoid common testing mistakes identified by Dart Code Metrics.

### 1. Assertions are Mandatory

Never write a test that just "runs" without verifying anything.

```dart
// BAD
test('fetchUser runs', () async {
  await repo.fetchUser();
  // ❌ No assertion - test passes even if logic is broken
});

// GOOD
test('fetchUser returns data', () async {
  final result = await repo.fetchUser();
  expect(result, isNotNull); // ✅ Always verify result
});
```

### 2. Use Proper Matchers

Use specific matchers for better error messages.

```dart
// BAD
expect(list.length, 1); // Message: "Expected: <1> Actual: <0>"

// GOOD
expect(list, hasLength(1)); // Message: "Expected: list with length <1> Actual: list with length <0> [...]"
```

### 3. Async Expectations

When testing Streams or Futures validation, use `expectLater` to ensure the test waits.

```dart
// BAD
expect(stream, emits(1)); // Might finish test before stream emits

// GOOD
await expectLater(stream, emits(1));
```

### 4. Forbid `any()` and `registerFallbackValue()`

Using `any()` often leads to brittle tests and requires `registerFallbackValue()` for non-primitive types. Be explicit.

```dart
// ❌ BAD
registerFallbackValue(User.empty());
when(() => mockRepo.updateUser(any())).thenAnswer((_) async => Right(user));

// ✅ GOOD (Use exact instance or managed test data)
final userToUpdate = UserBuilder().withId('123').build();
when(() => mockRepo.updateUser(userToUpdate)).thenAnswer((_) async => Right(userToUpdate));
```


---

### widget-keys

# Widget Key Standards — Reference

## File Layout

```text
lib/core/keys/
├── app_widget_keys.dart              ← single barrel; always import this
└── authenticate/
    └── login_widget_keys.dart        ← LoginWidgetKeys
```

## Adding Keys for a New Screen

1. Create `lib/core/keys/<feature>/<screen>_widget_keys.dart`
2. Add one `export` line in `app_widget_keys.dart`
3. No other changes needed.

## WidgetKeys Class Pattern

```dart
// lib/core/keys/authenticate/login_widget_keys.dart
import 'package:flutter/material.dart';

abstract final class LoginWidgetKeys {
  static const emailField          = Key('authenticate.login.emailField');
  static const passwordField       = Key('authenticate.login.passwordField');
  static const submitButton        = Key('authenticate.login.submitButton');
  static const forgotPasswordButton = Key('authenticate.login.forgotPasswordButton');
  static const signUpLink          = Key('authenticate.login.signUpLink');
}
```

Key string format: `<feature>.<screen>.<element>` — readable in failure output.

## Barrel Export (app_widget_keys.dart)

```dart
// lib/core/keys/app_widget_keys.dart
export 'authenticate/login_widget_keys.dart';
// export 'child/child_widget_keys.dart';    ← add one line per new screen
```

## Usage

```dart
// ✅ In widget
EmailField(key: LoginWidgetKeys.emailField, ...)

// ✅ In robot / test
find.byKey(LoginWidgetKeys.emailField)

// ❌ Never inline
find.byKey(const Key('login_email_field'))
```


---

### widget-testing

# Widget Testing

Verify UI and interactions in a headless simulated environment.

## Core Rules

1. **Wrapper**: Always use `TestWrapper.init()` + `tester.pumpLocalizedWidget(...)` for proper Theme/Navigator/Localization context.
2. **Pump**:
   - `pump()`: Triggers a frame.
   - `pumpAndSettle()`: Wait for all animations to complete.
   - `settle: false` + manual `pump()`: Use when testing state transitions (`whenListen`) or loading states with infinite animations.
3. **Finders**: Use semantic finders (`find.text`, `find.byKey`, `find.byType`) to locate elements.
4. **Imports**: Always import `package:flutter/material.dart` when tests reference Material widgets (`Scaffold`, `Switch`, `Icon`, `Icons`).

## TestWrapper Setup Pattern

Every widget test file must follow this setup:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bloc_test/bloc_test.dart';
import 'package:mocktail/mocktail.dart';

import '../../shared/mock_blocs.dart';
import '../../shared/widgets/test_wrapper.dart';
import '../../robots/<feature>/<screen>_robot.dart';

void main() {
  late MockFeatureBloc mockBloc;

  setUpAll(() async {
    await TestWrapper.init();
  });

  setUp(() {
    mockBloc = MockFeatureBloc();
    // ⚠️ ALWAYS stub initial state — prevents null errors
    when(() => mockBloc.state).thenReturn(const FeatureState.initial());
    when(() => mockBloc.stream).thenAnswer((_) => Stream.empty());
  });

  group('FeatureScreen', () {
    testWidgets('renders initial state', (tester) async {
      final robot = FeatureRobot(tester);
      await robot.pumpScreen(featureBloc: mockBloc);
      robot.expectScreenVisible();
    });
  });

  group('Edge cases', () {
    testWidgets('handles error state', (tester) async {
      when(() => mockBloc.state).thenReturn(
        const FeatureState(status: AppStatus.error, error: 'Network error'),
      );
      final robot = FeatureRobot(tester);
      await robot.pumpScreen(featureBloc: mockBloc);
      robot.expectTextVisible('Network error');
    });
  });
}
```

## GetIt Registration

Use when widget creates blocs via `getIt<MyBloc>()` internally:

```dart
setUpAll(() async {
  await TestWrapper.init();
  // Register mock in GetIt so widget's BlocProvider(create: ...) finds it
  getIt.registerFactory<AdBloc>(() => mockAdBloc);
});

tearDownAll(() {
  getIt.reset();
});
```

**Rule:** Constructor param → `pumpScreen(bloc: mockBloc)`. Internal `getIt<>()` → register in GetIt.

## State Transitions with whenListen

Test reactions to state changes (snackbars, navigation, loading):

```dart
testWidgets('shows snackbar on error', (tester) async {
  whenListen(
    mockBloc,
    Stream.fromIterable([
      const FeatureState(status: AppStatus.loading),
      const FeatureState(status: AppStatus.error, error: 'Failed'),
    ]),
    initialState: const FeatureState(),
  );

  final robot = FeatureRobot(tester);
  await robot.pumpScreen(featureBloc: mockBloc, settle: false);
  robot.expectSnackbarVisible();
});
```

## Common Pitfalls

### 1. Text Casing Mismatch

Widgets transform text (`.toUpperCase()`, `.tr()`, `.capitalize()`). Check widget source:

```dart
// Widget code: Text(status.name.toUpperCase())
// ❌ Wrong assertion
robot.expectTextVisible('Active');
// ✅ Correct assertion
robot.expectTextVisible('ACTIVE');
```

### 2. Missing Material Import

Required when tests reference `Scaffold`, `Switch`, `Icon`, `Icons`:

```dart
// ❌ Missing import causes "undefined" errors
import 'package:flutter_test/flutter_test.dart';

// ✅ Add flutter/material.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
```

### 3. Overflow in Tests

Default test surface: 800×600. Long text or complex layouts overflow:

```dart
// ❌ This will cause RenderFlex overflow in test
await robot.pumpDialog(message: 'A' * 500);

// ✅ Use realistic text lengths or resize surface
tester.view.physicalSize = const Size(1080, 1920);
tester.view.devicePixelRatio = 1.0;
addTearDown(() => tester.view.resetPhysicalSize());
```

### 4. Null State Errors

Mock blocs return null for `.state` by default. Always stub in `setUp`:

```dart
setUp(() {
  mockBloc = MockFeatureBloc();
  // ⚠️ Without this, widget tests crash with null errors
  when(() => mockBloc.state).thenReturn(const FeatureState.initial());
});
```

### 5. Loading State Timeout

`pumpAndSettle()` hangs on infinite animations (spinners, shimmer):

```dart
// ❌ Hangs forever on CircularProgressIndicator
await tester.pumpAndSettle();

// ✅ Use settle: false + manual pump
await robot.pumpScreen(bloc: mockBloc, settle: false);
await tester.pump();
await tester.pump();
expect(find.byType(Scaffold), findsWidgets);
```


---

