import type { SfxName } from './model';

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!context) context = new Ctor();
    return context;
  } catch {
    return null;
  }
}

export function unlockAudio(): void {
  try {
    const audio = getContext();
    if (!audio) return;
    if (audio.state === 'suspended') void audio.resume();
  } catch {
    /* Zvuk není dostupný — nevadí. */
  }
}

function tone(frequency: number, duration = 0.12, type: OscillatorType = 'sine', volume = 0.05, delay = 0): void {
  const audio = getContext();
  if (!audio) return;
  try {
    if (audio.state === 'suspended') void audio.resume();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(audio.destination);
    const start = audio.currentTime + delay;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  } catch {
    /* Zvuk není dostupný — nevadí. */
  }
}

const sounds: Record<SfxName, () => void> = {
  click: () => tone(440, 0.05, 'square', 0.012),
  mark: () => tone(560, 0.07, 'triangle', 0.045),
  good: () => {
    tone(660, 0.1, 'sine', 0.055);
    tone(880, 0.18, 'sine', 0.05, 0.09);
  },
  bad: () => {
    tone(190, 0.28, 'sawtooth', 0.032);
    tone(140, 0.3, 'sawtooth', 0.032, 0.14);
  },
  ding: () => {
    tone(520, 0.12, 'triangle', 0.04);
    tone(700, 0.15, 'triangle', 0.04, 0.1);
  },
  complete: () => {
    [523, 659, 784, 1046].forEach((frequency, index) => tone(frequency, 0.22, 'sine', 0.045, index * 0.09));
  },
  win: () => {
    [392, 523, 659, 784, 1046, 1318].forEach((frequency, index) =>
      tone(frequency, 0.28, 'triangle', 0.04, index * 0.1),
    );
  },
  heart: () => {
    tone(180, 0.2, 'sawtooth', 0.035);
    tone(110, 0.32, 'sine', 0.045, 0.08);
  },
};

export function playSfx(name: SfxName, muted: boolean): void {
  if (muted) return;
  sounds[name]();
}
