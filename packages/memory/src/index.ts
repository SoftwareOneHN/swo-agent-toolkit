#!/usr/bin/env node
/**
 * SWOHN Memory — Entry Point
 *
 * Usage:
 *   # Local mode (STDIO) — default
 *   swohn-memory
 *
 *   # Network mode (SSE)
 *   swohn-memory --sse --port 3020 --api-key YOUR_SECRET
 *
 * Environment variables (alternative to CLI flags):
 *   SWOHN_MEMORY_DB_PATH        — SQLite database path (default: ~/.swohn/brain.db)
 *   SWOHN_MEMORY_VAULT_PATH     — Obsidian vault path (optional)
 *   SWOHN_MEMORY_API_KEY        — API key for SSE mode
 *   SWOHN_MEMORY_PORT           — Port for SSE mode (default: 3020)
 *   SWOHN_MEMORY_DECAY_LAMBDA   — Decay rate constant (default: 0.01)
 *   GEMINI_API_KEY              — Gemini API key for semantic embeddings (Phase 6)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { BrainDatabase } from './database.js';
import { ObsidianVault } from './obsidian.js';
import { createBrainServer } from './server.js';
import { type LambdaMemoryConfig, DEFAULT_CONFIG } from './types.js';

let startStdioServer: any;
let startSSEServer: any;
try {
  // @ts-ignore
  const transport = await import('./transport.js');
  startStdioServer = transport.startStdioServer;
  startSSEServer = transport.startSSEServer;
} catch (e) {
  console.error('[swohn-memory] ⚠️ ERROR: Missing transport.ts. Please rename src/transport.sample.ts to src/transport.ts and run "npm run build".');
  process.exit(1);
}
import { decayScore, selectFidelity } from './decay.js';
import { initEmbedStats } from './embed_stats.js';

// --- Parse CLI args ---
const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

const useSSE = args.includes('--sse');
const port = parseInt(getArg('port') || process.env.SWOHN_MEMORY_PORT || '3020', 10);
const apiKey = getArg('api-key') || process.env.SWOHN_MEMORY_API_KEY || '';

// --- Resolve paths ---
const defaultDir = path.join(os.homedir(), '.swo');
fs.mkdirSync(defaultDir, { recursive: true });

const dbPath =
  process.env.SWOHN_MEMORY_DB_PATH || path.join(defaultDir, 'brain.db');
const vaultPath = process.env.SWOHN_MEMORY_VAULT_PATH || getArg('vault') || null;
const decayLambda = parseFloat(
  process.env.SWOHN_MEMORY_DECAY_LAMBDA || `${DEFAULT_CONFIG.decay_lambda}`
);
const geminiApiKey = process.env.GEMINI_API_KEY || null;

// --- Build config ---
const config: LambdaMemoryConfig = {
  ...DEFAULT_CONFIG,
  db_path: dbPath,
  decay_lambda: decayLambda,
  obsidian_vault_path: vaultPath,
  api_key: apiKey || null,
  gemini_api_key: geminiApiKey,
};

// --- Initialize ---
console.error(`[swohn-memory] Database: ${dbPath}`);
const db = new BrainDatabase(dbPath);

let vault: ObsidianVault | null = null;
if (vaultPath) {
  vault = new ObsidianVault(vaultPath);
  console.error(`[swohn-memory] Obsidian Vault: ${vaultPath}`);
} else {
  console.error('[swohn-memory] Obsidian Vault: not configured');
}

// Phase 6: Log Gemini embedding status
if (geminiApiKey) {
  console.error('[swohn-memory] Gemini Embedding: enabled (text-embedding-004)');
} else {
  console.error('[swohn-memory] Gemini Embedding: disabled (using local TF-IDF fallback)');
}

// Init embedding stats (persisted alongside brain.db)
const statsPath = dbPath.replace(/brain\.db$/, 'embed_stats.json');
initEmbedStats(statsPath);

const server = createBrainServer(db, vault, config);

// --- Start ---
if (useSSE) {
  if (!apiKey) {
    console.error(
      '[swohn-memory] ERROR: SSE mode requires --api-key or SWOHN_MEMORY_API_KEY'
    );
    process.exit(1);
  }
  // Pass a factory so each SSE connection gets a fresh McpServer instance
  const rulesPath = dbPath.replace(/brain\.db$/, 'access_rules.json');
  startSSEServer(
    (allowedProjects: any) => createBrainServer(db, vault, config, allowedProjects),
    port,
    apiKey,
    { db, vault, config, decayScore, selectFidelity, rulesPath, statsPath }
  ).catch((err: any) => {
    console.error('[swohn-memory] Fatal error:', err);
    process.exit(1);
  });
  
  // Keep process alive in SSE mode
  setInterval(() => {}, 1000); 
} else {
  const server = createBrainServer(db, vault, config);
  startStdioServer(server).catch((err: any) => {
    console.error('[swohn-memory] Fatal error:', err);
    process.exit(1);
  });
}

// --- Graceful shutdown ---
process.on('SIGINT', () => {
  console.error('[swohn-memory] Shutting down...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  db.close();
  process.exit(0);
});

// --- Crash guards: prevent silent death from unhandled errors ---
process.on('unhandledRejection', (reason, promise) => {
  console.error('[swohn-memory] ⚠️ Unhandled Promise Rejection (server NOT crashing):', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[swohn-memory] ⚠️ Uncaught Exception (server NOT crashing):', err);
  // NOTE: Do NOT process.exit() here — we want the server to stay alive.
  // Only truly fatal errors (out of memory) should kill the process.
});