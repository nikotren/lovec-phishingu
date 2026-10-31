import { ExternalLink, Flag, Paperclip, ScanLine } from 'lucide-react';
import type { Mail } from '../game/model';
import type { PendingLink } from './MailBody';
import { Modal } from './Modal';

interface LinkSheetProps {
  open: boolean;
  pending: PendingLink | null;
  mail: Mail | null;
  marked: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggleMark: () => void;
}

function HostHighlight({ url }: { url: string }) {
  const match = url.match(/^(https?:\/\/)([^/]+)(.*)$/);
  if (!match) return <code>{url}</code>;
  return (
    <code>
      {match[1]}
      <b>{match[2]}</b>
      {match[3]}
    </code>
  );
}

export function LinkSheet({ open, pending, mail, marked, onClose, onOpen, onToggleMark }: LinkSheetProps) {
  const isAttachment = pending?.kind === 'att';
  return (
    <Modal open={open && Boolean(pending)} onClose={onClose} className="link-sheet" labelledBy="link-sheet-title">
      {pending && (
        <>
          <span className="sheet-kicker">{isAttachment ? 'Příloha' : 'Odkaz'}</span>
          <h3 id="link-sheet-title">{isAttachment ? 'Otevřít přílohu?' : 'Kam vede tento odkaz?'}</h3>
          <p className="sheet-text">
            {isAttachment ? 'Soubor: ' : 'Zobrazený text: '}
            <strong>„{pending.text}“</strong>
          </p>

          <div className={`url-card ${isAttachment ? 'is-file' : ''}`}>
            <span className="url-card-label">
              {isAttachment ? <Paperclip size={14} /> : <ScanLine size={14} />}
              {isAttachment ? 'Soubor' : 'Skutečná adresa'}
            </span>
            {isAttachment ? <code>{pending.url}</code> : <HostHighlight url={pending.url} />}
            {!isAttachment && <small>Doména zvýrazněná tučně je ta, kam odkaz skutečně vede.</small>}
          </div>

          {mail && (
            <div className="sheet-context">
              <span>
                Odesílatel <b>{mail.from.n}</b>
              </span>
              <span className="sheet-context-divider" />
              <span>{mail.from.a}</span>
            </div>
          )}

          <div className="sheet-actions">
            <button type="button" className="btn btn-primary" onClick={onOpen}>
              <ExternalLink size={16} /> {isAttachment ? 'Otevřít přílohu' : 'Otevřít odkaz'}
            </button>
            <button type="button" className={`btn ${marked ? 'btn-ghost' : 'btn-danger-soft'}`} onClick={onToggleMark}>
              <Flag size={16} /> {marked ? 'Odznačit stopu' : 'Označit jako podezřelé'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Zrušit
            </button>
          </div>
          <p className="sheet-note">
            Otevření stránky je jen simulace. V reálném světě bys teď mohl skončit na cizím webu.
          </p>
        </>
      )}
    </Modal>
  );
}
