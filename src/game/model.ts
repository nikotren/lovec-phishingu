export type {
  Attachment,
  AuthStatus,
  Mail,
  SafePreview,
  Trap,
  TrapKind,
} from './content';

export type Theme = 'dark' | 'light';
export type View = 'title' | 'brief' | 'game' | 'shiftEnd' | 'over' | 'final' | 'archive';
export type Tab = 'lib' | 'badges' | 'stats';
export type ResolutionAct = 'report' | 'ok' | 'it' | 'comp';
export type ToastTone = 'default' | 'badge' | 'danger' | 'success';
export type SfxName = 'click' | 'mark' | 'good' | 'bad' | 'ding' | 'complete' | 'win' | 'heart';
export type FxType = 'good' | 'danger' | 'complete' | 'win' | 'badge';

export interface Profile {
  name: string;
  best: number;
  runs: number;
  cleared: number;
  unlocked: Record<string, boolean>;
  ts: Record<string, { ok: number; n: number }>;
  badges: Record<string, number>;
  muted: boolean;
  fullClues: number;
  theme: Theme;
}

export interface RunStats {
  good: number;
  dec: number;
  fp: number;
  miss: number;
  clicks: number;
  creds: number;
  helps: number;
}

export interface ShiftStats {
  wrong: number;
  clicks: number;
}

export interface Snapshot {
  money: number;
  streak: number;
  stat: RunStats;
}

export interface Resolution {
  act: ResolutionAct;
  ok: boolean | null;
  pts: number;
  lines: Array<[string, number]>;
  heart?: boolean;
}

export interface Rank {
  id: string;
  t: string;
  d: string;
}

export interface RunState {
  shift: number;
  money: number;
  hearts: number;
  streak: number;
  it: number;
  order: number[];
  res: Record<number, Resolution>;
  marks: Record<number, string[]>;
  trap: Record<number, { clicked?: boolean }>;
  read: Record<number, boolean>;
  sel: number | null;
  details: boolean;
  over: boolean;
  stat: RunStats;
  sh: ShiftStats;
  snap: Snapshot;
  newBadges: string[];
  runBadges: string[];
  bonuses: Array<[string, number]> | null;
  bonusTot: number;
  acc: number;
  rank: Rank | null;
}

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

export interface SoundEvent {
  id: number;
  names: SfxName[];
}

export interface FxEvent {
  id: number;
  type: FxType;
}

export interface AppState {
  profile: Profile;
  run: RunState | null;
  view: View;
  archiveReturn: View | null;
  tab: Tab;
  confirmReset: boolean;
  toasts: Toast[];
  sound: SoundEvent | null;
  fx: FxEvent | null;
  seq: number;
}

export type Action =
  | { type: 'START' }
  | { type: 'PLAY' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SELECT'; id: number }
  | { type: 'TOGGLE_DETAILS' }
  | { type: 'TOGGLE_MARK'; key: string }
  | { type: 'DECIDE'; act: 'report' | 'ok' | 'it' }
  | { type: 'NEXT' }
  | { type: 'NEXT_SHIFT' }
  | { type: 'RETRY' }
  | { type: 'GO_TITLE' }
  | { type: 'ARCHIVE' }
  | { type: 'BACK_FROM_ARCHIVE' }
  | { type: 'TAB'; tab: Tab }
  | { type: 'RESET_PROGRESS' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'LINK_OPENED'; id: number }
  | { type: 'COMPROMISE'; id: number }
  | { type: 'TRAP_CLOSED' }
  | { type: 'TOAST'; message: string; tone?: ToastTone }
  | { type: 'DISMISS_TOAST'; id: number };
