---
inclusion: manual
---

# References: android

> 29 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-android.md`.

## android-agp-upgrade

### built-in-kotlin

# Built-in Kotlin Migration (AGP 9)

AGP 9 enables built-in Kotlin by default — the `kotlin-android` plugin is no longer required.

## Migration steps

### 1. Remove the kotlin-android plugin

```kotlin
// BEFORE (build.gradle.kts)
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")  // Remove this
}

// AFTER
plugins {
    id("com.android.application")
    // Built-in Kotlin handles compilation automatically
}
```

### 2. Migrate kotlin-kapt if used

```kotlin
// BEFORE
plugins {
    id("org.jetbrains.kotlin.kapt")  // Remove
}

// AFTER — use KSP or legacy-kapt
plugins {
    id("com.google.devtools.ksp")  // Preferred
    // OR: id("com.android.legacy-kapt") for processors without KSP support
}
```

### 3. Migrate kotlinOptions DSL

```kotlin
// BEFORE
android {
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf("-opt-in=kotlin.RequiresOptIn")
    }
}

// AFTER — use compilerOptions (new DSL)
android {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
        freeCompilerArgs.add("-opt-in=kotlin.RequiresOptIn")
    }
}
```

### 4. Migrate kotlin.sourceSets if used

```kotlin
// BEFORE
kotlin {
    sourceSets {
        main { kotlin.srcDir("src/main/kotlin") }
    }
}

// AFTER — use android sourceSets (built-in Kotlin uses Android source sets)
android {
    sourceSets {
        getByName("main") {
            kotlin.srcDir("src/main/kotlin")  // Usually not needed — default is detected
        }
    }
}
```

## Common errors after migration

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot add extension with name 'kotlin'` | `kotlin-android` plugin still applied | Remove the plugin |
| `The 'org.jetbrains.kotlin.android' plugin is no longer required` | Same — AGP 9 detects and rejects it | Remove the plugin |
| KMP modules fail | Built-in Kotlin replaces `kotlin-android` only, not `kotlin-multiplatform` | Keep `kotlin-multiplatform` for KMP modules |


---

### dsl-migration

# AGP 9 DSL Migration

## Namespace declaration

```kotlin
// BEFORE (AGP 8)
android {
    namespace = "com.example.app"
}

// AFTER (AGP 9) — unchanged, but now mandatory (no fallback to package attribute)
android {
    namespace = "com.example.app"
}
```

## Build types and product flavors

```kotlin
// BEFORE
android {
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

// AFTER (AGP 9) — same syntax, but verify all flags use `is` prefix
// The `minifyEnabled` (without `is`) is removed in AGP 9
android {
    buildTypes {
        release {
            isMinifyEnabled = true       // Must use `is` prefix
            isShrinkResources = true     // Must use `is` prefix
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

## Compile SDK and target SDK

```kotlin
// BEFORE
android {
    compileSdk = 34
    defaultConfig {
        targetSdk = 34
    }
}

// AFTER — AGP 9 requires compileSdk 35+
android {
    compileSdk = 35
    defaultConfig {
        targetSdk = 35
    }
}
```

## Version catalogs (libs.versions.toml)

```toml
# Update AGP version
[versions]
agp = "9.0.0"
kotlin = "2.1.0"  # Remove if using built-in Kotlin
ksp = "2.3.6"

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
# Remove: kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

## R8 / ProGuard changes in AGP 9

AGP 9 includes R8 optimizations by default. Key changes:
- Full-mode R8 is now the only mode (compatibility mode removed).
- Consumer ProGuard rules from libraries are applied automatically.
- Redundant keep rules for AndroidX, Kotlin stdlib, and Google libraries can be removed.

See the R8 analyzer skill (`android-performance`) for keep rule optimization guidance.


---

## android-architecture

### compose-standards

# Jetpack Compose Best Practices

## State Management

- **State Hoisting**: Pass state as parameters and hoist events (lambdas) up to the caller to make composables stateless and testable.
- **collectAsStateWithLifecycle**: Always use `collectAsStateWithLifecycle()` from `androidx.lifecycle:lifecycle-runtime-compose` to observe Flow in UI to avoid resource leaks in background.
- **Immutable Models**: Use `@Immutable` or `@Stable` on UI models to help Compose compiler optimize recompositions.

## Performance & Stability

- **derivedStateOf**: Use `derivedStateOf` when a state is calculated from other state items to minimize unnecessary recompositions (e.g., scroll calculations).
- **remember**: Use `remember { ... }` for heavy object creations in Composables. Use `rememberSaveable` for state that must survive config changes.
- **Lazy List Keys**: Always provide a unique `key` in `LazyColumn` or `LazyRow` items to maintain scroll position and optimize list changes.

## UI Structure

- **Modifiers**: Pass a `modifier: Modifier = Modifier` as the first optional parameter to every reusable Composable. Chain modifiers in a predictable order (Size -> Padding -> Background).
- **Slot API**: Use "Slot" patterns (`content: @Composable () -> Unit`) to make layout components flexible and reusable.
- **Theme Coupling**: Access local colors/typography via `MaterialTheme.colorScheme` rather than hardcoding.

## Anti-Patterns

- **No ViewModel in Sub-composables**: Pass only required data/lambdas. ViewModels should only be accessed at the "Screen" (Level 0) composable.
- **No Side Effects in Composition**: Use `LaunchedEffect`, `SideEffect`, or `DisposableEffect` instead of running logic directly in the body of a Composable.
- **No Heavy Logic**: Keep Composable bodies focused on UI declaration; move business logic to ViewModels.


---

### implementation

# Android Architecture Implementation

## Module Structure (Multi-Module)

```text
root
├── app/               # DI Assembly, Navigation
├── core/
│   ├── network/       # Retrofit, OkHttp
│   ├── database/      # Room, DAO
│   ├── ui/            # Theme, Common Components
│   └── common/        # Extensions, Result wrappers
├── feature/
│   ├── home/          # UI + ViewModel + Domain (optional)
│   └── profile/
```

## Clean Architecture Layers

### Domain Layer (Pure Kotlin)

```kotlin
// feature/domain/usecase/GetFeedUseCase.kt
class GetFeedUseCase @Inject constructor(
    private val repository: FeedRepository
) {
    operator fun invoke(): Flow<Result<List<Post>>> = repository.getFeed()
}
```

### Data Layer (Implementation)

```kotlin
// feature/data/repository/FeedRepositoryImpl.kt
class FeedRepositoryImpl @Inject constructor(
    private val api: FeedApi,
    private val dao: FeedDao
) : FeedRepository {
    override fun getFeed() = flow {
        emit(dao.getAll()) // Cache
        val remote = api.fetch()
        dao.insert(remote) // Source of Truth
        emit(dao.getAll())
    }.map { Result.Success(it) }
}
```

## Domain Layer UseCase (Pure Kotlin)

```kotlin
// Domain layer — pure Kotlin, no Android imports
class GetUserUseCase @Inject constructor(
    private val repo: UserRepository
) {
    suspend operator fun invoke(id: String): User = repo.getUser(id)
}
```

## Module Configuration

```kotlin
// settings.gradle.kts
include(":app", ":feature:home", ":feature:profile")
include(":core:ui", ":core:network", ":core:database")
```


---

## android-background-work

### implementation

# Background Work (WorkManager)

## CoroutineWorker

```kotlin
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val repository: FeedRepository
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        return try {
            repository.sync()
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
```

## Enqueue

```kotlin
val syncRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()
    )
    .setBackoffCriteria(
        BackoffPolicy.EXPONENTIAL,
        OneTimeWorkRequest.MIN_BACKOFF_MILLIS,
        TimeUnit.MILLISECONDS
    )
    .build()

WorkManager.getInstance(context).enqueue(syncRequest)
```


---

## android-compose

### implementation

# Jetpack Compose Implementation

## Theme Setup (Material 3)

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
```

## State Hoisting & UDF

```kotlin
@Composable
fun FeedScreen(
    viewModel: FeedViewModel = hiltViewModel(),
    onPostClick: (Long) -> Unit
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    FeedContent(state = state, onPostClick = onPostClick)
}

@Composable
fun FeedContent(
    state: FeedUiState,
    onPostClick: (Long) -> Unit
) {
    // Pure UI - No ViewModel references here
    LazyColumn { /* ... */ }
}
```

## Stability & Performance

- Use `@Immutable` or `@Stable` on UI State classes to enable skipping.
- Avoid passing Lists; use `ImmutableList` (Kotlinx Collections Immutable).

## State Hoisting Example

```kotlin
@Composable
fun ProfileScreen(viewModel: ProfileViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    ProfileContent(
        user = uiState.user,
        onEditClick = viewModel::onEditClick  // lambda down
    )
}

@Composable
fun ProfileContent(user: User, onEditClick: () -> Unit) {
    Column { Text(user.name); Button(onClick = onEditClick) { Text("Edit") } }
}
```

## derivedStateOf Usage

```kotlin
val filteredItems by remember {
    derivedStateOf { items.filter { it.isActive } }
}
```

## RIGHT / WRONG Patterns

### State hoisting

```kotlin
// RIGHT — Screen owns ViewModel, Content is stateless
@Composable
fun OrderScreen(viewModel: OrderViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    OrderContent(state = state, onAction = viewModel::onAction)
}

@Composable
fun OrderContent(state: OrderUiState, onAction: (OrderAction) -> Unit) {
    // Pure UI — no ViewModel, no side effects
}
```

```kotlin
// WRONG — ViewModel passed to child Composable
@Composable
fun OrderContent(viewModel: OrderViewModel) {  // <-- Don't do this
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    // Couples UI to ViewModel, prevents Preview, breaks testability
}
```

### Side effects

```kotlin
// RIGHT — LaunchedEffect for one-shot work
@Composable
fun DetailScreen(id: String, viewModel: DetailViewModel = hiltViewModel()) {
    LaunchedEffect(id) {
        viewModel.loadDetail(id)
    }
}
```

```kotlin
// WRONG — side effect in composition body
@Composable
fun DetailScreen(id: String, viewModel: DetailViewModel = hiltViewModel()) {
    viewModel.loadDetail(id)  // <-- Runs on every recomposition!
}
```

### LazyColumn keys

```kotlin
// RIGHT — stable key enables efficient diffing
LazyColumn {
    items(orders, key = { it.id }) { order ->
        OrderItem(order)
    }
}
```

```kotlin
// WRONG — no key causes full recomposition on list changes
LazyColumn {
    items(orders) { order ->  // <-- Missing key
        OrderItem(order)
    }
}
```

### Modifier reuse

```kotlin
// RIGHT — static Modifier declared outside Composable
private val CardModifier = Modifier
    .fillMaxWidth()
    .padding(16.dp)

@Composable
fun OrderCard(order: Order) {
    Card(modifier = CardModifier) { /* content */ }
}
```

```kotlin
// WRONG — Modifier created on every recomposition
@Composable
fun OrderCard(order: Order) {
    Card(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
        // New Modifier allocation every recomposition
    }
}
```


---

## android-compose-migration

### dependency-setup

# Compose Dependency Setup

## Using BOM (recommended)

```kotlin
// build.gradle.kts (app module)
dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2025.06.00")
    implementation(composeBom)

    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.10.1")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

## Enable Compose in build.gradle.kts

```kotlin
android {
    buildFeatures {
        compose = true
    }
    // AGP 8.x — set compose compiler version
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.15"
    }
    // AGP 9 — compose compiler is built-in, remove composeOptions
}
```

## Version catalog (libs.versions.toml)

```toml
[versions]
compose-bom = "2025.06.00"
activity-compose = "1.10.1"

[libraries]
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "compose-bom" }
compose-ui = { group = "androidx.compose.ui", name = "ui" }
compose-material3 = { group = "androidx.compose.material3", name = "material3" }
compose-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activity-compose" }
```


---

### interop-patterns

# Compose Interop Patterns

## View → Composable Mapping

| XML View | Compose Equivalent |
|----------|-------------------|
| `LinearLayout (vertical)` | `Column` |
| `LinearLayout (horizontal)` | `Row` |
| `FrameLayout` | `Box` |
| `ConstraintLayout` | `ConstraintLayout` (Compose) or `Column`/`Row` |
| `RecyclerView` | `LazyColumn` / `LazyRow` |
| `TextView` | `Text` |
| `ImageView` | `Image` or `AsyncImage` (Coil) |
| `Button` | `Button` / `TextButton` / `OutlinedButton` |
| `EditText` | `TextField` / `OutlinedTextField` |

## Adding Compose in Views (ComposeView)

Use when migrating incrementally — host Compose inside an existing Fragment or Activity.

```kotlin
// In a Fragment
class MyFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        return ComposeView(requireContext()).apply {
            setViewCompositionStrategy(
                ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed
            )
            setContent {
                MyAppTheme {
                    MyComposableScreen()
                }
            }
        }
    }
}
```

### Important

- Always set `ViewCompositionStrategy` to avoid memory leaks.
- Use `DisposeOnViewTreeLifecycleDestroyed` for Fragments.
- Use `DisposeOnDetachedFromWindow` for RecyclerView items.

## Adding Views in Compose (AndroidView)

Use when a Compose screen needs a View that has no Compose equivalent yet.

```kotlin
@Composable
fun MapViewComposable(modifier: Modifier = Modifier) {
    AndroidView(
        factory = { context ->
            MapView(context).apply {
                // Initialize the View
            }
        },
        update = { mapView ->
            // Called on recomposition — update the View with new state
        },
        modifier = modifier
    )
}
```

### Important

- `factory` runs once. `update` runs on every recomposition.
- Do NOT create new View instances in `update` — only mutate the existing one.
- For complex Views, consider wrapping in a `remember` block.

## Sharing theme between XML and Compose

```kotlin
// Wrap Compose content with XML theme bridge
setContent {
    // MdcTheme bridges Material Components XML theme to Compose M3
    MdcTheme {
        MyComposableScreen()
    }
}
```

Requires: `com.google.android.material:compose-theme-adapter-3`


---

## android-concurrency

### implementation

# Concurrency Implementation (Coroutines)

## Dispatcher Injection Pattern

```kotlin
// Define Interface
interface DispatcherProvider {
    val main: CoroutineDispatcher
    val io: CoroutineDispatcher
    val default: CoroutineDispatcher
}

// Implementation
class DefaultDispatcherProvider @Inject constructor() : DispatcherProvider {
    override val main: CoroutineDispatcher = Dispatchers.Main
    override val io: CoroutineDispatcher = Dispatchers.IO
    override val default: CoroutineDispatcher = Dispatchers.Default
}

// Usage in ViewModel
@HiltViewModel
class MyViewModel @Inject constructor(
    private val dispatchers: DispatcherProvider
) : ViewModel() {
    fun doWork() {
        viewModelScope.launch(dispatchers.io) {
            // Background work
        }
    }
}
```

## Exception Handling

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    Timber.e(exception, "Coroutine failed")
}

viewModelScope.launch(handler) {
    // Risky code
}
```


---

## android-deployment

### implementation

# Deployment Implementation

## Signing Configuration

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("release.keystore")
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = System.getenv("KEY_ALIAS")
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

## Proguard Rules (`proguard-rules.pro`)

```text
# Retain generic type signatures for JSON serialization
-keepattributes Signature
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}

# Hilt/Dagger
-keep class com.google.dagger.** { *; }
```


---

## android-di

### files

# Hilt Dependency Injection Implementation

## Setup (Application)

```kotlin
@HiltAndroidApp
class MyApplication : Application()
```

## Module Template

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideRetrofit(okHttp: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .client(okHttp)
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
    }
}
```

## Scoping

| Annotation                | Component        | Lifecycle       |
| :------------------------ | :--------------- | :-------------- |
| `@Singleton`              | Application      | Entire App      |
| `@ActivityRetainedScoped` | ActivityRetained | Config Changes  |
| `@ViewModelScoped`        | ViewModel        | Screen Lifetime |

## Interfaces Binding

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindRepo(impl: FeedRepositoryImpl): FeedRepository
}
```

## Bootstrap Example

```kotlin
@HiltAndroidApp
class MyApp : Application()

@AndroidEntryPoint
class MainActivity : ComponentActivity()
```

## Interface Binding (UserRepository)

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindUserRepo(impl: UserRepositoryImpl): UserRepository
}
```


---

## android-edge-to-edge

### inset-patterns

# Edge-to-Edge Inset Patterns

## Scaffold with IME

### RIGHT — contentWindowInsets includes IME

```kotlin
// RIGHT: IME insets flow through innerPadding via contentWindowInsets
Scaffold(contentWindowInsets = WindowInsets.safeDrawing) { innerPadding ->
    Column(
        modifier = Modifier
            .padding(innerPadding)
            .consumeWindowInsets(innerPadding)
            .verticalScroll(rememberScrollState())
    ) { /* Content */ }
}
```

### RIGHT — fitInside ignores contentWindowInsets

```kotlin
// RIGHT: fitInside handles IME regardless of contentWindowInsets
Scaffold { innerPadding ->
    Column(
        modifier = Modifier
            .padding(innerPadding)
            .consumeWindowInsets(innerPadding)
            .fitInside(WindowInsetsRulers.Ime.current)
            .verticalScroll(rememberScrollState())
    ) { /* Content */ }
}
```

### RIGHT — default contentWindowInsets + imePadding

```kotlin
// RIGHT: default contentWindowInsets excludes IME, so imePadding is safe
Scaffold { innerPadding ->
    Column(
        modifier = Modifier
            .padding(innerPadding)
            .consumeWindowInsets(innerPadding)
            .imePadding()
            .verticalScroll(rememberScrollState())
    ) { /* Content */ }
}
```

### WRONG — double IME padding

```kotlin
// WRONG: safeDrawing includes IME insets, and imePadding adds them again
Scaffold(contentWindowInsets = WindowInsets.safeDrawing) { innerPadding ->
    Column(
        modifier = Modifier
            .padding(innerPadding)
            .imePadding()  // <-- Double padding!
            .verticalScroll(rememberScrollState())
    ) { /* Content */ }
}
```

### WRONG — no IME handling at all

```kotlin
// WRONG: default contentWindowInsets excludes IME, and nothing else handles it
Scaffold { innerPadding ->
    Column(
        modifier = Modifier
            .padding(innerPadding)
            .verticalScroll(rememberScrollState())
    ) { /* Content — will be covered by keyboard */ }
}
```

## Without Scaffold

### RIGHT — consumed insets prevent double padding

```kotlin
// RIGHT: safeDrawingPadding consumes insets, so imePadding won't double-apply
Box(modifier = Modifier.safeDrawingPadding()) {
    Column(modifier = Modifier.imePadding()) { /* Content */ }
}
```

### WRONG — unconsumed insets cause double padding

```kotlin
// WRONG: asPaddingValues() does NOT consume insets — imePadding adds them again
Box(modifier = Modifier.padding(WindowInsets.safeDrawing.asPaddingValues())) {
    Column(modifier = Modifier.imePadding()) { /* Content — double padded */ }
}
```

## Lists

### RIGHT — contentPadding on LazyColumn

```kotlin
Scaffold { innerPadding ->
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .consumeWindowInsets(innerPadding),
        contentPadding = innerPadding  // Items scroll behind system bars
    ) { /* items */ }
}
```

### WRONG — parent padding clips scroll

```kotlin
Scaffold { innerPadding ->
    Box(modifier = Modifier.padding(innerPadding)) {  // <-- Clips scroll!
        LazyColumn { /* items cannot scroll behind system bars */ }
    }
}
```

## System bar legibility

For apps using `enableEdgeToEdge` from `WindowCompat` (not `ComponentActivity`):

```kotlin
@Composable
fun MyTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window ?: return@SideEffect
            val controller = WindowCompat.getInsetsController(window, view)
            controller.isAppearanceLightStatusBars = !darkTheme
            controller.isAppearanceLightNavigationBars = !darkTheme
        }
    }
    MaterialTheme(content = content)
}
```


---

## android-legacy-navigation

### implementation

# Legacy Navigation Implementation

## SafeArgs Setup

```kotlin
// build.gradle.kts (Project)
dependencies {
    classpath("androidx.navigation:navigation-safe-args-gradle-plugin:$nav_version")
}

// build.gradle.kts (Module)
plugins {
    id("androidx.navigation.safeargs.kotlin")
}
```

## Navigation Graph (nav_graph.xml)

```xml
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    app:startDestination="@id/homeFragment">

    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.HomeFragment">
        <action
            android:id="@+id/action_home_to_details"
            app:destination="@id/detailsFragment" />
    </fragment>

    <fragment
        android:id="@+id/detailsFragment"
        android:name="com.example.DetailsFragment">
        <argument
            android:name="postId"
            app:argType="string" />
    </fragment>
</navigation>
```

## Navigate with SafeArgs

```kotlin
// Origin
val action = HomeFragmentDirections.actionHomeToDetails(postId = "123")
findNavController().navigate(action)

// Destination
val args: DetailsFragmentArgs by navArgs()
val postId = args.postId
```

## NavHostFragment Layout Setup

```kotlin
// In Activity layout XML
<fragment
    android:id="@+id/nav_host"
    android:name="androidx.navigation.fragment.NavHostFragment"
    app:navGraph="@navigation/nav_main"
    app:defaultNavHost="true" />
```

## Type-Safe Navigation with SafeArgs

```kotlin
// Type-safe navigation — generated by SafeArgs plugin
val action = HomeFragmentDirections.actionHomeToDetail(itemId = 42)
findNavController().navigate(action)

// Receiving args in destination
val args: DetailFragmentArgs by navArgs()
val itemId = args.itemId
```


---

## android-legacy-security

### implementation

# Legacy Security Implementation

## Implicit Intent Verification

Before sending sensitive data or starting an action via implicit intent:

```kotlin
val intent = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Sensitive Data")
}

// Verify a receiver exists AND matches expected signature if possible
if (intent.resolveActivity(packageManager) != null) {
    startActivity(intent)
}

// For receiving intents (Deep Links), verifying sender is hard.
// validate input data strictly.
```

## WebView Hardening

```kotlin
webView.settings.apply {
    javaScriptEnabled = false // Only enable if strictly required
    allowFileAccess = false  // Prevent access to local filesystem
    allowContentAccess = false
}
```

## FileProvider Usage

For sharing files, use `FileProvider` (content://) instead of file://.

```xml
<!-- AndroidManifest.xml -->
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.provider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
</provider>
```

## Restrict Exported Components

```xml
<!-- AndroidManifest.xml — restrict exported components -->
<activity android:name=".InternalActivity" android:exported="false" />
```

## WebView Lockdown (Extended)

```kotlin
webView.settings.apply {
    javaScriptEnabled = false          // enable only when required
    allowFileAccess = false
    allowFileAccessFromFileURLs = false
}
```


---

## android-legacy-state

### implementation

# Legacy State Implementation

## Consuming Flows in Fragments

```kotlin
// In Fragment.onViewCreated
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.uiState.collect { state ->
            // Use ViewBinding to update UI
            binding.progressBar.isVisible = state.isLoading
            binding.errorMsg.text = state.error
        }
    }
}
```

## Migration from LiveData

If you cannot remove LiveData immediately, expose it as Flow to the UI:

```kotlin
// ViewModel
private val _liveData = MutableLiveData<String>()
val flow: Flow<String> = _liveData.asFlow()
```


---

## android-navigation

### navigation-patterns

# Android Navigation Patterns (Jetpack Compose)

## 1. Setup

```kotlin
// build.gradle
dependencies {
    implementation "androidx.navigation:navigation-compose:2.7.6"
}
```

## 2. Type-Safe Routes

```kotlin
sealed class Screen(val route: String) {
    object Home : Screen("home")
    data class Product(val productId: String) : Screen("product/$productId") {
        companion object {
            const val ROUTE = "product/{productId}"
        }
    }
}
```

## 3. Navigation Graph

```kotlin
@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = Screen.Home.route) {
        composable(Screen.Home.route) {
            HomeScreen(onProductClick = { id ->
                navController.navigate(Screen.Product(id).route)
            })
        }
        composable(
            route = Screen.Product.ROUTE,
            arguments = listOf(navArgument("productId") { type = NavType.StringType }),
            deepLinks = listOf(
                navDeepLink { uriPattern = "myapp://product/{productId}" },
                navDeepLink { uriPattern = "https://example.com/product/{productId}" }
            )
        ) { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId")
            ProductScreen(productId = productId ?: ")
        }
    }
}
```

## 4. Deep Linking Configuration

```xml
<!-- AndroidManifest.xml -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" android:host="product" />
    <data android:scheme="https" android:host="example.com" android:pathPrefix="/product" />
</intent-filter>
```

## 5. Bottom Navigation

```kotlin
Scaffold(
    bottomBar = {
        NavigationBar {
            NavigationBarItem(
                selected = currentRoute == "home",
                onClick = { navController.navigate("home") },
                icon = { Icon(Icons.Default.Home, "Home") }
            )
        }
    }
) { padding ->
    NavHost(modifier = Modifier.padding(padding)) { ... }
}
```


---

## android-navigation-3

### migration-guide

# Navigation 2 → Navigation 3 Migration Guide

## Step 1: Add Navigation 3 dependencies

```kotlin
dependencies {
    implementation("androidx.navigation3:navigation3-runtime:1.0.0")
    implementation("androidx.navigation3:navigation3-ui:1.0.0")
}
```

Remove old Navigation 2 dependencies after migration is complete.

## Step 2: Convert string routes to data objects

```kotlin
// BEFORE (Navigation 2)
const val ROUTE_HOME = "home"
const val ROUTE_DETAIL = "detail/{id}"

// AFTER (Navigation 3)
data object RouteHome
data class RouteDetail(val id: String)
```

## Step 3: Replace NavHost with NavDisplay

```kotlin
// BEFORE (Navigation 2)
val navController = rememberNavController()
NavHost(navController = navController, startDestination = "home") {
    composable("home") { HomeScreen(onNavigate = { navController.navigate("detail/$it") }) }
    composable("detail/{id}") { backStackEntry ->
        val id = backStackEntry.arguments?.getString("id")
        DetailScreen(id = id ?: ")
    }
}

// AFTER (Navigation 3)
val backStack = remember { mutableStateListOf<Any>(RouteHome) }
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = { key ->
        when (key) {
            is RouteHome -> NavEntry(key) {
                HomeScreen(onNavigate = { id -> backStack.add(RouteDetail(id)) })
            }
            is RouteDetail -> NavEntry(key) {
                DetailScreen(id = key.id)
            }
            else -> error("Unknown route: $key")
        }
    }
)
```

## Step 4: Replace navigation calls

```kotlin
// BEFORE
navController.navigate("detail/$id")
navController.popBackStack()
navController.navigate("home") { popUpTo("home") { inclusive = true } }

// AFTER
backStack.add(RouteDetail(id))
backStack.removeLastOrNull()
backStack.clear(); backStack.add(RouteHome)
```

## Step 5: Migrate deep links

```kotlin
// BEFORE (Navigation 2) — declared in NavHost
composable(
    "detail/{id}",
    deepLinks = listOf(navDeepLink { uriPattern = "app://detail/{id}" })
) { /* ... */ }

// AFTER (Navigation 3) — handle in Activity, convert to route
override fun onCreate(savedInstanceState: Bundle?) {
    val deepLinkId = intent?.data?.getQueryParameter("id")
    if (deepLinkId != null) {
        backStack.add(RouteDetail(deepLinkId))
    }
}
```

## Step 6: Migrate SavedStateHandle

```kotlin
// Navigation 3 routes are data classes — pass them directly to ViewModel
class DetailViewModel(val route: RouteDetail) : ViewModel() {
    val id = route.id  // No SavedStateHandle needed for navigation args
}
```

## Key differences summary

| Aspect | Navigation 2 | Navigation 3 |
|--------|-------------|-------------|
| Routes | Strings (`"detail/{id}"`) | Data objects/classes (`RouteDetail(id)`) |
| Back stack | Internal to NavController | `mutableStateListOf<Any>` (you own it) |
| Entry point | `NavHost` | `NavDisplay` |
| Navigation | `navController.navigate()` | `backStack.add()` |
| Arguments | `navArgument` + `backStackEntry` | Data class properties |
| Deep links | Declared in NavHost | Parsed in Activity/Composable |


---

### recipes

# Navigation 3 Recipes

## Bottom navigation with multiple backstacks

```kotlin
@Composable
fun MainScreen() {
    val tabs = listOf(Tab.Home, Tab.Search, Tab.Profile)
    var selectedTab by remember { mutableStateOf(Tab.Home) }
    val backstacks = remember {
        tabs.associateWith { mutableStateListOf<Any>(it.startRoute) }
    }

    Scaffold(
        bottomBar = {
            NavigationBar {
                tabs.forEach { tab ->
                    NavigationBarItem(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        icon = { Icon(tab.icon, contentDescription = tab.label) },
                        label = { Text(tab.label) }
                    )
                }
            }
        }
    ) { innerPadding ->
        val currentBackStack = backstacks[selectedTab]!!
        NavDisplay(
            backStack = currentBackStack,
            onBack = { currentBackStack.removeLastOrNull() },
            modifier = Modifier.padding(innerPadding),
            entryProvider = { key -> /* route entries */ }
        )
    }
}
```

## Dialog destination

```kotlin
// Define a dialog route
data class ConfirmDeleteDialog(val itemId: String)

// In entryProvider, use NavEntry with scene
entryProvider = { key ->
    when (key) {
        is ConfirmDeleteDialog -> NavEntry(
            key = key,
            scene = DialogScene,  // Built-in dialog scene
        ) {
            AlertDialog(
                onDismissRequest = { backStack.removeLastOrNull() },
                title = { Text("Delete?") },
                confirmButton = {
                    TextButton(onClick = {
                        deleteItem(key.itemId)
                        backStack.removeLastOrNull()
                    }) { Text("Delete") }
                }
            )
        }
        // ... other routes
    }
}

// Navigate to dialog
backStack.add(ConfirmDeleteDialog(itemId = "123"))
```

## Conditional navigation (auth flow)

```kotlin
@Composable
fun AppNavigation(isLoggedIn: Boolean) {
    val backStack = remember(isLoggedIn) {
        mutableStateListOf<Any>(
            if (isLoggedIn) RouteHome else RouteLogin
        )
    }

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = { key ->
            when (key) {
                is RouteLogin -> NavEntry(key) {
                    LoginScreen(onLoginSuccess = {
                        backStack.clear()
                        backStack.add(RouteHome)
                    })
                }
                is RouteHome -> NavEntry(key) { HomeScreen() }
                else -> error("Unknown: $key")
            }
        }
    )
}
```

## Returning results between screens

```kotlin
// Using state hoisting — parent owns the result
@Composable
fun ParentNavigation() {
    var selectedColor by remember { mutableStateOf<Color?>(null) }
    val backStack = remember { mutableStateListOf<Any>(RouteSettings) }

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = { key ->
            when (key) {
                is RouteSettings -> NavEntry(key) {
                    SettingsScreen(
                        currentColor = selectedColor,
                        onPickColor = { backStack.add(RouteColorPicker) }
                    )
                }
                is RouteColorPicker -> NavEntry(key) {
                    ColorPickerScreen(onColorSelected = { color ->
                        selectedColor = color
                        backStack.removeLastOrNull()
                    })
                }
                else -> error("Unknown: $key")
            }
        }
    )
}
```

## Saveable backstack (survives process death)

```kotlin
val backStack = rememberMutableStateListOf<Any>(RouteHome)

// rememberMutableStateListOf persists across config changes and process death
// Routes must be Parcelable or @Serializable
```


---

## android-navigation-type-safe

### implementation

# Type-Safe Navigation (Compose)

## Route Definitions

```kotlin
@Serializable
sealed interface Screen {
    @Serializable
    data object Home : Screen

    @Serializable
    data class Details(val id: String) : Screen
}
```

## NavHost Setup

```kotlin
@Composable
fun AppNavHost(
    navController: NavHostController = rememberNavController()
) {
    NavHost(navController = navController, startDestination = Screen.Home) {
        composable<Screen.Home> {
            HomeScreen(onNavigateToDetails = { id ->
                navController.navigate(Screen.Details(id))
            })
        }

        composable<Screen.Details> { backStackEntry ->
            val route: Screen.Details = backStackEntry.toRoute()
            DetailsScreen(id = route.id)
        }
    }
}
```


---

## android-networking

### implementation

# Networking Implementation (Retrofit + OkHttp)

## Retrofit Setup

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(
        okHttp: OkHttpClient,
        json: Json
    ): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_URL)
            .client(okHttp)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) Level.BODY else Level.NONE
            })
            .build()
    }
}
```

## Result Wrapper

```kotlin
sealed interface NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>
    data class Error(val code: Int, val message: String?) : NetworkResult<Nothing>
    data class Exception(val e: Throwable) : NetworkResult<Nothing>
}
```

## DTO with Kotlinx Serialization

```kotlin
@Serializable
data class UserDto(
    @SerialName("user_id") val userId: String,
    @SerialName("display_name") val displayName: String
)
```

## API Endpoint Interface

```kotlin
interface UserApi {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): UserDto

    @POST("users")
    suspend fun createUser(@Body request: CreateUserRequest): UserDto
}
```


---

## android-notifications

### implementation

# Android Notification Implementation

## 1. Setup

```kotlin
// build.gradle (app)
dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging-ktx'
}
```

## 2. Firebase Messaging Service

```kotlin
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        // Send to backend
    }

    override fun onMessageReceived(message: RemoteMessage) {
        message.notification?.let {
            showNotification(it.title, it.body, message.data)
        }
    }

    private fun showNotification(title: String?, body: String?, data: Map<String, String>) {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            putExtra("type", data["type"])
            putExtra("id", data["id"])
        }
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)

        val notification = NotificationCompat.Builder(this, "default")
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(this).notify(1, notification)
    }
}
```

## 3. Manifest Declaration

```xml
<service android:name=".MyFirebaseMessagingService" android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

## 4. Channels & Permissions (Android 13+)

```kotlin
// Create Channel (Android 8+)
fun createNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel("default", "Notifications", NotificationManager.IMPORTANCE_HIGH)
        context.getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }
}

// Request Permission (Android 13+)
val requestPermissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted -> }

fun requestNotificationPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
         if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
             requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
         }
    }
}
```

## 5. Handle Taps

```kotlin
override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    val type = intent?.getStringExtra("type")
    if (type == "order") { /* Navigate */ }
}
```

## 6. Priming

```kotlin
fun primePermission(context: Context) {
    AlertDialog.Builder(context)
        .setTitle("Enable Notifications?")
        .setPositiveButton("Yes") { _, _ -> requestNotificationPermission() }
        .show()
}
```


---

## android-performance

### implementation

# Performance Optimization

## Baseline Profiles

1. Create `:benchmark` module.
2. Define `BaselineProfileGenerator`.

```kotlin
@OptIn(ExperimentalBaselineProfilesApi::class)
class BaselineProfileGenerator {
    @get:Rule
    val rule = BaselineProfileRule()

    @Test
    fun generate() {
        rule.collect(packageName = "com.example.app") {
            pressHome()
            startActivityAndWait()
            // Scroll critical lists
        }
    }
}
```

## App Startup (Jetpack Startup)

```kotlin
class TimberInitializer : Initializer<Unit> {
    override fun create(context: Context) {
        if (BuildConfig.DEBUG) Timber.plant(Timber.DebugTree())
    }

    override fun dependencies(): List<Class<out Initializer<*>>> = emptyList()
}
```

## JankStats

Monitor UI frames dropping below 60fps. Use `JankStats` library to intercept frame metrics in your Activity.

## Lazy Singleton Pattern

```kotlin
// Lazy singleton — defers initialization until first access
val analytics: Analytics by lazy { Analytics.create(appContext) }
```

## LazyColumn with Stable Keys

```kotlin
LazyColumn {
    items(users, key = { it.id }) { user ->
        UserRow(user)
    }
}
```


---

## android-persistence

### implementation

# Persistence Implementation (Room)

## Database Setup

```kotlin
@Database(entities = [PostEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dao(): FeedDao
}
```

## DAO (Coroutines)

```kotlin
@Dao
interface FeedDao {
    @Query("SELECT * FROM posts")
    fun getAll(): Flow<List<PostEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(posts: List<PostEntity>)
}
```

## Type Converters (e.g., Dates)

```kotlin
class DateConverter {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? = value?.let { Date(it) }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? = date?.time
}
```

## UserDao with Transactions

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE active = 1")
    fun observeActiveUsers(): Flow<List<UserEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(user: UserEntity)

    @Transaction
    @Query("SELECT * FROM users WHERE id = :userId")
    fun getUserWithPosts(userId: String): Flow<UserWithPosts>
}
```

## DataStore Migration

```kotlin
val Context.settingsDataStore by preferencesDataStore(name = "settings")

// Read
val darkMode: Flow<Boolean> = settingsDataStore.data
    .map { prefs -> prefs[DARK_MODE_KEY] ?: false }
```


---

## android-resources

### implementation

# Resources & Localization

## Strings (`strings.xml`)

```xml
<resources>
    <!-- Screen Prefixes: home_, profile_ -->
    <string name="home_title">Home Feed</string>
    <string name="home_welcome_user">Welcome, %s!</string>

    <!-- Plurals -->
    <plurals name="posts_count">
        <item quantity="one">%d Post</item>
        <item quantity="other">%d Posts</item>
    </plurals>
</resources>
```

## Compose Usage

```kotlin
Text(text = stringResource(R.string.home_title))
Text(text = stringResource(R.string.home_welcome_user, username))
Text(text = pluralStringResource(R.plurals.posts_count, count, count))
```

## Vector Assets

- Use SVG/XML Vectors instead of PNG/JPG where possible (smaller size, infinite scaling).
- Avoid complex paths in Vectors (parsing performance).


---

## android-security

### implementation

# Security Implementation

## EncryptedSharedPreferences

```kotlin
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val sharedPreferences = EncryptedSharedPreferences.create(
    context,
    "secret_shared_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
```

## Network Security Config (`res/xml/network_security_config.xml`)

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Disallow Cleartext (HTTP) -->
    <base-config cleartextTrafficPermitted="false" />

    <!-- Pinning (Optional) -->
    <domain-config>
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set expiration="2026-01-01">
            <pin digest="SHA-256">7HIpactkIAq2Y49orFOOQKurWxmmSFZhBCoQYcRhJ3Y=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```


---

## android-state

### implementation

# State Management Implementation

## Safe ViewModel Template

```kotlin
@HiltViewModel
class FeedViewModel @Inject constructor(
    private val getFeedUseCase: GetFeedUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<FeedUiState>(FeedUiState.Loading)
    val uiState = _uiState.asStateFlow()

    init {
        loadFeed()
    }

    fun loadFeed() {
        viewModelScope.launch {
            getFeedUseCase()
               .onStart { _uiState.value = FeedUiState.Loading }
               .catch { _uiState.value = FeedUiState.Error(it.message) }
               .collect { _uiState.value = FeedUiState.Success(it) }
        }
    }
}
```

## UI State Contract

```kotlin
@Immutable
sealed interface FeedUiState {
    data object Loading : FeedUiState
    data class Success(val items: ImmutableList<Post>) : FeedUiState
    data class Error(val msg: String?) : FeedUiState
}
```

## One-Time Events (Anti-Pattern Fix)

Do not use `SharedFlow` for Navigation. Use State (`navTarget`) inside UiState and consume it in the UI (handle & reset).

## ProfileViewModel Example

```kotlin
class ProfileViewModel @Inject constructor(
    private val getUserUseCase: GetUserUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            _uiState.value = try {
                UiState.Content(getUserUseCase())
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}
```

## Sealed UiState (LCE Pattern)

```kotlin
sealed interface UiState {
    data object Loading : UiState
    @Immutable data class Content(val user: User) : UiState
    data class Error(val message: String) : UiState
}
```


---

## android-testing

### implementation

# Testing Implementation

## Unit Tests (Coroutines)

```kotlin
class MainDispatcherRule(
    val testDispatcher: TestDispatcher = UnconfinedTestDispatcher()
) : TestWatcher() {
    override fun starting(description: Description) {
        Dispatchers.setMain(testDispatcher)
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}

class MyViewModelTest {
    @get:Rule val mainDispatcher = MainDispatcherRule()

    @Test
    fun `load data updates state`() = runTest {
        // Test setup
    }
}
```

## Compose UI Tests

```kotlin
@HiltAndroidTest
class FeedScreenTest {
    @get:Rule(order = 0)
    val hiltRule = HiltAndroidRule(this)

    @get:Rule(order = 1)
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun showLoading_whenStateIsLoading() {
        // Setup state
        composeRule.onNodeWithTag("loading_spinner").assertIsDisplayed()
    }
}
```


---

## android-tooling

### implementation

# Tooling Setup

## Detekt Config (`detekt.yml`)

```yaml
build:
  maxIssues: 0
  weights:
    complexity: 2

complexity:
  LongMethod:
    threshold: 50
  LongParameterList:
    functionThreshold: 5
    constructorThreshold: 10
```

## Gradle Setup (build.gradle.kts)

```kotlin
plugins {
    id("io.gitlab.arturbosch.detekt") version "1.23.1"
}

detekt {
    buildUponDefaultConfig = true
    config.setFrom(files("$projectDir/config/detekt/detekt.yml"))
}

tasks.withType<Detekt>().configureEach {
    reports {
        html.required.set(true)
        xml.required.set(false)
        txt.required.set(false)
    }
}
```

## Git Hook (pre-commit)

```bash
#!/bin/sh
echo "Running static analysis..."
./gradlew detekt ktlintCheck
```


---

## android-xml-views

### implementation

# XML Views Implementation

## ViewBinding Setup

```kotlin
// build.gradle.kts
android {
    buildFeatures {
        viewBinding = true
    }
}

// Fragment Usage
class HomeFragment : Fragment(R.layout.fragment_home) {
    private val binding by viewBinding(FragmentHomeBinding::bind)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.titleText.text = "Hello"
    }
}
```

## RecyclerView (ListAdapter)

```kotlin
class PostAdapter(
    private val onClick: (Post) -> Unit
) : ListAdapter<Post, PostAdapter.ViewHolder>(PostDiffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemPostBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = getItem(position)
        holder.bind(item)
    }

    inner class ViewHolder(val binding: ItemPostBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Post) {
            binding.title.text = item.title
            binding.root.setOnClickListener { onClick(item) }
        }
    }
}

object PostDiffCallback : DiffUtil.ItemCallback<Post>() {
    override fun areItemsTheSame(oldItem: Post, newItem: Post) = oldItem.id == newItem.id
    override fun areContentsTheSame(oldItem: Post, newItem: Post) = oldItem == newItem
}
```


---

