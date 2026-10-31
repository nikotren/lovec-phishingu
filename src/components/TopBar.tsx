import type { ReactNode } from 'react';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { BrandLockup } from './Brand';
import type { Theme } from '../game/model';

interface TopBarProps {
  theme: Theme;
  muted: boolean;
  onToggleTheme: () => void;
  onToggleMute: () => void;
  actions?: ReactNode;
  note?: string;
  noteTone?: 'default' | 'danger';
}

export function TopBar({
  theme,
  muted,
  onToggleTheme,
  onToggleMute,
  actions,
  note,
  noteTone = 'default',
}: TopBarProps) {
  return (
    <header className="topbar">
      <BrandLockup />
      <div className="topbar-right">
        {note && (
          <span className={`topbar-note ${noteTone === 'danger' ? 'is-danger' : ''}`}>
            <span className={`live-dot ${noteTone === 'danger' ? 'danger' : ''}`} /> {note}
          </span>
        )}
        {actions}
        <div className="topbar-tools">
          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
            aria-label={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onToggleMute}
            title={muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
            aria-label={muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
