import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Flag, Inbox, MailOpen, XCircle } from 'lucide-react';
import type { RunState } from '../game/model';
import { BY_ID } from '../game/content';
import { countRun } from '../game/logic';
import { initials, initialsColor } from '../game/format';

interface MailListProps {
  run: RunState;
  onSelect: (id: number) => void;
  onFinish: () => void;
}

function StatusPill({ run, id }: { run: RunState; id: number }) {
  const resolution = run.res[id];
  if (!resolution) return null;

  if (resolution.act === 'comp') {
    return (
      <span className="mail-status status-bad">
        <XCircle size={11} /> Napadeno
      </span>
    );
  }
  if (resolution.act === 'it') {
    return <span className="mail-status status-neutral">IT</span>;
  }
  const good = resolution.ok;
  return (
    <span className={`mail-status ${good ? 'status-good' : 'status-bad'}`}>
      {good ? <CheckCircle2 size={11} /> : <Flag size={11} />}
      {resolution.act === 'report' ? 'Nahlášeno' : 'Ponecháno'}
    </span>
  );
}

export function MailList({ run, onSelect, onFinish }: MailListProps) {
  const reduced = useReducedMotion();
  const { remaining } = countRun(run);

  return (
    <section className="mail-list" aria-label="Doručená pošta">
      <div className="list-head">
        <div>
          <span className="list-kicker">
            <Inbox size={14} /> Schránka
          </span>
          <h2>Doručená pošta</h2>
        </div>
        <span className="list-count">{remaining}</span>
      </div>
      <div className="list-day">
        <span>Dnes</span>
        <span className="list-day-line" />
      </div>

      <div className="mail-items">
        {run.order.map((id, index) => {
          const mail = BY_ID[id];
          const selected = run.sel === id;
          const unread = !run.read[id];
          const resolution = run.res[id];
          return (
            <motion.button
              key={id}
              type="button"
              className={`mail-item ${selected ? 'is-selected' : ''} ${unread ? 'is-unread' : ''} ${
                resolution ? 'is-done' : ''
              }`}
              onClick={() => onSelect(id)}
              aria-current={selected ? 'true' : undefined}
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.035, 0.2), duration: 0.25 }}
            >
              <span className="mail-avatar" style={{ background: initialsColor(mail.from.n) }}>
                {initials(mail.from.n)}
                {unread && <span className="unread-dot" aria-label="Nepřečteno" />}
              </span>
              <span className="mail-item-copy">
                <span className="mail-item-top">
                  <b>{mail.from.n}</b>
                  <time>{mail.time}</time>
                </span>
                <span className="mail-item-subject">{mail.subj}</span>
                <span className="mail-item-footer">
                  <StatusPill run={run} id={id} />
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="list-foot">
        {remaining === 0 ? (
          <>
            <span className="list-complete">
              <CheckCircle2 size={15} /> Všechno vyřízeno
            </span>
            <button type="button" className="list-finish" onClick={onFinish}>
              {run.hearts <= 0 ? 'Konec směny' : 'Uzavřít směnu'}
            </button>
          </>
        ) : (
          <span>
            <MailOpen size={14} /> {remaining} zpráv čeká na rozhodnutí
          </span>
        )}
      </div>
    </section>
  );
}
