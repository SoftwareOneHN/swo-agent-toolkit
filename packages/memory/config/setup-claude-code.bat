@echo off
REM ============================================================
REM Claude Code CLI — SWOHN Memory MCP Setup (Windows)
REM Run this script once to register SWOHN Memory as an MCP server.
REM
REM Prerequisites:
REM   - Claude Code CLI installed
REM   - SWOHN Memory server running on localhost:3020
REM   - Node.js installed (for mcp-remote bridge)
REM ============================================================

set SWOHN_MEMORY_URL=http://localhost:3020/sse

echo ==============================================
echo   SWOHN Memory — Claude Code MCP Setup
echo ==============================================
echo.

echo [1/2] Registering via SSE transport...
claude mcp add swohn-memory --transport sse "%SWOHN_MEMORY_URL%" 2>nul

if %ERRORLEVEL% neq 0 (
    echo   Warning: Direct SSE failed. Trying stdio bridge...
    echo [2/2] Registering via stdio bridge ^(npx mcp-remote^)...
    claude mcp add swohn-memory --type stdio -- npx -y mcp-remote "%SWOHN_MEMORY_URL%"
)

echo.
echo Done! Verify with:
echo    claude mcp list
echo.
echo To remove later:
echo    claude mcp remove swohn-memory
