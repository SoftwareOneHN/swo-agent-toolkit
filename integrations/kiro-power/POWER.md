# Coding Skills

High-density coding instructions that load on-demand based on what files you're editing and what task you're performing. Skills override AI pre-training patterns — ensuring consistent, team-aligned code quality.

## What This Power Does

Coding Skills provides context-aware rules, patterns, and anti-patterns organized by:
- **File type** you're editing (`.ts`, `.java`, `.go`, `.dart`, `.swift`, `.kt`, `.php`...)
- **Keywords** in your request (security, tdd, performance, refactor, review...)

Only relevant skills are loaded via steering files — keeping token usage minimal while enforcing quality.

## Skill Categories (21 categories, 246 skills)

| Category | Skills | Covers |
|----------|--------|--------|
| **common** | 33 | TDD, code review, security audit, OWASP, debugging, git, system design, performance, accessibility |
| **typescript** | 4 | Language patterns, tooling, security, best practices |
| **javascript** | 3 | Language patterns, tooling, best practices |
| **react** | 8 | Component patterns, hooks, state, performance, testing, forms |
| **react-native** | 13 | Architecture, navigation, performance, platform, testing |
| **angular** | 15 | Components, services, RxJS, forms, routing, testing |
| **nestjs** | 21 | Architecture, controllers, database, security, caching, real-time, scheduling |
| **nextjs** | 18 | Rendering, routing, server actions, data fetching, auth, deployment |
| **flutter** | 22 | BLoC, widgets, navigation, platform channels, testing, performance |
| **dart** | 3 | Language patterns, null safety, async |
| **java** | 5 | Language, testing, security, performance, best practices |
| **spring-boot** | 10 | Architecture, security, database, caching, testing, deployment |
| **kotlin** | 4 | Language, coroutines, best practices, testing |
| **android** | 26 | Compose, architecture, navigation, networking, testing, accessibility |
| **swift** | 8 | Language, concurrency, testing, best practices, security |
| **ios** | 15 | SwiftUI, UIKit, architecture, networking, persistence, testing |
| **golang** | 11 | Language, concurrency, error handling, testing, tooling |
| **php** | 7 | Language, security, testing, performance, best practices |
| **laravel** | 10 | Architecture, Eloquent, security, testing, real-time, scheduling |
| **database** | 3 | PostgreSQL, MongoDB, Redis |
| **quality-engineering** | 7 | Test strategy, Zephyr, Jira, automation, coverage |

## Skill Priority Tiers

- **P0 (Iron Law)**: MUST follow. Violation = delete code and redo.
- **P1 (Standard)**: SHOULD follow. Deviation requires explicit justification.
- **P2 (Guideline)**: Best practice. Follow unless conflicting with higher tier.

## How to Use

### 1. Activate this power
When starting any coding task, activate `coding-skills`.

### 2. Load relevant steering files (2-tier system)

**Tier 1 — `skills-{category}.md`** (core rules, always load first):
Contains SKILL.md content: rules, anti-patterns, checklists, triggers.

**Tier 2 — `refs-{category}.md`** (code examples, load when needed):
Contains references/: implementation examples, patterns, advanced guides.

**By file type:**
| Editing... | Load Tier 1 | Load Tier 2 (if need examples) |
|---|---|---|
| `*.ts`, `*.tsx` | `skills-typescript.md` | `refs-typescript.md` |
| `*.service.ts`, `*.module.ts` | `skills-nestjs.md` | `refs-nestjs.md` |
| `*.component.ts` | `skills-angular.md` | `refs-angular.md` |
| `*.tsx` (React) | `skills-react.md` | `refs-react.md` |
| `*.java` | `skills-java.md` | `refs-java.md` |
| `*.kt` | `skills-kotlin.md` + `skills-android.md` | `refs-kotlin.md` |
| `*.dart` | `skills-dart.md` + `skills-flutter.md` | `refs-flutter.md` |
| `*.swift` | `skills-swift.md` + `skills-ios.md` | `refs-ios.md` |
| `*.go` | `skills-golang.md` | `refs-golang.md` |
| `*.php` | `skills-php.md` + `skills-laravel.md` | `refs-laravel.md` |
| `*.sql`, `*.prisma` | `skills-database.md` | `refs-database.md` |
| `*.test.*`, `*.spec.*` | `skills-common.md` | `refs-common.md` |

**By task keyword:**
| Task mentions... | Load steering |
|---|---|
| security, auth, pentest | `skills-common.md` (security skills) |
| tdd, test, coverage | `skills-common.md` (TDD skill) |
| review, PR, critique | `skills-common.md` (code review skill) |
| performance, optimize | `skills-common.md` (performance skill) |
| architecture, design | `skills-common.md` (system design skill) |

### 3. Follow the rules
- Read ALL matched skills before writing code
- P0 rules are non-negotiable
- P1 rules require justification to skip
- Load `refs-*` when you need implementation examples

### 4. Verify compliance
Before completing task, check against loaded skill checklists.

## Steering Files Overview

### Always Loaded
| File | Purpose |
|---|---|
| `getting-started.md` | Core contract + routing table |

### Workflow Guides (manual)
| File | Use When |
|---|---|
| `skill-workflow.md` | Understanding how skill resolution works |
| `code-review.md` | Reviewing PRs or code changes |
| `tdd.md` | Writing tests before code |
| `security-audit.md` | Auditing for vulnerabilities |
| `performance.md` | Optimizing code performance |
| `custom-skills.md` | Creating project-specific skills |
| `caveman.md` | Ultra-compressed communication mode |

### Tier 1 — Skills (manual, load by file type)
| File | Content |
|---|---|
| `skills-{category}.md` | Core rules, anti-patterns, checklists from SKILL.md |

### Tier 2 — References (manual, load when need examples)
| File | Content |
|---|---|
| `refs-{category}.md` | Code examples, implementation patterns, advanced guides |

## Integration with Hooks

Recommended hooks for enforcement:

**Pre-write skill check:**
```json
{
  "when": { "type": "preToolUse", "toolTypes": ["write"] },
  "then": { "type": "askAgent", "prompt": "Before writing code, verify you have loaded the relevant skills-*.md steering file from coding-skills power for the target files. If not loaded, read it now." }
}
```

**Post-task compliance:**
```json
{
  "when": { "type": "postTaskExecution" },
  "then": { "type": "askAgent", "prompt": "Verify compliance with all P0/P1 rules from loaded coding-skills steering files. List any violations and fix them." }
}
```
