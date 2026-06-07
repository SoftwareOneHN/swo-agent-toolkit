---
inclusion: manual
---

# Skills: react-native

> 13 skills. Load when editing react-native files.
> For code examples and implementation patterns, load `refs-react-native.md`.

## Index

# react-native Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **react-native-architecture** | `src/**/*.tsx`, `src/**/*.ts`, `app.json`, `StyleSheet.create` | feature, module, directory structure, separation of concerns, Expo, React Navigation, react-native, mobile architecture |
| react-native-deployment | `app.json`, `eas.json`, `android/app/build.gradle`, `ios/**` | deployment, codepush, eas, release, build, fastlane |
| react-native-dls | `**/*Screen.tsx`, `**/*Component.tsx`, `**/theme/**`, `**/styles/**` | StyleSheet, styled-components, theme, colors, spacing |
| react-native-navigation | `**/App.tsx`, `**/*Navigator.tsx`, `**/*Screen.tsx` | NavigationContainer, createStackNavigator, createBottomTabNavigator, linking, deep link |
| **react-native-navigation-v6** | `**/*Navigation*.tsx`, `src/navigation/**` | navigation, react-navigation, stack, tab, drawer, deep link |
| react-native-notifications | `**/*notification*.ts`, `**/*notification*.tsx`, `**/App.tsx` | Notifications, messaging, FCM, expo-notifications, react-native-firebase |
| react-native-platform-specific | `**/*.ios.*`, `**/*.android.*` | Platform, Platform.select, native-module, ios, android |
| react-native-testing | `**/*.test.tsx`, `**/*.spec.tsx`, `__tests__/**` | test, testing, jest, render, fireEvent, waitFor |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| **react-native-components** | component, props, children, composition, presentational, container |
| **react-native-performance** | FlatList, memo, useMemo, useCallback, performance, optimization |
| **react-native-security** | security, keychain, secure-storage, deep-link, certificate-pinning |
| react-native-state-management | useState, useContext, zustand, redux, state-management |
| react-native-styling | StyleSheet, style, theme, responsive, flexbox |

> Load matched skills: `<SKILLS>/react-native/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### react-native-architecture

---
name: react-native-architecture
description: Structure React Native projects with feature-first organization and separation of concerns. Use when structuring a React Native project or applying clean architecture patterns.
metadata:
  triggers:
    files:
    - 'src/**/*.tsx'
    - 'src/**/*.ts'
    - 'app.json'
    - 'StyleSheet.create'
    keywords:
    - feature
    - module
    - directory structure
    - separation of concerns
    - Expo
    - React Navigation
    - react-native
    - mobile architecture
---
# React Native Architecture

## **Priority: P0 (CRITICAL)**


## Organize by Feature

- **Feature-First**: Organize by feature/module, not by type.
- **Colocation**: Keep related files together (screens, components, hooks within feature).
- **Separation**: UI (screens/components) separate from logic (hooks/services).

See [folder structure reference](references/folder-structure.md) for full directory tree and path alias configuration.

- **Atomic Components**: Reusable components in `/components`. Feature-specific in feature folder.
- **Absolute Imports**: Configure tsconfig.json paths for clean imports.
- **Single Responsibility**: Each file one clear purpose.
- **Expo vs CLI**: Structure works for both. Expo uses `app.json`, CLI uses `index.js`.

## Anti-Patterns

- **No Type-Based Folders**: Avoid `/containers`, `/screens` at root. Use features.
- **No Logic in Screens**: Extract to hooks or services.
- **No Circular Deps**: Features should not import from each other directly.
- **No Deep Nesting**: Max 3 levels deep.

## Navigation Strategy

- **Expo Router**: Use for new projects, web-parity, and file-based routing.
- **React Navigation**: Use for complex deep-linking, legacy apps, or high-customization needs.

## Verification Checklist (Mandatory)

- [ ] **Feature-First**: file inside feature directory?
- [ ] **Colocation**: hooks/services colocated with screens?
- [ ] **Logic-Free Screens**: there any business logic in screen component?
- [ ] **Navigation Choice**: project use navigation strategy defined above?

## References

See [references/folder-structure.md](references/folder-structure.md) for full directory tree, path alias config, and service layer patterns.

---

### react-native-components

---
name: react-native-components
description: Build modern React Native components using function components and composition. Use when building or refactoring React Native function components and composable UI.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.jsx'
    keywords:
    - component
    - props
    - children
    - composition
    - presentational
    - container
---
# React Native Components

## **Priority: P0 (CRITICAL)**


## Implementation Guidelines

- **Function Components Only**: Use hooks. No class components.
- **Container/Presentational**: Separate logic (hooks, data fetching) from UI (JSX, styling).
- **Composition**: Use `children` prop. Prefer composition over prop drilling.
- **Props**: TypeScript interfaces. Destructure in params.
- **File Size**: Keep components < 250 lines. Split if larger.
- **One Component Per File**: Named exports for components.
- **Naming**: `PascalCase` for components. `use*` for hooks.
- **Imports**: Group - React → External → Internal → Styles.
- **Platform Components**: Use built-in (`View`, `Text`, `TouchableOpacity`). Avoid DOM (`div`, `span`).

## Anti-Patterns

- **No Classes**: Use hooks instead.
- **No Nested Components**: Define at top level.
- **No Inline Styles**: Use `StyleSheet.create`.
- **No Index Keys**: Use stable IDs.
- **No Deep Nesting**: Max 3 levels.

## References

See [references/patterns.md](references/patterns.md) for Container/Presentational split, HOCs, Render Props, Compound Components, and Slot patterns.

---

### react-native-deployment

---
name: react-native-deployment
description: OTA updates with CodePush, EAS Build, and release configurations. Use when configuring OTA updates, EAS Build, or managing release configs for React Native.
metadata:
  triggers:
    files:
    - 'app.json'
    - 'eas.json'
    - 'android/app/build.gradle'
    - 'ios/**'
    keywords:
    - deployment
    - codepush
    - eas
    - release
    - build
    - fastlane
---
# React Native Deployment

## **Priority: P2 (MAINTENANCE)**

## Workflow: Ship Production Release with EAS Build

1. Configure `eas.json` with development, preview, and production profiles
2. Set environment variables in `.env.production`
3. Run `eas build --platform all --profile production`
4. Verify build artifact on EAS dashboard
5. Submit to stores: `eas submit --platform ios` / `eas submit --platform android`
6. For JS-only hotfixes, publish OTA: `eas update --branch production`

## Over-the-Air (OTA) Updates

### CodePush (Microsoft)

- **JS-Only Updates**: Update JS bundle without app store review.
- **Staging/Production**: Use separate deployments.
- **Install**: `npm install react-native-code-push`
- **Limitations**: Cannot update native code (Obj-C, Java, Swift, Kotlin).

### Expo Updates

- **Expo Projects**: Built-in OTA updates via channels (dev, staging, prod).
- **Install**: `expo install expo-updates`

## Build Configurations

### Expo (EAS Build)

See [deployment reference](references/codepush-setup.md) for EAS build profile configuration and CLI commands.

### React Native CLI

- **Android**: Use `productFlavors` in `build.gradle` (dev, staging, prod).
- **iOS**: Use Xcode schemes.
- **Fastlane**: Automate builds and uploads (`fastlane ios release`).

## Environment Management

- **react-native-config**: `.env` files for API URLs, keys.
- **Separate Configs**: `.env.dev`, `.env.staging`, `.env.production`.

## Anti-Patterns

- **No OTA for Native Changes**: Requires store release.
- **No Secrets in Code**: Use `.env` & CI secrets.
- **No Manual Builds**: Automate with CI/CD.

## References

See [references/codepush-setup.md](references/codepush-setup.md) for CodePush config, EAS profiles, and Fastlane automation.


---

### react-native-dls

---
name: react-native-dls
description: Enforce design token usage in React Native. Use when enforcing a design system, preventing hardcoded styles, or implementing theme tokens in React Native.
metadata:
  triggers:
    files:
    - '**/*Screen.tsx'
    - '**/*Component.tsx'
    - '**/theme/**'
    - '**/styles/**'
    keywords:
    - StyleSheet
    - styled-components
    - theme
    - colors
    - spacing
---
# React Native Design System

## **Priority: P1 (OPERATIONAL)**

Enforce design token usage in React Native apps.

## Guidelines

- **Structure**: Define tokens in `theme/colors.ts`, `spacing.ts`, `typography.ts`.
- **Usage**: Import tokens (`colors.primary`) instead of literals (`#000`).
- **Styling**: Compatible with `StyleSheet` and `styled-components`.

## Anti-Patterns

- **No Inline Colors**: Use `'#FF0000'` → Error. Import from `theme/colors`.
- **No Magic Spacing**: Use `padding: 16` → Error. Use `spacing.md`.
- **No Inline Fonts**: Define `fontSize: 20` → Error. Use `typography.h1`.

## References

See [references/usage.md](references/usage.md) for design token usage examples.

---

### react-native-navigation

---
name: react-native-navigation
description: Set up navigation stacks and deep linking with React Navigation in React Native. Use when setting up navigation stacks or deep linking in React Native with React Navigation.
metadata:
  triggers:
    files:
    - '**/App.tsx'
    - '**/*Navigator.tsx'
    - '**/*Screen.tsx'
    keywords:
    - NavigationContainer
    - createStackNavigator
    - createBottomTabNavigator
    - linking
    - deep link
---
# React Native Navigation

## **Priority: P1 (OPERATIONAL)**


## Configure Type-Safe Navigation

- **Library**: Use `@react-navigation/native-stack` for native performance.
- **Type Safety**: Define `RootStackParamList` for all navigators.
- **Deep Links**: Configure `linking` prop in `NavigationContainer`.
- **Validation**: Validate route parameters (`route.params`) before fetching data.

See [routing patterns](references/routing-patterns.md) for type-safe stack setup and deep linking configuration.

## Anti-Patterns

- **No Untyped Navigation**: `navigation.navigate('Unknown')` leads to errors. Use typed params.
- **No Manual URL Parsing**: Use `linking.config`, not manual string parsing.
- **No Unvalidated Deep Links**: Handle invalid IDs gracefully (e.g., redirect to Home/404).

## References

See [references/routing-patterns.md](references/routing-patterns.md) for typed param lists and deep linking config.

---

### react-native-navigation-v6

---
name: react-native-navigation-v6
description: Configure React Navigation 6+ stacks, tabs, and deep linking for React Native. Use when implementing React Navigation stacks, tabs, or deep linking in React Native.
metadata:
  triggers:
    files:
    - '**/*Navigation*.tsx'
    - 'src/navigation/**'
    keywords:
    - navigation
    - react-navigation
    - stack
    - tab
    - drawer
    - deep link
---
# React Native Navigation

## **Priority: P0 (CRITICAL)**

Use **React Navigation** (official solution).

## Build Type-Safe Navigation Stacks

- **Architecture**: Use **Native Stack (`createNativeStackNavigator`)** by default for native performance. Only use **JS Stack** for custom transitions.
- **Typing**: Use **`NativeStackScreenProps`** for screens. **`CompositeScreenProps`** for nested Navigators.

See [deep linking reference](references/deep-linking.md) for typed param lists and stack navigator setup.

## Configure Deep Linking

- **Deep Linking**: Use **prefix arrays** in `linking` config. Validate **Universal Links (iOS)** and **App Links (Android)**. Handle **unrecognized paths** with 404 screen.

See [deep linking reference](references/deep-linking.md) for linking configuration with prefix arrays and fallback screens.

## Implement Auth Flow

- **Auth/App split**: Conditionally render Auth Stack vs App Stack in `NavigationContainer`. **Clear navigation state** after logout.
- **Logic**: Use **Tab Navigators** for bottom navigation. **Drawer** for side menus.
- **Transitions**: Native-like feel via **`presentation: 'modal'`**. Custom `headerLeft/Right` in `options`.
- **Data Flow**: Use `route.params` for small IDs only. Use **global state (Zustand/RTK)** for complex data objects.

## Anti-Patterns

- **No String Literals**: Use typed params.
- **No Navigation in Business Logic**: Pass callbacks from screens.
- **No Deep Nesting**: Max 2-3 levels of navigators.

## References

See [references/deep-linking.md](references/deep-linking.md) for typed param lists, Universal Links, Nested Navigators, and State Persistence.

---

### react-native-notifications

---
name: react-native-notifications
description: Push notifications for React Native using Firebase or Expo Notifications. Use when integrating push notifications with Firebase or Expo in React Native.
metadata:
  triggers:
    files:
    - '**/*notification*.ts'
    - '**/*notification*.tsx'
    - '**/App.tsx'
    keywords:
    - Notifications
    - messaging
    - FCM
    - expo-notifications
    - react-native-firebase
---
# React Native Notifications

## **Priority: P1 (OPERATIONAL)**


## Guidelines

- **Library**: Choose `@react-native-firebase/messaging` (Bare) or `expo-notifications` (Managed).
- **Setup**: Configure Platform channels (Android) and APNs (iOS).
- **Lifecycle**: Handle Foreground (`onMessage`), Background (`onNotificationOpenedApp`), and Quit (`getInitialNotification`) states.
- **Permissions**: Prime users before requesting system authorization.

See [implementation examples](references/implementation.md) for complete FCM handler setup with permission request and lifecycle handlers.

## Anti-Patterns

- **No Unconditional Requests**: Spamming permission dialogs leads to high denial rates.
- **No Missing Handlers**: Forgetting "Quit" state handling results in lost deep links.
- **No Unvalidated Data**: Blindly trusting payload data causes runtime crashes.

## References

See [references/implementation.md](references/implementation.md) for FCM setup, APNs config, and lifecycle handlers.

---

### react-native-performance

---
name: react-native-performance
description: Optimize React Native rendering for smooth 60fps mobile experiences. Use when optimizing React Native app performance, reducing re-renders, or fixing frame drops.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.ts'
    keywords:
    - FlatList
    - memo
    - useMemo
    - useCallback
    - performance
    - optimization
---
# React Native Performance

## **Priority: P0 (CRITICAL)**

## Tune FlatList for 60fps

- **`windowSize`**: **Reduce to 5-10** for memory-heavy lists (default 21). **`initialNumToRender`** should cover first viewport.
- **`getItemLayout`**: Provide for **fixed-height items**. Skips runtime measurement.
- **`removeClippedSubviews`**: Enable for **Android** (default true) to offload clipped items.
- **`maxToRenderPerBatch`**: Limit to **5-10 items per frame** to prevent JS thread blockage.
- **`keyExtractor`**: Use **stable unique IDs**, never array index.

See [optimization guide](references/optimization-guide.md) for FlatList configuration examples with `getItemLayout`, `windowSize`, and memoization patterns.

## Accelerate Core Rendering

- ** Engine**: Ensure **Hermes engine** enabled (default in 0.7x). Verify via `global.HermesInternal`.
- **Animations**: Use **Native Driver (`useNativeDriver: true`)** or **Reanimated 3** for GPU-accelerated 60fps animations.
- **Re-renders**: Use **`React.memo`** and **`useMemo`** for expensive props. **Profile via Flipper** (React DevTools) for flamegraphs.
- **Network**: Batch API calls. Use **React Query/Zustand** to prevent unnecessary screen refreshes.
- **Images**: Use **`react-native-fast-image`** for caching and priority. Avoid large PNGs; use **WebP**.

## Reduce Bundle and Startup Time

- **Hermes**: Enable for faster startup (default in RN 0.70+).
- **Tree Shaking**: Remove unused imports.
- **ProGuard/R8**: Enable code shrinking on Android.
- **Lazy Screens**: Use `lazy` prop for stack screens (enabled by default).

## Anti-Patterns

- **No ScrollView for Large Lists**: Use FlatList.
- **No Inline Styles**: Use `StyleSheet.create` (optimized).
- **No console.log in Production**: Strip with babel plugin.

## References

See [references/optimization-guide.md](references/optimization-guide.md) for FlatList configuration, memoization rules, and bundle analysis.

---

### react-native-platform-specific

---
name: react-native-platform-specific
description: Resolve iOS and Android differences using Platform API and native modules in React Native. Use when handling platform-specific behavior or integrating native modules in React Native.
metadata:
  triggers:
    files:
      - '**/*.tsx'
      - '**/*.ts'
      - '**/*.ios.*'
      - '**/*.android.*'
    keywords:
      - Platform
      - Platform.select
      - native-module
      - ios
      - android
---

# React Native Platform-Specific Code

## **Priority: P1 (OPERATIONAL)**

## Split Platform-Specific Files

Use `.ios.` and `.android.` for platform-specific files:

See [native modules reference](references/native-modules.md) for platform-specific file naming, `Platform.select` usage, and native bridge examples.

React Native automatically picks right file:

- **iOS**: Button.ios.tsx then Button.tsx (fallback)
- **Android**: Button.android.tsx then Button.tsx (fallback)

## Apply Platform Branching Inline

Use `Platform.select` or `Platform.OS` for small differences within shared file.

## Integrate Native Modules

- **Expo**: Use Expo modules when available (`expo-*` packages).
- **Bare RN**: Use community modules (`@react-native-community/*`).
- **Custom**: Write native modules in Swift/Kotlin when needed.

## Anti-Patterns

- **No Excessive Branching**: Extract to separate files if logic diverges significantly.
- **No Hardcoded Version Checks**: Use feature detection.
- **No Ignoring Android**: Test on both platforms.

## References

See [references/native-modules.md](references/native-modules.md) for Platform detection examples, Native Bridge (iOS/Android), Expo JSI Modules, and SafeArea handling.


---

### react-native-security

---
name: react-native-security
description: Secure storage, network traffic, and deep links in React Native mobile apps. Use when implementing secure storage, certificate pinning, or deep link validation in React Native.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.ts'
    keywords:
    - security
    - keychain
    - secure-storage
    - deep-link
    - certificate-pinning
---
# React Native Security

## **Priority: P0 (CRITICAL)**

## Store Credentials Securely

- **Keychain/Keystore**: Use `react-native-keychain` for tokens, passwords.
- **Never AsyncStorage**: Not encrypted. Only for non-sensitive data.
- **Biometric Auth**: Use `react-native-biometrics` for Face ID/Touch ID.

See [keychain usage reference](references/keychain-usage.md) for Keychain storage with biometric access control.

## Validate Deep Links

- **Validate URLs**: Check scheme and host before navigation.
- **Sanitize Params**: Never trust URL params. Validate and sanitize.
- **Token Extraction**: Avoid passing tokens in deep link URLs. Use secure code exchange.

See [keychain usage reference](references/keychain-usage.md) for deep link URL validation with scheme and host whitelisting.

## Enforce Network Security

- **HTTPS Only**: Enforce via `NSAppTransportSecurity` (iOS) and `network_security_config.xml` (Android).
- **Certificate Pinning**: Use `react-native-ssl-pinning` for high-security apps (banking, healthcare). **Warning**: Requires app update when certificates rotate.
- **No Secrets in Code**: Use `.env` files with `react-native-config`. Add to `.gitignore`.
- **Verify**: Test by attempting plain HTTP requests in dev; confirm they rejected.

## Protect Sensitive Data

- **PII Masking**: Mask email/phone in logs and analytics.
- **Clipboard**: Clear sensitive data after paste.
- **Screenshots**: Block on sensitive screens with `react-native-screen-guard`.
- **Hermes**: Bytecode harder to reverse-engineer. **ProGuard/R8**: Enable on Android.

## Anti-Patterns

- **No Hardcoded Secrets**: Use environment variables.
- **No Sensitive Logs**: Strip `console.log` in production.
- **No Plain HTTP**: Always use HTTPS.
- **No Client-Side Auth**: Validate on backend.

## References

See [references/keychain-usage.md](references/keychain-usage.md) for Keychain, Biometrics, SSL Pinning, and PII Masking.

---

### react-native-state-management

---
name: react-native-state-management
description: Implement local and global state with Context, Zustand, and Redux Toolkit in React Native. Use when choosing or implementing state management in React Native with Context, Zustand, or Redux.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.ts'
    keywords:
    - useState
    - useContext
    - zustand
    - redux
    - state-management
---
# React Native State Management

## **Priority: P1 (OPERATIONAL)**

## State Strategy

- **Local State**: Use `useState` for component-scoped state (forms, UI toggles).
- **Lifted State**: Share between siblings via parent component.
- **Context**: Share across components without prop drilling (theme, auth).
- **Zustand**: Lightweight global state for small-medium apps.
- **Redux Toolkit**: Complex apps with time-travel debugging needs.
- **Server State**: Use `@tanstack/react-query` for API data (caching, refetching).

```tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
```

## Zustand (Recommended for Most Apps)

```tsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Usage
const count = useStore((state) => state.count);
```

## Anti-Patterns

- **No Redux for Everything**: Start with Context/Zustand.
- **No Prop Drilling**: Use Context for global state.
- **No Derived State in State**: Compute in render.

## References

See [references/REFERENCE.md](references/REFERENCE.md) for Context patterns, Zustand store setup, Redux Toolkit, and React Query.

---

### react-native-styling

---
name: react-native-styling
description: Style React Native apps with StyleSheet API, Flexbox, theming, and responsive design. Use when implementing React Native styles, theming, Flexbox layouts, or responsive design.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.ts'
    keywords:
    - StyleSheet
    - style
    - theme
    - responsive
    - flexbox
---
# React Native Styling

## **Priority: P1 (OPERATIONAL)**

## Implementation Guidelines

- **StyleSheet.create**: Always use over inline objects (optimized, validated).
- **Flexbox**: Default layout. No CSS Grid.
- **Responsive**: Use `Dimensions`, `useWindowDimensions`, or percentage widths.
- **Theming**: Centralize colors, fonts in `theme/` folder.
- **Platform Styles**: Use `Platform.select` for conditional styles.
- **Dark Mode**: Use React Context + `useColorScheme()`.

## Responsive Design

```tsx
const { width } = useWindowDimensions();
const isSmall = width < 375;
```

## Anti-Patterns

- **No Inline Styles**: Use `StyleSheet.create`.
- **No Magic Numbers**: Use theme constants.
- **No Absolute Positioning**: Avoid unless necessary.
- **No Fixed Widths**: Use flex or percentages.

## References

See [references/theming.md](references/theming.md) for StyleSheet examples, Design Tokens, Theme Systems, Responsive Scaling, and Shadow Helpers.

---

### react-native-testing

---
name: react-native-testing
description: Test React Native components with Jest and React Native Testing Library. Use when writing Jest or React Native Testing Library tests for React Native components.
metadata:
  triggers:
    files:
    - '**/*.test.tsx'
    - '**/*.spec.tsx'
    - '__tests__/**'
    keywords:
    - test
    - testing
    - jest
    - render
    - fireEvent
    - waitFor
---
# React Native Testing

## **Priority: P1 (OPERATIONAL)**

## Setup

- **Jest**: Pre-configured in React Native.
- **Testing Library**: Use `@testing-library/react-native` for user-centric tests.
- **Mocking**: Use `jest.mock()` for native modules.

## Component Testing

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';

test('increments counter on button press', () => {
  const { getByText, getByRole } = render(<Counter />);
  const button = getByRole('button', { name: /increment/i });

  fireEvent.press(button);

  expect(getByText('Count: 1')).toBeTruthy();
});
```

## Async Testing

```tsx
test('fetches and displays data', async () => {
  const { findByText } = render(<DataComponent />);
  const element = await findByText(/loaded data/i);
  expect(element).toBeTruthy();
});
```

## Best Practices

- **User-Centric**: Use `getByRole`, `getByText` over `testID` when possible.
- **Integration > Unit**: Test features, not implementation.
- **Avoid Snapshots**: Use sparingly. Brittle and hard to review.
- **Coverage**: Aim for 70%+. Focus on critical paths.

## Anti-Patterns

- **No Testing Implementation**: Test behavior, not internals.
- **No testID Overuse**: Prefer accessible queries.

## References

See [references/testing-library.md](references/testing-library.md) for RNTL setup, mocking providers, and integration flow examples.

---

