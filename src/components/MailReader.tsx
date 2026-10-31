import { useEffect, useRef, type Dispatch } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flag,
  HelpCircle,
  MailOpen,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
} from 'lucide-react';
import type { Action, AuthStatus, Mail, RunState } from '../game/model';
import { authText, initials, initialsColor } from '../game/format';
import { markClassFor } from '../game/marks';
import { outcomeOf } from '../game/logic';
import type { PendingLink } from './MailBody';
import { MailBody } from './MailBody';
import { Feedback } from './Feedback';

interface MailReaderProps {
  run: RunState;
  mail: Mail | null;
  dispatch: Dispatch<Action>;
  onBack: () => void;
  onOpenLink: (pending: PendingLink) => void;
  onHoverUrl: (url: string | null) => void;
  onNext: () => void;
}

function AuthIcon({ auth }: { auth: AuthStatus }) {
  if (auth === 'pass') return <ShieldCheck size={15} />;
  if (auth === 'fail') return <ShieldAlert size={15} />;
  return <ShieldQuestion size={15} />;
}

export function MailReader({ run, mail, dispatch, onBack, onOpenLink, onHoverUrl, onNext }: MailReaderProps) {
  const reduced = useReducedMotion();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const resolution = mail ? run.res[mail.id] : undefined;
  const marks = mail ? (run.marks[mail.id] ?? []) : [];
  const previousResolution = useRef(resolution);
  const resolved = Boolean(resolution);
  const details = run.details;
  const isLast = Object.keys(run.res).length === run.order.length;

  useEffect(() => {
    const justResolved = !previousResolution.current && Boolean(resolution);
    previousResolution.current = resolution;
    if (!justResolved) return undefined;
    const timer = window.setTimeout(() => {
      const container = scrollRef.current;
      const feedback = feedbackRef.current;
      if (!container || !feedback) return;
      const offset = feedback.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 12;
      container.scrollTo({ top: offset, behavior: reduced ? 'auto' : 'smooth' });
    }, 260);
    return () => window.clearTimeout(timer);
  }, [resolution, reduced]);

  if (!mail) {
    return (
      <section className="reader reader-empty" aria-label="Čtení zprávy">
        <div className="empty-state">
          <span className="empty-icon">
            <MailOpen size={38} />
          </span>
          <h3>Vyber zprávu</h3>
          <p>Klikni na zprávu v doručené poště. Zkontroluj odesílatele, odkazy a přílohy, než se rozhodneš.</p>
        </div>
      </section>
    );
  }

  const outcome = resolution ? outcomeOf(mail, resolution) : null;
  const markClass = (key: string) => markClassFor(mail, marks, resolution, key);
  const messageIndex = run.order.indexOf(mail.id) + 1;
  const nextLabel = run.hearts <= 0 ? 'Konec směny' : isLast ? 'Uzavřít směnu' : 'Další zpráva';

  const toggleDetails = () => dispatch({ type: 'TOGGLE_DETAILS' });
  const mark = (key: string) => dispatch({ type: 'TOGGLE_MARK', key });

  return (
    <section className="reader" aria-label="Čtení zprávy">
      <div className="reader-head">
        <button type="button" className="icon-button reader-back" onClick={onBack} aria-label="Zpět na seznam">
          <ArrowLeft size={18} />
        </button>
        <div className="reader-subject">
          <span className="reader-kicker">
            Zpráva {messageIndex} / {run.order.length}
          </span>
          <h2>{mail.subj}</h2>
        </div>
        <span className="reader-time">
          <Clock3 size={14} /> dnes {mail.time}
        </span>
      </div>

      <div className="reader-scroll" ref={scrollRef}>
        <motion.article
          className="mail-sheet"
          key={mail.id}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sender-row">
            <span className="sender-avatar" style={{ background: initialsColor(mail.from.n) }}>
              {initials(mail.from.n)}
            </span>
            <div className="sender-copy">
              <button
                type="button"
                className="sender-name"
                onClick={toggleDetails}
                onMouseEnter={() => onHoverUrl(mail.from.a)}
                onMouseLeave={() => onHoverUrl(null)}
                aria-expanded={details}
                title="Zobrazit technické detaily"
              >
                {mail.from.n}
              </button>
              <span className="sender-meta">komu: vy@novaterm.cz · dnes {mail.time}</span>
            </div>
            <button type="button" className="details-toggle" onClick={toggleDetails} aria-expanded={details}>
              {details ? 'Skrýt detaily' : 'Technické detaily'}
              <ChevronDown size={15} className={details ? 'chevron-up' : ''} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {details && (
              <motion.div
                className="details-panel"
                initial={reduced ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
              >
                <div className="details-inner">
                  <button
                    type="button"
                    className={`details-row ${markClass('h_from')}`}
                    onClick={() => mark('h_from')}
                    disabled={resolved}
                    title="Označit adresu jako stopu"
                  >
                    <span className="details-label">Od</span>
                    <code>{mail.from.a}</code>
                    {!resolved && <span className="details-action-pill">označit</span>}
                  </button>
                  {mail.reply && (
                    <button
                      type="button"
                      className={`details-row ${markClass('h_reply')}`}
                      onClick={() => mark('h_reply')}
                      disabled={resolved}
                      title="Označit adresu pro odpověď jako stopu"
                    >
                      <span className="details-label">Odpovědi na</span>
                      <code>{mail.reply}</code>
                      {!resolved && <span className="details-action-pill">označit</span>}
                    </button>
                  )}
                  <button
                    type="button"
                    className={`details-row details-auth ${markClass('h_auth')}`}
                    onClick={() => mark('h_auth')}
                    disabled={resolved}
                    title="Označit výsledek ověření jako stopu"
                  >
                    <span className="details-label">Ověření</span>
                    <span className={`auth-badge auth-${mail.auth}`}>
                      <AuthIcon auth={mail.auth} />
                      {authText(mail.auth)}
                    </span>
                    {!resolved && <span className="details-action-pill">označit</span>}
                  </button>
                  {!resolved && (
                    <div className="details-hint">
                      <ScanLine size={13} /> Klikni na řádek, který ti nesedí. Stopy zvyšují bonus za správné
                      nahlášení.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <MailBody
            mail={mail}
            marks={marks}
            resolution={resolution}
            onMark={mark}
            onOpenLink={onOpenLink}
            onHoverUrl={onHoverUrl}
          />

          <div className="mail-sheet-end">
            <span>
              <ShieldCheck size={13} /> Cvičná zpráva · data zůstávají v prohlížeči
            </span>
            <span>Konec zprávy</span>
          </div>

          <AnimatePresence>
            {resolution && outcome && (
              <motion.span
                className={`result-stamp result-${outcome.tone}`}
                initial={reduced ? false : { opacity: 0, scale: 2.2, rotate: -9 }}
                animate={{ opacity: 1, scale: 1, rotate: 7 }}
                transition={{ type: 'spring', stiffness: 230, damping: 16 }}
                aria-hidden="true"
              >
                {outcome.stamp}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.article>

        {resolution && (
          <div ref={feedbackRef}>
            <Feedback
              mail={mail}
              resolution={resolution}
              marks={marks}
              trapPenalty={Boolean(mail.phish && mail.trap && run.trap[mail.id]?.clicked)}
            />
          </div>
        )}
      </div>

      <div className={`reader-actionbar ${resolved ? 'is-resolved' : ''}`}>
        {!resolved ? (
          <>
            <div className="mark-hint">
              <span className="mark-hint-icon">
                <ScanLine size={16} />
              </span>
              <span>
                Označ podezřelá místa. <b>Zatím {marks.length} stop.</b>
                <small>Bonus 50 Kč za každou správnou stopu.</small>
              </span>
              <span className="shortcut-hint">
                <kbd>R</kbd> nahlásit <kbd>O</kbd> v pořádku <kbd>I</kbd> IT
              </span>
            </div>
            <div className="decision-row">
              <button type="button" className="btn btn-danger decision-btn" onClick={() => dispatch({ type: 'DECIDE', act: 'report' })}>
                <Flag size={18} />
                <span>Nahlásit phishing</span>
                <kbd>R</kbd>
              </button>
              <button type="button" className="btn btn-success decision-btn" onClick={() => dispatch({ type: 'DECIDE', act: 'ok' })}>
                <CheckCircle2 size={18} />
                <span>Je v pořádku</span>
                <kbd>O</kbd>
              </button>
              <button
                type="button"
                className="btn btn-ghost decision-btn it-btn"
                onClick={() => dispatch({ type: 'DECIDE', act: 'it' })}
                disabled={run.it === 0}
                title="Zeptat se IT (stojí 250 Kč)"
              >
                <HelpCircle size={18} />
                <span>Zeptat se IT</span>
                <small>−250 Kč · {run.it}×</small>
                <kbd>I</kbd>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="resolved-summary">
              <span className={`resolved-pill resolved-${outcome?.tone ?? 'neu'}`}>
                <Sparkles size={14} /> {outcome?.stamp}
              </span>
              <span>
                {run.hearts <= 0
                  ? 'Důvěra firmy klesla na nulu. Směna končí.'
                  : 'Zpráva je vyhodnocená. Projdi si stopy a pokračuj.'}
              </span>
            </div>
            <button type="button" className="btn btn-primary decision-btn" onClick={onNext}>
              {nextLabel} <ArrowRight size={17} /> <kbd>N</kbd>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
