import { useRef, type Dispatch } from 'react';
import {
  Flame,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wallet,
  Zap,
} from 'lucide-react';
import type { Action, Profile, RunState } from '../game/model';
import { SHIFTS } from '../game/content';
import { countRun, formatMultiplier } from '../game/logic';
import { kc } from '../game/format';
import { AnimatedNumber } from './AnimatedNumber';
import { LogoMark } from './Brand';

interface HudProps {
  run: RunState;
  profile: Profile;
  dispatch: Dispatch<Action>;
  onHelp: () => void;
  onQuit: () => void;
}

function HeartMeter({ hearts }: { hearts: number }) {
  const previous = useRef(hearts);
  const lostIndex = hearts < previous.current ? hearts : -1;
  previous.current = hearts;

  return (
    <span className="heart-meter" aria-label={`Životy důvěry: ${hearts} ze 3`}>
      {[0, 1, 2].map((index) => {
        const isLost = index === lostIndex;
        return (
          <span
            key={`${index}-${isLost ? 'lost' : 'idle'}`}
            className={`heart ${index < hearts ? 'is-on' : 'is-off'} ${isLost ? 'is-lost' : ''}`}
          >
            <Heart size={17} />
          </span>
        );
      })}
    </span>
  );
}

export function Hud({ run, profile, dispatch, onHelp, onQuit }: HudProps) {
  const shift = SHIFTS[run.shift];
  const { resolved, remaining } = countRun(run);
  const progress = run.order.length ? Math.min(100, (resolved / run.order.length) * 100) : 0;

  return (
    <header className="game-hud">
      <div className="hud-brand">
        <LogoMark size={34} />
        <div className="hud-brand-copy">
          <span className="hud-brand-name">
            Novaterm Mail <span className="hud-secure"><Mail size={11} /> secure</span>
          </span>
          <span className="hud-brand-sub">
            Směna {run.shift + 1}/{SHIFTS.length} · {shift.day} · {shift.t.split(':')[0]}
          </span>
        </div>
      </div>

      <div className="hud-mission">
        <div className="hud-mission-line">
          <span>
            Zpracováno <b>{resolved}</b> / {run.order.length}
          </span>
          <span className="hud-remaining">{remaining} zbývá</span>
        </div>
        <div className="hud-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="hud-stats">
        <span className="hud-chip hud-money" title="Kasa firmy">
          <Wallet size={15} />
          <AnimatedNumber value={run.money} format={kc} />
        </span>
        <span className={`hud-chip hud-streak ${run.streak > 0 ? 'is-hot' : ''}`} title="Série správných rozhodnutí">
          <Flame size={15} />
          <b>×{formatMultiplier(run.streak)}</b>
        </span>
        <span className={`hud-chip hud-it ${run.it === 0 ? 'is-empty' : ''}`} title="Zbývající dotazy na IT">
          <Zap size={15} /> {run.it}× <small>IT</small>
        </span>
        <HeartMeter hearts={run.hearts} />
      </div>

      <div className="hud-tools">
        <button type="button" className="icon-button hud-tool" onClick={onHelp} title="Jak hrát" aria-label="Jak hrát">
          <HelpCircle size={17} />
        </button>
        <button
          type="button"
          className="icon-button hud-tool"
          onClick={() => dispatch({ type: 'SET_THEME', theme: profile.theme === 'dark' ? 'light' : 'dark' })}
          title={profile.theme === 'dark' ? 'Světlý režim' : 'Tmavý režim'}
          aria-label={profile.theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
        >
          {profile.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          type="button"
          className="icon-button hud-tool"
          onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
          title={profile.muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
          aria-label={profile.muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
        >
          {profile.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
        <button
          type="button"
          className="icon-button hud-tool hud-quit"
          onClick={onQuit}
          title="Ukončit hru"
          aria-label="Ukončit hru"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
