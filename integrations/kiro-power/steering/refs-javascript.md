---
inclusion: manual
---

# References: javascript

> 3 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-javascript.md`.

## javascript-best-practices

### REFERENCE

# JavaScript Best Practices Reference

## Code Examples

```javascript
// Constants
const STATUS = { OK: 200, ERROR: 500 };

// Custom Errors
class APIError extends Error {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }
}

// Async + JDoc
/** @throws {APIError} */
export async function getData(id) {
  if (!id) throw new APIError('Missing ID', 400);
  const res = await fetch(`/api/${id}`);
  if (!res.ok) throw new APIError('Failed', res.status);
  return res.json();
}
```

## Module patterns and project organization

## References

- [**Module Patterns**](module-patterns.md) - ES6 modules and organization.
- [**Project Structure**](project-structure.md) - Directory organization.

## Module Patterns

```javascript
// Public API with index.js
// src/users/index.js
export { UserService } from './user-service.js';
export { UserRepository } from './user-repository.js';
export { createUser, updateUser } from './user-operations.js';

// Private implementation
// src/users/user-service.js
import { UserRepository } from './user-repository.js';
import { validateUser } from './validators.js';

export class UserService {
  constructor(repository = new UserRepository()) {
    this.repository = repository;
  }

  async createUser(data) {
    validateUser(data);
    return this.repository.save(data);
  }
}

// Singleton pattern
// src/utils/logger.js
class Logger {
  #instance;

  constructor() {
    if (Logger.#instance) {
      return Logger.#instance;
    }
    Logger.#instance = this;
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

export const logger = new Logger();
```

## Project Structure

```bash
src/
├── domain/           # Business logic
│   └── user/
│       ├── user.js
│       └── user-repository.js
├── services/         # Application services
│   └── user-service.js
├── utils/            # Utilities
│   ├── logger.js
│   └── validation.js
├── config/           # Configuration
│   └── database.js
└── index.js          # Entry point
```

## Configuration Management

```javascript
// config/index.js
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    logLevel: 'debug',
  },
  production: {
    apiUrl: process.env.API_URL,
    logLevel: 'error',
  },
};

const env = process.env.NODE_ENV || 'development';

export default config[env];
```


---

## javascript-language

### REFERENCE

# JavaScript Language Patterns Reference

## Modern Syntax Examples

```javascript
// Destructuring + Spread
const [x, ...rest] = items;
const name = user?.profile?.name ?? 'Guest';

// Async + Error Handling
async function getUser(id) {
  const res = await fetch(`/api/${id}`);
  return res.json(); // Errors propagate
}

// Private Fields
class Service {
  #key;
  constructor(k) {
    this.#key = k;
  }
}
```

## Advanced patterns and functional programming techniques

## References

- [**Functional Programming**](functional-programming.md) - Immutability and pure functions.
- [**Promises & Async**](promises-async.md) - Advanced async patterns.

## Functional Programming Patterns

```javascript
// Pure functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Function composition
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

// Example usage
const addOne = (x) => x + 1;
const double = (x) => x * 2;
const addOneThenDouble = pipe(addOne, double);
console.log(addOneThenDouble(3)); // 8

// Immutable data updates
const updateUser = (user, updates) => ({
  ...user,
  ...updates,
  updatedAt: new Date(),
});

// Deep cloning
const deepClone = (obj) => structuredClone(obj);

// Currying
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...args2) => curried.apply(this, args.concat(args2));
  };
};

const add3 = curry((a, b, c) => a + b + c);
console.log(add3(1)(2)(3)); // 6
console.log(add3(1, 2)(3)); // 6
```

## Advanced Async Patterns

```javascript
// Promise.all for parallel execution
async function fetchAllUsers(ids) {
  const promises = ids.map((id) => fetch(`/api/users/${id}`));
  const responses = await Promise.all(promises);
  return Promise.all(responses.map((r) => r.json()));
}

// Promise.allSettled for handling partial failures
async function fetchWithFallback(urls) {
  const results = await Promise.allSettled(urls.map((url) => fetch(url)));

  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
}

// Retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Debounce
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```


---

## javascript-tooling

### REFERENCE

# JavaScript Tooling Reference

Testing patterns and CI/CD configuration.

## References

- [**Testing Patterns**](testing-patterns.md) - Unit and integration testing.
- [**CI/CD**](ci-cd.md) - Continuous integration setup.

## Jest Testing Patterns

```javascript
// user-service.test.js
import { UserService } from './user-service.js';

describe('UserService', () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    service = new UserService(mockRepository);
  });

  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      mockRepository.save.mockResolvedValue({ id: '1', ...userData });

      const result = await service.createUser(userData);

      expect(result).toEqual({ id: '1', ...userData });
      expect(mockRepository.save).toHaveBeenCalledWith(userData);
    });

    it('should throw error for invalid data', async () => {
      const invalidData = { name: '' };

      await expect(service.createUser(invalidData))
        .rejects
        .toThrow('Name is required');
    });
  });
});
```

## Integration Testing

```javascript
// api.integration.test.js
import request from 'supertest';
import { app } from '../app.js';

describe('User API', () => {
  it('GET /api/users/:id returns user', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .expect(200);

    expect(response.body).toHaveProperty('id', '1');
    expect(response.body).toHaveProperty('name');
  });

  it('POST /api/users creates user', async () => {
    const newUser = { name: 'Jane', email: 'jane@example.com' };

    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
  });
});
```

## GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
```


---

