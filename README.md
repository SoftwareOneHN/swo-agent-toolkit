# SWO Agent Toolkit

> The portable SDLC standards layer + persistent memory for AI coding agents.

**Two systems, one toolkit:**

| Package | Purpose | npm |
|---|---|---|
| `@swohn/cli` | Sync coding skills to any AI agent | `swo-agent-toolkit` |
| `@swohn/mcp` | Runtime skill enforcement (MCP server) | `@swohn/mcp` |
| `@swohn/memory` | Persistent λ-decay memory (MCP server) | `@swohn/memory` |
| `@swohn/server` | REST API backend | Private |

## Quick Start

```bash
# Install & sync coding skills
npx @swohn/cli@latest init
npx @swohn/cli@latest sync

# Start memory server (optional)
npx @swohn/memory
```

## What's Inside

### Skills (259 across 20+ frameworks)
Token-efficient coding standards that load on-demand. Works with Cursor, Claude Code, GitHub Copilot, Gemini, Windsurf, Trae, Kiro, Roo.

### Memory (λ-decay persistent memory)
Local-first MCP server that gives your AI long-term memory across sessions. Stores, decays, queries, and clusters memories with semantic search.

### Workflows (SDLC spine)
17 battle-tested development workflows from brainstorm to deploy.

## Monorepo Structure

```
swo-agent-toolkit/
├── packages/          # Code packages (@swohn/cli, @swohn/mcp, @swohn/memory, @swohn/server, @swohn/shared)
├── registry/          # Skill definitions, workflows, rules (content)
├── integrations/      # Agent-specific configs (Codex, Copilot, Kiro, etc.)
├── tools/             # Build scripts, benchmarks
└── docs/              # Documentation
```

## Links

- **GitHub**: https://github.com/SoftwareOneHN/swo-agent-toolkit
- **Docs**: [Architecture](docs/architecture.md) | [Contributing](docs/contributing.md) | [SDLC Guide](docs/sdlc-workflow-quick-reference.md)

## License

MIT
