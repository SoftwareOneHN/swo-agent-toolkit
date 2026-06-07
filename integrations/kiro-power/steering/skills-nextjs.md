---
inclusion: manual
---

# Skills: nextjs

> 18 skills. Load when editing nextjs files.
> For code examples and implementation patterns, load `refs-nextjs.md`.

## Index

# nextjs Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **nextjs-app-router** | `app/**/page.tsx`, `app/**/layout.tsx`, `app/**/loading.tsx` | App Router, Layout, Route Group, parallel routes |
| nextjs-architecture | `src/features/**`, `src/entities/**`, `src/widgets/**` | FSD, Feature Sliced Design, slices, segments |
| **nextjs-authentication** | `middleware.ts`, `**/auth.ts`, `**/login/page.tsx` | cookie, jwt, session, localstorage, auth |
| nextjs-caching | `**/page.tsx`, `**/layout.tsx`, `**/action.ts` | unstable_cache, revalidateTag, Router Cache, Data Cache |
| nextjs-data-access-layer | `**/lib/data.ts`, `**/services/*.ts`, `**/dal/**` | DAL, Data Access Layer, server-only, DTO |
| **nextjs-data-fetching** | `**/service.ts` | fetch, revalidate, no-store, force-cache |
| nextjs-i18n | `middleware.ts`, `app/[lang]/**`, `pages/[locale]/**`, `messages/*.json`, `next.config.js` | i18n, locale, translation, next-intl, react-intl, next-translate |
| nextjs-optimization | `**/layout.tsx`, `**/page.tsx` | metadata, generateMetadata, next/image, next/font |
| **nextjs-pages-router** | `pages/**/*.tsx`, `pages/**/*.ts` | Pages Router, getServerSideProps, getStaticProps, _app, useRouter |
| **nextjs-rendering** | `**/page.tsx`, `**/layout.tsx` | generateStaticParams, dynamic, dynamicParams, PPR, streaming |
| **nextjs-security** | `app/**/actions.ts`, `middleware.ts` | action, boundary, sanitize, auth, jose |
| nextjs-server-actions | `app/**/actions.ts`, `src/app/**/actions.ts`, `app/**/*.tsx`, `src/app/**/*.tsx` | use server, Server Action, revalidatePath, useFormStatus |
| **nextjs-server-components** | `app/**/*.tsx`, `src/app/**/*.tsx`, `app/**/*.jsx`, `src/app/**/*.jsx` | use client, Server Component, Client Component, hydration |
| nextjs-state-management | `**/hooks/*.ts`, `**/store.ts`, `**/components/*.tsx` | useState, useContext, zustand, redux |
| nextjs-styling | `**/*.css`, `tailwind.config.ts`, `**/components/ui/*.tsx` | tailwind, css modules, styled-components, clsx, cn |
| nextjs-testing | `**/*.test.{ts,tsx}`, `cypress/**`, `tests/**`, `jest.config.*` | vitest, playwright, msw, testing-library |
| nextjs-tooling | `next.config.js`, `package.json` | Dockerfile, turbopack, output, standalone, lint, telemetry |
| nextjs-upgrade | `package.json` | next upgrade, migration guide, codemod |

> Load matched skills: `<SKILLS>/nextjs/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### nextjs-app-router

---
name: nextjs-app-router
description: Configure file-system routing with nested layouts, route groups, parallel routes, and error boundaries in Next.js App Router. Use when creating page routes, adding loading/error states, or organizing routes with groups and dynamic segments.
metadata:
  triggers:
    files:
    - 'app/**/page.tsx'
    - 'app/**/layout.tsx'
    - 'app/**/loading.tsx'
    keywords:
    - App Router
    - Layout
    - Route Group
    - parallel routes
---
## **Priority: P0 (CRITICAL)**

## Workflow: Add New Route

1. **Create page** — Add `app/dashboard/page.tsx` as Server Component.
2. **Add layout** — Create `app/dashboard/layout.tsx` returning `{children}`.
3. **Add loading state** — Create `app/dashboard/loading.tsx` for Suspense boundary.
4. **Add error boundary** — Create `app/dashboard/error.tsx` with `'use client'` and `reset` prop.
5. **Await async APIs** — In Next.js 15+, `await params`, `cookies()`, `headers()`.

## Route Group Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

### Routing Architecture

- **Structure**: Use **`app/` directory**. Define routes with **`app/dashboard/layout.tsx`** returning **`{children}`**; shared UI nests inside `app/layout.tsx` automatically. Handle states with **`loading.tsx`**, **`error.tsx`**, and **`not-found.tsx`**.
- **Segments**: Organize features with **Route Groups** (brackets **`(auth)`**) to **excluded from URL path**. Use **Dynamic Routes** (brackets `[slug]`) and define static paths via **`generateStaticParams`**.
- **Specialized**: Use **Parallel Routes** (**`@modal`**) by adding slot to parent layout and providing **`default.tsx`** fallback. Use **Intercepting Routes** (`(.)route`) for advanced layouts like dashboards.

### Data & Functions

- **Next.js 15+ Async**: Always **`await`** **`params: Promise`**, **`searchParams`**, **`cookies()`**, and **`headers()`**.
- **Security**: Use **`middleware.ts`** for edge-side authentication and redirection. Ensure all **Route Handlers (`route.ts`)** secured with appropriate auth checks.
- **RSC**: Default to **React Server Components (RSC)**. Only use **`'use client'`** at leaf nodes for interactivity (hooks/events).
- **Error Boundaries**: Create **`app/dashboard/loading.tsx`** to auto-wrap routes in **Suspense boundary**. In **`error.tsx`**, use **`'use client'`** and provide **`reset: () => void`** function.

## File Conventions

- **page.tsx**: UI for route.
- **layout.tsx**: Shared UI wrapping children. Persists across navigation.
- **loading.tsx**: Suspense boundary for loading states.
- **error.tsx**: Error boundary (Must Client Component).
- **route.ts**: Server-side API endpoint.

## Structure Patterns

- **Route Groups**: Use parenthesis `(auth)` to organize without affecting URL path.
- **Private Folders**: Use underscore `_lib` to exclude from routing.
- **Dynamic Routes**: Use brackets `[slug]` or `[...slug]` (catch-all).

## Best Practices

- **RSC Boundaries**: Ensure props passed to Client Components serializable. See [RSC Boundaries & Serialization](../nextjs-architecture/references/RSC_BOUNDARIES.md).
- **Parallel Routes (`@folder`)**: Render multiple pages in same layout. Use `default.tsx` for fallback.
- **Intercepting Routes (`(..)folder`)**: Load routes within current layout context.
- **Colocation**: Keep component files, styles, and tests inside route folder.
- **Layouts**: Use Root Layout (`app/layout.tsx`) for `<html>` and `<body>` tags.
- [**Self-Hosting Standard**](references/SELF_HOSTING.md)


## Anti-Patterns

- **No unawaited async APIs**: `params`, `cookies()`, `headers()` Promises in Next.js 15+; always await.
- **No `'use client'` at tree root**: Place at leaves; keep layouts and pages as Server Components.
- **No `<html>`/`<body>` in nested layouts**: Only `app/layout.tsx` (root layout) should include them.
- **No missing `error.tsx`**: Every route segment needs Client Component error boundary.

---

### nextjs-architecture

---
name: nextjs-architecture
description: Structure Next.js projects with Feature-Sliced Design layers, domain-grouped slices, and strict import hierarchy. Use when organizing features into FSD layers, enforcing slice boundaries, or keeping page.tsx thin.
metadata:
  triggers:
    files:
    - 'src/features/**'
    - 'src/entities/**'
    - 'src/widgets/**'
    keywords:
    - FSD
    - Feature Sliced Design
    - slices
    - segments
---
# Architecture (Feature-Sliced Design)

## **Priority: P2 (MEDIUM)**

**Warning**: FSD introduces boilerplate. Use it only if project expected to grow significantly (e.g., 20+ features). For smaller projects, simple module-based structure preferred.

## Workflow: Create New Feature Slice

1. **Create feature folder** — `src/features/auth/login/` with `ui/`, `model/`, `api/` segments.
2. **Add public API** — Export via `src/features/auth/login/index.ts`.
3. **Wire into page** — Import feature widget in `app/login/page.tsx` (thin page).
4. **Verify imports** — Ensure no upward or cross-slice imports violate layer hierarchy.

## Layer Hierarchy

`App (app/) -> Widgets -> Features -> Entities -> Shared`

See [implementation examples](references/implementation.md) for thin page example.

## Strategy

1. **RSC Boundaries**: Enforce strict serialization rules for props passed from Server to Client. See [RSC Boundaries & Serialization](references/RSC_BOUNDARIES.md).
2. **App Layer Thin**: `app/` directory (App Router) **only** for Routing.
 - _Rule_: `page.tsx` should only import Widgets/Features. No business logic (`useEffect`, `fetch`) directly in pages.
3. **Slices over Types**: Group code by **Business Domain** (User, Product, Cart), not by File Type (Components, Hooks, Utils).
 - _Bad_: `src/components/LoginForm.tsx`, `src/hooks/useLogin.ts`
 - _Good_: `src/features/auth/login/` containing both.
4. **Layer Hierarchy**: Code can only import from _layers below it_.
 - `App` -> `Widgets` -> `Features` -> `Entities` -> `Shared`.
5. **Avoid Excessive Entities**: not preemptively create Entities.
 - _Rule_: Start logic in `Features` or `Pages`. Move to `Entities` **only** when data/logic strictly reused across multiple differing features.
 - _Rule_: Simple CRUD belongs in `shared/api`, not `entities`.
6. **Standard Segments**: Use standard segment names within slices.
 - `ui` (Components), `model` (State/actions), `api` (Data fetching), `lib` (Helpers), `config` (Constants).
 - _Avoid_: `components`, `hooks`, `services` as segment names.

## Structure Reference

For specific directory layout and layer definitions, see reference documentation.

- [**FSD Folder Structure**](references/fsd-structure.md)
- [**Bundling & Compatibility**](references/BUNDLING.md)
- [**Runtime Selection (Edge/Node)**](references/RUNTIME_SELECTION.md)
- [**Debug Tricks & MCP**](references/DEBUG_TRICKS.md)

## Architecture Checklist (Mandatory)

- [ ] **Layer Imports**: any layer import from layer ABOVE it? (App > Widgets > Features > Entities > Shared)
- [ ] **Page Logic**: `page.tsx` thin, containing only Widgets/Features and zero `useEffect`/`fetch`?
- [ ] **RSC Boundaries**: Server Components isolated from Client Components with proper 'use client' boundaries?
- [ ] **Public API**: all access to slice performed via top-level `index.ts` (public API)?
- [ ] **Cross-Slice**: slices within same layer (e.g., two features) import from each other directly? (Prohibited)

- **Server Actions**: Place them in `model/` folder of Feature (e.g., `features/auth/model/actions.ts`).
- **Data Access (DAL)**: Place logic in `model/` folder of Entity (e.g., `entities/user/model/dal.ts`).
- **UI Components**: Base UI (shadcn) belongs in `shared/ui`. Feature-specific UI belongs in `features/*/ui`.


## Anti-Patterns

- **No cross-slice imports**: Slices in same layer must not import from each other directly.
- **No business logic in `page.tsx`**: Pages import Widgets/Features only; zero `useEffect`/`fetch`.
- **No file-type folders**: Group by domain (`features/auth/`), not type (`components/`, `hooks/`).
- **No premature Entity creation**: Start in Features; move to Entities only on strict reuse.

---

### nextjs-authentication

---
name: nextjs-authentication
description: Secure token storage (HttpOnly Cookies) and Middleware patterns. Use when implementing authentication, secure session storage, or auth middleware in Next.js.
metadata:
  triggers:
    files:
    - 'middleware.ts'
    - '**/auth.ts'
    - '**/login/page.tsx'
    keywords:
    - cookie
    - jwt
    - session
    - localstorage
    - auth
---
# Authentication & Token Management

## **Priority: P0 (CRITICAL)**

Use HttpOnly Cookies for token storage. Never use LocalStorage or sessionStorage.

## Implementation Guidelines

- **Token Storage**: Strictly use `HttpOnly`, `Secure` cookies with `SameSite: 'Lax'` or `'Strict'`. Set reasonable `maxAge` (e.g., 86400). Never store access tokens in `localStorage` or `sessionStorage` (XSS-vulnerable). LocalStorage causes hydration issues in Server Components.
- **Access Management**: Read and verify tokens in Next.js Middleware (`middleware.ts`) for edge-side redirection and route protection.
- **Next.js 15+ Async**: `cookies()` Promise from `next/headers` and must awaited.
- **Library Selection**: Prefer `next-auth` (Auth.js) or `Clerk` for social logins and session management.
- **Data Access**: Always use DAL (Data Access Layer) to validate credentials and verify cookie presence before rendering.
- **CSRF Protection**: Guard all Server Actions and Route Handlers by verifying Origin/Referer headers.
- **User Verification**: Use `await auth()` (Auth.js) or custom `getSession()` helper in Server Components.

### Example: Auth Middleware

See [implementation examples](references/implementation.md)

### Example: HttpOnly Cookie Setup

See [implementation examples](references/implementation.md)

## Anti-Patterns

- **No localStorage for tokens**: XSS-vulnerable and causes hydration issues.
- **No raw tokens in Client Components**: Pass session state, not tokens.
- **No unprotected Server Actions**: Always verify Origin/Referer headers.

## References

- [Auth Implementation Examples](references/auth-implementation.md)

---

### nextjs-caching

---
name: nextjs-caching
description: 'Configure the 4 caching layers in Next.js: request memoization, data cache, full-route cache, and router cache. Use when setting revalidation strategies, invalidating cached data with tags, or diagnosing stale data bugs.'
metadata:
  triggers:
    files:
    - '**/page.tsx'
    - '**/layout.tsx'
    - '**/action.ts'
    keywords:
    - unstable_cache
    - revalidateTag
    - Router Cache
    - Data Cache
---
# Caching Architecture

## **Priority: P1 (HIGH)**

Next.js 4 distinct caching layers. Understanding them prevents stale data bugs.

## Workflow: Configure Caching for Feature

1. **Choose cache strategy** — SSG (`force-cache`), ISR (`revalidate: N`), or SSR (`no-store`).
2. **Tag cacheable fetches** — Add `next: { tags: ['posts'] }` to fetch options.
3. **Invalidate on mutation** — Call `revalidateTag('posts')` in Server Actions.
4. **Deduplicate requests** — Wrap shared data fetches with React `cache()`.
5. **Clear client cache** — Use `router.refresh()` after client-side mutations.

## Cache Invalidation Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Next.js 15+ Standard**: Use **`fetch`** with **`revalidate: number`** or **`cache: 'force-cache'`** for API calls. Use **`unstable_cache`** or new **`'use cache'`** (experimental) for custom data stores.
- **Layers**: Distinguish between **Data Cache** (persistent across requests) and **Request Memoization** (React's lifecycle specific). Use **`cache()`** from React to deduplicate fetches within single render.
- **Invalidation**: Use **`revalidatePath('/')`** after mutations or **`revalidateTag('tag-name')`** for granular cache purging.
- **Client Cache**: Understand **Router Cache** (in-memory on client) and its 30s-min lifespan. Clear it using **`router.refresh()`**.
- **Static Assets**: Leverage **`generateStaticParams`** for pre-rendering static routes at build time. Use **ISR (Incremental Static Regeneration)** for content that updates periodically.
- **Streaming**: Combine **`Suspense`** with **`fetch`** triggers to prevent slow data from blocking entire page render.
- **Next.js 16+**: Favor **`'use cache'`** and **`cacheLife()`** over `revalidate: number` where available for deterministic caching.

| Layer | Where | Control |
| :---------------------- | :----- | :----------------------------- |
| **Request Memoization** | Server | React `cache()` |
| **Data Cache** | Server | `'use cache'`, `revalidateTag` |
| **Full Route Cache** | Server | Static Prerendering |
| **Router Cache** | Client | `router.refresh()` |

## **Implementation Details**

See [Cache Components & PPR](references/CACHE_COMPONENTS.md) for detailed key generation, closure constraints, and invalidation strategies.

## Anti-Patterns

- **No `unstable_cache` in Next.js 16+**: Use `'use cache'` directive with `cacheLife()` instead.
- **No `router.refresh()` for server data**: Prefer `revalidateTag()` for targeted cache busting.
- **No caching user-specific data at route level**: Wrap personal data in `<Suspense>` with `'use cache'`.
- **No long-lived cache without tags**: Assign `cacheTag()` for fine-grained invalidation control.

---

### nextjs-data-access-layer

---
name: nextjs-data-access-layer
description: Build secure, reusable data access patterns with DTOs, taint checks, and colocated authorization in Next.js. Use when centralizing database queries, transforming raw data to DTOs, adding server-only guards, or preventing sensitive data from reaching Client Components.
metadata:
  triggers:
    files:
    - '**/lib/data.ts'
    - '**/services/*.ts'
    - '**/dal/**'
    keywords:
    - DAL
    - Data Access Layer
    - server-only
    - DTO
---
# Data Access Layer (DAL)

## **Priority: P1 (HIGH)**

Centralize all data access (Database & External APIs) to ensure consistent security, authorization, and caching.

## Workflow

1. **Create DAL module** in `services/` or `lib/data.ts` with `import 'server-only'`.
2. **Verify auth** inside every DAL function using `await auth()`.
3. **Transform** raw DB/API data into DTOs before returning to components.
4. **Wrap** with `cache()` from React to deduplicate requests within render cycle.
5. **Taint-check** sensitive objects to prevent accidental client exposure.

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **DTOs**: Always transform raw data into plain objects. Never return ORM model instances.
- **Security**: Use `taintObjectReference` or `taintUniqueValue` from experimental taint API to guard sensitive data.
- **Authorization**: Colocate auth checks inside every DAL function. Never rely on UI layer.
- **Caching**: Wrap DAL functions in `cache()` to deduplicate within single render.
- **Error Handling**: Throw standardized errors (`NotFoundError`, `UnauthorizedError`) caught by `error.tsx` or `notFound()`.

## Limitations

- **Client Components** cannot import DAL files. Use Server Actions or Route Handlers as bridges.

## Anti-Patterns

- **No auth checks outside DAL**: Auth verification must live inside DAL functions.
- **No raw ORM instances returned**: Transform to plain DTO objects before returning.
- **No `fetch('localhost/api')` in Server Components**: Call DAL functions directly.
- **No DAL imports in Client Components**: Use Server Actions or Route Handlers as bridges.

---

### nextjs-data-fetching

---
name: nextjs-data-fetching
description: Implement Fetch API, Caching, and Revalidation strategies in Next.js. Use when fetching data, configuring cache behavior, or implementing revalidation in Next.js.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/service.ts'
    keywords:
    - fetch
    - revalidate
    - no-store
    - force-cache
---
# Data Fetching (App Router)

## **Priority: P0 (CRITICAL)**

> [!WARNING]
> Covers **App Router** `fetch` only. For `pages/` directory: use `getServerSideProps` / `getStaticProps`. Ignore native `fetch` caching advice below.

Fetch data directly in Server Components using `async/await`.

## Strategies

- **Static**: Build-time. `fetch(url, { cache: 'force-cache' })`.
- **Dynamic**: Request-time. `fetch(url, { cache: 'no-store' })` or `cookies()`.
- **Revalidated**: `fetch(url, { next: { revalidate: 60 } })`.

## Patterns

- **Direct Access**: Call DB/Service layer directly. ** not fetch your own /api routes.** Example: `export default async function Page() { const user = await db.user.findUnique({ where: { id }, select: { id: true, name: true } }); }`
- **Colocation**: Fetch exactly where data needed.
- **Parallel**: Use `Promise.all()` to prevent waterfalls.
- **Client-Side**: Use SWR/React Query for live/per-user data (no SEO).

## Revalidation

- **Path**: `revalidatePath('/path')` - Purge cache for route.
- **Tag**: `revalidateTag('key')` - Purge by tag.

## Anti-Patterns

- **No root-level awaits**: Wrap slow fetches in `<Suspense>` to avoid blocking.
- **No `useEffect` for data fetching**: Use SWR or React Query for client-side data.
- **No internal API calls from RSC**: Fetch from DB/service layer directly.

## Examples & References

- [Usage Examples](references/usage-examples.md)
- [Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)

---

### nextjs-i18n

---
name: nextjs-i18n
description: Best practices for multi-language handling, locale routing, and detection strategies across App and Pages Router. Use when adding i18n, locale routing, or language detection in Next.js.
metadata:
  triggers:
    files:
    - 'middleware.ts'
    - 'app/[lang]/**'
    - 'pages/[locale]/**'
    - 'messages/*.json'
    - 'next.config.js'
    keywords:
    - i18n
    - locale
    - translation
    - next-intl
    - react-intl
    - next-translate
---
# Internationalization (i18n)

## **Priority: P2 (MEDIUM)**

Maintain single source of truth for locales and ensure SEO-friendly sub-path routing.

## Workflow: Add i18n to Next.js App Router Project

1. Install `next-intl` and create `messages/en.json`, `messages/fr.json`, etc.
2. Add locale detection middleware in `middleware.ts`
3. Create `app/[lang]/layout.tsx` with locale param
4. Load translations server-side via `getMessages()`
5. Add `hreflang` tags in `generateMetadata`
6. Pre-render locales with `generateStaticParams`
7. Verify: run `next build` and confirm all locale paths render

## Middleware Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Locale Routing**: Follow URL-first approach for SEO. Use dynamic segments in App Router (`app/[lang]/page.tsx`) and `i18n` configuration in `next.config.js` for Pages Router.
- **Library Selection**: Use `next-intl` for App Router (modern) or `react-intl` / `next-translate` for legacy apps.
- **Detection**: Implement middleware localization in `middleware.ts` to detect user language from `Accept-Language` headers or cookies and perform redirects.
- **Server-Side**: Load translation `messages/*.json` dictionaries in Server Components to keep client bundle small.
- **SEO**: Ensure `hreflang` tags generated correctly in `metadata` API for all translated routes.
- **Static Generation**: Use `generateStaticParams` to pre-render localized versions of static pages at build time.

### Library Specifics

For detailed setup with common libraries, refer to:

- [references/react-intl.md](references/react-intl.md)
- [references/next-intl.md](references/next-intl.md)

## Anti-Patterns

- **No hardcoded strings in JSX**: Use translation keys; never commit raw text.
- **No client-side translation bundles**: Load dictionaries server-side with `getMessages()`.
- **No mixed URL locale patterns**: Use sub-paths or domains consistently.

---

### nextjs-optimization

---
name: nextjs-optimization
description: Optimize images, fonts, scripts, and metadata for Next.js performance and Core Web Vitals. Use when configuring next/image for LCP, next/font for zero layout shift, next/script loading strategies, or generateMetadata for SEO.
metadata:
  triggers:
    files:
      - '**/layout.tsx'
      - '**/page.tsx'
    keywords:
      - metadata
      - generateMetadata
      - 'next/image'
      - 'next/font'
---

# Optimization

## **Priority: P1 (HIGH)**

Core optimization primitives provided by Next.js. **Monitor First, Optimize Later.**

## Monitoring (Core Web Vitals)

- **LCP** (Largest Contentful Paint): Target < 2.5s.
- **CLS** (Cumulative Layout Shift): Target < 0.1.
- **INP** (Interaction to Next Paint): Target < 200ms.
- **Tools**: Chrome DevTools "Performance" tab, `next/speed-insights`, `React Profiler`.

## Images

Always use `next/image` to prevent CLS and enable automatic optimization:

See [implementation examples](references/example.md)

## Fonts

Use `next/font` for zero layout shift — self-hosts fonts and adds `font-display: swap`:

See [implementation examples](references/example.md)

## Metadata (SEO)

See [implementation examples](references/example.md)

## Scripts

Use `next/script` with appropriate loading strategies:

- `beforeInteractive`: Critical scripts (polyfills).
- `afterInteractive`: Analytics (Google Analytics).
- `lazyOnload`: Chat widgets, social embeds.

## Bundle & Components

- Analyze with `@next/bundle-analyzer`. Prune heavy libraries; use ESM-tree-shakable dependencies.
- Use `dynamic` imports with `Suspense` for large components not needed at initial render.
- Enable `ppr: true` (Partial Prerendering) in Next.js 15+ for static shell + dynamic islands.

## Anti-Patterns

- **No `<img>` tag**: Use `next/image` to prevent CLS and enable automatic optimization.
- **No Google Fonts CDN link**: Use `next/font` to self-host and eliminate layout shift.
- **No metadata in `_document.tsx`**: Use `export const metadata` or `generateMetadata()`.
- **No 3rd-party scripts in `<head>`**: Use `next/script` with appropriate `strategy`.


---

### nextjs-pages-router

---
name: nextjs-pages-router
description: Implement Pages Router data fetching with getServerSideProps, getStaticProps, and API routes in Next.js legacy projects. Use when working in a pages/ directory project, adding SSR/SSG data fetching, or creating API routes.
metadata:
  triggers:
    files:
    - 'pages/**/*.tsx'
    - 'pages/**/*.ts'
    keywords:
    - Pages Router
    - getServerSideProps
    - getStaticProps
    - _app
    - useRouter
---
# Next.js Pages Router (Legacy)

## **Priority: P0 (CRITICAL)**

> [!IMPORTANT]
> project uses Next.js **Pages Router** (`pages/` directory). NOT use App Router features.

## Workflow: Add Server-Rendered Page

1. **Create page file** — Add `pages/posts/[id].tsx`.
2. **Add data fetching** — Export `getServerSideProps` or `getStaticProps` + `getStaticPaths`.
3. **Import service directly** — Never fetch your own `/api` routes from server-side hooks.
4. **Type props** — Use `InferGetServerSidePropsType<typeof getServerSideProps>`.

## getServerSideProps Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Routing Architecture**: Use **`pages/` directory**. Use **`_app.tsx`** for global state/layouts and **`_document.tsx`** for custom HTML attributes. Define dynamic routes using **brackets `[id].tsx`** or **catch-all `[...slug].tsx`**.
- **Data Fetching (SSR/SSG)**: Use **`getServerSideProps`** (for every request) or **`getStaticProps`** (at build time) with **`getStaticPaths`** for dynamic routes. Export these as standalone **`async` functions**.
- **Logic Isolation**: Never **`fetch`** your own **`/api`** endpoints from Server-Side hooks. Import **service layer** or DB logic directly.
- **Client Hooks**: Use **`useRouter()`** from `next/router` for navigation and access to query params. Use **`router.push()`** or **`<Link>`** for client-side routing.
- **APIs**: Implement **API Routes** in `pages/api/` for server-only logic or webhooks. Standardize responses with appropriate HTTP status codes.
- **Next.js 15+ Compatibility**: cautious of **Next.js 15 upgrades**; ensure all **`getServerSideProps`** return objects that match expected `PageProps`.
- **Styling**: Standardize via **CSS Modules (`*.module.css`)** or **Tailwind CSS**. Avoid global CSS unless imported in `_app.tsx`.

## Anti-Patterns

- **No fetching own /api routes from SSR**: Import service layer directly.
- **No global CSS outside _app.tsx**: Use CSS Modules or Tailwind for scoped styles.
- **No App Router features in Pages Router projects**: Avoid `app/` directory patterns.

## References

- [Server-Side Props Example](references/server-side-props.md)

---

### nextjs-rendering

---
name: nextjs-rendering
description: Select and implement SSG, SSR, ISR, Streaming, or Partial Prerendering strategies in Next.js App Router. Use when choosing a rendering mode for a page, configuring generateStaticParams, or enabling PPR.
metadata:
  triggers:
    files:
    - '**/page.tsx'
    - '**/layout.tsx'
    keywords:
    - generateStaticParams
    - dynamic
    - dynamicParams
    - PPR
    - streaming
---
# Rendering Strategies (App Router)

## **Priority: P0 (CRITICAL)**

Choose rendering strategy based on data freshness and scaling needs. See [Strategy Matrix](references/strategy-matrix.md).

## Workflow: Choose Rendering Strategy

1. **Determine data freshness** — Static content? Use SSG. Periodic updates? Use ISR. Personalized? Use SSR.
2. **Configure fetch** — `force-cache` for SSG, `revalidate: N` for ISR, `no-store` for SSR.
3. **Add Suspense for streaming** — Wrap slow components in `<Suspense>` with fallback.
4. **Enable PPR if hybrid** — Set `ppr: true` in `next.config.js` for static shell + dynamic regions.

## ISR with generateStaticParams Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **SSG (Static Site Generation)**: Default for App Router. Use **`generateStaticParams`** to pre-render routes at build time. Triggered by **`fetch`** with **`cache: 'force-cache'`**.
- **SSR (Server-Side Rendering)**: Triggered by **`cookies()`**, **`headers()`**, or **`fetch`** with **`cache: 'no-store'`**. Use for personalized or high-freshness data.
- **ISR (Incremental Static Regeneration)**: Update static content after build. Use **`revalidate`** (time-based) or **`revalidatePath`** / **`revalidateTag`** (on-demand).
- **Streaming**: Use **`Suspense`** to wrap slow async components and prevent them from blocking initial page load. Use **`loading.tsx`** for route-level skeletons.
- **PPR (Partial Prerendering)**: Combine static shell with dynamic regions in single HTTP request. Enable **`ppr: true`** in `next.config.js`.
- **Strategies**: Choose rendering based on **SEO** (SSG/ISR) vs **Interactivity** (Client) vs **Personalization** (SSR). Utilize **`dynamicParams`** to control fallback behavior for uncached routes.
- **Hydration**: Avoid **Hydration Errors** by not using browser-only values (`window.innerWidth`, `Date.now()`) in initial render. Use **`mounted` useEffect pattern**.
- **Edge Runtime**: Use **`runtime: 'edge'`** for low-latency globally distributed execution where full Node.js APIs not required.

## Anti-Patterns

- **No root awaits in `page.tsx`**: Wrap slow components in `<Suspense>` to stream.
- **No SSR for static content**: Use SSG or ISR; reserve SSR for truly dynamic data.
- **No `typeof window` in initial render**: Use `useEffect` to avoid hydration errors.

## References

- [Strategy Selection Matrix](references/strategy-matrix.md)
- [Implementation Details](references/implementation-details.md)
- [Scaling Patterns](references/scaling-patterns.md)

---

### nextjs-security

---
name: nextjs-security
description: Secure Next.js App Router with middleware auth, Server Action validation, CSP headers, and taint APIs. Use when adding authentication middleware, validating Server Action inputs with Zod, or preventing secret leakage to client bundles.
metadata:
  triggers:
    files:
    - 'app/**/actions.ts'
    - 'middleware.ts'
    keywords:
    - action
    - boundary
    - sanitize
    - auth
    - jose
---
# Next.js Security

## **Priority: P0 (CRITICAL)**

## Workflow: Secure Next.js App

1. **Add auth middleware** — Create `middleware.ts` to verify JWT/session on protected routes.
2. **Validate Server Actions** — Parse all inputs with Zod schemas; call `await auth()` first.
3. **Set security headers** — Add CSP, HSTS, X-Frame-Options in middleware response.
4. **Use `server-only`** — Import in modules containing secrets to prevent client bundling.
5. **Taint sensitive objects** — Use `taintObjectReference` to block server objects from reaching client.

## Secure Server Action Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Next.js Middleware**: Use **`middleware.ts`** for edge-side authentication, role-based access control (RBAC), and enforcing **Security Headers** (e.g., **`Content-Security-Policy (CSP)`**, **`X-XSS-Protection`**).
- **Server Actions**: Always **sanitize all inputs** from `FormData` or JSON using **Zod**. Perform **authentication checks** (`await auth()`) inside every action to verify caller.
- **Data Tainting**: Use **`experimental_taint`** API (**`taintObjectReference`**) to ensure sensitive server objects (e.g., User with `passwordHash`) never leak into Client Component.
- **Route Handlers (`route.ts`)**: Implement **rate limiting** to prevent brute-force or DoS attacks. Verify **Origin/Referer headers** to mitigate **CSRF** (Cross-Site Request Forgery).
- **Auth Tokens**: strictly use **`HttpOnly`, `Secure` cookies** with **`SameSite: 'Lax'`** for session management. Never store tokens in `localStorage`.
- **Logic Isolation**: use **`server-only`** package to prevent backend-specific logic from included in client bundle.
- **Component Purity**: **Escape all user-provided content** rendered in components. Never use **`dangerouslySetInnerHTML`** without sanitizer like **`DOMPurify`**.

## Anti-Patterns

- **No leaking DB fields to client**: Use DTOs; never pass raw model objects.
- **No `process.env` in client bundles**: Mark as `NEXT_PUBLIC_` only if safe to expose.
- **No unvalidated Server Action inputs**: Always validate with Zod schema.
- **No auth checks in shared Layouts**: Auth in layouts insecure; use Middleware.

## References

- [Secure App Router Patterns](references/implementation.md)

---

### nextjs-server-actions

---
name: nextjs-server-actions
description: Implement mutations, forms, and RPC-style calls with Next.js Server Actions. Use when implementing Server Actions, form mutations, or RPC-style data mutations in Next.js.
metadata:
  triggers:
    files:
    - 'app/**/actions.ts'
    - 'src/app/**/actions.ts'
    - 'app/**/*.tsx'
    - 'src/app/**/*.tsx'
    keywords:
    - use server
    - Server Action
    - revalidatePath
    - useFormStatus
---
# Server Actions

## **Priority: P1 (HIGH)**

> [!WARNING]
> If project uses `pages/` directory instead of App Router, **ignore** this skill entirely.

Handle form submissions and mutations without creating API endpoints.

## Implementation Guidelines

- **Directive**: Always start file or function with `'use server'`. Access `formData.get('title')` for typed form fields. Export async functions for mutations.
- **Form Handling**: Use `action` prop of `<form>` to trigger actions via `action={createPost}`. Use `useFormStatus()` for `pending` states — `disabled={pending}` on buttons. Use `useActionState` (React 19/Next.js 15) for `action={action}` form state with `<form action={action}>`.
- **Data Refresh**: Trigger UI updates using **`revalidatePath('/')`** or **`revalidateTag('tag-name')`** after successful mutation.
- **Interactivity**: For non-form triggers, invoke actions using **`useTransition`** hook to handle loading UI and prevent page from blocking.
- **Optimistic Updates**: Use **`useOptimistic`** to show expected UI state immediately before server confirms mutation.
- **Security**: **Sanitize all inputs** from `FormData`. Perform **auth checks** inside every action (`await auth()`). Limit file uploads by size and MIME type.

- **Form**: `<form action={createPost}>` (Progressive enhancements work without JS).
- **Event Handler**: `onClick={() => createPost(data)}`.
- **Pending State**: Use `useFormStatus` hook (must inside component rendered within form).

## **P1: Operational Standard**

### **1. Secure & Validate**

Always validate inputs with `z.object({` schema and `safeParse` before processing. Check authorization within action. See [Secure Action Example](references/secure-actions.md).

### **2. Pending States**

Use `useActionState` (React 19/Next.js 15+) for state handling and `useFormStatus` for button loading states.

## **Constraints**

- **Closures**: Avoid defining actions inside components to prevent hidden closure encryption overhead and serialization bugs.
- **Redirection**: Use `redirect()` for success navigation; it throws error that Next.js catches to handle redirect.

## Anti-Patterns

- **No unvalidated Server Action inputs**: Always validate with Zod before processing.
- **No skipped auth checks**: Verify session/user inside every action, not middleware.
- **No actions defined inside components**: Define in `actions.ts` to avoid closure bugs.
- **No `redirect()` in try/catch**: `redirect()` throws; catching it suppresses redirect.

---

### nextjs-server-components

---
name: nextjs-server-components
description: "Build async React Server Components and place 'use client' boundaries at leaf nodes for interactivity in Next.js App Router. Use when deciding RSC vs Client Component, composing server data into client wrappers, or fixing hydration errors."
metadata:
  triggers:
    files:
    - 'app/**/*.tsx'
    - 'src/app/**/*.tsx'
    - 'app/**/*.jsx'
    - 'src/app/**/*.jsx'
    keywords:
    - use client
    - Server Component
    - Client Component
    - hydration
---
# Server & Client Components

## **Priority: P0 (CRITICAL)**

> [!WARNING]
> If project uses `pages/` directory instead of App Router, **ignore** this skill entirely.

App Router uses React Server Components (RSC) by default.

## Workflow: Add Server/Client Component Split

1. **Default to RSC** — Async Server Components for data fetching.
2. **Push `'use client'` to leaves** — Interactive leaf nodes only (Button, Form, Chart). Keep layouts/pages as Server Components to maximise RSC benefits.
3. **Compose via children** — Pass Server Components as `children` to Client Components.
4. **Serialize props** — Server-to-Client props must be serializable (no functions, Dates, or Classes).
5. **Guard secrets** — Import `server-only` in modules with sensitive logic.

## Composition Pattern Example

See [implementation examples](references/example.md)

## Implementation Guidelines

- **Async RSCs**: Fetch directly in async Server Components — `await db.` queries, `await params` for route segments.
- **Data Fetching**: `fetch` with `cache: 'no-store'` or `revalidate: 0` opts out of static rendering.
- **Streaming**: Wrap slow async components in `<Suspense>`. Use `loading.tsx` for route-level skeletons.
- **Hydration**: Server sends HTML + RSC payload; client hydrates only Client Components. Server Components: zero JS in client bundle.
- **Server-in-Client**: Cannot import Server Component into Client Component.
- _Fix_: Pass as `children` prop. See [Composition Example](references/composition-security.md).

## Anti-Patterns

- **No secrets in Client Components**: Use `server-only` package to prevent accidental bundling.
- **No full DB objects passed to client**: Minimize serialized props; pass IDs when possible.
- **No `useState`/`useEffect` in Server Components**: These Client Component-only hooks.
- **No `'use client'` at tree root**: Push boundary to leaf components.

## References

- [Server/Client Composition Example](references/composition-security.md)


---

### nextjs-state-management

---
name: nextjs-state-management
description: Apply best practices for managing URL, server, and client state in Next.js applications. Use when choosing between URL params, SWR/TanStack Query, Zustand, or Context for state, or when fixing hydration mismatches from localStorage.
metadata:
  triggers:
    files:
    - '**/hooks/*.ts'
    - '**/store.ts'
    - '**/components/*.tsx'
    keywords:
    - useState
    - useContext
    - zustand
    - redux
---
# State Management

## **Priority: P2 (MEDIUM)**

## Decision Guide

1. **Shareable/persistent?** Use URL state (`useSearchParams` + `useRouter`).
2. **Server data?** Use SWR or TanStack Query. Never sync into `useState`.
3. **Complex client UI?** Use Zustand (in `'use client'` only) or Jotai.
4. **Simple local?** Use `useState`. Colocate as close to consumer as possible.

## URL-Driven State

See [implementation examples](references/implementation.md)

## Server State (SWR / TanStack Query)

See [implementation examples](references/implementation.md)

## Client State (Zustand)

See [implementation examples](references/implementation.md)

## Hydration Safety

Wrap `localStorage` reads in `useEffect` or `mounted` flag to avoid hydration mismatches. Manage optimistic updates with `useOptimistic` in Next.js 15+.

## Legacy Redux (existing projects)

If project already uses `redux@4` + `createStore` + `redux-thunk` + `next-redux-wrapper`:

- Use `useSelector` / `useDispatch` hooks — never connect HOC.
- Define typed `RootState` and typed `AppDispatch` for all selectors and dispatch calls.
- Avoid adding Zustand or TanStack Query on top of existing Redux codebase — migrate incrementally if needed.
- Migration path: Redux Toolkit (`@reduxjs/toolkit`) → RTK Query → then consider TanStack Query.

See [references/redux.md](references/redux.md) for typed selector and thunk patterns.

## Library Patterns

- [references/redux.md](references/redux.md)
- [references/zustand.md](references/zustand.md)
- [references/url-state.md](references/url-state.md)

## Anti-Patterns

- **No global store for simple state**: Use `useState` or URL params; avoid Zustand for basic UI.
- **No large objects in state**: Decompose into granular primitives to prevent extra re-renders.
- **No `useEffect` for data fetching**: Use SWR or TanStack Query for server state.
- **No server state in client stores**: Fetch in RSCs; client stores for UI-only state.

---

### nextjs-styling

---
name: nextjs-styling
description: Implement zero-runtime CSS with Tailwind, CSS Modules, and the cn() utility for RSC-compatible styling in Next.js. Use when choosing a styling library, creating dynamic class utilities, or optimizing fonts with next/font.
metadata:
  triggers:
    files:
    - '**/*.css'
    - 'tailwind.config.ts'
    - '**/components/ui/*.tsx'
    keywords:
    - tailwind
    - css modules
    - styled-components
    - clsx
    - cn
---
# Styling & UI Performance

## **Priority: P1 (HIGH)**

Prioritize **Zero-Runtime** CSS for Server Components.

## Workflow: Set Up Styling

1. **Choose library** — Tailwind/shadcn (preferred), CSS Modules (scoped), or Ant Design (with client wrappers).
2. **Create `cn` utility** — Combine `clsx` + `tailwind-merge` for dynamic classes.
3. **Configure fonts** — Use `next/font` for zero-CLS self-hosted fonts.
4. **Set image dimensions** — Always specify `width`/`height` or `fill` on `<Image>`.

## cn Utility Example

See [implementation examples](references/implementation.md)

## Library Selection

| Library | Verdict | Reason |
| :------------------------- | :----------------- | :------------------------------------------------- |
| **Tailwind / shadcn** | **Preferred (P1)** | Zero-runtime, RSC compatible. Best for App Router. |
| **CSS Modules / SCSS** | **Recommended** | Scoped, zero-runtime. Good for legacy projects. |
| **Ant Design** | **Supported** | Use with Client Component wrappers for RSCs. |
| **MUI / Chakra (Runtime)** | **Avoid** | Forces `use client` widely. Degrades performance. |

## Library Patterns

For specific library setups, see:

- [references/scss.md](references/scss.md)
- [references/ant-design.md](references/ant-design.md)
- [references/tailwind.md](references/tailwind.md) (Tailwind/shadcn)

## Patterns

1. **Dynamic Classes**: Use `clsx` + `tailwind-merge` (`cn` utility).
 - _Reference_: [Dynamic Classes & Button Example](references/implementation.md)
2. **Font Optimization**: Use `next/font` to prevent Cumulative Layout Shift (CLS).
 - _Reference_: [Font Setup](references/implementation.md)
3. **CLS Prevention**: Always specify `width`/`height` on images.


## Anti-Patterns

- **No runtime CSS-in-JS with RSC**: MUI/Chakra force `'use client'`; prefer Tailwind or CSS Modules.
- **No `<img>` without dimensions**: Always set `width`/`height` or use `fill` to prevent CLS.
- **No hardcoded conditional classes**: Use `clsx`+`tailwind-merge` (`cn`) for dynamic styles.
- **No Google Fonts `<link>` tag**: Use `next/font` for zero-CLS self-hosted fonts.

---

### nextjs-testing

---
name: nextjs-testing
description: Write Jest or Vitest unit tests with React Testing Library and Playwright E2E tests for Next.js projects. Use when testing components with RTL, mocking APIs with MSW, or creating Playwright user flow tests.
metadata:
  triggers:
    files:
    - '**/*.test.{ts,tsx}'
    - 'cypress/**'
    - 'tests/**'
    - 'jest.config.*'
    keywords:
    - vitest
    - playwright
    - msw
    - testing-library
---
# Next.js Testing

## **Priority: P1 (HIGH)**

## Test Runner

- **Existing projects (Pages Router / legacy stack)**: Use **Jest** (`jest@29` + `babel-jest` + `jest-environment-jsdom`).
- **New projects (App Router)**: Use **Vitest** for speed and native ESM support.

## Workflow: Test New Feature

1. **Write unit tests** — Use Jest (or Vitest for new projects) + RTL with Arrange-Act-Assert pattern.
2. **Mock APIs** — Set up MSW handlers for all fetch boundaries.
3. **Test interactions** — Use `userEvent` (async) for clicks, typing, form submissions.
4. **Add E2E tests** — Use Playwright for critical user flows (login, checkout).
5. **Verify coverage** — Aim for 80%+ on core libraries via JSON coverage reports.

## Component Test Example

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Unit Testing**: Use **Jest** (existing projects) or **Vitest** (new projects) with **React Testing Library (RTL)**. Follow **Arrange-Act-Assert (AAA)** patterns.
- **E2E Testing**: Use **Playwright** for full user flow validation. Focus on critical flows (Login, Checkout).
- **Networking**: Mock all internal/external API boundaries using **Mock Service Worker (MSW)**. Ensure **`server` and `browser` handlers** correctly configured.
- **Interactions**: Use **`userEvent` (async)** to simulate user actions: `await user.click(button)`.
- **Selectors**: Favor **`getByRole`** / **`findByRole`** to test accessibility. Use **`data-testid`** only as fallback.
- **Environment**: For Jest, use `jest-environment-jsdom`. For Vitest, configure `vitest.config.ts` with `jsdom` or `happy-dom`.
- **Reporting**: Ensure tests generate **JSON coverage reports** for CI gates. Aim for **80%+ coverage** on core libraries.

## Anti-Patterns

- **No real network usage in tests**: Always use MSW handlers or mocks.
- **No implementation testing**: Test user behavior, not internal methods.
- **No heavy E2E for unit logic**: Use Jest/Vitest for isolated logic tests.
- **No global state leakage**: Reset MSW handlers and mocks after each test.

## References

- [Next.js Test Patterns](references/implementation.md)

---

### nextjs-tooling

---
name: nextjs-tooling
description: Configure Next.js build tooling, deployment, and developer workflow. Use when setting up Turbopack, standalone Docker output, bundle analysis, CI caching, environment variable validation, or ESLint integration for Next.js projects.
metadata:
  triggers:
    files:
    - 'next.config.js'
    - 'package.json'
    keywords:
    - Dockerfile
    - turbopack
    - output
    - standalone
    - lint
    - telemetry
---
# Next.js Tooling

## **Priority: P2 (MEDIUM)**

## Standalone Docker Config

See [implementation examples](references/implementation.md)

## Environment Variable Validation

See [implementation examples](references/implementation.md)

## Implementation Guidelines

- **Build**: Use Turbopack (`next dev --turbo`) for faster incremental builds; Webpack for legacy.
- **Linting**: Mandate `next lint` (eslint-plugin-next) and `tsc` in CI/CD.
- **Bundle Analysis**: Inspect with `@next/bundle-analyzer`. Remove unused dependencies.
- **Telemetry**: Opt-out via `next telemetry disable` if privacy required.
- **Environment**: Server-only vars vs `NEXT_PUBLIC_*`. Validate with Zod at runtime.
- **CI/CD**: Cache `.next/cache` in CI for 50%+ faster builds.

## Anti-Patterns

- **No `npm run start` for dev**: Use `next dev` (or `next dev --turbo`).
- **No uninspected bundle growth**: Analyze with `@next/bundle-analyzer` before shipping.
- **No custom ESLint rules over plugin**: Use `eslint-plugin-next` for Next.js-aware linting.
- **No `console.log` in production**: Use structured loggers (Pino, Winston).

## References

- [CI/CD & Deployment Guide](references/implementation.md)

---

### nextjs-upgrade

---
name: nextjs-upgrade
description: Next.js version migrations using official guides and codemods. Use when migrating a Next.js project to a new major version using codemods.
metadata:
  triggers:
    files:
    - 'package.json'
    keywords:
    - next upgrade
    - migration guide
    - codemod
---
# Next.js Upgrade Protocol

Automated and manual migration steps for Next.js version upgrades (e.g., v14 to v15).

## **Priority: P1 (OPERATIONAL)**

## Workflow: Upgrade Next.js to New Major Version

1. Check current versions of `next`, `react`, `react-dom` in `package.json`
2. Plan incremental path (e.g., v13 -> v14 -> v15; never skip majors)
3. Run codemods: `npx @next/codemod@latest <transform> <path>`
4. Update dependencies:
 See [implementation examples](references/example.md)
5. Verify async APIs: ensure `cookies()`, `headers()`, `params` awaited (v15+)
6. Audit `fetch` caching: v15 defaults to `no-store`; add `force-cache` where needed
7. Run `next build` and fix hydration or Turbopack errors
8. Report codemod failures or manual fixes to team

## Implementation Guidelines

- **Upgrade Detection**: Always check `package.json` for versions of `next`, `react`, and `react-dom`.
- **Planning**: For major version jumps (v13 to v15), perform incremental upgrade (v13 -> v14, then v14 -> v15). Follow official Next.js Migration Guides.
- **Automated Codemods**: Use `npx @next/codemod@latest <transform> <path>` to automate syntax migration.
- **Breaking Changes (v15)**: Respond to `next-async-request-api` transform by ensuring `params`, `searchParams`, `cookies()`, and `headers()` awaited.
- **React Parity**: Upgrade `react` and `react-dom` to match Next.js peer dependencies (e.g., React 19 for Next.js 15).
- **Validation**: Run `next dev` and `next build` after each incremental step. Check console errors for hydration warnings.

## Anti-Patterns

- **No major version skipping**: Upgrade one major version at time (13 -> 14, then 14 -> 15).
- **No manual breaking-change fixes**: Always run `npx @next/codemod@latest` transforms first.
- **No assumed caching behavior post-upgrade**: v15 defaults to `no-store`; audit all `fetch` calls.
- **No async page functions in Pages Router**: `export default async function Page()` fatal.

---

