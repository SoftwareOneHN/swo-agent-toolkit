@echo off
REM ============================================================
REM Claude Code CLI — SWO Memory MCP Setup (Windows)
REM Run this script once to register SWO Memory as an MCP server.
REM
REM Prerequisites:
REM   - Claude Code CLI installed
REM   - SWO Memory server running on localhost:3020
REM   - Node.js installed (for mcp-remote bridge)
REM ============================================================

set SWO_MEMORY_URL=http://localhost:3020/sse

echo ==============================================
echo   SWO Memory — Claude Code MCP Setup
echo ==============================================
echo.

echo [1/2] Registering via SSE transport...
claude mcp add swo-memory --transport sse "%SWO_MEMORY_URL%" 2>nul

if %ERRORLEVEL% neq 0 (
    echo   Warning: Direct SSE failed. Trying stdio bridge...
    echo [2/2] Registering via stdio bridge ^(npx mcp-remote^)...
    claude mcp add swo-memory --type stdio -- npx -y mcp-remote "%SWO_MEMORY_URL%"
)

echo.
echo Done! Verify with:
echo    claude mcp list
echo.
echo To remove later:
echo    claude mcp remove swo-memory
