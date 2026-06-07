/**
 * Common types shared across @swo/mcp and @swo/memory
 */

export interface SessionEvent {
  at: string;
  via: string;
  input: string[];
  loaded: string[];
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  details: Record<string, unknown>;
}

export interface McpToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}
