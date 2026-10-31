import { AlertTriangle, Check, FileWarning, Lock, ShieldAlert, X } from 'lucide-react';
import type { Mail } from '../game/model';
import type { PendingLink } from './MailBody';
import { Modal } from './Modal';

interface TrapBrowserProps {
  open: boolean;
  mail: Mail | null;
  pending: PendingLink | null;
  onClose: () => void;
  onSubmit: () => void;
}

function BrandRow({ name }: { name: string }) {
  return (
    <div className="fake-brand">
      <span className="fake-brand-mark" />
      <b>{name}</b>
      <span className="fake-brand-secure">
        <Lock size={11} /> zabezpečeno
      </span>
    </div>
  );
}

export function TrapBrowser({ open, mail, pending, onClose, onSubmit }: TrapBrowserProps) {
  if (!pending) {
    return <Modal open={false} onClose={onClose}><span /></Modal>;
  }

  const trap = mail?.phish ? mail.trap : undefined;
  const safe = mail?.safe;
  const url = pending.kind === 'att' ? `Soubor: ${pending.url}` : pending.url;

  return (
    <Modal open={open} onClose={onClose} className="browser-modal" hideClose labelledBy="browser-title">
      <div className="browser-window">
        <div className="browser-chrome">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="browser-address">
            <Lock size={12} />
            <span>{url}</span>
          </span>
          <button type="button" className="browser-close" onClick={onClose} aria-label="Zavřít okno">
            <X size={16} />
          </button>
        </div>
        <div className="browser-sim">
          <ShieldAlert size={12} /> Cvičná simulace – nic se nikam neodesílá.
        </div>

        {trap?.kind === 'login' && (
          <div className="browser-page trap-page trap-login">
            <BrandRow name={trap.brand} />
            <h3 id="browser-title">Přihlaste se</h3>
            <p className="trap-sub">Pro pokračování ověřte svůj firemní účet.</p>
            <label htmlFor="trap-email">E-mail</label>
            <input id="trap-email" type="email" value="vy@novaterm.cz" readOnly />
            <label htmlFor="trap-password">Heslo</label>
            <input id="trap-password" type="password" placeholder="Vaše heslo" autoComplete="off" />
            <button type="button" className="fake-submit" onClick={onSubmit}>
              Přihlásit se
            </button>
            <button type="button" className="fake-link" onClick={onClose}>
              Zavřít okno
            </button>
          </div>
        )}

        {trap?.kind === 'card' && (
          <div className="browser-page trap-page trap-card">
            <BrandRow name={trap.brand} />
            <h3 id="browser-title">Zaplaťte {trap.amount}</h3>
            <p className="trap-sub">Platba kartou je zpracována okamžitě.</p>
            <label htmlFor="trap-card">Číslo karty</label>
            <input id="trap-card" placeholder="1234 5678 9012 3456" autoComplete="off" />
            <div className="trap-grid">
              <div>
                <label htmlFor="trap-expiry">Platnost</label>
                <input id="trap-expiry" placeholder="MM/RR" autoComplete="off" />
              </div>
              <div>
                <label htmlFor="trap-cvv">CVV</label>
                <input id="trap-cvv" placeholder="123" autoComplete="off" />
              </div>
            </div>
            <button type="button" className="fake-submit" onClick={onSubmit}>
              Zaplatit {trap.amount}
            </button>
            <button type="button" className="fake-link" onClick={onClose}>
              Zavřít okno
            </button>
          </div>
        )}

        {trap?.kind === 'macro' && (
          <div className="browser-page trap-page trap-macro">
            <BrandRow name={trap.brand} />
            <h3 id="browser-title">Zabezpečené zobrazení</h3>
            <div className="macro-warning">
              <FileWarning size={18} />
              <span>Soubor pochází z internetu. Pro zobrazení povolte úpravy a makra.</span>
            </div>
            <div className="fake-doc" aria-hidden="true">
              <span style={{ width: '58%' }} />
              <span />
              <span style={{ width: '88%' }} />
              <span style={{ width: '74%' }} />
              <span />
            </div>
            <button type="button" className="fake-submit" onClick={onSubmit}>
              Povolit úpravy a makra
            </button>
            <button type="button" className="fake-link" onClick={onClose}>
              Zavřít soubor
            </button>
          </div>
        )}

        {!trap && (
          <div className="browser-page safe-page" id="browser-title">
            <span className="safe-check">
              <Check size={26} />
            </span>
            <span className="safe-kicker">Odkaz je v pořádku</span>
            <h3>{safe?.title ?? pending.text}</h3>
            <p>{safe?.text ?? 'Stránka se načetla bez problémů. Žádné přihlašovací údaje se neodesílají.'}</p>
            <div className="safe-banner">
              <Check size={14} /> Doména i kontext odpovídají legitimní zprávě.
            </div>
            <button type="button" className="fake-submit safe-submit" onClick={onClose}>
              Zavřít okno
            </button>
          </div>
        )}

        {trap && (
          <div className="browser-demo-note">
            <AlertTriangle size={12} /> Tohle je falešná stránka. Všímej si adresy a toho, co po tobě chce.
          </div>
        )}
      </div>
    </Modal>
  );
}
