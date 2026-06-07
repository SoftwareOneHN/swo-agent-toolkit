---
inclusion: manual
---

# Skills: react

> 8 skills. Load when editing react files.
> For code examples and implementation patterns, load `refs-react.md`.

## Index

# react Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **react-component-patterns** | `**/*.jsx`, `**/*.tsx` | component, props, children, composition, hoc, render-props |
| react-testing | `**/*.test.tsx`, `**/*.spec.tsx` | render, screen, userEvent, expect |
| react-tooling | `package.json` | devtool, bundle, strict mode, profile |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| **react-hooks** | useEffect, useCallback, useMemo, useState, useRef, useContext, useReducer, useLayoutEffect, custom hook |
| **react-performance** | waterfall, bundle, lazy, suspense, dynamic |
| **react-security** | dangerouslySetInnerHTML, token, auth, xss, react security, csp, content security policy, sanitize html, secure cookie, jwt react, oauth react, dompurify |
| **react-state-management** | state, useReducer, context, store, props |
| react-typescript | ReactNode, FC, PropsWithChildren, ComponentProps, react typescript, tsx types, props interface, generic component, useState type, useRef type, typed hooks |

> Load matched skills: `<SKILLS>/react/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### react-component-patterns

---
name: react-component-patterns
description: Build modern React component architecture with composition patterns. Use when designing reusable React components, applying composition patterns, or structuring component hierarchies.
metadata:
  triggers:
    files:
    - '**/*.jsx'
    - '**/*.tsx'
    keywords:
    - component
    - props
    - children
    - composition
    - hoc
    - render-props
---
# React Component Patterns

## **Priority: P0 (CRITICAL)**


## Implementation Guidelines

- **Architecture**: Use **Compound Components** (e.g., `<Select><Select.Option /></Select>`) for complex state sharing within UI unit. Use **Higher-Order Components (HOC)** for cross-cutting concerns (e.g., `withAuth`).
- **Composition**: Prefer **Slots** or **Render Props** (`render={(data) => ...}`) over deep prop hierarchies. Use `children` prop for layout-based composition.
- **Components**: Distinguish between **Controlled** (state from props) and **Uncontrolled** (local `useRef` state) components. Favor controlled for form validation.
- **Props**: Use **Explicit TS interfaces**. Avoid **Prop Drilling** by leveraging **Context API** or **Zustand** for global/deeply nested state.
- **Boolean Props**: Shorthand `<Cmp isVisible />` vs `isVisible={true}`.
- **Conditionals**: Ternary (`Cond ? <A/> : <B/>`) over `&&` for rendering consistency (prevents `0` rendering).
- **Function Components**: Only hooks. No classes. Small size (<250 lines). One component per file.
- **Exports**: Named exports only. **PascalCase** naming.

## Anti-Patterns

- **No Classes**: Use hooks.
- **No Prop Drilling**: Use Context/Zustand.
- **No Nested Definitions**: Define components at top level.
- **No Index Keys**: Use stable IDs.
- **No Inline Handlers**: Define before return.

## References

See [references/patterns.md](references/patterns.md) for Composition, Compound Components, and Render Props examples.

---

### react-hooks

---
name: react-hooks
description: Write efficient React functional components and hooks. Use when writing custom hooks, optimizing useEffect, or working with useMemo/useCallback in React.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.jsx'
    keywords:
    - useEffect
    - useCallback
    - useMemo
    - useState
    - useRef
    - useContext
    - useReducer
    - useLayoutEffect
    - custom hook
---
# React Hooks Expert

## **Priority: P0 (CRITICAL)**

**Role**: React Performance Expert. Optimize renders, prevent memory leaks.

## Implementation Guidelines

- **Dependency Arrays**: exhaustive-deps Law. **Objects/arrays recreated each render**, causing **infinite loops** if not handled. Fix by ensuring **objects/arrays memoized** with **`useMemo`** before putting them in deps, or using **`useRef`** for stable refs.
- **Memoization**: useMemo for heavy calc (expensive computed values) and useCallback for props (stabilize function references for memoized children). **Measure first** to avoid premature complexity.
- **Custom Hooks**: Extract logic starting with use... — use `useState` for internal state and return only what's needed.
- **`useEffect`**: Sync with external systems ONLY. **Cleanup required** for subscriptions/event listeners. **Return cleanup function** from effect. Use **`AbortController`** for fetch cleanup to prevent state updates after unmount.
- **`useRef`**: Mutable state without re-renders (DOM, timers, tracking).
- **`useMemo`/`Callback`**: Measure first. Use for stable refs or heavy computation.
- **Stability**: Use `useLatest` pattern (ref) for event handlers to avoid dependency changes; see [useLatest ref pattern example](https://react.gg/hooks/use-latest-ref) for reference implementation.
- **Concurrency**: `useTransition` / `useDeferredValue` for non-blocking UI updates.
- **Initialization**: Lazy state `useState(() => expensive())`.

## Performance Checklist (Mandatory)

- [ ] **Rules of Hooks**: Called at top level? No loops/conditions?
- [ ] **Dependencies**: objects/arrays memoized before passing to deps?
- [ ] **Cleanup**: `useEffect` subscriptions return cleanup functions?
- [ ] **Render Count**: component re-render excessively?

## Anti-Patterns

- **No Missing Deps**: Fix logic, don't disable linter.
- **No Complex Effects**: Break tailored effects into smaller ones.
- **No Derived State**: Compute during render, don't `useEffect` to sync state.
- **No Heavy Init**: Use lazy state initialization `useState(() => heavy())`.

## References

- [Optimization Patterns](references/REFERENCE.md)

---

### react-performance

---
name: react-performance
description: Optimize React rendering, bundle size, and data fetching performance. Use when optimizing React rendering performance, reducing re-renders, or improving bundle size.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.jsx'
    keywords:
    - waterfall
    - bundle
    - lazy
    - suspense
    - dynamic
---
# React Performance

## **Priority: P0 (CRITICAL)**


## Eliminate Data Waterfalls (P0)

- **Parallel Data**: Use **`Promise.all([getUser(), getProducts(), ...])`** for independent fetches. Avoid **sequential awaits** (Request Waterfalls).
- **Preload**: Start fetches before render (in event handlers or **route loaders**).
- **Suspense**: Use **Suspense boundaries** to stream partial content and show partial content early.

See [implementation examples](references/REFERENCE.md#parallel-fetch-with-suspense) for parallel fetch with Suspense boundary and lazy loading patterns.

## Reduce Bundle Size (P0)

- **No Barrel Files**: **Avoid barrel files** (importing from index.ts); import directly from component files to improve tree-shaking.
- **Lazy Load**: Use **`React.lazy`** or **`next/dynamic`** for heavy components like **Charts**, **Modals**, or large libraries.
- **Dependency Reduction**: **Replace moment with dayjs** or **lodash with native/radash** to drop bytes. Use **`source-map-explorer`** or **`bundle-visualizer`** to find bloat.

## Minimize Re-renders (P1)

- **Isolation**: Move state as close to its usage as possible. Isolate heavy UI updates.
- **List Performance**: Use **`react-window`** or **`react-virtual`** for **virtualization** of lists with 500+ items. Wrap list items in **`React.memo`**.
- **Context Splitting**: **Split Context** into `State` and `Dispatch` objects. This prevents all consumers from re-rendering when only setter needed.
- **Stability**: Use **`useMemo` for derived list data** and passing stable object/array references to children.
- **Content Visibility**: `content-visibility: auto` for off-screen CSS content.
- **Static Hoisting**: Extract static objects/JSX outside component scope.
- **Transitions**: `startTransition` for non-urgent UI updates.

## Parallelize Computation (P1)

- **Web Workers**: Move heavy computation (Encryption, Image processing, Large Data Sorting) off main thread using `Comlink` or `Worker`.

## Optimize Server Components (RSC) (P1)

- **Caching**: `React.cache` for per-request deduplication.
- **Serialization**: Minimize props passing to Client Components (only IDs/primitives).

## Anti-Patterns

- **No `export *`**: Breaks tree-shaking.
- **No Sequential Await**: Causes waterfalls.
- **No Inline Objects**: `style={{}}` breaks strict equality checks (if memoized).
- **No Heavy Libs**: Avoid moment/lodash (use dayjs/radash).

## References

See [references/REFERENCE.md](references/REFERENCE.md) for Profiler usage, bundle analysis, Web Workers, and debounce patterns.

---

### react-security

---
name: react-security
description: Prevent XSS, secure auth flows, and harden React client-side applications. Use when preventing XSS, securing auth flows, or auditing third-party dependencies in React.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.jsx'
    keywords:
    - dangerouslySetInnerHTML
    - token
    - auth
    - xss
    - react security
    - csp
    - content security policy
    - sanitize html
    - secure cookie
    - jwt react
    - oauth react
    - dompurify
---
# React Security

## **Priority: P0 (CRITICAL)**


## Prevent XSS Attacks

- **Never use `dangerouslySetInnerHTML`** without sanitization. Use **`DOMPurify.sanitize(input)`** for all user-provided HTML.
- Avoid `javascript:` protocols in `href` or `src`.

See [implementation examples](references/REFERENCE.md#xss-prevention-with-dompurify) for DOMPurify sanitization and secure cookie configuration.

## Secure Authentication

- Store **JWT/Sessions in `HttpOnly` and `Secure` cookies** to prevent theft via XSS. **Never store secrets in `localStorage`** or in built JS bundle.
- **Data Flow**: **Escape all serialized state** if injecting into HTML (e.g., in SSR). Use **Content Security Policy (CSP)** to restrict script sources and prevent inline execution.

## Harden Application Boundaries

- **CSRF Protection**: Use **CSRF tokens** for state-changing requests (PUT/POST/DELETE). Implement **SameSite=Strict** cookies where applicable.
- **Input Sanitization**: Always **validate and sanitize** user inputs on backend. Frontend validation for UX only.
- **Dependency Management**: Run **`npm audit` / `pnpm audit`** regularly. Pin specific dependency versions and use **`npm-check-updates`**.
- **Security Headers**: Ensure server sends **`X-Frame-Options: DENY`**, **`X-Content-Type-Options: nosniff`**, and **`Permissions-Policy`**.

## Anti-Patterns

- **No `eval()`**: RCE risk.
- **No Serialized State**: Don't inject JSON into DOM without escaping.
- **No Client Logic for Permissions**: Backend must validate.

## References

See [references/REFERENCE.md](references/REFERENCE.md) for DOMPurify usage, CSP headers, OAuth2/JWT auth patterns, and CSRF protection.

---

### react-state-management

---
name: react-state-management
description: Select and implement local, global, and server state patterns in React. Use when choosing or implementing state management (Context, Zustand, Redux, React Query) in React.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.jsx'
    keywords:
    - state
    - useReducer
    - context
    - store
    - props
---
# React State Management

## **Priority: P0 (CRITICAL)**


## Implementation Guidelines

- **Selection**: **Zustand for small-medium apps** (minimal boilerplate, no Providers). **Redux Toolkit (RTK) for large apps** needing **time-travel debugging** or complex middleware.
- **Server Data**: **Use React Query or SWR for server state**. **Never sync server data into `useState`** manually. Let **cache source of truth**.
- **Context API**: Use for **low-frequency data** like **theme, auth, locale**, or DI. Not for high-frequency updates (causes global re-renders). **Split Context** between State and Dispatch to optimize.
- **Global Updates**: Use **Zustand, Jotai, or Redux for frequent/complex updates** across app.
- **Local**: `useState` for simple UI toggles. `useReducer` for complex state machines.
- **Derived**: Compute at render time (`const fullName = ...`). No `useEffect` to sync state.
- **URL**: Store filter/sort params in **URL Search Params** (Single Source of Truth).
- **Immutability**: Never mutate. Use spread or Immer. Use `useMemo` on context value to prevent unnecessary re-renders (primitive performance tuning belongs in `hooks` skill).

> **Boundary note**: `hooks` skill covers primitive API usage (`useMemo`, `useCallback` rules). This skill covers _architectural_ state decisions — which tool to use for which state scope.

## Reference & Examples

For Zustand, Redux Toolkit, and TanStack Query patterns:
See [references/REFERENCE.md](references/REFERENCE.md).

## Anti-Patterns

- **No Context for High-Freq**: Use Zustand/Redux for state that changes frequently.
- **No State Sync**: Compute derived values during render; avoid `useEffect` to sync state.
- **No Server Cache as UI State**: React Query/SWR for server data; don't duplicate into `useState`.

---

### react-testing

---
name: react-testing
description: Test React components with RTL and Jest/Vitest. Use when writing React component tests with React Testing Library, Jest, or Vitest.
metadata:
  triggers:
    files:
    - '**/*.test.tsx'
    - '**/*.spec.tsx'
    keywords:
    - render
    - screen
    - userEvent
    - expect
---
# React Testing

## **Priority: P2 (MAINTENANCE)**


## Implementation Guidelines

- **Standards**: Use **React Testing Library (RTL)** with **Vitest or Jest**. Follow **Arrange-Act-Assert (AAA)** pattern.
- **Selection**: Prefer **`getByRole`** / **`findByRole`** to test accessibility. Use **`data-testid`** only as fallback for complex UI.
- **Interactions**: Use **`userEvent` (async)** instead of `fireEvent` to better simulate browser events (e.g., `await user.click(element)`).
- **Asynchrony**: Use **`await screen.findBy*`** for elements that appear later. Use **`waitFor(() => ...)`** for complex non-element updates.
- **Networking**: Mock all API calls with **Mock Service Worker (MSW)**. **Never call real APIs** in unit/integration tests.
- **Architecture**: **Test behavior**, not implementation. Avoid checking internal `state` or `props`. Ensure **100% of P0 flows** covered.
- **Mocks**: **Mock expensive third-party libraries** (e.g., `framer-motion`, `react-router`) or heavy assets to speed up tests.
- **Visuals**: Use **Snapshot testing** sparingly for stable, small UI components. **Manual a11y checks** with `jest-axe`.

## Anti-Patterns

- **No Shallow Rendering**: Render full tree.
- **No Testing Implementation Details**: Don't check `component.state`.
- **No Wait**: Use `findBy`, avoid `waitFor` if possible.

## References

See [references/REFERENCE.md](references/REFERENCE.md) for MSW API mocking, Context testing, form testing, and React Router patterns.

## Code

```tsx
test('submits form', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});
```

---

### react-tooling

---
name: react-tooling
description: Configure debugging, bundle analysis, and ecosystem tools for React applications. Use when setting up Vite/webpack build tooling, analyzing bundle size, debugging re-renders with React DevTools, or configuring ESLint and StrictMode for React projects.
metadata:
  triggers:
    files:
    - 'package.json'
    keywords:
    - devtool
    - bundle
    - strict mode
    - profile
---
# React Tooling

## **Priority: P2 (OPTIONAL)**

## Debugging Workflow

1. **Enable StrictMode** to catch side-effect bugs during development.
2. **Profile** with React DevTools Flamegraph to identify expensive components.
3. **Trace re-renders** using "Highlight Updates" or `why-did-you-render`.
4. **Analyze bundle** with `source-map-explorer` or `rollup-plugin-visualizer` before shipping.

## Setup

See [implementation examples](references/example.md#strictmode--why-did-you-render-setup) for StrictMode, why-did-you-render, and custom hook debug label setup.

## Implementation Guidelines

- **Analysis**: Use `source-map-explorer` or `webpack-bundle-analyzer` / `rollup-plugin-visualizer` (Vite).
- **Linting**: Mandate `eslint-plugin-react-hooks` (exhaustive-deps) and Prettier.
- **Environment**: Use Vite over CRA. Manage environment variables with `.env`.
- **Build**: Configure Terser for production minification. Use `vite-plugin-pwa` for service workers.

## Anti-Patterns

- **No production profiling**: Remove `why-did-you-render` and debug tools before production builds.
- **No skipping StrictMode**: Keep `<React.StrictMode>` in dev to surface side effects early.
- **No CRA for new projects**: Use Vite for faster builds and better DX.


---

### react-typescript

---
name: react-typescript
description: Type React components and hooks with TypeScript patterns. Use when typing React props, hooks, event handlers, or component generics in TypeScript.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    keywords:
    - ReactNode
    - FC
    - PropsWithChildren
    - ComponentProps
    - react typescript
    - tsx types
    - props interface
    - generic component
    - useState type
    - useRef type
    - typed hooks
---
# React TypeScript

## **Priority: P1 (OPERATIONAL)**


## Implementation Guidelines

- **Components**: Prefer **interface/type (`Props`)** over **`React.FC`** (which implicit children). Use **`JSX.Element`** or **`ReactNode`** as return type.
- **Children**: For components that accept children, use **`PropsWithChildren<T>`** or explicitly type them as **`React.ReactNode`**.
- **Events**: Always type event handlers using specific React events, such as **`React.ChangeEvent<HTMLInputElement>`** or **`React.FormEvent<HTMLFormElement>`**.
- **Hooks**: For `useRef`, avoid `any`; use **`useRef<HTMLDivElement>(null)`**. For `useState`, use generics for complex types: **`useState<User | null>(null)`**.
- **Native Elements**: Use **`ComponentPropsWithoutRef<'button'>`** or **`ComponentPropsWithRef`** to extend native attributes safely.
- **Generics**: Implement generic components for reusable UI like lists using **`<T,>(props: ListProps<T>)`**.
- **Discriminated Unions**: Use **Discriminated Unions** for mutually exclusive props (e.g., `success` vs `error` states).
- **Utility Types**: Leverage **`Omit`**, **`Pick`**, and **`Partial`** to transform prop interfaces and avoid redundancy.

## Anti-Patterns

- **No `any`**: Use `unknown`.
- **No `React.FC`**: Implicit children deprecated/bad practice.
- **No `Function`**: Use `(args: T) => void`.

## References

See [references/example.md](references/example.md) for typed props, generic components, and hook ref patterns.

---

