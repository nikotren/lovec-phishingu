import { useEffect, useRef, useState, type Dispatch } from 'react';
import type { Action, Profile, RunState } from '../game/model';
import { BY_ID } from '../game/content';
import { Hud } from '../components/Hud';
import { Rail } from '../components/Rail';
import { MailList } from '../components/MailList';
import { MailReader } from '../components/MailReader';
import { StatusBar } from '../components/StatusBar';
import { LinkSheet } from '../components/LinkSheet';
import { TrapBrowser } from '../components/TrapBrowser';
import { HelpDialog, QuitDialog } from '../components/GameDialogs';
import type { PendingLink } from '../components/MailBody';

interface GameScreenProps {
  run: RunState;
  profile: Profile;
  dispatch: Dispatch<Action>;
}

type ModalState =
  | { kind: 'link'; pending: PendingLink }
  | { kind: 'browser'; pending: PendingLink }
  | { kind: 'quit' }
  | { kind: 'help' }
  | null;

export function GameScreen({ run, profile, dispatch }: GameScreenProps) {
  const [mobileReading, setMobileReading] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [hoverUrl, setHoverUrl] = useState<string | null>(null);
  const openTimer = useRef<number | null>(null);

  const mail = run.sel === null ? null : (BY_ID[run.sel] ?? null);
  const resolution = mail ? run.res[mail.id] : undefined;
  const marks = mail ? (run.marks[mail.id] ?? []) : [];
  const pending = modal && (modal.kind === 'link' || modal.kind === 'browser') ? modal.pending : null;
  const linkMarked = Boolean(pending && marks.includes(pending.key));

  useEffect(() => {
    setHoverUrl(null);
  }, [run.sel]);

  useEffect(
    () => () => {
      if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    },
    [],
  );

  const openLink = (nextPending: PendingLink) => {
    if (!mail || resolution || run.over) return;
    setHoverUrl(null);
    setModal({ kind: 'link', pending: nextPending });
  };

  const openBrowserFromSheet = () => {
    if (!mail || !modal || modal.kind !== 'link') return;
    const nextPending = modal.pending;
    dispatch({ type: 'LINK_OPENED', id: mail.id });
    setModal(null);
    if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => {
      setModal({ kind: 'browser', pending: nextPending });
      openTimer.current = null;
    }, 130);
  };

  const closeBrowser = () => {
    setModal(null);
    dispatch({ type: 'TRAP_CLOSED' });
  };

  const submitTrap = () => {
    if (!mail) return;
    setModal(null);
    dispatch({ type: 'COMPROMISE', id: mail.id });
  };

  const markFromSheet = () => {
    if (!pending) return;
    dispatch({ type: 'TOGGLE_MARK', key: pending.key });
    setModal(null);
  };

  const selectMail = (id: number) => {
    dispatch({ type: 'SELECT', id });
    setMobileReading(true);
  };

  const goNext = () => {
    setModal(null);
    dispatch({ type: 'NEXT' });
  };

  return (
    <div className="game-page">
      <div className="game-shell" data-mobile-reading={mobileReading ? 'true' : 'false'}>
        <Hud
          run={run}
          profile={profile}
          dispatch={dispatch}
          onHelp={() => setModal({ kind: 'help' })}
          onQuit={() => setModal({ kind: 'quit' })}
        />

        <div className="game-client">
          <Rail run={run} profile={profile} />
          <MailList run={run} onSelect={selectMail} onFinish={goNext} />
          <MailReader
            key={mail?.id ?? 'empty'}
            run={run}
            mail={mail}
            dispatch={dispatch}
            onBack={() => setMobileReading(false)}
            onOpenLink={openLink}
            onHoverUrl={setHoverUrl}
            onNext={goNext}
          />
        </div>

        <StatusBar
          hoverUrl={hoverUrl}
          hasMail={Boolean(mail)}
          resolved={Boolean(mail && run.res[mail.id])}
        />
      </div>

      <LinkSheet
        open={modal?.kind === 'link'}
        pending={modal?.kind === 'link' ? modal.pending : null}
        mail={mail}
        marked={linkMarked}
        onClose={() => setModal(null)}
        onOpen={openBrowserFromSheet}
        onToggleMark={markFromSheet}
      />

      <TrapBrowser
        open={modal?.kind === 'browser'}
        mail={mail}
        pending={modal?.kind === 'browser' ? modal.pending : null}
        onClose={closeBrowser}
        onSubmit={submitTrap}
      />

      <QuitDialog
        open={modal?.kind === 'quit'}
        onCancel={() => setModal(null)}
        onConfirm={() => {
          setModal(null);
          dispatch({ type: 'GO_TITLE' });
        }}
      />

      <HelpDialog
        open={modal?.kind === 'help'}
        onClose={() => setModal(null)}
        onOpenGuide={() => {
          setModal(null);
          dispatch({ type: 'ARCHIVE' });
        }}
      />
    </div>
  );
}
