---
inclusion: manual
---

# Code Review Workflow

## Khi nào dùng
- User yêu cầu review PR/code
- User nói "review", "critique", "analyze code"
- Trước khi merge bất kỳ changes nào

## Prerequisites

1. Có git diff hoặc changed files list
2. Load skills cho TẤT CẢ changed files

## Process

### Phase 1: Scope & Load Skills

```bash
# Get changed files
git diff --name-only origin/main...HEAD
```

```
load_skills {
  files: [<all changed files>],
  keywords: ["review", "security"]
}
```

Luôn load thêm:
- `common-code-review` (review methodology)
- `common-security-audit` (security lens)
- `common-owasp` (web security)

### Phase 2: Multi-Lens Review

Áp dụng 6 lenses tuần tự:

| # | Lens | Focus |
|---|------|-------|
| 1 | **Security** (Mandatory) | Auth, injection, secrets, IDOR, BOLA |
| 2 | **Logic & Correctness** | Null safety, edge cases, race conditions |
| 3 | **Silent Failures** | Swallowed errors, missing logging, empty catches |
| 4 | **Type Design** | Type safety, generics, any-types, narrowing |
| 5 | **AI Safety** | Prompt injection, RAG poisoning (if LLM code) |
| 6 | **Testing** | Coverage gaps, assertion quality, mock abuse |

### Phase 3: Confidence Filter

Chỉ report findings khi confidence >= 76/100.
- Dưới threshold = noise, bỏ qua
- Trên threshold = signal, phải report

### Phase 4: Output Format

```
[SEVERITY] [File:Line] Issue Description
Why: Risk or impact.
Fix: 1-2 line suggestion.
```

Severity levels:
- `[BLOCKER]` — Must fix before merge. P0 violation.
- `[MAJOR]` — Should fix. P1 violation or significant risk.
- `[NIT]` — Nice to have. Style or minor improvement.

### Phase 5: Verdict

Chọn 1:
- **APPROVE**: No BLOCKER/MAJOR findings
- **CHANGES REQUESTED**: MAJOR findings exist
- **BLOCKED**: BLOCKER findings exist

### Phase 6: Skill Feedback

Cho mỗi BLOCKER/MAJOR finding, hỏi:
> "Có skill nào đáng lẽ phải prevent lỗi này không?"

- CÓ → Update skill's anti-patterns
- KHÔNG → Consider tạo skill mới

## Anti-Patterns (Review Process)

- ❌ Nitpick formatting/style → focus on logic & security
- ❌ Vague "this is wrong" → explain WHY + suggest FIX
- ❌ Skip test files → review tests with same rigor
- ❌ Review > 500 lines in one pass → break into chunks
