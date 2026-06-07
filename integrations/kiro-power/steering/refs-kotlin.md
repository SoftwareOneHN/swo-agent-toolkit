---
inclusion: manual
---

# References: kotlin

> 4 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-kotlin.md`.

## kotlin-best-practices

### example

# Kotlin Best Practices — Examples

## Backing Property Pattern

```kotlin
class ProductViewModel : ViewModel() {
    // Private mutable — internal mutations only
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    // Public immutable — exposed to UI
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()
}
```

## Scope Functions — Correct Usage

```kotlin
// apply: configure an object (returns object)
val request = HttpRequest().apply {
    method = "POST"
    timeout = 30_000
    headers["Authorization"] = "Bearer $token"
}

// let: null-safe transformation (returns result)
val uppercased = name?.let { it.uppercase() } ?: "ANONYMOUS"

// also: side effect without breaking chain (returns object)
val user = userRepo.findById(id)
    .also { logger.info("Fetched user: ${it?.id}") }

// run: scoped computation (returns result)
val summary = user.run {
    "${name} has ${orders.size} orders totalling ${orders.sumOf { it.total }}"
}
```

## Read-Only Collection Exposure

```kotlin
class CartRepository {
    // Internal mutable, external read-only
    private val _items = mutableListOf<CartItem>()
    val items: List<CartItem> get() = _items

    fun add(item: CartItem) {
        _items.add(item)
    }
}
```

## runCatching for Error Handling

```kotlin
fun fetchUser(id: String): Result<User> = runCatching {
    api.getUser(id)
}.onFailure { e ->
    logger.error("Failed to fetch user $id", e)
}
```


---

## kotlin-coroutines

### advanced-patterns

# Kotlin Advanced Coroutines & Flow

## ViewModel Implementation Pattern

Standard pattern for combining Structured Concurrency with StateFlow in Android/General ViewModels.

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class UserViewModel(
    private val repo: UserRepository,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadUser(userId: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading

            // withContext for main-safety
            val result = runCatching {
                withContext(dispatcher) {
                    repo.fetchUser(userId)
                }
            }

            result.onSuccess { user ->
                _uiState.value = UiState.Success(user)
            }.onFailure { e ->
                _uiState.value = UiState.Error(e.message ?: "Unknown Error")
            }
        }
    }
}
```

## Parallel Execution with Async

Only use `async` when multiple independent sources need to be fetched.

```kotlin
suspend fun fetchDashboardData() = coroutineScope {
    val user = async { repo.fetchUser() }
    val orders = async { repo.fetchOrders() }

    DashboardData(user.await(), orders.await())
}
```


---

## kotlin-language

### example

# Kotlin Language — Examples

## Sealed Interface + When Expression

```kotlin
sealed interface UiState {
    data object Loading : UiState
    data class Success(val data: List<Product>) : UiState
    data class Error(val message: String) : UiState
}

// Exhaustive — compiler enforces all branches
fun render(state: UiState) = when (state) {
    UiState.Loading -> showLoading()
    is UiState.Success -> showData(state.data)   // Smart cast
    is UiState.Error -> showError(state.message)
}
```

## Null Safety

```kotlin
// Safe call + Elvis — preferred over !!
val city: String = user?.address?.city ?: "Unknown"

// requireNotNull for internal assertions
fun process(input: String?) {
    val value = requireNotNull(input) { "input must not be null" }
    // value is non-null String here
}

// Never use !! in production
// BAD: user!!.address!!.city  → NullPointerException at runtime
```

## Extension Functions

```kotlin
// Keep private if module-specific
private fun String.toSlug(): String =
    this.lowercase().trim().replace(Regex("[^a-z0-9]+"), "-")

// Extension on nullable type
fun String?.orDefault(default: String) = this?.takeIf { it.isNotBlank() } ?: default
```

## data class for DTOs

```kotlin
data class ProductDto(
    val id: String,
    val name: String,
    val price: Double,
    val category: String
) {
    // Named arguments prevent parameter order mistakes
    companion object {
        fun from(product: Product) = ProductDto(
            id = product.id,
            name = product.name,
            price = product.price,
            category = product.category.name
        )
    }
}
```


---

## kotlin-tooling

### testing-tooling

# Kotlin Testing & MockK Reference

## MockK Advanced Usage

First-class Kotlin mocking library patterns.

```kotlin
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import io.mockk.coEvery
import io.mockk.coVerify
import org.junit.jupiter.api.Test

class UserServiceTest {
    private val repo = mockk<UserRepository>()
    private val service = UserService(repo)

    @Test
    fun `should fetch user successfully`() {
        // Arrange
        val expectedUser = User(id = "1", name = "Test")
        every { repo.getUser("1") } returns expectedUser

        // Act
        val result = service.findUser("1")

        // Assert
        assertThat(result).isEqualTo(expectedUser)
        verify(exactly = 1) { repo.getUser("1") }
    }

    @Test
    fun `should handle suspending calls`() = runTest {
        // Arrange
        coEvery { repo.fetchRemoteData() } returns "Data"

        // Act
        service.sync()

        // Assert
        coVerify { repo.fetchRemoteData() }
    }
}
```

## Gradle Version Catalog (libs.versions.toml)

```toml
[versions]
kotlin = "1.9.22"
mockk = "1.13.9"

[libraries]
kotlin-stdlib = { group = "org.jetbrains.kotlin", name = "kotlin-stdlib", version.ref = "kotlin" }
test-mockk = { group = "io.mockk", name = "mockk", version.ref = "mockk" }

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
```


---

