/**
 * Local-dev environment loading. Keys come from a git-ignored .env and are for local
 * development only; the shipped client never holds provider keys (PLAN 7.6).
 */
import { readFileSync, existsSync } from 'node:fs';

export interface DevEnv {
  GROQ_API_KEY?: string;
  GEMINI_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

const KEYS = ['GROQ_API_KEY', 'GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'] as const;

/** Parses KEY=VALUE lines; ignores comments, blanks and empty values. */
export function parseDotenv(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    if (value) out[key] = value;
  }
  return out;
}

/** Reads known keys from the process env, then from an optional .env file (process env wins). */
export function loadDevEnv(
  dotenvPath?: string,
  processEnv: NodeJS.ProcessEnv = process.env,
): DevEnv {
  const file =
    dotenvPath && existsSync(dotenvPath) ? parseDotenv(readFileSync(dotenvPath, 'utf8')) : {};
  const env: DevEnv = {};
  for (const k of KEYS) {
    const v = processEnv[k] || file[k];
    if (v) env[k] = v;
  }
  return env;
}
