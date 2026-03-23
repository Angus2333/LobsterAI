/**
 * Shared constants and utility functions used by both main and renderer processes.
 * Centralised here to avoid duplication across modules.
 */

// ─── File name sanitisation ──────────────────────────────────────────────────

/** Characters that are invalid in file names across major operating systems. */
export const INVALID_FILE_NAME_PATTERN = /[<>:"/\\|?*\u0000-\u001F]/g;

/**
 * Sanitise a string for use as a file name by replacing invalid characters
 * with spaces and collapsing consecutive whitespace.
 */
export const sanitizeExportFileName = (value: string): string => {
  const sanitized = value.replace(INVALID_FILE_NAME_PATTERN, ' ').replace(/\s+/g, ' ').trim();
  return sanitized || 'cowork-session';
};

// ─── Memory configuration bounds ────────────────────────────────────────────

/** Minimum allowed value for the user-memories-max-items setting. */
export const MIN_MEMORY_USER_MEMORIES_MAX_ITEMS = 1;

/** Maximum allowed value for the user-memories-max-items setting. */
export const MAX_MEMORY_USER_MEMORIES_MAX_ITEMS = 60;

// ─── Memory text filters ────────────────────────────────────────────────────

/**
 * Matches text that looks like procedural / command-line content rather than a
 * durable personal fact, used to auto-reject memory candidates.
 */
export const MEMORY_PROCEDURAL_TEXT_RE = /(执行以下命令|run\s+(?:the\s+)?following\s+command|\b(?:cd|npm|pnpm|yarn|node|python|bash|sh|git|curl|wget)\b|\$[A-Z_][A-Z0-9_]*|&&|--[a-z0-9-]+|\/tmp\/|\.sh\b|\.bat\b|\.ps1\b)/i;

/**
 * Matches text that describes an assistant's own workflow instruction (e.g.
 * "使用 xxx 技能" / "use xxx skill"), which should not be stored as user memory.
 */
export const MEMORY_ASSISTANT_STYLE_TEXT_RE = /^(?:使用|use)\s+[A-Za-z0-9._-]+\s*(?:技能|skill)/i;
