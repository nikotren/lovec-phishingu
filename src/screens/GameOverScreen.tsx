import type { Dispatch } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, ArrowRight, HeartCrack, Home, RefreshCw, ShieldAlert, XCircle } from 'lucide-react';
import type { Action, Mail, Resolution, RunState } from '../game/model';
import { BY_ID, SHIFTS } from '../game/content';
import { outcomeOf } from '../game/logic';

interface GameOverScreenProps {
  run: RunState;
  dispatch: Dispatch<Action>;
}

function FailureRow({ mail, resolution }: { mail: Mail; resolution: Resolution }) {
  const outcome = outcomeOf(mail, resolution);
  return (
    <li>
      <span className={`failure-badge failure-${outcome.tone}`}>
        <XCircle size={13} /> {outcome.stamp}
      </span>
      <div>
        <b>{mail.subj}</b>
        <p>{mail.why}</p>
      </div>
    </li>
  );
}

export function GameOverScreen({ run, dispatch }: GameOverScreenProps) {
  const reduced = useReducedMotion();
  const shift = SHIFTS[run.shift];
  const failures = run.order
    .filter((id) => run.res[id] && !run.res[id].ok && run.res[id].act !== 'it')
    .map((id) => ({ mail: BY_ID[id], resolution: run.res[id] }));

  return (
    <section className="over-screen">
      <motion.div
        className="glass-card over-card"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="over-hero">
          <div className="over-icon-wrap">
            <HeartCrack size={34} />
          </div>
          <div>
            <div className="eyebrow eyebrow-danger">
              <span className="live-dot danger" /> Směna {run.shift + 1} přerušena · {shift.day}
            </div>
            <h1>Vedení ti dnes důvěru nedalo.</h1>
            <p>
              Došly ti životy důvěry. V reálném světě by to znamenalo napadenou firmu. Tady si můžeš směnu
              zkusit znovu — tentokrát bez spěchu.
            </p>
          </div>
          <div className="over-trust">
            <span>DŮVĚRA</span>
            <b>0<span>/3</span></b>
          </div>
        </div>

        <div className="over-stats">
          <div>
            <ShieldAlert size={17} />
            <b>{failures.length}</b>
            <span>selhaných rozhodnutí</span>
          </div>
          <div>
            <AlertTriangle size={17} />
            <b>{run.stat.clicks}</b>
            <span>otevřených pastí</span>
          </div>
          <div>
            <HeartCrack size={17} />
            <b>{run.money.toLocaleString('cs-CZ')} Kč</b>
            <span>stav kasy</span>
          </div>
        </div>

        {failures.length > 0 && (
          <div className="over-failures">
            <span className="panel-kicker">Kde se to zvrtlo</span>
            <ul>
              {failures.map(({ mail, resolution }) => (
                <FailureRow key={mail.id} mail={mail} resolution={resolution} />
              ))}
            </ul>
          </div>
        )}

        <div className="over-tip">
          <span className="over-tip-icon"><ShieldAlert size={18} /></span>
          <p>
            <b>Zapamatuj si:</b> Útočník tě vždy tlačí k rychlosti. Zpomal, podívej se na celou doménu
            a u plateb nebo hesel ověřuj jinou cestou.
          </p>
        </div>

        <div className="over-actions">
          <button type="button" className="btn btn-primary btn-xl" onClick={() => dispatch({ type: 'RETRY' })}>
            <RefreshCw size={18} /> Opakovat směnu
          </button>
          <button type="button" className="btn btn-ghost btn-xl" onClick={() => dispatch({ type: 'GO_TITLE' })}>
            <Home size={18} /> Do menu
          </button>
          <span className="over-shortcut">
            <ArrowRight size={14} /> Příručka zůstává odemčená
          </span>
        </div>
      </motion.div>
    </section>
  );
}
