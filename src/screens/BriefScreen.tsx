import type { Dispatch } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  Heart,
  Lightbulb,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { Action, RunState } from '../game/model';
import { SCORING, SHIFTS } from '../game/content';

interface BriefScreenProps {
  run: RunState;
  dispatch: Dispatch<Action>;
}

export function DayTimeline({ shift }: { shift: number }) {
  return (
    <div className="day-timeline" aria-label={`Směna ${shift + 1} z ${SHIFTS.length}`}>
      {SHIFTS.map((day, index) => {
        const state = index < shift ? 'done' : index === shift ? 'current' : 'upcoming';
        return (
          <div key={day.day} className={`day-node ${state}`}>
            <span className="day-dot">
              {state === 'done' ? <Check size={14} /> : state === 'current' ? <span>{index + 1}</span> : <span>{index + 1}</span>}
            </span>
            <span className="day-label">
              <b>{day.day}</b>
              <small>{state === 'done' ? 'hotovo' : state === 'current' ? 'dnes' : 'čeká'}</small>
            </span>
            {index < SHIFTS.length - 1 && <span className="day-line" />}
          </div>
        );
      })}
    </div>
  );
}

export function BriefScreen({ run, dispatch }: BriefScreenProps) {
  const reduced = useReducedMotion();
  const shift = SHIFTS[run.shift];
  const number = run.shift + 1;

  return (
    <section className="brief-screen">
      <motion.div
        className="glass-card brief-card"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <DayTimeline shift={run.shift} />

        <div className="brief-grid">
          <motion.div
            className="brief-main"
            initial={reduced ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 110, damping: 20 }}
          >
            <div className="eyebrow">
              <span className="live-dot" /> Směna {number} z {SHIFTS.length} · briefing
            </div>
            <h1 className="brief-title">{shift.t}</h1>
            <p className="brief-sub">{shift.sub}</p>

            <div className="intel-card">
              <span className="intel-icon">
                <Lightbulb size={20} />
              </span>
              <div>
                <b>Tip na dnešek</b>
                <p>{shift.tip}</p>
              </div>
            </div>

            <div className="brief-chips">
              <span className="meta-chip">
                <Mail size={15} /> {shift.mails.length} zpráv
              </span>
              <span className="meta-chip">
                <Heart size={15} /> 3 životy
              </span>
              <span className="meta-chip">
                <Zap size={15} /> 2× pomoc IT
              </span>
              <span className="meta-chip">
                <Clock3 size={15} /> bez časového limitu
              </span>
            </div>

            <div className="brief-objectives">
              <span className="panel-kicker">Cíl směny</span>
              <div className="objective-grid">
                <span>
                  <Mail size={14} /> Vyřídit všech {shift.mails.length} zpráv
                </span>
                <span>
                  <Heart size={14} /> Udržet alespoň jeden život
                </span>
                <span>
                  <Sparkles size={14} /> Posbírat stopy u phishingů
                </span>
              </div>
            </div>

            <div className="brief-cta-row">
              <button type="button" className="btn btn-primary btn-xl" onClick={() => dispatch({ type: 'PLAY' })}>
                Otevřít schránku <ArrowRight size={19} />
              </button>
              <span className="brief-cta-note">
                <CalendarDays size={15} /> {shift.mails.length} zpráv připraveno
              </span>
            </div>
          </motion.div>

          <motion.aside
            className="scoring-panel"
            initial={reduced ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, type: 'spring', stiffness: 110, damping: 20 }}
          >
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Ekonomika směny</span>
                <h2>Bodování</h2>
              </div>
              <span className="panel-icon">
                <CircleDollarSign size={20} />
              </span>
            </div>

            <ul className="scoring-list">
              {SCORING.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <b className={row.tone === 'pos' ? 'score-pos' : 'score-neg'}>{row.value}</b>
                </li>
              ))}
            </ul>

            <div className="trust-note">
              <span className="trust-note-icon">
                <Heart size={17} />
              </span>
              <p>
                Máš <b>tři životy důvěry</b>. Pokud o všechny přijdeš, směnu opakuješ. Falešný poplach
                stojí peníze, ale ne život.
              </p>
            </div>

            <div className="scoring-footnote">
              <ShieldCheck size={14} /> Žádná zpráva není časovaná. Můžeš si dát na čas.
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}
