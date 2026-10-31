import type { Dispatch } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import type { Action, Profile, Tab } from '../game/model';
import { BADGES, TYPES, TYPE_KEYS } from '../game/content';
import { kc } from '../game/format';

interface ArchiveScreenProps {
  profile: Profile;
  tab: Tab;
  confirmReset: boolean;
  dispatch: Dispatch<Action>;
}

const TABS: Array<{ id: Tab; label: string; icon: typeof BookOpen }> = [
  { id: 'lib', label: 'Příručka', icon: BookOpen },
  { id: 'badges', label: 'Odznaky', icon: Award },
  { id: 'stats', label: 'Statistiky', icon: BarChart3 },
];

function accuracyFor(profile: Profile, key: string): { percent: number; ok: number; n: number } | null {
  const stat = profile.ts[key];
  if (!stat || !stat.n) return null;
  return { percent: Math.round((100 * stat.ok) / stat.n), ok: stat.ok, n: stat.n };
}

function LibraryTab({ profile }: { profile: Profile }) {
  const reduced = useReducedMotion();
  const unlocked = Object.keys(profile.unlocked).length;
  return (
    <div className="library-tab">
      <div className="library-progress">
        <div>
          <span className="panel-kicker">Odemčené kapitoly</span>
          <b>
            {unlocked} / {TYPE_KEYS.length}
          </b>
        </div>
        <div className="library-progress-bar">
          <span style={{ width: `${(unlocked / TYPE_KEYS.length) * 100}%` }} />
        </div>
        <p>Kapitoly se odemykají, když u daného typu zprávy poprvé rozhodneš.</p>
      </div>

      <div className="library-grid">
        {TYPE_KEYS.map((key) => {
          const type = TYPES[key];
          const isUnlocked = Boolean(profile.unlocked[key]);
          const accuracy = accuracyFor(profile, key);
          return (
            <motion.article
              key={key}
              className={`library-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}
              layout
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="library-card-head">
                <span className="library-glyph">{isUnlocked ? type.g : '?'}</span>
                <div>
                  <h3>{isUnlocked ? type.n : 'Zamčená kapitola'}</h3>
                  <span className="library-status">
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 size={12} /> odemčeno
                        {accuracy && <> · {accuracy.percent} % ({accuracy.ok}/{accuracy.n})</>}
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={12} /> čeká na první setkání
                      </>
                    )}
                  </span>
                </div>
              </div>

              {isUnlocked ? (
                <>
                  <p className="library-desc">{type.s}</p>
                  <ul className="library-signs">
                    {type.signs.map((sign) => (
                      <li key={sign}>{sign}</li>
                    ))}
                  </ul>
                  <div className="library-do">
                    <b>Co dělat:</b> {type.do}
                  </div>
                </>
              ) : (
                <p className="library-desc library-locked-text">
                  Tento typ podvodu se ti ještě nepřiřadil. Až ho poprvé vyhodnotíš, kapitola se sama odemkne.
                </p>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function BadgesTab({ profile }: { profile: Profile }) {
  const reduced = useReducedMotion();
  return (
    <div className="badges-tab">
      <div className="badges-summary">
        <span className="badges-summary-icon"><Trophy size={20} /></span>
        <div>
          <b>
            {Object.keys(profile.badges).length} / {BADGES.length} odznaků
          </b>
          <span>Každý odznak je důkaz, že se ti něco povedlo. Ne všechny jdou získat v jedné hře.</span>
        </div>
      </div>
      <div className="badges-grid">
        {BADGES.map((badge, index) => {
          const earnedAt = profile.badges[badge.id];
          const earned = Boolean(earnedAt);
          return (
            <motion.article
              key={badge.id}
              className={`badge-card ${earned ? 'is-earned' : 'is-locked'}`}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
            >
              <span className="badge-medal">{earned ? <Award size={22} /> : <LockKeyhole size={20} />}</span>
              <div>
                <b>{badge.n}</b>
                <p>{badge.d}</p>
                <span className="badge-date">
                  {earned ? `Získáno ${new Date(earnedAt).toLocaleDateString('cs-CZ')}` : 'Zatím nezískáno'}
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function StatsTab({ profile, confirmReset, dispatch }: { profile: Profile; confirmReset: boolean; dispatch: Dispatch<Action> }) {
  const entries = TYPE_KEYS.map((key) => ({ key, type: TYPES[key], stat: profile.ts[key] })).filter(
    (entry) => entry.stat && entry.stat.n > 0,
  );
  const totalN = entries.reduce((sum, entry) => sum + (entry.stat?.n ?? 0), 0);
  const totalOk = entries.reduce((sum, entry) => sum + (entry.stat?.ok ?? 0), 0);
  const overall = totalN ? Math.round((100 * totalOk) / totalN) : 0;

  return (
    <div className="stats-tab">
      <div className="stats-kpis">
        <div className="stats-kpi">
          <span><BarChart3 size={17} /> Dokončené hry</span>
          <b>{profile.runs}</b>
        </div>
        <div className="stats-kpi">
          <span><TrendingUp size={17} /> Celková úspěšnost</span>
          <b>{overall} %</b>
        </div>
        <div className="stats-kpi">
          <span><Trophy size={17} /> Nejlepší kasa</span>
          <b>{kc(profile.best)}</b>
        </div>
        <div className="stats-kpi">
          <span><Sparkles size={17} /> Odznaky</span>
          <b>{Object.keys(profile.badges).length}<small>/{BADGES.length}</small></b>
        </div>
      </div>

      <div className="stats-detail-head">
        <div>
          <span className="panel-kicker">Přesnost podle typu</span>
          <h3>Kde jsi silný a kde máš rezervy</h3>
        </div>
        <span className="stats-sample">
          <ShieldCheck size={14} /> {totalN} rozhodnutí
        </span>
      </div>

      {entries.length > 0 ? (
        <div className="type-stats">
          {entries.map(({ key, type, stat }) => {
            const percent = Math.round((100 * (stat?.ok ?? 0)) / (stat?.n ?? 1));
            const tone = percent >= 80 ? 'good' : percent >= 50 ? 'warn' : 'bad';
            return (
              <div key={key} className={`type-stat type-stat-${tone}`}>
                <div className="type-stat-label">
                  <span className="type-stat-glyph">{type?.g ?? '?'}</span>
                  <span>
                    <b>{type?.n ?? key}</b>
                    <small>
                      {stat?.ok ?? 0} z {stat?.n ?? 0} správně
                    </small>
                  </span>
                </div>
                <div className="type-stat-bar">
                  <span style={{ width: `${percent}%` }} />
                </div>
                <b className="type-stat-value">{percent} %</b>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="stats-empty">
          <BarChart3 size={36} />
          <h3>Zatím žádná data</h3>
          <p>Odehraj první směnu a statistiky se začnou plnit. Ukládají se jen v tomto prohlížeči.</p>
        </div>
      )}

      <div className="stats-note">
        <AlertTriangle size={14} />
        <span>
          Statistiky počítají jen rozhodnutí u zpráv. Dotazy na IT a pouhé otevření odkazu se do
          úspěšnosti nezahrnují, ale ovlivňují konečnou kasu, hodnost a odznaky. Odevzdání údajů na
          falešné stránce se do úspěšnosti počítá jako chyba.
        </span>
      </div>

      <div className={`reset-zone ${confirmReset ? 'is-confirming' : ''}`}>
        <div>
          <b>{confirmReset ? 'Opravdu všechno smazat?' : 'Smazat uložený postup'}</b>
          <p>
            {confirmReset
              ? 'Odznaky, příručka i statistiky zmizí. Tuhle akci nejde vrátit.'
              : 'Smaže odznaky, odemčené kapitoly i statistiky. Jméno a zvuk zůstanou.'}
          </p>
        </div>
        <button
          type="button"
          className={`btn ${confirmReset ? 'btn-danger' : 'btn-ghost'}`}
          onClick={() => dispatch({ type: 'RESET_PROGRESS' })}
        >
          {confirmReset ? <AlertTriangle size={16} /> : <RotateCcw size={16} />}
          {confirmReset ? 'Ano, smazat' : 'Smazat postup'}
        </button>
      </div>
    </div>
  );
}

export function ArchiveScreen({ profile, tab, confirmReset, dispatch }: ArchiveScreenProps) {
  const reduced = useReducedMotion();
  const unlocked = Object.keys(profile.unlocked).length;
  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <section className="archive-screen">
      <motion.div
        className="glass-card archive-card"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="archive-head">
          <div>
            <div className="eyebrow">
              <span className="live-dot" /> Osobní archiv
            </div>
            <h1>Archiv lovce</h1>
            <p>
              Příručka, odznaky a čísla z tvých směn. Všechno, co ti pomůže být příště o krok napřed.
            </p>
          </div>
          <div className="archive-summary">
            <div>
              <span>Příručka</span>
              <b>
                {unlocked}<small>/{TYPE_KEYS.length}</small>
              </b>
            </div>
            <div>
              <span>Odznaky</span>
              <b>
                {Object.keys(profile.badges).length}<small>/{BADGES.length}</small>
              </b>
            </div>
            <div>
              <span>Nejlepší kasa</span>
              <b className="archive-best">{profile.runs ? kc(profile.best) : '—'}</b>
            </div>
          </div>
        </div>

        <div className="archive-tabs" role="tablist" aria-label="Archiv">
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={`archive-tab ${tab === item.id ? 'is-active' : ''}`}
                onClick={() => dispatch({ type: 'TAB', tab: item.id })}
              >
                <Icon size={16} /> {item.label}
                {item.id === 'lib' && <span>{unlocked}</span>}
                {item.id === 'badges' && <span>{Object.keys(profile.badges).length}</span>}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab.id}
            role="tabpanel"
            aria-label={activeTab.label}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'lib' && <LibraryTab profile={profile} />}
            {tab === 'badges' && <BadgesTab profile={profile} />}
            {tab === 'stats' && <StatsTab profile={profile} confirmReset={confirmReset} dispatch={dispatch} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
