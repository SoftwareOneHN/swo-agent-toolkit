---
inclusion: manual
---

# References: typescript

> 6 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-typescript.md`.

## typescript-best-practices

### REFERENCE

# TypeScript Best Practices Reference

Project structure and advanced patterns.

## References

- [**Project Structure**](project-structure.md) - Scalable directory organization.
- [**Configuration**](configuration.md) - TSConfig best practices.

## Project Structure

```typescript
src/
├── domain/           # Business logic (entities, value objects)
│   ├── user/
│   │   ├── user.entity.ts
│   │   └── user.repository.interface.ts
├── application/      # Use cases
│   └── user/
│       └── create-user.usecase.ts
├── infrastructure/   # External concerns
│   ├── database/
│   └── http/
├── presentation/     # Controllers, DTOs
│   └── user/
│       ├── user.controller.ts
│       └── user.dto.ts
└── shared/          # Shared utilities
    ├── types/
    └── utils/
```

## TSConfig Best Practices

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Barrel Exports (Use Sparingly)

```typescript
// index.ts - Barrel file
export * from './user.service';
export * from './user.repository';
export type { UserDTO } from './user.dto';
```

Note: Avoid deep barrel exports as they can impact build performance.


---

### examples

# TypeScript Best Practice Examples

## Named Export + Immutable Interface

```typescript
export interface User {
  readonly id: string;
  name: string;
}
```

## Exhaustiveness Checking

Use `never` to ensure all cases in a switch are handled.

```typescript
function getStatus(s: 'ok' | 'fail') {
  switch (s) {
    case 'ok':
      return 'OK';
    case 'fail':
      return 'Fail';
    default:
      const _chk: never = s;
      return _chk;
  }
}
```

## Assertion Functions

Runtime validation that narrows types.

```typescript
function assertDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val == null) throw new Error('Defined expected');
}
```

## Dependency Injection (Class Pattern)

```typescript
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUser(id: string): Promise<UserProfile> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}
```

## Import Organization

```typescript
// External
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Internal
import { UserRepository } from '@/repositories/user.repository';
import { Logger } from '@/utils/logger';

// Type-only
import type { Request, Response } from 'express';
```


---

## typescript-language

### REFERENCE

# TypeScript Language Patterns Reference

Advanced type patterns and utility implementations.

## References

- [**Advanced Types**](advanced-types.md) - Conditional types, mapped types, and template literals.
- [**Type Guards**](type-guards.md) - Custom type guard patterns.
- [**Utility Types**](utility-types.md) - Custom utility type implementations.

## Advanced Generic Patterns

```typescript
// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;

// Recursive types
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};
```

## Branded Types for Type Safety

```typescript
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

// Prevents mixing IDs at compile time
function getUser(id: UserId) { /* ... */ }
getUser(createUserId('123')); // OK
// getUser('123'); // Error: Type 'string' is not assignable to type 'UserId'
```

## Discriminated Unions

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'square'; size: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'square':
      return shape.size ** 2;
  }
}
```


---

### TESTING

# TypeScript Testing Patterns

## Testing Patterns

- **Mock Types**: Use `jest.Mocked<T>` or `as unknown as T`. Never use `any`.
- **Enum Usage**: Always use enum values (`Status.UPCOMING`) instead of string literals.
- **DTO Validation**: Ensure test data includes all required fields to match DTO validation.
- **Repository Mocks**: Mock all repository methods used by services (`findOne`, `create`, `save`, `findAndCount`).

## Common Test Issues & Solutions

### Service Method Mismatches

**Problem**: Tests call methods that don't exist on services (e.g., `findByEmailWithPassword` not mocked).
**Solution**: Always check service implementation for actual method names before writing tests. Mock all methods that the service actually calls.

### Error Message Mismatches

**Problem**: Tests expect error messages that don't match the actual messages thrown by services.
**Solution**: Use the exact error messages from `ErrorMessages` constants instead of hardcoded strings.

### Type Safety Violations

**Problem**: Mock objects don't satisfy interface requirements (missing required properties).
**Solution**: Provide complete mock objects with all required properties, or use `as unknown as Type` casting for complex mocks.

### CurrentUser Interface Issues

**Problem**: Mock user objects missing required `CurrentUser` properties (`id`, `email`, `subscriptionTier`).
**Solution**: Always include all required `CurrentUser` properties in test mocks. Import `SubscriptionTier` enum for proper typing.

### Auth Guard Mocking

**Problem**: Using `Partial<UsersService>` doesn't satisfy constructor requirements.
**Solution**: Provide complete service mocks with required properties or cast to `unknown` first.

### Controller Parameter Issues

**Problem**: Tests pass wrong parameter types to controller methods (e.g., passing request objects instead of `CurrentUser`).
**Solution**: Check controller method signatures and decorator usage (`@CurrentUserDecorator()`) to pass correct parameter types.


---

## typescript-security

### REFERENCE

# TypeScript Security Reference

Authentication, authorization, and security patterns.

## References

- [**Authentication**](authentication.md) - JWT and session management.
- [**Security Headers**](security-headers.md) - HTTP security headers configuration.

## Input Validation (Zod)

```typescript
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type User = z.infer<typeof UserSchema>;

// Validate at boundary
const result = UserSchema.safeParse(req.body);
if (!result.success) return res.status(400).json(result.error);
```

## Secure Cookie Options

```typescript
// In many Node deployments, production mode uses NODE_ENV === 'production';
// verify your environment's convention (e.g., 'prod' vs 'production').
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 1000, // 1 hour
};
```

## JWT Authentication Pattern

```typescript
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  role: string;
}

export class AuthService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
    if (!this.secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: '1h',
      issuer: 'your-app',
      audience: 'your-api',
    });
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
```

## Security Headers (Express)

```typescript
import helmet from 'helmet';
import express from 'express';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    credentials: true,
  }),
);
```

## Role-Based Access Control

```typescript
enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

type Permission = 'read' | 'write' | 'delete';

const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: ['read', 'write', 'delete'],
  [Role.USER]: ['read', 'write'],
  [Role.GUEST]: ['read'],
};

function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

// Middleware
function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Assume user is set by auth middleware

    if (!user || !hasPermission(user.role, permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}
```

## Zod Input Validation (Route Handler)

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin']),
});

// In route handler
app.post('/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  // result.data is fully typed and validated
  return userService.create(result.data);
});
```


---

## typescript-tooling

### REFERENCE

# TypeScript Tooling Reference

Testing configuration and CI/CD patterns.

## References

- [**Testing Setup**](testing-setup.md) - Jest and Vitest configuration.
- [**CI/CD**](ci-cd.md) - GitHub Actions and continuous integration.

## Jest Configuration

```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
```

## Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.d.ts', '**/*.interface.ts'],
    },
  },
});
```

## GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      - run: npm run build
```

## Pre-commit Hooks (Husky)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm run type-check
```


---

