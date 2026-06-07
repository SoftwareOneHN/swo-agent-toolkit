---
inclusion: manual
---

# References: react-native

> 13 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-react-native.md`.

## react-native-architecture

### folder-structure

# React Native Architecture Reference

Complete folder structure examples and advanced patterns.

## Full Project Structure (Feature-First)

```text
my-app/
├── src/
│   ├── features/           # Feature modules
│   │   ├── auth/
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── SignupScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   └── SocialButtons.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── services/
│   │   │       └── authService.ts
│   │   │
│   │   ├── home/
│   │   │   ├── screens/
│   │   │   │   └── HomeScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── FeedList.tsx
│   │   │   │   └── PostCard.tsx
│   │   │   └── hooks/
│   │   │       └── useFeed.ts
│   │   │
│   │   └── profile/
│   │       ├── screens/
│   │       │   ├── ProfileScreen.tsx
│   │       │   └── EditProfileScreen.tsx
│   │       └── components/
│   │           └── ProfileHeader.tsx
│   │
│   ├── components/         # Shared components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── navigation/         # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── services/           # Shared services
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   └── storage/
│   │       └── secureStorage.ts
│   │
│   ├── hooks/              # Shared hooks
│   │   ├── useKeyboard.ts
│   │   └── useAppState.ts
│   │
│   ├── utils/              # Utilities
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   ├── theme/              # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   └── types/              # TypeScript types
│       ├── models.ts
│       └── api.ts
│
├── app.json                # Expo config (or index.js for RN CLI)
├── tsconfig.json           # TypeScript config
└── package.json
```

## TypeScript Path Mapping

Configure `tsconfig.json` for absolute imports:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/components/*": ["components/*"],
      "@/features/*": ["features/*"],
      "@/services/*": ["services/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/theme/*": ["theme/*"],
      "@/types/*": ["types/*"],
      "@/navigation/*": ["navigation/*"]
    }
  }
}
```

**Usage**:

```tsx
// Instead of: import Button from '../../../components/Button';
import Button from '@/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
```

## Service Layer Pattern

### API Client Setup

```tsx
// src/services/api/client.ts
import axios from 'axios';
import { getToken } from '@/services/storage/secureStorage';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Feature-Specific Service

```tsx
// src/features/auth/services/authService.ts
import apiClient from '@/services/api/client';
import { LoginCredentials, User } from '@/types/models';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
```

## Separation of Concerns Example

**Bad** ❌ - Logic in Screen:

```tsx
function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return <FlatList data={posts} ... />;
}
```

**Good** ✅ - Extract to Hook + Service:

```tsx
// hooks/usePosts.ts
function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService.fetchPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return { posts, loading };
}

// screens/HomeScreen.tsx
function HomeScreen() {
  const { posts, loading } = usePosts();
  return <PostList posts={posts} loading={loading} />;
}
```

## Feature-First Structure (Compact)

```text
src/
├── features/
│   ├── auth/
│   │   ├── screens/LoginScreen.tsx
│   │   ├── hooks/useAuth.ts
│   │   └── services/authApi.ts
│   └── orders/
│       ├── screens/OrderListScreen.tsx
│       ├── hooks/useOrders.ts
│       └── components/OrderCard.tsx
├── components/          # Shared reusable components
├── navigation/
└── services/            # Shared API/utilities
```

## Path Aliases (tsconfig.json)

```json
// tsconfig.json - path aliases
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/features/*": ["src/features/*"],
      "@/components/*": ["src/components/*"],
      "@/services/*": ["src/services/*"],
      "@/navigation/*": ["src/navigation/*"]
    }
  }
}
```


---

## react-native-components

### patterns

# React Native Components Reference

Advanced patterns for high-density, reusable mobile components.

## Container / Presentational Split

The most fundamental separation: containers own logic, presentational components own UI.

```tsx
// Container: data fetching + logic
function HomeScreen() {
  const { data, loading } = useFetchPosts();
  return <PostList posts={data} loading={loading} />;
}

// Presentational: pure UI, no side effects
type Props = { posts: Post[]; loading: boolean };
function PostList({ posts, loading }: Props) {
  if (loading) return <ActivityIndicator />;
  return <FlatList data={posts} renderItem={({ item }) => <PostCard post={item} />} />;
}
```

## Higher-Order Components (HOC)

Use HOCs for cross-cutting concerns like authentication or tracking.

```tsx
// withAuth.tsx
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <ActivityIndicator />;
    if (!isAuthenticated) return <LoginRedirect />;

    return <Component {...props} />;
  };
}

// Usage
export const ProfileScreen = withAuth(ProfileContent);
```

## Render Props

Pattern for sharing logic that requires UI flexibility.

```tsx
// KeyboardSpacer.tsx
export function KeyboardSpacer({
  children,
}: {
  children: (keyboardHeight: number) => React.ReactNode;
}) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', (e) =>
      setHeight(e.endCoordinates.height),
    );
    const unsub = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
    return () => {
      sub.remove();
      unsub.remove();
    };
  }, []);

  return <>{children(height)}</>;
}

// Usage
<KeyboardSpacer>
  {(height) => <View style={{ marginBottom: height }} />}
</KeyboardSpacer>;
```

## Compound Components

Pattern for components with implicit state and shared context.

```tsx
// Accordion.tsx
const AccordionContext = createContext({
  activeIdx: -1,
  toggle: (i: number) => {},
});

export function Accordion({ children }) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const toggle = (i: number) => setActiveIdx((prev) => (prev === i ? -1 : i));
  return (
    <AccordionContext.Provider value={{ activeIdx, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
}

Accordion.Item = function Item({ index, title, children }) {
  const { activeIdx, toggle } = useContext(AccordionContext);
  const isOpen = activeIdx === index;
  return (
    <View>
      <TouchableOpacity onPress={() => toggle(index)}>
        <Text>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View>{children}</View>}
    </View>
  );
};
```

## Slot Pattern

Use for highly customizable layout components.

```tsx
function ScreenHeader({
  title,
  LeftAction,
  RightAction,
}: {
  title: string;
  LeftAction?: React.ReactNode;
  RightAction?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View>{LeftAction}</View>
      <Text>{title}</Text>
      <View>{RightAction}</View>
    </View>
  );
}
```


---

## react-native-deployment

### codepush-setup

# Deployment Reference

Release automation and versioning strategies.

## CodePush Integration

### Standard Setup

```tsx
import codePush from 'react-native-code-push';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

function App() {
  return <Root />;
}

export default codePush(codePushOptions)(App);
```

### Manual Update Check

```tsx
const checkUpdate = async () => {
  const update = await codePush.checkForUpdate();
  if (update) {
    setUpdateAvailable(true);
    await codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  }
};
```

## EAS Build Profiles

```json
// eas.json
{
  "build": {
    "staging": {
      "releaseChannel": "staging",
      "env": {
        "API_URL": "https://staging-api.example.com"
      }
    },
    "production": {
      "releaseChannel": "production",
      "autoIncrement": true,
      "env": {
        "API_URL": "https://api.example.com"
      }
    }
  }
}
```

## Fastlane Automation

### iOS Release Lane

```ruby
# fastlane/Fastfile
desc "Deploy a new version to the App Store"
lane :release do
  increment_build_number(xcodeproj: "MyApp.xcodeproj")
  build_app(scheme: "MyApp")
  upload_to_testflight
  upload_to_app_store
end
```

## Versioning Strategy

| Type                  | Bump  | Trigger   |
| --------------------- | ----- | --------- |
| **TS/JS Change**      | Patch | CodePush  |
| **Native Dependency** | Minor | App Store |
| **New Native API**    | Major | App Store |

**Bumping Script**:

```bash
# Bump version and set git tag
npm version patch
# Push to CodePush
appcenter codepush release-react -a User/MyApp -d Production
```

## EAS Build Profiles (Minimal)

```json
{
  "build": {
    "development": { "developmentClient": true },
    "preview": { "distribution": "internal" },
    "production": { "autoIncrement": true }
  }
}
```

```bash
eas build --platform ios --profile production
```


---

## react-native-dls

### usage

# React Native Design System Usage

## 1. Token Structure

Define tokens in `theme/`:

```typescript
// theme/colors.ts
export const colors = {
  primary: '#2196F3',
  background: '#FFFFFF',
  text: '#000000',
  error: '#B00020',
} as const;

// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// theme/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
} as const;
```

## 2. Usage Examples

### Using StyleSheet

```typescript
import { StyleSheet, View, Text } from 'react-native';
import { colors, spacing, typography } from './theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
  },
});
```

### Using Styled Components

```typescript
import styled from 'styled-components/native';

const Container = styled.View`
  background-color: ${(p) => p.theme.colors.background};
  padding: ${(p) => p.theme.spacing.md}px;
`;
```


---

## react-native-navigation

### routing-patterns

# React Native Navigation Patterns

## 1. Type-Safe Stack

```typescript
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackList = {
  Home: undefined;
  Product: { productId: string };
};

const Stack = createNativeStackNavigator<RootStackList>();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}
// Usage: navigation.navigate('Product', { productId: '123' });
```

## 2. Deep Linking Configuration

```typescript
const linking = {
  prefixes: ['myapp://', 'https://example.com'],
  config: {
    screens: {
      Product: {
        path: 'product/:id',
        parse: { id: (id) => id },
      },
      Profile: 'profile/:username',
    },
  },
};

<NavigationContainer linking={linking}>{/*...*/}</NavigationContainer>
```

## 3. Platform Setup

**Android (AndroidManifest.xml)**

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myapp" />
  <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

**iOS (Info.plist)**

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>myapp</string></array>
  </dict>
</array>
```

## 4. Parameter Validation

```typescript
function ProductScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { data, error } = useProduct(productId);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Not found');
      navigation.goBack();
    }
  }, [error]);
}
```

## 5. NavigationContainer with Linking

```tsx
import { NavigationContainer } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Detail: { itemId: string };
};

const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: { Home: '', Detail: 'item/:itemId' },
  },
};

function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Loading />}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```


---

## react-native-navigation-v6

### deep-linking

# React Native Navigation Reference

Deep linking configuration and advanced navigation patterns.

## Typed Navigation Setup

```tsx
// 1. Define param list
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

// 2. Create typed navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// 3. Define navigator
function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// 4. Type screen props and navigate
function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return <Button onPress={() => navigation.navigate('Profile', { userId: '123' })} />;
}
```

## Deep Linking Configuration

### Universal Links Setup

**iOS (Info.plist)**:

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

**Android (AndroidManifest.xml)**:

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https"
        android:host="myapp.com"
        android:pathPrefix="/product" />
</intent-filter>
```

### React Navigation Linking Config

```tsx
import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      Profile: {
        path: 'user/:userId',
        parse: {
          userId: (userId) => `${userId}`,
        },
      },
      Product: {
        path: 'product/:id',
        parse: {
          id: (id) => parseInt(id, 10),
        },
      },
      NotFound: '*', // Catch-all for 404
    },
  },
};

function App() {
  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
}
```

**Test Deep Links**:

```bash
# iOS Simulator
xcrun simctl openurl booted "myapp://product/123"

# Android
adb shell am start -W -a android.intent.action.VIEW \
  -d "myapp://product/123" \
  com.myapp
```

## Nested Navigators Example

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Search' component={SearchScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root Stack (with modals)
function RootNavigator() {
  return (
    <Stack.Navigator>
      {/* Main App */}
      <Stack.Screen
        name='MainTabs'
        component={MainTabs}
        options={{ headerShown: false }}
      />

      {/* Modal Screens */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name='Settings' component={SettingsScreen} />
        <Stack.Screen name='CreatePost' component={CreatePostScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
```

## Navigation State Persistence

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    // Restore navigation state
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;
        setInitialState(state);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
```

## Screen Options Patterns

```tsx
// Global options
<Stack.Navigator
  screenOptions={{
    headerStyle: { backgroundColor: '#007AFF' },
    headerTintColor: '#fff',
    headerBackTitleVisible: false,
  }}
>
  {/* Per-screen override */}
  <Stack.Screen
    name="Profile"
    component={ProfileScreen}
    options={{
      headerTitle: 'My Profile',
      headerRight: () => <Button title="Edit" onPress={...} />,
    }}
  />

  {/* Dynamic options from params */}
  <Stack.Screen
    name="Product"
    component={ProductScreen}
    options={({ route }) => ({
      headerTitle: route.params.name,
    })}
  />
</Stack.Navigator>
```

## Type-Safe Stack Navigator

```tsx
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function ProfileScreen({ route }: ProfileProps) {
  const { userId } = route.params;
  return <Text>{userId}</Text>;
}
```

## Linking Config with Fallback

```tsx
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: '',
      Profile: 'user/:userId',
      Settings: 'settings',
      NotFound: '*',
    },
  },
};

<NavigationContainer linking={linking} fallback={<ActivityIndicator />}>
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
</NavigationContainer>
```


---

## react-native-notifications

### implementation

# React Native Notification Implementation

## 1. Firebase (Bare Workflow)

**Setup**: `npm install @react-native-firebase/app @react-native-firebase/messaging`

### Request Permission

```typescript
import messaging from '@react-native-firebase/messaging';

async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) console.log('Token:', await messaging().getToken());
}
```

### Handlers

```typescript
useEffect(() => {
  // Foreground
  const unsubscribe = messaging().onMessage(async (msg) => {
    console.log(msg);
  });

  // Background -> Opened
  messaging().onNotificationOpenedApp((msg) => handlePress(msg));

  // Quit -> Opened
  messaging()
    .getInitialNotification()
    .then((msg) => {
      if (msg) handlePress(msg);
    });

  return unsubscribe;
}, []);

function handlePress(msg) {
  if (msg?.data?.type === 'order')
    navigation.navigate('Order', { id: msg.data.id });
}
```

## 2. Expo Notifications (Managed)

**Setup**: `npx expo install expo-notifications`

### Setup & Register

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function register() {
  if (Device.isDevice) {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === 'granted') {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    }
  }
}
```

### Local Scheduling

```typescript
await Notifications.scheduleNotificationAsync({
  content: { title: 'Hello', body: 'World' },
  trigger: { seconds: 60 },
});
```

## 3. Priming Example

```typescript
async function prime() {
  const { canAskAgain } = await Notifications.getPermissionsAsync();
  if (!canAskAgain)
    return Alert.alert('Open Settings', 'Please enable manually');

  Alert.alert('Enable?', 'Receive updates?', [
    { text: 'Yes', onPress: () => Notifications.requestPermissionsAsync() },
  ]);
}
```

## 4. FCM Handler Setup (React Native Firebase)

```typescript
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";

// Request permission (call after user priming)
async function requestPermission() {
  const status = await messaging().requestPermission();
  if (status === messaging.AuthorizationStatus.AUTHORIZED) {
    const token = await messaging().getToken();
    // Send token to backend
  }
}

// Register all lifecycle handlers in App.tsx
export function useNotificationHandlers(navigate: (route: string) => void) {
  useEffect(() => {
    // Foreground
    const unsubForeground = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground message:", remoteMessage.notification?.title);
    });

    // Background tap
    const unsubBackground = messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage.data?.screen) {
        navigate(remoteMessage.data.screen);
      }
    });

    // Quit state
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage?.data?.screen) {
        navigate(remoteMessage.data.screen);
      }
    });

    return () => {
      unsubForeground();
      unsubBackground();
    };
  }, [navigate]);
}
```


---

## react-native-performance

### optimization-guide

# React Native Performance Reference

Advanced optimization techniques and detailed examples.

## FlatList Advanced Optimization

```tsx
import { FlatList, View, Text } from 'react-native';

const ITEM_HEIGHT = 80;

function OptimizedList({ data }: { data: Item[] }) {
  // Fixed height allows skipping measurement
  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  // Extract render function to prevent recreation
  const renderItem = useCallback(({ item }) => <ItemCard item={item} />, []);

  // Stable key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      // Performance props
      windowSize={10} // Render 10 items outside viewport
      maxToRenderPerBatch={5} // Render 5 items per frame
      updateCellsBatchingPeriod={50} // 50ms batching
      removeClippedSubviews={true} // Android optimization
      initialNumToRender={10} // Initial render count
    />
  );
}
```

## React.memo with Props Comparison

```tsx
import { memo } from 'react';

type Props = { user: User; onPress: () => void };

// Shallow comparison (default)
const UserCard = memo(function UserCard({ user, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{user.name}</Text>
    </TouchableOpacity>
  );
});

// Custom comparison
const UserCardCustom = memo(
  function UserCard({ user, onPress }: Props) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>{user.name}</Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.updatedAt === nextProps.user.updatedAt
    );
  },
);
```

## useMemo and useCallback

```tsx
function ProductList({ products, category }) {
  // Expensive calculation - memoize
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.category === category)
      .sort((a, b) => b.price - a.price);
  }, [products, category]);

  // Stabilize function reference for memo'd child
  const handlePress = useCallback(
    (productId: string) => {
      navigation.navigate('Product', { id: productId });
    },
    [navigation],
  );

  return (
    <FlatList
      data={filteredProducts}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={handlePress} />
      )}
    />
  );
}
```

## Image Optimization with Fast Image

```tsx
import FastImage from 'react-native-fast-image';

function Avatar({ uri, size = 50 }: Props) {
  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
}

// Preload images
FastImage.preload([
  { uri: 'https://example.com/avatar1.jpg' },
  { uri: 'https://example.com/avatar2.jpg' },
]);
```

## Bundle Size Analysis

```bash
# React Native CLI
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# Analyze with source-map-explorer
npm install -g source-map-explorer
source-map-explorer android/app/src/main/assets/index.android.bundle.map
```

## Hermes Configuration

```js
// android/app/build.gradle
project.ext.react = [
    enableHermes: true,  // Enable Hermes
]

// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // Lazy loading
      },
    }),
  },
};
```

## Strip console.log in Production

```js
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
  env: {
    production: {
      plugins: ['transform-remove-console'], // Strip console.log
    },
  },
};
```

```bash
npm install --save-dev babel-plugin-transform-remove-console
```

## FlatList Quick Reference

```tsx
const ITEM_HEIGHT = 72;

const renderItem = useCallback(({ item }: { item: Product }) => (
  <ProductCard product={item} />
), []);

<FlatList
  data={products}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
  windowSize={7}
  maxToRenderPerBatch={5}
  initialNumToRender={10}
  removeClippedSubviews
/>
```


---

## react-native-platform-specific

### native-modules

# Native Modules Reference

Bridge between JavaScript and Native (Swift/Kotlin).

## Native Module (Bare RN)

### Android (Kotlin)

```kotlin
// CalendarModule.kt
class CalendarModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "CalendarModule"

    @ReactMethod
    fun createCalendarEvent(name: String, location: String) {
        Log.d("CalendarModule", "Create event $name at $location")
    }
}
```

### iOS (Swift)

```swift
// CalendarModule.swift
@objc(CalendarModule)
class CalendarModule: NSObject {
  @objc(createCalendarEvent:location:)
  func createCalendarEvent(name: String, location: String) -> Void {
    print("Create event \(name) at \(location)")
  }

  @objc static func requiresMainQueueSetup() -> Bool { return true }
}
```

## Expo Native Modules (JSI)

Expo Modules API uses JSI for near-instant synchronous calls.

```tsx
// src/modules/MyModule.ts
import { requireNativeModule } from 'expo-modules-core';
const module = requireNativeModule('MyModule');

export function hello() {
  return module.hello(); // Synchronous call
}
```

## Platform-Specific Rendering

### Injections & Overrides

```tsx
// DatePicker.ios.tsx
export const DatePicker = (props) => (
  <DateTimePicker mode='date' display='spinner' {...props} />
);

// DatePicker.android.tsx
export const DatePicker = (props) => (
  <DateTimePicker mode='date' display='default' {...props} />
);
```

### Safe Area Handling

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SafeHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      <Header />
    </View>
  );
}
```

## Platform-Specific File Naming

```text
Button.tsx          # Shared
Button.ios.tsx      # iOS-specific
Button.android.tsx  # Android-specific
```

## Platform.select for Inline Branching

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
    android: { elevation: 4 },
    default: {},
  }),
});
```


---

## react-native-security

### keychain-usage

# React Native Security Reference

Keychain usage, SSL pinning, and secure deep linking examples.

## Keychain/Keystore Usage

```tsx
import * as Keychain from 'react-native-keychain';

// Save credentials
async function saveToken(token: string) {
  await Keychain.setGenericPassword('auth', token, {
    service: 'com.myapp.token',
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
}

// Retrieve credentials
async function getToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({
    service: 'com.myapp.token',
  });
  return credentials ? credentials.password : null;
}

// Delete credentials
async function clearToken() {
  await Keychain.resetGenericPassword({
    service: 'com.myapp.token',
  });
}

// Biometric authentication
async function saveBiometricToken(token: string) {
  await Keychain.setGenericPassword('auth', token, {
    service: 'com.myapp.token',
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
  });
}
```

## Biometric Authentication

```tsx
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

async function authenticateWithBiometrics() {
  // Check if biometrics available
  const { available, biometryType } = await rnBiometrics.isSensorAvailable();

  if (!available) {
    throw new Error('Biometric authentication not available');
  }

  // Prompt for biometric
  const { success } = await rnBiometrics.simplePrompt({
    promptMessage: 'Authenticate to continue',
    cancelButtonText: 'Cancel',
  });

  if (success) {
    // Success - proceed with sensitive operation
    return true;
  }

  return false;
}
```

## Deep Link Validation

```tsx
import { Linking } from 'react-native';

const ALLOWED_SCHEMES = ['myapp'];
const ALLOWED_HOSTS = ['myapp.com', 'www.myapp.com'];

function validateDeepLink(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Check scheme
    if (!ALLOWED_SCHEMES.includes(parsed.protocol.replace(':', ''))) {
      console.warn('Invalid deep link scheme:', parsed.protocol);
      return false;
    }

    // Check host (for https links)
    if (
      parsed.protocol === 'https:' &&
      !ALLOWED_HOSTS.includes(parsed.hostname)
    ) {
      console.warn('Invalid deep link host:', parsed.hostname);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Invalid URL:', url);
    return false;
  }
}

// Usage in navigation linking
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url && validateDeepLink(url)) {
      return url;
    }
    return null;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => {
      if (validateDeepLink(url)) {
        listener(url);
      }
    };

    const subscription = Linking.addEventListener('url', onReceiveURL);
    return () => subscription.remove();
  },
};
```

## SSL Certificate Pinning

```tsx
import { fetch } from 'react-native-ssl-pinning';

// Certificate pinning configuration
const sslPinningConfig = {
  'api.myapp.com': {
    includeSubdomains: true,
    publicKeyHashes: [
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=', // Backup
    ],
  },
};

async function secureFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      sslPinning: sslPinningConfig,
      timeoutInterval: 10000,
    });
    return await response.json();
  } catch (error) {
    if (error.message.includes('SSL')) {
      // Certificate pinning failed - possible MITM attack
      console.error('SSL Pinning failed:', error);
      // Alert user or log to monitoring service
    }
    throw error;
  }
}
```

**Get Certificate Hash**:

```bash
# For iOS (OpenSSL)
openssl s_client -connect api.myapp.com:443 | \
  openssl x509 -pubkey -noout | \
  openssl pkey -pubin -outform der | \
  openssl dgst -sha256 -binary | \
  openssl enc -base64

# For Android
keytool -printcert -jarfile app-release.apk
```

## Environment Variables

```bash
# .env
API_BASE_URL=https://api-dev.myapp.com
API_KEY=dev_key_12345
SENTRY_DSN=https://...

# .env.production
API_BASE_URL=https://api.myapp.com
API_KEY=prod_key_67890
SENTRY_DSN=https://...
```

```tsx
// Setup react-native-config
import Config from 'react-native-config';

const apiClient = axios.create({
  baseURL: Config.API_BASE_URL,
  headers: {
    'X-API-Key': Config.API_KEY,
  },
});
```

**.gitignore**:

```
.env
.env.local
.env.*.local
```

## Screenshot Prevention

```tsx
import ScreenGuardModule from 'react-native-screen-guard';

// Prevent screenshots on sensitive screens
useEffect(() => {
  ScreenGuardModule.register({
    backgroundColor: '#000000',
    timeAfterResume: 2000,
  });

  return () => {
    ScreenGuardModule.unregister();
  };
}, []);
```

## PII Masking

```tsx
// Mask sensitive data in logs
function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.slice(0, 2) + '***';
  return `${maskedUsername}@${domain}`;
}

function maskPhone(phone: string): string {
  return phone.replace(/\d(?=\d{4})/g, '*');
}

// Usage in analytics
analytics.track('User Login', {
  email: maskEmail(user.email),
  phone: maskPhone(user.phone),
});
```

## Keychain with Biometric Access Control

```tsx
import * as Keychain from 'react-native-keychain';

// Store token securely
await Keychain.setGenericPassword('auth', accessToken, {
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

// Retrieve token
const credentials = await Keychain.getGenericPassword();
if (credentials) {
  const token = credentials.password;
}
```

## Deep Link URL Validation

```tsx
// Deep link URL validation
function handleDeepLink(url: string): boolean {
  const parsed = new URL(url);
  const allowedHosts = ['myapp.com', 'www.myapp.com'];
  const allowedSchemes = ['https:', 'myapp:'];

  if (!allowedSchemes.includes(parsed.protocol) || !allowedHosts.includes(parsed.hostname)) {
    console.warn('Blocked untrusted deep link:', url);
    return false;
  }
  // Validate route params before navigation
  const id = parsed.searchParams.get('id');
  if (id && !/^[a-zA-Z0-9-]+$/.test(id)) return false;
  return true;
}
```


---

## react-native-state-management

### REFERENCE

# State Management Reference

Advanced state patterns for React Native applications.

## Zustand: Advanced Patterns

### Middleware & Persistence

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

## Redux Toolkit (RTK)

### Async Thunks

```tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await fetch('/api/users');
  return response.json();
});

const userSlice = createSlice({
  name: 'users',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      });
  },
});
```

## TanStack Query

### Optimistic Updates

```tsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```


---

## react-native-styling

### theming

# React Native Styling Reference

Advanced theming, responsive design, and layout patterns.

## Design Tokens

```tsx
// src/theme/tokens.ts
export const PALETTE = {
  primary: '#007AFF',
  success: '#4CD964',
  error: '#FF3B30',
  black: '#000000',
  white: '#FFFFFF',
  gray: { 100: '#F2F2F7', 500: '#8E8E93', 900: '#1C1C1E' },
};

export const SPACING = { xs: 4, s: 8, m: 16, l: 24, xl: 32 };

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
};
```

## Dynamic Theming with Context

Complete implementation for light/dark mode.

```tsx
// src/theme/ThemeProvider.tsx
const ThemeContext = createContext({
  isDark: false,
  theme: lightTheme,
  toggle: () => {}
});

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState(systemScheme || 'light');

  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const toggle = () => setMode(m => m === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ isDark: mode === 'dark', theme, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
}
```

## Responsive Layout Utilities

```tsx
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Scale based on design width (e.g. 375px)
const scale = SCREEN_WIDTH / 375;

export function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Usage in StyleSheet
const styles = StyleSheet.create({
  card: {
    width: normalize(300),
    padding: normalize(16),
  },
});
```

## Shadow Helper

```tsx
export const shadow = (elevation = 5) => ({
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: 0.2 + elevation / 100,
      shadowRadius: elevation,
    },
    android: {
      elevation,
    },
  }),
});
```


---

## react-native-testing

### testing-library

# React Native Testing Reference

Setup and patterns for high-quality mobile testing.

## RNTL Setup & Configuration

```javascript
// jest-setup.js
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

## Testing Context & Providers

Use a custom render function to wrap components with necessary providers.

```tsx
// test-utils.tsx
const AllTheProviders = ({ children }) => (
  <ThemeProvider>
    <NavigationContainer>{children}</NavigationContainer>
  </ThemeProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
```

## Integration Test Flow

Testing a full user flow including navigation and API calls.

```tsx
test('full login flow success', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);

  fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'password');
  fireEvent.press(getByText('Login'));

  // Wait for navigation after successful login
  await waitFor(() => {
    expect(getByText('Welcome back, Test User')).toBeTruthy();
  });
});
```

## Mocking Navigation

```tsx
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

test('navigates to details on press', () => {
  const { getByText } = render(<Card id='1' />);
  fireEvent.press(getByText('View Details'));
  expect(mockNavigate).toHaveBeenCalledWith('Details', { id: '1' });
});
```


---

