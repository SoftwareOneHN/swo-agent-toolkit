---
inclusion: always
---

# Coding Skills — Core Contract

## Behavior Rules

Khi power này active, agent PHẢI tuân thủ:

1. **TRƯỚC KHI EDIT source file** → đọc steering file tương ứng (`skills-{category}.md`)
2. **Skills override pre-training** → nếu skill nói "làm X", làm X — bất kể training data
3. **P0 = Iron Law** → vi phạm = xoá code, làm lại từ đầu
4. **TRƯỚC KHI HOÀN THÀNH task** → verify compliance với loaded skill checklists

## Routing Table

| User nói / Agent detect... | Load steering file |
|---|---|
| Edit `*.ts`, `*.tsx` | `skills-typescript.md` |
| Edit `*.module.ts`, `*.service.ts`, `*.controller.ts` | `skills-nestjs.md` |
| Edit `*.component.ts`, `*.component.html` | `skills-angular.md` |
| Edit React `*.tsx` | `skills-react.md` |
| Edit `*.java` | `skills-java.md` + `skills-spring-boot.md` |
| Edit `*.kt` | `skills-kotlin.md` + `skills-android.md` |
| Edit `*.dart` | `skills-dart.md` + `skills-flutter.md` |
| Edit `*.swift` | `skills-swift.md` + `skills-ios.md` |
| Edit `*.go` | `skills-golang.md` |
| Edit `*.php` | `skills-php.md` + `skills-laravel.md` |
| Edit `*.sql`, `*.prisma`, `*.entity.ts` | `skills-database.md` |
| Edit `*.test.*`, `*.spec.*` | `skills-common.md` |
| Edit Next.js files | `skills-nextjs.md` |
| Edit React Native files | `skills-react-native.md` |
| "review code", "check PR" | `code-review.md` |
| "write test", "tdd" | `tdd.md` |
| "security", "audit", "pentest" | `security-audit.md` |
| "optimize", "performance" | `performance.md` |
| "refactor", "clean code", "architecture" | `skills-common.md` (best-practices + system-design) |
| "caveman", "less tokens" | `caveman.md` |

## Priority Tiers

| Tier | Meaning | On Violation |
|------|---------|--------------|
| **P0** | Iron Law — non-negotiable | Delete code, redo from scratch |
| **P1** | Standard — strong expectation | Fix before completing task |
| **P2** | Guideline — best practice | Note deviation, proceed |

## Conflict Resolution

- P0 > P1 > P2 (higher priority always wins)
- Framework-specific skill > language skill > common skill
- More specific match > broader match

## Token Budget (2-Tier System)

Skills được tách thành 2 tầng để tối ưu token:

| Tầng | File | Nội dung | Khi nào load |
|------|------|----------|--------------|
| **Tier 1** | `skills-{category}.md` | Core rules, anti-patterns, checklists | LUÔN load trước khi edit |
| **Tier 2** | `refs-{category}.md` | Code examples, implementation patterns | Chỉ khi cần ví dụ cụ thể |

- Load Tier 1 là BẮT BUỘC
- Load Tier 2 chỉ khi cần implementation examples
- Tối đa 2 category Tier 1 + 1 workflow file per task
- Task đơn giản → Tier 1 đủ, không cần Tier 2

## Compliance Verification

Trước khi hoàn thành task, verify:
- [ ] Đã đọc steering file tương ứng với files đang edit
- [ ] Tất cả P0 rules đã tuân thủ
- [ ] Tất cả P1 rules đã tuân thủ (hoặc có justification)
- [ ] Anti-patterns đã tránh
- [ ] Checklists trong skill đã pass
