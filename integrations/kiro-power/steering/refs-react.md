---
inclusion: manual
---

# References: react

> 9 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-react.md`.

## react-component-patterns

### REFERENCE

# React Component Patterns Reference

Advanced component patterns and composition techniques.

## References

- [**HOC Pattern**](hoc-pattern.md) - Higher-Order Components.
- [**Render Props**](render-props.md) - Render prop pattern.
- [**Compound Components**](compound-components.md) - Complex component composition.

## Higher-Order Component (HOC)

```jsx
// withAuth.jsx
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (!user) return <Redirect to="/login" />;

    return <Component {...props} user={user} />;
  };
}

// Usage
const ProtectedPage = withAuth(Dashboard);
```

## Render Props Pattern

```jsx
// Mouse tracking example
export function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <p>Mouse position: {x}, {y}</p>
  )}
/>
```

## Compound Components

```jsx
// Accordion component
const AccordionContext = createContext();

export function Accordion({ children }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <AccordionContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = function AccordionItem({ index, children }) {
  return <div className="accordion-item">{children}</div>;
};

Accordion.Header = function AccordionHeader({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(AccordionContext);
  
  return (
    <button onClick={() => setActiveIndex(index === activeIndex ? null : index)}>
      {children}
    </button>
  );
};

Accordion.Body = function AccordionBody({ index, children }) {
  const { activeIndex } = useContext(AccordionContext);
  
  return activeIndex === index ? <div>{children}</div> : null;
};

// Usage
<Accordion>
  <Accordion.Item index={0}>
    <Accordion.Header index={0}>Section 1</Accordion.Header>
    <Accordion.Body index={0}>Content 1</Accordion.Body>
  </Accordion.Item>
</Accordion>
```

## Controlled vs Uncontrolled

```jsx
// Controlled input
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

// Uncontrolled input
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} />;
}
```


---

### patterns

# React Component Patterns

## Composition (The "Slot" Pattern)

Avoid prop drilling by accepting `ReactNode` slots.

```tsx
export function Layout({
  children,
  aside,
}: {
  children: ReactNode;
  aside: ReactNode;
}) {
  return (
    <div className='grid'>
      <aside>{aside}</aside>
      <main>{children}</main>
    </div>
  );
}
```

## Compound Components

Manage implicit state between related components.

```tsx
export function Select({ children }: { children: ReactNode }) {
  const [val, setVal] = useState(null);

  return (
    <SelectContext.Provider value={{ val, setVal }}>
      <select value={val} onChange={(e) => setVal(e.target.value)}>
        {children}
      </select>
    </SelectContext.Provider>
  );
}
```

```tsx
Select.Option = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// Usage
<Select>
  <Select.Option value='1'>One</Select.Option>
  <Select.Option value='2'>Two</Select.Option>
</Select>;
```

## Render Props

Invert control of rendering logic.

```tsx
<List renderItem={(item) => <CustomCard item={item} />} />
```


---

## react-hooks

### REFERENCE

# React Hooks Reference

Advanced custom hooks and patterns.

## References

- [**Custom Hooks Library**](custom-hooks.md) - Common custom hook implementations.
- [**Advanced Patterns**](advanced-patterns.md) - Complex hook compositions.

## Custom Hooks Library

```jsx
// useLocalStorage - Persist state in localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// useDebounce - Debounce a value
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// useWindowSize - Track window dimensions
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// useOnClickOutside - Detect clicks outside an element
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// useIntersectionObserver - Detect element visibility
function useIntersectionObserver(ref, options) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// usePrevious - Get previous value
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// useToggle - Boolean toggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle];
}
```


---

## react-performance

### REFERENCE

# React Performance Reference

Advanced optimization techniques and profiling.

## Parallel Fetch with Suspense

```tsx
// Parallel fetch with Suspense boundary
async function loader() {
  const [user, products] = await Promise.all([getUser(), getProducts()]);
  return { user, products };
}

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Dashboard />
    </Suspense>
  );
}
```

## Lazy Loading Heavy Components

```tsx
// Lazy load heavy components
const Chart = React.lazy(() => import('./Chart'));
const Modal = React.lazy(() => import('./Modal'));
```

## References

- [**Profiling**](profiling.md) - React DevTools Profiler usage.
- [**Bundle Analysis**](bundle-analysis.md) - Analyzing and reducing bundle size.

## React DevTools Profiler

```jsx
// Wrap components to profile
import { Profiler } from 'react';

function onRenderCallback(
  id, // component id
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time without memoization
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

export function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

## Bundle Analysis

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Add to webpack config or use with Vite
npm run build -- --analyze
```

## Image Optimization

```jsx
// Lazy loading images
function OptimizedImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

// Next.js Image component (automatic optimization)
import Image from 'next/image';

function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  );
}
```

## Web Workers for Heavy Computation

```jsx
// worker.js
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
});

// Component
import { useEffect, useState } from 'react';

function HeavyComponent({ data }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    
    worker.postMessage(data);
    worker.onmessage = (e) => {
      setResult(e.data);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [data]);

  return <div>{result}</div>;
}
```

## Debouncing and Throttling

```jsx
import { useDeferredValue, useState } from 'react';

// Built-in deferred value
function SearchResults() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Results query={deferredQuery} />
    </>
  );
}

// Manual debounce
import { useEffect, useState } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```


---

## react-security

### REFERENCE

# React Security Reference

CSP configuration and advanced security patterns.

## XSS Prevention with DOMPurify

```tsx
import DOMPurify from 'dompurify';

// Safe HTML rendering with DOMPurify
function SafeContent({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'a', 'p'] });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

## Secure Cookie Configuration

```tsx
// Secure cookie configuration (server-side)
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes
});
```

## References

- [**Content Security Policy**](csp.md) - CSP headers configuration.
- [**Auth Patterns**](auth-patterns.md) - Secure authentication flows.

## Content Security Policy

```jsx
// Next.js middleware or server config
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

// Vite plugin for CSP
import { defineConfig } from 'vite';
import htmlPlugin from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    htmlPlugin({
      inject: {
        data: {
          csp: cspHeader.replace(/\s+/g, ' ').trim(),
        },
      },
    }),
  ],
});
```

## OAuth2 / JWT Authentication Flow

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Token is in httpOnly cookie, automatically sent
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const userData = await response.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## CSRF Protection

```jsx
// Get CSRF token from cookie or meta tag
function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content;
}

// Include in requests
async function securePost(url, data) {
  const csrfToken = getCsrfToken();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  return response;
}
```

## Rate Limiting on Client

```jsx
// Simple rate limiter for API calls
function createRateLimiter(maxCalls, timeWindow) {
  const calls = [];

  return function rateLimitedFetch(url, options) {
    const now = Date.now();
    
    // Remove old calls outside time window
    while (calls.length > 0 && calls[0] < now - timeWindow) {
      calls.shift();
    }

    if (calls.length >= maxCalls) {
      throw new Error('Rate limit exceeded');
    }

    calls.push(now);
    return fetch(url, options);
  };
}

// Usage: max 10 calls per 60 seconds
const rateLimitedFetch = createRateLimiter(10, 60000);
```


---

## react-state-management

### REFERENCE

# React State Management Reference

Advanced state management with Zustand, Redux Toolkit, and TanStack Query.

## References

- [**Zustand**](zustand.md) - Lightweight state management.
- [**Redux Toolkit**](redux-toolkit.md) - Redux best practices.
- [**TanStack Query**](tanstack-query.md) - Server state management.

## Zustand Store

```jsx
import { create } from 'zustand';

// Simple store
export const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Advanced store with middleware
import { devtools, persist } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        login: (user, token) => set({ user, token }),
        logout: () => set({ user: null, token: null }),
      }),
      { name: 'auth-storage' }
    )
  )
);

// Usage
function Component() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  
  return <button onClick={increment}>Count: {count}</button>;
}
```

## Redux Toolkit

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Immer allows mutation
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Usage with hooks
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  
  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

## TanStack Query (React Query)

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}

// Mutations
function CreateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newUser) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'John' })}>
      Create User
    </button>
  );
}
```


---

## react-testing

### REFERENCE

# React Testing Reference

Advanced testing patterns and integration testing.

## References

- [**Mocking Patterns**](mocking.md) - API, module, and component mocking.
- [**Integration Tests**](integration-tests.md) - Testing component interactions.

## Mocking API Calls

```jsx
// Using MSW (Mock Service Worker)
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({ id, name: 'John Doe', email: 'john@example.com' })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches and displays user', async () => {
  render(<UserProfile userId="1" />);
  
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});

// Override handler for error case
test('handles fetch error', async () => {
  server.use(
    rest.get('/api/users/:id', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  
  render(<UserProfile userId="1" />);
  
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

## Testing Context

```jsx
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function TestComponent() {
  const { user } = useAuth();
  return <div>{user ? user.name : 'Not logged in'}</div>;
}

test('provides auth context', () => {
  const mockUser = { id: '1', name: 'John' };
  
  render(
    <AuthProvider initialUser={mockUser}>
      <TestComponent />
    </AuthProvider>
  );
  
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

## Testing Forms

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

test('submits form with credentials', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();
  
  render(<LoginForm onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'john@example.com',
    password: 'password123',
  });
});

test('shows validation errors', async () => {
  const user = userEvent.setup();
  
  render(<LoginForm />);
  
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});
```

## Testing with React Router

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';

test('renders dashboard at /dashboard', () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MemoryRouter>
  );
  
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});
```

## Component Integration Tests

```jsx
test('user can complete full workflow', async () => {
  const user = userEvent.setup();
  
  render(<App />);
  
  // Navigate to form
  await user.click(screen.getByRole('link', { name: /create user/i }));
  
  // Fill form
  await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
  await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
  
  // Submit
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  // Verify success
  expect(await screen.findByText(/user created/i)).toBeInTheDocument();
});
```


---

## react-tooling

### example

# React Tooling Reference

## StrictMode + why-did-you-render Setup

```tsx
// index.tsx — StrictMode + why-did-you-render setup
import React from 'react';
import ReactDOM from 'react-dom/client';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, { trackAllPureComponents: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

## Custom Hook Debug Label

```tsx
// Custom hook with debug label for DevTools
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
```


---

## react-typescript

### example

# React TypeScript Examples

## Typed Props with Native Element Extension

```tsx
// Extend native button with custom variants
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary';
};

function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <button className={`btn-${variant}`} {...props} />;
}
```

## Generic Component

```tsx
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  render: (item: T) => ReactNode;
};

function List<T>({ items, render, getKey }: ListProps<T>) {
  return <ul>{items.map((item) => <li key={getKey(item)}>{render(item)}</li>)}</ul>;
}

// Usage
<List items={users} getKey={(u) => u.id} render={(u) => <span>{u.name}</span>} />
```

## Hook Ref Typing

```tsx
// DOM ref — must be nullable
const inputRef = useRef<HTMLInputElement>(null);

// Mutable value ref — non-null
const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
```

## Polymorphic `as` Prop Pattern

```tsx
type BoxProps<T extends React.ElementType = 'div'> = {
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

function Box<T extends React.ElementType = 'div'>({ as, ...props }: BoxProps<T>) {
  const Component = as ?? 'div';
  return <Component {...props} />;
}

// <Box as="section" className="wrapper" />
```


---

