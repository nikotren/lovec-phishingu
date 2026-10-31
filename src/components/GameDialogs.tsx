import { AlertTriangle, BookOpen, Heart, Keyboard, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { Modal } from './Modal';
import { SCORING } from '../game/content';

interface QuitDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function QuitDialog({ open, onCancel, onConfirm }: QuitDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} className="confirm-modal" labelledBy="quit-title">
      <span className="sheet-kicker">Ukončit hru</span>
      <h3 id="quit-title">Opravdu chceš odejít?</h3>
      <p className="sheet-text">
        Rozehraná směna se neukládá. Odznaky, příručka a nejlepší výsledek zůstanou.
      </p>
      <div className="quit-icon-row">
        <span><LogOut size={20} /></span>
        <p>Rozdělanou směnu budeš muset začít znovu.</p>
      </div>
      <div className="sheet-actions">
        <button type="button" className="btn btn-primary" onClick={onCancel}>
          Pokračovat ve hře
        </button>
        <button type="button" className="btn btn-danger-soft" onClick={onConfirm}>
          <LogOut size={16} /> Ukončit hru
        </button>
      </div>
    </Modal>
  );
}

export function HelpDialog({
  open,
  onClose,
  onOpenGuide,
}: {
  open: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="help-modal" labelledBy="help-title">
      <span className="sheet-kicker">Rychlá nápověda</span>
      <h3 id="help-title">Jak hrát Lovce phishingu</h3>
      <div className="help-grid">
        <div className="help-card">
          <span className="help-icon"><BookOpen size={18} /></span>
          <b>1. Prozkoumej zprávu</b>
          <p>Klikni na „Technické detaily“. Sleduj celou adresu za zavináčem, ověření, odkazy a přílohy.</p>
        </div>
        <div className="help-card">
          <span className="help-icon"><Sparkles size={18} /></span>
          <b>2. Označ stopy</b>
          <p>Klikni na podezřelý text, odkaz, adresu nebo přílohu. Každá správná stopa přidá 50 Kč.</p>
        </div>
        <div className="help-card">
          <span className="help-icon"><ShieldCheck size={18} /></span>
          <b>3. Rozhodni</b>
          <p>Nahlas phishing, ponech pravou zprávu, nebo se zeptej IT. IT tě to stojí 250 Kč a jednu ze dvou nápověd.</p>
        </div>
      </div>

      <div className="help-keys">
        <span><Keyboard size={15} /> Klávesové zkratky</span>
        <div>
          <span><kbd>R</kbd> nahlásit</span>
          <span><kbd>O</kbd> v pořádku</span>
          <span><kbd>I</kbd> IT</span>
          <span><kbd>D</kbd> detaily</span>
          <span><kbd>N</kbd> další zpráva</span>
        </div>
      </div>

      <div className="help-scoring">
        <span>Body v kostce</span>
        <div>
          {SCORING.slice(0, 4).map((row) => (
            <span key={row.label}>
              {row.label} <b className="score-pos">{row.value}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="help-trust">
        <Heart size={16} />
        <span>Tři životy důvěry. O všechny přicházíš naletěním na phishing nebo odevzdáním údajů.</span>
      </div>
      <div className="help-foot">
        <AlertTriangle size={13} /> Falešný poplach stojí 300 Kč, ale ne život. Paranoia má svou cenu.
      </div>

      <div className="sheet-actions help-guide-row">
        <button type="button" className="btn btn-ghost" onClick={onOpenGuide}>
          <BookOpen size={16} /> Otevřít příručku
        </button>
        <span className="help-guide-note">Rozehraná směna zůstane rozdělaná.</span>
      </div>
    </Modal>
  );
}
