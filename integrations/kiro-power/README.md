# coding-skills — Kiro Power

> High-density coding skills that load on-demand. 21 categories, 246 skills, zero dependencies.

## Install

In Kiro IDE → Powers panel → Add custom power → paste this repo URL:

```
https://github.com/TDFS-Dom/coding-skills-power.git
```

## What It Does

- **Auto-routing** — mention "typescript" or "security" and Kiro suggests activating this power
- **On-demand loading** — only relevant skills loaded via steering files (no MCP server needed)
- **Priority enforcement** — P0 rules are non-negotiable, P1 rules require justification to skip
- **Zero dependencies** — pure markdown, no build step, no Node.js required

## Architecture

```
coding-skills-power/
├── POWER.md                           ← Main docs (shown on activate)
├── steering/
│   ├── getting-started.md             ← Always loaded (core contract + routing)
│   │
│   ├── code-review.md                 ← Workflow: PR review
│   ├── tdd.md                         ← Workflow: Red-Green-Refactor
│   ├── security-audit.md              ← Workflow: vulnerability scanning
│   ├── performance.md                 ← Workflow: optimization
│   ├── skill-workflow.md              ← How skill resolution works
│   ├── custom-skills.md               ← Create your own skills
│   ├── caveman.md                     ← Ultra-compressed mode
│   │
│   ├── skills-common.md               ← 33 cross-language skills
│   ├── skills-typescript.md           ← 4 TypeScript skills
│   ├── skills-javascript.md           ← 3 JavaScript skills
│   ├── skills-react.md                ← 8 React skills
│   ├── skills-react-native.md         ← 13 React Native skills
│   ├── skills-angular.md              ← 15 Angular skills
│   ├── skills-nestjs.md               ← 21 NestJS skills
│   ├── skills-nextjs.md               ← 18 Next.js skills
│   ├── skills-flutter.md              ← 22 Flutter skills
│   ├── skills-dart.md                 ← 3 Dart skills
│   ├── skills-java.md                 ← 5 Java skills
│   ├── skills-spring-boot.md          ← 10 Spring Boot skills
│   ├── skills-kotlin.md               ← 4 Kotlin skills
│   ├── skills-android.md              ← 26 Android skills
│   ├── skills-swift.md                ← 8 Swift skills
│   ├── skills-ios.md                  ← 15 iOS skills
│   ├── skills-golang.md               ← 11 Go skills
│   ├── skills-php.md                  ← 7 PHP skills
│   ├── skills-laravel.md              ← 10 Laravel skills
│   ├── skills-database.md             ← 3 Database skills
│   └── skills-quality-engineering.md  ← 7 QE skills
│
└── scripts/
    └── generate-steering.py           ← Regenerate from source skills/
```

## Mapping: Source → Power

| Source (`skills/`) | Power (`steering/`) | Inclusion |
|---|---|---|
| `skills/common/` (33 skills) | `steering/skills-common.md` | manual |
| `skills/typescript/` (4 skills) | `steering/skills-typescript.md` | manual |
| `skills/nestjs/` (21 skills) | `steering/skills-nestjs.md` | manual |
| ... (21 categories total) | ... | manual |
| _(routing logic from AGENTS.md)_ | `steering/getting-started.md` | **always** |
| _(workflows from .agents/workflows/)_ | `steering/code-review.md`, `tdd.md`, etc. | manual |

## How It Works (No MCP)

1. User activates power → `getting-started.md` auto-loads (always inclusion)
2. `getting-started.md` contains routing table: file type → steering file
3. Agent reads relevant `skills-{category}.md` based on what files are being edited
4. Skills content is directly in the steering file — no tool calls needed
5. Agent follows P0/P1 rules, avoids anti-patterns, checks compliance

## Updating Skills

When source `skills/` directory is updated:

```bash
python3 scripts/generate-steering.py /path/to/swo-agent-toolkit/skills
```

This regenerates all `steering/skills-*.md` files from source SKILL.md files.

## Keywords (for Kiro auto-activation)

```
skills, coding standards, best practices, code quality, tdd, test driven,
unit test, code review, security audit, owasp, typescript, javascript,
react, angular, nestjs, nextjs, flutter, dart, java, spring boot, kotlin,
android, swift, ios, golang, php, laravel, database, sql, refactor,
clean code, solid, dry, performance, optimize, debug, git, architecture
```

## License

MIT
