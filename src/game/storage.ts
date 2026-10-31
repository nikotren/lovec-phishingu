import type { Profile } from './model';

const KEY = 'lovec-phishingu-v1';

export const DEFAULT_PROFILE: Profile = {
  name: '',
  best: 0,
  runs: 0,
  cleared: 0,
  unlocked: {},
  ts: {},
  badges: {},
  muted: false,
  fullClues: 0,
  theme: 'dark',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function loadProfile(): Profile {
  const defaults: Profile = { ...DEFAULT_PROFILE, unlocked: {}, ts: {}, badges: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return defaults;

    const number = (value: unknown, fallback: number) =>
      typeof value === 'number' && Number.isFinite(value) ? value : fallback;

    return {
      name: typeof parsed.name === 'string' ? parsed.name.slice(0, 28) : defaults.name,
      best: number(parsed.best, defaults.best),
      runs: number(parsed.runs, defaults.runs),
      cleared: number(parsed.cleared, defaults.cleared),
      unlocked: isRecord(parsed.unlocked) ? { ...(parsed.unlocked as Record<string, boolean>) } : {},
      ts: isRecord(parsed.ts)
        ? (Object.fromEntries(
            Object.entries(parsed.ts).filter(([, value]) => isRecord(value)),
          ) as Profile['ts'])
        : {},
      badges: isRecord(parsed.badges) ? { ...(parsed.badges as Record<string, number>) } : {},
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : defaults.muted,
      fullClues: number(parsed.fullClues, defaults.fullClues),
      theme: parsed.theme === 'light' ? 'light' : 'dark',
    };
  } catch {
    return defaults;
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* Soukromý režim nebo plné úložiště — hra funguje dál bez ukládání. */
  }
}


