import { useCallback, useEffect, useReducer, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { gameReducer, createInitialState } from './game/reducer';
import { playSfx, unlockAudio } from './game/audio';
import { saveProfile } from './game/storage';
import { SHIFTS } from './game/content';
import { Background } from './components/Background';
import { TopBar } from './components/TopBar';
import { Toasts } from './components/Toasts';
import { TitleScreen } from './screens/TitleScreen';
import { BriefScreen } from './screens/BriefScreen';
import { GameScreen } from './screens/GameScreen';
import { ShiftEndScreen } from './screens/ShiftEndScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { FinalScreen } from './screens/FinalScreen';
import { ArchiveScreen } from './screens/ArchiveScreen';

const CONFETTI_COLORS = ['#ff6b4a', '#ffc857', '#35e0a1', '#5ec8ff', '#ffffff'];
const CONFETTI_WIN_COLORS = ['#ffc857', '#ff9a72', '#35e0a1', '#5ec8ff', '#ffffff'];

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const reduced = useReducedMotion();
  const playedSound = useRef(0);
  const playedFx = useRef(0);
  const shakeTimer = useRef<number | null>(null);
  const dismissToast = useCallback((id: number) => dispatch({ type: 'DISMISS_TOAST', id }), []);

  useEffect(() => {
    saveProfile(state.profile);
  }, [state.profile]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.profile.theme);
    document.documentElement.style.colorScheme = state.profile.theme;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = state.profile.theme === 'dark' ? '#060c14' : '#e8eef4';
  }, [state.profile.theme]);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!state.sound || state.sound.id === playedSound.current) return;
    playedSound.current = state.sound.id;
    const muted = state.profile.muted;
    const timers = state.sound.names.map((name, index) =>
      window.setTimeout(() => playSfx(name, muted), index * 95),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [state.sound, state.profile.muted]);

  useEffect(() => {
    if (!state.fx || state.fx.id === playedFx.current) return;
    playedFx.current = state.fx.id;
    if (reduced) return;

    if (state.fx.type === 'danger') {
      document.documentElement.classList.remove('fx-shake');
      // Restart the animation even when two bad decisions come quickly.
      void document.documentElement.offsetWidth;
      document.documentElement.classList.add('fx-shake');
      if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
      shakeTimer.current = window.setTimeout(() => {
        document.documentElement.classList.remove('fx-shake');
        shakeTimer.current = null;
      }, 520);
      return;
    }

    if (state.fx.type === 'good') {
      confetti({
        particleCount: 38,
        spread: 58,
        startVelocity: 26,
        ticks: 120,
        scalar: 0.8,
        origin: { y: 0.78 },
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
      });
      return;
    }

    if (state.fx.type === 'complete') {
      confetti({
        particleCount: 120,
        spread: 78,
        startVelocity: 34,
        ticks: 190,
        scalar: 0.9,
        origin: { y: 0.6 },
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
      });
      return;
    }

    if (state.fx.type === 'win') {
      window.setTimeout(() => {
        confetti({
          particleCount: 55,
          angle: 60,
          spread: 52,
          startVelocity: 34,
          scalar: 0.72,
          origin: { x: 0, y: 0.72 },
          colors: CONFETTI_WIN_COLORS,
          disableForReducedMotion: true,
        });
      }, 220);
      window.setTimeout(() => {
        confetti({
          particleCount: 55,
          angle: 120,
          spread: 52,
          startVelocity: 34,
          scalar: 0.72,
          origin: { x: 1, y: 0.72 },
          colors: CONFETTI_WIN_COLORS,
          disableForReducedMotion: true,
        });
      }, 360);
      window.setTimeout(() => {
        confetti({
          particleCount: 36,
          spread: 80,
          startVelocity: 24,
          scalar: 0.68,
          origin: { y: 0.32 },
          colors: CONFETTI_WIN_COLORS,
          disableForReducedMotion: true,
        });
      }, 520);
    }
  }, [state.fx, reduced]);

  useEffect(() => {
    const titles: Record<string, string> = {
      title: 'Lovec phishingu — herní simulace',
      brief: state.run ? `Briefing · směna ${state.run.shift + 1}/${SHIFTS.length} — Lovec phishingu` : 'Lovec phishingu',
      game: state.run ? `Směna ${state.run.shift + 1}/${SHIFTS.length} — Lovec phishingu` : 'Lovec phishingu',
      shiftEnd: 'Směna dokončena — Lovec phishingu',
      over: 'Směna přerušena — Lovec phishingu',
      final: 'Certifikát — Lovec phishingu',
      archive: 'Archiv lovce — Lovec phishingu',
    };
    document.title = titles[state.view] ?? 'Lovec phishingu';
  }, [state.view, state.run?.shift]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [state.view]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (state.view !== 'game' || !state.run) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) {
        return;
      }
      if (document.querySelector('[aria-modal="true"]')) return;

      const key = event.key.toLowerCase();
      if (key === 'r') {
        event.preventDefault();
        dispatch({ type: 'DECIDE', act: 'report' });
      } else if (key === 'o') {
        event.preventDefault();
        dispatch({ type: 'DECIDE', act: 'ok' });
      } else if (key === 'i') {
        event.preventDefault();
        dispatch({ type: 'DECIDE', act: 'it' });
      } else if (key === 'd') {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_DETAILS' });
      } else if (
        key === 'n' &&
        state.run.sel !== null &&
        Boolean(state.run.res[state.run.sel])
      ) {
        event.preventDefault();
        dispatch({ type: 'NEXT' });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.view, state.run]);

  useEffect(
    () => () => {
      if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
    },
    [],
  );

  const topbarActions =
    state.view === 'title' ? (
      <button
        type="button"
        className="topbar-action"
        onClick={() => dispatch({ type: 'ARCHIVE' })}
        aria-label="Příručka a odznaky"
        title="Příručka a odznaky"
      >
        <BookOpen size={16} /> <span>Příručka a odznaky</span>
      </button>
    ) : state.view === 'archive' ? (
      <button
        type="button"
        className="topbar-action"
        onClick={() => dispatch({ type: 'BACK_FROM_ARCHIVE' })}
        aria-label={
          state.archiveReturn === 'game'
            ? 'Zpět do hry'
            : state.archiveReturn === 'final'
              ? 'Zpět na certifikát'
              : 'Zpět do menu'
        }
        title={
          state.archiveReturn === 'game'
            ? 'Zpět do hry'
            : state.archiveReturn === 'final'
              ? 'Zpět na certifikát'
              : 'Zpět do menu'
        }
      >
        <ArrowLeft size={16} />{' '}
        <span>
          {state.archiveReturn === 'game'
            ? 'Zpět do hry'
            : state.archiveReturn === 'final'
              ? 'Zpět na certifikát'
              : 'Zpět do menu'}
        </span>
      </button>
    ) : null;

  const note =
    state.view === 'title'
      ? 'cvičný režim'
      : state.view === 'brief'
        ? 'briefing'
        : state.view === 'shiftEnd'
          ? 'směna hotova'
          : state.view === 'over'
            ? 'směna přerušena'
            : state.view === 'final'
              ? 'certifikát'
              : state.view === 'archive'
                ? 'osobní archiv'
                : undefined;

  let content: ReactNode = null;
  if (state.view === 'title') {
    content = <TitleScreen profile={state.profile} dispatch={dispatch} onArchive={() => dispatch({ type: 'ARCHIVE' })} />;
  } else if (state.view === 'archive') {
    content = (
      <ArchiveScreen
        profile={state.profile}
        tab={state.tab}
        confirmReset={state.confirmReset}
        dispatch={dispatch}
      />
    );
  } else if (!state.run) {
    content = <TitleScreen profile={state.profile} dispatch={dispatch} onArchive={() => dispatch({ type: 'ARCHIVE' })} />;
  } else if (state.view === 'brief') {
    content = <BriefScreen run={state.run} dispatch={dispatch} />;
  } else if (state.view === 'shiftEnd') {
    content = <ShiftEndScreen run={state.run} dispatch={dispatch} />;
  } else if (state.view === 'over') {
    content = <GameOverScreen run={state.run} dispatch={dispatch} />;
  } else if (state.view === 'final') {
    content = <FinalScreen run={state.run} profile={state.profile} dispatch={dispatch} />;
  }

  return (
    <div className={`app app-${state.view}`}>
      <Background />

      {state.view === 'game' && state.run ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key="game"
            className="game-stage"
            initial={reduced ? false : { opacity: 0, scale: 0.992 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <GameScreen run={state.run} profile={state.profile} dispatch={dispatch} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="app-page">
          <TopBar
            theme={state.profile.theme}
            muted={state.profile.muted}
            onToggleTheme={() =>
              dispatch({ type: 'SET_THEME', theme: state.profile.theme === 'dark' ? 'light' : 'dark' })
            }
            onToggleMute={() => dispatch({ type: 'TOGGLE_MUTE' })}
            actions={topbarActions}
            note={note}
            noteTone={state.view === 'over' ? 'danger' : 'default'}
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={state.view}
              className={`screen-stage screen-${state.view}`}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {content}
            </motion.main>
          </AnimatePresence>

          <footer className="site-footer">
            <span>Lovec phishingu · výuková simulace pro Novaterm</span>
            <span>Fiktivní e-maily · data zůstávají v prohlížeči</span>
          </footer>
        </div>
      )}

      <Toasts toasts={state.toasts} onDismiss={dismissToast} />
    </div>
  );
}
