import { Flag, Inbox, LockKeyhole, Mail, Send, Trash2, UserRound } from 'lucide-react';
import type { Profile, RunState } from '../game/model';
import { SHIFTS } from '../game/content';
import { countRun } from '../game/logic';

interface RailProps {
  run: RunState;
  profile: Profile;
}

export function Rail({ run, profile }: RailProps) {
  const { reported, remaining } = countRun(run);
  const shift = SHIFTS[run.shift];

  return (
    <aside className="game-rail" aria-label="Složky a stav hráče">
      <div className="rail-brand">
        <span className="rail-brand-mark">
          <Mail size={15} />
        </span>
        <span>
          NOVATERM
          <small>MAIL CLIENT</small>
        </span>
      </div>

      <nav className="rail-nav" aria-label="Složky">
        <div className="rail-item is-active" aria-current="page">
          <Inbox size={17} />
          <span>Doručená pošta</span>
          <em>{remaining}</em>
        </div>
        <div className="rail-item" title="V této hře slouží jen jako přehled">
          <Flag size={17} />
          <span>Nahlášené</span>
          <em>{reported}</em>
        </div>
        <div className="rail-item is-muted" title="V této hře není potřeba">
          <Send size={17} />
          <span>Odeslaná pošta</span>
        </div>
        <div className="rail-item is-muted" title="V této hře není potřeba">
          <Trash2 size={17} />
          <span>Koš</span>
        </div>
      </nav>

      <div className="rail-divider" />

      <div className="rail-shift">
        <span className="rail-kicker">Aktuální směna</span>
        <b>
          Den {run.shift + 1} / {SHIFTS.length}
        </b>
        <span className="rail-day">{shift.day} · {shift.t.split(':')[0]}</span>
        <div className="rail-days" aria-hidden="true">
          {SHIFTS.map((_, index) => (
            <i key={index} className={index < run.shift ? 'done' : index === run.shift ? 'on' : ''} />
          ))}
        </div>
      </div>

      <div className="rail-user">
        <span className="rail-user-avatar">
          <UserRound size={17} />
        </span>
        <span className="rail-user-copy">
          <b>{profile.name || 'Nový lovec'}</b>
          <small>vy@novaterm.cz</small>
        </span>
      </div>
      <div className="rail-secure">
        <LockKeyhole size={12} /> Šifrovaná cvičná schránka
      </div>
    </aside>
  );
}
