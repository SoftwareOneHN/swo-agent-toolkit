---
inclusion: manual
---

# Security Audit Workflow

## Khi nào dùng
- User nói "security", "audit", "pentest", "vulnerability"
- Code liên quan auth, input handling, database queries
- Review code có external API calls
- File upload, user input processing

## Skills to Load

```
load_skills {
  keywords: ["security audit", "owasp", "injection", "auth"]
}
```

Luôn load:
- `common-security-audit` (P0 — scanning methodology)
- `common-owasp` (P0 — OWASP Top 10)
- `common-llm-security` (nếu có AI/LLM code)
- `common-security-standards` (P1 — general standards)
- Language-specific security skill (e.g., `typescript-security`)

## Audit Checklist

### 1. Hardcoded Secrets (P0)

Scan for:
- API keys, tokens, passwords in source code
- `.env` files committed to git
- Secrets in config files, comments, or test fixtures

**Any match = P0 violation. Immediate fix required.**

### 2. Injection Surfaces (P0)

| Type | Pattern to Find |
|------|-----------------|
| SQL Injection | String concatenation in queries |
| Command Injection | User input in exec/spawn |
| XSS | Unescaped user content in HTML |
| Path Traversal | User input in file paths without sanitization |
| SSRF | User-controlled URLs in HTTP requests |

### 3. Authentication & Authorization

- [ ] All endpoints require auth (except explicit public routes)
- [ ] JWT: RS256, short expiry, refresh rotation
- [ ] Password: bcrypt/argon2 (never MD5/SHA for passwords)
- [ ] Rate limiting on auth endpoints
- [ ] No information leakage (generic error messages)

### 4. Authorization (BOLA/IDOR)

- [ ] Object-level authorization on every data access
- [ ] User can only access OWN resources
- [ ] Admin checks on privileged operations
- [ ] No horizontal privilege escalation

### 5. Data Protection

- [ ] Sensitive data encrypted at rest
- [ ] PII not in logs
- [ ] Secrets in env vars / secret manager
- [ ] CORS properly configured
- [ ] Security headers set (CSP, HSTS, X-Frame-Options)

### 6. Dependency Security

- [ ] No known CVEs in dependencies
- [ ] Dependencies pinned to exact versions
- [ ] No unnecessary dependencies

### 7. LLM/AI Security (if applicable)

- [ ] Prompt injection defenses (input sanitization)
- [ ] Output sanitization (no code execution from LLM output)
- [ ] RAG source validation
- [ ] Token/cost limits enforced
- [ ] No PII sent to external AI providers

## Scoring

| Finding | Severity | Impact |
|---------|----------|--------|
| Hardcoded secrets | P0 | Immediate remediation |
| SQL/Command injection | P0 | Immediate remediation |
| Missing auth on endpoint | P0 | Block deployment |
| IDOR/BOLA | P0 | Block deployment |
| Weak hashing | P1 | Fix before release |
| Missing rate limiting | P1 | Fix before release |
| Outdated dependency | P1 | Update in sprint |
| Missing security header | P2 | Track in backlog |

## Output Format

```
## Security Audit Report

### P0 Findings (MUST FIX)
1. [FILE:LINE] Description
   Risk: What could happen
   Fix: How to remediate

### P1 Findings (SHOULD FIX)
...

### Summary
- Total findings: N
- P0: N (blocking)
- P1: N (should fix)
- P2: N (track)
- Verdict: PASS / FAIL
```
