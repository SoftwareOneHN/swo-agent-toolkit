---
inclusion: manual
---

# Skills: javascript

> 3 skills. Load when editing javascript files.
> For code examples and implementation patterns, load `refs-javascript.md`.

## Index

# javascript Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **javascript-language** | `**/*.js`, `**/*.mjs`, `**/*.cjs` | const, let, arrow, async, await, promise, destructuring, spread, class |
| javascript-tooling | `.eslintrc.*`, `jest.config.*`, `package.json` | eslint, prettier, jest, test, lint, build |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| javascript-best-practices | module, import, export, error, validation |

> Load matched skills: `<SKILLS>/javascript/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### javascript-best-practices

---
name: javascript-best-practices
description: Idiomatic JavaScript patterns and conventions for maintainable code. Use when writing or refactoring JavaScript following idiomatic patterns and conventions.
metadata:
  triggers:
    files:
    - '**/*.js'
    - '**/*.mjs'
    keywords:
    - module
    - import
    - export
    - error
    - validation
---
# JavaScript Best Practices

## **Priority: P1 (OPERATIONAL)**


## Implementation Guidelines

- **Naming**: `camelCase` (vars/funcs), `PascalCase` (classes), `UPPER_SNAKE` (constants).
- **Errors**: Throw `Error` objects only. Handle all async errors.
- **Comments**: JSDoc for APIs. Explain "why" not "what".
- **Files**: One entity per file. `index.js` for exports.
- **Modules**: Named exports only. Order: Ext -> Int -> Rel.

## Anti-Patterns

- **No Globals**: Encapsulate state.
- **No Magic Numbers**: Use `const`.
- **No Nesting**: Guard clauses/early returns.
- **No Defaults**: Use named exports.
- **No Side Effects**: Keep functions pure.

## Code & Reference

See [references/REFERENCE.md](references/REFERENCE.md) for constants, custom errors, async patterns, and module structure examples.

## Related Topics

language | tooling

---

### javascript-language

---
name: javascript-language
description: Modern JavaScript (ES2022+) patterns for clean, maintainable code. Use when working with modern JavaScript features like optional chaining, nullish coalescing, or ESM.
metadata:
  triggers:
    files:
    - '**/*.js'
    - '**/*.mjs'
    - '**/*.cjs'
    keywords:
    - const
    - let
    - arrow
    - async
    - await
    - promise
    - destructuring
    - spread
    - class
---
# JavaScript Language Patterns

## **Priority: P0 (CRITICAL)**

## Implementation Guidelines

- **Variables**: const default. let if needed. No var — block scope only.
- **Functionality**: Use **`Arrow Functions`** for callbacks/inlines; **`Function Declaration`** for core logic.
- **Async Logic**: Use async/await with try/catch and Promise.all() for parallel operations. ESM import/export only. No Callbacks — promisify everything.
- **Modern Syntax**: Use Destructuring, Spread (...), Optional Chain ?. and Nullish ?? coalescing.
- **String Handling**: Use **`Template Literals`** (backticks) for interpolation and multi-line strings.
- **Data Collections**: Prefer **`map`**, **`filter`**, and **`reduce`** over imperative `for` loops.
- **Modules**: Standardize on ESM import/export; use Named Exports over Default.
- **Encapsulation**: Leverage **`#private`** class fields for encapsulation.
- **Error States**: Throw **`new Error()`** with descriptive messages; never throw strings.

## Anti-Patterns

- No var — Block scope only.
- **No `==`**: Strict `===`.
- **No `new Object()`**: Use literals `{}`.
- No Callbacks: Promisify everything.
- **No Mutation**: Immutability first.

## Code & Reference

See [references/REFERENCE.md](references/REFERENCE.md) for modern syntax, async patterns, private fields, and functional programming examples.

## Related Topics

best-practices | tooling

---

### javascript-tooling

---
name: javascript-tooling
description: Configure development tools, linting, and testing for JavaScript projects. Use when configuring ESLint, Prettier, or test runners for JavaScript projects.
metadata:
  triggers:
    files:
    - '.eslintrc.*'
    - 'jest.config.*'
    - 'package.json'
    keywords:
    - eslint
    - prettier
    - jest
    - test
    - lint
    - build
---
# JavaScript Tooling

## **Priority: P1 (OPERATIONAL)**


## Implementation Guidelines

- **Linting**: ESLint (Rec + Prettier). Fix on save.
- **Formatting**: Prettier. Run on save/commit.
- **Testing**: Jest/Vitest. Co-locate tests. >80% cov.
- **Build**: Vite (Apps), Rollup (Libs).
- **Pkg Manager**: Sync versions (`npm`/`yarn`/`pnpm`).

## Anti-Patterns

- **No Formatting Wars**: Prettier rules.
- **No Untested Code**: TDD/Post-code tests.
- **No Dirty Commits**: Lint before push.

## Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  rules: { 'no-console': 'warn', 'prefer-const': 'error' },
};
```

```json
// .prettierrc
{ "semi": true, "singleQuote": true, "printWidth": 80 }
```

```javascript
// jest.config.js
export default {
  coverageThreshold: { global: { lines: 80 } },
};
```

## Reference & Examples

For testing patterns and CI/CD:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

best-practices | language

---

