import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Check, CheckCircle2, HelpCircle, X, XCircle } from 'lucide-react';
import type { Mail, Resolution } from '../game/model';
import { outcomeOf } from '../game/logic';
import { sg } from '../game/format';

interface FeedbackProps {
  mail: Mail;
  resolution: Resolution;
  marks: string[];
  trapPenalty?: boolean;
}

function OutcomeIcon({ tone }: { tone: 'good' | 'bad' | 'warn' | 'neu' }) {
  if (tone === 'good') return <CheckCircle2 size={24} />;
  if (tone === 'bad') return <XCircle size={24} />;
  if (tone === 'warn') return <AlertTriangle size={24} />;
  return <HelpCircle size={24} />;
}

export function Feedback({ mail, resolution, marks, trapPenalty }: FeedbackProps) {
  const reduced = useReducedMotion();
  const outcome = outcomeOf(mail, resolution);
  const clueKeys = Object.keys(mail.clues);
  const found = clueKeys.filter((key) => marks.includes(key));
  const fineMarks = marks.filter((key) => !mail.clues[key]).length;

  return (
    <motion.section
      className={`feedback feedback-${outcome.tone}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 130, damping: 20 }}
      role="status"
      aria-live="polite"
    >
      <div className="feedback-head">
        <span className="feedback-icon">
          <OutcomeIcon tone={outcome.tone} />
        </span>
        <div>
          <span className="feedback-kicker">Vyhodnocení zprávy</span>
          <h3>{outcome.title}</h3>
        </div>
        <span className="feedback-stamp">{outcome.stamp}</span>
      </div>

      <div className="feedback-body">
        <div className="feedback-why">
          <span className="feedback-label">Proč</span>
          <p>{mail.why}</p>
        </div>

        {trapPenalty && (
          <p className="feedback-extra">
            <AlertTriangle size={13} /> Otevření podezřelého odkazu tě stálo 500 Kč. Částka je už
            odečtená z kasy, proto není v součtu níže.
          </p>
        )}

        {clueKeys.length > 0 && (
          <div className="clue-review">
            <span className="feedback-label">Stopy, které rozhodovaly</span>
            <ul>
              {clueKeys.map((key) => {
                const hit = found.includes(key);
                return (
                  <li key={key} className={hit ? 'clue-hit' : 'clue-miss'}>
                    <span className="clue-check">{hit ? <Check size={13} /> : <X size={12} />}</span>
                    <span>{mail.clues[key]}</span>
                  </li>
                );
              })}
            </ul>
            {fineMarks > 0 && mail.phish && (
              <p className="fine-note">{fineMarks} označených míst bylo v pořádku.</p>
            )}
          </div>
        )}

        <div className="score-breakdown">
          <span className="feedback-label">Bodování</span>
          <div className="ledger">
            {resolution.lines.map(([label, value], index) => (
              <motion.div
                key={`${label}-${index}`}
                initial={reduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + index * 0.05 }}
              >
                <span>{label}</span>
                <b className={value >= 0 ? 'score-pos' : 'score-neg'}>{sg(value)}</b>
              </motion.div>
            ))}
            <div className="ledger-total">
              <span>Celkem</span>
              <b className={resolution.pts >= 0 ? 'score-pos' : 'score-neg'}>{sg(resolution.pts)}</b>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
