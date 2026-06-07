---
inclusion: manual
---

# Skills: typescript

> 4 skills. Load when editing typescript files.
> For code examples and implementation patterns, load `refs-typescript.md`.

## Index

# typescript Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **typescript-language** | `**/*.ts`, `**/*.tsx`, `tsconfig.json` | type, interface, generic, enum, union, intersection, readonly, const, namespace |
| typescript-tooling | `tsconfig.json`, `.eslintrc.*`, `jest.config.*`, `package.json` | eslint, prettier, jest, vitest, build, compile, lint |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| typescript-best-practices | class, function, module, import, export, async, promise |
| **typescript-security** | validate, sanitize, xss, injection, auth, password, secret, token |

> Load matched skills: `<SKILLS>/typescript/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### typescript-best-practices

---
name: typescript-best-practices
description: Write idiomatic TypeScript patterns for clean, maintainable code. Use when writing or refactoring TypeScript classes, functions, modules, or async logic.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.tsx'
    keywords:
    - class
    - function
    - module
    - import
    - export
    - async
    - promise
---
# TypeScript Best Practices

## **Priority: P1 (OPERATIONAL)**

## Implementation Guidelines

- **Naming**: Use **`PascalCase`** for Classes/Types/Interfaces, **`camelCase`** for variables/functions, and **`UPPER_SNAKE`** for static constants.
- **Functions**: Use **`arrow functions`** for callbacks/logic; **`function declaration`** for top-level exports. Always type **`public API`** returns.
- **Modules**: Use **`Named exports`** ONLY to enable better refactoring/auto-imports.
- **Async**: Use **`async/await`** with **`Promise.all()`** for parallel execution. Implement **`try-catch`** for error handling; type **`catch(e) as unknown`** and narrow before use. Avoid **`.then().catch()`** chains.
- **Classes**: Explicitly use **`private`**, **`protected`**, and **`public`** modifiers. Favor **`composition`** over inheritance and **`dependency injection`** with **`constructor injection`** and interfaces over singletons for testability.
- **Type Safety**: Use **`never`** for exhaustiveness checks in switch-cases.
- **Optional**: Use **`optional chaining`** (`?.`) and **`nullish coalescing`** (`??`) over manual checks.
- **Imports**: Enforce **`external packages → internal modules → relative imports`** order automatically via **`eslint-plugin-import`**. Use **`import type`** for interfaces/types to ensure better tree-shaking and zero runtime overhead.
- **Validation**: Use **`Zod`** or **`Tsoa`** for runtime boundary validation.

## Anti-Patterns

- **No Default Exports**: Use named exports.
- **No Implicit Returns**: Specify return types.
- **No Unused Variables**: Enable `noUnusedLocals`.
- **No `require`**: Use ES6 `import`.
- **No Empty Interfaces**: Use `type` or non-empty interface.
- **No `any`**: Use `unknown` or specific type.
- **No Unsafe Mocks**: Cast with `jest.Mocked<T>` or `as unknown as T`.
- **No eslint-disable**: Fix root cause; never suppress warnings.

## References

See [references/examples.md](references/examples.md) for Immutable Interfaces, Exhaustiveness Checking, Assertion Functions, DI Patterns, and Import Organization.

---

### typescript-language

---
name: typescript-language
description: Apply modern TypeScript standards for type safety and maintainability. Use when working with types, interfaces, generics, enums, unions, or tsconfig settings.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.tsx'
    - 'tsconfig.json'
    keywords:
    - type
    - interface
    - generic
    - enum
    - union
    - intersection
    - readonly
    - const
    - namespace
---
# TypeScript Language Patterns

## **Priority: P0 (CRITICAL)**

## Implementation Guidelines

- **Type Annotations**: Explicit params/returns. Infer locals.
- **Interfaces vs Types**: interface for APIs (supports declaration merging). type for unions, intersection types, mapped/conditional types.
- **Strict Mode**: strict: true. Null Safety: ?. and ?? — Use narrowing instead. Avoid non-null assertion (!) operator.
- **Enums**: Literal unions or `as const`. **No runtime `enum`**.
- **Generics**: Reusable, type-safe code.
- **Type Guards**: `typeof`, `instanceof`, predicates.
- **Utility Types**: `Partial`, `Pick`, `Omit`, `Record`.
- **Immutability**: `readonly` arrays/objects. Const Assertions: `as const`, `satisfies`.
- **Template Literals**: `on${Capitalize<string>}`.
- **Discriminated Unions**: Literal kind property to narrow type safely. Switch on discriminant.
- **Advanced**: Mapped, Conditional, Indexed types.
- **Access**: Default `public`. Use `private`/`protected` or `#private`.
- **Branded Types**: `string & { __brand: 'Id' }`.

## Anti-Patterns

- **NEVER use `any`**: Use `unknown` or specific interface instead.
- **No `Function`**: Use signature `() => void`.
- **No `enum`**: Runtime cost.
- **No `!`**: Avoid non-null assertion (!). Use narrowing (typeof, instanceof, if-checks).
- **No Lint Disable**: Fix root cause; never suppress.

## Testing

- **Mocking**: Use `jest.Mocked<T>` or `as unknown as T`.
- **Checklist**: Check method existence, match error constants, satisfy required properties.
- **References**: See [references/TESTING.md](references/TESTING.md) for common issues/solutions.

## Code

```typescript
// Branded Type
type UserId = string & { __brand: 'Id' };

// Satisfies (Validate + Infer)
const cfg = { port: 3000 } satisfies Record<string, number>;

// Discriminated Union
type Result<T> = { kind: 'ok'; data: T } | { kind: 'err'; error: Error };
```

## Verification

After any type change that crosses module boundaries or involves generics, unions, conditional types, or branded types: call `getDiagnostics` (typescript-lsp MCP tool) to confirm no type errors before finalizing.

## References

For advanced type patterns and utility types:
See [references/REFERENCE.md](references/REFERENCE.md).

---

### typescript-security

---
name: typescript-security
description: Validate input, secure auth tokens, and prevent injection attacks in TypeScript. Use when validating input, handling auth tokens, sanitizing data, or managing secrets and sensitive configuration.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.tsx'
    keywords:
    - validate
    - sanitize
    - xss
    - injection
    - auth
    - password
    - secret
    - token
---
# TypeScript Security

## **Priority: P0 (CRITICAL)**

## Validate Input at Boundaries

- Use **`Zod`**, **`Joi`**, or **`class-validator`** at **API boundary**. Always **`parse`** and validate **`user-controlled input`** before using. Use **`safeParse`** for error handling without throwing. Return **`400 with structured errors`** on failure.

See [references/REFERENCE.md](references/REFERENCE.md) for Zod validation schemas, secure cookie setup, and JWT auth patterns.

## Prevent Injection and XSS

- **Sanitization**: Use **`DOMPurify`** for HTML sanitization to prevent **Cross-Site Scripting (XSS)**.
- **SQL Injection**: Use **Parameterized Queries** (e.g., **`pool.query('... WHERE id = $1', [id])`**) or **Type-safe ORMs** (**`Prisma`**/`TypeORM`). Use **`Prisma.sql`** for raw queries.
- **Input Filtering**: Sanitize **`user-controlled input`** before using it in file paths or OS commands (Command Injection).

## Secure Authentication

- Use **`Argon2id`** for password hashing. Implement **`JWT`** (via **`jsonwebtoken`** or **`jose`**) with **`HttpOnly`** and **`Secure`** cookies. Use **`RS256`** for public/private key pairs and implement **`Refresh Token rotation`**.
- **Secrets**: Store secrets in **`.env`** (e.g., **`JWT_SECRET`**) or **Secret Managers**. NEVER commit them to Git.
- **CORS**: Configure **`CORS`** with **Strict Origin Whitelisting**. Avoid `origin: '*'`.
- **Encryption**: Use **`crypto`** (Node.js) or **`Web Crypto API`** for sensitive data. Avoid legacy algorithms like MD5/SHA1.

## Verification

After typing validation schemas (Zod/joi) or auth guards, call `getDiagnostics` (typescript-lsp) to confirm type narrowing correct before finalizing.

## Anti-Patterns

- **No dynamic execution**: Avoid `eval`, `Function` constructor, or string literals as timer callbacks — all execute runtime code and bypass TypeScript's type system.
- **No shell string interpolation**: Never use `execSync(\`cmd ${userInput}\`)`or interpolate environment variables / config values into`execSync`/`spawnSync`strings. Shell metacharacters cause **command injection (OWASP A03)**. Use`execFileSync('git', ['arg1', arg2])` with a static command + separate args array instead.
- **No unvalidated SSRF origins**: When a URL comes from env vars or config (e.g., `FEEDBACK_API_URL`), validate it against an allowed-origin allowlist before calling `fetch()` / `axios`.
- **No Plaintext**: Never commit secrets.
- **No Trust**: Validate everything server-side.

## References

See [references/REFERENCE.md](references/REFERENCE.md) for Zod validation, secure cookie setup, JWT auth, security headers, and RBAC patterns.


---

### typescript-tooling

---
name: typescript-tooling
description: Development tools, linting, and build config for TypeScript. Use when configuring ESLint, Prettier, Jest, Vitest, tsconfig, or any TS build tooling.
metadata:
  triggers:
    files:
    - 'tsconfig.json'
    - '.eslintrc.*'
    - 'jest.config.*'
    - 'package.json'
    keywords:
    - eslint
    - prettier
    - jest
    - vitest
    - build
    - compile
    - lint
---
# TypeScript Tooling

## **Priority: P1 (OPERATIONAL)**

## Implementation Guidelines

- **Compiler**: Use `tsc` for CI builds; `esbuild` or `ts-node` for development.
- **Linting**: Enforce `ESLint` with `@typescript-eslint/recommended`. Enable strict type checking.
- **Formatting**: Mandate `Prettier` via `lint-staged` and `.prettierrc`.
- **Testing**: Use `Vitest` (or `Jest`) for unit/integration testing. Target > 80% line coverage.
- **Builds**: Use `tsup` (library bundling) or `Vite` (web applications).
- **TypeScript Config**: Aim for `strict: true` long-term. For existing projects, migrate incrementally: start with `strictNullChecks`, then `noImplicitAny`, `strictFunctionTypes`. Do NOT flip `strict: true` in one step.
- **CI/CD**: Always run `tsc --noEmit` in build pipeline to catch type errors.
- **Error Suppression**: Favor `@ts-expect-error` over `@ts-ignore` for documented edge-cases.

## ESLint Configuration

Enable `@typescript-eslint/recommended` at minimum. When `strict: false` in tsconfig, `no-unsafe-*` rules may produce excessive noise — suppress selectively with `@ts-expect-error` rather than disabling globally.

See [reference](references/REFERENCE.md) for common linting issues (request typing, unused params, test mock typing) and tsconfig migration examples.

## Verification Workflow (Mandatory)

After editing any `.ts` / `.tsx` file:

1. Call `getDiagnostics` (typescript-lsp MCP tool) — surfaces type errors in real time.
2. Run `tsc --noEmit` in CI — catches project-wide errors LSP may miss.
3. Run `eslint --fix` — auto-fix formatting and lint violations.

> **Fallback when typescript-lsp MCP unconfigured**: run `tsc --noEmit` directly.

`getDiagnostics` fastest feedback loop. Use it before every commit on modified files. Use `getHover` to inspect inferred types, `getReferences` before renaming symbols.

## Anti-Patterns

- **No `@ts-ignore`**: Use `@ts-expect-error` — self-documents intent, fails if error disappears.
- **No `any` for request objects**: Import centralized interfaces from `src/common/interfaces/`.
- **No `eslint-disable` (global)**: Suppress per-line; fix root cause instead.
- **No atomic `strict: true` flip** on existing repos: migrate incrementally starting with `strictNullChecks`.

## References

- [Config Examples & Linting Patterns](references/REFERENCE.md)


---

