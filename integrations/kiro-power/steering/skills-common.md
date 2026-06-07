---
inclusion: manual
---

# Skills: common

> 33 skills. Load when editing common files.
> For code examples and implementation patterns, load `refs-common.md`.

## Index

# common Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| common-accessibility | `**/*.html`, `**/*.vue`, `**/*.component.html` | accessibility, a11y, wcag, aria, screen reader, focus, alt text |
| common-api-design | `**/*.controller.ts`, `**/*.router.ts`, `**/*.routes.ts`, `**/routes/**`, `**/controllers/**`, `**/handlers/**` | rest api, endpoint, http method, status code, versioning, pagination, openapi, api design, api contract |
| common-architecture-audit | `package.json`, `pubspec.yaml`, `go.mod`, `pom.xml`, `nest-cli.json` | architecture audit, code review, tech debt, logic leakage, refactor |
| common-architecture-diagramming | `ARCHITECTURE.md`, `**/*.mermaid`, `**/*.drawio` | diagram, architecture, c4, system design, mermaid |
| common-context-optimization | `*.log`, `chat-history.json` | reduce tokens, optimize context, summarize history, clear output |
| common-error-handling | `**/*.service.ts`, `**/*.handler.ts`, `**/*.controller.ts` | error handling, exception, try catch, error boundary, error response, error code, throw |
| **common-feedback-reporter** | `SKILL.md`, `+common/common-learning-log` | skill violation, pre-write audit, audit violations |
| common-learning-log | `AGENTS_LEARNING.md` | mistake, wrong, redo, correction, agent error, learning log |
| common-mobile-animation | `**/*_page.dart`, `**/*_screen.dart`, `**/*Activity.kt`, `**/*Screen.tsx` | Animation, AnimationController, Animated, MotionLayout, transition, gesture |
| **common-mobile-ux-core** | `**/*_page.dart`, `**/*_screen.dart`, `**/*_view.dart`, `**/*Activity.kt`, `**/*Screen.tsx` | mobile, responsive, SafeArea, touch, gesture, viewport |
| common-observability | `**/*.service.ts`, `**/*.handler.ts`, `**/*.middleware.ts`, `**/*.interceptor.ts` | logging, tracing, metrics, opentelemetry, observability, slo |
| **common-product-requirements** | `PRD.md`, `specs/*.md` | create prd, draft requirements, new feature spec |
| **common-security-audit** | `package.json`, `go.mod`, `pubspec.yaml`, `pom.xml` | Dockerfile, security audit, vulnerability scan, secrets detection, injection probe, pentest |
| common-session-retrospective | `**/*.spec.ts`, `**/*.test.ts`, `SKILL.md`, `AGENTS.md`, `+common/common-learning-log` | retrospective, self-learning, improve skills, session review, correction, rework |
| **common-skill-creator** | `SKILL.md`, `evals/evals.json` | create skill, audit skill, trigger rate, optimize description |
| **common-tdd** | `**/*.test.ts`, `**/*.spec.ts`, `**/*_test.go`, `**/*Test.java`, `**/*_test.dart`, `**/*_spec.rb` | tdd, unit test, write test, red green refactor, failing test, test coverage |
| **common-workflow-writing** | `.agents/workflows/*.md`, `SKILL.md` | create workflow, write workflow, new skill, new workflow |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| **common-best-practices** | solid, kiss, dry, yagni, naming, conventions, refactor, clean code |
| common-code-review | review, pr, critique, analyze code |
| common-dast-tooling | DAST, dynamic scan, zap, nuclei, nikto, curl probe, pentest, dynamic analysis |
| common-debugging | debug, fix bug, crash, error, exception, troubleshooting |
| common-documentation | comment, docstring, readme, documentation |
| **common-git-collaboration** | commit, branch, merge, pull-request, git |
| **common-llm-security** | LLM security, prompt injection, agent security, RAG security, AI security, openai, anthropic, langchain, LLM review |
| common-mobile-visual-testing | visual test, mobile test, verify ui, dark mode test, accessibility audit, behavioral test, visual regression, localization test |
| **common-owasp** | security review, OWASP, broken access control, IDOR, BOLA, injection, broken auth, API review, authorization, access control |
| **common-performance-engineering** | performance, optimize, profile, scalability, latency, throughput, memory leak, bottleneck |
| **common-protocol-enforcement** | verify done, protocol check, self-scan, pre-write audit, task complete, audit violations, retrospective, scan, red-team |
| **common-security-standards** | security, encrypt, authenticate, authorize |
| common-store-changelog | generate changelog, app store notes, play store release, what's new, release notes, version notes, store release |
| **common-system-design** | architecture, design, system, scalability, microservice, module boundary, coupling |
| **common-ui-design** | build a page, create a component, design a dashboard, landing page, UI for, build a layout, make it look good, improve the design, build UI, create interface, design screen |
| common-web-visual-testing | web test, browser test, responsive audit, verify web ui, cross-browser check, web accessibility |

> Load matched skills: `<SKILLS>/common/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### common-accessibility

---
name: common-accessibility
description: Enforce WCAG 2.2 AA compliance with semantic HTML, ARIA roles, keyboard navigation, and color contrast standards for web UIs. Use when building interactive components, adding form labels, fixing focus traps, or auditing a11y compliance.
metadata:
  triggers:
    files:
    - '**/*.tsx'
    - '**/*.jsx'
    - '**/*.html'
    - '**/*.vue'
    - '**/*.component.html'
    keywords:
    - accessibility
    - a11y
    - wcag
    - aria
    - screen reader
    - focus
    - alt text
---
# Common Accessibility (a11y) Standards

## **Priority: P1 (OPERATIONAL)**

> Legal req: EU (Web Accessibility Directive), USA (ADA/Section 508). Non-compliance = litigation risk. Minimum: **WCAG 2.2 Level AA**.

## 🏗 Semantic HTML First

- Use native HTML before ARIA. `<button>`, `<a>`, `<nav>`, `<main>`, `<section>`, `<form>`, `<label>` convey semantics natively.
- Never `<div>`/`<span>` for interactive elements — no keyboard role by default.
- Headings (`h1`–`h6`) must form logical outline. One `h1` per page.

- `<button>` not `<div onClick>`, `<a>` not `<span onClick>`.

## 🎭 ARIA — Use Sparingly

ARIA supplements native HTML when insufficient (e.g., custom widgets). Rules:

1. **No ARIA > Bad ARIA**: If native HTML works, use it. ARIA only adds roles, not behavior.
2. **Required attributes**: Every `role` with required properties must include them (e.g., `role="slider"` needs `aria-valuenow`, `aria-valuemin`, `aria-valuemax`).
3. **Live Regions**: Use `aria-live="polite"` for status messages; `aria-live="assertive"` only for critical alerts.
4. **Labels**: Every form control needs programmatic label (`<label>`, `aria-label`, or `aria-labelledby`).
5. **Hidden content**: Use `aria-hidden="true"` on decorative icons; never on focusable elements.

## ⌨️ Keyboard Navigation

- All interactive elements MUST reachable and operable via keyboard.
- Tab order must follow visual reading order. No positive `tabindex` (`tabindex="1"` breaks natural order).
- Visible focus indicators required (see Focus style rule below).
- **Modals/Dialogs**: Trap focus inside when open. Return focus to trigger element on close.
- **Escape key**: Must close modals, dropdowns, and tooltips.
- **Focus style**: Never `outline: none` without visible replacement (min 2px solid, 3:1 contrast).

## 🎨 Color & Contrast

- Normal text: ≥ 4.5:1 ratio. Large text (≥ 18pt or 14pt bold): ≥ 3:1. UI components: ≥ 3:1.
- Never convey information through color alone — add icon, pattern, or text label.
- Test with: axe DevTools, WAVE, Lighthouse.

## 📐 Touch & Pointer Targets

- Minimum interactive target size: **44×44px** (WCAG 2.5.5 AAA) / **24×24px** minimum (WCAG 2.2 AA).
- Sufficient spacing between adjacent targets — prevent mis-taps.

## 🖼 Images & Media

- Decorative images: `alt="` (empty, not missing).
- Informative images: descriptive `alt` — what image conveys, not "image of…".
- Complex charts/graphs: text summary or data table alternative.
- Video: Captions mandatory. Audio descriptions for visual-only content.

## 🧪 Testing Minimum

- CI gate: `axe-core` zero critical violations.
- Manual: keyboard-only full flow + screen reader (NVDA/VoiceOver) + 200% zoom.

## Anti-Patterns

- **No `onClick` on `<div>`**: Use `<button>` or add `role`, `tabindex`, and keyboard handlers.
- **No missing `alt`**: Every `<img>` must `alt` attribute (empty string if decorative).
- **No color-only status**: Red = error must also show icon or text.
- **No `outline: none`** without replacement focus style.
- **No auto-playing media**: Users with vestibular disorders may harmed.
- **No dynamic content without announcement**: Use `aria-live` for async status updates.

## References

- [Semantic HTML, ARIA & Focus Patterns](references/REFERENCE.md)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)


---

### common-api-design

---
name: common-api-design
description: Apply REST API conventions — HTTP semantics, status codes, versioning, pagination, and OpenAPI standards for any framework. Use when designing endpoints, choosing HTTP methods, implementing pagination, or writing OpenAPI specs.
metadata:
  triggers:
    files:
    - '**/*.controller.ts'
    - '**/*.router.ts'
    - '**/*.routes.ts'
    - '**/routes/**'
    - '**/controllers/**'
    - '**/handlers/**'
    keywords:
    - rest api
    - endpoint
    - http method
    - status code
    - versioning
    - pagination
    - openapi
    - api design
    - api contract
---
# Common API Design Standards

## **Priority: P1 (OPERATIONAL)**

## 🔧 HTTP Verb Semantics

- `GET` read-only, idempotent — never mutates state.
- `POST` create or trigger; `PUT` full replace; `PATCH` partial update; `DELETE` remove.
- Non-CRUD actions as sub-resources: `POST /orders/:id/cancel`.

## 📡 Status Code Correctness

- `200` success; `201` created (add `Location` header); `204` no body.
- `400` validation (with `details[]`); `401` unauthenticated; `403` unauthorized; `404` not found.
- `409` conflict; `422` business rule violation; `429` rate limit (add `Retry-After`); `500` unhandled.

## 📦 URL Design Rules

- **Lowercase, kebab-case**: `/user-profiles`, not `/UserProfiles` or `/user_profiles`.
- **Plural nouns**: `/orders`, `/products`. Not `/order`, `/getProducts`.
- **No verbs in paths** (except action sub-resources): `/orders/:id/cancel` ✅, `/cancelOrder` ❌.
- **Hierarchy**: Use nesting only up to 2 levels: `/users/:id/orders` ✅, `/users/:id/orders/:orderId/items/:itemId` ❌.

## 🔢 API Versioning

- **Strategy**: URL path versioning default: `/v1/users`, `/v2/users`.
- **Header versioning** (`Api-Version: 2`) acceptable for internal APIs.
- Never mix versions in same controller — each version gets its own route module.
- Support prev major ≥ 6 months after new release.
- Deprecation: `Deprecation: true` + `Sunset: <date>` headers when version will be retired.

## 📄 Pagination

- Prefer cursor-based (`cursor` + `limit`) for large/live datasets; offset only for small static ones.
- Default `limit: 20`, max `100`. Reject requests exceeding max.
- Response envelope: `{ data: [], pagination: { nextCursor, hasNextPage } }`.

## 📝 OpenAPI Contract

- Generate from code annotations — not hand-written YAML.
- Every API needs OpenAPI 3.1 spec.
- Include: request/response schemas, error shapes, auth requirements, examples.
- Review spec in PR — breaking changes need version bump.

## 🔒 API Security Baseline

- Require auth on all routes by default; use `@Public()` or equivalent opt-out.
- Validate and sanitize all query params, path params, and request bodies.
- Set `Content-Type: application/json` explicitly. Reject unexpected content types.
- Include `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` headers.

## Anti-Patterns

- **No `GET` mutations**: Search engines and CDNs cache GET — mutating state catastrophic.
- **No 200 for errors**: `{ "success": false, "data": null }` with HTTP 200 breaks monitoring.
- **No deeply nested URLs**: Hard to document, version, and cache.
- **No breaking changes without versioning**: Removing/renaming fields in-place breaks consumers silently.

## References

- [URL Examples, Status Codes & Pagination Envelope](references/REFERENCE.md)


---

### common-architecture-audit

---
name: common-architecture-audit
description: Audit structural debt, logic leakage, and monolithic components across Web, Mobile, and Backend codebases. Use when reviewing architecture, assessing tech debt, detecting logic in wrong layers, or identifying God classes.
metadata:
  triggers:
    files:
    - 'package.json'
    - 'pubspec.yaml'
    - 'go.mod'
    - 'pom.xml'
    - 'nest-cli.json'
    keywords:
    - architecture audit
    - code review
    - tech debt
    - logic leakage
    - refactor
---
# Architecture Audit

## **Priority: P1 (STANDARD)**

## 1. Discover Structural Duplication

Identify split sources of truth by searching for redundant directory patterns.

- Compare `Service.ts` vs `ServiceNew.ts` vs `ServiceV2.ts`.
- Check for `/v1`, `/v2` or "Refactor" folders.

See [implementation examples](references/implementation.md) for detection scripts.

## 2. Detect Logic Leakage (by Ecosystem)

Find business logic trapped in wrong layer.

- **Web (React/Next.js/Vue)**: `grep -rE "useEffect|useState|useMemo" components --include="*.tsx" | wc -l` — if `components/` hook count > 20x `hooks/` folder, architecture monolithic.
- **Mobile (Flutter/React Native)**: `grep -rE "http\.|dio\.|socket\." lib/widgets --include="*.dart" | wc -l` — I/O or state mutation > 5 lines in `build()` High Debt.
- **Backend (NestJS/Go/Spring)**: `grep -rE "Repository\.|Query\.|db\." src/controllers --include="*.ts" | wc -l` — Controllers must only handle request parsing and response formatting.

## 3. Identify Monoliths

Flag massive files violating Single Responsibility Principle.

- **UI**: > 500 lines (Medium), > 1,000 lines (Critical).
- **Backend Services**: > 1,500 lines indicates "God Class".

See [implementation examples](references/implementation.md) for monolith detection scripts.

## 4. Audit Resource Performance

Check for large metadata or constants impacting IDE performance and binary size.

- Resources > 1,000 lines require granulation.

See [implementation examples](references/implementation.md) for resource audit scripts.

## Scoring Impact

- **Layer Violation**: -15 per business logic instance in UI/Controller layer.
- **Structural Fragmentation**: -10 per duplicated legacy entity.
- **Monoliths**: -10 per unit > 1,000 lines.

## Anti-Patterns

- **No applying generic patterns over project-specific rules**: Respect existing architecture constraints.
- **No ignoring error handling or edge cases**: Audit must cover boundary conditions.

## References

- [Architecture Patterns & Remediation Protocols](references/PATTERNS.md)

---

### common-architecture-diagramming

---
name: common-architecture-diagramming
description: Standards for creating clear, audience-appropriate C4 and UML architecture diagrams with Mermaid. Use when producing system context diagrams, container views, sequence diagrams, or updating ARCHITECTURE.md files.
metadata:
  triggers:
    files:
    - 'ARCHITECTURE.md'
    - '**/*.mermaid'
    - '**/*.drawio'
    keywords:
    - diagram
    - architecture
    - c4
    - system design
    - mermaid
---
# Architecture Diagramming Standard

## **Priority: P1 (Standard)**

## Guidelines

- **Use C4 Model**: Context -> Container -> Component -> Code.
- **Audience-Centric**: Tailor abstraction (Execs vs. Devs).
- **Select Type**: Sequence (Protocol), ERD (Data), State (Lifecycle), Cloud (Infra). See [Selection](references/diagram-selection.md).
- **Explicit Labels**: Label every arrow (e.g., "Uses", "HTTPS").
- **Consistent Notation**: Cylinders=DB, Rectangles=Systems, Dashed=Async.
- **Metadata**: Title, Date, Version, Author.
- **Legend Mandatory**: Define all shapes/colors/styles.
- **Direction**: `graph LR` (Flow) or `graph TD` (Hierarchy).
- **Deployment**: Map containers to infrastructure.
- **Governance**: CRITICAL: Review [best-practices.md](references/best-practices.md) before starting.

See [implementation examples](references/implementation.md) for C4 container diagram in Mermaid.

## Anti-Patterns

- **Mixed Levels**: DB columns in System Context.
- **Unlabeled Arrows**: Ambiguous relations.
- **Mystery Shapes**: Undefined in Legend.
- **Dead Ends**: Unconnected nodes.
- **Clutter**: >20 nodes/diagram.
- **Acronyms**: Undefined abbreviations.

## References

- [Diagram Selection](references/diagram-selection.md)
- [Cloud Architecture](references/cloud-architecture.md)
- [C4 Model Guide](references/c4-model.md)
- [Checklist](references/checklist.md)
- [Best Practices](references/best-practices.md)

---

### common-best-practices

---
name: common-best-practices
description: Enforce SOLID principles, guard-clause style, function size limits, and intention-revealing naming across all languages. Use when refactoring for readability, applying clean-code patterns, reviewing naming conventions, or reducing function complexity.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.tsx'
    - '**/*.go'
    - '**/*.dart'
    - '**/*.java'
    - '**/*.kt'
    - '**/*.swift'
    - '**/*.py'
    keywords:
    - solid
    - kiss
    - dry
    - yagni
    - naming
    - conventions
    - refactor
    - clean code
---
# Global Best Practices

## **Priority: P0 (FOUNDATIONAL)**

## Core Principles

- **SOLID**: Follow SRP (One reason to change), OCP (Open to extension), LSP, ISP, DIP.
- **KISS/DRY/YAGNI**: Favor readability. Abstract repeated logic. No " in case" code.
- **Naming**: Use intention-revealing names (`isUserAuthenticated` > `checkUser`). Match language casing.

## Code Hygiene

- **Size Limits**: Functions < 30 lines. Services < 600 lines. Utils < 400 lines.
- **Early Returns**: Use guard clauses. Avoid deep nesting.
- **Comments**: Explain **why**, not **what**. Refactor bad code; don't comment it.
- **Input**: Validate/sanitize all external inputs.

## Anti-Patterns

- **No Hardcoded Constants**: Use named config/env vars.
- **No Deep Nesting**: Use guard clauses.
- **No Global State**: Prefer dependency injection.
- **No Empty Catches**: Always handle, log, or rethrow.

## References

- [Code Structure Patterns](references/CODE_STRUCTURE.md) — file/function organization
- [Effectiveness Guide](references/EFFECTIVENESS.md) — practical application examples

---

### common-code-review

---
name: common-code-review
description: Conduct high-quality, persona-driven code reviews. Use when reviewing PRs, critiquing code quality, or analyzing changes for team feedback.
metadata:
  triggers:
    keywords:
    - review
    - pr
    - critique
    - analyze code
---
# Code Review Expert

## **Priority: P1 (OPERATIONAL)**

**Role: Principal Engineer.** Focus: logic, security, architecture. constructive.

## Review Principles

- **Substance > Style**: Ignore formatting. Find bugs, flaws, design errors.
- **Questions > Commands**: " this handle null?" instead of "Fix this."
- **Clarity**: Group by `[BLOCKER]`, `[MAJOR]`, `[NIT]`.
- **Sync**: Enforce active framework P0 rules.

## Review Checklist (Mandatory)

- [ ] **Security**: No injection, secrets, auth leaks.
- [ ] **Efficiency**: No N+1 queries, memory leaks, high Big O.
- [ ] **Logic**: Requirements met. Edge cases handled.
- [ ] **Clean Code**: DRY/SOLID. Intent-revealing names.

See [references/checklist.md](references/checklist.md).

## Output Format (Strict)

```
[SEVERITY] [File] Issue Description
Why: Risk or impact description.
Fix: 1-2 line code or action.
```

## Anti-Patterns

- **No Nitpicking**: Ignore style; focus on impact.
- **No Vague Demands**: Explain _why_ and _how_.
- **No Skimming**: Review tests and edge cases.

## References

- [Output Templates](references/output-format.md)
- [Full Checklist](references/checklist.md)

---

### common-context-optimization

---
name: common-context-optimization
description: Maximize context window efficiency, reduce latency, and prevent lost-in-middle issues through strategic masking and compaction. Use when token budgets are tight, tool outputs flood the context, conversations drift from intent, or latency spikes from cache misses.
metadata:
  triggers:
    files:
    - '*.log'
    - 'chat-history.json'
    keywords:
    - reduce tokens
    - optimize context
    - summarize history
    - clear output
---
## **Priority: P1 (OPTIMIZATION)**


## 1. Observation Masking (Noise Reduction)

**Problem**: Large tool outputs (logs, JSON lists) flood context and degrade reasoning.
**Solution**: Replace raw output with semantic summaries _after_ consumption.

1. **Identify** outputs exceeding 50 lines or 1 KB.
2. **Extract** critical data points immediately.
3. **Mask** by rewriting history to replace raw data with summary placeholder.
4. **See** `references/masking.md` for patterns.

See [implementation examples](references/implementation.md) for masking patterns.

## 2. Context Compaction (State Preservation)

**Problem**: Long conversations drift from original intent.
**Solution**: Recursive summarization that preserves _State_ over _Dialogue_.

1. **Trigger** compaction every 10 turns or 8k tokens.
2. **Compact**:
 - **Keep**: User Goal, Active Task, Current Errors, Key Decisions.
 - **Drop**: Chat chit-chat, intermediate tool calls, corrected assumptions.
3. **Format**: Update System Prompt or Memory File with compacted state.
4. **See** `references/compaction.md` for algorithms.

See [implementation examples](references/implementation.md) for compacted state format.

## 3. KV-Cache Awareness (Latency)

**Goal**: Maximize pre-fill cache hits.

- **Static Prefix**: Enforce strict ordering — System -> Tools -> RAG -> User.
- **Append-Only**: Never insert into middle of history; append new turns only.

## References

- [Observation Masking Patterns](references/masking.md)
- [Compaction Algorithms](references/compaction.md)

## Anti-Patterns

- **No raw tool dumps**: Mask large outputs immediately after extracting data.
- **No unbounded growth**: Compact every 10 turns to preserve intent over dialogue.
- **No middle insertions**: Append-only history maximizes KV cache hits.

---

### common-dast-tooling

---
name: common-dast-tooling
description: Standardize usage of Dynamic Application Security Testing (DAST) tools (ZAP, Nuclei, Nikto) and custom AI-driven curl probes for adversarial system testing. Use when advising on or running dynamic security scans on local/staging environments.
metadata:
  triggers:
    keywords:
    - DAST
    - dynamic scan
    - zap
    - nuclei
    - nikto
    - curl probe
    - pentest
    - dynamic analysis
---
# DAST Tooling Standard

## **Priority: P1 (OPERATIONAL)**

## Always-Apply Rules

- **No Scanning Production**: Never run DAST tools against live production environments. Use local or staging replicas only.
- **No Uncapped Scans**: Always set `max-depth` or `max-duration` to avoid infinite loops on dynamic routes.
- **No Anonymous Probing**: Use authenticated headers (`Authorization`) to test protected surfaces, not public ones.

## 1. Automated DAST Tools

Follow [implementation guide](references/implementation.md) for command-line setup.

- **Nuclei**: Best for fast, template-based CVE/Misconfiguration scanning.
- **ZAP-CLI**: Best for deep spidering and web vulnerability scanning (SQLi, XSS, etc.).
- **Nikto**: Quick scan for insecure server configurations and outdated software.

## 2. Adversarial `curl` Probing (Manual)

When tools unavailable, use AI to generate targeted `curl` probes:

- **Bypassing Guards**: Probe protected routes with manipulated headers (`X-Forwarded-For`, `X-Custom-Auth`).
- **Data Leakage**: Request `/metrics`, `/health`, or `.git` directories to find exposed metadata.
- **Parameter Tampering**: Modify payload types (String -> Object) or inject large payloads to test limits.

## Scoring Impact

| Finding | Severity | Deduction |
| --------------------------------------- | -------- | --------- |
| Unauthenticated access to private data | P0 | -25 |
| Successful SQLi/RCE via probe | P0 | -20 |
| Info Leakage (Server versions/Env vars) | P1 | -10 |
| Missing security headers (CSP/HSTS) | P2 | -5 |

## Anti-Patterns

- **No relying solely on static analysis**: Pentesting MUST include dynamic execution feedback.
- **No ignoring non-web protocols**: Check Docker ports, SSH banners, and internal gRPC/RMQ listeners.

## References

- [DAST Tooling Implementation](references/implementation.md)
- [OWASP Dynamic Scanning Guide](https://owasp.org/www-community/Vulnerability_Scanning)

---

### common-debugging

---
name: common-debugging
description: Troubleshoot systematically using the Scientific Method. Use when debugging crashes, tracing errors, diagnosing unexpected behavior, or investigating exceptions.
metadata:
  triggers:
    keywords:
    - debug
    - fix bug
    - crash
    - error
    - exception
    - troubleshooting
---
# Debugging Expert

## **Priority: P1 (OPERATIONAL)**


## Scientific Method

1. **OBSERVE**: Gather data. What exactly happening?
 - Logs, Stack Traces, Screenshots, Steps to Reproduce.
2. **HYPOTHESIZE**: Formulate theory. "I think X causing Y because Z."
3. **EXPERIMENT**: Test theory.
 - Create reproduction case.
 - Change _one variable at time_ to validate hypothesis.
4. **FIX**: Implement solution once root cause proven.
5. **VERIFY**: Ensure fix works and doesn't introduce regressions.

## Anti-Patterns

- **No shotgun debugging**: Prove root cause before changing code.
- **No debug prints in production**: Remove all print/console.log before commit.
- **No symptom masking**: Fix root cause; never swallow errors without handling.

## Best Practices

- **Diff Diagnosis**: What changed since it last worked?
- **Minimal Repro**: Create smallest possible code snippet that reproduces issue.
- **Rubber Ducking**: Explain code line-by-line to inanimate object (or agent).
- **Binary Search**: Comment out half code to isolate failing section.

## References

- [Bug Report Template](references/bug-report-template.md)

---

### common-documentation

---
name: common-documentation
description: Write effective code comments, READMEs, and technical documentation following intent-first principles. Use when adding comments, writing docstrings, creating READMEs, or updating any documentation.
metadata:
  triggers:
    keywords:
    - comment
    - docstring
    - readme
    - documentation
---
# Documentation Standards

## **Priority: P2 (MAINTENANCE)**

## 1. Intent-First Comments

- Explain **"Why"** logic exists. Avoid "What" mechanics.
- Use triple-slash (Dart/Swift) or JSDoc (TS/JS) for public members.
- Delete commented-out code. Use Git history.
- Format: `TODO(username): description`. Link tickets.

## 2. README Structure

- **Mission**: Project purpose (one sentence).
- **Onboarding**: Prerequisites, installation, usage (exact).
- **Maintenance**: Document inputs/outputs, known quirks, fixes.
- **Sync**: Documentation ships with feature.

## 3. ADRs & Architecture

- **ADRs**: Document rationale for system changes in `docs/adr/`.
- **Docstrings**: Include Args, Returns, and Usage examples (`>>>`).
- **Diagrams**: Use Mermaid.js inside Markdown.

## 4. API Docs

- Use Swagger/OpenAPI for REST.
- Provide copy-pasteable examples for endpoints.
- Define contract before implementation.

## Anti-Patterns

- **No "what" comments**: Explain intent. Refactor mechanics.
- **No orphan TODOs**: Require owner and ticket.
- **No stale docs**: Document during development.

---

### common-error-handling

---
name: common-error-handling
description: Cross-cutting standards for error design, response shapes, error codes, and boundary placement across API, domain, and infrastructure layers. Use when defining error hierarchies, wrapping exceptions, building standardized error responses, or placing error boundaries in layered architectures.
metadata:
  triggers:
    files:
    - '**/*.service.ts'
    - '**/*.handler.ts'
    - '**/*.controller.ts'
    - '**/*.go'
    - '**/*.java'
    - '**/*.kt'
    - '**/*.py'
    keywords:
    - error handling
    - exception
    - try catch
    - error boundary
    - error response
    - error code
    - throw
---
# Error Handling Standards

## **Priority: P1 (OPERATIONAL)**

## Error Architecture

- **API Layer**: Map domain errors to HTTP responses globally.
- **Domain Layer**: Throw pure business errors. NO HTTP status codes here.
- **Infra Layer**: Wrap 3rd-party exceptions. NOT leak raw DB errors to API.
- **Standard Shape**: APIs must return standardized JSON envelope:

See [implementation examples](references/implementation.md) for standard error response shape.

## Error Mechanics

- **Wrap**: Add context (`fmt.Errorf("process: %w", err)`, `new Error('msg', { cause })`).
- **Replace**: Only when original error leaks sensitive details.
- **Error Codes**: Use `SCREAMING_SNAKE_CASE` IDs (`ORDER_PAYMENT_FAILED`).

## Anti-Patterns

- **Swallowing Errors**: Never `catch(e) {}` without logging or re-throwing.
- **Stack Traces**: Never expose stack traces in API responses.
- **Generic 500s**: Use `400` with specific details for validation instead of 500.

## References
- [API Error Contract](references/api-error-contract.md)

---

### common-feedback-reporter

---
name: common-feedback-reporter
description: 'Pre-write skill violation audit. Checks planned code against loaded skill anti-patterns before any file write. Use when writing Flutter/Dart code, editing SKILL.md files, or generating any code where project skills are active. Load as composite alongside other skills. When a violation is detected and Auto-fixed: YES, also load +common/common-learning-log to record the mistake.'
metadata:
  triggers:
    files:
    - 'SKILL.md'
    - '**/*.dart'
    - '**/*.ts'
    - '**/*.tsx'
    - '+common/common-learning-log'
    keywords:
    - skill violation
    - pre-write audit
    - audit violations
---
# Feedback Reporter

## **Priority: P0 - Auto-detect skill violations before file writes**

## 🚨 Checkpoint: Before File Writes

**Quick check before `write_to_file`, `replace_file_content`, `multi_replace_file_content`:**

1. **Check** - Any skills loaded for this file extension?
 - NO → ✅ Proceed silently
 - YES → Continue to step 2
2. **Audit** - planned code violate loaded skill rules?
 - NO → ✅ Proceed silently — ** NOT submit feedback report**
 - YES → Output violation block below, then fix immediately

## Detection Flow

```
Before file write?
├─ Check file extension → Identify loaded skills
├─ Review skill anti-patterns/rules
├─ Code matches anti-pattern?
│  ├─ YES → 🚨 VIOLATION → feedback command
│  └─ NO → ✅ Proceed
└─ No skills loaded → ✅ Proceed
```

## Examples (Quick Reference)

**Flutter**: `color: Colors.blue` → Rule: No hardcoded colors → Report + use theme

**React**: `class MyComponent extends...` → Rule: Use functions → Report + convert

**SKILL.md**: 105 lines → Rule: ≤100 lines max → Report + extract to references/

[More examples →](references/violation-examples.md)

## Violation Report Format

When violation detected, output this block before fixing:

```
🚨 SKILL VIOLATION DETECTED
Skill:        [skill-id]
File:         [relative/path/to/file.ext]:[line-range]
Rule:         [exact rule text from SKILL.md]
Violation:    [what planned code does — up to 5-line offending snippet]
Fix:          [corrected approach — up to 5-line corrected snippet]
Auto-fixed:   YES / NO
Root Cause:   [AMBIGUOUS_RULE | MISSING_COVERAGE | OUTDATED_GUIDANCE | COMPETING_RULES | PATTERN_MISMATCH]
User Intent:  [1 sentence: what the user was trying to achieve]
Skill Gap:    [1–2 sentences: what change to the SKILL.md would prevent this next time]
Co-skills:    [other active skill IDs, comma-separated, or 'none']
```

### Root Cause Guide

| Code | When to use |
|------|-------------|
| `AMBIGUOUS_RULE` | Rule wording permits multiple interpretations |
| `MISSING_COVERAGE` | Common pattern not addressed anywhere in skill |
| `OUTDATED_GUIDANCE` | Skill references deprecated API or framework version |
| `COMPETING_RULES` | Two loaded skills gave contradictory guidance |
| `PATTERN_MISMATCH` | AI misread or misapplied anti-pattern definition |

Then apply fix immediately — not wait for user confirmation.

## Pre-Completion Check

Before `notify_user` or task completion:

** I write code?** YES → ** I audit skills?** NO → Audit now

## Anti-Patterns

- **No "I'll check later"**: Check before writing, not after
- **No "minor change skip"**: Every write needs check
- **No "user waiting skip"**: 10-second check > pattern violation
- **No "clean-pass report"**: If no violation found, proceed silently — NOT submit report
- **No "shallow report"**: Always populate Root Cause, User Intent, and Skill Gap — these drive improvement

---

### common-git-collaboration

---
name: common-git-collaboration
description: Enforce version control best practices for commits, branching, pull requests, and repository security. Use when writing commits, creating branches, merging, or opening pull requests.
metadata:
  triggers:
    keywords:
    - commit
    - branch
    - merge
    - pull-request
    - git
---
# Git & Collaboration

## **Priority: P0 (OPERATIONAL)**

## 1. Write Conventional Commits

- Format: `<type>(<scope>): <description>` (e.g., `feat(auth): add login validation`).
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
- Use imperative mood: "add feature" not "added feature".
- One commit = one logical change — no mega-commits.

See [implementation examples](references/implementation.md) for conventional commit examples.

## 2. Manage Branches

- Name with prefixes: `feat/`, `fix/`, `hotfix/`, `refactor/`, `docs/`.
- Create new branch for every task to keep main stable and deployable.
- Never push directly to `main` or `develop` — use Pull Requests.
- Pull before you push to resolve conflicts locally.
- Prefer `git rebase` over merge for linear history on feature branches.
- Use `git rebase -i` to squash messy commits before pushing.

## 3. Submit Quality Pull Requests

- Limit to < 300 lines of code for effective review.
- State what changed, why, and how to test. Link issues (`Closes #123`).
- Self-review for obvious errors before requesting peers.
- PRs must pass all CI checks (lint, test, build) before merging.

## 4. Protect Secrets and Metadata

- Never commit `.env`, keys, or certificates — use `.gitignore` strictly.
- Use `husky` or `lefthook` for local Git Hooks enforcement.
- Tag releases with SemVer (`vX.Y.Z`) and update `CHANGELOG.md`.

## Anti-Patterns

- **No direct push to main**: All changes via PR, no exceptions.
- **No mega-commits**: One commit = one logical change. Split large ones.
- **No secrets in history**: Use `git filter-repo` to purge; rotate secret.

## References

- [Clean Linear History & Rebase Examples](references/CLEAN_HISTORY.md)

---

### common-learning-log

---
name: common-learning-log
description: "Append a structured learning entry to AGENTS_LEARNING.md whenever an AI agent makes a mistake. Auto-activates as a composite skill when: a pre-write skill violation is detected and auto-fixed, or when the session retrospective finds a correction loop. Also triggers directly when the user corrects the AI mid-session. Use when: mistake, wrong, redo, that's not right, correction, my bad, fix that error, I made a mistake, agent error, learning log, log mistake, AGENTS_LEARNING.md"
metadata:
  triggers:
    files:
      - 'AGENTS_LEARNING.md'
    keywords:
      - mistake
      - wrong
      - redo
      - correction
      - agent error
      - learning log
---

# Agent Learning Log

## **Priority: P1 (OPERATIONAL)**

Write structured mistake entry to `AGENTS_LEARNING.md` in project root before retrying any corrected action.

## Protocol

1. **Detect signal** — identify which surface triggered this skill:

- `Pre-write violation` — `common-feedback-reporter` violation block emitted with `Auto-fixed: YES`
- `User correction` — user used correction language mid-session
- `Session retrospective` — correction loop found during `common-session-retrospective`

2. **Read `AGENTS_LEARNING.md`** — count existing `## Agent Learning Log: Iteration` headers → N
3. **Append entry** — write Iteration #(N+1) using format in [Log Entry Format](references/log-format.md)
4. **Continue** — proceed with corrected action (non-blocking)

## Guidelines

- **One entry per correction event** — not one per file or per task
- **Concrete mistakes only** — name specific file, rule, or action that wrong
- ** "Better Approach" must actionable** — state what to , not what to avoid
- **Create file if missing** — bootstrap with header from [Log Entry Format](references/log-format.md)
- **Never skip for "minor" corrections** — all corrections learning signals

## Anti-Patterns

- **No vague mistakes**: `"I made a mistake"` → name specific pattern or rule violated
- **No skipping log**: Even if already in hurry to fix, append entry first (it takes <10 seconds)
- **No duplicate entries**: One correction event = one entry, even if multiple files affected
- **No overwriting**: Always append to bottom; never edit past entries

## References

- [Log Entry Format](references/log-format.md) — full entry template + AGENTS_LEARNING.md bootstrap


---

### common-llm-security

---
name: common-llm-security
description: OWASP LLM Top 10 (2025) audit checklist for AI applications, agent tools, RAG pipelines, and prompt construction. Use when performing any security review touching LLM client code, prompt templates, agent tools, or vector stores.
metadata:
  triggers:
    keywords:
    - LLM security
    - prompt injection
    - agent security
    - RAG security
    - AI security
    - openai
    - anthropic
    - langchain
    - LLM review
---
# OWASP LLM Top 10 Security Checklist (2025)

## **Priority: P0 (CRITICAL)**

## Implementation Guidelines

- **Check LLM01 first**: Prompt injection #1 LLM finding — any user input concatenated directly into prompt string immediate P0.
- **Check LLM06 next**: Agent tools with write/delete/execute capabilities without confirmation P0.
- **Mark each item**: ✅ not affected | ⚠️ needs review | 🔴 confirmed finding.
- **P0 finding caps Security score at 40/100** — not skip any item.
- See [references/owasp-llm.md](references/owasp-llm.md) for full detection signals.

## OWASP LLM Top 10 (2025)

| ID | Risk | Key Detection Signal |
| ----- | ---- | -------------------- |
| LLM01 | Prompt Injection | User input string-concatenated into prompt. Retrieved docs inserted into system turn. |
| LLM02 | Sensitive Information Disclosure | PII or credentials passed into prompt context. LLM response logged without redaction. |
| LLM03 | Supply Chain | Unverified model weights or plugins. Third-party agent added without trust review. |
| LLM04 | Data & Model Poisoning | User-controlled data written to training sets or embedding stores without validation. |
| LLM05 | Improper Output Handling | LLM output used directly in DOM sink, SQL query, shell command, or redirect URL. |
| LLM06 | Excessive Agency | Agent tool with write/delete/network access — no human-in--loop confirmation. |
| LLM07 | System Prompt Leakage | System prompt content returned via tool output, error message, or API response. |
| LLM08 | Vector & Embedding Weaknesses | User text injected into vector store without sanitization. No tenant namespace isolation. |
| LLM09 | Misinformation | LLM output used for critical decisions (medical, financial, legal) without verification. |
| LLM10 | Unbounded Consumption | No `max_tokens` on LLM call. No rate limit on invocations. Agent loop without depth cap. |

## Anti-Patterns

- **No prompt concat**: Pass user input as separate `user` turn, never interpolated into system prompts.
- **No raw LLM output in sinks**: Sanitize LLM responses before writing to DOM, queries, or shell.
- **No uncapped agent loops**: Every agentic recursion must enforce max iteration/depth limit.

## References

- [OWASP LLM — Full Detection Signals](references/owasp-llm.md) — load when auditing any LLM client code

---

### common-mobile-animation

---
name: common-mobile-animation
description: Apply motion design principles for mobile apps covering timing curves, transitions, gestures, and performance-conscious animations. Use when implementing screen transitions, gesture-driven interactions, shared-element animations, or optimizing animation frame rates on iOS, Android, or Flutter.
metadata:
  triggers:
    files:
    - '**/*_page.dart'
    - '**/*_screen.dart'
    - '**/*.swift'
    - '**/*Activity.kt'
    - '**/*Screen.tsx'
    keywords:
    - Animation
    - AnimationController
    - Animated
    - MotionLayout
    - transition
    - gesture
---
# Mobile Animation

## **Priority: P1 (OPERATIONAL)**


## Timing Standards

| Duration | Range | Use Case |
|----------|-------|----------|
| Short | 100-150ms | Toggles, cell press |
| Medium | 250-350ms | Navigation, modals |
| Long | 400-600ms | Shared element, complex state |

**Hard limit**: Never exceed 600ms for any animation.

## Workflow

1. **Choose duration** from timing table based on interaction type.
2. **Select easing curve** per platform — `Curves.fastOutSlowIn` (Material) or `easeInOut` (iOS). Never use `linear`.
3. **Animate GPU-friendly properties** (`transform`, `opacity`). Avoid `width`/`height` which trigger layout.
4. **Wire gestures** using `onPan` / `interactivePopGesture` for fluid, interruptible UX.
5. **Verify frame rate** in profiler — target 60fps with no jank frames.

See [implementation examples](references/implementation.md) for Flutter and iOS animation patterns.

## References

- [Animation Patterns](references/animation-patterns.md)

## Anti-Patterns

- **No linear easing**: Feels robotic; always use platform-standard curves.
- **No layout thrashing**: Avoid animating properties that trigger layout (width, padding).
- **No memory leaks**: Always `dispose()` AnimationControllers in Flutter; invalidate timers in iOS.
- **No blocking UI**: Run heavy calculations outside animation frames.

## Related Topics

- [common-mobile-ux-core](../common-mobile-ux-core/SKILL.md)
- [flutter-performance](../../flutter/flutter-performance/SKILL.md)
- [common-performance-engineering](../common-performance-engineering/SKILL.md)

---

### common-mobile-ux-core

---
name: common-mobile-ux-core
description: Enforce universal mobile UX principles for touch-first interfaces including touch targets, safe areas, and mobile-specific interaction patterns. Use when building mobile screens, handling touch interactions, or validating safe area compliance.
metadata:
  triggers:
    files:
    - '**/*_page.dart'
    - '**/*_screen.dart'
    - '**/*_view.dart'
    - '**/*.swift'
    - '**/*Activity.kt'
    - '**/*Screen.tsx'
    keywords:
    - mobile
    - responsive
    - SafeArea
    - touch
    - gesture
    - viewport
---
# Mobile UX Core

## **Priority: P0 (CRITICAL)**


## Guidelines

- **Touch Targets**: Min 44x44pt (iOS) / 48x48dp (Android). Add padding if needed.
- **Safe Areas**: Wrap content in `SafeArea`/`WindowInsets`. Avoid notches.
- **Interactions**: Use active states (no hover). Haptic feedback (short).
- **Typography**: Min 16sp body. Line height 1.5x.
- **Keyboards**: Auto-scroll inputs. Set `InputType` (email/number) & `Action`.

## Code Examples

- **Correct**: `IconButton(icon: Icon(Icons.close), padding: EdgeInsets.all(12))`
- **Avoid**: `Icon(Icons.close, size: 16)` (Touch target too small)

## Anti-Patterns

- **No Hover Effects**: Mobile no cursor; use pressed/active states instead
- **No Tiny Targets**: All clickable elements must ≥44pt
- **No Fixed Bottoms**: Always account for Home Indicator and Keyboard safe areas
- **No OS Mixing**: Respect Material (Android) and Cupertino (iOS) conventions separately

## Related Topics

mobile-accessibility | mobile-performance | flutter-design-system | react-native-dls

---

### common-mobile-visual-testing

---
name: common-mobile-visual-testing
description: Standardizes mobile UI audits, RTL verification, and state-specific testing on iOS/Android.
metadata:
  triggers:
    keywords:
    - visual test
    - mobile test
    - verify ui
    - dark mode test
    - accessibility audit
    - behavioral test
    - visual regression
    - localization test
---

# 🕵️‍♂️ Mobile Visual & Behavioral Testing

## **Priority: P1 (HIGH)**

> [!IMPORTANT]
> **Tier 2 (Methodology)**: Strategy mobile UI/UX audit.
> **Tier 3 (Domain)**: i18n, A11y (Dynamic Type), Platform (Notch/RTL).

## 🧪 Testing Mindset

Analyze diff + answer:
1.  **Change?** (Affected screen, logic path)
2.  **Break?** (Regression, state transition)
3.  **Visual Audit**: Truncate, align, z-order, color.
4.  **Behavioral Audit**: Tap target, nav, data accuracy.

## 📋 Scenario Matrix

| Change Type | Scenarios to Run |
| :--- | :--- |
| **UI/Styling** | Visual Audit + Dark Mode + QoS Check (CPU/Mem) |
| **Navigation** | User Flow + Deep Link + Z-Order |
| **Lists/Grids** | Scroll Test + Pagination + Empty State |
| **i18n/Locale** | RTL + Truncate + Locale Logic |
| **Accessibility** | Dynamic Type + High Contrast + Permission Reason |

## 🛠️ Core Tool Mapping

| Scenario | Appium Tool |
| :--- | :--- |
| **System Alert** | `appium_alert` (check hierarchy first) |
| **Performance** | `appium_mobile_performance_data` (monitor during flow) |
| **Visual Check** | `appium_screenshot` (base/diff) |
| **Layout Audit** | `appium_get_source` (hierarchy/aria) |

## 🚫 Anti-Patterns

- **Ignore QoS**: Apps crash/lag under load. **MUST** check `appium_mobile_performance_data` (scroll/video).
- **Blind Tap**: Check state before interact. Use `appium_screenshot`.
- **Alert Paralysis**: Unexpected alert? Use `appium_alert` → `accept`/`dismiss`.
- **Happy-Path Bias**: Never ignore Empty, Loading, or Error state.
- **Deep Link Neglect**: Verify "Cold Start" via deep link.
- **Single-Device Tunnel Vision**: Verify smallest/largest screen size.

## 🔗 References

- **appium-mcp**: [appium-mcp](../../quality-engineering/quality-engineering-appium-mcp/SKILL.md)
- **Scenario Details**: [scenarios](references/scenarios.md)


---

### common-observability

---
name: common-observability
description: Enforce structured JSON logging, OpenTelemetry distributed tracing, and RED metrics across backend services. Use when adding request correlation, setting up tracing spans, defining SLO burn-rate alerts, or instrumenting middleware.
metadata:
  triggers:
    files:
    - '**/*.service.ts'
    - '**/*.handler.ts'
    - '**/*.middleware.ts'
    - '**/*.interceptor.ts'
    - '**/*.go'
    - '**/*.java'
    - '**/*.kt'
    - '**/*.py'
    keywords:
    - logging
    - tracing
    - metrics
    - opentelemetry
    - observability
    - slo
---
# Common Observability Standards

## **Priority: P1 (OPERATIONAL)**

## Logging & Tracing

- **JSON Logs**: Always emit JSON structured logs. Never plain-text in prod.
- **Correlation**: Extract `X-Request-Id` or `traceparent`. Attach to async context.
- **Tracing**: Use OpenTelemetry. Propagate W3C `traceparent`.
- **Spans**: Name spans like `<HTTP_METHOD> <route>` (`GET /users/:id`).

See [implementation examples](references/implementation.md) for structured logger setup with Pino.

## Metrics

- **Required**: Request rate, Error rate, Latency histogram (p50/p95/p99), Saturation.
- **SLOs**: Alert on SLO burn rates, not raw threshold spikes.

## Anti-Patterns

- **Console.log**: not use in prod; use structured logger (`pino`, `zap`).
- **PII in Logs**: Never log tokens, passwords, or full request bodies.
- **Dynamic Span Names**: `GET /users/123` causes cardinality explosion. Use `GET /users/:id`.
- **Missing Cleanup**: Always end tracing spans.

## References
- [Observability Data Formats](references/observability-formats.md)

---

### common-owasp

---
name: common-owasp
description: OWASP Top 10 audit checklist for Web Applications (2021) and APIs (2023). Use when performing any security review, PR review, or codebase audit touching web, mobile backend, or API code.
metadata:
  triggers:
    keywords:
    - security review
    - OWASP
    - broken access control
    - IDOR
    - BOLA
    - injection
    - broken auth
    - API review
    - authorization
    - access control
---
# OWASP Top 10 Security Checklist

## **Priority: P0 (CRITICAL)**

## Always-Apply Rules

Apply these on **every code write**, not during dedicated security reviews:

- **No IDOR**: Filter every resource query by `owner_id` or `tenantId` alongside any user-supplied ID. `findById(params.id)` without owner filter immediate P0.
- **No wildcard CORS**: Restrict to explicit allowlisted origins — never `Access-Control-Allow-Origin: *` on authenticated routes.
- **No full entity return**: Always project to DTO — never serialize raw ORM output to API response.

## Context-Specific Checklist

Activate when: writing security-sensitive features, reviewing PRs, or doing codebase audits.

Mark each item: ✅ not affected | ⚠️ needs review | 🔴 confirmed finding.

**P0 finding caps Security score at 40/100.**

Apply framework-specific security skills alongside this checklist.
See [references/owasp-web.md](references/owasp-web.md) and [references/owasp-api.md](references/owasp-api.md) for full detection signals.

### OWASP Web Application Top 10 (2021)

| ID | Risk | Key Detection Signal |
| --- | ---- | -------------------- |
| A01 | Broken Access Control | `findById(params.id)` without owner filter. Route without `@authorize`. |
| A02 | Cryptographic Failures | Weak hash (MD5/SHA1) for passwords. HTTP URL hardcoded. No TLS. |
| A03 | Injection | String concat in DB queries. Unsanitized input to templates. XSS. |
| A04 | Insecure Design | No rate limiting on auth. Missing input validation at entry points. |
| A05 | Security Misconfiguration | CORS `*`. Debug mode in prod. Missing security headers (CSP, HSTS). |
| A06 | Vulnerable Components | CVE in dependency audit. Unreviewed new direct dependency. |
| A07 | Auth Failures | JWT without expiry. No session invalidation on logout. |
| A08 | Data Integrity Failures | Unverified JWT/cookie. Deserialization of untrusted input. |
| A09 | Logging & Monitoring | No audit log on: deletion, password change, privilege escalation. |
| A10 | SSRF | HTTP client with user-controlled URL and no allowlist. |

### OWASP API Security Top 10 (2023)

| ID | Risk | Key Detection Signal |
| ----- | ---- | -------------------- |
| API1 | Broken Object Level Auth (BOLA) | Resource by user-supplied ID without `AND owner_id = currentUser`. |
| API2 | Broken Authentication | JWT missing `exp`. Token not revoked on logout. Bearer in URL. |
| API3 | Broken Property Level Auth | Full ORM entity returned. No DTO projection. Mass assignment. |
| API4 | Unrestricted Resource Consumption | No server-enforced `limit`/`pageSize`. No throttle on heavy ops. |
| API5 | Broken Function Level Auth | Admin route reachable without role guard. |
| API6 | Unrestricted Business Flow | No verification on OTP/checkout/password-reset flows. |
| API8 | Security Misconfiguration | Stack trace in response. CORS `*` on authenticated routes. |
| API9 | Improper Inventory Management | Deprecated/undocumented endpoints still reachable. |
| API10 | Unsafe API Consumption | Third-party response used without schema validation. |

## References

- [OWASP Web App — Full Detection Signals](references/owasp-web.md)
- [OWASP API — Full Detection Signals](references/owasp-api.md)

---

### common-performance-engineering

---
name: common-performance-engineering
description: Enforce universal standards for high-performance development. Use when profiling bottlenecks, reducing latency, fixing memory leaks, improving throughput, or optimizing algorithm complexity in any language.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.tsx'
    - '**/*.go'
    - '**/*.dart'
    - '**/*.java'
    - '**/*.kt'
    - '**/*.swift'
    - '**/*.py'
    keywords:
    - performance
    - optimize
    - profile
    - scalability
    - latency
    - throughput
    - memory leak
    - bottleneck
---
# Performance Engineering Standards

## **Priority: P0 (CRITICAL)**

## Workflow

1. **Baseline**: Profile before changing anything — measure CPU, memory, and latency.
2. **Identify**: Find top bottleneck (N+1 query, hot loop, memory leak).
3. **Fix**: Apply targeted optimization from sections below.
4. **Verify**: Re-profile to confirm improvement and check for regressions.

## Resource Management

- **Memory Efficiency**:
 - Avoid memory leaks: explicit cleanup of listeners, observers, and streams.
 - Optimize data structures: `Set` for lookups, `List` for iteration.
 - Lazy Initialization: Initialize expensive objects only when needed.
- **CPU Optimization**:
 - Aim for O(1) or O(n); avoid O(n^2) in critical paths.
 - Offload heavy computations to background threads or workers.
 - Memoize pure, expensive functions.

See [implementation examples](references/implementation.md) for memoization and batching patterns.

## Network & I/O

- **Payload Reduction**: Use efficient serialization (Protobuf, JSON minification) and compression (gzip/br).
- **Batching**: Group multiple small requests into single bulk operations.
- **Caching**: Implement multi-level caching (Memory -> Storage -> Network) with appropriate TTL and invalidation.
- **Non-blocking I/O**: Always use asynchronous operations for file system and network access.

## UI/UX Performance

- **Minimize Main Thread Work**: Keep animations and interactions fluid by offloading to workers.
- **Virtualization**: Use lazy loading or virtualization for long lists/large datasets.
- **Tree Shaking**: Ensure build tools remove unused code and dependencies.

## Monitoring & Testing

- **Benchmarking**: Write micro-benchmarks for performance-critical functions.
- **SLIs/SLOs**: Define Service Level Indicators (latency, throughput) and Objectives.
- **Load Testing**: Test system behavior under peak and stress conditions.

## Anti-Patterns

- **No premature optimization**: Profile first, fix proven bottlenecks only.
- **No N+1 queries**: Always batch and paginate data-access operations.
- **No synchronous I/O on main thread**: Async all file/network access.

## References

- [Implementation Patterns](references/implementation.md) — profiling patterns, benchmark setup

---

### common-product-requirements

---
name: common-product-requirements
description: Expert process for gathering requirements and drafting PRDs (Iterative Discovery). Use when creating a PRD, speccing a new feature, or clarifying requirements.
metadata:
  triggers:
    files:
    - 'PRD.md'
    - 'specs/*.md'
    keywords:
    - create prd
    - draft requirements
    - new feature spec
---
# Product Requirements Expert

## **Priority: P0 (CRITICAL)**

**Role**: Technical Product Manager. Gather ALL requirements BEFORE writing.

## 1. Discovery Phase (Iterative)

- **Context Injection**: Ask: "What high-level goal?"
- **Gap Analysis**: Identify missing info (Platform? Users? Constraints?).
- **Active Inquiry**:
- Ask 3-5 clarification questions at a time.
- **MUST** provide (a, b, c) options to reduce user friction.
- _Example_: "Target platform? a) Web b) Mobile c) Both"
- **Repeat**: Continue until `Actionable State` reached.

## 2. Drafting Phase (System of Record)

- **Filesystem**: Ensure `docs/specs/` exists.
- **Load Template**: Read `references/prd-template.md`.
- **Fill & Fix**: Map Discovery answers to template. Mark unknowns as `TBD`.
- **Output**: Write to `docs/specs/prd-[feature-name].md`.

## 3. Verification Checklist (Mandatory)

- [ ] **Functional**: all user flows defined?
- [ ] **Non-Functional**: Performance? Security? Offline mode?
- [ ] **Tech Constraints**: DB schema impacts? API changes?
- [ ] **Edge Cases**: Zero state? Error state?

## Anti-Patterns

- **No Assumptions**: Never guess business logic. Ask.
- **No Vagueness**: "Fast" -> "Load < 200ms".
- **No Implementation**: PRD = "What", Implementation Plan = "How".

## References

- [Full PRD Template](references/prd-template.md)
- [Validation Checklist](references/checklist.md)


---

### common-protocol-enforcement

---
name: common-protocol-enforcement
description: Enforce Red-Team verification and adversarial protocol audit. Use when verifying tasks, performing self-scans, or checking for protocol violations. Load as composite for all sessions.
metadata:
  triggers:
    keywords:
    - verify done
    - protocol check
    - self-scan
    - pre-write audit
    - task complete
    - audit violations
    - retrospective
    - scan
    - red-team
---
# Protocol Enforcement (Red-Team Verification)

## **Priority: P0 (CRITICAL)**


## Red-Team Verification Protocol

Before declaring any task "done" or calling `notify_user`:

1. **Adversarial Audit**: Search for code patterns that look like "Standard Defaults" (e.g., hardcoded values, generic library calls) where Project Skill exists.
2. **Protocol Check**: Ensure "Pre-Write Audit Log" present for EVERY write tool call.
3. **Execution Bias Check**: Ask: " I skip structural constraint to make code run faster/pass test?"

## ** Post-Write Self-Scan**

Immediately after tool call:

- **Scan**: Read diff or file content.
- **Match**: Check against `Anti-Patterns` in all active skills.
- **Fix**: Re-edit immediately if violation detected.

## Anti-Patterns

- **No "Done" Bias**: Functional success != Protocol success.
- **No Reliance on Memory**: Always retrieval-led (Skill view_file) before write.
- **No Skipping Protocols**: "Small changes" where most violations happen.

## Execution Bias Detection

Look for:

- Local mocks instead of shared fakes.
- Hardcoded styles instead of design tokens.
- Try-catch blocks without standard error handling.
- Missing `Pre-Write Audit Log` in thoughts.

## References

---

### common-security-audit

---
name: common-security-audit
description: Probe for hardcoded secrets, injection surfaces, unguarded routes, and infrastructure weaknesses across Node, Go, Dart, Java, Python, and Rust codebases. Use when performing security audits, vulnerability scans, secrets detection, or penetration testing.
metadata:
  triggers:
    files:
    - 'package.json'
    - 'go.mod'
    - 'pubspec.yaml'
    - 'pom.xml'
    keywords:
    - Dockerfile
    - security audit
    - vulnerability scan
    - secrets detection
    - injection probe
    - pentest
---
# Security Audit

## **Priority: P0 (CRITICAL)**

## 1. Scan for Hardcoded Secrets

See [implementation examples](references/implementation.md) for secrets scanning commands.

## 2. Detect Data Leakage in Logs

Identify sensitive info printed to logs or stdout.

- **Node/TS**: `grep -rE "console\.(log|error|warn)" . --include="*.ts" --include="*.js" | grep -iE "password|token|secret"`
- **Go**: `grep -rE "log\.(Print|Printf|Println|Fatal)" . --include="*.go" | grep -iE "password|token|secret"`
- **Dart/Flutter**: `grep -rE "print\(|debugPrint\(" . --include="*.dart" | grep -iE "password|token|secret"`
- **Java/Spring**: `grep -rE "log(ger)?\.(info|debug|warn|error)" . --include="*.java" | grep -iE "password|token|secret"`

## 3. Map Injection Surfaces

Detect raw string concatenation in queries or system commands.

See [implementation examples](references/implementation.md) for injection surface detection.

## 4. Measure Auth Coverage vs Exposure

Compare total routes against protected endpoints.

- **NestJS**: `total=$(grep -r "@(Get|Post|Put|Delete|Patch)" . | wc -l); guarded=$(grep -r "@(UseGuards|Auth)" . | wc -l)`
- **Spring**: `total=$(grep -r "@(GetMapping|PostMapping|PutMapping)" . | wc -l); guarded=$(grep -r "@(PreAuthorize|Secured)" . | wc -l)`
- **Go**: `total=$(grep -rE "(GET|POST|PUT|DELETE)" . | wc -l); guarded=$(grep -rE "(middleware|auth|jwt|guard)" . | wc -l)`

## 5. Run Dependency CVE Scans

- **Node**: `npm audit --audit-level=high`
- **Dart/Flutter**: `dart pub outdated --json`
- **Go**: `go list -m -u all | grep "\["`
- **Java**: `mvn dependency:list` or `./gradlew dependencies`
- **Python**: `pip-audit`
- **Rust**: `cargo audit`

## 6. Audit Infrastructure Hardening

See [implementation examples](references/implementation.md) for infrastructure hardening checks.

## 7. Detect Adversarial Entry Points (RCE/SSRF/Path Traversal)

Identify where user input reaches dangerous sinks without sanitization.

- **Path Traversal**: `grep -rE "path\.join\(|os\.path\.join\(" . | grep -vE "path\.resolve|path\.normalize"`
- **SSRF**: `grep -rE "axios\.get\(|http\.Get\(|fetch\(" . | grep -vE "['\"]https?://" `
- **BOLA/IDOR**: `grep -rE "findById\(|findOne\(" . | grep -viE "tenant|owner|user_id"`

## Scoring Impact

| Finding | Threshold | Severity | Deduction |
| ------------------------ | --------- | -------- | --------- |
| Hardcoded Secrets | Any match | P0 | -25 |
| Plain-text PII in Logs | Any match | P0 | -20 |
| Unguarded Routes > 20% | > 0.2 | P0 | -15 |
| Raw SQL Concatenation | Any match | P1 | -10 |
| Response Leakage (Stack) | > 0 | P1 | -10 |

> **CAUTION**: P0 finding immediately caps Security score at 40/100.

## Anti-Patterns

- **No applying generic patterns over project-specific rules**: Respect existing security constraints.
- **No ignoring error handling or edge cases**: Audit must cover boundary conditions.

## References

- [Vulnerability Remediation Protocols](references/REMEDIATION.md)

---

### common-security-standards

---
name: common-security-standards
description: Enforce universal security protocols for safe, resilient software. Use when implementing authentication, encryption, authorization, input validation, secret management, or any security-sensitive feature across any language or framework.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - '**/*.tsx'
    - '**/*.go'
    - '**/*.dart'
    - '**/*.java'
    - '**/*.kt'
    - '**/*.swift'
    - '**/*.py'
    keywords:
    - security
    - encrypt
    - authenticate
    - authorize
---
# Security Standards

## **Priority: P0 (CRITICAL)**

## Always-Apply Rules

Apply these on **every code write**, regardless of context:

- **No hardcoded secrets**: Use environment variables or secret managers. Never commit keys, passwords, or tokens to source control.
- **No raw SQL strings**: Use parameterized queries or ORMs — `WHERE id = ${userId}` always wrong.
- **No stacktraces in prod**: Return generic error codes; log full detail server-side only.

## Workflow

Activate when: implementing auth, encryption, authorization, input handling, or any security-sensitive feature.

1. **Identify trust boundaries** — map every data entry point (API, UI, CSV, webhook).
2. **Validate and sanitize** all external input at each boundary.
3. **Apply least privilege** to users, services, and containers.
4. **Verify** with SAST/DAST scanners in CI before merge.

## Context-Specific Rules

### Data Safeguarding

- **Zero Trust**: Never trust external input. Sanitize and validate every data boundary.
- **Least Privilege**: Grant minimum necessary permissions to users, services, and containers.
- **Encryption**: AES-256 for data-at-rest; TLS 1.3 for data-in-transit.
- **PII Logging**: Never log PII (email, phone, names). Mask sensitive fields before logging.

See [implementation examples](references/implementation.md) for parameterized queries and secret management.

### Secure Coding

- **Injection Prevention**: Use parameterized queries or ORMs to stop SQL, Command, and XSS injections.
- **Dependency Management**: Regularly scan (`npm audit`, `pip audit`) and update third-party libraries to patch CVEs.
- **Secure Auth**: Implement Multi-Factor Authentication (MFA) and secure session management.
- **Error Privacy**: Never leak stack traces or internal implementation details to end-user.

### Continuous Security

- **Shift Left**: Integrate security scanners (SAST/DAST) early in CI/CD pipeline.
- **Data Minimization**: Collect and store only minimum data required for business logic.
- **Audit Logging**: Maintain logs for sensitive operations (Auth, Deletion, Admin changes).

## Anti-Patterns

- **No default passwords**: Force rotation on first use with strong entropy requirements.

## References

- [Injection Testing Protocols (SQLi/HTMLi)](references/INJECTION_TESTING.md)
- [Vulnerability Remediation & Secure Patterns](references/VULNERABILITY_REMEDIATION.md)

---

### common-session-retrospective

---
name: common-session-retrospective
description: Analyze conversation corrections to detect skill gaps and auto-improve the skills library. Use after any session with user corrections, rework, or retrospective requests. After finding correction loops, also load +common/common-learning-log to persist mistake entries to AGENTS_LEARNING.md.
metadata:
  triggers:
    files:
    - '**/*.spec.ts'
    - '**/*.test.ts'
    - 'SKILL.md'
    - 'AGENTS.md'
    - '+common/common-learning-log'
    keywords:
    - retrospective
    - self-learning
    - improve skills
    - session review
    - correction
    - rework
---
# Session Retrospective

## **Priority: P1 (OPERATIONAL)**

## Structure

```text
common/session-retrospective/
├── SKILL.md              # Protocol (this file)
└── references/
    └── methodology.md    # Signal tables, taxonomy, report template
```

## Protocol

1. **Extract** — Scan for correction signals (loops, rejections, shape mismatches, lint rework)
2. **Classify** — Root cause: Skill Missing | Incomplete | Example Contradicts Rule | Workflow Gap | **Trigger Miss**
3. **Trigger Miss Check** — For every task in session, ask: _" relevant skill available but not loaded?"_
 - If yes: record skill ID, indirect phrase used, and fix (add keyword alias to triggers)
4. **Propose** — One fix per root cause: update skill, update reference, new skill, or new workflow
5. **Implement** — Apply to all agent dirs. Keep SKILL.md concise; move large tables to `references/`. Update `AGENTS.md`
6. **Log to AGENTS_LEARNING.md** — For each correction loop found, append one entry using `common/common-learning-log` protocol (Signal: `Session retrospective`)
7. **Report** — Output correction count, skills changed, trigger misses found, estimated rounds saved

## Trigger Miss Output

Emit trigger miss block (schema in [references/methodology.md](references/methodology.md#trigger-miss-schema)) for each miss detected.

## Guidelines

- **Cite specifics**: Reference concrete conversation moment per proposal
- **Extend first**: Search `AGENTS.md` before creating — update existing skills
- **One fix per loop**: One correction → one targeted skill change
- **Sync all agents**: Apply to every agent skill dir listed in `.skillsrc` `agents` field
- **Follow skill-creator**: New skills comply with `common/skill-creator` standards

## Anti-Patterns

- **No Vague Proposals**: Cite exact gap + fix, not "make X better"
- **No Duplicate Skills**: Search AGENTS.md index first
- **No Oversized Patches**: Extract to `references/` per skill-creator standard

## References

Signal tables, root cause taxonomy, report template, real-world example:
[references/methodology.md](references/methodology.md)

---

### common-skill-creator

---
name: common-skill-creator
description: 'Standardizes the creation and evaluation of high-density Agent Skills (Claude, Cursor, Windsurf). Ensures skills achieve high Activation (specificity/completeness) and Implementation (conciseness/actionability) scores. Use when: writing or auditing SKILL.md, improving trigger accuracy, or refactoring skills to reduce redundancy and maximize token ROI.'
metadata:
  triggers:
    files:
    - 'SKILL.md'
    - 'evals/evals.json'
    keywords:
    - create skill
    - audit skill
    - trigger rate
    - optimize description
---
# Agent Skill Creator Standard

## **Priority: P0 — Apply to ALL skills**

Maximize **Token ROI**. Every line in SKILL.md must provide specific procedural value. **Activation** (how it triggers) and **Implementation** (how it helps) primary quality metrics.

## Three-Level Loading System

- **Level 1** Frontmatter: `name` + `description` (Activation Anchor), ≤100 words.
- **Level 2** SKILL.md body: Core Rules + Workflows (Implementation Core), ≤100 lines.
- **Level 3** references/: Detailed examples, schemas, and "TESTS.md" (On-demand).

## Workflow (New or Existing Skill)

**New skill:**

1. **Research** — web-search domain best practices, checklists, and standards; extract key terms → triggers, workflows → guidelines, mistakes → anti-patterns. See [Web Search Research](references/web-search-research.md).
2. **Capture intent** — what it , when it trigger, expected output format?
3. **Write SKILL.md** — draft using [TEMPLATE.md](references/TEMPLATE.md)
4. **Test** — spawn parallel subagents: one with-skill, one without-skill (baseline)
5. **Evaluate** — grade assertions, review benchmark (pass rate, tokens, time)
6. **Iterate** — rewrite based on feedback, rerun into next iteration dir, repeat
7. **Optimize description** — run trigger eval queries, target ≥80% accuracy

**Existing skill:**

1. **Audit** — run Quality Checklist below; identify violations
2. **Snapshot** — `cp -r <skill-dir> <workspace>/skill-snapshot/` before any edits
3. **Improve SKILL.md** — fix violations, compress, move oversized content to `references/`
4. **Test** — spawn parallel subagents: one with-new-skill, one with-snapshot (baseline)
5. **Evaluate & iterate** — same as steps 4–5 above
6. **Optimize description** — re-run trigger eval if description changed

See [Eval Workflow](references/eval-workflow.md) for full testing + iteration details.

## Description Quality (Activation)

- **Third-Person Voice**: Use `Standardizes...`, `Audits...`, `Encrypts...`. Avoid "I will" or "This skill helps to".
- **What + When Structure**:
 - **What**: Define 5–8 specific capabilities (e.g., "Generates JWT tokens, rotates keys").
 - **When**: Explicitly define triggers (e.g., "Use when user says 'rotate keys'").
- **Specificity**: Avoid vague verbs like "manage" or "handle". Use "Validate", "Inject", "Refactor", "Sanitize".
- **Trigger Hint**: Include `(triggers: *.ext, keyword)` suffix for technical skills.

## Content Quality (Implementation)

- **No Redundant Knowledge**: **NOT** explain concepts AI already knows (e.g., HTTP status codes, standard library docs, basic SOLID principles). Focus strictly on _project-specific_ rules.
- **Caveman Compression**: Use "Caveman Mode" for rules to save tokens. Drop articles (, , ), remove filler words ("should", "will", "), and use telegraphic snippets.
 - _Standard_: "You should ensure that database connection closed after every query to prevent leaks." (15 tokens)
 - _Caveman_: "Close DB connection after query. Prevent leaks." (7 tokens)
- **Actionability**: Examples must copy-paste ready and executable.
- **Workflow Clarity**: Use sequential ordered lists for multi-step processes.
- **Progressive Disclosure**: Move code blocks >10 lines to `references/`.

## Anti-Patterns

- **No "AI-splaining"**: not explain why pattern good unless it's unique project constraint.
- **No Vague Triggers**: Never use `src/**` or `**/*`. surgical.
- **No Description Bloat**: If description exceeds 100 words, some capabilities belong in body.
- **No long code blocks**: >10 lines → extract to `references/`
- **No redundancy**: don't repeat frontmatter content in body

## Quality Checklist (Tessl-Aligned)

- [ ] **Activation ≥ 90%**: Description covers both capabilities ("What") and triggers ("When").
- [ ] **Implementation ≥ 90%**: No general-purpose explanations; all examples executable.
- [ ] **Structural Compliance**: SKILL.md ≤ 100 lines; code blocks moved to `references/`.
- [ ] Trigger rate ≥80% on should-trigger queries.

## References

- [Skill Template](references/TEMPLATE.md) — load when starting new skill from scratch
- [Anti-Patterns Detail](references/anti-patterns.md) — load when fixing or reviewing anti-pattern format
- [Size & Limits](references/size-limits.md) — load when SKILL.md approaches 100 lines
- [Resource Organization](references/resource-organization.md) — load when deciding where to place content (scripts/, references/, assets/)
- [Testing & Trigger Rate](references/testing.md) — load when writing evals or measuring trigger rate
- [Eval Workflow](references/eval-workflow.md) — load when running parallel subagent tests
- [Full Lifecycle](references/lifecycle.md) — load for complete phase-by-phase creation guide
- [Web Search Research](references/web-search-research.md) — load when creating skill for unfamiliar or non-engineering domain

---

### common-store-changelog

---
name: common-store-changelog
description: "Generate user-facing release notes for the Apple App Store and Google Play Store by collecting git history, triaging user-impacting changes, and drafting store-compliant changelogs. Enforces character limits (App Store ≤4000, Google Play ≤500), tone, and bullet format. Use when generating release notes, app store changelog, play store release, what's new, or version release notes for any mobile app."
metadata:
  triggers:
    keywords:
    - generate changelog
    - app store notes
    - play store release
    - what's new
    - release notes
    - version notes
    - store release
---
# Store Changelog Standard

## **Priority: P1**


## Always-Apply Rules

- **Character limits**: App Store ≤ 4000 chars. Google Play ≤ 500 chars — validate before output.
- **Benefit language**: Write what user gains, not what code changed. "Faster checkout" not "refactored cart service".
- **Bullet-only format**: One sentence per bullet. No paragraphs. No headers inside notes.
- **Drop internal commits**: Exclude `chore`, `refactor`, `ci`, `build`, `test`, dependency bumps, and config changes — no user impact.
- **Deduplicate**: Merge commits touching same feature into one bullet.

## Workflow

1. **Collect**: Run `git log <last-tag>..HEAD --oneline` (or use provided commit list). If no tag exists, use full history.
2. **Triage**: Scan commits and touched files. Group by theme: `New`, `Improved`, `Fixed`. Drop internal-only.
3. **Draft — App Store**: Write 5–10 benefit-focused bullets. Optional `What's New in [Version]` header.
4. **Draft — Google Play**: Compress App Store draft to ≤ 500 chars. Prioritise top 3–5 user-facing changes.
5. **Validate**: Count characters per store. Check every bullet maps to real commit. Remove jargon.

See [Commit-to-Bullet Examples](references/commit_examples.md) for mapping patterns.

## Output Format

**App Store** (≤ 4000 chars):

```
What's New in Version X.Y
• [New] <user benefit — one sentence>
• [Improved] <user benefit — one sentence>
• [Fixed] <user benefit — one sentence>
```

**Google Play** (≤ 500 chars):

```
• <highest-impact change>
• <second change>
• <third change>
[Bug fixes and performance improvements.]
```

## Anti-Patterns

- **No jargon**: Never use `refactor`, `migrated`, `deprecated`, `PR`, `hotfix`, or internal ticket IDs.
- **No chore bullets**: `chore: upgrade Gradle` → drop entirely, never paraphrase as user feature.
- **No bundled bullets**: "Fixed login and improved search and added dark mode" → three separate bullets.
- **No character overrun**: Validate Play Store notes ≤ 500 chars before returning — truncate + rewrite if needed.

## References

- [Commit-to-Bullet Examples](references/commit_examples.md) — load when mapping specific commits to bullets

---

### common-system-design

---
name: common-system-design
description: Enforce separation of concerns, dependency inversion, and resilience patterns across layered and distributed architectures. Use when designing new features, evaluating module boundaries, selecting architectural patterns, or resolving scalability bottlenecks.
metadata:
  triggers:
    keywords:
    - architecture
    - design
    - system
    - scalability
    - microservice
    - module boundary
    - coupling
---
# System Design & Architecture Standards

## **Priority: P0 (FOUNDATIONAL)**

## Workflow: Evaluate Architecture for New Feature

1. Identify bounded contexts and module boundaries
2. Define dependency direction (outer layers depend on inner)
3. Select communication pattern (sync REST, async event, or hybrid)
4. Validate against CAP trade-offs for distributed components
5. Document decision in Architecture Decision Record (ADR)

## Architectural Principles

- **SoC**: Divide into distinct sections per concern.
- **SSOT**: One source, reference elsewhere.
- **Fail Fast**: Fail visibly when errors occur.
- **Graceful Degradation**: Core functional even if secondary fails.

## Modularity & Coupling

- **High Cohesion**: Related functionality in one module.
- **Loose Coupling**: Use interfaces for communication.
- **DI**: Inject dependencies, don't hardcode.

See [implementation examples](references/implementation.md) for dependency flow diagrams.

## Common Patterns

- **Layered**: Presentation -> Logic -> Data.
- **Event-Driven**: Async communication between decoupled components.
- **Clean/Hexagonal**: Core logic independent of frameworks.
- **Statelessness**: Favor stateless for scaling/testing.

## Distributed Systems

- **CAP**: Trade-off Consistency/Availability/Partition tolerance. See [CAP & Consistency Patterns](references/distributed-systems.md).
- **Idempotency**: Operations repeatable without side effects. See [Idempotency Patterns](references/distributed-systems.md#idempotency).
- **Circuit Breaker**: Fail fast on failing services. See [Resilience Patterns](references/resilience-patterns.md).
- **Eventual Consistency**: Design for async data sync. See [CAP & Consistency Patterns](references/distributed-systems.md#eventual-consistency).

## Documentation & Evolution

- **Design Docs**: Write specs before major implementations.
- **Versioning**: Version APIs/schemas for backward compatibility.
- **Extensibility**: Use Strategy/Factory for future changes.

## References

- [Distributed Systems & CAP Theorem](references/distributed-systems.md)
- [Resilience Patterns (Circuit Breaker, Bulkhead, Retry)](references/resilience-patterns.md)

## Anti-Patterns

- **No god classes**: Single Responsibility — one reason to change per module.
- **No synchronous coupling**: Prefer events or queues for cross-service calls.
- **No premature abstraction**: Design for current load; scale when proven needed.

---

### common-tdd

---
name: common-tdd
description: 'Implements a strict Red-Green-Refactor loop to ensure zero production code is written without a prior failing test. Use when: creating new features, fixing bugs, or expanding test coverage.'
metadata:
  triggers:
    files:
    - '**/*.test.ts'
    - '**/*.spec.ts'
    - '**/*_test.go'
    - '**/*Test.java'
    - '**/*_test.dart'
    - '**/*_spec.rb'
    keywords:
    - tdd
    - unit test
    - write test
    - red green refactor
    - failing test
    - test coverage
---
# Test-Driven Development (TDD) Standard

## **Priority: P0 — Iron Law**

> **NO PRODUCTION CODE WITHOUT FAILING TEST FIRST.**
> Code written before test MUST deleted. Start over.

## **Step 1: RGR Loop (Red-Green-Refactor)**

1. **RED**: Write minimal failing test. **Verify failure** (Expected error, not typo).
2. **GREEN**: Write simplest code to pass. **Verify pass**.
3. **REFACTOR**: Clean up code while staying green.

## **AAA Structure (Mandatory)**

Every test must follow Arrange-Act-Assert:

- **Arrange**: Set up inputs, stubs, mocks, and expected values.
- **Act**: Call single unit under test.
- **Assert**: Verify output and side effects. One logical assertion per test.
 **(See [AAA Example](references/aaa_example.md) for code structure)**.

## **Step 3: Verification & Thresholds**

- **Minimum Coverage**: 80% (Stat/Func/Line), 75% (Branch).
- **Mocks**:
 - Always mock: HTTP, Time/Date, Filesystem.
 - Never mock: Fast internal services (<200ms), pure domain logic.
- See [Test Runner Reference](references/test_runners.md) for environment-specific commands.

## **Step 4: Principles & Mocks**

- **Watch it Fail**: Prove test works before writing code.
- **Minimalism**: Don't add features/options beyond current test (YAGNI).
- **Isolation**: Mock external APIs (HTTP) and Time.
- **Realism**: Prefer real DBs (test containers) and fast internal services (<200ms).

## **Verification Checklist**

- [ ] Every new function/method failing test first?
- [ ] Failure message expected?
- [ ] Minimal code implemented passed?
- [ ] AAA structure followed?
- [ ] Coverage thresholds met?

## **Expert References**

- [AAA Example](references/aaa_example.md)
- [AAA Methodology](references/aaa_methodology.md)
- [Test Runners](references/test_runners.md)
- [TDD Patterns](references/tdd_patterns.md)
- [Testing Anti-Patterns](references/testing_anti_patterns.md)

## Anti-Patterns

- **No test-after**: Writing tests post-implementation defeats TDD. Delete and restart.
- **No assertion-free tests**: test without assert not test.
- **No testing implementation**: Test behavior and contracts, not internal calls.

---

### common-ui-design

---
name: common-ui-design
description: Design distinctive, production-grade frontend UI with bold aesthetic choices. Use when building web components, pages, interfaces, dashboards, or applications in any framework (React, Next.js, Angular, Vue, HTML/CSS).
metadata:
  triggers:
    keywords:
    - build a page
    - create a component
    - design a dashboard
    - landing page
    - UI for
    - build a layout
    - make it look good
    - improve the design
    - build UI
    - create interface
    - design screen
---
# UI Design Direction

## **Priority: P0 (FOUNDATIONAL)**

Before writing any code, commit to deliberate aesthetic direction.

## Phase 0: Design Thinking (Mandatory Pre-Code)

Answer these before touching implementation:

1. **Purpose**: What problem this UI solve? Who uses it?
2. **Tone**: Pick one extreme and commit — brutally minimal | maximalist | retro-futuristic | editorial/magazine | luxury/refined | brutalist/raw | playful/toy-like | organic/natural | art deco | industrial/utilitarian
3. **Differentiation**: Name one thing user will remember about this interface.

Bold maximalism and refined minimalism both work — intentionality, not intensity, key.

## Aesthetic Dimensions

### Typography

- Pair distinctive **display font** + refined **body font**; never default to system fonts.
- Self-host via `next/font`, `@font-face`, or Google Fonts API — never CDN `<link>` in production.
- See [Font Pairing & Tone Examples](references/tones.md)

### Color & Theme

- Dominant color + sharp accent > timid, evenly-distributed palettes.
- Use CSS custom properties (`--color-primary`, `--color-accent`) for consistency.
- Commit: dark or light — don't default to light because it feels "safe".

### Motion

- One well-orchestrated entrance (staggered reveals, `animation-delay`) > scattered micro-interactions.
- CSS-first: `@keyframes`, `transition`, `animation-delay`; React: Motion library for complex sequences.
- See [Motion Patterns](references/motion.md)

### Spatial Composition

- Break grid intentionally: asymmetry, overlap, diagonal flow, grid-breaking elements.
- Generous negative space OR controlled density — never accidental middleground.

### Backgrounds & Depth

- Create atmosphere: gradient meshes, noise textures, layered transparencies, grain overlays.
- Dramatic shadows and decorative borders should match chosen tone.
- Solid white/gray backgrounds = missed creative opportunity.

## Anti-Patterns

- **No generic font defaults**: Inter/Roboto/Arial/system-ui produce forgettable UIs; choose characterful fonts.
- **No purple-gradient-on-white**: Most overused AI aesthetic; commit to something context-specific.
- **No scattered animations**: One orchestrated entrance beats ten random hover effects.
- **No accidental layouts**: Every spacing and positioning decision must serve aesthetic intent.
- **No same aesthetic twice**: Vary light/dark, font style, tone — never converge on single style.

## References

- [Tone Palette & Font Pairings](references/tones.md) — load when choosing aesthetic direction or fonts
- [Motion Patterns](references/motion.md) — load when implementing animations or transitions

---

### common-web-visual-testing

---
name: common-web-visual-testing
description: Standardizes visual audits, responsive design, and behavioral testing for web apps.
metadata:
  triggers:
    keywords:
    - web test
    - browser test
    - responsive audit
    - verify web ui
    - cross-browser check
    - web accessibility
---

# 🌐 Web Visual & Behavioral Testing

## **Priority: P1 (HIGH)**

> [!IMPORTANT]
> **Tier 2 (Methodology)**: Strategy web UI/UX audit.
> **Tier 3 (Domain)**: Responsive, A11y (WCAG), Browser Engine quirk.

## 🧪 Testing Mindset (Comparative Audit)

Visual test best as **Comparative Audit** loop:
1.  **Baseline (Before)**: Capture `snapshot --aria` + `screenshot` prod/main.
2.  **Implementation (After)**: Capture same local/feature.
3.  **Audit**: Compare state for regression, CLS, Aria drift.

## 📋 Scenario Matrix

| Change Type | Scenarios to Run |
| :--- | :--- |
| **CSS/Layout** | Responsive Audit + Hover + CLS Check |
| **Forms/Input** | Validation Msg + Focus State + Error Boundary |
| **Navigation** | URL Sync + Sticky Header + Back-Button Persistence |
| **Assets/Fonts** | Lazy Load + Icon Check + LCP Audit |
| **Accessibility** | Tab Order + Aria-Snapshot + Color Contrast |

## 🚫 Anti-Patterns

- **Single-Viewport**: Never verify Desktop only. Check Mobile (375px) + Tablet (768px).
- **Ignore Layout Shift**: Check loading state (skeleton) → no page jump.
- **Unmasked Dynamic**: **MUST** mask timestamp/balance via `--mask` or JS (`opacity: 0`). Avoid "False Regression".
- **Blind Assertion**: Use `playwright-cli snapshot --aria` verify state before done.
- **External Dependency**: Mock/bypass 3rd-party (Chat, Analytics) → prevent flakiness.

## 🔗 References

- **playwright-cli**: [playwright-cli](../../quality-engineering/quality-engineering-playwright-cli/SKILL.md)
- **Diagnostic Decoder**: [diagnostic-decoder](references/diagnostic-decoder.md)
- **DOM vs Screenshot**: [dom-snapshot-vs-screenshot](references/dom-snapshot-vs-screenshot.md)
- **Login & Data**: [login-and-test-data](references/login-and-test-data.md)
- **Scenario Details**: [scenarios](references/scenarios.md)


---

### common-workflow-writing

---
name: common-workflow-writing
description: Rules for writing concise, token-efficient workflow and skill files. Prevents over-building that requires costly optimization passes. Use when creating or editing workflow files, SKILL.md files, or new skill definitions.
metadata:
  triggers:
    files:
    - '.agents/workflows/*.md'
    - 'SKILL.md'
    keywords:
    - create workflow
    - write workflow
    - new skill
    - new workflow
---
# Workflow Writing Standard

## **Priority: P0 (CRITICAL)**

## Core Rules

- **Templates, not examples**: Workflows define _structure_, not pre-filled data. agent generates data at runtime.
- **No example rows in tables**: Include headers + 1 skeleton row only. Never populate with fake data.
- **No prose explanations**: If bullet or command achieves same result, delete paragraph.
- **No pre-answered questions**: Don't document what agent _will_ output — let it output it.
- **Merge sequential steps**: If two steps always happen together, they one step.

## Size Limits

| File type | Limit | If exceeded |
| ----------------- | --------- | --------------------------------- |
| Workflow `.md` | 80 lines | Extract detail to `references/` |
| SKILL.md | 100 lines | Extract examples to `references/` |
| Table rows | 8 | Extract to `references/` |
| Inline code block | 10 lines | Extract to `references/` |

## Workflow Structure (Required order)

```
1. Goal (1 sentence)
2. Steps (imperative verb → command or checklist)
3. Output template (headers only, no pre-filled rows)
```

## Anti-Patterns

- **No verbose step preambles**: `"Before we start, it's important to understand..."` → Delete
- **No pre-filled report rows**: `| Security | P0 | ✅ PASS | CLIENT_ID moved to env |` → Delete
- **No repeated examples**: Same concept shown twice in different formats → Keep one
- **No "How to X" sections**: step instruction
- **No caution blocks for obvious rules**: Reserve `> ⚠️` for genuinely non-obvious risks

## Quick Self-Check Before Saving

- [ ] Can agent reconstruct any removed content at runtime from context? If yes → remove it
- [ ] every table row real structure, not example data?
- [ ] there any paragraphs bullet list could replace?
- [ ] Would cutting this in half still give agent enough to act on?

---

