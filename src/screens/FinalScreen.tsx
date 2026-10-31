import { useRef, useState, type Dispatch } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  Crown,
  GraduationCap,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import type { Action, Profile, RunState } from '../game/model';
import { BADGE_BY_ID, BADGES, SHIFTS } from '../game/content';
import { kc, todayCz } from '../game/format';
import { rankOf } from '../game/logic';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface FinalScreenProps {
  run: RunState;
  profile: Profile;
  dispatch: Dispatch<Action>;
}

function RankIcon({ id }: { id: string }) {
  if (id === 'master') return <Crown size={36} />;
  if (id === 'hunter') return <Target size={36} />;
  if (id === 'guard') return <ShieldCheck size={36} />;
  return <GraduationCap size={36} />;
}

export function FinalScreen({ run, profile, dispatch }: FinalScreenProps) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const shareInput = useRef<HTMLTextAreaElement>(null);
  const rank = run.rank ?? rankOf(run.acc, run.stat);
  const name = profile.name || 'Lovec phishingu';
  const date = todayCz();
  const shareText = `Lovec phishingu: ${rank.t}, kasa ${kc(run.money)}, úspěšnost ${run.acc} %. Zvládneš to líp?`;
  const newBadges = run.runBadges.map((id) => BADGE_BY_ID[id]).filter(Boolean);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2300);
    } catch {
      shareInput.current?.focus();
      shareInput.current?.select();
      dispatch({
        type: 'TOAST',
        message: 'Automatické kopírování se nepovedlo. Text je označený, zkopíruj ho ručně.',
        tone: 'danger',
      });
    }
  };

  const share = async () => {
    if (!navigator.share) {
      void copy();
      return;
    }
    try {
      await navigator.share({ title: 'Lovec phishingu', text: shareText });
    } catch {
      /* Uživatel sdílení zrušil. */
    }
  };

  return (
    <section className="final-screen">
      <motion.div
        className="final-wrap"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
      >
        <div className="final-head">
          <div className="eyebrow">
            <span className="live-dot" /> Všech {SHIFTS.length} směn dokončeno
          </div>
          <h1>Certifikát je tvůj.</h1>
          <p>Prošel jsi celou simulací. Teď je čas podívat se, co sis odnesl.</p>
        </div>

        <div className="certificate">
          <span className="cert-corner cert-corner-tl" aria-hidden="true" />
          <span className="cert-corner cert-corner-tr" aria-hidden="true" />
          <span className="cert-corner cert-corner-bl" aria-hidden="true" />
          <span className="cert-corner cert-corner-br" aria-hidden="true" />
          <div className="cert-topline">
            <span>NOVATERM S.R.O.</span>
            <span>SECURITY AWARENESS PROGRAM</span>
          </div>
          <div className="cert-content">
            <span className="cert-kicker">Certifikát absolventa</span>
            <div className="cert-rank-icon">
              <RankIcon id={rank.id} />
            </div>
            <h2 className="cert-name">{name}</h2>
            <p className="cert-intro">úspěšně dokončil/a výukovou simulaci</p>
            <div className="cert-rank">{rank.t}</div>
            <p className="cert-desc">{rank.d}</p>

            <div className="cert-shifts" aria-label="Dokončené směny">
              {SHIFTS.map((shift) => (
                <span key={shift.day} className="cert-shift">
                  <Check size={12} /> {shift.day}
                </span>
              ))}
            </div>

            <div className="cert-bottom">
              <div className="cert-meta">
                <CalendarDays size={14} />
                <span>
                  <small>Datum</small>
                  <b>{date}</b>
                </span>
              </div>
              <div className="cert-seal">
                <span className="cert-seal-ring">
                  <ShieldCheck size={26} />
                </span>
                <span>
                  <b>NOVATERM</b>
                  <small>SECURITY AWARENESS</small>
                </span>
              </div>
              <div className="cert-meta is-right">
                <Award size={14} />
                <span>
                  <small>Úspěšnost</small>
                  <b>{run.acc} %</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="final-grid">
          <div className="final-stats">
            <div className="final-stat">
              <span className="final-stat-icon"><Trophy size={18} /></span>
              <div>
                <b><AnimatedNumber value={run.money} format={kc} /></b>
                <span>kasa firmy</span>
              </div>
            </div>
            <div className="final-stat">
              <span className="final-stat-icon"><Target size={18} /></span>
              <div>
                <b>{run.acc} %</b>
                <span>úspěšnost rozhodnutí</span>
              </div>
            </div>
            <div className="final-stat">
              <span className="final-stat-icon"><BadgeCheck size={18} /></span>
              <div>
                <b>{Object.keys(profile.badges).length}<small>/{BADGES.length}</small></b>
                <span>získaných odznaků</span>
              </div>
            </div>
            <div className="final-stat">
              <span className="final-stat-icon"><Sparkles size={18} /></span>
              <div>
                <b>{run.stat.fp}</b>
                <span>falešných poplachů</span>
              </div>
            </div>
            <div className="final-stat">
              <span className="final-stat-icon"><ShieldCheck size={18} /></span>
              <div>
                <b>{run.stat.clicks}</b>
                <span>otevřených pastí</span>
              </div>
            </div>
          </div>

          {newBadges.length > 0 && (
            <div className="final-badges">
              <span className="panel-kicker">Nové odznaky za tuto hru</span>
              <div className="final-badge-list">
                {newBadges.map((badge) => (
                  <span key={badge.id} className="final-badge">
                    <Award size={15} /> {badge.n}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="share-card">
            <div className="share-head">
              <span>
                <Share2 size={15} /> Tvůj výsledek ke sdílení
              </span>
              <span className="share-best">Nejlepší kasa: {kc(profile.best)}</span>
            </div>
            <div className="share-row">
              <textarea ref={shareInput} readOnly rows={2} value={shareText} aria-label="Text výsledku" />
              <button type="button" className="btn btn-ghost" onClick={copy}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Zkopírováno' : 'Kopírovat'}
              </button>
              <button type="button" className="btn btn-ghost share-native" onClick={share}>
                <Share2 size={16} /> Sdílet
              </button>
            </div>
          </div>
        </div>

        <div className="final-actions">
          <button type="button" className="btn btn-primary btn-xl" onClick={() => dispatch({ type: 'START' })}>
            <RotateCcw size={18} /> Hrát znovu
          </button>
          <button type="button" className="btn btn-ghost btn-xl" onClick={() => dispatch({ type: 'ARCHIVE' })}>
            <BookOpen size={18} /> Příručka a statistiky <ArrowRight size={17} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
