---
inclusion: manual
---

# References: swift

> 8 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-swift.md`.

## swift-best-practices

### implementation

# Swift Best Practices Implementation

## Guard for Early Exit

```swift
// ✅ GOOD: Guard pattern
func processPayment(amount: Double?, user: User?) throws {
    guard let amount = amount, amount > 0 else {
        throw PaymentError.invalidAmount
    }
    guard let user = user else {
        throw PaymentError.missingUser
    }

    // Main logic remains flat
    chargeUser(user, amount: amount)
}
```

```swift
// ❌ AVOID: Nested if
func processPayment(amount: Double?, user: User?) throws {
    if let amount = amount {
        if amount > 0 {
            if let user = user {
                chargeUser(user, amount: amount)
            } else {
                throw PaymentError.missingUser
            }
        } else {
            throw PaymentError.invalidAmount
        }
    } else {
        throw PaymentError.invalidAmount
    }
}
```

## for-where Loops

```swift
// ✅ GOOD
for item in items where item.isActive {
    process(item)
}

// ❌ AVOID
for item in items {
    if item.isActive {
        process(item)
    }
}
```

## Value Types & Immutability

```swift
// ✅ GOOD: Immutable struct
struct User {
    let id: String
    let name: String

    func withName(_ newName: String) -> User {
        return User(id: id, name: newName)
    }
}

// ❌ AVOID: Mutable class
class User {
    var id: String
    var name: String
}
```

## Exhaustive Switch

```swift
enum Result {
    case success(Data)
    case failure(Error)
}

// ✅ GOOD
func handle(_ result: Result) {
    switch result {
    case .success(let data):
        process(data)
    case .failure(let error):
        log(error)
    }
}
```


---

## swift-concurrency

### implementation

# Swift Concurrency Implementation

## async/await Basics

```swift
// ✅ GOOD: Async function
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Usage
Task {
    do {
        let user = try await fetchUser(id: "123")
        print(user.name)
    } catch {
        print("Error: \(error)")
    }
}
```

```swift
// ❌ AVOID: Completion handlers (legacy)
func fetchUser(id: String, completion: @escaping (Result<User, Error>) -> Void) {
    // Old pattern
}
```

## Actors for Thread Safety

```swift
// ✅ GOOD: Actor protects state
actor Counter {
    private var value = 0

    func increment() {
        value += 1
    }

    func getValue() -> Int {
        return value
    }
}

// Usage (automatically serialized)
let counter = Counter()
await counter.increment()
let value = await counter.getValue()
```

## MainActor for UI

```swift
// ✅ GOOD: MainActor annotation
@MainActor
class ViewModel: ObservableObject {
    @Published var users: [User] = []

    func loadUsers() async {
        do {
            let users = try await api.fetchUsers()
            self.users = users // Safe: already on main thread
        } catch {
            print("Error: \(error)")
        }
    }
}
```

## Task Groups

```swift
// ✅ GOOD: Parallel fetching
func loadAllData() async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in userIDs {
            group.addTask {
                try await fetchUser(id: id)
            }
        }

        var users: [User] = []
        for try await user in group {
            users.append(user)
        }
        return users
    }
}
```

## Cancellation

```swift
// ✅ GOOD: Check cancellation
func processLargeDataset() async throws {
    for item in dataset {
        try Task.checkCancellation() // Throws if cancelled
        await process(item)
    }
}
```

## Parallel Fetch with async let

```swift
// Parallel fetch with async let
func loadDashboard() async throws -> Dashboard {
    async let profile = fetchProfile()
    async let orders = fetchRecentOrders()
    async let notifications = fetchNotifications()

    return try await Dashboard(
        profile: profile,
        orders: orders,
        notifications: notifications
    )
}
```

## Actor for Shared State

```swift
actor ImageCache {
    private var cache: [URL: UIImage] = [:]

    func image(for url: URL) -> UIImage? { cache[url] }
    func store(_ image: UIImage, for url: URL) { cache[url] = image }

    nonisolated func cacheKey(for url: URL) -> String { url.absoluteString }
}
```


---

## swift-error-handling

### implementation

# Error Handling Implementation

## Custom Error Types

```swift
// ✅ GOOD: Typed errors
enum NetworkError: Error {
    case invalidURL
    case timeout
    case serverError(statusCode: Int)
}

func fetchData(from url: String) throws -> Data {
    guard let url = URL(string: url) else {
        throw NetworkError.invalidURL
    }
    // ...
}
```

## Do-Catch Patterns

```swift
// ✅ GOOD: Specific error handling
do {
    let data = try fetchData(from: urlString)
    process(data)
} catch NetworkError.timeout {
    retryLater()
} catch NetworkError.serverError(let code) {
    log("Server error: \(code)")
} catch {
    log("Unexpected error: \(error)")
}

// ❌ AVOID: Force try
let data = try! fetchData(from: urlString) // Crashes on error
```

## Result Type

```swift
// ✅ GOOD: Result for callbacks
func loadUser(completion: @escaping (Result<User, Error>) -> Void) {
    api.fetch { response in
        if let user = response.user {
            completion(.success(user))
        } else {
            completion(.failure(response.error))
        }
    }
}

// Usage
loadUser { result in
    switch result {
    case .success(let user):
        display(user)
    case .failure(let error):
        handle(error)
    }
}

// Transform
let nameResult = userResult.map { $0.name }
```

## Never Type

```swift
// ✅ GOOD: Never for unreachable code
func fatalConfiguration() -> Never {
    fatalError("Configuration error")
}

// Guards against invalid state
func process(_ value: Int) {
    guard value >= 0 else {
        fatalConfiguration()
    }
    // Compiler knows value >= 0 here
}
```

## Custom Error with LocalizedError

```swift
enum NetworkError: Error, LocalizedError {
    case connectionLost
    case unauthorized(statusCode: Int)

    var errorDescription: String? {
        switch self {
        case .connectionLost: return "Connection lost"
        case .unauthorized(let code): return "Unauthorized (\(code))"
        }
    }
}

func fetchUser(id: String) async throws -> User {
    guard !id.isEmpty else { throw NetworkError.unauthorized(statusCode: 401) }
    // ...
}

do {
    let user = try await fetchUser(id: "123")
} catch let error as NetworkError {
    logger.error("Network error: \(error.localizedDescription)")
} catch {
    logger.error("Unexpected: \(error)")
}
```


---

## swift-language

### implementation

# Swift Language Implementation

## Optional Unwrapping Patterns

### Safe Unwrapping

```swift
// ✅ GOOD: Guard for early exit
func process(user: User?) {
    guard let user = user else { return }
    print(user.name)
}

// ✅ GOOD: If-let for scoped usage
if let name = user?.name {
    print("Hello, \(name)")
}

// ✅ GOOD: Nil coalescing
let displayName = user?.name ?? "Guest"
```

```swift
// ❌ AVOID: Force unwrapping
let name = user!.name // Crashes if nil

// ❌ AVOID: Implicitly unwrapped
var user: User! = nil
```

## Protocol-Oriented Programming

```swift
// ✅ GOOD: Protocol + Extension
protocol Identifiable {
    var id: String { get }
}

extension Identifiable {
    func validate() -> Bool {
        return !id.isEmpty
    }
}

struct User: Identifiable {
    let id: String
    let name: String
}
```

## Enums with Associated Values

```swift
// ✅ GOOD: Enum for state
enum LoadingState<T> {
    case idle
    case loading
    case success(T)
    case failure(Error)
}

// ❌ AVOID: Multiple optionals
struct LoadingState {
    var isLoading: Bool?
    var data: Data?
    var error: Error?
}
```

## Generics & Type Constraints

```swift
// ✅ GOOD: Generic with constraints
func findFirst<T: Equatable>(in array: [T], matching item: T) -> Int? {
    return array.firstIndex(of: item)
}

// Protocol with associated type
protocol Container {
    associatedtype Item
    var items: [Item] { get }
}
```


---

## swift-memory-management

### implementation

# Memory Management Implementation

## Weak vs Unowned

```swift
// ✅ GOOD: Weak for delegates
protocol DataSourceDelegate: AnyObject {
    func didUpdate()
}

class DataSource {
    weak var delegate: DataSourceDelegate?
}

// ✅ GOOD: Weak in closures
class ViewController {
    var onComplete: (() -> Void)?

    func loadData() {
        api.fetch { [weak self] result in
            guard let self = self else { return }
            self.handle(result)
        }
    }
}
```

```swift
// ❌ AVOID: Strong delegate (retain cycle)
class DataSource {
    var delegate: DataSourceDelegate? // Strong!
}

// ❌ AVOID: No capture list
func loadData() {
    api.fetch { result in
        self.handle(result) // Retain cycle if closure stored
    }
}
```

## Common Retain Cycles

### Parent-Child

```swift
class Parent {
    var child: Child?
}

class Child {
    weak var parent: Parent? // ✅ Must be weak
}
```

### Closure Property

```swift
class Service {
    var completion: (() -> Void)?

    func execute() {
        completion = { [weak self] in
            self?.finish() // ✅ Weak prevents cycle
        }
    }
}
```

## Debugging Memory Issues

```swift
class TrackedObject {
    deinit {
        print("TrackedObject deallocated") // Verify deallocation
    }
}
```

Use Xcode Instruments (Leaks, Allocations) to detect retain cycles.


---

## swift-swiftui

### implementation

# SwiftUI Implementation

## State Property Wrappers

```swift
// ✅ GOOD: @State for local UI state
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("Count: \(count)")
            Button("Increment") {
                count += 1
            }
        }
    }
}

// ✅ GOOD: @Binding for child view
struct CounterButton: View {
    @Binding var count: Int

    var body: some View {
        Button("Increment") {
            count += 1
        }
    }
}

// Usage
CounterButton(count: $count) // $ for binding
```

## Observable Objects

```swift
// ✅ GOOD: @StateObject for ownership
class ViewModel: ObservableObject {
    @Published var users: [User] = []

    func loadUsers() async {
        users = try await api.fetchUsers()
    }
}

struct UserListView: View {
    @StateObject private var viewModel = ViewModel()

    var body: some View {
        List(viewModel.users) { user in
            Text(user.name)
        }
        .task {
            await viewModel.loadUsers()
        }
    }
}
```

```swift
// ❌ AVOID: @ObservedObject for owned object
struct UserListView: View {
    @ObservedObject var viewModel = ViewModel() // Re-created on re-render!
}
```

## View Composition

```swift
// ✅ GOOD: Extract subviews
struct ProfileView: View {
    let user: User

    var body: some View {
        VStack {
            ProfileHeader(user: user)
            ProfileDetails(user: user)
        }
    }
}

struct ProfileHeader: View {
    let user: User

    var body: some View {
        HStack {
            AsyncImage(url: user.avatarURL)
            Text(user.name)
                .font(.title)
        }
    }
}
```

## Custom View Modifiers

```swift
// ✅ GOOD: Reusable modifier
struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(8)
            .shadow(radius: 2)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}

// Usage
Text("Hello").cardStyle()
```


---

## swift-testing

### implementation

# Swift Testing Implementation

## Standard Unit Test

```swift
import XCTest
@testable import MyModule

final class UserServiceTests: XCTestCase {
    var sut: UserService!
    var mockRepository: MockUserRepository!

    override func setUpWithError() throws {
        mockRepository = MockUserRepository()
        sut = UserService(repository: mockRepository)
    }

    override func tearDownWithError() throws {
        sut = nil
        mockRepository = nil
    }

    func testFetchUser_Success() async throws {
        // Given
        let expectedUser = User(id: "1", name: "Test")
        mockRepository.stubbedUser = expectedUser

        // When
        let user = try await sut.fetchUser(id: "1")

        // Then
        XCTAssertEqual(user.id, "1")
        XCTAssertEqual(user.name, "Test")
    }
}
```

## Async Expectations (Legacy Support)

```swift
func testCompletionHandlerAsync() {
    let expectation = XCTestExpectation(description: 'Completion handler called")

    sut.doAsyncWork { result in
        XCTAssertTrue(result)
        expectation.fulfill()
    }

    wait(for: [expectation], timeout: 2.0)
}
```

## UI Testing Basics

```swift
func testLoginFlow() throws {
    let app = XCUIApplication()
    app.launch()

    let loginTextField = app.textFields["login_field"]
    XCTAssertTrue(loginTextField.exists)

    loginTextField.tap()
    loginTextField.typeText("username")

    app.buttons["submit_button"].tap()

    XCTAssertTrue(app.staticTexts["welcome_message"].exists)
}
```

## Order Service Test with Async

```swift
final class OrderServiceTests: XCTestCase {
    private var sut: OrderService!
    private var mockRepo: MockOrderRepository!

    override func setUpWithError() throws {
        mockRepo = MockOrderRepository()
        sut = OrderService(repository: mockRepo)
    }

    func testCreateOrderReturnsCorrectTotal() throws {
        let order = try sut.createOrder(items: [.init(name: "Widget", price: 9.99, qty: 3)])
        XCTAssertEqual(order.total, 29.97, accuracy: 0.01)
        XCTAssertEqual(mockRepo.savedOrders.count, 1)
    }

    func testFetchOrderAsync() async throws {
        mockRepo.stubbedOrder = Order(id: "abc", total: 42.0)
        let order = try await sut.fetchOrder(id: "abc")
        XCTAssertEqual(order.total, 42.0)
    }
}
```


---

## swift-tooling

### implementation

# Swift Tooling Implementation

## Package.swift Structure

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MyNetworkLibrary",
    platforms: [.iOS(.v15), .macOS(.v12)],
    products: [
        .library(name: "MyNetworkLibrary", targets: ["MyNetworkLibrary"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire.git", .upToNextMajor(from: "5.0.0"))
    ],
    targets: [
        .target(
            name: "MyNetworkLibrary",
            dependencies: ["Alamofire"]
        ),
        .testTarget(
            name: "MyNetworkLibraryTests",
            dependencies: ["MyNetworkLibrary"]
        ),
    ]
)
```

## SwiftLint Config (.swiftlint.yml)

```yaml
disabled_rules:
  - trailing_whitespace
opt_in_rules:
  - empty_count
  - force_unwrapping
  - vertical_whitespace_closing_braces

line_length: 80
identifier_name:
  min_length: 3
  max_length: 40
```

## Environment Specific Code

```swift
func getBaseURL() -> String {
    #if DEBUG
    return "https://staging-api.example.com"
    #else
    return "https://api.example.com"
    #endif
}
```

## Package.swift with Composable Architecture

```swift
// Package.swift
let package = Package(
    name: "MyFeature",
    platforms: [.iOS(.v16)],
    products: [
        .library(name: "MyFeature", targets: ["MyFeature"]),
    ],
    dependencies: [
        .package(url: "https://github.com/pointfreeco/swift-composable-architecture", from: "1.0.0"),
    ],
    targets: [
        .target(name: "MyFeature", dependencies: [
            .product(name: "ComposableArchitecture", package: "swift-composable-architecture"),
        ]),
        .testTarget(name: "MyFeatureTests", dependencies: ["MyFeature"]),
    ]
)
```


---

