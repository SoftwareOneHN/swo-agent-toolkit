#!/bin/bash
# ============================================================
# SWOHN Memory — stdio Bridge (Linux/macOS)
#
# Wraps the SWOHN Memory SSE server as a stdio MCP server
# using mcp-remote. This allows stdio-only clients
# (Codex CLI, Claude Code, Windsurf, etc.) to connect.
#
# Prerequisites: Node.js 18+ installed
# Usage: Add this script as the MCP server command
# ============================================================

SWOHN_MEMORY_URL="http://localhost:3020/sse"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is required but not found." >&2
    echo "Install from https://nodejs.org" >&2
    exit 1
fi

# Launch mcp-remote bridge (stdin/stdout passthrough)
exec npx -y mcp-remote "$SWOHN_MEMORY_URL"
