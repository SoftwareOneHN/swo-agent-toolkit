---
inclusion: manual
---

# Skill Resolution Workflow

## Flow

```
User request → Identify target files + extract keywords
  → Consult routing table (getting-started.md)
  → Load matching skills-{category}.md (Tier 1)
  → If need examples → load refs-{category}.md (Tier 2)
  → Agent reads ALL loaded skills
  → Agent applies rules during work
  → Verify compliance before completion
```

## Step 1: Identify Target Files

Trước khi code, xác định files sẽ tạo/sửa:
- Files user mention trực tiếp
- Files liên quan (imports, tests, configs)
- Infer từ task description

## Step 2: Extract Keywords

Từ user request, extract concepts:
- Explicit: "write unit test" → tdd, unit test
- Implicit: "fix login bug" → debug, auth, security
- Indirect: "make it faster" → performance, optimize

## Step 3: Load Steering Files

Dựa vào routing table trong `getting-started.md`:

1. Match file extension → load `skills-{category}.md`
2. Match keywords → load workflow file hoặc `skills-common.md`
3. Nếu cần code examples → load thêm `refs-{category}.md`

Ví dụ: edit `src/auth/login.service.ts` + keyword "security"
→ Load: `skills-nestjs.md` + `skills-common.md` (security section)
→ Nếu cần examples: `refs-nestjs.md`

## Step 4: Read ALL Loaded Skills

- Đọc toàn bộ content trong steering files đã load
- Note P0 rules (phải tuân thủ tuyệt đối)
- Note P1 rules (phải tuân thủ trừ khi justify)
- Note anti-patterns (phải tránh)

## Step 5: Apply During Work

- Mỗi khi viết code → cross-check với loaded skills
- P0 conflict → stop, fix immediately
- P1 conflict → note, fix before completion
- Skill conflict nhau → higher priority wins
- Same priority conflict → framework-specific wins over generic

## Step 6: Verify Before Completion

Trước khi hoàn thành task:
- [ ] Tất cả P0 rules đã tuân thủ?
- [ ] Tất cả P1 rules đã tuân thủ (hoặc có justification)?
- [ ] Anti-patterns đã tránh?
- [ ] Checklists trong skill đã pass?

## Matching Rules

### File Pattern Priority
- `*.module.ts` (specific) > `*.ts` (generic)
- `*.spec.ts` (test) → load `skills-common.md` TDD section
- Framework-specific patterns take precedence

### Keyword Priority
- Exact match > partial match
- Security/auth keywords → always load common security skills
- "refactor", "clean code" → load common best-practices

### Conflict Resolution
1. P0 skills always win
2. Framework-specific > language > common
3. More specific file match > broader match
4. When same priority conflicts → ask user
