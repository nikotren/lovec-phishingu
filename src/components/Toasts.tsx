import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, Trophy, X } from 'lucide-react';
import type { Toast } from '../game/model';

function ToastIcon({ tone }: { tone: Toast['tone'] }) {
  if (tone === 'badge') return <Trophy size={18} />;
  if (tone === 'danger') return <AlertTriangle size={18} />;
  if (tone === 'success') return <CheckCircle2 size={18} />;
  return <Info size={18} />;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.tone === 'badge' ? 3800 : 3600);
    return () => window.clearTimeout(timer);
  }, [toast.id, toast.tone, onDismiss]);

  return (
    <motion.div
      className={`toast toast-${toast.tone}`}
      layout
      initial={reduced ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      role="status"
    >
      <span className="toast-icon">
        <ToastIcon tone={toast.tone} />
      </span>
      <span className="toast-message">{toast.message}</span>
      <button type="button" className="toast-dismiss" onClick={() => onDismiss(toast.id)} aria-label="Zavřít oznámení">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
