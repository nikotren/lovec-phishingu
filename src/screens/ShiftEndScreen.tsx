import type { Dispatch } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Heart,
  HelpCircle,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import type { Action, Mail, Resolution, RunState } from '../game/model';
import { BADGE_BY_ID, BY_ID, SHIFTS } from '../game/content';
import { accOf, outcomeOf } from '../game/logic';
import { sg } from '../game/format';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface ShiftEndScreenProps {
  run: RunState;
  dispatch: Dispatch<Action>;
}

function OutcomeRow({ mail, resolution }: { mail: Mail; resolution: Resolution }) {
  const outcome = outcomeOf(mail, resolution);
  const Icon = outcome.tone === 'good' ? CheckCircle2 : outcome.tone === 'bad' ? XCircle : outcome.tone === 'warn' ? AlertTriangle : HelpCircle;
  return (
    <li className={`shift-outcome outcome-${outcome.tone}`}>
      <span className="shift-outcome-badge">
        <Icon size={14} /> {outcome.stamp}
      </span>
      <div>
        <b>{mail.subj}</b>
        <p>{mail.why}</p>
      </div>
    </li>
  );
}

export function ShiftEndScreen({ run, dispatch }: ShiftEndScreenProps) {
  const reduced = useReducedMotion();
  const shift = SHIFTS[run.shift];
  const good = run.order.filter((id) => run.res[id]?.ok).length;
  const perfect = run.sh.wrong === 0 && run.sh.clicks === 0;
  const newBadges = run.newBadges.map((id) => BADGE_BY_ID[id]).filter(Boolean);
  const isLast = run.shift >= SHIFTS.length - 1;

  return (
    <section className="shift-end-screen">
      <motion.div
        className="glass-card shift-end-card"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="shift-end-head">
          <div>
            <div className="eyebrow">
              <span className="live-dot" /> Směna {run.shift + 1} z {SHIFTS.length} hotová
            </div>
            <h1>{perfect ? 'Čistá práce.' : 'Směna za tebou.'}</h1>
            <p>
              {perfect
                ? 'Ani jedna chyba, ani jedno zbytečné kliknutí. Přesně tak vypadá klidný den v bezpečnostním týmu.'
                : `Zvládl jsi ${good} z ${run.order.length} zpráv bez chyby. Každá stopa, kterou sis zapamatoval, se počítá.`}
            </p>
          </div>
          <div className={`shift-seal ${perfect ? 'is-perfect' : ''}`}>
            <span>{perfect ? <BadgeCheck size={30} /> : <Award size={30} />}</span>
            <b>{perfect ? 'CLEAN' : shift.day}</b>
            <small>směna {run.shift + 1}</small>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-icon"><Target size={17} /></span>
            <b>{good}<small>/{run.order.length}</small></b>
            <span>správných rozhodnutí</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><CircleDollarSign size={17} /></span>
            <b><AnimatedNumber value={run.money} format={(value) => value.toLocaleString('cs-CZ')} /></b>
            <span>kasa firmy · Kč</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><Heart size={17} /></span>
            <b>{run.hearts}<small>/3</small></b>
            <span>zbývající důvěra</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><TrendingUp size={17} /></span>
            <b>{accOf(run.stat)}<small> %</small></b>
            <span>úspěšnost celkem</span>
          </div>
        </div>

        <div className="shift-score-row">
          <div className="bonus-panel">
            <div className="mini-panel-head">
              <span>Bonusy směny</span>
              <b className="score-pos">{sg(run.bonusTot)}</b>
            </div>
            {run.bonuses && run.bonuses.length > 0 ? (
              <div className="bonus-list">
                {run.bonuses.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <b className="score-pos">{sg(value)}</b>
                  </div>
                ))}
                <div className="bonus-total">
                  <span>Zisk směny celkem</span>
                  <b className={run.money - run.snap.money >= 0 ? 'score-pos' : 'score-neg'}>
                    {sg(run.money - run.snap.money)}
                  </b>
                </div>
              </div>
            ) : (
              <p className="bonus-empty">Tentokrát bez bonusu. Příště to vyjde.</p>
            )}
          </div>

          <div className="badge-panel">
            <div className="mini-panel-head">
              <span>Nové odznaky</span>
              <b>{newBadges.length}</b>
            </div>
            {newBadges.length > 0 ? (
              <div className="new-badge-list">
                {newBadges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    className="new-badge"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="new-badge-icon"><Sparkles size={15} /></span>
                    <div>
                      <b>{badge.n}</b>
                      <span>{badge.d}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="bonus-empty">Žádný nový odznak. Archiv už nějaké má.</p>
            )}
          </div>
        </div>

        <div className="shift-outcomes">
          <span className="panel-kicker">Co se dnes stalo</span>
          <ul>
            {run.order.map((id) => {
              const mail = BY_ID[id];
              const resolution = run.res[id];
              return resolution ? <OutcomeRow key={id} mail={mail} resolution={resolution} /> : null;
            })}
          </ul>
        </div>

        <div className="shift-end-actions">
          <div className="shift-end-note">
            {isLast ? (
              <>
                <Sparkles size={16} /> Všechny směny dokončeny. Čeká tě certifikát.
              </>
            ) : (
              <>
                <Target size={16} /> Další směna tě posune blíž k certifikátu.
              </>
            )}
          </div>
          <button type="button" className="btn btn-primary btn-xl" onClick={() => dispatch({ type: 'NEXT_SHIFT' })}>
            {isLast ? 'Převzít certifikát' : 'Další směna'} <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
