---
inclusion: manual
---

# References: ios

> 14 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-ios.md`.

## ios-app-lifecycle

### implementation

# iOS App Lifecycle Implementation

## Clean SceneDelegate Setup

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    var appCoordinator: AppCoordinator?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }

        let window = UIWindow(windowScene: windowScene)
        let rootNav = UINavigationController()

        appCoordinator = AppCoordinator(nav: rootNav)
        appCoordinator?.start()

        window.rootViewController = rootNav
        self.window = window
        window.makeKeyAndVisible()
    }
}
```

## Background Task Registration

```swift
import BackgroundTasks

func registerBackgroundTasks() {
    BGTaskScheduler.shared.register(forTaskWithIdentifier: "com.app.refresh", using: nil) { task in
        self.handleAppRefresh(task: task as! BGAppRefreshTask)
    }
}

func handleAppRefresh(task: BGAppRefreshTask) {
    task.expirationHandler = {
        // Stop work
    }

    // Perform work
    fetchData { success in
        task.setTaskCompleted(success: success)
    }
}
```

## Bootstrapper Pattern

```swift
class AppBootstrapper {
    func configure() {
        DIContainer.shared.registerDependencies()
        AnalyticsService.shared.initialize()
        PushNotificationService.shared.register()
    }
}

// In AppDelegate
func application(_ application: UIApplication,
                 didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    AppBootstrapper().configure()
    return true
}
```

## BGTaskScheduler Registration

```swift
BGTaskScheduler.shared.register(forTaskWithIdentifier: "com.app.refresh", using: nil) { task in
    self.handleBackgroundRefresh(task: task as! BGAppRefreshTask)
}
```


---

## ios-architecture

### implementation

# iOS Architecture Implementation

## MVVM-C (Coordinator) Example

```swift
// 1. Definition of Inputs/Outputs
protocol HomeViewModelType {
    var inputs: HomeViewModelInputs { get }
    var outputs: HomeViewModelOutputs { get }
}

// 2. ViewModel
class HomeViewModel: HomeViewModelType, HomeViewModelInputs, HomeViewModelOutputs {
    var inputs: HomeViewModelInputs { return self }
    var outputs: HomeViewModelOutputs { return self }

    // Outputs
    @Published private(set) var title: String = "

    // Inputs
    func viewDidLoad() {
        title = "Welcome"
    }
}

// 3. Coordinator
class HomeCoordinator: Coordinator {
    var navigationController: UINavigationController

    init(nav: UINavigationController) {
        self.navigationController = nav
    }

    func start() {
        let vm = HomeViewModel()
        let vc = HomeViewController(viewModel: vm)
        vc.coordinator = self
        navigationController.pushViewController(vc, animated: true)
    }
}
```

## VIP (Clean Swift) Unidirectional Flow

```swift
// Router -> ViewController -> Interactor -> Presenter -> ViewController
class ListInteractor: ListBusinessLogic {
    var presenter: ListPresentationLogic?

    func fetchItems(request: List.Fetch.Request) {
        // Fetch data...
        let response = List.Fetch.Response(items: items)
        presenter?.presentFetchedItems(response: response)
    }
}

class ListPresenter: ListPresentationLogic {
    weak var viewController: ListDisplayLogic?

    func presentFetchedItems(response: List.Fetch.Response) {
        let viewModel = List.Fetch.ViewModel(displayedItems: ...)
        viewController?.displayFetchedItems(viewModel: viewModel)
    }
}
```


---

## ios-dependency-injection

### implementation

# iOS Dependency Injection Implementation

## Manual Initializer Injection

```swift
protocol AnalyticsServiceProtocol {
    func logEvent(name: String)
}

class HomeViewModel {
    private let analytics: AnalyticsServiceProtocol

    // POSITIVE: Clear, testable dependency
    init(analytics: AnalyticsServiceProtocol) {
        self.analytics = analytics
    }
}
```

## Modern DI with Factory

```swift
import Factory

// 1. Definition
extension Container {
    var analyticsService: Factory<AnalyticsServiceProtocol> {
        self { AnalyticsService() }.singleton
    }

    var homeViewModel: Factory<HomeViewModel> {
        self { HomeViewModel(analytics: self.analyticsService()) }
    }
}

// 2. Usage
class HomeViewController: UIViewController {
    @Injected(\.homeViewModel) private var viewModel
}
```

## Testing with Mocks

```swift
class MockAnalytics: AnalyticsServiceProtocol {
    var logCount = 0
    func logEvent(name: String) {
        logCount += 1
    }
}

func testViewModel() {
    let mock = MockAnalytics()
    let vm = HomeViewModel(analytics: mock)
    // Assert...
}
```

## Protocol-Based DI

```swift
protocol OrderRepositoryProtocol {
    func fetchOrders() async throws -> [Order]
}

class OrderViewModel {
    private let repository: OrderRepositoryProtocol

    init(repository: OrderRepositoryProtocol) {
        self.repository = repository
    }
}
```

## Factory Library Registration

```swift
extension Container {
    var orderRepository: Factory<OrderRepositoryProtocol> {
        Factory(self) { OrderRepository() }
    }

    var orderViewModel: Factory<OrderViewModel> {
        Factory(self) { OrderViewModel(repository: self.orderRepository()) }
    }
}
```


---

## ios-deployment

### implementation

# iOS Deployment Implementation

## Fastlane Fastfile Example

```ruby
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    setup_ci # If running on CI
    match(type: "appstore") # Sync certificates
    increment_build_number(xcodeproj: "App.xcodeproj")
    build_app(scheme: "App")
    upload_to_testflight
  end

  desc "Push a new release to the App Store"
  lane :release do
    match(type: "appstore")
    build_app(scheme: "App")
    upload_to_app_store(submit_for_review: false)
  end
end
```

## Matchfile Setup

```ruby
git_url("git@github.com:org/certificates-repo.git")
storage_mode("git")

type("appstore") # default: appstore, adhoc, development, enterprise

app_identifier(["com.app.bundle"])
username("apple-id@org.com")
```

## Info.plist Export Compliance

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

## Simple Beta Lane

```ruby
lane :beta do
  match(type: "appstore")
  increment_build_number
  build_app(scheme: "MyApp")
  upload_to_testflight(
    skip_waiting_for_build_processing: true
  )
end
```

## Matchfile (Minimal)

```ruby
# Matchfile
git_url("https://github.com/org/certificates")
type("appstore")
app_identifier("com.example.myapp")
```


---

## ios-design-system

### example

# iOS Design System — Token Examples

## Token Structure

```swift
// Theme/Colors.swift
extension Color {
    static let appPrimary = Color("Primary") // Asset Catalog
    static let appSecondary = Color("Secondary")
    static let appBackground = Color("Background")
}

// Theme/Spacing.swift
enum Spacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
}

// Theme/Typography.swift
extension Font {
    static let appTitle = Font.system(size: 28, weight: .bold)
    static let appBody = Font.system(size: 16, weight: .regular)
}
```

## Usage

```swift
// ❌ FORBIDDEN
Text("Hello").foregroundColor(Color(hex: "2196F3"))
VStack(spacing: 16) { }

// ✅ ENFORCED
Text("Hello").foregroundColor(.appPrimary)
VStack(spacing: Spacing.md) { }
Text("Title").font(.appTitle)
```


---

## ios-localization

### implementation

# iOS Localization & Asset Implementation

## Modern Localization (iOS 15+)

```swift
// 1. Basic Localization
let welcome = String(localized: "welcome_message", defaultValue: "Welcome to our app!")

// 2. Localized with arguments
let itemsCount = 5
let status = String(localized: "items_count_\(itemsCount)", defaultValue: "\(itemsCount) items found")

// 3. Date & Currency Formatting
let dateString = Date().formatted(date: .long, time: .omitted)
let price = 49.99
let priceString = price.formatted(.currency(code: "USD"))
```

## Programmatic Image Access

```swift
// POSITIVE: Type-safe access using SF Symbols and Asset Catalog
let icon = UIImage(systemName: "house.fill")
let logo = UIImage(named: "AppLogo") // Ensure this matches an image in xcassets
```

## Folder Namespacing (Best Practice)

In `Assets.xcassets`:

- Create folder `Icons`
- Right-click > _Provides Namespace_
- Access via: `UIImage(named: "Icons/Search")`

## Localization Usage

```swift
// Modern String Catalog approach (Xcode 15+)
Text(String(localized: "welcome_message"))

// With interpolation
Text(String(localized: "greeting \(userName)"))

// Locale-aware formatting
Text(price.formatted(.currency(code: "USD")))
Text(date.formatted(.dateTime.month().day().year()))
```

## Asset Catalog Best Practices

```swift
// Use SF Symbols for standard icons
Image(systemName: "heart.fill")

// Use Asset Catalog with namespaces
Image("Icons/profileAvatar")
```


---

## ios-navigation

### swiftui-navigation

# iOS Navigation Patterns (SwiftUI)

## 1. NavigationStack (iOS 16+)

Path-based navigation setup:

```swift
struct ContentView: View {
    @State private var navigationPath = NavigationPath()

    var body: some View {
        NavigationStack(path: $navigationPath) {
            HomeView()
                .navigationDestination(for: Product.self) { product in
                    ProductDetailView(product: product)
                }
        }
    }
}
```

## 2. Tab Navigation

Multiple stacks preserved in `TabView`:

```swift
TabView(selection: $selectedTab) {
    NavigationStack { HomeView() }
        .tabItem { Label("Home", systemImage: "house") }
        .tag(0)

    NavigationStack { SearchView() }
        .tabItem { Label("Search", systemImage: "magnifyingglass") }
        .tag(1)
}
```

## 3. Deep Linking

### Entitlements

Entitlements config for Universal Links:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:example.com</string>
</array>
```

### Handler (WindowGroup)

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    handleDeepLink(url)
                }
        }
    }

    func handleDeepLink(_ url: URL) {
        // 1. Parse URL Components
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
              let host = components.host else { return }

        // 2. Route based on host
        switch host {
        case "product":
            if let id = components.queryItems?.first(where: { $0.name == "id" })?.value {
                // navigationPath.append(Product(id: id))
            }
        default: break
        }
    }
}
```

## NavigationStack with Programmatic Navigation

```swift
struct ContentView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List(items) { item in
                NavigationLink(value: item) {
                    Text(item.title)
                }
            }
            .navigationDestination(for: Item.self) { item in
                DetailView(item: item)
            }
        }
    }

    func navigateToItem(_ item: Item) {
        path.append(item)
    }
}
```

## Deep Link Handling at App Level

```swift
@main
struct MyApp: App {
    @State private var path = NavigationPath()

    var body: some Scene {
        WindowGroup {
            ContentView(path: $path)
                .onOpenURL { url in
                    guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
                          let id = components.queryItems?.first(where: { $0.name == "id" })?.value else {
                        return
                    }
                    path.append(ItemRoute(id: id))
                }
        }
    }
}
```


---

## ios-networking

### implementation

# iOS Networking Implementation

## Native async/await URLSession

```swift
struct APIClient {
    private let session = URLSession.shared
    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        return d
    }()

    func fetchItems<T: Codable>(path: String) async throws -> T {
        var components = URLComponents(string: "https://api.example.com")!
        components.path = path

        guard let url = components.url else { throw URLError(.badURL) }

        // POSITIVE: Native async task
        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }

        return try decoder.decode(T.self, from: data)
    }
}
```

## Alamofire Security & Interceptor

```swift
import Alamofire

class AuthInterceptor: RequestInterceptor {
    func adapt(_ urlRequest: URLRequest, for session: Session, completion: @escaping (Result<URLRequest, Error>) -> Void) {
        var urlRequest = urlRequest
        if let token = Keychain.get("access_token") {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        completion(.success(urlRequest))
    }

    func retry(_ request: Request, for session: Session, dueTo error: Error, completion: @escaping (RetryResult) -> Void) {
        if let response = request.task?.response as? HTTPURLResponse, response.statusCode == 401 {
            // Logic for token refresh...
            completion(.retry)
        } else {
            completion(.doNotRetry)
        }
    }
}
```

## URLSession async/await

```swift
func fetchOrders() async throws -> [Order] {
    var components = URLComponents(string: "https://api.example.com/orders")!
    components.queryItems = [URLQueryItem(name: "status", value: "active")]

    let (data, response) = try await URLSession.shared.data(from: components.url!)
    guard let httpResponse = response as? HTTPURLResponse,
          (200...299).contains(httpResponse.statusCode) else {
        throw NetworkError.invalidResponse
    }
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    return try decoder.decode([Order].self, from: data)
}
```

## Alamofire with Validation

```swift
AF.request("https://api.example.com/orders", interceptor: authInterceptor)
    .validate()
    .responseDecodable(of: [Order].self) { response in
        switch response.result {
        case .success(let orders): handleOrders(orders)
        case .failure(let error): handleError(error)
        }
    }
```


---

## ios-notifications

### implementation

# iOS Notification Patterns (UserNotifications)

## 1. Request Permission

```swift
import UserNotifications

func requestNotificationPermission() {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
        if granted {
            DispatchQueue.main.async { UIApplication.shared.registerForRemoteNotifications() }
        }
    }
}
```

## 2. Register for APNS (AppDelegate)

```swift
func application(_ app: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    print("APNS Token: \(token)")
}

func application(_ app: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register: \(error)")
}
```

## 3. Handle Notifications (Delegate)

```swift
extension AppDelegate: UNUserNotificationCenterDelegate {
    // Foreground
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }

    // Tapped
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        if let type = userInfo["type"] as? String {
             // NotificationCenter.default.post(...)
        }
        completionHandler()
    }
}
```

## 4. Local Notifications

```swift
func scheduleLocal() {
    let content = UNMutableNotificationContent()
    content.title = "Reminder"
    content.sound = .default
    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 3600, repeats: false)
    let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
    UNUserNotificationCenter.current().add(request)
}
```

## 5. Priming

```swift
func primePermission() {
    let alert = UIAlertController(title: "Enable?", message: "Stay updated...", preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "Yes", style: .default) { _ in requestNotificationPermission() })
    alert.addAction(UIAlertAction(title: "No", style: .cancel))
    // present(alert)
}
```

## Full AppDelegate with APNs Registration

```swift
// AppDelegate.swift
import UserNotifications

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        requestNotificationPermission()
        return true
    }

    func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            guard granted else { return }
            DispatchQueue.main.async {
                UIApplication.shared.registerForRemoteNotifications()
            }
        }
    }

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        // Send token to your backend
    }

    // Foreground handling
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        return [.banner, .sound, .badge]
    }
}
```


---

## ios-performance

### implementation

# iOS Performance Implementation

## Lightweight Cells

```swift
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "ItemCell", for: indexPath) as! ItemCell
    let item = items[indexPath.row]

    // POSITIVE: Simple assignment. Heavy processing should be in ViewModel.
    cell.configure(with: item)
    return cell
}
```

## Background Processing (Modern Swift)

```swift
func handleHeavyData() async {
    // 1. Move to background actor or detached task
    let result = await Task.detached(priority: .background) {
        return self.performHeavyCalculation()
    }.value

    // 2. Update UI on MainActor
    await MainActor.run {
        self.updateUI(with: result)
    }
}
```

## Using Instruments (Checklist)

1. **Memory Growth**: Select _Allocations_, hit record, and monitor the _Persistent_ column.
2. **Leaks**: Select _Leaks_, hit record. Red spikes indicate actual leaks (missing `[weak self]`).
3. **Stalls**: Select _Time Profiler_, look for heavy stack traces with the Main Thread icon.

## Background Processing

```swift
// Offload heavy work from Main thread
func processData(_ rawData: Data) async -> [Item] {
    return await Task.detached(priority: .userInitiated) {
        let decoder = JSONDecoder()
        return try decoder.decode([Item].self, from: rawData)
    }.value
}
```

## Cell Reuse Pattern

```swift
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "OrderCell", for: indexPath) as! OrderCell
    cell.configure(with: orders[indexPath.row]) // Keep lightweight
    return cell
}
```


---

## ios-persistence

### implementation

# iOS Persistence Implementation

## Modern SwiftData Setup (iOS 17+)

```swift
import SwiftData

@Model
class Task {
    @Attribute(.unique) var id: UUID
    var title: String
    var isCompleted: Bool

    init(title: String) {
        self.id = UUID()
        self.title = title
        self.isCompleted = false
    }
}

// In App
@main
struct TodoApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Task.self)
    }
}
```

## Robust Core Data Stack

```swift
class PersistenceController {
    static let shared = PersistenceController()

    let container: NSPersistentContainer

    init() {
        container = NSPersistentContainer(name: "DataModel")
        container.loadPersistentStores { _, error in
            if let error = error as NSError? {
                fatalError("Unresolved error \(error)")
            }
        }
        // POSITIVE: Automatically merges changes from parent/children
        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }

    func performBackgroundTask(_ block: @escaping (NSManagedObjectContext) -> Void) {
        container.performBackgroundTask(block)
    }
}
```

## Batch Deletion Example

```swift
func clearAllData() {
    let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "Item")
    let deleteRequest = NSBatchDeleteRequest(fetchRequest: fetchRequest)

    do {
        try context.execute(deleteRequest)
    } catch {
        // Handle error
    }
}
```

## SwiftData Model and Query (iOS 17+)

```swift
@Model
class Order {
    var id: String
    var status: String
    var createdAt: Date

    init(id: String, status: String, createdAt: Date) {
        self.id = id
        self.status = status
        self.createdAt = createdAt
    }
}

// In SwiftUI view
struct OrderListView: View {
    @Query(sort: \Order.createdAt, order: .reverse) var orders: [Order]
    @Environment(\.modelContext) private var context

    var body: some View {
        List(orders) { order in
            Text(order.status)
        }
    }
}
```

## Core Data Background Write

```swift
let backgroundContext = persistentContainer.newBackgroundContext()
backgroundContext.perform {
    let order = OrderEntity(context: backgroundContext)
    order.status = "confirmed"
    try? backgroundContext.save()
}
```


---

## ios-security

### implementation

# iOS Security Implementation

## Using Keychain (Wrapper Recommendation)

```swift
import Valet

let valet = Valet.valet(with: Identifier(nonEmpty: "com.app.secrets")!, accessibility: .whenUnlocked)

// Save
valet.setString("secret_token", forKey: "authToken")

// Get
let token = valet.string(forKey: "authToken")
```

## Biometric Authentication

```swift
import LocalAuthentication

func authenticateUser() {
    let context = LAContext()
    var error: NSError?

    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
        let reason = "Authenticate to access your profile"
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, authenticationError in
            DispatchQueue.main.async {
                if success {
                    // Success
                } else {
                    // Handle failure (e.g., fallback to PIN)
                }
            }
        }
    }
}
```

## Secure Data Save

```swift
let secretData = "Top Secret".data(using: .utf8)!
let fileURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("secret.txt")

try secretData.write(to: fileURL, options: .completeFileProtection)
```

## Keychain Storage (Raw SecItem)

```swift
func storeToken(_ token: String, for account: String) throws {
    let data = Data(token.utf8)
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: account,
        kSecValueData as String: data,
        kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
    ]
    let status = SecItemAdd(query as CFDictionary, nil)
    guard status == errSecSuccess else { throw KeychainError.unhandledError(status) }
}
```

## Biometric Authentication

```swift
let context = LAContext()
var error: NSError?
guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
    // Handle unavailable biometrics
    return
}
context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,
                       localizedReason: "Authenticate to access your account") { success, error in
    // Handle result on MainActor
}
```


---

## ios-state-management

### implementation

# iOS State Management Implementation

## Combine ViewModel Pattern

```swift
import Combine

class SearchViewModel: ObservableObject {
    @Published var query: String = "
    @Published private(set) var results: [String] = []

    private var cancellables = Set<AnyCancellable>()

    init() {
        $query
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] text in
                self?.performSearch(text)
            }
            .store(in: &cancellables)
    }
}
```

## Modern Observation (iOS 17+)

```swift
import Observation

@Observable
class UserProfile {
    var name: String = "
    var age: Int = 0
}

struct ProfileView: View {
    @Bindable var user: UserProfile

    var body: some View {
        TextField("Name", text: $user.name)
    }
}
```

## PassthroughSubject for Navigation

```swift
class LoginViewModel {
    // Shared event for view to act upon
    let navigationTrigger = PassthroughSubject<Void, Never>()

    func login() {
        // ...
        navigationTrigger.send()
    }
}
```

## Combine ViewModel with ViewState

```swift
@MainActor
class OrderViewModel: ObservableObject {
    @Published private(set) var state: ViewState<[Order]> = .loading
    private var cancellables = Set<AnyCancellable>()

    func loadOrders() {
        orderService.fetchOrders()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    if case .failure(let error) = completion {
                        self?.state = .error(error)
                    }
                },
                receiveValue: { [weak self] orders in
                    self?.state = .success(orders)
                }
            )
            .store(in: &cancellables)
    }
}
```

## Observation Framework (iOS 17+)

```swift
@Observable
class OrderViewModel {
    var orders: [Order] = []
    var isLoading = false

    func loadOrders() async {
        isLoading = true
        orders = try await orderService.fetchOrders()
        isLoading = false
    }
}
```


---

## ios-ui-navigation

### implementation

# iOS UI & Layout Implementation

## Programmatic Auto Layout (SnapKit)

```swift
import SnapKit

class ProfileHeaderView: UIView {
    let avatarImageView = UIImageView()
    let nameLabel = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupSubviews()
    }

    private func setupSubviews() {
        addSubview(avatarImageView)
        addSubview(nameLabel)

        avatarImageView.snp.makeConstraints { make in
            make.top.left.equalToSuperview().inset(16)
            make.size.equalTo(60)
        }

        nameLabel.snp.makeConstraints { make in
            make.centerY.equalTo(avatarImageView)
            make.left.equalTo(avatarImageView.snp.right).offset(12)
            make.right.equalToSuperview().inset(16)
        }
    }
}
```

## Native Layout Anchors

```swift
NSLayoutConstraint.activate([
    avatarImageView.topAnchor.constraint(equalTo: self.topAnchor, constant: 16),
    avatarImageView.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16),
    avatarImageView.widthAnchor.constraint(equalToConstant: 60),
    avatarImageView.heightAnchor.constraint(equalToConstant: 60),

    nameLabel.centerYAnchor.constraint(equalTo: avatarImageView.centerYAnchor),
    nameLabel.leadingAnchor.constraint(equalTo: avatarImageView.trailingAnchor, constant: 12),
    nameLabel.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -16)
])
```

## Accessibility Implementation

```swift
func setupAccessibility() {
    nameLabel.isAccessibilityElement = true
    nameLabel.accessibilityLabel = "User Name"
    nameLabel.accessibilityTraits = .staticText
    nameLabel.font = .preferredFont(forTextStyle: .headline)
    nameLabel.adjustsFontForContentSizeCategory = true
}
```


---

