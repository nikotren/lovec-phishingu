import type { ReactNode } from 'react';
import { Link2, Paperclip } from 'lucide-react';
import type { Mail, Resolution } from '../game/model';
import { markClassFor } from '../game/marks';
import { QrCode } from './QrCode';

export interface PendingLink {
  kind: 'link' | 'att';
  url: string;
  text: string;
  key: string;
}

interface MailBodyProps {
  mail: Mail;
  marks: string[];
  resolution?: Resolution;
  onMark: (key: string) => void;
  onOpenLink: (pending: PendingLink) => void;
  onHoverUrl: (url: string | null) => void;
}

const INLINE = /\[\[([^|\]]+)\|([^|\]]*)(?:\|([^|\]]*))?(?:\|([^|\]]*))?\]\]|\{\{(\w+)\|([^}]*)\}\}/g;

function withBreaks(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split('\n');
  const nodes: ReactNode[] = [];
  parts.forEach((part, index) => {
    nodes.push(part);
    if (index < parts.length - 1) nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
  });
  return nodes;
}

export function MailBody({ mail, marks, resolution, onMark, onOpenLink, onHoverUrl }: MailBodyProps) {
  const resolved = Boolean(resolution);
  const linkIndex = { value: 0 };

  const parseInline = (text: string, blockIndex: number): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let matchIndex = 0;
    INLINE.lastIndex = 0;

    for (const match of text.matchAll(INLINE)) {
      const index = match.index ?? 0;
      if (index > lastIndex) {
        nodes.push(...withBreaks(text.slice(lastIndex, index), `b${blockIndex}-t${matchIndex}`));
      }

      if (match[1] !== undefined) {
        const url = match[1];
        const linkText = match[2] ?? '';
        const clueKey = match[3];
        const style = match[4];
        const key = clueKey && mail.clues[clueKey] ? clueKey : `l${linkIndex.value++}`;
        const className = `mk-inline ${style === 'btn' ? 'mail-button' : 'mail-link'} ${markClassFor(
          mail,
          marks,
          resolution,
          key,
        )}`;

        if (style === 'qr') {
          nodes.push(
            <button
              key={`qr-${blockIndex}-${matchIndex}`}
              type="button"
              className={`mk-inline qr-mark ${markClassFor(mail, marks, resolution, key)}`}
              onClick={() =>
                onOpenLink({
                  kind: 'link',
                  url,
                  text: linkText || 'QR kód',
                  key,
                })
              }
              onMouseEnter={() => onHoverUrl(url)}
              onMouseLeave={() => onHoverUrl(null)}
              disabled={resolved}
              aria-label={`Otevřít odkaz ukrytý v QR kódu: ${url}`}
            >
              <QrCode seed={url} size={124} />
              <span className="qr-caption">
                <Link2 size={12} /> Naskenovat kód
              </span>
            </button>,
          );
        } else {
          nodes.push(
            <button
              key={`link-${blockIndex}-${matchIndex}`}
              type="button"
              className={className}
              onClick={() => onOpenLink({ kind: 'link', url, text: linkText, key })}
              onMouseEnter={() => onHoverUrl(url)}
              onMouseLeave={() => onHoverUrl(null)}
              disabled={resolved}
            >
              {linkText}
            </button>,
          );
        }
      } else {
        const key = match[5] ?? '';
        const markText = match[6] ?? '';
        nodes.push(
          <button
            key={`mark-${blockIndex}-${matchIndex}`}
            type="button"
            className={`mk-inline mark-token ${markClassFor(mail, marks, resolution, key)}`}
            onClick={() => onMark(key)}
            disabled={resolved}
            aria-pressed={marks.includes(key)}
            title={resolved ? undefined : 'Označit jako podezřelou stopu'}
          >
            {markText}
          </button>,
        );
      }

      lastIndex = index + match[0].length;
      matchIndex += 1;
    }

    if (lastIndex < text.length) {
      nodes.push(...withBreaks(text.slice(lastIndex), `b${blockIndex}-tail`));
    }

    return nodes;
  };

  const blocks = mail.body.split('\n\n');

  return (
    <div className="mail-body">
      {blocks.map((block, blockIndex) => {
        const isQuote = block.startsWith('> ');
        const text = isQuote ? block.slice(2) : block;
        const content = parseInline(text, blockIndex);
        return isQuote ? (
          <blockquote key={`block-${blockIndex}`}>{content}</blockquote>
        ) : (
          <p key={`block-${blockIndex}`}>{content}</p>
        );
      })}

      {mail.att && mail.att.length > 0 && (
        <div className="attachments">
          <span className="attachments-label">
            <Paperclip size={14} /> Přílohy
          </span>
          <div className="attachment-list">
            {mail.att.map((attachment, index) => {
              const key = `att${index}`;
              return (
                <button
                  key={attachment.name}
                  type="button"
                  className={`attachment-chip ${markClassFor(mail, marks, resolution, key)}`}
                  onClick={() =>
                    onOpenLink({
                      kind: 'att',
                      url: `${attachment.name} (${attachment.size})`,
                      text: attachment.name,
                      key,
                    })
                  }
                  disabled={resolved}
                  title={resolved ? undefined : 'Otevřít přílohu'}
                >
                  <span className="attachment-icon">
                    <Paperclip size={15} />
                  </span>
                  <span className="attachment-copy">
                    <b>{attachment.name}</b>
                    <small>{attachment.size}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
