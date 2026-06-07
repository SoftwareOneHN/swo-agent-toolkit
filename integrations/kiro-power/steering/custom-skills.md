---
inclusion: manual
---

# Creating Custom Skills

## Khi nào tạo skill mới
- Team có patterns lặp lại mà built-in skills không cover
- Code review phát hiện lỗi recurring
- Project-specific conventions cần enforce
- New framework/library team adopt

## Skill Structure

```
{category}/{skill-name}/
├── SKILL.md           # Main skill file (required)
├── references/        # Heavy examples (optional)
│   ├── example-1.md
│   └── patterns.md
└── evals/             # Evaluation criteria (optional)
    └── evals.json
```

## SKILL.md Template

```markdown
---
name: {skill-name}
description: >
  One-line description of what this skill enforces.
  Use when: {trigger conditions}.
metadata:
  triggers:
    files:
    - '**/*.ts'
    - 'src/auth/**'
    keywords:
    - keyword1
    - keyword2
    - keyword3
---
# {Skill Title}

## **Priority: P{0|1|2}**

## Rules

1. Rule one — imperative voice, specific
2. Rule two — measurable, verifiable
3. Rule three — actionable

## Patterns

### ✅ Do
```code
// Good example with explanation
```

### ❌ Don't
```code
// Bad example with explanation why
```

## Anti-Patterns

- **Pattern name**: What goes wrong → What to do instead
- **Pattern name**: What goes wrong → What to do instead

## Verification Checklist

- [ ] Checkable item 1
- [ ] Checkable item 2

## References

- [Heavy Example](references/example-1.md)
```

## Content Guidelines

### Conciseness (Token Economy)
- Target: < 2000 tokens per SKILL.md
- Imperative voice: "Do X" not "You should consider doing X"
- No filler words, no hedging
- Code examples: minimal, focused on the point

### Specificity
- Every rule must be VERIFIABLE (can check yes/no)
- Include exact thresholds (not "fast" but "< 200ms")
- Include exact patterns (not "good naming" but "camelCase for functions")

### Anti-Patterns Section
- List common mistakes you've seen in code reviews
- Each anti-pattern: name + what goes wrong + fix
- These are the highest-value part of a skill

### References (Heavy Examples)
- Put lengthy code examples in `references/` folder
- Each reference: < 1500 tokens
- Only loaded when agent explicitly requests
- Good for: full implementation examples, migration guides, config templates

## Triggers Design

### File Patterns
- Use `**/*.ext` for language-wide skills
- Use `src/specific/**` for domain-specific skills
- Use exact filenames for config skills (`tsconfig.json`)

### Keywords
- 3-8 keywords per skill (not too broad, not too narrow)
- Include synonyms: "test" + "spec" + "tdd"
- Include indirect phrases: "make it faster" → "performance"

## Testing Your Skill

1. Place skill in `server/skills/{category}/{skill-name}/SKILL.md`
2. Restart MCP server
3. Test: `get_skill { category: "...", skill: "..." }`
4. Test: `load_skills { files: ["matching-file.ts"] }`
5. Verify skill appears in results
6. Test with real coding task — does it improve output?

## Skill Quality Checklist

- [ ] Name follows convention: `{category}-{name}`
- [ ] Description is one clear sentence
- [ ] Triggers cover intended files AND keywords
- [ ] Priority is justified (P0 only for critical safety/correctness)
- [ ] Rules are imperative and verifiable
- [ ] Anti-patterns include real examples from your codebase
- [ ] Token count < 2000 for SKILL.md
- [ ] References separated for heavy content
