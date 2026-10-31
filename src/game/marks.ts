import type { Mail, Resolution } from './model';

export type MarkState = '' | 'on' | 'hit' | 'miss' | 'fine';

export function markStateFor(
  mail: Mail,
  marks: string[],
  resolution: Resolution | undefined,
  key: string,
): MarkState {
  const marked = marks.includes(key);
  const isClue = Boolean(mail.clues[key]);
  if (!resolution) return marked ? 'on' : '';
  return isClue ? (marked ? 'hit' : 'miss') : marked ? 'fine' : '';
}

export function markClassFor(
  mail: Mail,
  marks: string[],
  resolution: Resolution | undefined,
  key: string,
): string {
  const state = markStateFor(mail, marks, resolution, key);
  return state ? `mk-${state}` : '';
}
