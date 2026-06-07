---
inclusion: manual
---

# References: nextjs

> 42 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-nextjs.md`.

## nextjs-app-router

### SELF_HOSTING

# Next.js Self-Hosting Standard

Optimization and configuration for hosting Next.js outside of Vercel (Docker/Nodes).

## **1. Standalone Output**

Mandatory for production containers.

```js
// next.config.js
module.exports = { output: 'standalone' };
```

- **Copy**: You must manually copy `public/` and `.next/static/` into the `standalone/` directory's respective folders for them to be served correctly.

## **2. Distributed Caching (ISR)**

Filesystem cache breaks in multi-instance deployments. Use a shared Cache Handler.

```js
// next.config.js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // Disable local instance memory cache
};
```

**Storage Options**:

- **Redis**: Recommended for most apps.
- **S3**: Good for high-volume static assets.

## **3. Environment Variables**

- **NEXT*PUBLIC***: Baked into the JS bundle at **Build Time**.
- **Server-only**: Loaded at **Runtime** from the environment.

## **4. Image Optimization**

- **Built-in**: Works in Docker but requires `sharp`.
- **External Loader**: Recommended for scale (Cloudinary, Imgix, or Akamai).
  ```js
  // next.config.js
  module.exports = { images: { loader: 'custom' } };
  ```


---

### implementation

# nextjs-app-router Implementation Examples

## Inline Examples

```typescript
// app/(auth)/login/page.tsx — URL is /login, not /auth/login
export default function LoginPage() {
  return <LoginForm />;
}

// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={() => reset()}>Retry</button>;
}
```


---

## nextjs-architecture

### BUNDLING

# Next.js Bundling & Package Compatibility

Fix common bundling issues with third-party packages in Server Components.

## **1. Server-Incompatible Packages**

Packages using browser APIs (`window`, `localStorage`, etc.) fail on the server.

### **Symptoms**

- `ReferenceError: window is not defined`
- `Module not found: Can't resolve 'fs'`

### **Solutions**

1. **Dynamic Import (Client Only)**:
   ```tsx
   import dynamic from 'next/dynamic';
   const NoSSRComponent = dynamic(() => import('@/components/heavy-lib'), {
     ssr: false,
   });
   ```
2. **Externalize from Server Bundle**:
   Use for native bindings (sharp, bcrypt) or problematic ORMs.
   ```js
   // next.config.js
   module.exports = { serverExternalPackages: ['bcrypt'] };
   ```
3. **Client Wrapper**: Wrap the library in a `'use client'` component.

## **2. ESM/CommonJS Compatibility**

If an ESM package fails in a CommonJS project (or vice-versa):

```js
// next.config.js
module.exports = { transpilePackages: ['some-esm-package'] };
```

## **3. Bundle Analysis (v16.1+)**

Analyze build size with the built-in analyzer:

```bash
next experimental-analyze
# next experimental-analyze --output (saves to .next/diagnostics/analyze)
```

## **4. CSS & Polyfills**

- **CSS**: Always use `import './styles.css'` or CSS Modules. Avoid manual `<link>` tags.
- **Polyfills**: Don't load external polyfills (e.g., polyfill.io). Next.js includes `fetch`, `Promise`, `Map`, `Set`, etc., by default.


---

### DEBUG_TRICKS

# Next.js Debugging & MCP Protocol

## **1. MCP AI-Assisted Debugging**

Next.js 16+ exposes a Model Context Protocol endpoint for agents to inspect the app state.

- **Endpoint**: `/_next/mcp`
- **Config (<v16)**: `experimental: { mcpServer: true }`

### **Common AI Tools**

- `get_errors`: Retrieves build and runtime errors with source maps.
- `get_routes`: Lists all filesystem-based routes.
- `get_page_metadata`: Segment trie (layouts/boundaries) for active page.
- `get_logs`: Retrieves dev server log path.

## **2. Build Debugging**

Rebuild specific routes (v16+) to isolate build errors without a full project rebuild.

```bash
# Specific route
next build --debug-build-paths "/dashboard"

# Dynamic route
next build --debug-build-paths "/blog/[slug]"
```

## **3. Hydration Debugging**

Hydration errors (Text content mismatch) usually stem from:

1. Browser-only APIs used in render (`typeof window`, `Date.now()`).
2. Invalid HTML nesting (`<p><div>...</div></p>`).
3. Browser extensions modifying the DOM.

**Fix**: Use `useEffect` + `useState(false)` to defer rendering client-only content until after the first paint.


---

### RSC_BOUNDARIES

# RSC Boundaries & Serialization

Rules for passing data between Server and Client Components.

## **The Golden Rule**

Props passed from Server → Client must be **JSON-serializable**.

## **Forbidden Types**

If you pass these, the app will crash or methods will be stripped:

- **Functions**: (Exception: Server Actions marked with `'use server'`).
- **Date Objects**: Move `.toISOString()` to the server.
- **Class Instances**: Methods are lost; pass a plain object instead.
- **Complex Types**: `Map`, `Set`, `Symbol`.

## **Recommended Patterns**

### 1. Handling Dates

```tsx
// ❌ Server
<ClientComponent date={new Date()} />

// ✅ Server
<ClientComponent date={post.createdAt.toISOString()} />
```

### 2. Handling Functions

```tsx
// ❌ Server
<ClientButton onClick={() => console.log('hit')} />;

// ✅ Client Component
('use client');
export function ClientButton() {
  return <button onClick={() => console.log('hit')}>...</button>;
}
```

### 3. Server Actions (The Exception)

Functions exported from a `'use server'` file CAN be passed as props.

```tsx
// ✅ Valid
import { submitAction } from './actions';
<ClientForm action={submitAction} />;
```

## **Quick Verification**

- [ ] Are all props serializable (Strings, Numbers, Booleans, Plain Objects/Arrays)?
- [ ] Did you convert `Dates` to strings on the server?
- [ ] Are `async` functions strictly limited to Server Components?


---

### RUNTIME_SELECTION

# Next.js Runtime Selection

## **Decision Matrix**

| Feature             | Node.js (Default)       | Edge Runtime                |
| ------------------- | ----------------------- | --------------------------- |
| **Cold Start**      | Good                    | Ultra-fast                  |
| **API Support**     | Full (fs, crypto, etc.) | Limited (Strictly Web APIs) |
| **Connectivity**    | Full TCP/UDP            | Limited                     |
| **Package Support** | High                    | Low (No native bindings)    |

## **Rule of Thumb**

> [!IMPORTANT]
> **Use Node.js by default.** Only use Edge if there is a specific latency requirement or geographic distribution need already established in the project.

## **Usage**

```tsx
// Only if required
export const runtime = 'edge';
```

## **Constraint Checklist**

Before switching to Edge:

1. Does the project already use it? (Consistency)
2. Is every dependency Edge-compatible? (No `fs` or native code)
3. Is latency a critical blocker?


---

### fsd-structure

# Feature-Sliced Design (FSD) Structure

Adapted for Next.js App Router.

## Directory Layout

```text
app/                 # App Layer (Routing & Layouts)
  (app)/             # Public Pages
    page.tsx
  layout.tsx         # Root Provider Setup
  globals.css        # Global Styles

src/                 # Source Content
  widgets/           # Compositional Layers (Header, Footer, Sidebar)
    header/
      ui/
      index.ts

  features/          # User Interactions (AddToCart, FilterList)
    auth-login/
      ui/            # LoginForm.tsx
      model/         # Server Actions, Zod Schemas
      index.ts

  entities/          # Business Models (Product, User)
    product/
      ui/            # ProductCard.tsx (Presentation only)
      model/         # types.ts, complex validation
      index.ts

  shared/            # Reusable, Business-Agnostic
    ui/              # Buttons, Inputs (shadcn)
    lib/             # Utils, Hooks
    api/             # Base fetch wrappers & Simple CRUD
      client.ts
      endpoints/
        orders.ts    # Simple API calls (keep out of entities)
    auth/            # Auth Session/Tokens
      index.ts
    config/          # Env vars
```

## Segments (Inner Structure)

Files inside slices (e.g., `features/login/*`) must follow these standard segment names:

| Segment       | Purpose                      | Examples                                               |
| :------------ | :--------------------------- | :----------------------------------------------------- |
| **`ui/`**     | Visual components            | `LoginForm.tsx`, `ProductCard.tsx`                     |
| **`model/`**  | Business logic, state, types | `actions.ts` (Server Actions), `store.ts`, `schema.ts` |
| **`api/`**    | Remote data interactions     | `fetchProduct()`, `useProductQuery()`                  |
| **`lib/`**    | Helper functions             | `formatCurrency.ts`, `dateUtils.ts`                    |
| **`config/`** | Configuration & constants    | `env.ts`, `constants.ts`                               |

**Note**: Do not use generic folder names like `components/`, `hooks/`, or `utils/` inside slices. Use the semantic segments above.

## Anti-Patterns ("Excessive Entities")

1. **Refactor Later**: Don't start with `entities/`. Put logic in `features/` or `pages/` (slices) first. Extract to `entities/` only when strictly reused.
2. **Auth is Shared**: User session/tokens often belong in `shared/auth` or `shared/session`, not `entities/user`, because they are app-wide context distinct from the business entity "User".
3. **CRUD in Shared**: Simple API endpoints (CRUD) without complex domain logic should go in `shared/api/endpoints/`. Don't create an entity just to wrap a fetch call.

## Layer Responsibilities

1. **App (`app/`)**:
   - **Role**: Entry point. Contains _only_ Next.js routing files (`page.tsx`, `layout.tsx`).
   - **Rule**: Files here should be thin wrappers that import widgets or features.
2. **Widgets (`src/widgets/`)**:
   - **Role**: Assemble features and entities into self-contained blocks (e.g., `Header`, `ProductList`).
3. **Features (`src/features/`)**:
   - **Role**: Handle user scenarios (e.g., `AuthByEmail`, `ToggleTheme`). Contains form logic & Server Actions.
4. **Entities (`src/entities/`)**:
   - **Role**: Business domain concepts. High reuse potential.
   - **Warning**: Avoid "Anemic Domain Models". If it's just data types, put them in `shared/api`.
5. **Shared (`src/shared/`)**:
   - **Role**: UI Kit (Buttons), Utils, API Clients. No business logic.


---

### implementation

# nextjs-architecture Implementation Examples

## Inline Examples

```
App (app/) -> Widgets -> Features -> Entities -> Shared
```

```typescript
// app/dashboard/page.tsx — thin page, imports only widgets/features
import { DashboardWidget } from '@/widgets/dashboard';
export default function DashboardPage() {
  return <DashboardWidget />;
}
```


---

## nextjs-authentication

### auth-implementation

# Authentication Implementation

## 1. Setting Tokens (Server Action)

```typescript
'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  // 1. Backend Call
  // const result = await api.login(formData);
  // Simulated result:
  const result = { accessToken: 'fake_enc_token' };

  // 2. Save Token Securely
  (await cookies()).set('session', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });

  redirect('/dashboard');
}

export async function logout() {
  (await cookies()).delete('session');
  redirect('/login');
}
```

## 2. Reading Tokens (DAL)

```typescript
// lib/auth.ts
import 'server-only';
import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  // return verifyJwt(session);
  return { user: 'simulated' };
}
```

## 3. Middleware Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('session')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (!currentUser && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (currentUser && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Exclude static files
};
```


---

### implementation

# nextjs-authentication Implementation Examples

## Inline Examples

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

```typescript
// app/api/login/route.ts
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const token = await authenticate(email, password);

  (await cookies()).set("session-token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });

  return Response.json({ success: true });
}
```


---

## nextjs-caching

### CACHE_COMPONENTS

# Cache Components (Next.js 16+)

Cache Components enable Partial Prerendering (PPR) - mix static, cached, and dynamic content in a single route.

## **Priority: P0 (CRITICAL)**

## Enable Cache Components

```ts
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true, // Replaces experimental.ppr
};
```

## Content Types & Boundaries

### 1. Static (Build-time)

Synchronous code, pure computations. Prerendered at build time for instant delivery.

### 2. Cached (`'use cache'`)

Async data that doesn't need fresh fetches every request. Use for expensive DB/API calls.

```tsx
async function BlogPosts() {
  'use cache';
  cacheLife('hours');
  const posts = await db.posts.findMany();
  return <PostList posts={posts} />;
}
```

### 3. Dynamic (Streaming)

Runtime data (Cookies, Headers, SearchParams). **Must** be wrapped in `<Suspense>`.

```tsx
<Suspense fallback={<p>Loading...</p>}>
  <UserPreferences />
</Suspense>
```

## The `'use cache'` Directive

### Cache Life Patterns

- `'default'`: 5m stale, 15m revalidate.
- `'hours'`, `'days'`, `'max'`: Common durations.
- **Inline Custom**:

```tsx
cacheLife({
  stale: 3600, // 1 hour
  revalidate: 7200, // 2 hours
  expire: 86400, // 1 day
});
```

### Invalidation Strategies

1. **`updateTag(tag)`**: Immediate invalidation within the same request. Use in Server Actions for instant UI reflect.
2. **`revalidateTag(tag)`**: Background revalidation (Stale-While-Revalidate). Next request gets fresh data.

## **Constraints**

- **No Runtime APIs**: Do not use `cookies()` or `headers()` inside `'use cache'`. Pass them as arguments (they become part of the cache key).
- **Node.js only**: Edge runtime not supported.
- **Explicit Determinacy**: Use `connection()` from `next/server` to force request-time execution for non-deterministic values (`Math.random`).


---

### implementation

# nextjs-caching Implementation Examples

## Inline Examples

```typescript
// app/posts/actions.ts
'use server';
import { revalidateTag } from 'next/cache';

export async function createPost(data: FormData) {
  await db.post.create({ data: { title: data.get('title') as string } });
  revalidateTag('posts'); // purge all fetches tagged 'posts'
}

// app/posts/page.tsx
async function getPosts() {
  return fetch('/api/posts', { next: { tags: ['posts'], revalidate: 60 } });
}
```


---

## nextjs-data-access-layer

### implementation

# nextjs-data-access-layer Implementation Examples

## Inline Examples

```typescript
// lib/dal/users.ts — secure DAL function
import 'server-only';
import { cache } from 'react';
import { auth } from '@/auth';
import { db } from '@/db';

export const getUser = cache(async (id: string) => {
  const session = await auth();
  if (!session) throw new UnauthorizedError();

  const user = await db.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError();

  // Return DTO — never expose passwordHash, internalNotes, etc.
  return { id: user.id, name: user.name, email: user.email };
});
```


---

### patterns

# Data Access Layer Patterns

## Pattern A: API Gateway / BFF (Recommended)

Use when Next.js is a generic frontend for a separate backend (NestJS/Go).

```typescript
import 'server-only';
import { cache } from 'react';
import { getToken } from '@/lib/auth';

const API_URL = process.env.API_GATEWAY_URL;

export const getProjectDetails = cache(async (id: string) => {
  // 1. Forward Auth Headers
  const token = await getToken();

  // 2. Upstream Fetch with Next.js Cache tags
  const res = await fetch(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { tags: [`project-${id}`] },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Upstream API Failed');
  }

  const data = await res.json();

  // 3. UI-Specific DTO Mapping
  return {
    title: data.attributes.title,
    isActive: data.status === 'published',
  };
});
```

## Pattern B: Direct Database

Use when Next.js owns the data (Fullstack).

```typescript
import 'server-only';
import { cache } from 'react';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/prisma';

export const getSafeUserProfile = cache(async (slug: string) => {
  const session = await verifySession();

  // Auth Co-location
  const canView = session.role === 'admin' || session.slug === slug;
  if (!canView) throw new Error('Unauthorized');

  const data = await db.user.findUnique({ where: { slug } });
  if (!data) return null;

  // DTO Transformation
  return {
    id: data.id,
    name: data.name,
    avatar: data.avatarUrl,
  };
});
```


---

## nextjs-data-fetching

### usage-examples

# Next.js Data Fetching Usage Examples

## Server Side: Direct Database/Service Access

Avoid fetching your own API routes from Server Components. Access the database/service layer directly.

```tsx
// Service layer (e.g., in lib/db.ts)
export async function getPosts() {
  'use cache'; // Next.js 16 caching directive
  return db.posts.findMany();
}

// Server Component (e.g., in page.tsx)
export default async function Page() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}
```

## Parallel Fetching

Use `Promise.all()` to prevent waterfalls when fetching multiple independent resources.

```tsx
const [user, posts] = await Promise.all([getUser(id), getPosts()]);
```

## Client-Side Fetching (SWR/React Query)

Use for user-specific data that doesn't require SEO.

```tsx
'use client';
import useSWR from 'swr';

function UserProfile() {
  const { data, error } = useSWR('/api/user', fetcher);
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return <div>Hello {data.name}!</div>;
}
```


---

## nextjs-i18n

### implementation

# nextjs-i18n Implementation Examples

## Inline Examples

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "vi"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```


---

### next-intl

# next-intl in Next.js

Best practices for using `next-intl` for type-safe internationalization in the App Router.

## Principles

1.  **Server-Side First**: Use `getMessages()` and `NextIntlClientProvider` to pass messages to the client.
2.  **Type Safety**: Define your message structure to get autocomplete for keys.
3.  **Middleware Routing**: Use the `next-intl` middleware for automatic locale detection and routing.

## Implementation Example

```tsx
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}));
```

## Anti-Patterns

- **Direct JSON Imports**: Do not import translation JSONs directly into components. Use `useMessages()` or `useTranslations()`.
- **Client-Side Locale Detection**: Avoid manual cookie parsing for locale detection; rely on the middleware.


---

### react-intl

# react-intl Patterns for Next.js

Standardized setup for `react-intl` to ensure no hardcoded user-facing strings and proper SSR support.

## Guidelines

- **Use useIntl Hook**: Prefer the `intl.formatMessage` hook for dynamic strings in functional components.
- **FormattedMessage Components**: Use `<FormattedMessage />` for static text in JSX.
- **Hierarchical Keys**: Use descriptive, dot-notated keys (e.g., `cart.order_summary.total`) to organize large dictionary files.

## Performance

- **Selective Loading**: Only load the specific locale JSON file needed for the current request.
- **SSR Hydration**: Ensure the `IntlProvider` is initialized on the server with the correct locale and messages to prevent hydration mismatch.

## Anti-Patterns

- **Inline Conditionals**: Do not use `condition ? 'Yes' : 'No'`. Use two distinct localized keys.
- **Raw Strings**: Never commit `<span>Submit</span>`. Always use the translation engine.


---

## nextjs-optimization

### example

# References

Move large code blocks here.

## Inline Examples

```tsx
import Image from 'next/image';

// Above-the-fold hero — priority for LCP, sizes for responsive
<Image src="/hero.jpg" alt="Hero" width={1200} height={600}
  priority sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur" blurDataURL={blurHash} />
```

```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return <body className={inter.className}>{children}</body>;
}
```

```tsx
// Static metadata
export const metadata: Metadata = { title: 'Dashboard', description: '...' };

// Dynamic metadata for parameterized routes
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return { title: product.name, openGraph: { images: [product.image] } };
}
```


---

## nextjs-pages-router

### feature-sliced-design-pages

# Feature-Sliced Design (FSD) for Pages Router

In a large Next.js Pages Router monolith, the worst anti-pattern is giant page files or "God Components" handling heavy UI mapping and Business Logic simultaneously.

The AI must strictly adhere to FSD:

## Structure

```text
pages/
└── cart.tsx                    <-- Thin route

src/
├── features/
│   └── cart/
│       ├── components/         <-- UI only (CartItem, OrderSummary)
│       ├── services/           <-- Pure logic (API calls)
│       └── CartFeature.tsx     <-- Assembles UI and handles main state
└── shared/
    ├── ui/                     <-- Global UI (Button, Modal)
    └── utils/                  <-- Globally shared utilities
```

## How to Execute Work

1. `pages/cart.tsx` is only responsible for returning `<CartFeature />` and exporting `getServerSideProps` if Server-Side Rendering is needed for SEO/Auth.
2. `<CartFeature />` ties together the `useCartCalculations` hook and the presentation components `<CartItem />`.
3. Massive logic blocks (like Redux `useSelector` subscriptions or complex `useEffect` chains) are extracted into custom hooks (e.g., `src/features/cart/hooks/useCartData.ts`).
4. **Avoid direct Redux imports** inside low-level presentation components (`components/`). Pass needed data via props from the Feature wrapper, or keep the Redux hook localized strictly to the Feature wrapper or custom hooks.


---

### implementation

# nextjs-pages-router Implementation Examples

## Inline Examples

```typescript
// pages/posts/[id].tsx
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await postService.findById(params!.id as string);
  if (!post) return { notFound: true };
  return { props: { post } };
};

export default function PostPage({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <article>{post.title}</article>;
}
```


---

### server-side-props

# SSR Data Fetching

```tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await getPostData(context.params?.id);
  return { props: { data } };
};
```


---

## nextjs-rendering

### SUSPENSE_BAILOUT

# Next.js Suspense Bailout Rules

Certain hooks cause an "Opt-out" of Static Generation, forcing a CSR (Client-Side Rendering) bailout for the entire page if not wrapped in a `<Suspense>` boundary.

## **1. useSearchParams()**

Always requires a Suspense boundary in static routes.

```tsx
// Bad: Entire page becomes CSR
'use client'
import { useSearchParams } from 'next/navigation'
function SearchBar() { ... }

// Good: Wrap the component
import { Suspense } from 'react'
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchBar />
    </Suspense>
  )
}
```

## **2. usePathname()**

Requires a Suspense boundary when used in dynamic routes (`[slug]`), unless `generateStaticParams` is used.

## **Quick Reference**

| Hook                | Suspense Required?       |
| ------------------- | ------------------------ |
| `useSearchParams()` | **YES** (Static routes)  |
| `usePathname()`     | **YES** (Dynamic routes) |
| `useParams()`       | NO                       |
| `useRouter()`       | NO                       |


---

### implementation-details

# Next.js Rendering Implementation Details

## Static Rendering (SSG)

- **Behavior**: Rendered at build time.
- **Use**: Marketing, blogs, docs.
- **Dynamic Routes**: Use `generateStaticParams` for pre-rendering specific paths.

## Dynamic Rendering (SSR)

- **Behavior**: Rendered per request.
- **Triggers**:
  - `cookies()`, `headers()`, `searchParams`
  - `fetch(..., { cache: 'no-store' })`
  - `export const dynamic = 'force-dynamic'`

## Streaming (Suspense)

- **Problem**: SSR blocks the entire page until data is ready.
- **Solution**: Wrap slow components in `<Suspense>` to stream parts of the page progressively.

## Incremental Static Regeneration (ISR)

- **Behavior**: Update static content post-build without a full rebuild.
- **Time-based**: `export const revalidate = 3600;`
- **On-Demand**: `revalidatePath('/posts')` via Server Actions or Webhooks.

## Partial Prerendering (PPR)

- **Behavior**: Static shell with dynamic "holes" filled at runtime.
- **Config**: `ppr: 'incremental'` in `next.config.ts`.


---

### implementation

# nextjs-rendering Implementation Examples

## Inline Examples

```typescript
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetch(`/api/posts/${slug}`, { next: { revalidate: 3600 } });
  return <article>{post.title}</article>;
}
```


---

### scaling-patterns

# Scaling Patterns for Next.js Rendering

## 1. The "Static Shell" Pattern (Recommended)

### Goal

Maximize CDN cache hits by making the page structure static while streaming dynamic content.

### Pattern

**Static Parts** (rendered at build/ISR time):

- Layout/Shell (Logo, Navigation, Footer)
- Page structure and styling
- Common UI elements

**Dynamic Parts** (streamed at request time):

- User-specific data (Profile, Cart Count)
- Personalized recommendations
- Real-time data (Stock prices, notifications)

### Implementation

```tsx
// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div>
      {/* Static shell - cached at CDN */}
      <header>
        <Logo />
        <Navigation />
      </header>

      <main>
        {/* Dynamic holes - streamed */}
        <Suspense fallback={<ProfileSkeleton />}>
          <UserProfile />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <LiveChart />
        </Suspense>
      </main>

      {/* Static footer */}
      <Footer />
    </div>
  );
}
```

### Result

- **TTFB (Time to First Byte)**: ~50ms (static shell from CDN)
- **Perceived Performance**: Instant, even with slow database
- **User Experience**: Progressive loading with skeletons
- **Scaling**: Minimal server load, CDN handles traffic

---

## 2. Avoiding "SSR Waterfalls"

### Problem: Sequential Blocking

In naive SSR implementations, the server waits for **every** data fetch to complete before sending **any** HTML to the browser.

**Example Scenario**:

```bash
Database Call:     200ms
Auth Check:        100ms
3rd Party API:     500ms
------------------------
Total Blocking:    800ms ← Blank screen!
```

### Anti-Pattern: Root-Level Sequential Awaits

```tsx
// ❌ BAD: All fetches block initial HTML
export default async function Page() {
  const user = await fetchUser(); // 200ms
  const permissions = await checkAuth(); // 100ms
  const data = await fetchExternal(); // 500ms

  // User sees nothing for 800ms!
  return <Dashboard user={user} permissions={permissions} data={data} />;
}
```

### Solution: Push Fetches Down + Suspense

```tsx
// ✅ GOOD: Instant shell, progressive content
export default function Page() {
  return (
    <div>
      {/* Shell renders immediately */}
      <Header />

      <Suspense fallback={<Skeleton />}>
        <UserSection /> {/* Fetches user internally */}
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <DataSection /> {/* Fetches data internally */}
      </Suspense>
    </div>
  );
}

// UserSection.tsx
async function UserSection() {
  const user = await fetchUser(); // Parallel with DataSection
  return <Profile user={user} />;
}
```

### Benefits

- **Parallel Fetching**: All data fetches happen simultaneously
- **Progressive Rendering**: Shell appears in ~50ms
- **Better UX**: User sees structure immediately, not a blank screen
- **Lower Abandonment**: Faster perceived load time

---

## 3. Combining Strategies

### Hybrid Approach: ISR + Streaming

```tsx
// app/product/[id]/page.tsx

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function ProductPage({ params }) {
  return (
    <div>
      {/* Static/ISR parts */}
      <ProductImages id={params.id} />
      <ProductDescription id={params.id} />

      {/* Real-time parts */}
      <Suspense fallback={<StockSkeleton />}>
        <LiveStockInfo id={params.id} />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <RecentReviews id={params.id} />
      </Suspense>
    </div>
  );
}
```

**Result**:

- Product info cached for 1 hour (ISR)
- Stock and reviews always fresh (Streaming)
- Fast TTFB + accurate data

---

## Performance Metrics

| Pattern         | TTFB  | FCP   | LCP   | Server Cost |
| :-------------- | :---- | :---- | :---- | :---------- |
| All SSR (Naive) | 800ms | 850ms | 900ms | High        |
| Static Shell    | 50ms  | 100ms | 400ms | Low         |
| ISR + Streaming | 50ms  | 100ms | 350ms | Medium      |

**Legend**:

- TTFB: Time to First Byte
- FCP: First Contentful Paint
- LCP: Largest Contentful Paint


---

### strategy-matrix

# Strategy Selection Matrix

Choose the right rendering strategy based on your requirements for data freshness, performance, and scaling characteristics.

## Comparison Matrix

| Strategy | Ideal For              | Data Freshness       | Performance (TTFB)          | Scaling Risk                         |
| :------- | :--------------------- | :------------------- | :-------------------------- | :----------------------------------- |
| **SSG**  | Marketing, Docs, Blogs | Build Time           | **Instant** (CDN)           | **None**                             |
| **ISR**  | E-commerce, CMS        | Periodic (e.g., 60s) | **Instant** (CDN)           | **Low** (Background Rebuilds)        |
| **SSR**  | Dashboards, Auth Gates | Real-Time (Request)  | **Slow** (Waits for Server) | **Critical** (1 Request = 1 Compute) |
| **PPR**  | Personalized Apps      | Hybrid               | **Instant** (Shell)         | **Medium** (Streaming Holes)         |

## Decision Guide

### Use SSG when

- Content changes infrequently (e.g., blog posts, marketing pages)
- All users see the same content
- Maximum performance is critical (CDN edge caching)
- Zero scaling concerns

### Use ISR when

- Content updates periodically but not in real-time
- You have many pages and rebuilding all is expensive
- E-commerce product pages, CMS content
- Balance between freshness and performance

### Use SSR when

- Data must be fresh on every request
- User-specific content (dashboards, auth gates)
- Cannot be cached (personalized data)
- Accept slower TTFB for real-time accuracy

### Use PPR when

- Mix of static shell and dynamic content
- Want instant perceived performance
- Personalized sections within otherwise static pages
- Modern approach combining best of SSG + SSR

## Cost Implications

**SSG/ISR**: Lowest cost - CDN bandwidth only, no compute per request  
**SSR**: Highest cost - Server compute on every request (can scale exponentially)  
**PPR**: Medium cost - CDN for shell + server for dynamic holes


---

## nextjs-security

### implementation

# Next.js Security Reference

## Server Action Validation (Zod)

```ts
// app/actions.ts
const schema = z.object({
  email: z.string().email(),
});

export async function submit(formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: 'Invalid' };
  // ... secure logic
}
```

## Data Boundary (DTO)

```tsx
// app/profile/page.tsx
const user = await db.getUser();

// GOOD: Pass only needed fields
return <Profile user={{ name: user.name }} />;

// BAD: Pass the whole object (leaking passwordHash)
return <Profile user={user} />;
```

## Inline Examples

```typescript
// app/posts/actions.ts
'use server';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const CreatePostSchema = z.object({ title: z.string().min(1).max(200) });

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const { title } = CreatePostSchema.parse({ title: formData.get('title') });
  await db.post.create({ data: { title, authorId: session.user.id } });
  revalidateTag('posts');
}
```


---

## nextjs-server-actions

### secure-actions

# Secure Server Actions

## Validation & Type Safety

Always validate `FormData` on the server using a schema library like `zod`.

```tsx
// actions.ts
'use server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  content: z.string().min(10),
});

export async function submitFeedback(prevState: any, formData: FormData) {
  const validated = schema.safeParse({
    email: formData.get('email'),
    content: formData.get('content'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // Proceed with authorized DB mutation
  await db.feedback.create({ data: validated.data });

  revalidatePath('/feedback');
  return { success: true };
}
```

## State Management with `useActionState`

Use the `useActionState` hook (React 19) to handle server state, errors, and pending status in the client.

```tsx
// FeedbackForm.tsx
'use client';
import { useActionState } from 'react';

export function FeedbackForm() {
  const [state, action, isPending] = useActionState(submitFeedback, null);

  return (
    <form action={action}>
      <input name='email' type='email' />
      {state?.errors?.email && <span>{state.errors.email}</span>}
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```


---

## nextjs-server-components

### composition-security

# RSC Composition & Security

## Server-in-Client Composition

You cannot import a Server Component directly into a Client Component. Instead, pass the Server Component as a `children` prop.

```tsx
// Page.tsx (Server Component)
import ClientWrapper from './ClientWrapper';
import ServerContent from './ServerContent';

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />
    </ClientWrapper>
  );
}

// ClientWrapper.tsx (Client Component)
('use client');
export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='client-context'>{children}</div>;
}
```

## Security with `server-only`

Prevent accidental bundling of server-side logic (e.g., database clients, API secrets) into client-side JS.

```bash
npm install server-only
```

```tsx
// lib/db.ts
import 'server-only';
export const db = new Database();
```

If a Client Component tries to import `lib/db.ts`, Next.js will throw a build error.


---

### example

# References

Move large code blocks here.

## Inline Examples

```typescript
// app/dashboard/page.tsx (Server Component)
import { ClientTabs } from './client-tabs';
export default async function Dashboard() {
  const data = await db.metrics.findMany();
  return (
    <ClientTabs>
      <MetricsTable data={data} /> {/* Server Component passed as children */}
    </ClientTabs>
  );
}

// app/dashboard/client-tabs.tsx
'use client';
export function ClientTabs({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState(0);
  return <div>{tab === 0 ? children : <Settings />}</div>;
}
```


---

## nextjs-state-management

### implementation

# nextjs-state-management Implementation Examples

## Inline Examples

```tsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

function SearchFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  function updateQuery(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', term);
    router.replace(`?${params.toString()}`);
  }
  return <input onChange={(e) => updateQuery(e.target.value)} />;
}
```

```tsx
// Automated caching, deduplication, and revalidation
const { data, error } = useSWR('/api/user', fetcher, {
  refreshInterval: 30000,
});
```

```tsx
// store.ts — minimal Zustand store
import { create } from 'zustand';
export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
}));
```


---

### redux

# Redux Toolkit (RTK) in Next.js

Best practices for integrating Redux Toolkit in Next.js projects, following the [Official Redux Style Guide](https://redux.js.org/style-guide/).

## **Priority: P1 (STANDARD)**

Follow these essential rules to ensure a scalable, performant, and maintainable state.

## Core Rules

1.  **Use Redux Toolkit (RTK)**: Always use `createSlice` and `configureStore`. Never write manual action creators or reducers.
2.  **Strict Immutability**: Never mutate state. RTK uses **Immer** internally, so you can write "mutative" code that is safely translated to immutable updates.
3.  **Actions as Events**: Treat actions as "describing events that occurred" (e.g., `cart/itemAdded`) rather than "setters" (`cart/setItems`).
4.  **Put Logic in Reducers**: Move as much logic as possible into reducers rather than in the component that dispatches the action.
5.  **Derive State**: Keep the store state minimal. Use **Selectors** (with `reselect`) to derive data (e.g., `selectVisibleTodos`).

## Folder Structure (Ducks Pattern)

Organize code by **feature**, not by type (reducers/actions/constants). Each feature folder should contain its own slice logic.

```text
src/features/
  ├── auth/
  │   ├── authSlice.ts    # Contains reducer, actions, and selectors
  │   └── login-form.tsx
  └── cart/
      └── cartSlice.ts
```

## Next.js Integration (App Router)

To avoid state leakage between requests in a multi-tenant environment:

### 1. Per-Request Store

Always create a new store instance for every request on the server.

```tsx
// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

### 2. Store Provider Wrapper

Wrap client components that need Redux with a local provider to ensure the store is unique to the client session.

```tsx
// src/app/StoreProvider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
```

## Next.js Integration (Pages Router)

For legacy projects using the `pages/` directory, use `next-redux-wrapper` to handle server-side state synchronization.

### 1. Store Configuration

Use a wrapper to create a new store per request.

```tsx
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from './authSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
```

### 2. Handling Hydration

You must handle the `HYDRATE` action from `next-redux-wrapper` in your reducers to sync server-side data into the client store.

```tsx
// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    /* ... */
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      // Merge server-side state into client-side state
      return {
        ...state,
        ...action.payload.auth,
      };
    });
  },
});
```

### 3. Usage in Pages

```tsx
// pages/profile.tsx
import { wrapper } from '../store';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // Dispatch actions on the server
    await store.dispatch(fetchUser(context.params.id));
    return { props: {} }; // Data will be hydrated automatically
  },
);
```

## Data Fetching (RTK Query)

Avoid using `useEffect` or manual thunks for data fetching. Use **RTK Query** for automated caching, deduplication, and loading states.

```tsx
// src/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => '/users' }),
  }),
});

export const { useGetUsersQuery } = apiSlice;
```

## Anti-Patterns

- **Non-Serializable Values**: Never put Promises, Symbols, or Functions into the Redux state.
- **Connecting Everything**: Do not connect every tiny component to Redux. Use local `useState` for UI state (e.g., `isDropdownOpen`).
- **Sequential Dispatches**: Avoid dispatching multiple actions in a row. Use a single action that describes the event, and let multiple reducers respond.
- **Static Global Store**: Never use `export const store = configureStore(...)` in a Next.js app that uses SSR.


---

### url-state

# URL-Driven State in Next.js

Best practices for using the URL as the source of truth for shareable state like search filters, pagination, and sorting in Next.js App Router.

## **Priority: P1 (STANDARD)**

Using the URL for state ensures that users can bookmark pages, share links with specific filters applied, and use the browser's back/forward buttons as expected.

## Core Principles

1. **URL as Source of Truth**: For any state that should be shareable or persist across page refreshes (e.g., search queries, active tabs, filters), use the URL.
2. **Read from `searchParams`**: In Server Components, access via the `searchParams` prop. In Client Components, use the `useSearchParams()` hook.
3. **Update with `useRouter`**: Use `router.push()` or `router.replace()` to update the URL.
4. **Debounce Search Inputs**: When updating the URL based on text input, use a debounce to avoid excessive navigation and re-renders.

## Implementation Example (Client Component)

```tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className='relative'>
      <input
        type='text'
        placeholder='Search...'
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
      />
      {isPending && (
        <div className='absolute right-3 top-3 animate-spin'>🌀</div>
      )}
    </div>
  );
}
```

## Implementation Example (Server Component)

```tsx
import { Suspense } from 'react';
import { fetchFilteredData } from '@/lib/data';
import DataList from '@/components/DataList';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || '';
  const currentPage = Number(params.page) || 1;

  return (
    <main>
      <h1>Search Results</h1>
      <Suspense key={query + currentPage} fallback={<Skeleton />}>
        <DataList query={query} page={currentPage} />
      </Suspense>
    </main>
  );
}
```

## When to Use URL vs. Local State

| State Type        | Storage Location      | Shareable? | Example                          |
| :---------------- | :-------------------- | :--------- | :------------------------------- |
| **Search/Filter** | URL Params            | ✅ Yes     | `?q=laptop&sort=price_asc`       |
| **Pagination**    | URL Params            | ✅ Yes     | `?page=3`                        |
| **Tabs/Modals**   | URL Params (Optional) | ✅ Yes     | `?tab=specs` or `?modal=login`   |
| **Form Input**    | Local `useState`      | ❌ No      | Uncommitted text in a name field |
| **UI Toggles**    | Local `useState`      | ❌ No      | "Show more" dropdown state       |
| **Global UI**     | Context / Zustand     | ❌ No      | Theme (Dark/Light), Sidebar open |

## Anti-Patterns

- **Duplicate State**: Storing the same value in both a `useState` variable and the URL. Synchronize them instead.
- **Missing `Suspense`**: Not wrapping components that use `useSearchParams` in `<Suspense>`, which can lead to client-side de-optimization.
- **Hard-coded URL Strings**: Building URLs with string concatenation. Always use `URLSearchParams` to ensure valid encoding.
- **Unnecessary `router.push`**: Using `push` (adding to history) when `replace` (updating current entry) would be more appropriate for filter changes.


---

### zustand

# Zustand in Next.js

Best practices for using Zustand, a lightweight and flexible state management library, following community standards (e.g., [TKDodo's Recommendations](https://tkdodo.eu/blog/working-with-zustand)).

## **Priority: P1 (STANDARD)**

Focus on performance through atomic subscriptions and clean state/action separation.

## Core Rules

1.  **Atomic Selectors**: Always select only the piece of state you need to avoid unnecessary re-renders.
2.  **Separate Actions from State**: Group functions that update state into a separate `actions` object within the store.
3.  **Only Export Custom Hooks**: Hide the base store hook and only export specific hooks for state and actions.
4.  **Actions as Events**: Model actions as "events" (`cart/itemAdded`) rather than simple "setters" (`cart/setCount`), keeping logic in the store.

## Implementation Example

```tsx
// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
  name: string;
  age: number;
  actions: {
    setName: (name: string) => void;
    incrementAge: () => void;
  };
}

// ⬇️ Private base hook
const useUserBase = create<UserState>((set) => ({
  name: '',
  age: 0,
  actions: {
    setName: (name) => set({ name }),
    incrementAge: () => set((state) => ({ age: state.age + 1 })),
  },
}));

// 💡 Export specific custom hooks
export const useUserName = () => useUserBase((state) => state.name);
export const useUserAge = () => useUserBase((state) => state.age);
export const useUserActions = () => useUserBase((state) => state.actions);
```

## Next.js Integration (App Router)

To handle hydration safely and avoid "Text content did not match" errors:

```tsx
// src/hooks/useHasHydrated.ts
import { useState, useEffect } from 'react';

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  return hasHydrated;
}
```

Usage in components:

```tsx
'use client';
import { useUserName } from '@/store/useUserStore';
import { useHasHydrated } from '@/hooks/useHasHydrated';

export function ProfileHeader() {
  const name = useUserName();
  const hydrated = useHasHydrated();

  // Show nothing or a skeleton until client hydration is complete
  if (!hydrated) return null;
  return <h1>Welcome, {name}</h1>;
}
```

## Next.js Integration (Pages Router)

In the Pages Router, state is typically initialized on the client. However, if you need to sync server-side data (from `getServerSideProps`) into Zustand, use a **Context Provider** to ensure a fresh store instance per request.

### 1. Store Factory

```tsx
// src/store/useStore.ts
import { createStore } from 'zustand';

export const createMyStore = (initState: any) => {
  return createStore((set) => ({
    ...initState,
    // actions...
  }));
};
```

### 2. Context Provider

```tsx
// src/store/Provider.tsx
import { createContext, useContext, useRef } from 'react';
import { createMyStore } from './useStore';

const StoreContext = createContext(null);

export const StoreProvider = ({ children, initialState }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createMyStore(initialState);
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (selector) => {
  const store = useContext(StoreContext);
  return store(selector);
};
```

### 3. Usage in \_app.tsx

```tsx
// pages/_app.tsx
import { StoreProvider } from '@/store/Provider';

export default function App({ Component, pageProps }) {
  return (
    <StoreProvider initialState={pageProps.initialZustandState}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}
```

## Anti-Patterns

- **Massive Hooks**: Avoid `const { name, age, actions } = useUserStore()`. This subscribes the component to EVERY change in the store.
- **Direct State Mutation**: Never mutate state outside of the `set` function.
- **Static Stores for SSR**: Do not use a single static store if you need to initialize it with dynamic server data. Use the custom hook/context pattern if you must sync server data into Zustand.
- **Logic in Components**: Don't calculate the new state in the component. Call `actions.doSomething()` and let the store handle the math.


---

## nextjs-styling

### ant-design

# Ant Design in Next.js

Guidelines for using Ant Design effectively in Next.js, especially with the App Router and Server Components.

## RSC Compatibility

Ant Design (and most component libraries with runtime CSS-in-JS) requires specific handling for React Server Components.

1.  **Strict Client Borders**: Always wrap AntD components in a Client Component.
2.  **Theme Configuration**: Use the `ConfigProvider` for global styling.

```tsx
// src/components/ui/AntdRegistry.tsx
'use client';

import React, { useState } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

export default function AntdRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => createCache());
  useServerInsertedHTML(() => (
    <style
      id='antd'
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
```

## Performance

- **Tree Shaking**: Ensure your build setup supports tree shaking for `antd` to avoid bloated bundles.
- **Static Extraction**: When possible (Pages Router), utilize static CSS extraction.

## Guidelines

- **Form Management**: Use `Form` from `antd` for complex validations. Use the `form` instance hook.
- **Table Patterns**: Use `Table` with standard columns definitions. Manage sorting/filtering via state.
- **Modals**: Prefer the `Modal.method()` syntax (e.g., `Modal.confirm`) for simple alerts.
- **Customization**: Use the `ConfigProvider` for global theme tokens. Avoid overrides in global CSS.

## Anti-Patterns

- **Direct RSC Usage**: Do not use `import { Button } from 'antd'` directly in a Server Component without a `'use client'` wrapper.
- **No Custom Buttons**: Use `<Button />` from `antd`, do not build raw `<button>` elements.
- **No Manual Modals**: Avoid building custom "Glass" modals from scratch if `Modal` suffice.
- **No Mixed UI**: Do not mix `antd` with `MUI` or `Bootstrap`.


---

### implementation

# nextjs-styling Implementation Examples

## Inline Examples

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// usage in a component
<button className={cn('px-4 py-2 rounded', isActive && 'bg-blue-500 text-white')}>Click</button>
```


---

### scss

# SCSS & SASS in Next.js

Best practices for using SCSS for styling in Next.js projects.

## Standards

1.  **SCSS Modules**: Always use `.module.scss` to ensure styles are scoped and prevent global namespace collisions.
2.  **Variables and Mixins**: Centralize your theme tokens in a `styles/variables.scss` or `styles/mixins.scss` file.
3.  **No Global Pollution**: Only use global SCSS for resets and root-level CSS variables in `app/globals.scss` or `pages/_app.tsx`.

## Setup

In `next.config.js`:

```js
const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss";`, // Auto-inject variables into every module
  },
};
```

## Anti-Patterns

- **Deep Nesting**: Avoid nesting more than 3 levels deep. It makes CSS hard to maintain and increases specificity unnecessarily.
- **Direct Global Styles**: Avoid `@import` in component-level SCSS that produces global side effects.


---

### tailwind

# Styling Implementation

## Dynamic Classes Utility

Standard `cn` helper for shadcn/ui and Tailwind.

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Component Usage Example

```typescript
// components/ui/button.tsx
export function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        // Base styles
        "px-4 py-2 rounded font-medium transition-colors",
        // Conditional variants
        variant === 'primary' && "bg-blue-500 text-white",
        // External overrides
        className
      )}
      {...props}
    />
  );
}
```

## Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```


---

## nextjs-testing

### implementation

# Next.js Testing Reference

## Vitest & React Testing Library (Unit)

```tsx
// tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

test('renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeDefined();
});
```

## Playwright (E2E)

```ts
// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/);
});
```

## Mock Service Worker (MSW)

```ts
// tests/mocks/handlers.ts
export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ id: '1', name: 'Hoang' });
  }),
];
```

## Inline Examples

```typescript
// tests/unit/post-card.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '@/components/post-card';

test('calls onLike when heart button is clicked', async () => {
  const onLike = vi.fn();
  render(<PostCard title="Hello" onLike={onLike} />);
  await userEvent.click(screen.getByRole('button', { name: /like/i }));
  expect(onLike).toHaveBeenCalledOnce();
});
```

```text
tests/
├── unit/               # Vitest + RTL
├── e2e/                # Playwright
└── mocks/              # MSW Handlers
```


---

## nextjs-tooling

### implementation

# Next.js Tooling Reference

## Turbo & CI Configuration

```json
// package.json
"scripts": {
  "dev": "next dev --turbo",
  "lint": "next lint",
  "build": "next build"
}
```

## Self-Hosting (Docker)

```dockerfile
# Dockerfile snippet
FROM node:18-alpine AS base
# ... install & build
CMD ["node", "server.js"]
```

## Inline Examples

```js
// next.config.js — optimized for Docker deployment
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Self-contained build for Docker
  experimental: {
    turbo: {}, // Enable Turbopack
  },
};
module.exports = nextConfig;
```

```typescript
// lib/env.ts — validate env at startup with Zod
import { z } from 'zod';
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
});
export const env = envSchema.parse(process.env);
```


---

## nextjs-upgrade

### example

# References

Move large code blocks here.

## Inline Examples

```bash
npm install next@latest react@latest react-dom@latest
npm install --save-dev @types/react@latest @types/react-dom@latest
```


---

