import { Link2, LockKeyhole, ScanLine } from 'lucide-react';

interface StatusBarProps {
  hoverUrl: string | null;
  resolved: boolean;
  hasMail: boolean;
}

export function StatusBar({ hoverUrl, resolved, hasMail }: StatusBarProps) {
  return (
    <footer className="statusbar">
      <span className={`status-message ${hoverUrl ? 'is-link' : ''}`}>
        {hoverUrl ? (
          <>
            <Link2 size={13} />
            <span className="status-url">{hoverUrl}</span>
          </>
        ) : (
          <>
            <ScanLine size={13} />
            {!hasMail ? (
              <span>Vyber zprávu v seznamu a projdi si ji.</span>
            ) : resolved ? (
              <>
                <span className="status-long">
                  Zpráva vyhodnocena. <b>N</b> další zpráva · <b>D</b> technické detaily
                </span>
                <span className="status-short">
                  Hotovo · <b>N</b> další
                </span>
              </>
            ) : (
              <>
                <span className="status-long">
                  Označ stopy, otevři technické detaily nebo si projdi odkazy. <b>R</b> nahlásit ·{' '}
                  <b>O</b> v pořádku · <b>I</b> IT · <b>D</b> detaily
                </span>
                <span className="status-short">
                  <b>R</b> nahlásit · <b>O</b> v pořádku · <b>I</b> IT
                </span>
              </>
            )}
          </>
        )}
      </span>
      <span className="status-secure">
        <LockKeyhole size={12} /> Cvičná simulace
      </span>
    </footer>
  );
}
