import type { Dispatch } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Link2,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
} from 'lucide-react';
import type { Action, Profile } from '../game/model';
import { kc } from '../game/format';
import { BADGES, MAILS, SHIFTS, TYPES } from '../game/content';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface TitleScreenProps {
  profile: Profile;
  dispatch: Dispatch<Action>;
  onArchive: () => void;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 130, damping: 20 } },
};

export function TitleScreen({ profile, dispatch, onArchive }: TitleScreenProps) {
  const reduced = useReducedMotion();

  const unlocked = Object.keys(profile.unlocked).length;
  const badges = Object.keys(profile.badges).length;
  const threatCount = MAILS.filter((mail) => mail.phish).length;

  const start = () => dispatch({ type: 'START' });

  return (
    <section className="title-screen">
      <div className="title-grid">
        <motion.div className="title-copy" variants={container} initial="hidden" animate="show">
          <motion.div className="eyebrow-row" variants={item}>
            <span className="eyebrow">
              <span className="live-dot" /> Interaktivní bezpečnostní simulace
            </span>
            <span className="eyebrow-sep">/</span>
            <span className="eyebrow-muted">Novaterm s.r.o.</span>
          </motion.div>

          <motion.h1 className="title-display" variants={item}>
            <span className="title-line">Lovec</span>
            <span className="title-line title-accent">
              phishingu
              <svg className="title-scribble" viewBox="0 0 360 22" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 15c68-8 133-11 193-8 44 2 92 7 158 2" />
              </svg>
            </span>
          </motion.h1>

          <motion.p className="title-lead" variants={item}>
            Nastupuješ do firmy <strong>Novaterm</strong>. Pět směn, třicet e-mailů a parta podvodníků mezi nimi.
            Rozhoduj, co nahlásit, co nechat být a kdy si zavolat o pomoc.
          </motion.p>

          <motion.form
            className="name-form"
            variants={item}
            onSubmit={(event) => {
              event.preventDefault();
              start();
            }}
          >
            <label className="field-label" htmlFor="player-name">
              Jméno na certifikát
            </label>
            <div className="name-row">
              <div className="input-shell">
                <UserRound size={18} />
                <input
                  id="player-name"
                  type="text"
                  maxLength={28}
                  placeholder="Tvoje jméno"
                  autoComplete="off"
                  value={profile.name}
                  onChange={(event) => dispatch({ type: 'SET_NAME', name: event.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-xl start-button">
                <span className="start-button-icon">
                  <Target size={20} />
                </span>
                <span className="start-button-copy">
                  <b>Spustit hru</b>
                  <small>Směna 1 z 5</small>
                </span>
                <ArrowRight size={20} className="start-arrow" />
              </button>
            </div>
            <p className="form-note">
              Bez registrace. Postup se ukládá jen do tohoto prohlížeče.
              {profile.runs > 0 && <> Vítej zpět, {profile.name || 'lovče'}.</>}
            </p>
          </motion.form>

          <motion.div className="title-actions" variants={item}>
            <button type="button" className="text-link" onClick={onArchive}>
              <BookOpen size={16} />
              Prohlédnout příručku a odznaky
            </button>
            <span className="title-actions-divider" />
            <span className="micro-note">
              <LockKeyhole size={14} /> Žádná data neopouštějí prohlížeč
            </span>
          </motion.div>

          <motion.ol className="how-steps" variants={item}>
            <li>
              <span className="step-number">01</span>
              <span>
                <b>Prozkoumej zprávu</b>
                <small>Odesílatel, doména, odkazy, přílohy a technické detaily.</small>
              </span>
            </li>
            <li>
              <span className="step-number">02</span>
              <span>
                <b>Označ stopy</b>
                <small>Každé správné podezření přidá do kasy 50 Kč.</small>
              </span>
            </li>
            <li>
              <span className="step-number">03</span>
              <span>
                <b>Rozhodni</b>
                <small>Nahlásit, ponechat, nebo se zeptat IT. Rychlost není cíl.</small>
              </span>
            </li>
          </motion.ol>

          <motion.div className="title-stats" variants={item}>
            <div className="mini-stat">
              <span className="mini-stat-icon">
                <Trophy size={16} />
              </span>
              <div>
                <b>{profile.runs || '—'}</b>
                <span>dokončených her</span>
              </div>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-icon">
                <BarChart3 size={16} />
              </span>
              <div>
                <b>{profile.runs ? <AnimatedNumber value={profile.best} format={kc} /> : '—'}</b>
                <span>nejlepší kasa</span>
              </div>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-icon">
                <BookOpen size={16} />
              </span>
              <div>
                <b>
                  {unlocked}/{Object.keys(TYPES).length}
                </b>
                <span>kapitol příručky</span>
              </div>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-icon">
                <Sparkles size={16} />
              </span>
              <div>
                <b>
                  {badges}/{BADGES.length}
                </b>
                <span>získaných odznaků</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="title-visual"
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.18 }}
        >
          <div className="floating-stack">
            <motion.div
              className="mail-slot mail-slot-1"
              initial={reduced ? false : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.32 }}
            >
              <article className="preview-mail">
                <div className="preview-mail-head">
                  <span className="preview-avatar">PH</span>
                  <div>
                    <b>Podpora Hyper365</b>
                    <span>support@hyper365-helpdesk.xyz</span>
                  </div>
                  <time>07:42</time>
                </div>
                <h3>Vaše heslo vyprší za 24 hodin</h3>
                <p>Z bezpečnostních důvodů musíte heslo obnovit do 24 hodin.</p>
                <span className="preview-link">
                  <Link2 size={12} /> login.hyper365-helpdesk.xyz/obnova
                </span>
                <span className="preview-stamp stamp-danger">PHISHING</span>
              </article>
            </motion.div>

            <motion.div
              className="mail-slot mail-slot-2"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.42 }}
            >
              <article className="preview-mail preview-mail-safe">
                <div className="preview-mail-head">
                  <span className="preview-avatar avatar-green">JN</span>
                  <div>
                    <b>Jana Nováková</b>
                    <span>jana.novakova@novaterm.cz</span>
                  </div>
                  <time>08:05</time>
                </div>
                <h3>Zápis z porady 27. 10.</h3>
                <p>V příloze je zápis z pondělní porady. Úkoly pro náš tým jsou na straně 2.</p>
                <span className="preview-link preview-link-safe">
                  <ShieldCheck size={12} /> ověření prošlo · příloha PDF
                </span>
                <span className="preview-stamp stamp-safe">V POŘÁDKU</span>
              </article>
            </motion.div>

            <motion.div
              className="mail-slot mail-slot-3"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.52 }}
            >
              <article className="preview-mail">
                <div className="preview-mail-head">
                  <span className="preview-avatar avatar-violet">PH</span>
                  <div>
                    <b>Pavel Horák</b>
                    <span>pavel.horak.novaterm@gmail.com</span>
                  </div>
                  <time>07:18</time>
                </div>
                <h3>Důvěrné – potřebuji vaši pomoc</h3>
                <p>Nemůžu telefonovat. Potřebuji obratem uhradit fakturu 148 500 Kč.</p>
                <span className="preview-link">
                  <Link2 size={12} /> soukromá adresa · urgentní platba
                </span>
                <span className="preview-stamp stamp-danger">PHISHING</span>
              </article>
            </motion.div>
          </div>

          <div className="hero-visual-footer">
            <span>
              <ScanLine size={14} /> {MAILS.length} zpráv · {SHIFTS.length} směn
            </span>
            <span className="hero-threat-meter">
              <i /> {threatCount} hrozeb
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="title-bottom-bar"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <span>
          <ShieldCheck size={15} /> Učíš se na falešných účtech — žádný skutečný e-mail se neodesílá.
        </span>
        <span className="bottom-bar-tip">
          Tip: <kbd>R</kbd> nahlásit <kbd>O</kbd> v pořádku <kbd>I</kbd> IT
        </span>
      </motion.div>
    </section>
  );
}
