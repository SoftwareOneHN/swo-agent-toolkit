#!/bin/bash
# ============================================================
# Claude Code CLI — SWOHN Memory MCP Setup
# Run this script once to register SWOHN Memory as an MCP server.
#
# Prerequisites:
#   - Claude Code CLI installed (https://docs.anthropic.com/en/docs/claude-code)
#   - SWOHN Memory server running on localhost:3020
#   - Node.js installed (for mcp-remote bridge)
#
# Docs: https://docs.anthropic.com/en/docs/claude-code/mcp
# ============================================================

SWOHN_MEMORY_URL="http://localhost:3020/sse"

echo "╔══════════════════════════════════════════════╗"
echo "║  SWOHN Memory — Claude Code MCP Setup           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Method 1: Direct SSE (simpler, may have limited support)
echo "[1/2] Registering via HTTP transport..."
claude mcp add swohn-memory --transport sse "$SWOHN_MEMORY_URL" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "  ⚠️  Direct SSE failed. Trying stdio bridge..."
    # Method 2: stdio via mcp-remote (more reliable)
    echo "[2/2] Registering via stdio bridge (npx mcp-remote)..."
    claude mcp add swohn-memory \
        --type stdio \
        -- npx -y mcp-remote "$SWOHN_MEMORY_URL"
fi

echo ""
echo "✅ Done! Verify with:"
echo "   claude mcp list"
echo ""
echo "To remove later:"
echo "   claude mcp remove swohn-memory"
