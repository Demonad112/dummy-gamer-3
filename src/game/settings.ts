// Persisted player settings. View-side only: never part of SimState or the Command log.
export interface Settings {
  muted: boolean;
}

export const SETTINGS_KEY = 'dg3.settings';
export const DEFAULT_SETTINGS: Settings = { muted: false };

// Pure: turns whatever storage returned into valid settings. Missing, malformed or wrongly typed input falls back to defaults.
export function parseSettings(raw: string | null | undefined): Settings {
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const v: unknown = JSON.parse(raw);
    if (typeof v !== 'object' || v === null) return { ...DEFAULT_SETTINGS };
    const muted = (v as { muted?: unknown }).muted;
    return { muted: typeof muted === 'boolean' ? muted : DEFAULT_SETTINGS.muted };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function serializeSettings(s: Settings): string {
  return JSON.stringify({ muted: s.muted });
}

let cache: Settings | null = null;

export function getSettings(): Settings {
  if (cache) return cache;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SETTINGS_KEY);
  } catch {
    // storage blocked or unavailable: use defaults
  }
  cache = parseSettings(raw);
  return cache;
}

export function setMuted(muted: boolean): void {
  cache = { ...getSettings(), muted };
  try {
    localStorage.setItem(SETTINGS_KEY, serializeSettings(cache));
  } catch {
    // not persisted; the in-memory value still applies this session
  }
}
